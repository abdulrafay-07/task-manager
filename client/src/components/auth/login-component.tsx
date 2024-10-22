import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";

import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarCheck2, Loader2 } from "lucide-react";

import { loginSchema } from "@/schemas/auth";
import { ServerResponse } from "@/types/server-response";
import { login } from "@/store/auth-slice";

const LoginComponent = () => {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const navigate = useNavigate();
   const dispatch = useDispatch();

   const form = useForm<z.infer<typeof loginSchema>>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
         email: "",
         password: "",
      },
   });

   const onSubmit = async (data: z.infer<typeof loginSchema>) => {
      setIsSubmitting(true);
      try {
         const response = await axios.post<ServerResponse>("http://localhost/auth/login", data);

         const userData = {
            user_id: response.data.data.user_id,
            username: response.data.data.username,
            user_email: response.data.data.user_email,
         };

         dispatch(login({
            userData,
            token: response.data.data.token,
         }));

         navigate("/");
      } catch (error) {
         const axiosError = error as AxiosError<ServerResponse>;
         console.log(axiosError.response?.data.message);
      } finally {
         setIsSubmitting(false);
      };
   };

   return (
      <div className="size-full flex items-center justify-center bg-[#fffffe]">
         <Card className="max-w-md w-full">
            <CardHeader className="text-center gap-y-1">
               <CardTitle className="flex items-center justify-center gap-x-2 text-primary">
                  <CalendarCheck2 className="h-8 w-8" /> Task Manager
               </CardTitle>
               <CardDescription>Welcome back! Log in to access your tasks.</CardDescription>
            </CardHeader>
            <CardContent>
               <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                     <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                           <FormItem>
                           <FormLabel>Email</FormLabel>
                           <FormControl>
                              <Input placeholder="your@email.com" {...field} />
                           </FormControl>
                           <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                           <FormItem>
                           <FormLabel>Password</FormLabel>
                           <FormControl>
                              <Input type="password" placeholder="********" {...field} />
                           </FormControl>
                           <FormMessage />
                           </FormItem>
                        )}
                     />
                     <Button className="w-full">
                        {isSubmitting ? (
                           <Loader2 className="animate-spin" />
                        ) : (
                           "Log In"
                        )}
                     </Button>
                  </form>
               </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
               <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <a href="/sign-up" className="text-primary hover:underline">
                     Sign Up
                  </a>
               </p>
            </CardFooter>
         </Card>
      </div>
   )
};

export default LoginComponent;