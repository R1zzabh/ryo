import { NextResponse } from "next/server";
// import { db } from "~~/lib/db";
// import { auth } from "~~/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { formId, data } = await req.json();

  try {
    const formResponse = await db.formResponse.create({
      data: {
        formId,
        data,
      },
    });

    return NextResponse.json({ success: true, id: formResponse.id });
  } catch (error) {
    console.error("Error saving form response:", error);
    return NextResponse.json(
      { error: "Failed to save response" },
      { status: 500 }
    );
  }
}
