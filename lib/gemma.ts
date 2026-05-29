const API_KEY = process.env.GEMINI_API_KEY || "";
const MODEL_NAME = "gemma-4-31b-it";

interface GemmaResponse {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
  }[];
}

export interface JournalAnalysis {
  emotions: string[];
  triggers: string[];
  distortions: { name: string; explanation: string }[];
  reframing: { original: string; reframed: string }[];
  affirmation: string;
  copingSteps: string[];
}

interface GemmaPayload {
  contents: {
    parts: { text: string }[];
  }[];
  generationConfig: {
    temperature: number;
    maxOutputTokens: number;
  };
  systemInstruction?: {
    parts: { text: string }[];
  };
}

async function getGcpAccessToken(): Promise<string | null> {
  if (process.env.VERTEX_AI_ACCESS_TOKEN) {
    return process.env.VERTEX_AI_ACCESS_TOKEN;
  }

  try {
    const res = await fetch(
      "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token",
      {
        headers: { "Metadata-Flavor": "Google" },
        signal: AbortSignal.timeout(1000),
      }
    );
    if (res.ok) {
      const data = await res.json() as { access_token: string };
      return data.access_token;
    }
  } catch {
    // Not running on GCP or metadata service unreachable
  }
  return null;
}

export async function callGemma(prompt: string, systemInstruction?: string): Promise<string> {
  // 1. If VERTEX_AI_ENDPOINT is configured, leverage GCP Vertex AI serving
  if (process.env.VERTEX_AI_ENDPOINT) {
    try {
      const url = process.env.VERTEX_AI_ENDPOINT;
      const token = await getGcpAccessToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Check if endpoint is OpenAI-compatible (common for vLLM on Vertex AI)
      if (url.includes("/chat/completions")) {
        const messages: { role: "system" | "user"; content: string }[] = [];
        if (systemInstruction) {
          messages.push({ role: "system", content: systemInstruction });
        }
        messages.push({ role: "user", content: prompt });

        const payload = {
          messages,
          temperature: 0.7,
          max_tokens: 2048,
        };

        const res = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error(`Vertex AI vLLM error: ${res.statusText}`);
        const data = await res.json() as { choices: { message: { content: string } }[] };
        return data.choices?.[0]?.message?.content || "";
      } else {
        // Fall back to standard Vertex AI raw prediction payload
        const promptString = systemInstruction 
          ? `System: ${systemInstruction}\n\nUser: ${prompt}` 
          : prompt;

        const payload = {
          instances: [{ prompt: promptString }],
          parameters: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        };

        const res = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error(`Vertex AI Predict error: ${res.statusText}`);
        const data = await res.json() as { predictions: { content: string }[] | string[] };
        const pred = data.predictions?.[0];
        if (pred && typeof pred === "object" && "content" in pred) {
          return pred.content;
        }
        if (pred && typeof pred === "string") {
          return pred;
        }
        return "";
      }
    } catch (error) {
      console.error("Vertex AI call failed, falling back to Google AI Studio:", error);
    }
  }

  // 2. Default to Google AI Studio (Gemini API) using GEMINI_API_KEY
  if (!API_KEY) {
    console.warn("GEMINI_API_KEY is not configured in the environment.");
    throw new Error("Gemma 4 service is currently unavailable (API key missing).");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

  const payload: GemmaPayload = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    }
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gemma 4 API error:", errorText);
    throw new Error(`Gemma 4 API call failed: ${response.statusText}`);
  }

  const data = (await response.json()) as GemmaResponse;
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Invalid response received from Gemma 4 API.");
  }

  return text;
}

export async function analyzeJournal(content: string): Promise<JournalAnalysis> {
  const systemInstruction = 
    "You are an expert cognitive behavioral therapist (CBT) and empathetic mental health guide powered by Google's Gemma 4. " +
    "Analyze the user's journal entry. Identify emotions, triggers, cognitive distortions (such as catastrophizing, black-and-white thinking, mind reading, emotional reasoning, overgeneralization), " +
    "provide cognitive reframing (realistic, balanced thoughts), a warm affirmation, and 2-3 specific actionable coping tasks (e.g. breathing exercises, sensory grounding, small habits). " +
    "You MUST respond in a strict, valid JSON format matching the schema below. Do not include any markdown block backticks (like ```json) or explanations outside the JSON object.";

  const schemaInstruction = `
  Schema:
  {
    "emotions": ["emotion1", "emotion2"],
    "triggers": ["trigger1", "trigger2"],
    "distortions": [
      { "name": "Cognitive Distortion Name", "explanation": "Why this thought is a distortion" }
    ],
    "reframing": [
      { "original": "Original distorted/negative thought from the entry", "reframed": "Realistic, balanced alternative perspective" }
    ],
    "affirmation": "An empathetic, validation-filled personal affirmation.",
    "copingSteps": ["Specific step 1", "Specific step 2"]
  }

  User's Journal Entry:
  "${content.replace(/"/g, '\\"')}"
  `;

  try {
    const rawResult = await callGemma(schemaInstruction, systemInstruction);
    // Clean potential markdown code fence markers if Gemma included them despite instructions
    const cleanJsonText = rawResult
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanJsonText) as JournalAnalysis;
  } catch (error) {
    console.error("Failed to parse journal analysis JSON:", error);
    // Return a structured fallback analysis if AI or JSON parsing fails
    return {
      emotions: ["Overwhelmed", "Reflective"],
      triggers: ["Daily stress"],
      distortions: [],
      reframing: [
        {
          original: "Everything is too much right now.",
          reframed: "I am facing challenges, but I can navigate them one step at a time."
        }
      ],
      affirmation: "You did an amazing job writing down your thoughts. Putting feelings into words is a powerful first step toward processing them.",
      copingSteps: [
        "Try a 5-minute Box Breathing exercise (4s inhale, 4s hold, 4s exhale, 4s hold).",
        "Take a short walk without looking at your screen.",
        "List 3 small things that went well or brought you peace today."
      ]
    };
  }
}

export async function chatWithGemma(
  messages: { role: "user" | "model"; content: string }[],
  focusArea: string
): Promise<string> {
  let promptContext = "";
  
  switch (focusArea) {
    case "cbt":
      promptContext = "Focus on Cognitive Behavioral Therapy (CBT). Help the user identify and reframe negative thoughts, emotional reasoning, or unhelpful thinking patterns.";
      break;
    case "grounding":
      promptContext = "Focus on immediate anxiety, panic, or stress relief. Suggest grounding techniques (like 5-4-3-2-1 method, sensory awareness) and guides them in breathwork.";
      break;
    case "gratitude":
      promptContext = "Focus on appreciation, positive psychology, and gratitude. Help the user discover positive aspects of their day and foster contentment.";
      break;
    case "self-compassion":
      promptContext = "Focus on self-compassion, self-kindness, and releasing self-judgment. Reassure them that they are doing their best and validate their feelings.";
      break;
    default:
      promptContext = "Provide empathetic, general mental wellness coaching and guidance.";
  }

  const systemInstruction = 
    `You are an advanced AI mental health coach called Gemma 4 Sanctuary, developed natively using Google's Gemma 4 architecture. ` +
    `Your goal is to offer compassionate, professional, and science-backed support. ${promptContext} ` +
    `Important rules:\n` +
    `1. NEVER give medical or psychiatric diagnoses. If the user presents self-harm thoughts, strongly encourage them to contact emergency services or a crisis helpline.\n` +
    `2. Be warm, non-judgmental, and clear.\n` +
    `3. Do not give generic, cliché answers. Personalize your guidance based on their input.\n` +
    `4. Keep responses relatively concise and easy to read (use lists, bold text where helpful).`;

  // Format history as a single text block since Gemma 4 is instruction-tuned and expects structured history
  let conversationText = "";
  for (const msg of messages) {
    const roleName = msg.role === "user" ? "User" : "Gemma 4 Sanctuary";
    conversationText += `${roleName}: ${msg.content}\n\n`;
  }
  conversationText += "Gemma 4 Sanctuary: ";

  return callGemma(conversationText, systemInstruction);
}

export async function generateSleepcast(
  worryText: string,
  theme: string,
  style: string
): Promise<string> {
  const systemInstruction = 
    "You are a professional sleep guide and bedtime storyteller powered by Google's Gemma 4. " +
    "Your objective is to write an incredibly relaxing, slow-paced, atmospheric sleepcast story tailored to help the user drift off. " +
    "The story should weave in subtle, soothing metaphors that gently address their daytime worries, helping them release stress and tension. " +
    "Write in a calming, rhythmic, and poetic tone. Break the story into 5-6 short, spaced paragraphs. Avoid sudden changes in narrative or suspense.";

  const prompt = 
    `Create a sleepcast story with the following parameters:\n` +
    `- Theme/Setting: ${theme}\n` +
    `- Narrative Style: ${style}\n` +
    `- User's Current Stress/Worry: "${worryText}"\n\n` +
    `Ensure the story starts with a breathing grounding suggestion, leads into a vivid description of the peaceful setting, ` +
    `implicitly handles the worries by letting them drift away, and finishes with a gentle invitation to sleep.`;

  return callGemma(prompt, systemInstruction);
}
