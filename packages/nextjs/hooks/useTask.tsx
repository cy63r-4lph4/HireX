"use client";

import { useEffect, useState } from "react";
import { TaskPosting } from "~~/interface";

export function useTask(taskId: string | number) {
  const [task, setTask] = useState<TaskPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId) return;

    const fetchTask = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/tasks/${taskId}`);
        if (!res.ok) throw new Error("Failed to fetch task");

        const data: TaskPosting = await res.json();
        setTask(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  return { task, loading, error, setTask };
}
