
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, ExternalLink, Pencil, Search, Server, Trash, Filter, MoreHorizontal, Plus, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Sample countries and states for dropdowns
const countries = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "in", label: "India" },
  { value: "jp", label: "Japan" },
  { value: "br", label: "Brazil" },
  { value: "mx", label: "Mexico" },
];

const statesByCountry = {
  us: [
    { value: "ny", label: "New York" },
    { value: "ca", label: "California" },
    { value: "tx", label: "Texas" },
    { value: "fl", label: "Florida" },
    { value: "il", label: "Illinois" },
  ],
  ca: [
    { value: "on", label: "Ontario" },
    { value: "qc", label: "Quebec" },
    { value: "bc", label: "British Columbia" },
    { value: "ab", label: "Alberta" },
    { value: "ns", label: "Nova Scotia" },
  ],
  uk: [
    { value: "eng", label: "England" },
    { value: "sct", label: "Scotland" },
    { value: "wls", label: "Wales" },
    { value: "nir", label: "Northern Ireland" },
  ],
  // Add states for other countries as needed
};

// Sample data for demonstration
const projectsData = [
  {
    id: "1",
    name: "House cleaning",
    type: "House cleaning",
    icon: "🏠",
    status: "Active",
    createdAt: "5/23/2025",
    imageCount: 5,
  },
  {
    id: "2",
    name: "Office Maintenance",
    type: "Commercial",
    icon: "🏢",
    status: "Draft",
    createdAt: "5/20/2025",
    imageCount: 8,
  },
  {
    id: "3",
    name: "Garden Landscaping",
    type: "Outdoor",
    icon: "🌿",
    status: "Active",
    createdAt: "5/18/2025",
    imageCount: 12,
  },
  {
    id: "4",
    name: "Home Repairs",
    type: "Maintenance",
    icon: "🔧",
    status: "Pending",
    createdAt: "5/16/2025",
    imageCount: 3,
  },
  {
    id: "5",
    name: "Plumbing Services",
    type: "Specialty",
    icon: "🚰",
    status: "Active",
    createdAt: "5/15/2025",
    imageCount: 6,
  },
  {
    id: "6",
    name: "Electrical Work",
    type: "Specialty",
    icon: "⚡",
    status: "Inactive",
    createdAt: "5/14/2025",
    imageCount: 4,
  },
  {
    id: "7",
    name: "Carpet Cleaning",
    type: "House cleaning",
    icon: "🧹",
    status: "Active",
    createdAt: "5/12/2025",
    imageCount: 7,
  },
  {
    id: "8",
    name: "Window Washing",
    type: "House cleaning",
    icon: "🪟",
    status: "Active",
    createdAt: "5/10/2025",
    imageCount: 9,
  },
];

export function ProjectList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const itemsPerPage = 6;

  // Reset state when country changes
  useEffect(() => {
    setSelectedState("");
  }, [selectedCountry]);

  // Filter projects based on search term
  const filteredProjects = projectsData.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Pending":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6 font-poppins">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-600 text-white">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                Project Management
              </h1>
              <p className="text-sm text-purple-600 dark:text-purple-300">
                Manage and monitor your projects
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search projects..."
              className="pl-10 pr-4 w-full sm:w-[250px] h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="h-10 px-4 bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Country
            </label>
            <Popover open={countryOpen} onOpenChange={setCountryOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={countryOpen}
                  className="w-full justify-between"
                >
                  {selectedCountry
                    ? countries.find((country) => country.value === selectedCountry)?.label
                    : "Select country..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search country..." />
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup className="max-h-[200px] overflow-y-auto">
                    {countries.map((country) => (
                      <CommandItem
                        key={country.value}
                        value={country.value}
                        onSelect={(currentValue) => {
                          setSelectedCountry(currentValue === selectedCountry ? "" : currentValue);
                          setCountryOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedCountry === country.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {country.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              State/Province
            </label>
            <Popover open={stateOpen} onOpenChange={setStateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={stateOpen}
                  className="w-full justify-between"
                  disabled={!selectedCountry}
                >
                  {selectedState && selectedCountry
                    ? statesByCountry[selectedCountry as keyof typeof statesByCountry]?.find(
                        (state) => state.value === selectedState
                      )?.label
                    : "Select state..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search state..." />
                  <CommandEmpty>No state found.</CommandEmpty>
                  <CommandGroup className="max-h-[200px] overflow-y-auto">
                    {selectedCountry &&
                      statesByCountry[selectedCountry as keyof typeof statesByCountry]?.map((state) => (
                        <CommandItem
                          key={state.value}
                          value={state.value}
                          onSelect={(currentValue) => {
                            setSelectedState(currentValue === selectedState ? "" : currentValue);
                            setStateOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedState === state.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {state.label}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2 md:col-span-2 flex items-end gap-2">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Apply Filters
            </Button>
            <Button variant="outline" className="text-purple-600 hover:text-purple-700">
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-600">Total Projects</p>
                <p className="text-2xl font-bold text-purple-900">{projectsData.length}</p>
              </div>
              <div className="p-2 bg-purple-600 rounded-lg">
                <Zap className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-600">Active</p>
                <p className="text-2xl font-bold text-green-900">
                  {projectsData.filter(p => p.status === "Active").length}
                </p>
              </div>
              <div className="p-2 bg-green-600 rounded-lg">
                <Eye className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-yellow-600">Draft</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {projectsData.filter(p => p.status === "Draft").length}
                </p>
              </div>
              <div className="p-2 bg-yellow-600 rounded-lg">
                <Pencil className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600">Total Images</p>
                <p className="text-2xl font-bold text-blue-900">
                  {projectsData.reduce((sum, p) => sum + p.imageCount, 0)}
                </p>
              </div>
              <div className="p-2 bg-blue-600 rounded-lg">
                <Server className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow duration-200 border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{project.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{project.name}</h3>
                    <p className="text-xs text-gray-500">{project.type}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Site
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4 text-blue-600" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Status</span>
                  <Badge className={`text-xs px-2 py-1 ${getBadgeVariant(project.status)}`}>
                    {project.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Created</span>
                  <span className="text-xs text-gray-700">{project.createdAt}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Images</span>
                  <Badge className="bg-purple-100 text-purple-700 text-xs px-2 py-1">
                    {project.imageCount}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {currentProjects.length === 0 && (
        <Card className="py-16">
          <CardContent className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 rounded-full bg-purple-100">
                <Search className="h-8 w-8 text-purple-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">No projects found</h3>
                <p className="text-sm text-gray-500">Try adjusting your search terms or create a new project</p>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create New Project
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {filteredProjects.length > 0 && (
        <div className="flex items-center justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <PaginationItem key={number}>
                  <PaginationLink
                    isActive={currentPage === number}
                    onClick={() => handlePageChange(number)}
                    className="cursor-pointer"
                  >
                    {number}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
