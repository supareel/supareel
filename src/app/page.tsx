import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

import { Button } from "~/components/ui/button"


export default async function Home() {
  const hello = await api.post.hello.query({ text: "from tRPC" });


  return (
    <main>
      <h1 className="">Hello</h1>
      {hello.greeting}
      <Button variant="default">Button</Button>
      <CrudShowcase/>
    </main>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPost = await api.post.getLatest.query();

  return (
    <div >
      {latestPost ? (
        <p>
          Your most recent post: {latestPost.name}
        </p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}
