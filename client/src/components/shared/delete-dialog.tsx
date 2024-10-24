import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteDialogProps {
   isOpen: boolean;
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
   deleteTask: (id: string) => Promise<void>;
   id: string;
};

const DeleteDialog = ({
   isOpen,
   setIsOpen,
   deleteTask,
   id,
}: DeleteDialogProps) => {
   return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
         <AlertDialogTrigger asChild>
            <Button
               variant="outline"
               size="icon"
            >
               <Trash2 className="h-4 w-4" />
               <span className="sr-only">Delete task</span>
            </Button>
         </AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Are you sure?</AlertDialogTitle>
               <AlertDialogDescription>
                  This will permanently delete the task and cannot be undone.
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel>Cancel</AlertDialogCancel>
               <AlertDialogAction asChild>
                  <Button
                     variant="destructive"
                     onClick={() => deleteTask(id)}
                  >
                     Delete
                  </Button>
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   )
};

export default DeleteDialog;