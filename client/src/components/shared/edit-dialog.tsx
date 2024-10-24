import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle, Edit, Loader2 } from "lucide-react";

import { Task } from "@/types/task";
import { ServerResponse } from "@/types/server-response";
import { createTaskSchema } from "@/schemas/task";

interface EditDialogProps {
   task: Task;
   isOpen: boolean;
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
   setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

const EditDialog = ({
   task,
   isOpen,
   setIsOpen,
   setTasks,
}: EditDialogProps) => {
   const [isSubmitting, setIsSubmitting] = useState(false);

   const form = useForm<z.infer<typeof createTaskSchema>>({
      resolver: zodResolver(createTaskSchema),
      defaultValues: {
         title: task.title || "",
         description: task.description || "",
         status: task.status || "not_started",
      },
   });

   const onSubmit = async (data: z.infer<typeof createTaskSchema>) => {
      setIsSubmitting(true);
      try {
         const response = await axios.put<ServerResponse>(`http://localhost/task/${task.id}`, data, {
            headers: {
               "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
         });

         toast(response.data.message, {
            icon: <CheckCircle className="h-6 w-6 text-green-500" />,
            style: {
               backgroundColor: "beige",
            },
         });

         const updatedTask = response.data.task;

         setTasks(prevTasks =>
            prevTasks.map(t => (t.id === task.id ? { ...t, ...updatedTask } : t))
         );
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
         setIsOpen(!isOpen);
      };
   };

   return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogTrigger asChild>
            <Button
               variant="outline"
               size="icon"
            >
               <Edit className="h-4 w-4" />
               <span className="sr-only">Edit task</span>
            </Button>
         </DialogTrigger>
         <DialogContent className="max-w-md w-full">
            <DialogHeader>
               <DialogTitle>Edit a task</DialogTitle>
               <DialogDescription>
                  Click save when you're done.
               </DialogDescription>
            </DialogHeader>

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
                           "Save"
                        )}
                     </Button>
                  </div>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   )
};

export default EditDialog;