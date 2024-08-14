// import { notFound, redirect } from "next/navigation";
// import { FormSchema } from "~~/lib/dsl";

// export default async function FormResponsesPage({
//   params,
// }: {
//   params: { id: string };
// }) {
//   const session = await auth();

//   if (!session || !session.user) {
//     redirect("/");
//   }

//   const form = await db.form.findUnique({
//     where: { id: params.id },
//     include: { responses: true },
//   });

//   if (!form) {
//     return notFound();
//   }

//   // @ts-expect-error it's always a string
//   const schema = FormSchema.parse(JSON.parse(form.schema));

//   // Organize responses by field
//   const organizedResponses = schema.fields.map((field) => {
//     const responses = form.responses.map((response) => {
//       const data = response.data;
//       return {
//         id: response.id,
//         value:
//           data && typeof data === "object" && field.id in data
//             ? data[field.id as keyof typeof data]
//             : undefined,
//         createdAt: response.createdAt,
//       };
//     });
//     return {
//       field,
//       responses,
//     };
//   });

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">Responses for: {schema.title}</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {organizedResponses.map(({ field, responses }) => (
//           <div key={field.id} className="border rounded-lg p-4">
//             <h2 className="text-xl font-semibold mb-4">{field.label}</h2>
//             <ul className="space-y-2">
//               {responses.map((response, index) => (
//                 <li
//                   key={response.id}
//                   className={`pb-2 ${
//                     index !== responses.length - 1 ? "border-b" : ""
//                   }`}
//                 >
//                   <p>
//                     {response.value !== undefined
//                       ? String(response.value)
//                       : "N/A"}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     {new Date(response.createdAt).toLocaleString()}
//                   </p>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
