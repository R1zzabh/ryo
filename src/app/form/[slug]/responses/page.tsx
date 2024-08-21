import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { db } from "~~/lib/db";
import { forms, formResponses } from "~~/lib/db/schema";
import { FormSchema } from "~~/lib/dsl";

export default async function FormResponsesPage({
  params,
}: {
  params: { slug: string };
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

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

  // Fetch responses for the form
  const responses = await db.query.formResponses.findMany({
    where: eq(formResponses.formId, form.id),
  });

  // Organize responses by field
  const organizedResponses = schema.fields.map((field) => {
    const fieldResponses = responses.map((response) => {
      const data = response.data as Record<string, unknown>;
      return {
        id: response.id,
        value: data[field.id] ?? "N/A",
        createdAt: response.createdAt,
      };
    });
    return {
      field,
      responses: fieldResponses,
    };
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Responses for: {schema.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizedResponses.map(({ field, responses }) => (
          <div key={field.id} className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">{field.label}</h2>
            <ul className="space-y-2">
              {responses.map((response, index) => (
                <li
                  key={response.id}
                  className={`pb-2 ${
                    index !== responses.length - 1 ? "border-b" : ""
                  }`}
                >
                  <p>{String(response.value)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(response.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
