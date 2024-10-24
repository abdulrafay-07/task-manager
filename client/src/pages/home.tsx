import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios, { AxiosError } from "axios";

import Greetings from "@/components/dashboard/greetings";
import TaskTable from "@/components/dashboard/task-table";

import { ServerResponse } from "@/types/server-response";
import { Task } from "@/types/task";
import { Store } from "@/types/store";

const Home = () => {
   const [isLoading, setIsLoading] = useState(true);
   const [tasks, setTasks] = useState<Task[]>([]);

   const userId = useSelector((state: Store) => state.auth.userData?.user_id);
   
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
      getUserTasks();
   }, []);

   if (isLoading) return (
      <div>
         loading...
      </div>
   );
   
   return (
      <div className="py-10 px-4 md:px-7 lg:px-10 flex flex-col gap-y-8 md:gap-y-12">
         <Greetings
            setTasks={setTasks}
         />
         <TaskTable
            tasks={tasks}
            setTasks={setTasks}
         />
      </div>
   )
};

export default Home;