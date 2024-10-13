interface ErrorWithMessage {
  message: string;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    try {
      const errorObj = JSON.parse(error.message);
      if (
        Array.isArray(errorObj) &&
        errorObj.length > 0 &&
        errorObj[0].message
      ) {
        return errorObj[0].message;
      }
    } catch {
      return String(error.message);
    }
  }
  if (typeof error === "object" && error !== null && "message" in error) {
    return (error as ErrorWithMessage).message;
  }
  return String(error);
}
