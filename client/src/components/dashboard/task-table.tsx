import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import axios, { AxiosError } from "axios";

import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Edit, Trash2 } from "lucide-react";

import { getStatusColor, getStatusUpdatedText } from "@/lib/task-status";
import { ServerResponse } from "@/types/server-response";
import { Store } from "@/types/store";
import { Task } from "@/types/task";


const TaskTable = () => {
   const [tasks, setTasks] = useState<Task[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [filter, setFilter] = useState("All");
   const [search, setSearch] = useState("");

   const userId = useSelector((state: Store) => state.auth.userData?.user_id);

   const filteredTasks = tasks.filter((task) => {
      const matchesFilter = filter === "All" || getStatusUpdatedText(task.status) === filter;
      const matchesSearch =
         task.title.toLowerCase().includes(search.toLowerCase()) ||
         task.description.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
   });

   const deleteTask = async (id: string) => {
      // TODO: add toasts
      try {
         const response = await axios.delete<ServerResponse>(`http://localhost/task/${id}`, {
            headers: {
               "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
         });

         setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      } catch (error) {
         const axiosError = error as AxiosError<ServerResponse>;
         console.log(axiosError);
      };
   };

   const getUserTasks = async () => {
      try {
         const response = await axios.get<ServerResponse>(`http://localhost/task/u/${userId}`, {
            headers: {
               "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
         });

         setTasks(response.data.tasks);
      } catch (error) {
         const axiosError = error as AxiosError<ServerResponse>;
         console.log(axiosError);
      } finally {
         setIsLoading(false);
      };
   };

   useEffect(() => {
      setIsLoading(true);
      getUserTasks()
   }, []);

   if (isLoading) return (
      <div>
         loading...
      </div>
   )

   return (
      <div className="container mx-auto">
         <h1 className="text-xl font-semibold mb-3">Today's tasks</h1>
         <div className="flex gap-4 mb-4">
            <Input
               placeholder="Search tasks..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="max-w-sm"
            />
            <Select value={filter} onValueChange={setFilter}>
               <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
               </SelectContent>
            </Select>
         </div>
         <Table className="w-[48rem] overflow-x-auto">
            <TableHeader>
               <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                     <TableCell className="font-medium">
                        {task.title}
                     </TableCell>
                     <TableCell>
                        {task.description}
                     </TableCell>
                     <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                           {getStatusUpdatedText(task.status)}
                        </span>
                     </TableCell>
                     <TableCell>
                        <div className="flex gap-2">
                           <Button
                              variant="outline"
                              size="icon"
                              // onClick={() => handleEdit(task)} TODO: add edit functionality
                           >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit task</span>
                           </Button>
                           <Button
                              variant="outline"
                              size="icon"
                              onClick={() => deleteTask(task.id)}
                           >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete task</span>
                           </Button>
                        </div>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   )
};

export default TaskTable;