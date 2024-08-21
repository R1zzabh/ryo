import { redirect } from "next/navigation";
import { z } from "zod";
import { generateForm } from "~~/lib/ai";
import { SubmitButton } from "./submit-button";
import { auth } from "@clerk/nextjs/server";
import { db } from "~~/lib/db";
import { forms } from "~~/lib/db/schema";
import { generateShortId } from "~~/lib/utils";

export default async function HomePage() {
  console.log("HomePage");
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  async function createForm(formData: FormData) {
    "use server";

    const input = formData.get("input");
    const { userId } = auth();
    if (!userId) {
      throw new Error("User not found");
    }

    const result = z.string().parse(input);

    const form = await generateForm(result);

    const slug = form.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const urlId = generateShortId();
    const fullSlug = `${slug}-${urlId}`;

    const createdForm = await db
      .insert(forms)
      .values({
        userId: userId,
        schema: JSON.stringify(form),
        slug: slug,
        urlId: urlId,
      })
      .returning({ id: forms.id });

    redirect(`/form/${fullSlug}`);
  }

  return (
    <div className="flex flex-col items-center min-h-screen justify-center text-center w-full max-w-2xl mx-auto p-4 gap-y-4">
      <p className="text-lg font-semibold">Enter details about your form</p>

      <form action={createForm} className="w-full flex flex-col gap-y-4">
        <textarea
          name="input"
          placeholder="A survey form titled 'Survey' with a required name field, a required 'Do you have a pet?' radio button with 'Yes' and 'No' options, and a required 'What is your pet's name?' text field that only shows if 'Yes' is selected."
          className="w-full p-2 border rounded h-32"
        />
        <SubmitButton />
      </form>
    </div>
  );
}
