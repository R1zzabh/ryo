import { notFound, redirect } from "next/navigation";
import { auth } from "~~/lib/auth";
import { db } from "~~/lib/db";
import { FormSchema } from "~~/lib/dsl";
import DynamicForm from "~~/components/dynamic-form";

export default async function FormPage(params: { params: { id: string } }) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/");
  }

  const form = await db.form.findUnique({
    where: {
      id: params.params.id,
    },
  });

  if (!form) {
    return notFound();
  }

  // @ts-expect-error it's always a string
  const schema = FormSchema.parse(JSON.parse(form.schema));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{schema.title}</h1>
      <DynamicForm schema={schema} />
    </div>
  );
}
