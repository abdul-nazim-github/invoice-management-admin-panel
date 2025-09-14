// lib/errorHandler.ts
interface ReturnTypes {
  title: string;
  description: string;
}

function formatValidationDetails(details: unknown): string {
  if (!details) return "Validation failed";

  if (typeof details === "string") return details;

  if (Array.isArray(details)) {
    return details.join(" | ");
  }

  if (typeof details === "object" && details !== null) {
    return Object.entries(details)
      .map(([field, msgs]) => {
        if (Array.isArray(msgs)) return `${field}: ${msgs.join(", ")}`;
        if (typeof msgs === "string") return `${field}: ${msgs}`;
        return `${field}: Invalid value`;
      })
      .join(" | ");
  }

  return "Validation error occurred";
}

export const handleApiError = (error: any): ReturnTypes => {
  const safeMessage = typeof error?.message === "string" ? error.message : "Something went wrong";
  const safeDetails =
    typeof error?.error?.details !== "undefined" ? error.error.details : undefined;

  switch (error?.type) {
    case "validation_error":
      return {
        title: safeMessage || "Validation Error",
        description: formatValidationDetails(safeDetails),
      };

    case "invalid_credentials":
      return {
        title: safeMessage || "Invalid Credentials",
        description:
          typeof safeDetails === "string"
            ? safeDetails
            : "Please check your email/username and password.",
      };

    case "server_error":
      return {
        title: "Server Error",
        description: "Something went wrong on our side. Please try again later.",
      };

    default:
      return {
        title: "Unexpected Error",
        description: safeMessage,
      };
  }
};
