
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router";

export function NavMain({ items,subject }) {

  const navigate = useNavigate()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item,index) => (
            <SidebarMenuItem key={index} onClick={()=>navigate(`/teacher-dashboard?exp=${index+1}&sub=${subject.name}`)}>
              <SidebarMenuButton tooltip={item}>
                {item.icon && <item.icon />}
                <span className="text-left ml-4 font-medium w-full">{item}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
