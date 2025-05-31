import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FaGlobe, FaShoppingCart, FaBuilding, FaPalette, FaCheckCircle, FaCode, FaCamera, FaSearch, FaMobileAlt, FaPencilAlt, FaChartBar, FaUsers, FaEnvelope, FaLock } from 'react-icons/fa';

interface ProjectType {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface Industry {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface Feature {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const CreateProject = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProjectType, setSelectedProjectType] = useState<number | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<number | null>(null);
  const [projectName, setProjectName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [preferredColors, setPreferredColors] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);
  const [wantImages, setWantImages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const router = useRouter();

  const projectTypes: ProjectType[] = [
    { id: 1, name: 'Informational Website', description: 'Perfect for showcasing your business or personal brand.', icon: <FaGlobe /> },
    { id: 2, name: 'E-commerce Store', description: 'Start selling products online with a fully functional online store.', icon: <FaShoppingCart /> },
    { id: 3, name: 'Business Website', description: 'Establish a professional online presence for your company.', icon: <FaBuilding /> },
    { id: 4, name: 'Portfolio Website', description: 'Showcase your work and skills with a stunning portfolio.', icon: <FaPalette /> },
  ];

  const industries: Industry[] = [
    { id: 1, name: 'Technology', description: 'For tech startups and software companies.', icon: <FaCode /> },
    { id: 2, name: 'Photography', description: 'Showcase your visual artistry.', icon: <FaCamera /> },
    { id: 3, name: 'Marketing', description: 'Attract clients with a professional marketing site.', icon: <FaChartBar /> },
    { id: 4, name: 'Retail', description: 'Sell your products to a broad audience.', icon: <FaShoppingCart /> },
  ];

  const features: Feature[] = [
    { id: 1, name: 'SEO Optimization', description: 'Improve your website\'s visibility on search engines.', icon: <FaSearch /> },
    { id: 2, name: 'Mobile Responsive', description: 'Ensure your website looks great on all devices.', icon: <FaMobileAlt /> },
    { id: 3, name: 'Blog Integration', description: 'Share your thoughts and ideas with a built-in blog.', icon: <FaPencilAlt /> },
    { id: 4, name: 'Customer Support Chat', description: 'Provide real-time support to your website visitors.', icon: <FaUsers /> },
    { id: 5, name: 'Contact Form', description: 'Allow visitors to easily get in touch with you.', icon: <FaEnvelope /> },
    { id: 6, name: 'Security Features', description: 'Protect your website and user data with advanced security measures.', icon: <FaLock /> },
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setIsTransitioning(true);
      
      // Show loading for a moment before transitioning
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsTransitioning(false);
      }, 800);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsTransitioning(false);
      }, 400);
    }
  };

  const handleProjectTypeSelect = (typeId: number) => {
    setSelectedProjectType(typeId);
  };

  const handleIndustrySelect = (industryId: number) => {
    setSelectedIndustry(industryId);
  };

  const handleFeatureToggle = (featureId: number) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId) ? prev.filter((id) => id !== featureId) : [...prev, featureId]
    );
  };

  const canProceed = () => {
    if (currentStep === 1) return selectedProjectType !== null;
    if (currentStep === 2) return selectedIndustry !== null;
    if (currentStep === 3) return projectName.trim() !== '' && businessDescription.trim() !== '';
    return true;
  };

  const handleCreateProject = async () => {
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLoading(false);
    alert('Project created successfully!');
    router.push('/admin/projects');
  };

  const renderStepContent = () => {
    if (isTransitioning) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Please wait...</p>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Project Type</h2>
              <p className="text-gray-600 text-lg">Select the type of website you want to create</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {projectTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => handleProjectTypeSelect(type.id)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedProjectType === type.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">{type.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{type.name}</h3>
                    <p className="text-gray-600 text-sm">{type.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Select Your Industry</h2>
              <p className="text-gray-600 text-lg">Choose the industry that best describes your business</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
              {industries.map((industry) => (
                <div
                  key={industry.id}
                  onClick={() => handleIndustrySelect(industry.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                    selectedIndustry === industry.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{industry.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{industry.name}</h3>
                      <p className="text-gray-600 text-sm">{industry.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Project Details</h2>
              <p className="text-gray-600 text-lg">Tell us more about your project</p>
            </div>
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter your project name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Description *
                </label>
                <textarea
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  placeholder="Describe your business in detail..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Who is your target audience?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Colors
                </label>
                <input
                  type="text"
                  value={preferredColors}
                  onChange={(e) => setPreferredColors(e.target.value)}
                  placeholder="e.g., Blue, Green, Modern"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Features & Preferences</h2>
              <p className="text-gray-600 text-lg">Select the features you want to include</p>
            </div>
            <div className="max-w-4xl mx-auto space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Core Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature) => (
                    <label key={feature.id} className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFeatures.includes(feature.id)}
                        onChange={() => handleFeatureToggle(feature.id)}
                        className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-2xl mr-2">{feature.icon}</span>
                        <span className="font-medium text-gray-900">{feature.name}</span>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Options</h3>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wantImages}
                      onChange={(e) => setWantImages(e.target.checked)}
                      className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-medium text-gray-900">Include AI-Generated Images</span>
                      <p className="text-sm text-gray-600">Add relevant images to make your website more engaging</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Review & Create</h2>
              <p className="text-gray-600 text-lg">Review your project details before creation</p>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Project Type</h3>
                    <p className="text-gray-600">
                      {projectTypes.find(type => type.id === selectedProjectType)?.name}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Industry</h3>
                    <p className="text-gray-600">
                      {industries.find(industry => industry.id === selectedIndustry)?.name}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Project Name</h3>
                    <p className="text-gray-600">{projectName}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Target Audience</h3>
                    <p className="text-gray-600">{targetAudience || 'Not specified'}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Business Description</h3>
                  <p className="text-gray-600">{businessDescription}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Selected Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedFeatures.map(featureId => {
                      const feature = features.find(f => f.id === featureId);
                      return feature ? (
                        <span key={featureId} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {feature.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Creating your project...</p>
                    <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <button
                      onClick={handleCreateProject}
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Create My Project
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
            <span className="text-sm text-gray-500">Step {currentStep} of 5</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        {!isTransitioning && (
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            
            {currentStep < 5 && (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  canProceed()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateProject;
