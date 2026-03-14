import { NextRequest, NextResponse } from "next/server";
import { submitClaim } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { dealerSlug, stateSlug, citySlug, name, email, phone, message } = body;

    // Validate required fields
    if (!dealerSlug || !stateSlug || !citySlug || !name || !email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, email, dealerSlug, stateSlug, citySlug" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const result = await submitClaim({
      dealerSlug,
      stateSlug,
      citySlug,
      name,
      email,
      phone: phone || "",
      message: message || "",
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 409 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Claim submission error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
