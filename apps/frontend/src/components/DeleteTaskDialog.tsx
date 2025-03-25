import { Button } from "@workspace/ui/components/button";
import { Task } from "../types/types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Delete task dialog props
interface DeleteTaskDialogProps {
  task: Task;
  open: boolean;
  onClose: () => void;
}

// Delete task dialog component
export default function DeleteTaskDialog({
  task,
  open,
  onClose,
}: DeleteTaskDialogProps) {
  // State for isPending
  const [isPending, setIsPending] = useState(false);

  // Router 
  const router = useRouter();

  // handle open change
  function handleOpenChange(open: boolean) {
    if (!open || !isPending) {
      onClose();
    }
  }

  // Handle delete task
  async function handleDeleteTask(id: string) {
    setIsPending(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HTTP_BACKEND_URL}/task/delete-task/${id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setIsPending(false);
        onClose();
        router.refresh();
      }
    } catch (error) {
      setIsPending(false);
      console.error(error);
    } finally {
      setIsPending(false);
    }
  }

  // return dialog component
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete post?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="destructive"
            onClick={() => handleDeleteTask(task.id)}
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Delete"}
          </Button>
          <Button variant={"outline"} onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
