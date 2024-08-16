import { notFound, redirect } from "next/navigation";
import { FormSchema } from "~~/lib/dsl";
import DynamicForm from "~~/components/dynamic-form";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { db } from "~~/lib/db";
import { eq } from "drizzle-orm";
import { forms } from "~~/lib/db/schema";

export default async function FormPage({ params }: { params: { id: string } }) {
  const { userId } = auth();

  const form = await db.query.forms.findFirst({
    where: eq(forms.id, Number(params.id)),
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
            href={`/form/${form.id}/responses`}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            View Responses
          </Link>
        )}
      </div>
      <DynamicForm formId={form.id} schema={schema} />
    </div>
  );
}
