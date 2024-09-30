import { redirect } from "next/navigation";
import { z } from "zod";
import { generateForm } from "~~/lib/ai";
import { auth } from "@clerk/nextjs/server";
import { db } from "~~/lib/db";
import { forms } from "~~/lib/db/schema";
import { generateShortId } from "~~/lib/utils";
import { ArrowRight } from "lucide-react";
import { SubmitButton } from "./submit-button";

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
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-stone-100 text-stone-800">
      <main className="flex flex-col items-center w-full px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-light tracking-tight mb-6 text-matcha">
          Craft Your Form
        </h1>
        <p className="text-lg sm:text-xl text-stone-600 mb-10 font-light">
          Describe your form, and let our AI transform your vision into reality.
        </p>

        <form action={createForm} className="w-full space-y-6">
          <div className="bg-stone-50 p-8 border border-stone-200 rounded-lg shadow-sm hover:border-matcha transition-all duration-300">
            <textarea
              id="input"
              name="input"
              placeholder="A survey form titled 'Survey' with a required name field, a required 'Do you have a pet?' radio button with 'Yes' and 'No' options, and a required 'What is your pet's name?' text field that only shows if 'Yes' is selected."
              className="w-full px-4 py-3 text-stone-700 bg-transparent border-b border-stone-300 focus:border-matcha focus:outline-none transition duration-200 ease-in-out h-40 resize-none font-light"
              required
            />
          </div>
          <SubmitButton />
        </form>
      </main>
    </div>
  );
}
