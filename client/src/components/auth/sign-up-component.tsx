import { useState } from "react";
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
import ErrorMessage from "@/components/shared/error-message";
import SuccessMessage from "@/components/shared/success-message";
import { CalendarCheck2, Loader2 } from "lucide-react";

import { signUpSchema } from "@/schemas/auth";
import { ServerResponse } from "@/types/server-response";

const SignUpComponent = () => {
   const [error, setError] = useState("");
   const [success, setSuccess] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);

   const form = useForm<z.infer<typeof signUpSchema>>({
      resolver: zodResolver(signUpSchema),
      defaultValues: {
         name: "",
         email: "",
         password: "",
      },
   });

   const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
      setError("");
      setSuccess("");
      setIsSubmitting(true);
      try {
         const response = await axios.post<ServerResponse>("http://localhost/auth/register", data);

         setSuccess(response.data.message);
      } catch (error) {
         const axiosError = error as AxiosError<ServerResponse>;
         setError(axiosError.response?.data.message!);
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
               <CardDescription>Create an account to track your tasks.</CardDescription>
            </CardHeader>
            <CardContent>
               <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                           <FormItem>
                           <FormLabel>Name</FormLabel>
                           <FormControl>
                              <Input placeholder="Tyler Durden" {...field} />
                           </FormControl>
                           <FormMessage />
                           </FormItem>
                        )}
                     />
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

                     <ErrorMessage message={error} />
                     <SuccessMessage message={success} />

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
                  Already have an account?{" "}
                  <a href="/login" className="text-primary hover:underline">
                     Log In
                  </a>
               </p>
            </CardFooter>
         </Card>
      </div>
   )
};

export default SignUpComponent;