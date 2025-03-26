import {
  addTaskSchema,
  AddTaskSchemaType,
} from "@repo/validations/src/validation";
import { Button } from "@workspace/ui/components/button";
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
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { useForm, zodResolver } from "@workspace/ui/hooks";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { config } from "@/config";

// Props for the AddTaskDialog component
interface AddTaskDialogProps {
  open: boolean;
  onClose: () => void;
}

// Add Task Dialog component
export default function AddTaskDialog({ open, onClose }: AddTaskDialogProps) {
  // Session for the user
  const { data: session } = useSession();

  // State for is pending
  const [isPending, setIsPending] = useState(false);

  // Router
  const router = useRouter();

  // Handle open change
  function handleOpenChange(open: boolean) {
    if (!open || !isPending) {
      onClose();
    }
  }

  // Form
  const form = useForm<AddTaskSchemaType>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // On Submit function
  async function onSubmit(values: AddTaskSchemaType) {
    setIsPending(true);
    try {
      const res = await fetch(
        `${config.NEXT_PUBLIC_HTTP_BACKEND_URL}/task/create-task`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.accessToken}`,
          },
          body: JSON.stringify(values),
        }
      );
      if (res.ok) {
        setIsPending(false);
        onClose();
        toast.success("Task added successfully", {
          style: {
            backgroundColor: "#71f871",
            color: "#1f2937",
          },
        });
        form.reset();
        router.refresh();
      }
    } catch (error) {
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

  // Add Task Dialog
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
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
                  "Add Task"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
