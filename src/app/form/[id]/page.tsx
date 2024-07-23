import { redirect } from "next/navigation";
import { auth } from "~~/lib/auth";
import { db } from "~~/lib/db";

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

  return (
    <div>
      FormPage
      <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
        {JSON.stringify(form, null, 2)}
      </pre>
    </div>
  );
}
