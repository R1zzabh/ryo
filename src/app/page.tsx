import { SignInButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import { Logo } from "~~/components/logo";

const features = [
  {
    title: "Effortless Creation",
    description:
      "Create forms effortlessly with AI. Transform ideas into user-friendly designs instantly, streamlining the form-building process.",
  },
  {
    title: "Seamless Refinement",
    description:
      "Polish your forms with natural language commands. Enjoy a fluid editing process that adapts to your unique workflow.",
  },
  {
    title: "Intelligent Insights",
    description:
      "Uncover hidden patterns in responses. Our AI-powered analysis turns raw data into actionable strategies, evolving with your needs.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12">
      <main className="flex flex-col items-center w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        <Logo className="w-24 h-24 mb-4" />
        <h1 className="text-5xl sm:text-6xl font-light tracking-tight mb-6 text-matcha">
          Craft Forms with Zen-like Simplicity
        </h1>
        <p className="text-xl sm:text-2xl text-stone-600 mb-10 font-light max-w-3xl">
          Ryo Forms harmonizes AI precision with intuitive design, transforming
          the way you create, refine, and analyze forms.
        </p>
        <SignInButton forceRedirectUrl="/home" mode="modal">
          <button className="px-8 py-3 text-lg font-light text-stone-100 bg-matcha rounded-md hover:bg-[#3E4A46] transition-all duration-300">
            Begin Your Journey{" "}
            <ArrowRight className="inline-block ml-2" size={20} />
          </button>
        </SignInButton>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-stone-50 p-8 border border-stone-200 hover:border-matcha transition-all duration-300"
            >
              <div className="text-3xl font-light mb-4 text-matcha">
                0{index + 1}
              </div>
              <h3 className="text-xl font-medium mb-2 text-stone-800">
                {feature.title}
              </h3>
              <p className="text-stone-600 text-center font-light">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
