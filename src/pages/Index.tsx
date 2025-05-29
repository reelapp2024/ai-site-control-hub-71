
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { PostsManagement } from "@/components/admin/PostsManagement";
import { PagesManagement } from "@/components/admin/PagesManagement";
import { UserManagement } from "@/components/admin/UserManagement";
import { Settings } from "@/components/admin/Settings";
import { Analytics } from "@/components/admin/Analytics";
import { PostEditor } from "@/components/admin/PostEditor";
import { CreditManagement } from "@/components/admin/CreditManagement";
import { HostingDashboard } from "@/components/admin/HostingDashboard";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  const handleEditPost = (postId: string) => {
    setEditingPostId(postId);
    setActiveTab("post-editor");
  };

  const handleNewPost = () => {
    setEditingPostId(null);
    setActiveTab("post-editor");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="dashboard">
              <DashboardOverview />
            </TabsContent>
            
            <TabsContent value="posts">
              <PostsManagement />
            </TabsContent>
            
            <TabsContent value="post-editor">
              <PostEditor postId={editingPostId} />
            </TabsContent>
            
            <TabsContent value="pages">
              <PagesManagement />
            </TabsContent>
            
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
            
            <TabsContent value="analytics">
              <Analytics />
            </TabsContent>
            
            <TabsContent value="credits">
              <CreditManagement />
            </TabsContent>
            
            <TabsContent value="hosting">
              <HostingDashboard />
            </TabsContent>
            
            <TabsContent value="settings">
              <Settings />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Index;
