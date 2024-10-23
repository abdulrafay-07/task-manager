import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { CalendarCheck2, LogOut } from "lucide-react";

import { items } from "@/constants/index";
import { logout } from "@/store/auth-slice";

const ProtectedSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const signOut = () => {
    dispatch(logout());
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center flex-row p-4 text-primary font-semibold">
        <CalendarCheck2 className="h-5 w-5" /> Task Manager
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className={location.pathname === item.url ? "bg-secondary/50 hover:bg-secondary/40 transition-colors" : "hover:bg-secondary/50"}>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button
          onClick={signOut}
          variant="secondary"
          size="sm"
        >
          <LogOut /> Sign out
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
};

export default ProtectedSidebar;