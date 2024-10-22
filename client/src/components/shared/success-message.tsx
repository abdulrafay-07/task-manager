import { CheckCircle } from 'lucide-react';

interface SuccessMessageProps {
   message?: string;
};

const SuccessMessage = ({
   message,
}: SuccessMessageProps) => {
   if (!message) return null;

   return (
      <div className="bg-emerald-500/15 p-3 rounded-md flex items-center justify-center gap-x-2 text-sm text-emerald-500">
         <CheckCircle className="h-4 w-4" />
         <p>{message}</p>
      </div>
   )
};

export default SuccessMessage;