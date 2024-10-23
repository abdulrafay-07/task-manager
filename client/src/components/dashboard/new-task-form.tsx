import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";

import ErrorMessage from "@/components/shared/error-message";
import SuccessMessage from "@/components/shared/success-message";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { createTaskSchema } from "@/schemas/task";
import { ServerResponse } from "@/types/server-response";

interface NewTaskFormProps {
   isDialogOpen: boolean;
   setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
};

const NewTaskForm = ({
   isDialogOpen,
   setIsDialogOpen,
}: NewTaskFormProps) => {
   const [error, setError] = useState("");
   const [success, setSuccess] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);

   const form = useForm<z.infer<typeof createTaskSchema>>({
      resolver: zodResolver(createTaskSchema),
      defaultValues: {
         title: "",
         description: "",
         status: "not_started",
      },
   });

   const onSubmit = async (data: z.infer<typeof createTaskSchema>) => {
      setError("");
      setSuccess("");
      setIsSubmitting(true);
      try {
         const response = await axios.post<ServerResponse>("http://localhost/task", data, {
            headers: {
               "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
         });

         setSuccess(response.data.message);
      } catch (error) {
         const axiosError = error as AxiosError<ServerResponse>;
         setError(axiosError.response?.data.message!); 
      } finally {
         setIsSubmitting(false);
         setIsDialogOpen(!isDialogOpen);
      };
   };

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
               control={form.control}
               name="title"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Title</FormLabel>
                     <FormControl>
                        <Input placeholder="Learn Golang" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="description"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Description</FormLabel>
                     <FormControl>
                        <Textarea
                           {...field}
                           className="resize-none"
                           rows={2}
                           placeholder="Learn arrays and slices in golang and practice."
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <div className="flex items-end justify-between">
               <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                     <FormItem className="max-w-52 w-full">
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                           <FormControl>
                              <SelectTrigger>
                                 <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                           </FormControl>
                           <SelectContent>
                              <SelectItem value="not_started">🔴 Not Started</SelectItem>
                              <SelectItem value="in_progress">🟡 In Progress</SelectItem>
                              <SelectItem value="done">🟢 Done</SelectItem>
                           </SelectContent>
                        </Select>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <Button>
                  {isSubmitting ? (
                     <Loader2 className="animate-spin" />
                  ) : (
                     "Create"
                  )}
               </Button>
            </div>
            <ErrorMessage message={error} />
            <SuccessMessage message={success} />
         </form>
      </Form>
   )
};

export default NewTaskForm;