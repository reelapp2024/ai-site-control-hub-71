import { useState, useEffect, useRef } from "react";
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
import { 
  ArrowLeft, Save, Sparkles, Image, Calendar as CalendarIcon, Link, Bold, 
  Italic, Underline, Code, ListOrdered, List, FileText, AlignLeft, AlignCenter, 
  AlignRight, Youtube, FilePlus, Table2, Hash, Undo, Redo, Search, Type, 
  Heading1, Heading2, Heading3, StrikethroughIcon, Quote, PaintBucket, 
  Edit, Eye, Terminal, MessageSquare, BarChart4, Smile
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useEditorState } from "@/hooks/use-editor-state";

interface PostEditorProps {
  postId?: string;
}

export function PostEditor({ postId }: PostEditorProps) {
  const navigate = useNavigate();
  const params = useParams();
  // Use either the prop or the param, with the prop taking precedence
  const currentPostId = postId || params.postId;
  const isEditMode = !!currentPostId;
  const editorRef = useRef<HTMLDivElement>(null);
  const contentEditableRef = useRef<HTMLDivElement>(null);
  
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
  
  // Mock icons for icon inserter
  const mockIcons = ["😊", "👍", "🚀", "💡", "⭐", "🔥", "💯", "👏", "🎉", "🎯", "💪", "🙌", "👀", "🧠", "💭"];

  // SEO fields
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [ogImage, setOgImage] = useState("");

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditMode && postTitle && !postSlug) {
      setPostSlug(postTitle.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-'));
    }
  }, [postTitle, isEditMode, postSlug]);

  // Mock categories
  const categories = [
    { id: "1", name: "Tutorial", slug: "tutorial" },
    { id: "2", name: "Guide", slug: "guide" },
    { id: "3", name: "News", slug: "news" },
    { id: "4", name: "Performance", slug: "performance" },
    { id: "5", name: "Technology", slug: "technology" },
  ];

  // Mock authors
  const authors = [
    { id: "1", name: "Admin" },
    { id: "2", name: "Editor" },
    { id: "3", name: "Contributor" }
  ];
  
  // Mock shortcodes
  const shortcodes = [
    { name: "Contact Form", code: "[contact-form]" },
    { name: "Testimonial Slider", code: "[testimonial-slider]" },
    { name: "Recent Posts", code: "[recent-posts count=3]" },
    { name: "Gallery", code: "[gallery ids=1,2,3]" },
    { name: "Button", code: '[button text="Click Me" url="https://example.com"]' },
    { name: "Call to Action", code: '[cta title="Join Now" description="Sign up today!" button="Get Started"]' },
  ];
  
  // Mock chart templates
  const chartTemplates = [
    { 
      name: "Bar Chart", 
      data: { 
        type: "bar",
        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
        datasets: [
          {
            label: "Sales",
            data: [50, 60, 70, 180, 190]
          }
        ]
      } 
    },
    { 
      name: "Line Chart", 
      data: { 
        type: "line",
        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
        datasets: [
          {
            label: "Views",
            data: [100, 200, 150, 300, 250]
          }
        ]
      } 
    },
    { 
      name: "Pie Chart", 
      data: { 
        type: "pie",
        labels: ["Desktop", "Mobile", "Tablet"],
        datasets: [
          {
            data: [60, 30, 10]
          }
        ]
      } 
    }
  ];

  // Mock posts data
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
    {
      id: "3",
      title: "Upcoming Features in AI WebGen",
      category: ["News"],
      status: "draft",
      author: "Admin",
      date: "2023-05-20",
      comments: 0,
      content: "Get a sneak peek at the exciting new features coming soon to AI WebGen platform.",
      featuredImage: "",
      featuredImageAlt: "",
      tags: ["News", "Features"],
      slug: "upcoming-features-in-ai-webgen",
      metaTitle: "Upcoming Features in AI WebGen | Product Roadmap",
      metaDescription: "Get a sneak peek at the exciting new features coming soon to AI WebGen platform in our latest product roadmap.",
      focusKeyword: "AI WebGen features",
      canonicalUrl: "https://example.com/upcoming-features-in-ai-webgen",
      ogImage: ""
    },
    {
      id: "4",
      title: "Optimizing Your Website for Speed",
      category: ["Performance"],
      status: "published",
      author: "Contributor",
      date: "2023-05-22",
      comments: 8,
      content: "Follow these best practices to optimize your AI-generated website for maximum performance and speed.",
      featuredImage: "https://images.unsplash.com/photo-1607798748738-b15c40d33d57?w=500&auto=format&fit=crop&q=60",
      featuredImageAlt: "Dashboard showing website speed metrics",
      tags: ["Performance", "Optimization"],
      slug: "optimizing-website-for-speed",
      metaTitle: "Optimizing Your AI-Generated Website for Speed | Performance Guide",
      metaDescription: "Follow these best practices to optimize your AI-generated website for maximum performance and speed with our comprehensive guide.",
      focusKeyword: "website speed optimization",
      canonicalUrl: "https://example.com/optimizing-website-for-speed",
      ogImage: "https://images.unsplash.com/photo-1607798748738-b15c40d33d57?w=1200&auto=format&fit=crop&q=80"
    }
  ];

  // Calculate word count, character count, and read time
  useEffect(() => {
    if (postContent) {
      // Clean HTML tags for accurate counting
      const cleanText = postContent.replace(/<[^>]*>/g, ' ');
      const words = cleanText.split(/\s+/).filter(word => word.length > 0);
      const chars = cleanText.length;
      
      setWordCount(words.length);
      setCharCount(chars);
      // Average reading speed: 200 words per minute
      setReadTime(Math.ceil(words.length / 200));
    } else {
      setWordCount(0);
      setCharCount(0);
      setReadTime(0);
    }
  }, [postContent]);

  // Setup autosave
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (postTitle || postContent) {
        console.log("Auto-saving post...");
        setLastSaved(new Date().toLocaleTimeString());
        toast.info("Post auto-saved", { duration: 2000 });
      }
    }, 30000); // Autosave every 30 seconds
    
    setAutoSaveInterval(interval);
    
    return () => {
      if (autoSaveInterval) {
        window.clearInterval(autoSaveInterval);
      }
    };
  }, [postTitle, postContent]);

  // Load post data if editing existing post
  useEffect(() => {
    if (isEditMode) {
      const post = posts.find(p => p.id === currentPostId);
      if (post) {
        setPostTitle(post.title);
        setPostContent(post.content);
        setPostHtmlContent(`<p>${post.content}</p>`);
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

  const handleSave = () => {
    if (!postTitle.trim()) {
      toast.error("Please enter a post title");
      return;
    }

    // In a real app, this would save to a database
    toast.success(isEditMode ? "Post updated successfully!" : "Post created successfully!");
    setLastSaved(new Date().toLocaleTimeString());
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
      
      setPostHtmlContent(`
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
      `);
      
      toast.success("AI content generated! Edit as needed.");
    }, 1500);
  };

  const formatDateTime = (date?: Date) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd'T'HH:mm");
  };

  const calculateSEOScore = () => {
    let score = 0;
    
    // Basic scoring criteria
    if (postTitle && postTitle.length >= 10 && postTitle.length <= 60) score += 20;
    if (metaDescription && metaDescription.length >= 120 && metaDescription.length <= 160) score += 20;
    if (focusKeyword && postContent.includes(focusKeyword)) score += 20;
    if (postContent && postContent.length >= 300) score += 20;
    if (postFeaturedImage) score += 20;
    
    return score;
  };

  const seoScore = calculateSEOScore();
  
  // Enhanced text editor functions
  const insertTextAtCursor = (text: string) => {
    if (editorView === "code") {
      if (editorRef.current) {
        const textarea = editorRef.current.querySelector('textarea');
        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const currentContent = postContent;
          const newContent = 
            currentContent.substring(0, start) + 
            text + 
            currentContent.substring(end);
          
          setPostContent(newContent);
          
          // Set cursor position after inserted text
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + text.length, start + text.length);
          }, 0);
        }
      }
    } else {
      // For visual editor
      if (contentEditableRef.current) {
        // Insert at the end if no selection
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          
          // Create a temporary element
          const tempElement = document.createElement('div');
          tempElement.innerHTML = text;
          
          // Insert its contents
          range.deleteContents();
          const fragment = document.createDocumentFragment();
          let node, lastNode;
          while ((node = tempElement.firstChild)) {
            lastNode = fragment.appendChild(node);
          }
          range.insertNode(fragment);
          
          // Move cursor to the end
          if (lastNode) {
            range.setStartAfter(lastNode);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        } else {
          contentEditableRef.current.innerHTML += text;
        }
        
        // Update the HTML content state
        setPostHtmlContent(contentEditableRef.current.innerHTML);
      }
    }
  };
  
  const insertHeading = (level: number) => {
    const headingText = "Heading " + level;
    
    if (editorView === "code") {
      const prefix = "#".repeat(level) + " ";
      insertTextAtCursor(prefix + headingText + "\n");
    } else {
      insertTextAtCursor(`<h${level}>${headingText}</h${level}>`);
    }
  };

  const insertFormattedText = (format: string) => {
    const selection = window.getSelection();
    let selectedText = "";
    
    if (selection && selection.toString()) {
      selectedText = selection.toString();
    } else {
      selectedText = "Text";
    }
    
    if (editorView === "code") {
      let formattedText = "";
      
      switch (format) {
        case "bold":
          formattedText = `**${selectedText}**`;
          break;
        case "italic":
          formattedText = `_${selectedText}_`;
          break;
        case "underline":
          formattedText = `<u>${selectedText}</u>`;
          break;
        case "strike":
          formattedText = `~~${selectedText}~~`;
          break;
        case "code":
          formattedText = `\`${selectedText}\``;
          break;
        case "quote":
          formattedText = `> ${selectedText}`;
          break;
        default:
          formattedText = selectedText;
      }
      
      insertTextAtCursor(formattedText);
    } else {
      let tag = "";
      
      switch (format) {
        case "bold":
          tag = "strong";
          break;
        case "italic":
          tag = "em";
          break;
        case "underline":
          tag = "u";
          break;
        case "strike":
          tag = "s";
          break;
        case "code":
          tag = "code";
          break;
        case "quote":
          insertTextAtCursor(`<blockquote>${selectedText}</blockquote>`);
          return;
        default:
          tag = "span";
      }
      
      insertTextAtCursor(`<${tag}>${selectedText}</${tag}>`);
    }
  };
  
  const insertList = (type: "ordered" | "unordered") => {
    if (editorView === "code") {
      if (type === "ordered") {
        insertTextAtCursor("1. First item\n2. Second item\n3. Third item\n");
      } else {
        insertTextAtCursor("- First item\n- Second item\n- Third item\n");
      }
    } else {
      if (type === "ordered") {
        insertTextAtCursor(`
          <ol>
            <li>First item</li>
            <li>Second item</li>
            <li>Third item</li>
          </ol>
        `);
      } else {
        insertTextAtCursor(`
          <ul>
            <li>First item</li>
            <li>Second item</li>
            <li>Third item</li>
          </ul>
        `);
      }
    }
  };

  const insertLink = () => {
    const url = prompt("Enter URL:", "https://");
    const text = prompt("Enter link text:", "Link Text");
    const newTab = confirm("Open in new tab?");
    
    if (url && text) {
      if (editorView === "code") {
        insertTextAtCursor(`[${text}](${url}${newTab ? ' "Open in new tab"' : ''})`);
      } else {
        insertTextAtCursor(`<a href="${url}" ${newTab ? 'target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>`);
      }
    }
  };

  const insertImage = () => {
    setIsUploading(true);
    
    // Mock image upload - in a real app, this would be an actual upload
    setTimeout(() => {
      const imageUrl = "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=500&auto=format&fit=crop&q=60";
      const altText = prompt("Enter image alt text:", "Description of image");
      const alignment = prompt("Image alignment (left, center, right):", "center");
      
      if (editorView === "code") {
        insertTextAtCursor(`![${altText || "Image"}](${imageUrl})`);
      } else {
        const alignClass = alignment === 'left' ? 'float-left mr-4' : 
                           alignment === 'right' ? 'float-right ml-4' : 
                           'mx-auto block';
                           
        insertTextAtCursor(`<figure class="${alignClass} my-4">
          <img src="${imageUrl}" alt="${altText || ''}" class="max-w-full h-auto rounded" />
          ${altText ? `<figcaption class="text-center text-sm text-gray-500 mt-2">${altText}</figcaption>` : ''}
        </figure>`);
      }
      
      setIsUploading(false);
      toast.success("Image added to content");
    }, 1500);
  };

  const insertVideo = () => {
    const videoUrl = prompt("Enter YouTube or Vimeo URL:");
    if (videoUrl) {
      // Basic transformation of YouTube/Vimeo URLs to embed format
      let embedUrl = videoUrl;
      
      if (videoUrl.includes('youtube.com/watch?v=')) {
        const videoId = videoUrl.split('v=')[1].split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (videoUrl.includes('youtu.be/')) {
        const videoId = videoUrl.split('youtu.be/')[1];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (videoUrl.includes('vimeo.com/')) {
        const videoId = videoUrl.split('vimeo.com/')[1];
        embedUrl = `https://player.vimeo.com/video/${videoId}`;
      }
      
      if (editorView === "code") {
        insertTextAtCursor(`<iframe width="560" height="315" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`);
      } else {
        insertTextAtCursor(`<div class="aspect-w-16 aspect-h-9 my-4">
          <iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="w-full h-full rounded"></iframe>
        </div>`);
      }
      toast.success("Video embed added to content");
    }
  };

  const insertTable = () => {
    const rows = parseInt(prompt("Number of rows:", "3") || "3");
    const columns = parseInt(prompt("Number of columns:", "3") || "3");
    
    if (editorView === "code") {
      let markdownTable = "";
      
      // Header row
      markdownTable += "|";
      for (let i = 0; i < columns; i++) {
        markdownTable += ` Header ${i+1} |`;
      }
      markdownTable += "\n";
      
      // Separator row
      markdownTable += "|";
      for (let i = 0; i < columns; i++) {
        markdownTable += "---|";
      }
      markdownTable += "\n";
      
      // Data rows
      for (let i = 0; i < rows - 1; i++) {
        markdownTable += "|";
        for (let j = 0; j < columns; j++) {
          markdownTable += ` Cell ${i+1},${j+1} |`;
        }
        markdownTable += "\n";
      }
      
      insertTextAtCursor(markdownTable);
    } else {
      let htmlTable = "<table class='border-collapse w-full my-4'>\n<thead>\n<tr>\n";
      
      // Header row
      for (let i = 0; i < columns; i++) {
        htmlTable += `<th class='border border-gray-300 px-4 py-2'>Header ${i+1}</th>\n`;
      }
      htmlTable += "</tr>\n</thead>\n<tbody>\n";
      
      // Data rows
      for (let i = 0; i < rows - 1; i++) {
        htmlTable += "<tr>\n";
        for (let j = 0; j < columns; j++) {
          htmlTable += `<td class='border border-gray-300 px-4 py-2'>Cell ${i+1},${j+1}</td>\n`;
        }
        htmlTable += "</tr>\n";
      }
      
      htmlTable += "</tbody>\n</table>";
      
      insertTextAtCursor(htmlTable);
    }
    
    toast.success("Table added to content");
  };

  const insertCodeBlock = () => {
    const language = prompt("Programming language:", "javascript");
    
    if (editorView === "code") {
      insertTextAtCursor(`\`\`\`${language || ''}\n// Your code here\nconst hello = "world";\nconsole.log(hello);\n\`\`\``);
    } else {
      insertTextAtCursor(`<pre><code class="language-${language || 'javascript'}">// Your code here
const hello = "world";
console.log(hello);</code></pre>`);
    }
  };

  const insertFileUpload = () => {
    setIsUploading(true);
    
    // Mock file upload - in a real app, this would be an actual upload
    setTimeout(() => {
      const fileName = prompt("Enter file name:", "document.pdf");
      const fileUrl = "https://example.com/" + (fileName || "document.pdf");
      
      if (editorView === "code") {
        insertTextAtCursor(`[Download ${fileName}](${fileUrl})`);
      } else {
        insertTextAtCursor(`<a href="${fileUrl}" download class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          Download ${fileName}
        </a>`);
      }
      
      setIsUploading(false);
      toast.success("File upload link added");
    }, 1000);
  };
  
  const insertShortcode = (code: string) => {
    insertTextAtCursor(code);
    toast.success("Shortcode inserted");
  };
  
  const insertChart = (chart: any) => {
    setCurrentChart(chart);
    
    // In real implementation, this would generate a chart
    const chartCode = `[chart type="${chart.data.type}" 
    labels="${chart.data.labels.join(',')}" 
    data="${chart.data.datasets[0].data.join(',')}"
    title="${chart.name}"]`;
    
    insertTextAtCursor(chartCode);
    toast.success(`${chart.name} inserted`);
  };
  
  const applyColorStyle = (type: 'text' | 'background') => {
    const color = type === 'text' ? selectedColor : selectedBgColor;
    
    if (editorView === "code") {
      insertTextAtCursor(`<span style="${type === 'text' ? 'color' : 'background-color'}: ${color};">Colored text</span>`);
    } else {
      insertTextAtCursor(`<span style="${type === 'text' ? 'color' : 'background-color'}: ${color};">Colored text</span>`);
    }
    
    setShowColorPicker(false);
  };
  
  const handleInsertEmoji = (emoji: string) => {
    insertTextAtCursor(emoji);
    setShowEmojiPicker(false);
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
        // Just find and highlight (in a real app)
        const matches = content.match(regex);
        toast.info(`Found ${matches ? matches.length : 0} occurrences of "${findText}"`);
      }
    } else {
      // Similar logic for visual editor
      let content = postHtmlContent;
      let flags = caseSensitive ? 'g' : 'gi';
      let searchTerm = findText;
      
      if (matchWholeWord) {
        searchTerm = `\\b${searchTerm}\\b`;
      }
      
      const regex = new RegExp(searchTerm, flags);
      
      if (replaceText) {
        content = content.replace(regex, replaceText);
        setPostHtmlContent(content);
        if (contentEditableRef.current) {
          contentEditableRef.current.innerHTML = content;
        }
        toast.success(`Replaced all occurrences of "${findText}"`);
      } else {
        // Just find (in a real app this would highlight matches)
        const textContent = content.replace(/<[^>]*>/g, ' ');
        const matches = textContent.match(regex);
        toast.info(`Found ${matches ? matches.length : 0} occurrences of "${findText}"`);
      }
    }
  };
  
  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    if (contentEditableRef.current) {
      setPostHtmlContent(contentEditableRef.current.innerHTML);
      
      // Also update the markdown version for the code view
      // (In a real app, you would use a proper HTML-to-Markdown converter)
      const simplified = contentEditableRef.current.innerText;
      setPostContent(simplified);
    }
  };
  
  const handleContentPaste = (e: React.ClipboardEvent) => {
    // Prevent default paste behavior
    e.preventDefault();
    
    // Get plain text from clipboard
    const text = e.clipboardData.getData('text/plain');
    
    // Insert at cursor position
    document.execCommand('insertText', false, text);
  };
  
  const handleCodeTabChange = (view: "visual" | "code") => {
    setEditorView(view);
  };
  
  // Function to perform undo/redo operations
  const handleHistory = (action: "undo" | "redo") => {
    document.execCommand(action);
    
    // Update state after undo/redo
    if (contentEditableRef.current) {
      setPostHtmlContent(contentEditableRef.current.innerHTML);
    }
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
                        <CalendarIcon className="mr-2 h-4 w-4" />
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
            
            <TabsContent value="write" className="min-h-[500px]" ref={editorRef}>
              <div className="grid gap-4">
                {/* Enhanced Editor Controls */}
                <Card className="p-2">
                  {/* Main toolbar for the editor */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {/* Code/Visual toggle */}
                    <div className="flex rounded-md overflow-hidden mr-2">
                      <Button 
                        size="sm" 
                        variant={editorView === "visual" ? "default" : "outline"}
                        onClick={() => handleCodeTabChange("visual")}
                        className="rounded-r-none"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Visual
                      </Button>
                      <Button 
                        size="sm" 
                        variant={editorView === "code" ? "default" : "outline"}
                        onClick={() => handleCodeTabChange("code")}
                        className="rounded-l-none"
                      >
                        <Terminal className="h-4 w-4 mr-1" />
                        Code
                      </Button>
                    </div>
                    
                    <Separator orientation="vertical" className="h-8 mx-2" />
                    
                    {/* History controls */}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleHistory("undo")}
                      title="Undo (Ctrl+Z)"
                    >
                      <Undo className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleHistory("redo")}
                      title="Redo (Ctrl+Y)"
                    >
                      <Redo className="h-4 w-4" />
                    </Button>
                    
                    <Separator orientation="vertical" className="h-8 mx-2" />
                    
                    {/* Headings dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Type className="h-4 w-4 mr-1" />
                          Heading
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => insertHeading(1)}>
                          <Heading1 className="h-4 w-4 mr-2" /> Heading 1
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => insertHeading(2)}>
                          <Heading2 className="h-4 w-4 mr-2" /> Heading 2
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => insertHeading(3)}>
                          <Heading3 className="h-4 w-4 mr-2" /> Heading 3
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    {/* Text format buttons */}
                    <Button size="sm" variant="outline" onClick={() => insertFormattedText("bold")} title="Bold">
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => insertFormattedText("italic")} title="Italic">
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => insertFormattedText("underline")} title="Underline">
                      <Underline className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => insertFormattedText("strike")} title="Strikethrough">
                      <StrikethroughIcon className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => insertFormattedText("quote")} title="Quote">
                      <Quote className="h-4 w-4" />
                    </Button>
                    
                    <Separator orientation="vertical" className="h-8 mx-2" />
                    
                    {/* Lists */}
                    <Button size="sm" variant="outline" onClick={() => insertList("ordered")} title="Ordered List">
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => insertList("unordered")} title="Bullet List">
                      <List className="h-4 w-4" />
                    </Button>
                    
                    <Separator orientation="vertical" className="h-8 mx-2" />
                    
                    {/* Media */}
                    <Button size="sm" variant="outline" onClick={insertLink} title="Insert Link">
                      <Link className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={insertImage}
                      disabled={isUploading}
                      title="Insert Image"
                    >
                      <Image className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={insertVideo} title="Insert Video">
                      <Youtube className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={insertFileUpload}
                      disabled={isUploading}
                      title="Upload File"
                    >
                      <FilePlus className="h-4 w-4" />
                    </Button>
                    
                    <Separator orientation="vertical" className="h-8 mx-2" />
                    
                    {/* Additional format tools */}
                    <Button size="sm" variant="outline" onClick={insertCodeBlock} title="Insert Code Block">
                      <Code className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={insertTable} title="Insert Table">
                      <Table2 className="h-4 w-4" />
                    </Button>
                    
                    {/* Color picker */}
                    <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
                      <PopoverTrigger asChild>
                        <Button size="sm" variant="outline" title="Text Color & Background">
                          <PaintBucket className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-3">
                        <div className="grid gap-3">
                          <div>
                            <Label>Text Color</Label>
                            <div className="flex gap-2 mt-1">
                              <Input
                                type="color"
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value)}
                                className="w-10 h-10 p-1"
                              />
                              <Input 
                                type="text"
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value)}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label>Background Color</Label>
                            <div className="flex gap-2 mt-1">
                              <Input
                                type="color"
                                value={selectedBgColor}
                                onChange={(e) => setSelectedBgColor(e.target.value)}
                                className="w-10 h-10 p-1"
                              />
                              <Input 
                                type="text"
                                value={selectedBgColor}
                                onChange={(e) => setSelectedBgColor(e.target.value)}
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <Button onClick={() => applyColorStyle('text')}>Apply Text Color</Button>
                            <Button onClick={() => applyColorStyle('background')}>Apply Background</Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    
                    {/* Find & Replace */}
                    <Dialog open={showFindReplace} onOpenChange={setShowFindReplace}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" title="Find & Replace">
                          <Search className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Find & Replace</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-3">
                          <div className="grid gap-2">
                            <Label>Find</Label>
                            <Input
                              placeholder="Text to find"
                              value={findText}
                              onChange={(e) => setFindText(e.target.value)}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Replace with</Label>
                            <Input
                              placeholder="Replacement text (optional)"
                              value={replaceText}
                              onChange={(e) => setReplaceText(e.target.value)}
                            />
                          </div>
                          <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                              <Checkbox 
                                id="case-sensitive" 
                                checked={caseSensitive}
                                onCheckedChange={(checked) => setCaseSensitive(checked === true)}
                              />
                              <Label htmlFor="case-sensitive">Case sensitive</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox 
                                id="whole-word" 
                                checked={matchWholeWord}
                                onCheckedChange={(checked) => setMatchWholeWord(checked === true)}
                              />
                              <Label htmlFor="whole-word">Whole word</Label>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleFindReplace}>
                              {replaceText ? 'Replace All' : 'Find All'}
                            </Button>
                          </DialogFooter>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  {/* Second row of controls */}
                  <div className="flex flex-wrap gap-1">
                    {/* Alignment controls */}
                    <Button size="sm" variant="outline" title="Align Left">
                      <AlignLeft className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" title="Align Center">
                      <AlignCenter className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" title="Align Right">
                      <AlignRight className="h-4 w-4" />
                    </Button>
                    
                    <Separator orientation="vertical" className="h-8 mx-2" />
                    
                    {/* Advanced features */}
                    {/* Emoji picker */}
                    <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                      <PopoverTrigger asChild>
                        <Button size="sm" variant="outline" title="Insert Emoji">
                          <Smile className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64">
                        <ScrollArea className="h-56">
                          <div className="grid grid-cols-8 gap-1 p-1">
                            {mockIcons.map((emoji, index) => (
                              <Button 
                                key={index} 
                                variant="ghost" 
                                className="w-8 h-8 p-0" 
                                onClick={() => handleInsertEmoji(emoji)}
                              >
                                {emoji}
                              </Button>
                            ))}
                          </div>
                        </ScrollArea>
                      </PopoverContent>
                    </Popover>
                    
                    {/* Shortcodes */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline" title="Insert Shortcode">
                          <Hash className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {shortcodes.map(shortcode => (
                          <DropdownMenuItem 
                            key={shortcode.name}
                            onClick={() => insertShortcode(shortcode.code)}
                          >
                            {shortcode.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    {/* Chart inserter */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" title="Insert Chart">
                          <BarChart4 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Insert Chart</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-3">
                          {chartTemplates.map(chart => (
                            <Card key={chart.name} className="p-3 cursor-pointer hover:bg-slate-50" onClick={() => insertChart(chart)}>
                              <div className="font-medium">{chart.name}</div>
                              <div className="text-sm text-gray-500">
                                {chart.data.type.charAt(0).toUpperCase() + chart.data.type.slice(1)} chart with {chart.data.labels.length} labels
                              </div>
                            </Card>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    {/* AI assistant */}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="ml-auto"
                      onClick={() => {
                        const selection = window.getSelection();
                        const selectedText = selection ? selection.toString() : "";
                        
                        toast.info("AI analyzing your content...");
                        
                        setTimeout(() => {
                          if (selectedText) {
                            toast.success("AI suggestions ready for selected text!");
                          } else {
                            toast.success("AI suggestions for your entire post are ready!");
                          }
                        }, 1500);
                      }}
                    >
                      <Sparkles className="h-4 w-4 mr-1" />
                      AI Suggestions
                    </Button>
                    
                    {/* Content statistics */}
                    <Button size="sm" variant="outline" className="ml-2">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {wordCount} words | {readTime} min read
                    </Button>
                  </div>
                </Card>
                
                {/* Editor area */}
                {editorView === "code" ? (
                  <Textarea
                    placeholder="Write your content here. Supports Markdown."
                    rows={16}
                    className="min-h-[450px] font-mono"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                  />
                ) : (
                  <div className="border rounded-md p-4 min-h-[450px]">
                    <div
                      ref={contentEditableRef}
                      contentEditable
                      className="outline-none min-h-[440px] prose prose-sm max-w-none"
                      onInput={handleContentChange}
                      onPaste={handleContentPaste}
                      dangerouslySetInnerHTML={{ __html: postHtmlContent || '<p>Start writing your content here...</p>' }}
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
                  postHtmlContent ? (
                    <div 
                      className="prose prose-lg max-w-none dark:prose-invert" 
                      dangerouslySetInnerHTML={{ __html: postHtmlContent }}
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
