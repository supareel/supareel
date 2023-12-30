import { TopNavigation } from "./_components/landing/navbar";
import HeroSection from "./_components/landing/heroSection";
import TimelineElement from "./_components/landing/Timeline";
import { work } from "~/data/work";
import Footer from "./_components/footer";
export default function Home() {
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
