import { useState } from "react";

import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

import EditDialog from "@/components/shared/edit-dialog";
import DeleteDialog from "@/components/shared/delete-dialog";
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
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle } from "lucide-react";

import { getStatusColor, getStatusUpdatedText } from "@/lib/task-status";
import { ServerResponse } from "@/types/server-response";
import { Task } from "@/types/task";

interface TaskTableProps {
   tasks: Task[];
   setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

const TaskTable = ({
   tasks,
   setTasks,
}: TaskTableProps) => {
   const [filter, setFilter] = useState("All");
   const [search, setSearch] = useState("");
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);

   const filteredTasks = tasks.filter((task) => {
      const matchesFilter = filter === "All" || getStatusUpdatedText(task.status) === filter;
      const matchesSearch =
         task.title.toLowerCase().includes(search.toLowerCase()) ||
         task.description.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
   });

   const deleteTask = async (id: string) => {
      try {
         const response = await axios.delete<ServerResponse>(`http://localhost/task/${id}`, {
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

         setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      } catch (error) {
         const axiosError = error as AxiosError<ServerResponse>;
         toast(axiosError.response?.data.message!, {
            icon: <AlertCircle className="h-6 w-6 text-red-500" />,
            style: {
               backgroundColor: "beige",
            },
         });
      };
   };

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
         <Table className="w-[48rem] md:w-auto overflow-x-auto">
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
                           <EditDialog
                              task={task}
                              isOpen={isEditModalOpen}
                              setIsOpen={setIsEditModalOpen}
                              setTasks={setTasks}
                           />
                           <DeleteDialog
                              isOpen={isDeleteModalOpen}
                              setIsOpen={setIsDeleteModalOpen}
                              deleteTask={deleteTask}
                              id={task.id}
                           />
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