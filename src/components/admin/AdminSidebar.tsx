
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
  Plug,
  Link,
  FileText,
  Layout,
  Newspaper,
  FolderOpen,
  Tag,
  Tags,
  Coins,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const getBaseSidebarItems = () => [
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
  { 
    id: "domains", 
    label: "Domains", 
    icon: Link,
    submenu: [
      { id: "domain-management", label: "Domain Management", icon: Link },
    ]
  },
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
  { id: "plugins", label: "Plugins", icon: Plug },
  { id: "credits", label: "Credits", icon: Coins },
  { id: "ai-models", label: "AI Models", icon: Bot },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

const getContentManagementItems = () => [
  { 
    id: "post-management", 
    label: "Posts", 
    icon: Newspaper,
    submenu: [
      { id: "posts", label: "All Posts", icon: Newspaper },
      { id: "post-categories", label: "Categories", icon: FolderOpen },
      { id: "post-subcategories", label: "Subcategories", icon: Tag },
      { id: "post-tags", label: "Tags", icon: Tags },
    ]
  },
  { id: "pages", label: "Pages", icon: Layout },
  { id: "website-generator", label: "Website Generator", icon: FileText },
];

export function AdminSidebar({ activeSection, setActiveSection }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null);
  const [sidebarItems, setSidebarItems] = useState(getBaseSidebarItems());
  
  // Check if the website generator plugin is active
  useEffect(() => {
    const isPluginActive = localStorage.getItem("website-generator-plugin-active") === "true";
    
    if (isPluginActive) {
      // Insert content management items after websites
      const baseItems = getBaseSidebarItems();
      const websiteIndex = baseItems.findIndex(item => item.id === "websites");
      
      if (websiteIndex !== -1) {
        const newItems = [...baseItems];
        const contentItems = getContentManagementItems();
        // Insert after websites
        newItems.splice(websiteIndex + 1, 0, ...contentItems);
        setSidebarItems(newItems);
      }
    } else {
      // Reset to base items
      setSidebarItems(getBaseSidebarItems());
    }
  }, []);

  // Listen for storage events from other components
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "website-generator-plugin-active") {
        const isPluginActive = e.newValue === "true";
        
        if (isPluginActive) {
          // Add content management items
          const baseItems = getBaseSidebarItems();
          const websiteIndex = baseItems.findIndex(item => item.id === "websites");
          
          if (websiteIndex !== -1) {
            const newItems = [...baseItems];
            const contentItems = getContentManagementItems();
            newItems.splice(websiteIndex + 1, 0, ...contentItems);
            setSidebarItems(newItems);
          }
        } else {
          // Remove content management items
          setSidebarItems(getBaseSidebarItems());
        }
      }
    };

    // Also check for changes when component mounts
    const isPluginActive = localStorage.getItem("website-generator-plugin-active") === "true";
    if (isPluginActive) {
      const baseItems = getBaseSidebarItems();
      const websiteIndex = baseItems.findIndex(item => item.id === "websites");
      
      if (websiteIndex !== -1) {
        const newItems = [...baseItems];
        const contentItems = getContentManagementItems();
        newItems.splice(websiteIndex + 1, 0, ...contentItems);
        setSidebarItems(newItems);
      }
    }
    
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const toggleSubmenu = (id: string) => {
    setExpandedSubmenu(expandedSubmenu === id ? null : id);
  };

  return (
    <div className={cn(
      "bg-slate-800 text-white transition-all duration-300 flex flex-col shadow-xl",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">SEO Admin</h1>
              <p className="text-xs text-slate-400">Dashboard Pro</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
        >
          {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          const isSubmenuOpen = expandedSubmenu === item.id;
          const isActive = activeSection === item.id || (hasSubmenu && item.submenu?.some(sub => activeSection === sub.id));
          
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
                  "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left group",
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 font-medium">{item.label}</span>
                    {hasSubmenu && (
                      <div className="transition-transform duration-200">
                        {isSubmenuOpen ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    )}
                  </>
                )}
              </button>

              {/* Submenu */}
              {!isCollapsed && hasSubmenu && isSubmenuOpen && (
                <div className="pl-4 space-y-1 border-l border-slate-700 ml-6">
                  {item.submenu?.map((subItem) => {
                    const SubIcon = subItem.icon;
                    return (
                      <button
                        key={subItem.id}
                        onClick={() => setActiveSection(subItem.id)}
                        className={cn(
                          "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-left",
                          activeSection === subItem.id
                            ? "bg-blue-500 text-white"
                            : "text-slate-400 hover:bg-slate-700 hover:text-white"
                        )}
                      >
                        <SubIcon className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm font-medium">{subItem.label}</span>
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
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">A</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Admin User</p>
              <p className="text-xs text-slate-400">admin@seowebgen.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
