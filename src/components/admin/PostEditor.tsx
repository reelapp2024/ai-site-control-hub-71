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
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import { useEditorState } from "@/hooks/use-editor-state";
import EditorToolbar from "./EditorToolbar";

interface PostEditorProps {
  postId?: string;
}

export function PostEditor({ postId }: PostEditorProps) {
  const navigate = useNavigate();
  const params = useParams();
  const currentPostId = postId || params.postId;
  const isEditMode = !!currentPostId;
  
  const [editorTab, setEditorTab] = useState("write");
  const [editorView, setEditorView] = useState<"visual" | "code">("visual");
  const [postTitle, setPostTitle] = useState("");
  const [postSlug, setPostSlug] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postHtmlContent, setPostHtmlContent] = useState("");
  const [postCategory, setPostCategory] = useState<string[]>([]);
  const [postStatus, setPostStatus] = useState("draft");
  const [postFeaturedImage, setPostFeaturedImage] = useState("");
  const [featuredImageAlt, setFeaturedImageAlt] = useState("");
  const [postTags, setPostTags] = useState<string[]>([]);
  const [postAuthor, setPostAuthor] = useState("");
  const [publishDate, setPublishDate] = useState<Date | undefined>(new Date());
  const [autoSaveInterval, setAutoSaveInterval] = useState<number | null>(null);
  const [lastSaved, setLastSaved] = useState<string>("");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readTime, setReadTime] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedBgColor, setSelectedBgColor] = useState("");
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [matchWholeWord, setMatchWholeWord] = useState(false);
  const [currentChart, setCurrentChart] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [ogImage, setOgImage] = useState("");
  
  const { 
    state: editorState, 
    editorRef,
    updateContent, 
    updateHtmlContent,
    applyFormat,
    insertHTML,
    insertImage,
    insertVideo,
    insertTable,
    insertLink,
    undo,
    redo
  } = useEditorState(postHtmlContent);

  useEffect(() => {
    if (!isEditMode && postTitle && !postSlug) {
      setPostSlug(postTitle.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-'));
    }
  }, [postTitle, isEditMode, postSlug]);

  const categories = [
    { id: "1", name: "Tutorial", slug: "tutorial" },
    { id: "2", name: "Guide", slug: "guide" },
    { id: "3", name: "News", slug: "news" },
    { id: "4", name: "Performance", slug: "performance" },
    { id: "5", name: "Technology", slug: "technology" },
  ];

  const authors = [
    { id: "1", name: "Admin" },
    { id: "2", name: "Editor" },
    { id: "3", name: "Contributor" }
  ];

  const posts = [
    {
      id: "1",
      title: "Getting Started with AI WebGen",
      category: ["Tutorial"],
      status: "published",
      author: "Admin",
      date: "2023-05-15",
      comments: 5,
      content: "This is a comprehensive guide to getting started with AI WebGen. Learn how to create your first AI-powered website in minutes.",
      featuredImage: "https://images.unsplash.com/photo-1677442135145-40703ad880fa?w=500&auto=format&fit=crop&q=60",
      featuredImageAlt: "AI generated abstract image",
      tags: ["AI", "Tutorial", "Beginner"],
      slug: "getting-started-with-ai-webgen",
      metaTitle: "Getting Started with AI WebGen - Complete Tutorial",
      metaDescription: "Learn how to create your first AI-powered website in minutes with our comprehensive guide to AI WebGen.",
      focusKeyword: "AI WebGen tutorial",
      canonicalUrl: "https://example.com/getting-started-with-ai-webgen",
      ogImage: "https://images.unsplash.com/photo-1677442135145-40703ad880fa?w=1200&auto=format&fit=crop&q=80"
    },
    {
      id: "2",
      title: "How to Customize Your Website Templates",
      category: ["Guide"],
      status: "published",
      author: "Editor",
      date: "2023-05-18",
      comments: 3,
      content: "Learn how to customize the built-in templates to create unique websites that match your brand identity.",
      featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60",
      featuredImageAlt: "Person coding on laptop",
      tags: ["Templates", "Customization"],
      slug: "how-to-customize-website-templates",
      metaTitle: "How to Customize Your Website Templates | AI WebGen",
      metaDescription: "Learn how to customize the built-in templates to create unique websites that match your brand identity with AI WebGen.",
      focusKeyword: "customize website templates",
      canonicalUrl: "https://example.com/how-to-customize-website-templates",
      ogImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80"
    },
  ];

  useEffect(() => {
    if (postContent) {
      const cleanText = postContent.replace(/<[^>]*>/g, ' ');
      const words = cleanText.split(/\s+/).filter(word => word.length > 0);
      const chars = cleanText.length;
      
      setWordCount(words.length);
      setCharCount(chars);
      setReadTime(Math.ceil(words.length / 200));
    } else {
      setWordCount(0);
      setCharCount(0);
      setReadTime(0);
    }
  }, [postContent]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (postTitle || postContent) {
        console.log("Auto-saving post...");
        setLastSaved(new Date().toLocaleTimeString());
        toast.info("Post auto-saved", { duration: 2000 });
      }
    }, 30000);
    
    setAutoSaveInterval(interval);
    
    return () => {
      if (autoSaveInterval) {
        window.clearInterval(autoSaveInterval);
      }
    };
  }, [postTitle, postContent]);

  useEffect(() => {
    if (isEditMode) {
      const post = posts.find(p => p.id === currentPostId);
      if (post) {
        setPostTitle(post.title);
        setPostContent(post.content);
        setPostHtmlContent(`<p>${post.content}</p>`);
        updateHtmlContent(`<p>${post.content}</p>`);
        setPostCategory(post.category || []);
        setPostStatus(post.status);
        setPostFeaturedImage(post.featuredImage);
        setFeaturedImageAlt(post.featuredImageAlt || "");
        setPostTags(post.tags || []);
        setPostAuthor(post.author);
        setPublishDate(post.date ? new Date(post.date) : new Date());
        setPostSlug(post.slug || "");
        setMetaTitle(post.metaTitle || post.title);
        setMetaDescription(post.metaDescription || "");
        setFocusKeyword(post.focusKeyword || "");
        setCanonicalUrl(post.canonicalUrl || "");
        setOgImage(post.ogImage || post.featuredImage);
      } else {
        toast.error("Post not found");
        navigate('/posts');
      }
    }
  }, [currentPostId, isEditMode, navigate]);

  useEffect(() => {
    if (editorState.htmlContent !== postHtmlContent) {
      setPostHtmlContent(editorState.htmlContent);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = editorState.htmlContent;
      setPostContent(tempDiv.innerText || tempDiv.textContent || '');
    }
  }, [editorState.htmlContent]);

  const handleSave = () => {
    if (!postTitle.trim()) {
      toast.error("Please enter a post title");
      return;
    }

    toast.success(isEditMode ? "Post updated successfully!" : "Post created successfully!");
    setLastSaved(new Date().toLocaleTimeString());
    navigate('/posts');
  };

  const generateWithAI = () => {
    toast.info("Generating content with AI...");
    
    setTimeout(() => {
      const generatedHtml = `
        <h1>Generated AI Content</h1>
        <p>This is an AI-generated blog post about ${postTitle}.</p>
        <h2>Introduction</h2>
        <p>AI-powered content generation can help you create engaging blog posts quickly and efficiently. This post explores key aspects related to your topic.</p>
        <h2>Key Points</h2>
        <ol>
          <li>First important point about the topic</li>
          <li>Second important point with more details</li>
          <li>Third important point to consider</li>
        </ol>
        <h2>Conclusion</h2>
        <p>In conclusion, this AI-generated post provides a starting point that you can expand upon with your expertise.</p>
      `;
      
      updateHtmlContent(generatedHtml);
      setPostContent(`# Generated AI Content

This is an AI-generated blog post about ${postTitle}.

## Introduction

AI-powered content generation can help you create engaging blog posts quickly and efficiently. This post explores key aspects related to your topic.

## Key Points

1. First important point about the topic
2. Second important point with more details
3. Third important point to consider

## Conclusion

In conclusion, this AI-generated post provides a starting point that you can expand upon with your expertise.`);
      
      toast.success("AI content generated! Edit as needed.");
    }, 1500);
  };

  const calculateSEOScore = () => {
    let score = 0;
    
    if (postTitle && postTitle.length >= 10 && postTitle.length <= 60) score += 20;
    if (metaDescription && metaDescription.length >= 120 && metaDescription.length <= 160) score += 20;
    if (focusKeyword && postContent.includes(focusKeyword)) score += 20;
    if (postContent && postContent.length >= 300) score += 20;
    if (postFeaturedImage) score += 20;
    
    return score;
  };

  const seoScore = calculateSEOScore();
  
  const handleEditorAction = (action: string, value?: any) => {
    switch (action) {
      case "undo":
        undo();
        break;
      case "redo":
        redo();
        break;
      case "bold":
      case "italic":
      case "underline":
      case "strikethrough":
      case "blockquote":
      case "code":
      case "h1":
      case "h2":
      case "h3":
      case "align-left":
      case "align-center":
      case "align-right":
      case "ordered-list":
      case "unordered-list":
        applyFormat(action);
        break;
      case "color":
      case "background":
        applyFormat(action, value);
        break;
      case "link":
        insertLink(value.url, value.text, value.newTab);
        break;
      case "image":
        insertImage(value.src, value.alt, value.align);
        break;
      case "video":
        insertVideo(value);
        break;
      case "table":
        insertTable(value.rows, value.cols);
        break;
      case "emoji":
      case "shortcode":
      case "chart":
        insertHTML(value);
        break;
      case "file":
        setIsUploading(true);
        setTimeout(() => {
          const fileName = prompt("Enter file name:", "document.pdf");
          const fileUrl = "https://example.com/" + (fileName || "document.pdf");
          
          const fileHtml = `<a href="${fileUrl}" download class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            Download ${fileName}
          </a>`;
          
          insertHTML(fileHtml);
          
          setIsUploading(false);
          toast.success("File upload link added");
        }, 1000);
        break;
    }
  };

  const handleCodeTabChange = (view: "visual" | "code") => {
    setEditorView(view);
  };
  
  const handleFindReplace = () => {
    if (!findText) {
      toast.error("Please enter text to find");
      return;
    }
    
    if (editorView === "code") {
      let content = postContent;
      let flags = caseSensitive ? 'g' : 'gi';
      let searchTerm = findText;
      
      if (matchWholeWord) {
        searchTerm = `\\b${searchTerm}\\b`;
      }
      
      const regex = new RegExp(searchTerm, flags);
      
      if (replaceText) {
        content = content.replace(regex, replaceText);
        setPostContent(content);
        toast.success(`Replaced all occurrences of "${findText}"`);
      } else {
        const matches = content.match(regex);
        toast.info(`Found ${matches ? matches.length : 0} occurrences of "${findText}"`);
      }
    } else {
      let content = postHtmlContent;
      let flags = caseSensitive ? 'g' : 'gi';
      let searchTerm = findText;
      
      if (matchWholeWord) {
        searchTerm = `\\b${searchTerm}\\b`;
      }
      
      const regex = new RegExp(searchTerm, flags);
      
      if (replaceText) {
        content = content.replace(regex, replaceText);
        updateHtmlContent(content);
        toast.success(`Replaced all occurrences of "${findText}"`);
      } else {
        const textContent = content.replace(/<[^>]*>/g, ' ');
        const matches = textContent.match(regex);
        toast.info(`Found ${matches ? matches.length : 0} occurrences of "${findText}"`);
      }
    }
  };
  
  const handleContentChange = () => {
    if (editorRef.current) {
      updateHtmlContent(editorRef.current.innerHTML);
    }
  };
  
  const handleContentPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
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

      {lastSaved && (
        <div className="text-sm text-muted-foreground">
          Last saved at: {lastSaved}
        </div>
      )}

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
            <Label htmlFor="post-slug">URL Slug</Label>
            <Input
              id="post-slug"
              placeholder="post-url-slug"
              value={postSlug}
              onChange={(e) => setPostSlug(e.target.value)}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="post-author">Author</Label>
            <Select value={postAuthor} onValueChange={setPostAuthor}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select an author" />
              </SelectTrigger>
              <SelectContent>
                {authors.map((author) => (
                  <SelectItem key={author.id} value={author.name}>
                    {author.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="post-category">Category</Label>
            <div className="mt-1.5 grid gap-2 border rounded-md p-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center gap-2">
                  <Checkbox 
                    id={`category-${category.id}`}
                    checked={postCategory.includes(category.name)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPostCategory([...postCategory, category.name]);
                      } else {
                        setPostCategory(postCategory.filter(c => c !== category.name));
                      }
                    }}
                  />
                  <Label 
                    htmlFor={`category-${category.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
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
            
            {postStatus === "scheduled" && (
              <div className="mt-2">
                <Label htmlFor="publish-date">Publish Date & Time</Label>
                <div className="flex gap-2 mt-1.5">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <Calendar className="mr-2 h-4 w-4" />
                        {publishDate ? format(publishDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={publishDate}
                        onSelect={setPublishDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Input
                    type="time"
                    value={publishDate ? format(publishDate, "HH:mm") : ""}
                    onChange={(e) => {
                      if (publishDate && e.target.value) {
                        const [hours, minutes] = e.target.value.split(':');
                        const newDate = new Date(publishDate);
                        newDate.setHours(parseInt(hours), parseInt(minutes));
                        setPublishDate(newDate);
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4">
          <Tabs value={editorTab} onValueChange={setEditorTab} className="w-full">
            <TabsList>
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="write" className="min-h-[500px]">
              <div className="grid gap-4">
                <Card className="p-2">
                  <EditorToolbar 
                    editorView={editorView}
                    handleCodeTabChange={handleCodeTabChange}
                    wordCount={wordCount}
                    readTime={readTime}
                    onAction={handleEditorAction}
                    isUploading={isUploading}
                    showEmojiPicker={showEmojiPicker}
                    showColorPicker={showColorPicker}
                    setShowEmojiPicker={setShowEmojiPicker}
                    setShowColorPicker={setShowColorPicker}
                    showFindReplace={showFindReplace}
                    setShowFindReplace={setShowFindReplace}
                    selectedColor={selectedColor}
                    setSelectedColor={setSelectedColor}
                    selectedBgColor={selectedBgColor}
                    setSelectedBgColor={setSelectedBgColor}
                    findText={findText}
                    setFindText={setFindText}
                    replaceText={replaceText}
                    setReplaceText={setReplaceText}
                    caseSensitive={caseSensitive}
                    setCaseSensitive={setCaseSensitive}
                    matchWholeWord={matchWholeWord}
                    setMatchWholeWord={setMatchWholeWord}
                    handleFindReplace={handleFindReplace}
                    generateWithAI={generateWithAI}
                  />
                </Card>
                
                {editorView === "code" ? (
                  <Textarea
                    placeholder="Write your content here. Supports Markdown."
                    rows={16}
                    className="min-h-[450px] font-mono"
                    value={postContent}
                    onChange={(e) => {
                      setPostContent(e.target.value);
                    }}
                  />
                ) : (
                  <div className="border rounded-md p-4 min-h-[450px]">
                    <div
                      ref={editorRef}
                      contentEditable
                      className="outline-none min-h-[440px] prose prose-sm max-w-none"
                      onInput={handleContentChange}
                      onPaste={handleContentPaste}
                      dangerouslySetInnerHTML={{ __html: editorState.htmlContent || '<p>Start writing your content here...</p>' }}
                    ></div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="min-h-[500px]">
              <Card className="p-6">
                <h1 className="text-3xl font-bold mb-4">{postTitle || "Post Title"}</h1>
                {postFeaturedImage && (
                  <figure className="mb-4">
                    <img 
                      src={postFeaturedImage} 
                      alt={featuredImageAlt || "Featured image"} 
                      className="w-full h-auto rounded-md max-h-[300px] object-cover" 
                    />
                    {featuredImageAlt && (
                      <figcaption className="text-sm text-gray-500 mt-1">{featuredImageAlt}</figcaption>
                    )}
                  </figure>
                )}
                {editorView === "code" ? (
                  postContent ? (
                    <div 
                      className="prose prose-lg max-w-none dark:prose-invert whitespace-pre-wrap" 
                      dangerouslySetInnerHTML={{ 
                        __html: postContent.replace(/\n/g, "<br />")
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                          .replace(/_(.*?)_/g, "<em>$1</em>")
                          .replace(/~~/g, "<s>")
                          .replace(/~~/g, "</s>")
                          .replace(/# (.*?)(\n|$)/g, "<h1>$1</h1>")
                          .replace(/## (.*?)(\n|$)/g, "<h2>$1</h2>")
                          .replace(/### (.*?)(\n|$)/g, "<h3>$1</h3>")
                          .replace(/> (.*?)(\n|$)/g, "<blockquote>$1</blockquote>")
                          .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
                          .replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2' target='_blank' rel='noopener noreferrer'>$1</a>")
                      }}
                    ></div>
                  ) : (
                    <p className="text-gray-400">No content yet. Start writing in the Write tab.</p>
                  )
                ) : (
                  editorState.htmlContent ? (
                    <div 
                      className="prose prose-lg max-w-none dark:prose-invert" 
                      dangerouslySetInnerHTML={{ __html: editorState.htmlContent }}
                    ></div>
                  ) : (
                    <p className="text-gray-400">No content yet. Start writing in the Write tab.</p>
                  )
                )}
              </Card>
            </TabsContent>
            
            <TabsContent value="seo" className="min-h-[500px]">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="meta-title">Meta Title</Label>
                  <Input
                    id="meta-title"
                    placeholder="SEO Title (max 60 characters)"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    maxLength={60}
                  />
                  <div className="text-xs text-right text-muted-foreground">
                    {metaTitle.length}/60 characters
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="meta-description">Meta Description</Label>
                  <Textarea
                    id="meta-description"
                    placeholder="SEO Description (max 160 characters)"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    maxLength={160}
                    rows={3}
                  />
                  <div className="text-xs text-right text-muted-foreground">
                    {metaDescription.length}/160 characters
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="focus-keyword">Focus Keyword</Label>
                  <Input
                    id="focus-keyword"
                    placeholder="Main keyword for this post"
                    value={focusKeyword}
                    onChange={(e) => setFocusKeyword(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="canonical-url">Canonical URL</Label>
                  <Input
                    id="canonical-url"
                    placeholder="https://example.com/original-post"
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="og-image">OG Image</Label>
                  <div className="flex gap-2">
                    <Input
                      id="og-image"
                      placeholder="https://example.com/image.jpg"
                      value={ogImage}
                      onChange={(e) => setOgImage(e.target.value)}
                    />
                    <Button variant="outline" size="icon">
                      <Image className="h-4 w-4" />
                    </Button>
                  </div>
                  {ogImage && (
                    <div className="mt-2 aspect-video relative rounded overflow-hidden border">
                      <img 
                        src={ogImage} 
                        alt="OG Image preview" 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">SEO Score</h3>
                    <div className={`text-lg font-bold ${
                      seoScore >= 80 ? "text-green-500" : 
                      seoScore >= 50 ? "text-amber-500" : 
                      "text-red-500"
                    }`}>
                      {seoScore}/100
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Meta Title</span>
                      <Badge 
                        variant={metaTitle && metaTitle.length >= 10 && metaTitle.length <= 60 ? "default" : "outline"}
                        className={metaTitle && metaTitle.length >= 10 && metaTitle.length <= 60 ? "bg-green-500" : ""}
                      >
                        {metaTitle && metaTitle.length >= 10 && metaTitle.length <= 60 ? "Good" : "Needs Improvement"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Meta Description</span>
                      <Badge 
                        variant={metaDescription && metaDescription.length >= 120 && metaDescription.length <= 160 ? "default" : "outline"}
                        className={metaDescription && metaDescription.length >= 120 && metaDescription.length <= 160 ? "bg-green-500" : ""}
                      >
                        {metaDescription && metaDescription.length >= 120 && metaDescription.length <= 160 ? "Good" : "Needs Improvement"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Focus Keyword Usage</span>
                      <Badge 
                        variant={focusKeyword && postContent.includes(focusKeyword) ? "default" : "outline"}
                        className={focusKeyword && postContent.includes(focusKeyword) ? "bg-green-500" : ""}
                      >
                        {focusKeyword && postContent.includes(focusKeyword) ? "Good" : "Not Found in Content"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Content Length</span>
                      <Badge 
                        variant={postContent.length >= 300 ? "default" : "outline"}
                        className={postContent.length >= 300 ? "bg-green-500" : ""}
                      >
                        {postContent.length >= 300 ? "Good" : "Too Short"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Featured Image</span>
                      <Badge 
                        variant={postFeaturedImage ? "default" : "outline"}
                        className={postFeaturedImage ? "bg-green-500" : ""}
                      >
                        {postFeaturedImage ? "Present" : "Missing"}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Social Media Preview</h3>
                  
                  <div className="border rounded-md overflow-hidden mb-6">
                    <div className="bg-blue-50 dark:bg-blue-950 p-2 text-sm text-blue-600 dark:text-blue-400">
                      Facebook
                    </div>
                    <div className="p-2">
                      {ogImage && (
                        <div className="aspect-video w-full mb-2 rounded overflow-hidden bg-gray-100">
                          <img src={ogImage} alt="OG Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="mt-2">
                        <div className="text-sm text-muted-foreground overflow-hidden text-ellipsis">
                          {canonicalUrl || "https://yourwebsite.com"}
                        </div>
                        <h4 className="text-base font-semibold line-clamp-1">
                          {metaTitle || postTitle || "Post Title"}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {metaDescription || "Your meta description will appear here. Make sure to add one for better SEO."}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md overflow-hidden">
                    <div className="bg-sky-50 dark:bg-sky-950 p-2 text-sm text-sky-600 dark:text-sky-400">
                      Twitter Card
                    </div>
                    <div className="p-2">
                      {ogImage && (
                        <div className="aspect-[2/1] w-full mb-2 rounded overflow-hidden bg-gray-100">
                          <img src={ogImage} alt="Twitter Card Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="mt-2">
                        <h4 className="text-base font-semibold line-clamp-1">
                          {metaTitle || postTitle || "Post Title"}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {metaDescription || "Your meta description will appear here. Make sure to add one for better SEO."}
                        </p>
                        <div className="text-sm text-muted-foreground overflow-hidden text-ellipsis mt-1">
                          {canonicalUrl || "https://yourwebsite.com"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="featured-image">Featured Image</Label>
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
                    <div className="mt-2">
                      <div className="aspect-video relative rounded overflow-hidden border">
                        <img 
                          src={postFeaturedImage} 
                          alt="Featured preview" 
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                      <Input
                        className="mt-2"
                        placeholder="Image alt text"
                        value={featuredImageAlt}
                        onChange={(e) => setFeaturedImageAlt(e.target.value)}
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
                  <div className="flex items-center gap-2">
                    <Checkbox id="allow-comments" defaultChecked />
                    <Label htmlFor="allow-comments">Allow Comments</Label>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
