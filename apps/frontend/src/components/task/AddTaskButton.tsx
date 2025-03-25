"use client";
import { Button } from "@workspace/ui/components/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddTaskDialog from "./AddTaskDialog";

// Button to add a new task
export default function AddTaskButton() {
  // Show dialog state for adding a new task
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);

  // Render the button
  return (
    <>
      <Button
        size="sm"
        className="ml-auto gap-1 cursor-pointer"
        onClick={() => setShowAddTaskDialog(true)}
      >
        <Plus className="h-4 w-4" />
        Add Task
      </Button>
      <AddTaskDialog
        open={showAddTaskDialog}
        onClose={() => setShowAddTaskDialog(false)}
      />
    </>
  );
}
