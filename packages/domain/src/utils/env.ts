export function demandEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}

export function safeGetEnvVar(name: string, defaultIfNotFound: string): string;
export function safeGetEnvVar(name: string): string | undefined;

export function safeGetEnvVar(name: string, defaultIfNotFound?: string): string | undefined {
  const value = process.env[name];
  if (value) {
    return value;
  }
  return defaultIfNotFound;
}
