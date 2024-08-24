import Link from "next/link";

export default function ThankYouPage({ params }: { params: { slug: string } }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
      <p className="mb-8 text-xl">Your form has been submitted successfully.</p>
    </div>
  );
}
