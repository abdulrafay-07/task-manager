export interface Store {
   auth: {
      status: boolean;
      userData: User | null;
      token: string | null;
   };
};

export interface User {
   user_id: string;
   username: string;
   user_email: string;
};
 
export interface AuthState {
   status: boolean;
   userData: User | null;
   token: string | null;
};

export interface LoginPayload {
   userData: User;
   token: string;
 }