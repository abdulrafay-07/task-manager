import Greetings from "@/components/dashboard/greetings";

const Home = () => {
   return (
      <div className="py-10 px-4 md:px-7 lg:px-10 flex flex-col gap-y-8">
         <Greetings />
      </div>
   )
};

export default Home;