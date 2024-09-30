import { notFound, redirect } from "next/navigation";
import { FormSchema } from "~~/lib/dsl";
import DynamicForm from "~~/components/dynamic-form";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { db } from "~~/lib/db";
import { eq, and } from "drizzle-orm";
import { forms } from "~~/lib/db/schema";

export default async function FormPage({
  params,
}: {
  params: { slug: string };
}) {
  const { userId } = auth();

  // Find the last hyphen in the slug
  const lastHyphenIndex = params.slug.lastIndexOf("-");

  // Extract the slug and urlId
  const slug = params.slug.slice(0, lastHyphenIndex);
  const urlId = params.slug.slice(lastHyphenIndex + 1);

  const form = await db.query.forms.findFirst({
    where: and(eq(forms.slug, slug), eq(forms.urlId, urlId)),
  });

  if (!form) {
    return notFound();
  }

  const schema = FormSchema.parse(form.schema);

  const isCreator = userId === form.userId;
  console.log(isCreator);
  console.log(form.userId);
  console.log(userId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{schema.title}</h1>
        {isCreator && (
          <Link
            href={`/form/${params.slug}/responses`}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
          >
            View Responses
          </Link>
        )}
      </div>
      <DynamicForm slug={params.slug} formId={form.id} schema={schema} />
    </div>
  );
}
