
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Save, Sparkles, Image } from "lucide-react";

export function PostEditor() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const isEditMode = !!postId;
  
  const [editorTab, setEditorTab] = useState("write");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postCategory, setPostCategory] = useState("");
  const [postStatus, setPostStatus] = useState("draft");
  const [postFeaturedImage, setPostFeaturedImage] = useState("");
  const [postTags, setPostTags] = useState<string[]>([]);
  
  // Mock categories
  const categories = [
    { id: "1", name: "Tutorial", slug: "tutorial" },
    { id: "2", name: "Guide", slug: "guide" },
    { id: "3", name: "News", slug: "news" },
    { id: "4", name: "Performance", slug: "performance" },
    { id: "5", name: "Technology", slug: "technology" },
  ];

  // Mock posts data
  const posts = [
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
  ];

  // Load post data if editing existing post
  useEffect(() => {
    if (isEditMode) {
      const post = posts.find(p => p.id === postId);
      if (post) {
        setPostTitle(post.title);
        setPostContent(post.content);
        setPostCategory(post.category);
        setPostStatus(post.status);
        setPostFeaturedImage(post.featuredImage);
        setPostTags(post.tags || []);
      } else {
        toast.error("Post not found");
        navigate('/posts');
      }
    }
  }, [postId, isEditMode, navigate]);

  const handleSave = () => {
    if (!postTitle.trim()) {
      toast.error("Please enter a post title");
      return;
    }

    // In a real app, this would save to a database
    toast.success(isEditMode ? "Post updated successfully!" : "Post created successfully!");
    navigate('/posts');
  };

  const generateWithAI = () => {
    // In a real app, this would call an AI service
    toast.info("Generating content with AI...");
    
    setTimeout(() => {
      setPostContent(
        "# Generated AI Content\n\nThis is an AI-generated blog post about " + 
        postTitle + ".\n\n## Introduction\n\nAI-powered content generation can help you create engaging blog posts quickly and efficiently. This post explores key aspects related to your topic.\n\n## Key Points\n\n1. First important point about the topic\n2. Second important point with more details\n3. Third important point to consider\n\n## Conclusion\n\nIn conclusion, this AI-generated post provides a starting point that you can expand upon with your expertise."
      );
      toast.success("AI content generated! Edit as needed.");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/posts')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Posts
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{isEditMode ? "Edit Post" : "Create New Post"}</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={generateWithAI}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate with AI
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save {isEditMode ? "Changes" : "Post"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <div>
          <Label htmlFor="post-title">Post Title</Label>
          <Input
            id="post-title"
            placeholder="Enter post title"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="post-category">Category</Label>
            <Select value={postCategory} onValueChange={setPostCategory}>
              <SelectTrigger className="mt-1.5">
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

          <div>
            <Label htmlFor="post-status">Status</Label>
            <Select value={postStatus} onValueChange={setPostStatus}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4">
          <Tabs value={editorTab} onValueChange={setEditorTab} className="w-full">
            <TabsList>
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="write" className="min-h-[500px]">
              <div className="grid gap-4">
                <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => setPostContent(prev => prev + "# ")}>
                      H1
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setPostContent(prev => prev + "## ")}>
                      H2
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setPostContent(prev => prev + "### ")}>
                      H3
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setPostContent(prev => prev + "**Bold Text**")}>
                      Bold
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setPostContent(prev => prev + "_Italic Text_")}>
                      Italic
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setPostContent(prev => prev + "[Link Text](https://example.com)")}>
                      Link
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setPostContent(prev => prev + "![Image Alt](https://example.com/image.jpg)")}>
                      Image
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setPostContent(prev => prev + "- List Item")}>
                      List
                    </Button>
                  </div>
                </div>
                
                <Textarea
                  placeholder="Write your content here. Supports Markdown."
                  rows={16}
                  className="min-h-[450px] font-mono"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="min-h-[500px]">
              <Card className="p-6">
                <h1 className="text-3xl font-bold mb-4">{postTitle || "Post Title"}</h1>
                {postFeaturedImage && (
                  <img 
                    src={postFeaturedImage} 
                    alt="Featured" 
                    className="w-full h-auto rounded-md mb-4 max-h-[300px] object-cover" 
                  />
                )}
                {postContent ? (
                  <div 
                    className="prose prose-lg max-w-none dark:prose-invert whitespace-pre-wrap" 
                    dangerouslySetInnerHTML={{ 
                      __html: postContent.replace(/\n/g, "<br />")
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
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="featured-image">Featured Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="featured-image"
                      placeholder="https://example.com/image.jpg"
                      value={postFeaturedImage}
                      onChange={(e) => setPostFeaturedImage(e.target.value)}
                    />
                    <Button variant="outline" size="icon">
                      <Image className="h-4 w-4" />
                    </Button>
                  </div>
                  {postFeaturedImage && (
                    <div className="mt-2 aspect-video relative rounded overflow-hidden border">
                      <img 
                        src={postFeaturedImage} 
                        alt="Featured preview" 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="post-tags">Tags</Label>
                  <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                    {postTags.map((tag, index) => (
                      <Badge key={index} className="px-2 py-1">
                        {tag}
                        <button 
                          className="ml-2 text-xs" 
                          onClick={() => setPostTags(postTags.filter((_, i) => i !== index))}
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
                          if (newTag && !postTags.includes(newTag)) {
                            setPostTags([...postTags, newTag]);
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
      </div>
    </div>
  );
}
