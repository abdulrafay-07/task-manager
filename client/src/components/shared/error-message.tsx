import { TriangleAlert } from "lucide-react";

interface ErrorMessageProps {
   message?: string;
}

const ErrorMessage = ({
   message,
}: ErrorMessageProps) => {
   if (!message) return null;

   return (
      <div className="bg-destructive/15 p-3 rounded-md flex items-center justify-center gap-x-2 text-sm text-destructive">
         <TriangleAlert className="h-4 w-4" />
         <p>{message}</p>
      </div>
   )
};

export default ErrorMessage;