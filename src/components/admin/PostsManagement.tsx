
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Search, Edit, Trash2, Eye, Sparkles, Save, ArrowUp, Calendar, Tag, Image, Layout, ListFilter, Tags } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function PostsManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddPostDialog, setShowAddPostDialog] = useState(false);
  const [showEditPostDialog, setShowEditPostDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentPostId, setCurrentPostId] = useState("");
  const [showAIGenerateDialog, setShowAIGenerateDialog] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiCategory, setAiCategory] = useState("");
  
  // Form state
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("");
  const [newPostStatus, setNewPostStatus] = useState("draft");
  const [newPostFeaturedImage, setNewPostFeaturedImage] = useState("");
  const [newPostTags, setNewPostTags] = useState<string[]>([]);
  const [editorTab, setEditorTab] = useState("write");

  // Mock data for posts
  const [posts, setPosts] = useState([
    {
      id: "1",
      title: "Getting Started with AI WebGen",
      category: "Tutorial",
      status: "published",
      author: "Admin",
      date: "2023-05-15",
      comments: 5,
      content: "This is a comprehensive guide to getting started with AI WebGen. Learn how to create your first AI-powered website in minutes.",
      featuredImage: "https://images.unsplash.com/photo-1677442135145-40703ad880fa?w=500&auto=format&fit=crop&q=60",
      tags: ["AI", "Tutorial", "Beginner"]
    },
    {
      id: "2",
      title: "How to Customize Your Website Templates",
      category: "Guide",
      status: "published",
      author: "Editor",
      date: "2023-05-18",
      comments: 3,
      content: "Learn how to customize the built-in templates to create unique websites that match your brand identity.",
      featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60",
      tags: ["Templates", "Customization"]
    },
    {
      id: "3",
      title: "Upcoming Features in AI WebGen",
      category: "News",
      status: "draft",
      author: "Admin",
      date: "2023-05-20",
      comments: 0,
      content: "Get a sneak peek at the exciting new features coming soon to AI WebGen platform.",
      featuredImage: "",
      tags: ["News", "Features"]
    },
    {
      id: "4",
      title: "Optimizing Your Website for Speed",
      category: "Performance",
      status: "published",
      author: "Contributor",
      date: "2023-05-22",
      comments: 8,
      content: "Follow these best practices to optimize your AI-generated website for maximum performance and speed.",
      featuredImage: "https://images.unsplash.com/photo-1607798748738-b15c40d33d57?w=500&auto=format&fit=crop&q=60",
      tags: ["Performance", "Optimization"]
    }
  ]);

  // Mock data for categories and subcategories
  const [categories, setCategories] = useState([
    { id: "1", name: "Tutorial", slug: "tutorial", count: 1 },
    { id: "2", name: "Guide", slug: "guide", count: 1 },
    { id: "3", name: "News", slug: "news", count: 1 },
    { id: "4", name: "Performance", slug: "performance", count: 1 },
  ]);

  const [subcategories, setSubcategories] = useState([
    { id: "1", name: "Getting Started", slug: "getting-started", parentId: "1", count: 1 },
    { id: "2", name: "Advanced", slug: "advanced", parentId: "1", count: 0 },
    { id: "3", name: "Templates", slug: "templates", parentId: "2", count: 1 },
    { id: "4", name: "Updates", slug: "updates", parentId: "3", count: 1 },
  ]);

  // Mock data for tags
  const [tags, setTags] = useState([
    { id: "1", name: "AI", slug: "ai", count: 1 },
    { id: "2", name: "Tutorial", slug: "tutorial", count: 1 },
    { id: "3", name: "Beginner", slug: "beginner", count: 1 },
    { id: "4", name: "Templates", slug: "templates", count: 1 },
    { id: "5", name: "Customization", slug: "customization", count: 1 },
    { id: "6", name: "News", slug: "news", count: 1 },
    { id: "7", name: "Features", slug: "features", count: 1 },
    { id: "8", name: "Performance", slug: "performance", count: 1 },
    { id: "9", name: "Optimization", slug: "optimization", count: 1 },
  ]);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPost = () => {
    if (!newPostTitle.trim()) {
      toast.error("Please enter a post title");
      return;
    }
    
    // Create a new post
    const newPost = {
      id: (posts.length + 1).toString(),
      title: newPostTitle,
      content: newPostContent,
      category: newPostCategory,
      status: newPostStatus,
      author: "Admin",
      date: new Date().toISOString().split('T')[0],
      comments: 0,
      featuredImage: newPostFeaturedImage,
      tags: newPostTags
    };
    
    // Add to posts
    setPosts([...posts, newPost]);
    toast.success("Post created successfully!");
    
    // Reset form and close dialog
    resetForm();
    setShowAddPostDialog(false);
  };

  const handleEditPost = (postId: string) => {
    // Find the post
    const postToEdit = posts.find(post => post.id === postId);
    if (!postToEdit) return;

    // Set form values
    setNewPostTitle(postToEdit.title);
    setNewPostContent(postToEdit.content);
    setNewPostCategory(postToEdit.category);
    setNewPostStatus(postToEdit.status);
    setNewPostFeaturedImage(postToEdit.featuredImage);
    setNewPostTags(postToEdit.tags || []);
    setCurrentPostId(postId);

    // Open edit dialog
    setShowEditPostDialog(true);
  };

  const saveEditedPost = () => {
    if (!newPostTitle.trim()) {
      toast.error("Please enter a post title");
      return;
    }

    // Update post
    const updatedPosts = posts.map(post => {
      if (post.id === currentPostId) {
        return {
          ...post,
          title: newPostTitle,
          content: newPostContent,
          category: newPostCategory,
          status: newPostStatus,
          featuredImage: newPostFeaturedImage,
          tags: newPostTags
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    toast.success("Post updated successfully!");
    
    // Reset form and close dialog
    resetForm();
    setShowEditPostDialog(false);
  };

  const confirmDeletePost = (postId: string) => {
    setCurrentPostId(postId);
    setShowDeleteConfirm(true);
  };

  const deletePost = () => {
    // Remove post
    setPosts(posts.filter(post => post.id !== currentPostId));
    toast.success("Post deleted successfully!");
    setShowDeleteConfirm(false);
  };

  const generateWithAI = () => {
    // In a real app, this would call an AI service
    toast.info("Generating content with AI...");
    
    setTimeout(() => {
      setNewPostContent(
        "# Generated AI Content\n\nThis is an AI-generated blog post about " + 
        newPostTitle + ".\n\n## Introduction\n\nAI-powered content generation can help you create engaging blog posts quickly and efficiently. This post explores key aspects related to your topic.\n\n## Key Points\n\n1. First important point about the topic\n2. Second important point with more details\n3. Third important point to consider\n\n## Conclusion\n\nIn conclusion, this AI-generated post provides a starting point that you can expand upon with your expertise."
      );
      toast.success("AI content generated! Edit as needed.");
    }, 1500);
  };

  const handleGenerateFullPost = () => {
    if (!aiTopic.trim()) {
      toast.error("Please enter a topic for your blog post");
      return;
    }

    setAiGenerating(true);

    // In a real app, this would call an AI service
    setTimeout(() => {
      // Generate a full post with AI
      const generatedPost = {
        id: (posts.length + 1).toString(),
        title: aiTopic,
        content: "# " + aiTopic + "\n\n## Introduction\n\nWelcome to this comprehensive guide about " + 
                aiTopic + ". In this article, we'll explore everything you need to know about this fascinating topic.\n\n" +
                "## What is " + aiTopic + "?\n\n" + aiTopic + " refers to an innovative approach to solving complex problems in the digital world. " +
                "By leveraging advanced technologies and methodologies, it provides unprecedented capabilities for businesses and individuals alike.\n\n" +
                "## Key Benefits\n\n1. **Enhanced Efficiency** - Streamline your workflow and save valuable time\n" +
                "2. **Improved Results** - Achieve better outcomes through intelligent optimization\n" +
                "3. **Future-Proof Solutions** - Stay ahead of the curve with cutting-edge capabilities\n\n" +
                "## How to Get Started\n\n1. Identify your specific needs and goals\n" +
                "2. Research available tools and platforms\n" +
                "3. Start with a small pilot project\n" +
                "4. Scale based on initial results\n\n" +
                "## Conclusion\n\n" + aiTopic + " represents a significant advancement in how we approach digital solutions. " +
                "By incorporating these concepts into your strategy, you'll be well-positioned to thrive in today's competitive landscape.",
        category: aiCategory || "Technology",
        status: "draft",
        author: "AI Assistant",
        date: new Date().toISOString().split('T')[0],
        comments: 0,
        featuredImage: "https://images.unsplash.com/photo-1677442135145-40703ad880fa?w=500&auto=format&fit=crop&q=60",
        tags: [aiCategory || "Technology", "AI Generated"]
      };
      
      // Add to posts
      setPosts([...posts, generatedPost]);
      
      // Reset and close dialog
      setAiTopic("");
      setAiCategory("");
      setAiGenerating(false);
      setShowAIGenerateDialog(false);
      
      toast.success("AI has generated a new blog post! View it in the post list.");
    }, 2000);
  };

  const resetForm = () => {
    setNewPostTitle("");
    setNewPostContent("");
    setNewPostCategory("");
    setNewPostStatus("draft");
    setNewPostFeaturedImage("");
    setNewPostTags([]);
    setEditorTab("write");
    setCurrentPostId("");
  };

  const handleNavigateToSection = (section: string) => {
    navigate(`/admin/${section}`);
  };

  const renderEditor = () => (
    <div className="grid gap-4">
      <Tabs value={editorTab} onValueChange={setEditorTab} className="w-full">
        <TabsList>
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="write" className="min-h-[400px]">
          <div className="grid gap-4">
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => setNewPostContent(prev => prev + "# ")}>
                  H1
                </Button>
                <Button size="sm" variant="outline" onClick={() => setNewPostContent(prev => prev + "## ")}>
                  H2
                </Button>
                <Button size="sm" variant="outline" onClick={() => setNewPostContent(prev => prev + "### ")}>
                  H3
                </Button>
                <Button size="sm" variant="outline" onClick={() => setNewPostContent(prev => prev + "**Bold Text**")}>
                  Bold
                </Button>
                <Button size="sm" variant="outline" onClick={() => setNewPostContent(prev => prev + "_Italic Text_")}>
                  Italic
                </Button>
                <Button size="sm" variant="outline" onClick={() => setNewPostContent(prev => prev + "[Link Text](https://example.com)")}>
                  Link
                </Button>
                <Button size="sm" variant="outline" onClick={() => setNewPostContent(prev => prev + "![Image Alt](https://example.com/image.jpg)")}>
                  Image
                </Button>
                <Button size="sm" variant="outline" onClick={() => setNewPostContent(prev => prev + "- List Item")}>
                  List
                </Button>
                <Button 
                  size="sm" 
                  onClick={generateWithAI}
                  className="ml-auto bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate with AI
                </Button>
              </div>
            </div>
            
            <Textarea
              placeholder="Write your content here. Supports Markdown."
              rows={12}
              className="min-h-[350px] font-mono"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="min-h-[400px]">
          <Card>
            <CardContent className="p-4 prose dark:prose-invert max-w-none min-h-[400px]">
              <h1>{newPostTitle || "Post Title"}</h1>
              {newPostFeaturedImage && (
                <img 
                  src={newPostFeaturedImage} 
                  alt="Featured" 
                  className="w-full h-auto rounded-md mb-4 max-h-[300px] object-cover" 
                />
              )}
              {newPostContent ? (
                <div 
                  className="whitespace-pre-wrap" 
                  dangerouslySetInnerHTML={{ 
                    __html: newPostContent.replace(/\n/g, "<br />")
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/_(.*?)_/g, "<em>$1</em>")
                      .replace(/# (.*?)(\n|$)/g, "<h1>$1</h1>")
                      .replace(/## (.*?)(\n|$)/g, "<h2>$1</h2>")
                      .replace(/### (.*?)(\n|$)/g, "<h3>$1</h3>")
                  }}
                ></div>
              ) : (
                <p className="text-gray-400">No content yet. Start writing in the Write tab.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="post-status">Post Status</Label>
              <Select value={newPostStatus} onValueChange={setNewPostStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="featured-image">Featured Image URL</Label>
              <div className="flex gap-2">
                <Input
                  id="featured-image"
                  placeholder="https://example.com/image.jpg"
                  value={newPostFeaturedImage}
                  onChange={(e) => setNewPostFeaturedImage(e.target.value)}
                />
                <Button variant="outline" size="icon">
                  <Image className="h-4 w-4" />
                </Button>
              </div>
              {newPostFeaturedImage && (
                <div className="mt-2 aspect-video relative rounded overflow-hidden border">
                  <img 
                    src={newPostFeaturedImage} 
                    alt="Featured preview" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="post-tags">Tags</Label>
              <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                {newPostTags.map((tag, index) => (
                  <Badge key={index} className="px-2 py-1">
                    {tag}
                    <button 
                      className="ml-2 text-xs" 
                      onClick={() => setNewPostTags(newPostTags.filter((_, i) => i !== index))}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                <Input
                  className="flex-grow min-w-[150px]"
                  placeholder="Add a tag and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const inputEl = e.target as HTMLInputElement;
                      const newTag = inputEl.value.trim();
                      if (newTag && !newPostTags.includes(newTag)) {
                        setNewPostTags([...newPostTags, newTag]);
                        inputEl.value = '';
                      }
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="seo-description">SEO Description</Label>
              <Textarea
                id="seo-description"
                placeholder="Enter SEO description"
                rows={3}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Posts Management</h1>
        <div className="flex gap-2">
          <Dialog open={showAIGenerateDialog} onOpenChange={setShowAIGenerateDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 hover:bg-purple-200">
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Blog with AI
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Generate Blog with AI</DialogTitle>
                <DialogDescription>
                  Enter a topic and the AI will generate a complete blog post for you.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="ai-topic">Blog Topic</Label>
                  <Input
                    id="ai-topic"
                    placeholder="e.g., 'The Future of AI in Web Development'"
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ai-category">Category</Label>
                  <Select value={aiCategory} onValueChange={setAiCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAIGenerateDialog(false)}>Cancel</Button>
                <Button 
                  onClick={handleGenerateFullPost}
                  disabled={aiGenerating}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {aiGenerating ? "Generating..." : "Generate Blog"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showAddPostDialog} onOpenChange={setShowAddPostDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px] h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogDescription>
                  Add a new blog post to your website. Fill in the details below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="post-title">Post Title</Label>
                  <Input
                    id="post-title"
                    placeholder="Enter post title"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="post-category">Category</Label>
                  <Select value={newPostCategory} onValueChange={setNewPostCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {renderEditor()}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  resetForm();
                  setShowAddPostDialog(false);
                }}>Cancel</Button>
                <Button onClick={handleAddPost}>Create Post</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit Post Dialog */}
        <Dialog open={showEditPostDialog} onOpenChange={setShowEditPostDialog}>
          <DialogContent className="sm:max-w-[900px] h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Post</DialogTitle>
              <DialogDescription>
                Make changes to your blog post.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-post-title">Post Title</Label>
                <Input
                  id="edit-post-title"
                  placeholder="Enter post title"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-post-category">Category</Label>
                <Select value={newPostCategory} onValueChange={setNewPostCategory}>
                  <SelectTrigger id="edit-post-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {renderEditor()}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                resetForm();
                setShowEditPostDialog(false);
              }}>Cancel</Button>
              <Button onClick={saveEditedPost}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this post? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
              <Button variant="destructive" onClick={deletePost}>Delete Post</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-3/4">
          <div className="flex space-x-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search posts by title or category..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Blog Posts</CardTitle>
              <CardDescription>
                Manage your blog posts. You can create, edit, and delete posts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map(post => (
                      <TableRow key={post.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {post.featuredImage && (
                              <div className="w-8 h-8 rounded overflow-hidden bg-gray-100">
                                <img src={post.featuredImage} alt="" className="w-full h-full object-cover" />
                              </div>
                            )}
                            {post.title}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{post.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={post.status === "published" ? "default" : "secondary"}
                            className={post.status === "published" ? "bg-green-500" : ""}
                          >
                            {post.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{post.author}</TableCell>
                        <TableCell>{post.date}</TableCell>
                        <TableCell>{post.comments}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditPost(post.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => confirmDeletePost(post.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No posts found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Content Management</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleNavigateToSection("post-categories")}
                >
                  <Layout className="mr-2 h-4 w-4" />
                  Categories
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleNavigateToSection("post-subcategories")}
                >
                  <ListFilter className="mr-2 h-4 w-4" />
                  Subcategories
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleNavigateToSection("post-tags")}
                >
                  <Tags className="mr-2 h-4 w-4" />
                  Tags
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Stats</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total Posts</span>
                  <span className="font-medium">{posts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Published</span>
                  <span className="font-medium">{posts.filter(p => p.status === "published").length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Drafts</span>
                  <span className="font-medium">{posts.filter(p => p.status === "draft").length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Categories</span>
                  <span className="font-medium">{categories.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Tags</span>
                  <span className="font-medium">{tags.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
