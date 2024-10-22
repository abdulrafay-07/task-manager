import { useSelector } from "react-redux";

import LoginComponent from "@/components/auth/login-component";

import { Store } from "@/types/store";

const Home = () => {
   const isAuthenticated = useSelector((state: Store) => state.auth.status);

   return isAuthenticated ? (
      <div>
         Home Page
      </div>
   ) : (
      <LoginComponent />
   )
};

export default Home;