import { aj } from "@/config/Arcjet";
import { NextResponse } from "next/server";

/**
 * Handle GET requests by enforcing Arcjet token consumption (5 tokens for the hard-coded user) and returning either a greeting or a rate-limit error.
 * @param {Request} req - The incoming Next.js request object.
 * @returns {import("next/server").NextResponse} A JSON response with `{ message: "Hello world" }` when allowed, or `{ error: "Too Many Requests", reason }` with HTTP status 429 when access is denied.
 */
export async function GET(req) {
  const userId = "user123"; // Replace with your authenticated user ID
  const decision = await aj.protect(req, { userId, requested: 5 }); // Deduct 5 tokens from the bucket
  console.log("Arcjet decision", decision);

  if (decision.isDenied()) {
    return NextResponse.json(
      { error: "Too Many Requests", reason: decision.reason },
      { status: 429 },
    );
  }

  return NextResponse.json({ message: "Hello world" });
}