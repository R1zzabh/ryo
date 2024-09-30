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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
            Create Your Form
          </h2>

          <form action={createForm} className="space-y-4">
            <div>
              <label
                htmlFor="input"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Enter details about your form
              </label>
              <textarea
                id="input"
                name="input"
                placeholder="A survey form titled 'Survey' with a required name field, a required 'Do you have a pet?' radio button with 'Yes' and 'No' options, and a required 'What is your pet's name?' text field that only shows if 'Yes' is selected."
                className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out h-32 resize-none"
                required
              />
            </div>
            <SubmitButton />
          </form>
        </div>
      </div>
    </div>
  );
}
