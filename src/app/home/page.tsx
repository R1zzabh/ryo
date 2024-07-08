import { auth } from "~~/lib/auth";

export default function HomePage() {
  return (
    <div>
      hi <Hi />
    </div>
  );
}

const Hi = async () => {
  const session = await auth();
  return <div>{session?.user?.name}</div>;
};
