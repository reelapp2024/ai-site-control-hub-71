
import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { WebsiteManagement } from "@/components/admin/WebsiteManagement";
import { UserManagement } from "@/components/admin/UserManagement";
import { AIModelConfig } from "@/components/admin/AIModelConfig";
import { Analytics } from "@/components/admin/Analytics";
import { Settings } from "@/components/admin/Settings";
import { CreateProject } from "@/components/admin/CreateProject";
import { ProjectList } from "@/components/admin/ProjectList";
import { SubAdminManagement } from "@/components/admin/SubAdminManagement";
import { ThemesManagement } from "@/components/admin/ThemesManagement";
import { PluginManagement } from "@/components/admin/PluginManagement";
import { DomainManagement } from "@/components/admin/DomainManagement";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview />;
      case "create-project":
        return <CreateProject />;
      case "project-list":
        return <ProjectList />;
      case "websites":
        return <WebsiteManagement />;
      case "domain-management":
        return <DomainManagement />;
      case "users":
        return <UserManagement />;
      case "manage-subadmin":
        return <SubAdminManagement />;
      case "themes":
        return <ThemesManagement />;
      case "plugins":
        return <PluginManagement />;
      case "ai-models":
        return <AIModelConfig />;
      case "analytics":
        return <Analytics />;
      case "settings":
        return <Settings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <AdminSidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {renderActiveSection()}
        </div>
      </main>
    </div>
  );
};

export default Index;
