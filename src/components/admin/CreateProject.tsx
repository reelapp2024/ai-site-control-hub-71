
import { useState, KeyboardEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Check, ChevronRight, ChevronLeft, ClipboardList, Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";

export function CreateProject() {
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [wantImages, setWantImages] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Location selection states
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [countryInput, setCountryInput] = useState("");
  
  const [states, setStates] = useState<{[country: string]: string[]}>({});
  const [selectedStates, setSelectedStates] = useState<{[country: string]: string[]}>({});
  const [stateInput, setStateInput] = useState<{[country: string]: string}>({});
  
  const [cities, setCities] = useState<{[state: string]: string[]}>({});
  const [selectedCities, setSelectedCities] = useState<{[state: string]: string[]}>({});
  const [cityInput, setCityInput] = useState<{[state: string]: string}>({});
  
  const [localAreas, setLocalAreas] = useState<{[city: string]: string[]}>({});
  const [localAreaInput, setLocalAreaInput] = useState<{[city: string]: string}>({});
  
  const [showServicesDialog, setShowServicesDialog] = useState(false);
  
  // Sample data - in a real app, these would come from an API
  const sampleCountries = ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France"];

  const handleNextStep = () => {
    if (step === 1) {
      if (!projectName || !serviceType) return;
      setStep(step + 1);
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
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleCountryKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && countryInput.trim() !== '') {
      if (!countries.includes(countryInput)) {
        setCountries([...countries, countryInput]);
        setSelectedCountries([...selectedCountries, countryInput]);
        // Initialize state input for this country
        setStateInput({...stateInput, [countryInput]: ""});
        setSelectedStates({...selectedStates, [countryInput]: []});
      }
      setCountryInput('');
    }
  };

  const handleStateKeyDown = (country: string, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && stateInput[country]?.trim() !== '') {
      const newState = stateInput[country];
      const updatedStates = {...states};
      if (!updatedStates[country]) {
        updatedStates[country] = [];
      }
      if (!updatedStates[country].includes(newState)) {
        updatedStates[country] = [...updatedStates[country], newState];
        
        // Add to selected states
        const updatedSelectedStates = {...selectedStates};
        if (!updatedSelectedStates[country]) {
          updatedSelectedStates[country] = [];
        }
        updatedSelectedStates[country] = [...updatedSelectedStates[country], newState];
        setSelectedStates(updatedSelectedStates);
        
        // Initialize city input for this state
        setCityInput({...cityInput, [newState]: ""});
        setSelectedCities({...selectedCities, [newState]: []});
      }
      setStates(updatedStates);
      setStateInput({...stateInput, [country]: ""});
    }
  };

  const handleCityKeyDown = (state: string, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && cityInput[state]?.trim() !== '') {
      const newCity = cityInput[state];
      const updatedCities = {...cities};
      if (!updatedCities[state]) {
        updatedCities[state] = [];
      }
      if (!updatedCities[state].includes(newCity)) {
        updatedCities[state] = [...updatedCities[state], newCity];
        
        // Add to selected cities
        const updatedSelectedCities = {...selectedCities};
        if (!updatedSelectedCities[state]) {
          updatedSelectedCities[state] = [];
        }
        updatedSelectedCities[state] = [...updatedSelectedCities[state], newCity];
        setSelectedCities(updatedSelectedCities);
        
        // Initialize local area input for this city
        setLocalAreaInput({...localAreaInput, [newCity]: ""});
        setLocalAreas({...localAreas, [newCity]: []});
      }
      setCities(updatedCities);
      setCityInput({...cityInput, [state]: ""});
    }
  };

  const handleLocalAreaKeyDown = (city: string, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && localAreaInput[city]?.trim() !== '') {
      const newLocalArea = localAreaInput[city];
      const updatedLocalAreas = {...localAreas};
      if (!updatedLocalAreas[city]) {
        updatedLocalAreas[city] = [];
      }
      if (!updatedLocalAreas[city].includes(newLocalArea)) {
        updatedLocalAreas[city] = [...updatedLocalAreas[city], newLocalArea];
      }
      setLocalAreas(updatedLocalAreas);
      setLocalAreaInput({...localAreaInput, [city]: ""});
    }
  };

  const toggleCountry = (country: string) => {
    if (selectedCountries.includes(country)) {
      setSelectedCountries(selectedCountries.filter(c => c !== country));
    } else {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  const toggleState = (country: string, state: string) => {
    const updatedSelectedStates = {...selectedStates};
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
    const updatedSelectedCities = {...selectedCities};
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
    setSelectedCountries([...countries]);
  };

  const deselectAllCountries = () => {
    setSelectedCountries([]);
  };

  const selectAllStates = (country: string) => {
    const updatedSelectedStates = {...selectedStates};
    updatedSelectedStates[country] = [...(states[country] || [])];
    setSelectedStates(updatedSelectedStates);
  };

  const deselectAllStates = (country: string) => {
    const updatedSelectedStates = {...selectedStates};
    updatedSelectedStates[country] = [];
    setSelectedStates(updatedSelectedStates);
  };

  const selectAllCities = (state: string) => {
    const updatedSelectedCities = {...selectedCities};
    updatedSelectedCities[state] = [...(cities[state] || [])];
    setSelectedCities(updatedSelectedCities);
  };

  const deselectAllCities = (state: string) => {
    const updatedSelectedCities = {...selectedCities};
    updatedSelectedCities[state] = [];
    setSelectedCities(updatedSelectedCities);
  };

  const removeLocalArea = (city: string, area: string) => {
    const updatedLocalAreas = {...localAreas};
    updatedLocalAreas[city] = updatedLocalAreas[city].filter(a => a !== area);
    setLocalAreas(updatedLocalAreas);
  };

  const removeCountry = (country: string) => {
    setSelectedCountries(selectedCountries.filter(c => c !== country));
    setCountries(countries.filter(c => c !== country));
  };

  const removeState = (country: string, state: string) => {
    const updatedStates = {...states};
    updatedStates[country] = updatedStates[country].filter(s => s !== state);
    setStates(updatedStates);
    
    const updatedSelectedStates = {...selectedStates};
    updatedSelectedStates[country] = updatedSelectedStates[country].filter(s => s !== state);
    setSelectedStates(updatedSelectedStates);
  };

  const removeCity = (state: string, city: string) => {
    const updatedCities = {...cities};
    updatedCities[state] = updatedCities[state].filter(c => c !== city);
    setCities(updatedCities);
    
    const updatedSelectedCities = {...selectedCities};
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

  const handleServiceOptionSelect = (option: string) => {
    setShowServicesDialog(false);
    // Here you would handle the service selection
    // For now, we'll just reset to step 1
    setStep(1);
    resetForm();
  };

  const resetForm = () => {
    setProjectName("");
    setServiceType("");
    setWantImages(false);
    setCountries([]);
    setSelectedCountries([]);
    setCountryInput("");
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
    switch(step) {
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
              <div className="flex space-x-2">
                <Input
                  placeholder="Type and press Enter to add countries"
                  value={countryInput}
                  onChange={(e) => setCountryInput(e.target.value)}
                  onKeyDown={handleCountryKeyDown}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={selectAllCountries}
                >
                  Select All
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

              {/* Sample countries */}
              <div className="grid grid-cols-2 gap-2">
                {sampleCountries.map(country => (
                  <div key={country} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`country-${country}`}
                      checked={countries.includes(country) && selectedCountries.includes(country)}
                      onCheckedChange={() => {
                        if (!countries.includes(country)) {
                          setCountries([...countries, country]);
                          setSelectedCountries([...selectedCountries, country]);
                          setStateInput({...stateInput, [country]: ""});
                        } else {
                          toggleCountry(country);
                        }
                      }}
                    />
                    <label
                      htmlFor={`country-${country}`}
                      className="text-sm font-medium leading-none"
                    >
                      {country}
                    </label>
                  </div>
                ))}
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Selected Countries</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCountries.map(country => (
                    <Badge key={country} variant="secondary" className="flex items-center gap-1">
                      {country}
                      <button 
                        type="button" 
                        onClick={() => removeCountry(country)}
                        className="text-xs"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
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
                      onChange={(e) => setStateInput({...stateInput, [country]: e.target.value})}
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
                        onChange={(e) => setCityInput({...cityInput, [state]: e.target.value})}
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
                        onChange={(e) => setLocalAreaInput({...localAreaInput, [city]: e.target.value})}
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
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch(step) {
      case 1: return "Project Information";
      case 2: return "Country Selection";
      case 3: return "State Selection";
      case 4: return "City Selection";
      case 5: return "Local Area Selection";
      case 6: return "Preview";
      default: return "Project Creation";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Create New Project</h1>
      </div>
      
      <div className="flex justify-between mb-6">
        <div className="flex items-center space-x-2">
          {Array.from({length: 6}, (_, i) => i + 1).map(i => (
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
              {i < 6 && (
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
            onClick={step === 1 ? handleCompletedFirstStep : handleNextStep}
            disabled={(step === 1 && (!projectName || !serviceType))}
          >
            {step < 6 ? (
              <>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Complete Project"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
