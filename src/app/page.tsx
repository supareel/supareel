import { TopNavigation } from "./_components/landing/navbar";
import HeroSection from "./_components/landing/heroSection";
import TimelineElement from "./_components/landing/Timeline";
import { work } from "~/data/work";
import Footer from "./_components/footer";
export default function Home() {
  // const hello = await api.post.hello.query({ text: "from tRPC" });
  return (
    <main>
      <TopNavigation />
      <HeroSection />
      <div className="relative md:m-6 py-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-2 font-mono uppercase font-bold text-xl text-muted-foreground">
            Roadmap
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center py-6 ">
        <div className="space-y-6 border-l-2 border-dashed max-w-7xl">
          {work.map((work: ITimelineElement, idx: number) => (
            <TimelineElement
              key={idx}
              title={work.title}
              details={work.details}
              progress={work.progress}
            />
          ))}
        </div>
      </div>

      <Footer />

      {/* <h1 className="">Hello</h1>
      {hello.greeting}
      <Button variant="default">Button</Button> */}
    </main>
  );
}

// async function CrudShowcase() {
//   const session = await getServerAuthSession();
//   if (!session?.user) return null;

//   const latestPost = await api.post.getLatest.query();

//   return (
//     <div>
//       {latestPost ? (
//         <p>Your most recent post: {latestPost.name}</p>
//       ) : (
//         <p>You have no posts yet.</p>
//       )}

//       <CreatePost />
//     </div>
//   );
// }
