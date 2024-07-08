import { Button } from "~~/components/ui/button";
import { Textarea } from "~~/components/ui/textarea";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center h-screen justify-center text-center w-1/2 mx-auto gap-y-4">
      <p>Enter details about your form</p>
      <Textarea placeholder="A survey form titled 'Survey' with a required name field, a required 'Do you have a pet?' radio button with 'Yes' and 'No' options, and a required 'What is your pet's name?' text field that only shows if 'Yes' is selected." />
      <Button className="">Create</Button>
    </div>
  );
}
