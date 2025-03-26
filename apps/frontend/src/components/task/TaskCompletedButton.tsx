"use client";
import { Task } from "@/src/types/types";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { config } from "@/config";

export default function TaskCompletedButton({ task }: { task: Task }) {
  const { data: session } = useSession();

  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  // Function to complete task
  const completeTask = async (task: Task) => {
    try {
      setIsPending(true);
      const res = await fetch(
        `${config.NEXT_PUBLIC_HTTP_BACKEND_URL}/task/update-task/${task.id}`,
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
        setIsPending(false);
        toast.success("Task completed.", {
          style: {
            backgroundColor: "#71f871",
            color: "#1f2937",
          },
        });
        router.refresh(); // refresh the router
      }
    } catch (error) {
      setIsPending(false);
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
    <Button
      size="sm"
      onClick={() => completeTask(task)}
      className="cursor-pointer"
      disabled={task.completed || isPending}
    >
      {task.completed ? (
        "Completed"
      ) : isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Processing...
        </>
      ) : (
        "Complete"
      )}
    </Button>
  );
}
