import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { TaskCard } from "../components/TaskCard";
import AddTaskButton from "../components/AddTaskButton";
import { Task } from "../types/types";

export default async function Home() {
  // Fetch the tasks
  const response = await fetch(
    `${process.env.HTTP_BACKEND_URL}/task/get-all-tasks`
  );

  // Parse the response
  const data = await response.json();

  // Get the tasks
  const tasks = data?.data as Task[];

  // Render the page
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="#" className="flex items-center gap-2 font-semibold">
          <CheckCircle2 className="h-6 w-6" />
          <span>TaskMaster</span>
        </Link>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-[250px] flex-col border-r bg-background md:flex">
          <nav className="grid gap-2 p-4 text-sm font-medium">
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2 text-primary-foreground"
            >
              <CheckCircle2 className="h-5 w-5" />
              My Tasks
            </Link>
          </nav>
        </aside>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold md:text-2xl">My Tasks</h1>
            <AddTaskButton />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
