# WellNedd - Wellness & Mental Health Super App

A production-style full-stack wellness and cognitive health management platform for physical/mental wellbeing tracking, self-care programs, content discovery, coaching workflows, rewards, and admin analytics.

This platform features a fully-redesigned **Mind Sanctuary (Mental Health Super App)** natively powered by **Google's Gemma 4 (`gemma-4-31b-it`)**.

---

## 🌟 Mind Sanctuary: Mental Health Super App Features

The Mind Sanctuary integrates advanced cognitive behavioral therapy (CBT) models, grounding frameworks, and sleep sciences natively powered by Gemma 4:

### 1. Daily Reflection Log & CBT Analytics
*   **Active CBT Analysis**: Write down your thoughts, and Gemma 4 immediately processes them to analyze emotions, identify triggers, highlight cognitive distortions (such as catastrophizing or emotional reasoning), and draft a balanced reframe.
*   **Visual Trend Dashboards**: Historical reflections are plotted on a **Calmness Trend** line chart, paired with a categorical list of **Top Stress Triggers** to trace emotional health over time.
*   **Rewards Integration**: Every analyzed journal entry grants the user **+15 points** toward their wellness achievements.

### 2. Guided CBT Restructuring Card Deck
*   An interactive, step-by-step cognitive restructuring worksheet:
    1.  **Situation**: Log the activating event.
    2.  **Automatic Thought**: Record the unhelpful initial thought.
    3.  **Distortion Identification**: Categorize the unhelpful thinking style.
    4.  **Evidence Challenge**: Log evidence supporting/opposing the thought.
    5.  **AI Balanced Reframe**: Gemma 4 evaluates the input and provides a compassionate, objective alternative perspective.

### 3. AI Sleep Oasis (Personalized Bedtime Stories)
*   **Worry-to-Sleepcast Engine**: Enter your current daytime worries, select an atmospheric theme (e.g., *Bioluminescent Whispering Forest*, *Midnight Express Train*), and select a narration style.
*   **Atmospheric Story Generator**: Gemma 4 generates a personalized, calming bedtime story that weaves in metaphors to help release tension.
*   **Auto-Scroll Night Reader**: Renders the story in a dark, starry interface with customizable scrolling speeds to induce relaxed breathing.

### 4. SOS Grounding Space
*   **5-4-3-2-1 Sensory Checklist**: Interactive guided focus system (5 things to see, 4 to feel, 3 to hear, 2 to smell, 1 to taste) paired with a box-breathing widget.
*   **Gemma Crisis Scripts**: Choose your distress state (panic, anger, burnout, grief), and Gemma 4 writes a custom crisis soothing script.

### 5. Sanctuary AI Companion Chat
*   Sidebar conversational companion with dynamically toggleable focus presets:
    -   `General Guide`: Warm, empathetic health coaching.
    -   `CBT Reframing`: Cognitive behavioral thought challenge helper.
    -   `Stress Grounding`: Anxiety relief and deep breathing exercises.
    -   `Gratitude Loop`: positive psychology and appreciation training.
    -   `Self-Compassion`: Non-judgmental emotional validation.

---

## 🛠️ Tech Stack & Domain Architecture

*   **Framework**: Next.js 16 (App Router) + React 19 (compiled with Turbopack)
*   **Database**: Neon Serverless PostgreSQL (Production) / SQLite (Local) via Prisma ORM
*   **Authentication**: NextAuth/Auth.js v5 (configured with `trustHost: true` for secure reverse proxy deployment on GCP)
*   **Styling**: Vanilla CSS (Tailwind CSS for UI structures) + Glassmorphic theme
*   **AI Engine**: Google Gemma 4 client (`lib/gemma.ts`)

---

## 🧠 Gemma 4 Client Architecture (`lib/gemma.ts`)

The application implements a dual-serving integration pattern for Google's Gemma 4 models:

```
+------------------+      (Access Token)       +---------------------+
|   Cloud Run      |-------------------------->| GCP Metadata Server |
|  (WellNedd API)  |<--------------------------| (Token Issuer)      |
+------------------+                           +---------------------+
         |
         | (POST request with Bearer Token)
         v
+--------------------------------------------------------------------+
|                      Vertex AI Endpoint                            |
|  +--------------------------------------------------------------+  |
|  |  [Format A] vLLM served OpenAI Chat Completions              |  |
|  |  [Format B] Vertex AI Prediction Endpoint (instances/params) |  |
|  +--------------------------------------------------------------+  |
+--------------------------------------------------------------------+
         | (Fallback on failure or if credentials missing)
         v
+--------------------------------------------------------------------+
|                 Google AI Studio (Gemini API)                      |
|                  Using GEMINI_API_KEY                              |
+--------------------------------------------------------------------+
```

1.  **Vertex AI Serving (GCP Native)**:
    *   Looks for `VERTEX_AI_ENDPOINT` in the environment.
    *   Authenticates dynamically using GCP IAM service account tokens queried from the link-local metadata server (`metadata.google.internal`).
    *   Supports dual payload mapping (vLLM OpenAI compatible `/chat/completions` or Vertex Predict specifications).
2.  **Google AI Studio Fallback**:
    *   Defaults to Google AI Studio API (`https://generativelanguage.googleapis.com`) using `GEMINI_API_KEY` and targeting `gemma-4-31b-it` if Vertex AI is not configured.

---

## 💻 Local Setup

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Configure environment**:
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="file:./dev.db"
    NEXTAUTH_SECRET="dev-only-secret-change-me"
    NEXTAUTH_URL="http://localhost:3000"
    AUTH_TRUST_HOST=true
    GEMINI_API_KEY="YOUR_GOOGLE_AI_STUDIO_API_KEY"
    ```
3.  **Introspect & Generate Database Client**:
    ```bash
    npx prisma generate
    ```
4.  **Seed mock database content**:
    ```bash
    npm run seed
    ```
5.  **Run development server**:
    ```bash
    npm run dev
    ```

---

## 🌐 Production GCP Cloud Run Deployment

To build and deploy the container on Google Cloud Run with the database and Gemma 4 secrets:

1.  **Compile & Upload Container via Cloud Build**:
    ```bash
    gcloud builds submit . \
      --tag us-central1-docker.pkg.dev/YOUR_PROJECT_ID/wellnedd-repo/wellnedd-app \
      --project=YOUR_PROJECT_ID
    ```
2.  **Deploy on Cloud Run**:
    Ensure that `AUTH_TRUST_HOST` is set to `true` and the API key is passed correctly:
    ```bash
    gcloud run deploy wellnedd-app \
      --image us-central1-docker.pkg.dev/YOUR_PROJECT_ID/wellnedd-repo/wellnedd-app:latest \
      --set-env-vars="DATABASE_URL=YOUR_DATABASE_URL,AUTH_SECRET=YOUR_AUTH_SECRET,NODE_ENV=production,NEXTAUTH_URL=YOUR_APP_URL,AUTH_TRUST_HOST=true,GEMINI_API_KEY=YOUR_GEMINI_API_KEY" \
      --platform managed \
      --region us-central1 \
      --allow-unauthenticated \
      --project=YOUR_PROJECT_ID
    ```

---

## 🔑 Demo Access Credentials

*   **Admin Access**: `admin@wellnedd.local` / `password123`
*   **Coach Access**: `coach1@wellnedd.local` / `password123`
*   **User Access**: `user1@wellnedd.local` / `password123`
*   **Quick User Login**: Just type any username in the "Quick Access" input field.
