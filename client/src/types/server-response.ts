import { Task } from "@/types/task";

export interface ServerResponse {
   success: boolean;
   message: string;
   data: {
      user_id: string;
      user_email: string;
      username: string;
      token?: string;
   };
   tasks: Task[];
   task: Task;
};