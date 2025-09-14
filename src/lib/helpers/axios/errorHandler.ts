// lib/errorHandler.ts
interface ReturnTypes {
  title: string;
  description: string;
}

function formatValidationDetails(details: any): string {
  if (!details) return "Validation failed";

  if (typeof details === "string") return details;

  if (typeof details === "object") {
    // Flatten messages like { password: ["msg1", "msg2"], email: ["msg3"] }
    return Object.entries(details)
      .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(", ")}`)
      .join(" | ");
  }

  return "Validation error occurred";
}

export const handleApiError = (error: any): ReturnTypes => {
  switch (error?.type) {
    case "validation_error":
      return {
        title: error.message || "Validation Error",
        description: formatValidationDetails(error.error?.details),
      };

    case "invalid_credentials":
      return {
        title: error.message || "Invalid Credentials",
        description: error.error?.details || "Please check your email/username and password.",
      };

    case "server_error":
      return {
        title: "Server Error",
        description: "Something went wrong on our side. Please try again later.",
      };

    default:
      return {
        title: "Unexpected Error",
        description: error?.message || "Something went wrong",
      };
  }
};
