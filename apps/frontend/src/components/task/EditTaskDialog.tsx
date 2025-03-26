import { useForm, zodResolver } from "@workspace/ui/hooks";
import { Task } from "../../types/types";
import {
  updateTaskSchema,
  UpdateTaskSchemaType,
} from "@repo/validations/src/validation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Button } from "@workspace/ui/components/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { config } from "@/config";

// Props for the EditTaskDialog component
interface EditTaskDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// EditTaskDialog component
export default function EditTaskDialog({
  task,
  open,
  onOpenChange,
}: EditTaskDialogProps) {
  // State for is pending
  const [isPending, setIsPending] = useState(false);

  // Session
  const { data: session } = useSession();

  // Router
  const router = useRouter();

  // Edit Form
  const form = useForm<UpdateTaskSchemaType>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
    },
  });

  // On Submit function
  async function onSubmit(values: UpdateTaskSchemaType) {
    setIsPending(true);
    try {
      const res = await fetch(
        `${config.NEXT_PUBLIC_HTTP_BACKEND_URL}/task/update-task/${task.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.accessToken}`,
          },
          body: JSON.stringify(values),
        }
      );
      if (res.ok) {
        setIsPending(false);
        toast.success("Task edited successfully.", {
          style: {
            backgroundColor: "#71f871",
            color: "#1f2937",
          },
        });
        onOpenChange(false);
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
    } finally {
      setIsPending(false);
    }
  }

  // Return the JSX for the EditTaskDialog component
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-2"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter the title of the task"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter the description of the task"
                      className="resize-none w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={isPending || !form.formState.isValid}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
