import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

import { login, logout } from "@/store/auth-slice";
import { ServerResponse } from "@/types/server-response";

interface useAuthProps {
   authentication?: boolean;
};

interface VerificationResult {
   isLoading: boolean;
   error: Error | null;
};

const useAuth = ({
   authentication = true,
}: useAuthProps): VerificationResult => {
   const [error, setError] = useState<Error | null>(null);
   const [isLoading, setIsLoading] = useState(true);

   const navigate = useNavigate();
   const dispatch = useDispatch();

   useEffect(() => {
      const verifyToken = async () => {
         const token = localStorage.getItem("token");

         if (!token) {
            handleAuthFailure();
            return;
         };
         
         try {
            const response = await axios.get<ServerResponse>("http://localhost:3000/verify-token", {
               headers: {
                  "Authorization": `Bearer ${token}`,
               },
            });

            if (!response.data.success) {
               throw new Error("Unauthorized");
            };

            dispatch(login({
               userData: response.data.user,
               token,
            }));

            if (!authentication) {
               navigate("/");
            }
         } catch (error) {
            console.error('Auth verification failed:', error);
            setError(error instanceof Error ? error : new Error('Verification failed'));
            handleAuthFailure();
         } finally {
            setIsLoading(false);
         };
      };

      const handleAuthFailure = () => {
         localStorage.removeItem('token');
         dispatch(logout());
         if (authentication) {
            navigate('/login');
         };
         setIsLoading(false);
      };
   
       verifyToken();
   }, [authentication, dispatch, navigate]);

   return { isLoading, error };
};

export default useAuth;