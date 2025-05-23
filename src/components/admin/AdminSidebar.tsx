import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Globe, 
  Users, 
  Bot, 
  BarChart3, 
  Settings,
  Zap,
  Menu,
  X,
  ListPlus,
  ListTodo,
  UserCog,
  Palette,
  Plugin
} from "lucide-react";
import { useState } from "react";

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { 
    id: "projects", 
    label: "Projects", 
    icon: ListTodo,
    submenu: [
      { id: "create-project", label: "Create Project", icon: ListPlus },
      { id: "project-list", label: "Project List", icon: ListTodo },
    ]
  },
  { id: "websites", label: "Websites", icon: Globe },
  { id: "users", label: "Users", icon: Users },
  { 
    id: "subadmin", 
    label: "Sub Admin", 
    icon: UserCog,
    submenu: [
      { id: "manage-subadmin", label: "Manage Sub Admin", icon: UserCog },
    ]
  },
  { id: "themes", label: "Themes", icon: Palette },
  { id: "plugins", label: "Plugins", icon: Plugin },
  { id: "ai-models", label: "AI Models", icon: Bot },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ activeSection, setActiveSection }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (id: string) => {
    setExpandedSubmenu(expandedSubmenu === id ? null : id);
  };

  return (
    <div className={cn(
      "bg-gray-900 text-white transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold">AI WebGen</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          const isSubmenuOpen = expandedSubmenu === item.id;
          
          return (
            <div key={item.id} className="space-y-1">
              <button
                onClick={() => {
                  if (hasSubmenu) {
                    toggleSubmenu(item.id);
                  } else {
                    setActiveSection(item.id);
                  }
                }}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left",
                  (activeSection === item.id || (hasSubmenu && item.submenu?.some(sub => activeSection === sub.id)))
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {hasSubmenu && (
                      <svg
                        className={`w-4 h-4 transition-transform ${isSubmenuOpen ? "rotate-180" : ""}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    )}
                  </>
                )}
              </button>

              {/* Submenu */}
              {!isCollapsed && hasSubmenu && isSubmenuOpen && (
                <div className="pl-11 space-y-1">
                  {item.submenu?.map((subItem) => {
                    const SubIcon = subItem.icon;
                    return (
                      <button
                        key={subItem.id}
                        onClick={() => setActiveSection(subItem.id)}
                        className={cn(
                          "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left",
                          activeSection === subItem.id
                            ? "bg-blue-600 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        )}
                      >
                        <SubIcon className="h-4 w-4 flex-shrink-0" />
                        <span>{subItem.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold">A</span>
          </div>
          {!isCollapsed && (
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-400">admin@aiwebgen.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
