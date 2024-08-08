import { redirect } from "next/navigation";
import { auth } from "~~/lib/auth";
import { db } from "~~/lib/db";
import { FormSchema } from "~~/lib/dsl";

export default async function FormPage(params: { params: { id: string } }) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/");
  }

  const form = await db.form.findUnique({
    where: {
      id: params.params.id,
      userId: session.user?.id,
    },
  });

  // @ts-expect-error it's always a string
  const schema = FormSchema.parse(JSON.parse(form?.schema ?? "{}"));

  return (
    <div>
      <h1>{schema.title}</h1>
      <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
        {JSON.stringify(schema, null, 2)}
      </pre>
    </div>
  );
}
