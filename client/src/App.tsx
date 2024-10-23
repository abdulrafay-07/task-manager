import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import ProtectedSidebar from "@/components/shared/protected-sidebar";
import {
   SidebarProvider,
   SidebarTrigger,
} from "@/components/ui/sidebar";

import { Store } from "@/types/store";

const App = () => {
  const isAuthenticated = useSelector((state: Store) => state.auth.status);
  
  return isAuthenticated ? (
      <SidebarProvider
        style={{
          "--sidebar-width": "13rem",
        }}
        className="h-full"
      >
        <ProtectedSidebar />
        <SidebarTrigger variant="link" />
        <main className="size-full">
          <Outlet />
        </main>
      </SidebarProvider>
  ) : (
    <Outlet />
  )
};

export default App;