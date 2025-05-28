import { useState, KeyboardEvent, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Check, ChevronRight, ChevronLeft, ClipboardList, Bot, Upload, Mail, Phone, MapPin, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { httpFile } from "../../config.js";

export function CreateProject() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [wantImages, setWantImages] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(0);

  const storedLastId = localStorage.getItem("lastCreateProjectId");
  const navProjectId = location.state?.projectId;
  const [projectId, setProjectId] = useState(navProjectId || storedLastId || null);

  const draftKey = projectId || "new";
  const lastSubKey = projectId ? `createProjectLastSubmitted:${projectId}` : null;

  // Location selection states
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [countrySearchInput, setCountrySearchInput] = useState("");
  const [currentCountryPage, setCurrentCountryPage] = useState(1);
  const countriesPerPage = 10;

  // Page creation for countries
  const [countryPageCreation, setCountryPageCreation] = useState<{[country: string]: boolean}>({});

  // States management
  const [states, setStates] = useState<{[country: string]: string[]}>({});
  const [selectedStates, setSelectedStates] = useState<{[country: string]: string[]}>({});
  const [stateInput, setStateInput] = useState<{[country: string]: string}>({});

  // Cities management
  const [cities, setCities] = useState<{[state: string]: string[]}>({});
  const [selectedCities, setSelectedCities] = useState<{[state: string]: string[]}>({});
  const [cityInput, setCityInput] = useState<{[state: string]: string}>({});

  // Local areas management
  const [localAreas, setLocalAreas] = useState<{[city: string]: string[]}>({});
  const [localAreaInput, setLocalAreaInput] = useState<{[city: string]: string}>({});

  // Service states
  const [showServicesDialog, setShowServicesDialog] = useState(false);
  const [serviceOption, setServiceOption] = useState<"manual" | "ai" | "">("");
  const [serviceNames, setServiceNames] = useState("");

  // About Us states
  const [aboutUsEmail, setAboutUsEmail] = useState("");
  const [aboutUsPhone, setAboutUsPhone] = useState("");
  const [aboutUsLocation, setAboutUsLocation] = useState("");

  // Final success state
  const [showFinalSuccess, setShowFinalSuccess] = useState(false);
  const [redirectCounter, setRedirectCounter] = useState(7);

  // Page creation option - removed from here, now managed per country

  useEffect(() => {
    async function fetchCountries() {
      try {
        const token = localStorage.getItem("token");
        // Replace with your real API endpoint!
        const res = await httpFile.get("/fetch_countries", {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Adjust path to your API response shape:
        const countryList = res.data.data.map((item: any) => item.name); // or item.country, etc.
        setCountries(countryList);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch countries.",
          variant: "destructive",
        });
      }
    }
    fetchCountries();
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(`createProjectDraft:${draftKey}`);
    if (raw) {
      try {
        const d = JSON.parse(raw);
        if (d.serviceType) setServiceType(d.serviceType);
        if (d.projectName) setProjectName(d.projectName);
        if (typeof d.wantImages === "boolean") setWantImages(d.wantImages);
      } catch { }
    }
  }, [draftKey]);

  useEffect(() => {
    localStorage.setItem(
      `createProjectDraft:${draftKey}`,
      JSON.stringify({ serviceType, projectName, wantImages, projectId })
    );
  }, [serviceType, projectName, wantImages, projectId, draftKey]);

  useEffect(() => {
    console.log("Project Name Updated: ", projectName);
  }, [projectName]);

  useEffect(() => {
    console.log("Service Type Updated: ", serviceType);
  }, [serviceType]);

  // Redirect countdown effect
  useEffect(() => {
    if (showFinalSuccess && redirectCounter > 0) {
      const timer = setTimeout(() => {
        setRedirectCounter(redirectCounter - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (showFinalSuccess && redirectCounter === 0) {
      navigate("/");
    }
  }, [showFinalSuccess, redirectCounter, navigate]);

  // Filter countries based on search term
  const filteredCountries = countries.filter(country =>
    country.toLowerCase().includes(countrySearchInput.toLowerCase())
  );

  // Calculate pagination for countries
  const indexOfLastCountry = currentCountryPage * countriesPerPage;
  const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
  const currentCountries = filteredCountries.slice(indexOfFirstCountry, indexOfLastCountry);
  const totalCountryPages = Math.ceil(filteredCountries.length / countriesPerPage);

  const handleNextStep = async () => {
    if (step === 1) {
      const admin = JSON.parse(localStorage.getItem("adminProfile") || "{}");
      const payload = {
        userId: admin._id,
        serviceType,
        projectName,
        wantImages: wantImages ? 1 : 0
      };

      console.log("Project payload: ", payload);
      setLoading(1);

      if (projectId && lastSubKey) {
        const last = JSON.parse(localStorage.getItem(lastSubKey) || "{}");
        if (
          last.serviceType === serviceType &&
          last.projectName === projectName &&
          last.wantImages === wantImages
        ) {
          setLoading(0);
          setStep(step + 1);
        }
      }

      try {
        const token = localStorage.getItem("token");
        const res = await httpFile.post("/createProject", payload, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401) {
          toast({
            title: "Error",
            description: "invalid token",
            variant: "destructive"
          });
          localStorage.removeItem("token");
          navigate("/login");
        }
        if (res.status === 201) {
          const newId = res.data.data._id;

          toast({
            title: "Success",
            description: "Project created successfully!",
            variant: "destructive"
          });

          localStorage.setItem("lastCreateProjectId", newId);
          setProjectId(newId);
          localStorage.setItem(
            `createProjectLastSubmitted:${newId}`,
            JSON.stringify({ serviceType, projectName, wantImages })
          );
          localStorage.setItem(
            `createProjectDraft:${newId}`,
            JSON.stringify({ serviceType, projectName, wantImages, projectId: newId })
          );
          localStorage.removeItem("createProjectDraft:new");
          setLoading(0);

          setStep(step + 1);
        }
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.response?.data?.message || "An error occurred!",
          variant: "destructive"
        });
      } finally {
        setLoading(0);
      }

      if (!projectName || !serviceType) return;
    } else if (step === 2) {
      setStep(step + 1);
    } else if (step === 3) {
      setStep(step + 1);
    } else if (step === 4) {
      setStep(step + 1);
    } else if (step === 5) {
      setStep(step + 1);
    } else if (step === 6) {
      setShowServicesDialog(true);
    } else if (step === 7) {
      // Service entry step
      if (serviceOption === "manual" && !serviceNames.trim()) {
        toast({
          title: "Error",
          description: "Please enter at least one service name",
          variant: "destructive"
        });
        return;
      }
      setStep(step + 1);
    } else if (step === 8) {
      // About Us step
      if (!aboutUsEmail || !aboutUsPhone || !aboutUsLocation) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }
      // Show final success
      setShowFinalSuccess(true);
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleCountrySearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && countrySearchInput.trim() !== '') {
      const trimmedInput = countrySearchInput.trim();
      
      // Check if it's an exact match with existing countries (case insensitive)
      const exactMatch = countries.find(country => 
        country.toLowerCase() === trimmedInput.toLowerCase()
      );
      
      if (exactMatch) {
        // If exact match found, select it
        if (!selectedCountries.includes(exactMatch)) {
          setSelectedCountries([...selectedCountries, exactMatch]);
          setCountryPageCreation({ ...countryPageCreation, [exactMatch]: false });
        }
      } else {
        // If no exact match, add as custom country
        setCountries([...countries, trimmedInput]);
        setSelectedCountries([...selectedCountries, trimmedInput]);
        setCountryPageCreation({ ...countryPageCreation, [trimmedInput]: false });
        // Initialize state input for this country
        setStateInput({ ...stateInput, [trimmedInput]: "" });
        setSelectedStates({ ...selectedStates, [trimmedInput]: [] });
      }
      
      setCountrySearchInput('');
      setCurrentCountryPage(1); // Reset to first page
    }
  };

  const handleStateKeyDown = (country: string, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && stateInput[country]?.trim() !== '') {
      const newState = stateInput[country];
      const updatedStates = { ...states };
      if (!updatedStates[country]) {
        updatedStates[country] = [];
      }
      if (!updatedStates[country].includes(newState)) {
        updatedStates[country] = [...updatedStates[country], newState];

        // Add to selected states
        const updatedSelectedStates = { ...selectedStates };
        if (!updatedSelectedStates[country]) {
          updatedSelectedStates[country] = [];
        }
        updatedSelectedStates[country] = [...updatedSelectedStates[country], newState];
        setSelectedStates(updatedSelectedStates);

        // Initialize city input for this state
        setCityInput({ ...cityInput, [newState]: "" });
        setSelectedCities({ ...selectedCities, [newState]: [] });
      }
      setStates(updatedStates);
      setStateInput({ ...stateInput, [country]: "" });
    }
  };

  const handleCityKeyDown = (state: string, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && cityInput[state]?.trim() !== '') {
      const newCity = cityInput[state];
      const updatedCities = { ...cities };
      if (!updatedCities[state]) {
        updatedCities[state] = [];
      }
      if (!updatedCities[state].includes(newCity)) {
        updatedCities[state] = [...updatedCities[state], newCity];

        // Add to selected cities
        const updatedSelectedCities = { ...selectedCities };
        if (!updatedSelectedCities[state]) {
          updatedSelectedCities[state] = [];
        }
        updatedSelectedCities[state] = [...updatedSelectedCities[state], newCity];
        setSelectedCities(updatedSelectedCities);

        // Initialize local area input for this city
        setLocalAreaInput({ ...localAreaInput, [newCity]: "" });
        setLocalAreas({ ...localAreas, [newCity]: [] });
      }
      setCities(updatedCities);
      setCityInput({ ...cityInput, [state]: "" });
    }
  };

  const handleLocalAreaKeyDown = (city: string, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && localAreaInput[city]?.trim() !== '') {
      const newLocalArea = localAreaInput[city];
      const updatedLocalAreas = { ...localAreas };
      if (!updatedLocalAreas[city]) {
        updatedLocalAreas[city] = [];
      }
      if (!updatedLocalAreas[city].includes(newLocalArea)) {
        updatedLocalAreas[city] = [...updatedLocalAreas[city], newLocalArea];
      }
      setLocalAreas(updatedLocalAreas);
      setLocalAreaInput({ ...localAreaInput, [city]: "" });
    }
  };

  const selectCountryFromList = (country: string) => {
    if (!selectedCountries.includes(country)) {
      setSelectedCountries([...selectedCountries, country]);
      setCountryPageCreation({ ...countryPageCreation, [country]: false });
      // Initialize state input for this country
      setStateInput({ ...stateInput, [country]: "" });
      setSelectedStates({ ...selectedStates, [country]: [] });
    }
  };

  const toggleCountryPageCreation = (country: string) => {
    setCountryPageCreation({
      ...countryPageCreation,
      [country]: !countryPageCreation[country]
    });
  };

  const toggleState = (country: string, state: string) => {
    const updatedSelectedStates = { ...selectedStates };
    if (!updatedSelectedStates[country]) {
      updatedSelectedStates[country] = [];
    }

    if (updatedSelectedStates[country].includes(state)) {
      updatedSelectedStates[country] = updatedSelectedStates[country].filter(s => s !== state);
    } else {
      updatedSelectedStates[country] = [...updatedSelectedStates[country], state];
    }

    setSelectedStates(updatedSelectedStates);
  };

  const toggleCity = (state: string, city: string) => {
    const updatedSelectedCities = { ...selectedCities };
    if (!updatedSelectedCities[state]) {
      updatedSelectedCities[state] = [];
    }

    if (updatedSelectedCities[state].includes(city)) {
      updatedSelectedCities[state] = updatedSelectedCities[state].filter(c => c !== city);
    } else {
      updatedSelectedCities[state] = [...updatedSelectedCities[state], city];
    }

    setSelectedCities(updatedSelectedCities);
  };

  const selectAllCountries = () => {
    setSelectedCountries([...filteredCountries]);
    // Initialize page creation for all selected countries
    const newPageCreation = { ...countryPageCreation };
    filteredCountries.forEach(country => {
      if (!newPageCreation[country]) {
        newPageCreation[country] = false;
      }
    });
    setCountryPageCreation(newPageCreation);
  };

  const deselectAllCountries = () => {
    setSelectedCountries([]);
  };

  const selectAllStates = (country: string) => {
    const updatedSelectedStates = { ...selectedStates };
    updatedSelectedStates[country] = [...(states[country] || [])];
    setSelectedStates(updatedSelectedStates);
  };

  const deselectAllStates = (country: string) => {
    const updatedSelectedStates = { ...selectedStates };
    updatedSelectedStates[country] = [];
    setSelectedStates(updatedSelectedStates);
  };

  const selectAllCities = (state: string) => {
    const updatedSelectedCities = { ...selectedCities };
    updatedSelectedCities[state] = [...(cities[state] || [])];
    setSelectedCities(updatedSelectedCities);
  };

  const deselectAllCities = (state: string) => {
    const updatedSelectedCities = { ...selectedCities };
    updatedSelectedCities[state] = [];
    setSelectedCities(updatedSelectedCities);
  };

  const removeLocalArea = (city: string, area: string) => {
    const updatedLocalAreas = { ...localAreas };
    updatedLocalAreas[city] = updatedLocalAreas[city].filter(a => a !== area);
    setLocalAreas(updatedLocalAreas);
  };

  const removeCountry = (country: string) => {
    setSelectedCountries(selectedCountries.filter(c => c !== country));
    setCountries(countries.filter(c => c !== country));
    // Remove page creation setting when country is removed
    const updatedPageCreation = { ...countryPageCreation };
    delete updatedPageCreation[country];
    setCountryPageCreation(updatedPageCreation);
  };

  const removeState = (country: string, state: string) => {
    const updatedStates = { ...states };
    updatedStates[country] = updatedStates[country].filter(s => s !== state);
    setStates(updatedStates);

    const updatedSelectedStates = { ...selectedStates };
    updatedSelectedStates[country] = updatedSelectedStates[country].filter(s => s !== state);
    setSelectedStates(updatedSelectedStates);
  };

  const removeCity = (state: string, city: string) => {
    const updatedCities = { ...cities };
    updatedCities[state] = updatedCities[state].filter(c => c !== city);
    setCities(updatedCities);

    const updatedSelectedCities = { ...selectedCities };
    updatedSelectedCities[state] = updatedSelectedCities[state].filter(c => c !== city);
    setSelectedCities(updatedSelectedCities);
  };

  const handleCompletedFirstStep = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setStep(2);
    }, 1500);
  };

  const handleServiceOptionSelect = (option: "manual" | "ai") => {
    setShowServicesDialog(false);
    setServiceOption(option);
    setStep(7); // Move to service entry step
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // In a real app, you would process the file here
      // For demo purposes, we'll just show a success message
      toast({
        title: "File Uploaded",
        description: `${file.name} was successfully uploaded`,
      });
    }
  };

  const resetForm = () => {
    setProjectName("");
    setServiceType("");
    setWantImages(false);
    setCountries([]);
    setSelectedCountries([]);
    setCountrySearchInput("");
    setCountryPageCreation({});
    setStates({});
    setSelectedStates({});
    setStateInput({});
    setCities({});
    setSelectedCities({});
    setCityInput({});
    setLocalAreas({});
    setLocalAreaInput({});
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="serviceType">Service Type</Label>
              <Input
                id="serviceType"
                placeholder="Enter service type"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="wantImages"
                checked={wantImages}
                onCheckedChange={(checked) => setWantImages(checked === true)}
              />
              <label
                htmlFor="wantImages"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Do you want images?
              </label>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Choose Countries</h3>
            <div className="space-y-4">
              {/* Combined search and add input */}
              <div className="space-y-2">
                <Label>Search or Add Country</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search existing countries or type new country name and press Enter"
                    value={countrySearchInput}
                    onChange={(e) => {
                      setCountrySearchInput(e.target.value);
                      setCurrentCountryPage(1);
                    }}
                    onKeyDown={handleCountrySearchKeyDown}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Type to search existing countries or enter a new country name and press Enter to add it
                </p>
              </div>

              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={selectAllCountries}
                >
                  Select All ({filteredCountries.length})
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={deselectAllCountries}
                >
                  Deselect All
                </Button>
              </div>

              {/* Countries list without checkboxes */}
              <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {currentCountries.map(country => (
                    <div key={country} className="border p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => selectCountryFromList(country)}
                          className="flex-1 text-left text-sm font-medium cursor-pointer hover:text-blue-600"
                          disabled={selectedCountries.includes(country)}
                        >
                          {country}
                          {selectedCountries.includes(country) && (
                            <span className="ml-2 text-green-600">✓ Selected</span>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalCountryPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentCountryPage(Math.max(1, currentCountryPage - 1))}
                      disabled={currentCountryPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {currentCountryPage} of {totalCountryPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentCountryPage(Math.min(totalCountryPages, currentCountryPage + 1))}
                      disabled={currentCountryPage === totalCountryPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>

              {/* Selected countries display with page creation option */}
              <div>
                <h4 className="text-sm font-medium mb-2">Selected Countries ({selectedCountries.length})</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedCountries.map(country => (
                    <div key={country} className="flex items-center justify-between p-3 bg-white rounded border">
                      <span className="font-medium">{country}</span>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`page-${country}`}
                            checked={countryPageCreation[country] || false}
                            onCheckedChange={() => toggleCountryPageCreation(country)}
                          />
                          <label
                            htmlFor={`page-${country}`}
                            className="text-xs text-blue-600 cursor-pointer"
                          >
                            Create page
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCountry(country)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {selectedCountries.length === 0 && (
                    <div className="text-center p-4 text-gray-500 text-sm">
                      No countries selected yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Choose States</h3>
            <div className="space-y-6">
              {selectedCountries.map(country => (
                <div key={country} className="border p-4 rounded-md">
                  <h4 className="font-medium mb-2">{country}</h4>
                  <div className="space-y-2 mb-3">
                    <Input
                      placeholder={`Type state name for ${country} and press Enter`}
                      value={stateInput[country] || ""}
                      onChange={(e) => setStateInput({ ...stateInput, [country]: e.target.value })}
                      onKeyDown={(e) => handleStateKeyDown(country, e)}
                    />
                  </div>

                  <div className="flex space-x-2 mb-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => selectAllStates(country)}
                    >
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => deselectAllStates(country)}
                    >
                      Deselect All
                    </Button>
                  </div>

                  {/* States list */}
                  {states[country] && states[country].length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {states[country].map(state => (
                        <div key={state} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`state-${country}-${state}`}
                              checked={selectedStates[country]?.includes(state)}
                              onCheckedChange={() => toggleState(country, state)}
                            />
                            <label htmlFor={`state-${country}-${state}`} className="text-sm">
                              {state}
                            </label>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeState(country, state)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 mb-2">No states added yet</div>
                  )}

                  {/* Selected states */}
                  <div>
                    <h5 className="text-xs font-medium mb-1 text-gray-500">Selected States</h5>
                    <div className="flex flex-wrap gap-1">
                      {selectedStates[country] && selectedStates[country].map(state => (
                        <Badge key={state} variant="outline" className="text-xs">
                          {state}
                        </Badge>
                      ))}
                      {(!selectedStates[country] || selectedStates[country].length === 0) && (
                        <span className="text-xs text-gray-500">None selected</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {selectedCountries.length === 0 && (
                <div className="text-center p-6 border border-dashed rounded-md">
                  <p className="text-gray-500">No countries selected. Please go back and select countries first.</p>
                </div>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Choose Cities</h3>
            <div className="space-y-6">
              {Object.entries(selectedStates).flatMap(([country, statesList]) =>
                statesList.map(state => (
                  <div key={state} className="border p-4 rounded-md">
                    <h4 className="font-medium mb-1">{state}</h4>
                    <p className="text-xs text-gray-500 mb-2">({country})</p>
                    <div className="space-y-2 mb-3">
                      <Input
                        placeholder={`Type city name for ${state} and press Enter`}
                        value={cityInput[state] || ""}
                        onChange={(e) => setCityInput({ ...cityInput, [state]: e.target.value })}
                        onKeyDown={(e) => handleCityKeyDown(state, e)}
                      />
                    </div>

                    <div className="flex space-x-2 mb-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => selectAllCities(state)}
                      >
                        Select All
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => deselectAllCities(state)}
                      >
                        Deselect All
                      </Button>
                    </div>

                    {/* Cities list */}
                    {cities[state] && cities[state].length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {cities[state].map(city => (
                          <div key={city} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`city-${state}-${city}`}
                                checked={selectedCities[state]?.includes(city)}
                                onCheckedChange={() => toggleCity(state, city)}
                              />
                              <label htmlFor={`city-${state}-${city}`} className="text-sm">
                                {city}
                              </label>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeCity(state, city)}
                              className="text-gray-500 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 mb-2">No cities added yet</div>
                    )}

                    {/* Selected cities */}
                    <div>
                      <h5 className="text-xs font-medium mb-1 text-gray-500">Selected Cities</h5>
                      <div className="flex flex-wrap gap-1">
                        {selectedCities[state] && selectedCities[state].map(city => (
                          <Badge key={city} variant="outline" className="text-xs">
                            {city}
                          </Badge>
                        ))}
                        {(!selectedCities[state] || selectedCities[state].length === 0) && (
                          <span className="text-xs text-gray-500">None selected</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}

              {Object.values(selectedStates).every(states => states.length === 0) && (
                <div className="text-center p-6 border border-dashed rounded-md">
                  <p className="text-gray-500">No states selected. Please go back and select states first.</p>
                </div>
              )}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Choose Local Areas</h3>
            <div className="space-y-6">
              {Object.entries(selectedCities).flatMap(([state, citiesList]) =>
                citiesList.map(city => (
                  <div key={city} className="border p-4 rounded-md">
                    <h4 className="font-medium mb-1">{city}</h4>
                    <p className="text-xs text-gray-500 mb-2">({state})</p>
                    <div className="space-y-2 mb-3">
                      <label className="text-sm text-gray-700">Add Local Areas (Press Enter to Add):</label>
                      <Input
                        placeholder={`Type local area for ${city} and press Enter`}
                        value={localAreaInput[city] || ""}
                        onChange={(e) => setLocalAreaInput({ ...localAreaInput, [city]: e.target.value })}
                        onKeyDown={(e) => handleLocalAreaKeyDown(city, e)}
                      />
                    </div>

                    {/* Local areas list */}
                    <div>
                      <h5 className="text-xs font-medium mb-1 text-gray-500">Added Local Areas</h5>
                      <div className="flex flex-wrap gap-1">
                        {localAreas[city] && localAreas[city].map(area => (
                          <Badge
                            key={area}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {area}
                            <button
                              type="button"
                              onClick={() => removeLocalArea(city, area)}
                              className="text-xs"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                        {(!localAreas[city] || localAreas[city].length === 0) && (
                          <span className="text-xs text-gray-500">No local areas added</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}

              {Object.values(selectedCities).every(cities => cities.length === 0) && (
                <div className="text-center p-6 border border-dashed rounded-md">
                  <p className="text-gray-500">No cities selected. Please go back and select cities first.</p>
                </div>
              )}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Preview</h3>

            <div className="space-y-4 border p-4 rounded-md bg-gray-50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Project Name</h4>
                  <p className="font-medium">{projectName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Service Type</h4>
                  <p className="font-medium">{serviceType}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Want Images</h4>
                  <p className="font-medium">{wantImages ? "Yes" : "No"}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Countries with Page Creation</h4>
                <div className="space-y-2">
                  {selectedCountries.map(country => (
                    <div key={country} className="flex items-center justify-between p-2 bg-white rounded border">
                      <span className="font-medium">{country}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        countryPageCreation[country] 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {countryPageCreation[country] ? 'Page will be created' : 'No page'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Locations</h4>
                <div className="space-y-3">
                  {selectedCountries.map(country => (
                    <div key={country} className="border-t pt-2">
                      <h5 className="font-medium">{country}</h5>
                      {selectedStates[country] && selectedStates[country].length > 0 ? (
                        <div className="ml-4 mt-1 space-y-2">
                          {selectedStates[country].map(state => (
                            <div key={state}>
                              <p className="text-sm font-medium">{state}</p>
                              {selectedCities[state] && selectedCities[state].length > 0 ? (
                                <div className="ml-4">
                                  {selectedCities[state].map(city => (
                                    <div key={city} className="mt-1">
                                      <p className="text-sm">{city}</p>
                                      {localAreas[city] && localAreas[city].length > 0 && (
                                        <div className="flex flex-wrap gap-1 ml-4 mt-1">
                                          {localAreas[city].map(area => (
                                            <Badge key={area} variant="outline" className="text-xs">
                                              {area}
                                            </Badge>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-gray-500 ml-4">No cities selected</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 ml-4">No states selected</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 7:
        // Manual service entry
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">
              {serviceOption === "manual" ? "Manual Service Entry" : "AI Service Generation"}
            </h3>

            {serviceOption === "manual" ? (
              <>
                <div className="space-y-4">
                  <Label htmlFor="serviceNames">Enter service names or upload Excel</Label>
                  <div className="text-xs text-gray-500 mb-2">One service name per line</div>
                  <Textarea
                    id="serviceNames"
                    placeholder="Enter one service per line"
                    className="min-h-[150px]"
                    value={serviceNames}
                    onChange={(e) => setServiceNames(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fileUpload" className="block">Choose file</Label>
                  <div className="flex items-center">
                    <Input
                      id="fileUpload"
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileUpload}
                      className="flex-1"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-10 border-2 border-dashed rounded-lg">
                <Bot className="h-12 w-12 mx-auto text-blue-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">AI Service Generation</h3>
                <p className="text-gray-500 mb-4">
                  Our AI will analyze your project details and suggest appropriate services.
                </p>
                <div className="flex justify-center">
                  <Button
                    type="button"
                    onClick={() => {
                      toast({
                        title: "AI Services Generated",
                        description: "10 services have been generated based on your project",
                      });
                      setStep(8);
                    }}
                  >
                    Generate Services
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      case 8:
        // About us details
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Enter About Us Details</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="aboutUsEmail">Email</Label>
                </div>
                <Input
                  id="aboutUsEmail"
                  type="email"
                  placeholder="Enter email"
                  value={aboutUsEmail}
                  onChange={(e) => setAboutUsEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="aboutUsPhone">Phone</Label>
                </div>
                <Input
                  id="aboutUsPhone"
                  placeholder="Enter phone"
                  value={aboutUsPhone}
                  onChange={(e) => setAboutUsPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="aboutUsLocation">Main Location</Label>
                </div>
                <Input
                  id="aboutUsLocation"
                  placeholder="Enter main location"
                  value={aboutUsLocation}
                  onChange={(e) => setAboutUsLocation(e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Project Information";
      case 2: return "Country Selection";
      case 3: return "State Selection";
      case 4: return "City Selection";
      case 5: return "Local Area Selection";
      case 6: return "Preview";
      case 7: return serviceOption === "manual" ? "Manual Service Entry" : "AI Service Generation";
      case 8: return "About Us Details";
      default: return "Project Creation";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Create New Project</h1>
      </div>

      {!showFinalSuccess ? (
        <>
          <div className="flex justify-between mb-6">
            <div className="flex items-center space-x-2">
              {Array.from({ length: 8 }, (_, i) => i + 1).map(i => (
                <div
                  key={i}
                  className={`flex items-center ${i > 1 && "ml-2"}`}
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${step === i
                        ? "bg-blue-600 text-white"
                        : step > i
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-500"}`}
                  >
                    {step > i ? <Check className="h-4 w-4" /> : i}
                  </div>
                  {i < 8 && (
                    <div
                      className={`h-1 w-6 ${step > i ? "bg-green-500" : "bg-gray-200"}`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {showSuccess && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-lg font-medium">Project Created Successfully</p>
              </div>
            </div>
          )}

          <Dialog open={showServicesDialog} onOpenChange={setShowServicesDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>How do you want to add services?</DialogTitle>
                <DialogDescription>
                  Choose an option to add services to your project
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <Button
                  variant="outline"
                  className="flex flex-col h-auto p-6 space-y-2"
                  onClick={() => handleServiceOptionSelect("manual")}
                >
                  <ClipboardList className="h-10 w-10 text-gray-500" />
                  <span className="text-lg font-medium">Manual Entry</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col h-auto p-6 space-y-2"
                  onClick={() => handleServiceOptionSelect("ai")}
                >
                  <Bot className="h-10 w-10 text-blue-500" />
                  <span className="text-lg font-medium">AI Services</span>
                </Button>
              </div>
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  onClick={() => setShowServicesDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Card>
            <CardHeader>
              <CardTitle>{getStepTitle()}</CardTitle>
              <CardDescription>
                {step === 1 && "Enter the basic details for your new project."}
                {step === 2 && "Select the countries where your service will be available."}
                {step === 3 && "Select states or regions for your selected countries."}
                {step === 4 && "Select cities for your selected states."}
                {step === 5 && "Add local areas for your selected cities."}
                {step === 6 && "Review your project details before finalizing."}
                {step === 7 && serviceOption === "manual" && "Enter service names manually or upload a spreadsheet."}
                {step === 7 && serviceOption === "ai" && "Let our AI generate service suggestions for you."}
                {step === 8 && "Enter contact and location information for your business."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderStep()}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleBackStep}
                disabled={step === 1}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              <Button
                type="button"
                onClick={handleNextStep}
                disabled={(loading === 1)}
              >
                {step < 8 ? (
                  <>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  "Add Details"
                )}
              </Button>
            </CardFooter>
          </Card>
        </>
      ) : (
        <Card className="border-green-500">
          <CardHeader className="bg-green-50 border-b border-green-100">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-green-700">Success</CardTitle>
                <CardDescription className="text-green-600">
                  Your About Us information has been saved!
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <p className="text-lg">
                Your project has been successfully created and is ready to use.
              </p>

              <div className="text-sm text-gray-500">
                Redirecting in <span className="font-bold">{redirectCounter}</span> seconds…
              </div>

              <div>
                <Button onClick={() => navigate("/")}>
                  Go to project listing page
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
