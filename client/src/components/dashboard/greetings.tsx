import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import NewTaskForm from "@/components/dashboard/new-task-form";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { Store } from "@/types/store";
import { Task } from "@/types/task";

interface GreetingsProps {
   setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

const Greetings = ({
   setTasks,
}: GreetingsProps) => {
   const [username, setUsername] = useState("");
   const [isDialogOpen, setIsDialogOpen] = useState(false);

   const userData = useSelector((state: Store) => state.auth.userData);

   useEffect(() => {
      setUsername(userData?.username!);
   }, [userData]);

   return (
      <div className="flex items-start justify-between">
         <div>
            <h1 className="text-xl md:text-3xl font-bold">Welcome back, {username || ""}!</h1>
            <p className="text-gray-600 max-w-52 md:max-w-full">Here's an overview of your tasks</p>
         </div>
         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
               <Button className="md:rounded-3xl">
                  <Plus className="h-5 w-5 md:-mr-1" /> <span className="hidden md:flex">New task</span>
               </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md w-full">
               <DialogHeader>
                  <DialogTitle>Add a new task</DialogTitle>
                  <DialogDescription>
                     Create a new task. Click create when you're done.
                  </DialogDescription>
               </DialogHeader>

               <NewTaskForm
                  isDialogOpen={isDialogOpen}
                  setIsDialogOpen={setIsDialogOpen}
                  setTasks={setTasks}
               />
            </DialogContent>
         </Dialog>
      </div>
   )
}

export default Greetings;