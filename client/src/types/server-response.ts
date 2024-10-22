import { User } from "@/types/user";

export interface ServerResponse {
   success: boolean;
   message: string;
   user: User;
   token: string;
};