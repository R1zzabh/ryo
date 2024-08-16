import { NextResponse } from "next/server";
import { db } from "~~/lib/db";
import { formResponses } from "~~/lib/db/schema";

export async function POST(req: Request) {
  const { formId, data } = await req.json();
  try {
    console.log("formId", formId);
    console.log("data", data);
    const formResponse = await db
      .insert(formResponses)
      .values({
        formId,
        data: JSON.stringify(data),
      })
      .returning({ id: formResponses.id });

    return NextResponse.json({
      status: 200,
      success: true,
      id: formResponse[0].id,
    });
  } catch (error) {
    console.error("Error saving form response:", error);
    return NextResponse.json(
      { error: "Failed to save response" },
      { status: 500 }
    );
  }
}
