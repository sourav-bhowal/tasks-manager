"use client";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Clock } from "lucide-react";
import { Task } from "../../types/types";
import TaskCardMoreButtons from "./TaskCardMoreButtons";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Task card props
interface TaskCardProps {
  task: Task;
}

// Task card component
export function TaskCard({ task }: TaskCardProps) {
  const { data: session } = useSession();

  const router = useRouter();

  // Function to complete task
  const completeTask = async (task: Task) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HTTP_BACKEND_URL}/task/update-task/${task.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.accessToken}`,
          },
          body: JSON.stringify({ completed: !task.completed }),
        }
      );
      if (res.ok) {
        toast.success("Task completed.", {
          style: {
            backgroundColor: "#71f871",
            color: "#1f2937",
          },
        });
        router.refresh(); // refresh the router
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later", {
        style: {
          backgroundColor: "#f87171",
          color: "#1f2937",
        },
      });
      console.error(error);
    }
  };

  return (
    <Card className={`${task.completed ? "opacity-60" : ""} group/task`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{task.title}</CardTitle>
          {/* Task Card More Buttons */}
          <TaskCardMoreButtons
            task={task}
            className="sm:opacity-0 transition-opacity group-hover/task:opacity-100"
          />
        </div>
        <CardDescription className="line-clamp-2">
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-between pt-2">
        <div className="text-xs text-muted-foreground flex items-center">
          <Clock className="mr-1 h-3 w-3" />
          {new Date(task.createdAt).toISOString().split("T")[0]}
        </div>
        <Button
          size="sm"
          onClick={() => completeTask(task)}
          className="cursor-pointer"
          disabled={task.completed}
        >
          {task.completed ? "Completed" : "Mark as Done"}
        </Button>
      </CardFooter>
    </Card>
  );
}
