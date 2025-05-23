
import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { WebsiteManagement } from "@/components/admin/WebsiteManagement";
import { UserManagement } from "@/components/admin/UserManagement";
import { AIModelConfig } from "@/components/admin/AIModelConfig";
import { Analytics } from "@/components/admin/Analytics";
import { Settings } from "@/components/admin/Settings";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview />;
      case "websites":
        return <WebsiteManagement />;
      case "users":
        return <UserManagement />;
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
