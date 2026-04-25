import { Role } from "@prisma/client";

export function hasRole(current: Role, allowed: Role[]): boolean {
  return allowed.includes(current);
}

export function requireRole(current: Role, allowed: Role[]): void {
  if (!hasRole(current, allowed)) {
    throw new Error("FORBIDDEN");
  }
}
