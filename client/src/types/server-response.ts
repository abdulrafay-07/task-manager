export interface ServerResponse {
   success: boolean;
   message: string;
   data: {
      user_id: string;
      user_email: string;
      username: string;
      token?: string;
   };
};