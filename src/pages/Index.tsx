
import { useState, useEffect } from "react";
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
import { WebsiteGeneratorPlugin } from "@/components/admin/WebsiteGeneratorPlugin";
import { PagesManagement } from "@/components/admin/PagesManagement";
import { PostsManagement } from "@/components/admin/PostsManagement";
import { PostCategoriesManagement } from "@/components/admin/PostCategoriesManagement";
import { PostSubcategoriesManagement } from "@/components/admin/PostSubcategoriesManagement";
import { PostTagsManagement } from "@/components/admin/PostTagsManagement";
import { useNavigate, useLocation } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("dashboard");

  // Set active section based on URL path when component mounts or URL changes
  useEffect(() => {
    if (location.pathname === "/") {
      setActiveSection("dashboard");
    } else if (location.pathname === "/posts") {
      setActiveSection("posts");
    } else if (location.pathname.includes("post-editor")) {
      setActiveSection("posts");
    }
  }, [location.pathname]);

  const handleSectionChange = (section: string) => {
    // Handle navigation for sections that have dedicated pages
    if (section === "posts") {
      navigate("/posts");
      setActiveSection("posts");
    } else {
      setActiveSection(section);
    }
  };

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
      case "website-generator":
        return <WebsiteGeneratorPlugin />;
      case "pages":
        return <PagesManagement />;
      case "posts":
        return <PostsManagement />;
      case "post-categories":
        return <PostCategoriesManagement />;
      case "post-subcategories":
        return <PostSubcategoriesManagement />;
      case "post-tags":
        return <PostTagsManagement />;
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
        setActiveSection={handleSectionChange} 
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
