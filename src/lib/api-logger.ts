export function logApiError(route: string, error: unknown): void {
  const safeError =
    error instanceof Error
      ? { message: error.message, stack: error.stack }
      : { error };

  console.error(`[API ERROR] ${route}`, safeError);
}



