
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  BarChart3, 
  CreditCard,
  Server,
  File
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const sidebarItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "posts",
    label: "Posts",
    icon: FileText,
  },
  {
    id: "pages",
    label: "Pages",
    icon: File,
  },
  {
    id: "users",
    label: "Users",
    icon: Users,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  {
    id: "credits",
    label: "Credits",
    icon: CreditCard,
  },
  {
    id: "hosting",
    label: "Hosting",
    icon: Server,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
  },
];

export function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  return (
    <div className="w-64 border-r bg-background">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
      </div>
      
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 pb-4">
          {sidebarItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                activeTab === item.id && "bg-primary text-primary-foreground"
              )}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
