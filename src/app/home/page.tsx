import { z } from "zod";
import { Button } from "~~/components/ui/button";
import { Textarea } from "~~/components/ui/textarea";
import { generateForm } from "~~/lib/ai";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center min-h-screen justify-center text-center w-full max-w-2xl mx-auto p-4 gap-y-4">
      <p className="text-lg font-semibold">Enter details about your form</p>

      <form
        action={async (formData: FormData) => {
          "use server";
          const input = formData.get("input");

          // validate the form as a string
          const result = z.string().parse(input);

          const form = await generateForm(result);

          console.log(form);
        }}
        className="w-full flex flex-col gap-y-4"
      >
        <Textarea
          name="input"
          placeholder="A survey form titled 'Survey' with a required name field, a required 'Do you have a pet?' radio button with 'Yes' and 'No' options, and a required 'What is your pet's name?' text field that only shows if 'Yes' is selected."
          className="w-full p-2 border rounded"
        />
        <Button type="submit">Create</Button>
      </form>
    </div>
  );
}
