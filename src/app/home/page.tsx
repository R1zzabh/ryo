import { redirect } from "next/navigation";
import { z } from "zod";
import { generateForm } from "~~/lib/ai";
import { auth } from "@clerk/nextjs/server";
import { db } from "~~/lib/db";
import { forms } from "~~/lib/db/schema";
import { generateShortId } from "~~/lib/utils";
import { SubmitButton } from "./submit-button";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";

function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="315"
      height="310"
      viewBox="0 0 1260 1240"
      className="h-6 w-6"
    >
      <path fill="#FFFDFD" d="M0 0h1260v1240H0z"></path>
      <path
        fill="#515F5B"
        d="M626 664l6 1 15 9 23 13 19 11 17 10 71 41 21 12 24 14 21 12 15 9 23 13 21 12 27 16 25 14 41 24 26 15 19 11 24 14 21 12 23 13 24 14 7 4-7 12-13 17-10 13-8 10-12 14-14 16h-2l-2 4-20 20-8 7-9 9-11 9-13 11-12 9-19 14-11 7-15 10-17 10-18 10-25 13-27 12-33 13-35 11-31 8-34 7-35 5-18 2-15 1h-77l-40-4-38-6-31-7-42-12-31-11-28-12-33-16-23-13-22-13-12-8-20-14-16-12-11-9-13-11-8-7-10-9-7-7-8-7-12-12-7-8-14-15-11-14-11-13-14-19-9-14v-2l17-9 24-14 21-12 24-14 18-10 22-13 52-30 49-28 26-15 24-14 21-12 24-14 26-15 23-13 48-28 26-15 17-10 24-14 14-8zM586 7l4 1v331l-9 6-22 12-27 16-19 11-6 4v2l19 10 27 16 26 15 10 6v161l-24 14-18 10-17 10-28 16-15 9-12 6-1-97v-62l-5-2-27-16-26-15-24-14-5-1-13 8-16 9-24 14-26 15-24 14-23 13-48 28-19 11-21 12-27 16-14 8-1 2v29l2 33 5 37 6 29 7 26 12 36 9 22 7 15-1 3-17 9-48 28-21 12-12 7-3-1-9-19-9-21-11-29-10-31-9-36-7-38-5-36-2-28-1-28v-20l2-36 4-37 6-34 7-31 8-29 13-38 14-33 13-28 13-23 9-16 11-17 16-23 12-16 13-16 7-8 10-11 9-11 30-30 11-9 11-10 14-11 15-12 17-12 15-10 23-14 14-8 22-12 30-14 27-11 38-13 29-8 37-8 24-4 33-4zM667 7l26 2 36 5 37 7 15 4 1 176 1 69 27 16 23 13 27 16 18 10 21 12 19 11 28 16 24 14 16 9 53 31 23 13 21 12 13 8-3-9-16-36-12-24-14-24-14-22-13-17-10-13-9-11-11-12-9-10-19-19-8-7-11-10-13-10-15-12-4-3-1-135 5 2 23 13 18 11 16 11 19 14 12 9 14 11 14 12 13 12 12 11 17 17 7 8 10 11 11 14 10 12 10 14 13 18 11 17 14 24 13 24 12 25 14 34 10 29 8 27 7 28 5 25 4 26 3 25 2 36v47l-2 33-5 39-7 38-9 35-11 35-12 31-13 30-4 7-5-2-20-11-13-8-24-14-23-13-24-14-21-12-24-14-27-15-41-24-23-13-17-10-116-67-19-11-24-14-21-12-23-13-17-10-21-12-9-5V464l5 2 22 13 19 11 16 9 15 9 23 13 10 6 26 15 14 8 17 10 49 28 24 14 23 13 25 15 23 13 24 14 28 16 43 25 23 13 16 10 5 3v-10l3-15 3-20 3-39v-37l-4-4-26-15-14-8-24-14-27-15-17-10-28-16-17-10-16-9-38-22-24-14-26-15-48-28-16-9-24-14-23-13-72-42-14-8-1-1V8z"
      ></path>
      <path
        fill="#FFFDFD"
        d="M626 797l5 1 18 10 23 13 10 6 24 14 21 12 26 15 14 8 17 10 21 12 24 14 26 15 24 14 28 16 26 15 14 8 14 9-5 5-10 9-10 8-17 13-21 14-20 12-24 13-27 13-28 11-36 12-32 8-29 5-34 4-18 1h-46l-26-2-33-5-26-6-21-5-35-11-19-7-21-8-24-11-26-14-22-14-14-10-12-9-17-14-11-9-2-4 20-11 28-17 11-6 21-12 24-14 23-13 26-15 28-16 24-14 26-15 21-12 10-6 26-15 21-12zM469 147h5l1 1v123l-6 5-21 12-19 11-17 10-24 14-26 15-49 28-17 10-25 14-22 13-56 32-24 14-7 4h-2l1-7 11-28 14-29 13-23 11-18 11-16 14-19 8-10 12-14 12-13 27-27 11-9 9-8 20-15 18-13 19-12 23-13 16-8 19-9 28-11z"
      ></path>
    </svg>
  );
}

export default async function HomePage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  // Fetch user's recent forms
  const recentForms = await db
    .select({
      id: forms.id,
      slug: forms.slug,
      urlId: forms.urlId,
      createdAt: forms.createdAt,
      schema: forms.schema,
    })
    .from(forms)
    .where(eq(forms.userId, userId))
    .orderBy(desc(forms.createdAt))
    .limit(6);

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

  // Get the current time of day
  const currentHour = new Date().getHours();
  let greeting = "Good morning";
  if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good afternoon";
  } else if (currentHour >= 18) {
    greeting = "Good evening";
  }

  return (
    <main className="flex-grow flex flex-col items-center px-4 sm:px-6 lg:px-8 w-screen h-screen bg-stone-50 max-w-4xl mx-auto py-12">
      <h2 className="text-3xl font-light tracking-tight mb-6 text-matcha">
        <div className="flex items-center gap-2">
          <Icon /> Craft Your Form
        </div>
      </h2>
      <p className="text-lg text-stone-600 mb-6 font-light">
        Describe your form, and let our AI transform your vision into reality.
      </p>

      <form action={createForm} className="w-full space-y-4">
        <div className="bg-white p-6 border border-stone-200 rounded-2xl shadow-sm hover:border-matcha transition-all duration-300">
          <textarea
            id="input"
            name="input"
            placeholder="A survey form titled 'Survey' with a required name field, a required 'Do you have a pet?' radio button with 'Yes' and 'No' options, and a required 'What is your pet's name?' text field that only shows if 'Yes' is selected."
            className="w-full px-3 py-2 text-stone-700 bg-transparent border-b border-stone-300 focus:border-matcha focus:outline-none transition duration-200 ease-in-out h-32 resize-none font-light text-sm rounded-xl"
            required
          />
        </div>
        <SubmitButton />
      </form>

      <div className="mt-8 w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-light text-matcha">Your recent forms</h3>
          <Link
            href="/forms"
            className="text-stone-600 hover:text-matcha transition-colors duration-200 text-sm"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentForms.map((form) => (
            <Link
              key={form.id}
              href={`/form/${form.slug}-${form.urlId}/responses`}
              className="p-6 bg-white border border-stone-200 rounded-2xl hover:border-matcha hover:shadow-sm transition-all duration-300 flex flex-col justify-between h-full"
            >
              <h4 className="font-medium text-lg text-stone-800">
                {/* @ts-ignore */}
                {form.schema.title || "Untitled Form"}
              </h4>
              <p className="text-sm text-stone-500 mt-2">
                {new Date(form.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
