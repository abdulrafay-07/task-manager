import Greetings from "@/components/dashboard/greetings";
import TaskTable from "@/components/dashboard/task-table";

const Home = () => {
   return (
      <div className="py-10 px-4 md:px-7 lg:px-10 flex flex-col gap-y-8 md:gap-y-12">
         <Greetings />
         <TaskTable />
      </div>
   )
};

export default Home;