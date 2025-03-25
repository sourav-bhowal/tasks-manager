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
import TaskCompletedButton from "./TaskCompletedButton";

// Task card props
interface TaskCardProps {
  task: Task;
}

// Task card component
export function TaskCard({ task }: TaskCardProps) {
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
        <TaskCompletedButton task={task} />
      </CardFooter>
    </Card>
  );
}
