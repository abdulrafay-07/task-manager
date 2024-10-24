export interface Task {
   id: string;
   createdAt: string;
   status: "not_started" | "in_progress" | "done";
   title: string;
   description: string;
};