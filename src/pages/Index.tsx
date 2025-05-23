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
import { PostEditor } from "@/components/admin/PostEditor";
import { CreditManagement } from "@/components/admin/CreditManagement";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string | undefined>(undefined);

  // Set active section based on URL path when component mounts or URL changes
  useEffect(() => {
    if (location.pathname === "/") {
      setActiveSection("dashboard");
      setIsEditingPost(false);
    } else if (location.pathname === "/posts") {
      setActiveSection("posts");
      setIsEditingPost(false);
    } else if (location.pathname.includes("post-editor")) {
      setActiveSection("posts");
      setIsEditingPost(true);
      const postId = location.pathname.split('/').pop();
      if (postId && postId !== "post-editor") {
        setCurrentPostId(postId);
      } else {
        setCurrentPostId(undefined);
      }
    }
  }, [location.pathname]);

  const handleSectionChange = (section: string) => {
    // Handle navigation for sections that have dedicated pages
    if (section === "posts") {
      navigate("/posts");
      setActiveSection("posts");
      setIsEditingPost(false);
    } else {
      setActiveSection(section);
      setIsEditingPost(false);
    }
  };

  const renderActiveSection = () => {
    // If we're in post editor mode, return the post editor
    if (isEditingPost) {
      return <PostEditor postId={currentPostId} />;
    }
    
    // Otherwise render the normal sections
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
      case "credits":
        return <CreditManagement />;
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
    <div className="min-h-screen bg-slate-50 flex font-poppins">
      <AdminSidebar 
        activeSection={activeSection} 
        setActiveSection={handleSectionChange} 
      />
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-full">
          {/* Header */}
          <div className="mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-1">
                    SEO Admin Dashboard
                  </h1>
                  <p className="text-slate-600">
                    Manage your SEO optimized websites and content
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    Online
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">A</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[calc(100vh-10rem)]">
            <div className="p-6">
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
