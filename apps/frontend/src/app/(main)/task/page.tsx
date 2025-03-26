import { config } from "@/config";
import AddTaskButton from "@/src/components/task/AddTaskButton";
import { TaskCard } from "@/src/components/task/TaskCard";
import { auth } from "@/src/lib/auth";
import { Task } from "@/src/types/types";

export default async function TaskPage() {
  // Auth session
  const session = await auth();

  // Fetch the tasks
  const response = await fetch(
    `${config.HTTP_BACKEND_URL}/task/get-all-tasks`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
    }
  );

  // Parse the response
  const data = await response.json();

  // Get the tasks
  const tasks = data?.data as Task[];

  return (
    <div className="flex flex-1 max-w-7xl mx-auto">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold md:text-2xl">My Tasks</h1>
          <AddTaskButton />
        </div>
        {tasks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No tasks found</p>
        )}
      </main>
    </div>
  );
}
