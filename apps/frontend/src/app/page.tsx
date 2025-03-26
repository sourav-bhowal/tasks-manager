import { Button } from "@workspace/ui/components/button";
import { CheckCircle, Clock, List } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <section className="flex items-center justify-center mx-auto mt-20">
      <div className="">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Manage your tasks with ease
            </h1>
            <p className="text-muted-foreground md:text-xl">
              Stay organized, focused, and in control with our intuitive task
              management platform. Track progress, set deadlines, and
              collaborate seamlessly.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row mt-6">
            <Button asChild size="lg">
              <Link href="/task">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/">View Demo</Link>
            </Button>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 mt-6 text-sm">
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Free trial</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-primary" />
              <span>Easy setup</span>
            </div>
            <div className="flex items-center space-x-1">
              <List className="h-4 w-4 text-primary" />
              <span>Team friendly</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
