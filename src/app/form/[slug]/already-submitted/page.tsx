import Link from "next/link";

export default function AlreadySubmittedPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold mb-4">Form Already Submitted</h1>
      <p className="mb-8 text-xl">You have already submitted this form.</p>
    </div>
  );
}
