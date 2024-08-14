import { notFound, redirect } from "next/navigation";
import { FormSchema } from "~~/lib/dsl";
import DynamicForm from "~~/components/dynamic-form";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default async function FormPage({ params }: { params: { id: string } }) {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  // const form = await db.form.findUnique({
  //   where: {
  //     id: params.id,
  //   },
  //   include: {
  //     user: true,
  //   },
  // });

  // if (!form) {
  //   return notFound();
  // }

  // @ts-expect-error it's always a string
  const schema = FormSchema.parse(JSON.parse(form.schema));

  // const isCreator = session.user.id === form.user.id;
  // console.log(isCreator);
  // console.log(form.user.id);
  // console.log(session.user);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{schema.title}</h1>
        {/* {isCreator && (
          <Link
            href={`/form/${form.id}/responses`}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            View Responses
          </Link>
        )} */}
      </div>
      {/* <DynamicForm formId={form.id} schema={schema} /> */}
    </div>
  );
}
