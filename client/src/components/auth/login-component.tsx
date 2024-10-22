import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { CalendarCheck2 } from "lucide-react";

import { loginSchema } from "@/schemas/auth";

const LoginComponent = () => {
   const form = useForm<z.infer<typeof loginSchema>>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
         email: "",
         password: "",
      },
   });

   const onSubmit = async (data: z.infer<typeof loginSchema>) => {
      console.log(data);
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
                        Log In
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