
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Edit3, Save, Eye, CheckCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';

export function UpdateProject() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with actual API call
  const [projectData, setProjectData] = useState({
    projectName: "House Cleaning Service",
    welcomeLine: "Welcome to our professional house cleaning service",
    callToAction: "Book your cleaning today!",
    serviceType: "House",
    defaultFasFaIcon: "home",
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
    { title: "Project Information", icon: "fas fa-info-circle" },
    { title: "Country Selection", icon: "fas fa-globe" },
    { title: "State Selection", icon: "fas fa-map" },
    { title: "City Selection", icon: "fas fa-city" },
    { title: "Local Area Selection", icon: "fas fa-map-marker" },
    { title: "Preview", icon: "fas fa-eye" }
  ];

  const serviceIcons = [
    { icon: "home", label: "Home" },
    { icon: "building", label: "Building" },
    { icon: "car", label: "Car" },
    { icon: "medkit", label: "Medical" },
    { icon: "graduation-cap", label: "Education" },
    { icon: "utensils", label: "Food" },
    { icon: "camera", label: "Photography" },
    { icon: "tools", label: "Tools" }
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
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={projectData.projectName}
                onChange={(e) => handleInputChange("projectName", e.target.value)}
                placeholder="Enter project name"
              />
            </div>
            
            <div>
              <Label htmlFor="welcomeLine">Welcome Line</Label>
              <Input
                id="welcomeLine"
                value={projectData.welcomeLine}
                onChange={(e) => handleInputChange("welcomeLine", e.target.value)}
                placeholder="Enter welcome message"
              />
            </div>
            
            <div>
              <Label htmlFor="callToAction">Call to Action</Label>
              <Input
                id="callToAction"
                value={projectData.callToAction}
                onChange={(e) => handleInputChange("callToAction", e.target.value)}
                placeholder="Enter call to action"
              />
            </div>
            
            <div>
              <Label htmlFor="serviceType">Service Type</Label>
              <Input
                id="serviceType"
                value={projectData.serviceType}
                onChange={(e) => handleInputChange("serviceType", e.target.value)}
                placeholder="Enter service type"
              />
            </div>
            
            <div>
              <Label>Service Icon</Label>
              <div className="grid grid-cols-4 gap-3 mt-2">
                {serviceIcons.map((item) => (
                  <button
                    key={item.icon}
                    type="button"
                    onClick={() => handleInputChange("defaultFasFaIcon", item.icon)}
                    className={`p-3 rounded-lg border text-center transition-colors ${
                      projectData.defaultFasFaIcon === item.icon
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <i className={`fas fa-${item.icon} text-xl mb-1`} />
                    <div className="text-xs">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 1: // Country Selection
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isCountry"
                checked={projectData.isCountry}
                onChange={(e) => handleInputChange("isCountry", e.target.checked)}
                className="rounded"
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
              <input
                type="checkbox"
                id="isState"
                checked={projectData.isState}
                onChange={(e) => handleInputChange("isState", e.target.checked)}
                className="rounded"
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
              <input
                type="checkbox"
                id="isCity"
                checked={projectData.isCity}
                onChange={(e) => handleInputChange("isCity", e.target.checked)}
                className="rounded"
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
              <input
                type="checkbox"
                id="isLocal"
                checked={projectData.isLocal}
                onChange={(e) => handleInputChange("isLocal", e.target.checked)}
                className="rounded"
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
                <i className={`fas fa-${projectData.defaultFasFaIcon} mr-2 text-purple-600`} />
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
    <div className="space-y-6 font-poppins">
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
                <i className={`${step.icon} text-xs`} />
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
            <i className={`${steps[currentStep].icon} text-purple-600`} />
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
  );
}
