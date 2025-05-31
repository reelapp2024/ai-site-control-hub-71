import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { Loader2, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CreateProject() {
  // Step 1: Basic Information
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessTypeOther, setBusinessTypeOther] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [competitorWebsites, setCompetitorWebsites] = useState("");
  const [brandColors, setBrandColors] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [wantImages, setWantImages] = useState(0);
  const [imageDescription, setImageDescription] = useState("");

  // Step 2: Content Information
  const [homePageContent, setHomePageContent] = useState("");
  const [aboutPageContent, setAboutPageContent] = useState("");
  const [servicesPageContent, setServicesPageContent] = useState("");
  const [contactPageContent, setContactPageContent] = useState("");
  const [additionalPages, setAdditionalPages] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [callToAction, setCallToAction] = useState("");

  // Step 3: Technical Preferences
  const [domainName, setDomainName] = useState("");
  const [hasDomain, setHasDomain] = useState(0);
  const [hostingPreference, setHostingPreference] = useState("");
  const [analyticsPreference, setAnalyticsPreference] = useState("");
  const [contactFormNeeded, setContactFormNeeded] = useState(0);
  const [ecommerceNeeded, setEcommerceNeeded] = useState(0);
  const [blogNeeded, setBlogNeeded] = useState(0);
  const [socialMediaLinks, setSocialMediaLinks] = useState("");

  // Step 4: Design Preferences
  const [designStyle, setDesignStyle] = useState("");
  const [layoutPreference, setLayoutPreference] = useState("");
  const [fontPreference, setFontPreference] = useState("");
  const [specialFeatures, setSpecialFeatures] = useState("");
  const [mobileOptimization, setMobileOptimization] = useState(1);
  const [accessibilityRequirements, setAccessibilityRequirements] = useState("");

  // Step 5: Timeline and Budget
  const [launchDate, setLaunchDate] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [ongoingMaintenance, setOngoingMaintenance] = useState(0);
  const [additionalComments, setAdditionalComments] = useState("");

  // UI State
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(20);
  const [loading, setLoading] = useState(0);
  const [projectCreated, setProjectCreated] = useState(false);
  const [projectId, setProjectId] = useState("");

  // Last saved state for comparison
  const [lastSavedProjectName, setLastSavedProjectName] = useState("");
  const [lastSavedProjectDescription, setLastSavedProjectDescription] = useState("");
  const [lastSavedBusinessType, setLastSavedBusinessType] = useState("");
  const [lastSavedBusinessTypeOther, setLastSavedBusinessTypeOther] = useState("");
  const [lastSavedTargetAudience, setLastSavedTargetAudience] = useState("");
  const [lastSavedCompetitorWebsites, setLastSavedCompetitorWebsites] = useState("");
  const [lastSavedBrandColors, setLastSavedBrandColors] = useState("");
  const [lastSavedLogoUrl, setLastSavedLogoUrl] = useState("");
  const [lastSavedWantImages, setLastSavedWantImages] = useState(0);
  const [lastSavedImageDescription, setLastSavedImageDescription] = useState("");

  // Handle checkbox change for want images
  const handleWantImagesChange = (checked: boolean) => {
    setWantImages(checked ? 1 : 0);
    setLastSavedWantImages(checked ? 1 : 0);
  };

  // Update progress based on current step
  useEffect(() => {
    setProgress(currentStep * 20);
  }, [currentStep]);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("projectData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      
      // Step 1
      setProjectName(parsedData.projectName || "");
      setProjectDescription(parsedData.projectDescription || "");
      setBusinessType(parsedData.businessType || "");
      setBusinessTypeOther(parsedData.businessTypeOther || "");
      setTargetAudience(parsedData.targetAudience || "");
      setCompetitorWebsites(parsedData.competitorWebsites || "");
      setBrandColors(parsedData.brandColors || "");
      setLogoUrl(parsedData.logoUrl || "");
      setWantImages(parsedData.wantImages || 0);
      setImageDescription(parsedData.imageDescription || "");
      
      // Step 2
      setHomePageContent(parsedData.homePageContent || "");
      setAboutPageContent(parsedData.aboutPageContent || "");
      setServicesPageContent(parsedData.servicesPageContent || "");
      setContactPageContent(parsedData.contactPageContent || "");
      setAdditionalPages(parsedData.additionalPages || "");
      setSeoKeywords(parsedData.seoKeywords || "");
      setCallToAction(parsedData.callToAction || "");
      
      // Step 3
      setDomainName(parsedData.domainName || "");
      setHasDomain(parsedData.hasDomain || 0);
      setHostingPreference(parsedData.hostingPreference || "");
      setAnalyticsPreference(parsedData.analyticsPreference || "");
      setContactFormNeeded(parsedData.contactFormNeeded || 0);
      setEcommerceNeeded(parsedData.ecommerceNeeded || 0);
      setBlogNeeded(parsedData.blogNeeded || 0);
      setSocialMediaLinks(parsedData.socialMediaLinks || "");
      
      // Step 4
      setDesignStyle(parsedData.designStyle || "");
      setLayoutPreference(parsedData.layoutPreference || "");
      setFontPreference(parsedData.fontPreference || "");
      setSpecialFeatures(parsedData.specialFeatures || "");
      setMobileOptimization(parsedData.mobileOptimization || 1);
      setAccessibilityRequirements(parsedData.accessibilityRequirements || "");
      
      // Step 5
      setLaunchDate(parsedData.launchDate || "");
      setBudgetRange(parsedData.budgetRange || "");
      setOngoingMaintenance(parsedData.ongoingMaintenance || 0);
      setAdditionalComments(parsedData.additionalComments || "");
      
      // Set last saved values
      setLastSavedProjectName(parsedData.projectName || "");
      setLastSavedProjectDescription(parsedData.projectDescription || "");
      setLastSavedBusinessType(parsedData.businessType || "");
      setLastSavedBusinessTypeOther(parsedData.businessTypeOther || "");
      setLastSavedTargetAudience(parsedData.targetAudience || "");
      setLastSavedCompetitorWebsites(parsedData.competitorWebsites || "");
      setLastSavedBrandColors(parsedData.brandColors || "");
      setLastSavedLogoUrl(parsedData.logoUrl || "");
      setLastSavedWantImages(parsedData.wantImages || 0);
      setLastSavedImageDescription(parsedData.imageDescription || "");
      
      // If there's a project ID, set it
      if (parsedData.projectId) {
        setProjectId(parsedData.projectId);
      }
      
      // Determine which step to show based on saved data
      const savedStep = parsedData.currentStep || 1;
      setCurrentStep(savedStep);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const projectData = {
      // Step 1
      projectName,
      projectDescription,
      businessType,
      businessTypeOther,
      targetAudience,
      competitorWebsites,
      brandColors,
      logoUrl,
      wantImages,
      imageDescription,
      
      // Step 2
      homePageContent,
      aboutPageContent,
      servicesPageContent,
      contactPageContent,
      additionalPages,
      seoKeywords,
      callToAction,
      
      // Step 3
      domainName,
      hasDomain,
      hostingPreference,
      analyticsPreference,
      contactFormNeeded,
      ecommerceNeeded,
      blogNeeded,
      socialMediaLinks,
      
      // Step 4
      designStyle,
      layoutPreference,
      fontPreference,
      specialFeatures,
      mobileOptimization,
      accessibilityRequirements,
      
      // Step 5
      launchDate,
      budgetRange,
      ongoingMaintenance,
      additionalComments,
      
      // Current step
      currentStep,
      
      // Project ID if available
      projectId,
    };
    
    localStorage.setItem("projectData", JSON.stringify(projectData));
  }, [
    projectName, projectDescription, businessType, businessTypeOther, targetAudience,
    competitorWebsites, brandColors, logoUrl, wantImages, imageDescription,
    homePageContent, aboutPageContent, servicesPageContent, contactPageContent,
    additionalPages, seoKeywords, callToAction, domainName, hasDomain,
    hostingPreference, analyticsPreference, contactFormNeeded, ecommerceNeeded,
    blogNeeded, socialMediaLinks, designStyle, layoutPreference, fontPreference,
    specialFeatures, mobileOptimization, accessibilityRequirements, launchDate,
    budgetRange, ongoingMaintenance, additionalComments, currentStep, projectId
  ]);

  // Handle next step
  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle form submission for step 1
  const handleSubmitStep1 = async () => {
    setLoading(1); // was setLoading(true)
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update last saved values
      setLastSavedProjectName(projectName);
      setLastSavedProjectDescription(projectDescription);
      setLastSavedBusinessType(businessType);
      setLastSavedBusinessTypeOther(businessTypeOther);
      setLastSavedTargetAudience(targetAudience);
      setLastSavedCompetitorWebsites(competitorWebsites);
      setLastSavedBrandColors(brandColors);
      setLastSavedLogoUrl(logoUrl);
      setLastSavedWantImages(wantImages);
      setLastSavedImageDescription(imageDescription);
      
      // Show success toast
      toast({
        title: "Progress Saved",
        description: "Your project information has been saved.",
      });
      
      // Move to next step
      handleNextStep();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(0);
    }
  };

  // Handle form submission for step 2
  const handleSubmitStep2 = async () => {
    setLoading(1); // was setLoading(true)
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success toast
      toast({
        title: "Content Information Saved",
        description: "Your content information has been saved.",
      });
      
      // Move to next step
      handleNextStep();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save content information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(0);
    }
  };

  // Handle form submission for step 3
  const handleSubmitStep3 = async () => {
    setLoading(1); // was setLoading(true)
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success toast
      toast({
        title: "Technical Preferences Saved",
        description: "Your technical preferences have been saved.",
      });
      
      // Move to next step
      handleNextStep();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save technical preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(0);
    }
  };

  // Handle form submission for step 4
  const handleSubmitStep4 = async () => {
    setLoading(1); // was setLoading(true)
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success toast
      toast({
        title: "Design Preferences Saved",
        description: "Your design preferences have been saved.",
      });
      
      // Move to next step
      handleNextStep();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save design preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(0);
    }
  };

  // Handle final form submission
  const handleFinalSubmit = async () => {
    setLoading(1); // was setLoading(true)
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a random project ID
      const newProjectId = `PROJ-${Math.floor(Math.random() * 10000)}`;
      setProjectId(newProjectId);
      
      // Show success toast
      toast({
        title: "Project Created Successfully",
        description: `Your project ${projectName} has been created with ID: ${newProjectId}`,
      });
      
      // Set project as created
      setProjectCreated(true);
      
      // Clear localStorage
      localStorage.removeItem("projectData");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(0);
    }
  };

  // Reset form and start a new project
  const handleStartNewProject = () => {
    // Reset all form fields
    setProjectName("");
    setProjectDescription("");
    setBusinessType("");
    setBusinessTypeOther("");
    setTargetAudience("");
    setCompetitorWebsites("");
    setBrandColors("");
    setLogoUrl("");
    setWantImages(0);
    setImageDescription("");
    
    setHomePageContent("");
    setAboutPageContent("");
    setServicesPageContent("");
    setContactPageContent("");
    setAdditionalPages("");
    setSeoKeywords("");
    setCallToAction("");
    
    setDomainName("");
    setHasDomain(0);
    setHostingPreference("");
    setAnalyticsPreference("");
    setContactFormNeeded(0);
    setEcommerceNeeded(0);
    setBlogNeeded(0);
    setSocialMediaLinks("");
    
    setDesignStyle("");
    setLayoutPreference("");
    setFontPreference("");
    setSpecialFeatures("");
    setMobileOptimization(1);
    setAccessibilityRequirements("");
    
    setLaunchDate("");
    setBudgetRange("");
    setOngoingMaintenance(0);
    setAdditionalComments("");
    
    // Reset UI state
    setCurrentStep(1);
    setProjectCreated(false);
    setProjectId("");
    
    // Clear localStorage
    localStorage.removeItem("projectData");
    
    // Show toast
    toast({
      title: "New Project Started",
      description: "You can now create a new project.",
    });
  };

  // If project is created, show success screen
  if (projectCreated) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-green-500">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-green-600">
              <Check className="h-8 w-8 mx-auto mb-2" />
              Project Created Successfully!
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Your project has been created and is ready for development.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Project Name</p>
                  <p className="font-medium">{projectName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Project ID</p>
                  <p className="font-medium">{projectId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Business Type</p>
                  <p className="font-medium">{businessType === "other" ? businessTypeOther : businessType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Target Launch Date</p>
                  <p className="font-medium">{launchDate || "Not specified"}</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="mb-4">
                You can view and manage your project in the Projects section.
              </p>
              <Button onClick={handleStartNewProject}>
                Create Another Project
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Website Project</h1>
      
      <div className="mb-8">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span className={currentStep >= 1 ? "font-medium text-primary" : ""}>Basic Info</span>
          <span className={currentStep >= 2 ? "font-medium text-primary" : ""}>Content</span>
          <span className={currentStep >= 3 ? "font-medium text-primary" : ""}>Technical</span>
          <span className={currentStep >= 4 ? "font-medium text-primary" : ""}>Design</span>
          <span className={currentStep >= 5 ? "font-medium text-primary" : ""}>Timeline</span>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === 1 && "Step 1: Basic Information"}
            {currentStep === 2 && "Step 2: Content Information"}
            {currentStep === 3 && "Step 3: Technical Preferences"}
            {currentStep === 4 && "Step 4: Design Preferences"}
            {currentStep === 5 && "Step 5: Timeline and Budget"}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && "Provide basic information about your project and business."}
            {currentStep === 2 && "Tell us about the content you want on your website."}
            {currentStep === 3 && "Specify your technical requirements and preferences."}
            {currentStep === 4 && "Choose your design preferences and special features."}
            {currentStep === 5 && "Set your timeline, budget, and any additional requirements."}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  placeholder="Enter a name for your project"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="projectDescription">Project Description *</Label>
                <Textarea
                  id="projectDescription"
                  placeholder="Describe your project and its goals"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  required
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type *</Label>
                <Select
                  value={businessType}
                  onValueChange={setBusinessType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="service">Service Business</SelectItem>
                    <SelectItem value="blog">Blog/Content</SelectItem>
                    <SelectItem value="portfolio">Portfolio</SelectItem>
                    <SelectItem value="nonprofit">Non-profit</SelectItem>
                    <SelectItem value="education">Educational</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {businessType === "other" && (
                <div className="space-y-2">
                  <Label htmlFor="businessTypeOther">Specify Business Type</Label>
                  <Input
                    id="businessTypeOther"
                    placeholder="Specify your business type"
                    value={businessTypeOther}
                    onChange={(e) => setBusinessTypeOther(e.target.value)}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Textarea
                  id="targetAudience"
                  placeholder="Describe your target audience (age, interests, demographics, etc.)"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="competitorWebsites">Competitor Websites (Optional)</Label>
                <Textarea
                  id="competitorWebsites"
                  placeholder="List any competitor websites you like or want to reference"
                  value={competitorWebsites}
                  onChange={(e) => setCompetitorWebsites(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brandColors">Brand Colors (Optional)</Label>
                <Input
                  id="brandColors"
                  placeholder="e.g., #FF5733, #33FF57, or blue, green"
                  value={brandColors}
                  onChange={(e) => setBrandColors(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL (Optional)</Label>
                <Input
                  id="logoUrl"
                  placeholder="Enter a URL to your existing logo"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="wantImages" 
                  checked={wantImages === 1}
                  onCheckedChange={handleWantImagesChange}
                />
                <Label htmlFor="wantImages">I want AI-generated images for my website</Label>
              </div>
              
              {wantImages === 1 && (
                <div className="space-y-2">
                  <Label htmlFor="imageDescription">Image Description</Label>
                  <Textarea
                    id="imageDescription"
                    placeholder="Describe the type of images you want (style, content, mood, etc.)"
                    value={imageDescription}
                    onChange={(e) => setImageDescription(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}
          
          {/* Step 2: Content Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="homePageContent">Home Page Content</Label>
                <Textarea
                  id="homePageContent"
                  placeholder="Describe what content you want on your home page"
                  value={homePageContent}
                  onChange={(e) => setHomePageContent(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="aboutPageContent">About Page Content</Label>
                <Textarea
                  id="aboutPageContent"
                  placeholder="Provide information about your business/organization for the About page"
                  value={aboutPageContent}
                  onChange={(e) => setAboutPageContent(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="servicesPageContent">Services/Products Page Content</Label>
                <Textarea
                  id="servicesPageContent"
                  placeholder="Describe your services or products"
                  value={servicesPageContent}
                  onChange={(e) => setServicesPageContent(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactPageContent">Contact Page Content</Label>
                <Textarea
                  id="contactPageContent"
                  placeholder="Provide contact information and any specific instructions for the contact page"
                  value={contactPageContent}
                  onChange={(e) => setContactPageContent(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additionalPages">Additional Pages (Optional)</Label>
                <Textarea
                  id="additionalPages"
                  placeholder="List any additional pages you want and briefly describe their content"
                  value={additionalPages}
                  onChange={(e) => setAdditionalPages(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="seoKeywords">SEO Keywords (Optional)</Label>
                <Textarea
                  id="seoKeywords"
                  placeholder="List important keywords for your business that should be included for SEO"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="callToAction">Primary Call to Action</Label>
                <Input
                  id="callToAction"
                  placeholder="e.g., 'Book a Consultation', 'Shop Now', 'Contact Us'"
                  value={callToAction}
                  onChange={(e) => setCallToAction(e.target.value)}
                />
              </div>
            </div>
          )}
          
          {/* Step 3: Technical Preferences */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="domainName">Preferred Domain Name (Optional)</Label>
                <Input
                  id="domainName"
                  placeholder="e.g., yourbusiness.com"
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Do you already own this domain?</Label>
                <div className="flex items-center space-x-2">
                  <RadioGroup value={hasDomain.toString()} onValueChange={(value) => setHasDomain(parseInt(value))}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="domain-yes" />
                      <Label htmlFor="domain-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" id="domain-no" />
                      <Label htmlFor="domain-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hostingPreference">Hosting Preference</Label>
                <Select
                  value={hostingPreference}
                  onValueChange={setHostingPreference}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select hosting preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="our-hosting">Use your hosting service</SelectItem>
                    <SelectItem value="own-hosting">I'll use my own hosting</SelectItem>
                    <SelectItem value="need-advice">Need advice on hosting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="analyticsPreference">Analytics Preference</Label>
                <Select
                  value={analyticsPreference}
                  onValueChange={setAnalyticsPreference}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select analytics preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google-analytics">Google Analytics</SelectItem>
                    <SelectItem value="matomo">Matomo (Privacy-Focused)</SelectItem>
                    <SelectItem value="none">No Analytics</SelectItem>
                    <SelectItem value="other">Other (Specify in comments)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Do you need a contact form?</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={contactFormNeeded === 1}
                    onCheckedChange={(checked) => setContactFormNeeded(checked ? 1 : 0)}
                  />
                  <Label>{contactFormNeeded === 1 ? "Yes" : "No"}</Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Do you need e-commerce functionality?</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={ecommerceNeeded === 1}
                    onCheckedChange={(checked) => setEcommerceNeeded(checked ? 1 : 0)}
                  />
                  <Label>{ecommerceNeeded === 1 ? "Yes" : "No"}</Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Do you need a blog section?</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={blogNeeded === 1}
                    onCheckedChange={(checked) => setBlogNeeded(checked ? 1 : 0)}
                  />
                  <Label>{blogNeeded === 1 ? "Yes" : "No"}</Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="socialMediaLinks">Social Media Links (Optional)</Label>
                <Textarea
                  id="socialMediaLinks"
                  placeholder="List your social media profiles to be linked on the website"
                  value={socialMediaLinks}
                  onChange={(e) => setSocialMediaLinks(e.target.value)}
                />
              </div>
            </div>
          )}
          
          {/* Step 4: Design Preferences */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="designStyle">Design Style Preference</Label>
                <Select
                  value={designStyle}
                  onValueChange={setDesignStyle}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select design style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern & Minimalist</SelectItem>
                    <SelectItem value="corporate">Corporate & Professional</SelectItem>
                    <SelectItem value="creative">Creative & Bold</SelectItem>
                    <SelectItem value="elegant">Elegant & Sophisticated</SelectItem>
                    <SelectItem value="playful">Playful & Colorful</SelectItem>
                    <SelectItem value="vintage">Vintage & Retro</SelectItem>
                    <SelectItem value="other">Other (Specify in comments)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="layoutPreference">Layout Preference</Label>
                <Select
                  value={layoutPreference}
                  onValueChange={setLayoutPreference}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select layout preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single-page">Single Page Website</SelectItem>
                    <SelectItem value="multi-page">Traditional Multi-Page</SelectItem>
                    <SelectItem value="grid">Grid/Card Based Layout</SelectItem>
                    <SelectItem value="magazine">Magazine/Blog Style</SelectItem>
                    <SelectItem value="other">Other (Specify in comments)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fontPreference">Font Style Preference</Label>
                <Select
                  value={fontPreference}
                  onValueChange={setFontPreference}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select font preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern-sans">Modern Sans-Serif</SelectItem>
                    <SelectItem value="classic-serif">Classic Serif</SelectItem>
                    <SelectItem value="playful">Playful/Creative</SelectItem>
                    <SelectItem value="minimalist">Clean & Minimalist</SelectItem>
                    <SelectItem value="other">Other (Specify in comments)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialFeatures">Special Features (Optional)</Label>
                <Textarea
                  id="specialFeatures"
                  placeholder="Describe any special features you want (animations, parallax scrolling, etc.)"
                  value={specialFeatures}
                  onChange={(e) => setSpecialFeatures(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Mobile Optimization Priority</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={mobileOptimization === 1}
                    onCheckedChange={(checked) => setMobileOptimization(checked ? 1 : 0)}
                  />
                  <Label>{mobileOptimization === 1 ? "High Priority" : "Standard"}</Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accessibilityRequirements">Accessibility Requirements (Optional)</Label>
                <Textarea
                  id="accessibilityRequirements"
                  placeholder="Specify any accessibility requirements or standards you need to meet"
                  value={accessibilityRequirements}
                  onChange={(e) => setAccessibilityRequirements(e.target.value)}
                />
              </div>
            </div>
          )}
          
          {/* Step 5: Timeline and Budget */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="launchDate">Target Launch Date (Optional)</Label>
                <Input
                  id="launchDate"
                  type="date"
                  value={launchDate}
                  onChange={(e) => setLaunchDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budgetRange">Budget Range</Label>
                <Select
                  value={budgetRange}
                  onValueChange={setBudgetRange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-1000">Under $1,000</SelectItem>
                    <SelectItem value="1000-3000">$1,000 - $3,000</SelectItem>
                    <SelectItem value="3000-5000">$3,000 - $5,000</SelectItem>
                    <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                    <SelectItem value="over-10000">Over $10,000</SelectItem>
                    <SelectItem value="not-sure">Not sure / Need consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Do you need ongoing maintenance?</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={ongoingMaintenance === 1}
                    onCheckedChange={(checked) => setOngoingMaintenance(checked ? 1 : 0)}
                  />
                  <Label>{ongoingMaintenance === 1 ? "Yes" : "No"}</Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additionalComments">Additional Comments or Requirements</Label>
                <Textarea
                  id="additionalComments"
                  placeholder="Any other information you'd like to share about your project"
                  value={additionalComments}
                  onChange={(e) => setAdditionalComments(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {currentStep > 1 ? (
            <Button variant="outline" onClick={handlePrevStep} disabled={loading === 1}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
          ) : (
            <div></div> // Empty div to maintain spacing with flex justify-between
          )}
          
          {currentStep < 5 ? (
            <Button 
              onClick={() => {
                if (currentStep === 1) handleSubmitStep1();
                else if (currentStep === 2) handleSubmitStep2();
                else if (currentStep === 3) handleSubmitStep3();
                else if (currentStep === 4) handleSubmitStep4();
              }}
              disabled={loading === 1 || (currentStep === 1 && (!projectName || !projectDescription || !businessType || (businessType === "other" && !businessTypeOther)))}
            >
              {loading === 1 ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
            <Button 
              onClick={handleFinalSubmit}
              disabled={loading === 1}
            >
              {loading === 1 ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Project...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
