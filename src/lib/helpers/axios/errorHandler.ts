// lib/errorHandler.ts
import { NextResponse } from "next/server";

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
  const safeMessage =
    typeof error?.message === "string" ? error.message : "Something went wrong";

  const safeDetails = error?.error?.details ?? undefined;

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

    case "duplicate_entry":
      return {
        title: safeMessage || "Duplicate Entry",
        description: formatValidationDetails(safeDetails) || "Record already exists.",
      };

    case "integrity_error":
      return {
        title: safeMessage || "Integrity Error",
        description: formatValidationDetails(safeDetails) || "Database constraint failed.",
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

export function nextErrorResponse(err: any): NextResponse {
  const status = err?.response?.status || 500;

  if (status >= 500) {
    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
        error: { details: "Something went wrong, please try again later." },
        type: "server_error",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: err?.response?.data?.message || "Request failed",
      error: err?.response?.data?.error || { details: "Unknown error" },
      type: err?.response?.data?.type || "unknown_error",
    },
    { status }
  );
}
