import { redirect } from "next/navigation";
import { z } from "zod";
import { generateForm } from "~~/lib/ai";
import { auth } from "~~/lib/auth";
import { db } from "~~/lib/db";

export default async function HomePage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/");
  }

  return (
    <div className="flex flex-col items-center min-h-screen justify-center text-center w-full max-w-2xl mx-auto p-4 gap-y-4">
      <p className="text-lg font-semibold">Enter details about your form</p>

      <form
        action={async (formData: FormData) => {
          "use server";

          const input = formData.get("input");

          // validate the form as a string
          const result = z.string().parse(input);

          const form = await generateForm(result);

          const createdForm = await db.form.create({
            // @ts-expect-error prisma bug
            data: {
              fields: JSON.stringify(form),
              userId: session.user!.id!,
              user: {
                connect: {
                  id: session.user!.id!,
                  email: session.user!.email!,
                },
              },
            },
            select: {
              id: true,
            },
          });

          redirect(`/form/${createdForm.id}`);
        }}
        className="w-full flex flex-col gap-y-4"
      >
        <textarea
          name="input"
          placeholder="A survey form titled 'Survey' with a required name field, a required 'Do you have a pet?' radio button with 'Yes' and 'No' options, and a required 'What is your pet's name?' text field that only shows if 'Yes' is selected."
          className="w-full p-2 border rounded h-32"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Create
        </button>
      </form>
    </div>
  );
}
