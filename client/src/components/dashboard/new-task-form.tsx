import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

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
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

import { createTaskSchema } from "@/schemas/task";
import { ServerResponse } from "@/types/server-response";
import { Task } from "@/types/task";

interface NewTaskFormProps {
   isDialogOpen: boolean;
   setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
   setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

const NewTaskForm = ({
   isDialogOpen,
   setIsDialogOpen,
   setTasks,
}: NewTaskFormProps) => {
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
      setIsSubmitting(true);
      try {
         const response = await axios.post<ServerResponse>("http://localhost/task", data, {
            headers: {
               "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
         });

         toast(response.data.message, {
            icon: <CheckCircle className="h-6 w-6 text-green-500" />,
            style: {
               backgroundColor: "beige",
            },
         });

         const newTask = response.data.task;

         setTasks(prevTasks => [...prevTasks, newTask]);
      } catch (error) {
         const axiosError = error as AxiosError<ServerResponse>;
         toast(axiosError.response?.data.message!, {
            icon: <AlertCircle className="h-6 w-6 text-red-500" />,
            style: {
               backgroundColor: "beige",
            },
         }); 
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
         </form>
      </Form>
   )
};

export default NewTaskForm;