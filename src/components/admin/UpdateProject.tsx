
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Edit3, Save, Eye, CheckCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Checkbox } from "@/components/ui/checkbox";

export function UpdateProject() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with actual API call based on projectId
  const [projectData, setProjectData] = useState({
    projectName: "House Cleaning Service",
    welcomeLine: "Welcome to our professional house cleaning service",
    callToAction: "Book your cleaning today!",
    serviceType: "House",
    primaryColor: "#7c3aed",
    secondaryColor: "#a855f7",
    description: "Professional house cleaning services for your home",
    selectedCountries: [{ name: "United States", id: "US" }],
    selectedStates: [{ name: "California", id: "CA" }],
    selectedCities: [{ name: "Los Angeles", id: "LA" }],
    selectedLocalAreas: [{ name: "Downtown", id: "DT" }, { name: "Hollywood", id: "HW" }],
    isCountry: false,
    isState: false,
    isCity: false,
    isLocal: true
  });

  const steps = [
    { title: "Project Information", icon: "info" },
    { title: "Country Selection", icon: "globe" },
    { title: "State Selection", icon: "map" },
    { title: "City Selection", icon: "building" },
    { title: "Local Area Selection", icon: "map-pin" },
    { title: "Preview", icon: "eye" }
  ];

  const handleInputChange = (field: string, value: any) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    // API call would go here
    console.log("Saving project:", projectData);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/admin/project-list");
    }, 1000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Project Information
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="projectName">Project Name *</Label>
              <Input
                id="projectName"
                value={projectData.projectName}
                onChange={(e) => handleInputChange("projectName", e.target.value)}
                placeholder="Enter project name"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="welcomeLine">Welcome Line *</Label>
              <Input
                id="welcomeLine"
                value={projectData.welcomeLine}
                onChange={(e) => handleInputChange("welcomeLine", e.target.value)}
                placeholder="Enter welcome message"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="callToAction">Call to Action *</Label>
              <Input
                id="callToAction"
                value={projectData.callToAction}
                onChange={(e) => handleInputChange("callToAction", e.target.value)}
                placeholder="Enter call to action"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="serviceType">Service Type *</Label>
              <Input
                id="serviceType"
                value={projectData.serviceType}
                onChange={(e) => handleInputChange("serviceType", e.target.value)}
                placeholder="Enter service type"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={projectData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter project description"
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={projectData.primaryColor}
                    onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    value={projectData.primaryColor}
                    onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                    placeholder="#7c3aed"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={projectData.secondaryColor}
                    onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    value={projectData.secondaryColor}
                    onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                    placeholder="#a855f7"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 1: // Country Selection
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="isCountry"
                checked={projectData.isCountry}
                onCheckedChange={(checked) => handleInputChange("isCountry", checked)}
              />
              <Label htmlFor="isCountry">Enable Country Level Service</Label>
            </div>
            
            <div>
              <Label>Selected Countries</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {projectData.selectedCountries.map((country) => (
                  <Badge key={country.id} variant="secondary" className="px-3 py-1">
                    {country.name}
                    <button
                      onClick={() => {
                        const updated = projectData.selectedCountries.filter(c => c.id !== country.id);
                        handleInputChange("selectedCountries", updated);
                      }}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-3"
                onClick={() => {
                  // Mock adding a country
                  const newCountry = { name: "Canada", id: "CA" };
                  if (!projectData.selectedCountries.find(c => c.id === newCountry.id)) {
                    handleInputChange("selectedCountries", [...projectData.selectedCountries, newCountry]);
                  }
                }}
              >
                Add Country
              </Button>
            </div>
          </div>
        );

      case 2: // State Selection
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="isState"
                checked={projectData.isState}
                onCheckedChange={(checked) => handleInputChange("isState", checked)}
              />
              <Label htmlFor="isState">Enable State Level Service</Label>
            </div>
            
            <div>
              <Label>Selected States</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {projectData.selectedStates.map((state) => (
                  <Badge key={state.id} variant="secondary" className="px-3 py-1">
                    {state.name}
                    <button
                      onClick={() => {
                        const updated = projectData.selectedStates.filter(s => s.id !== state.id);
                        handleInputChange("selectedStates", updated);
                      }}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-3"
                onClick={() => {
                  const newState = { name: "New York", id: "NY" };
                  if (!projectData.selectedStates.find(s => s.id === newState.id)) {
                    handleInputChange("selectedStates", [...projectData.selectedStates, newState]);
                  }
                }}
              >
                Add State
              </Button>
            </div>
          </div>
        );

      case 3: // City Selection
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="isCity"
                checked={projectData.isCity}
                onCheckedChange={(checked) => handleInputChange("isCity", checked)}
              />
              <Label htmlFor="isCity">Enable City Level Service</Label>
            </div>
            
            <div>
              <Label>Selected Cities</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {projectData.selectedCities.map((city) => (
                  <Badge key={city.id} variant="secondary" className="px-3 py-1">
                    {city.name}
                    <button
                      onClick={() => {
                        const updated = projectData.selectedCities.filter(c => c.id !== city.id);
                        handleInputChange("selectedCities", updated);
                      }}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-3"
                onClick={() => {
                  const newCity = { name: "San Francisco", id: "SF" };
                  if (!projectData.selectedCities.find(c => c.id === newCity.id)) {
                    handleInputChange("selectedCities", [...projectData.selectedCities, newCity]);
                  }
                }}
              >
                Add City
              </Button>
            </div>
          </div>
        );

      case 4: // Local Area Selection
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="isLocal"
                checked={projectData.isLocal}
                onCheckedChange={(checked) => handleInputChange("isLocal", checked)}
              />
              <Label htmlFor="isLocal">Enable Local Area Service</Label>
            </div>
            
            <div>
              <Label>Selected Local Areas</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {projectData.selectedLocalAreas.map((area) => (
                  <Badge key={area.id} variant="secondary" className="px-3 py-1">
                    {area.name}
                    <button
                      onClick={() => {
                        const updated = projectData.selectedLocalAreas.filter(a => a.id !== area.id);
                        handleInputChange("selectedLocalAreas", updated);
                      }}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-3"
                onClick={() => {
                  const newArea = { name: "Beverly Hills", id: "BH" };
                  if (!projectData.selectedLocalAreas.find(a => a.id === newArea.id)) {
                    handleInputChange("selectedLocalAreas", [...projectData.selectedLocalAreas, newArea]);
                  }
                }}
              >
                Add Local Area
              </Button>
            </div>
          </div>
        );

      case 5: // Preview
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Eye className="mr-2 text-purple-600" />
                Project Preview
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Project Name</Label>
                  <p className="text-sm">{projectData.projectName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Service Type</Label>
                  <p className="text-sm">{projectData.serviceType}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium text-gray-600">Welcome Line</Label>
                  <p className="text-sm">{projectData.welcomeLine}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium text-gray-600">Call to Action</Label>
                  <p className="text-sm">{projectData.callToAction}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium text-gray-600">Description</Label>
                  <p className="text-sm">{projectData.description}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: projectData.primaryColor }}
                    />
                    <span className="text-sm">{projectData.primaryColor}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: projectData.secondaryColor }}
                    />
                    <span className="text-sm">{projectData.secondaryColor}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Service Levels</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {projectData.isCountry && <Badge variant="outline">Country</Badge>}
                    {projectData.isState && <Badge variant="outline">State</Badge>}
                    {projectData.isCity && <Badge variant="outline">City</Badge>}
                    {projectData.isLocal && <Badge variant="outline">Local</Badge>}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Total Locations</Label>
                  <p className="text-sm">
                    {projectData.selectedCountries.length + 
                     projectData.selectedStates.length + 
                     projectData.selectedCities.length + 
                     projectData.selectedLocalAreas.length} locations
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-purple-950 dark:to-gray-900 flex font-poppins">
      <AdminSidebar
        activeSection="project-list"
        setActiveSection={() => {}}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-800/20 min-h-[calc(100vh-4rem)]">
            <div className="p-8">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/admin/project-list")}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Projects
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold text-purple-900">Update Project</h1>
                    <p className="text-sm text-purple-600">Edit your project settings and configuration</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Progress</h3>
                      <span className="text-sm text-gray-600">
                        Step {currentStep + 1} of {steps.length}
                      </span>
                    </div>
                    <Progress value={(currentStep + 1) / steps.length * 100} className="mb-4" />
                    
                    {/* Step Navigation */}
                    <div className="flex flex-wrap gap-2">
                      {steps.map((step, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentStep(index)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                            index === currentStep
                              ? "bg-purple-600 text-white"
                              : index < currentStep
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {step.title}
                          {index < currentStep && <CheckCircle className="h-3 w-3" />}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Step Content */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      {steps[currentStep].title}
                      <Edit3 className="h-4 w-4 text-gray-400" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {renderStepContent()}
                  </CardContent>
                </Card>

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex gap-3">
                    {currentStep === steps.length - 1 ? (
                      <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                        className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                      >
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
