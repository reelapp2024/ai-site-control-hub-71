import { useState, useEffect, useRef } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    icon: "fas fa-broom",
    status: "Active",
    createdAt: "5/23/2025",
    imageCount: 5,
  },
  {
    id: "2",
    name: "Office Maintenance",
    type: "Commercial",
    icon: "fas fa-building",
    status: "Draft",
    createdAt: "5/20/2025",
    imageCount: 8,
  },
  {
    id: "3",
    name: "Garden Landscaping",
    type: "Outdoor",
    icon: "fas fa-leaf",
    status: "Active",
    createdAt: "5/18/2025",
    imageCount: 12,
  },
  {
    id: "4",
    name: "Home Repairs",
    type: "Maintenance",
    icon: "fas fa-tools",
    status: "Pending",
    createdAt: "5/16/2025",
    imageCount: 3,
  },
  {
    id: "5",
    name: "Plumbing Services",
    type: "Specialty",
    icon: "fas fa-faucet",
    status: "Active",
    createdAt: "5/15/2025",
    imageCount: 6,
  },
  {
    id: "6",
    name: "Electrical Work",
    type: "Specialty",
    icon: "fas fa-bolt",
    status: "Inactive",
    createdAt: "5/14/2025",
    imageCount: 4,
  },
  {
    id: "7",
    name: "Carpet Cleaning",
    type: "House cleaning",
    icon: "fas fa-broom",
    status: "Active",
    createdAt: "5/12/2025",
    imageCount: 7,
  },
  {
    id: "8",
    name: "Window Washing",
    type: "House cleaning",
    icon: "fas fa-window-maximize",
    status: "Active",
    createdAt: "5/10/2025",
    imageCount: 9,
  },
  {
    id: "9",
    name: "Furniture Assembly",
    type: "Home setup",
    icon: "fas fa-couch",
    status: "Draft",
    createdAt: "5/8/2025",
    imageCount: 2,
  },
  {
    id: "10",
    name: "Moving Services",
    type: "Relocation",
    icon: "fas fa-truck",
    status: "Active",
    createdAt: "5/5/2025",
    imageCount: 15,
  },
];

export function ProjectList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const itemsPerPage = 5;

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

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return { variant: "default", className: "bg-green-600 hover:bg-green-700 text-white" };
      case "Inactive":
        return { variant: "secondary", className: "bg-gray-500 hover:bg-gray-600 text-white" };
      case "Draft":
        return { variant: "outline", className: "bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200" };
      case "Pending":
        return { variant: "secondary", className: "bg-blue-600 hover:bg-blue-700 text-white" };
      default:
        return { variant: "secondary", className: "" };
    }
  };

  return (
    <div className="space-y-6 font-poppins">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-600 text-white">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                Project Management
              </h1>
              <p className="text-sm text-purple-600 dark:text-purple-300">
                Create, manage and monitor your AI-powered web projects
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search projects..."
              className="pl-10 pr-4 w-full sm:w-[250px] h-10 border-purple-200 dark:border-purple-700 focus:border-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-10 px-4 border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button className="h-10 px-4 bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Filter Section with Dropdowns */}
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
                className="w-full justify-between bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700"
              >
                {selectedCountry
                  ? countries.find((country) => country.value === selectedCountry)?.label
                  : "Select country..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700">
              <Command className="bg-white dark:bg-gray-800">
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
                className="w-full justify-between bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700"
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
            <PopoverContent className="w-full p-0 bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700">
              <Command className="bg-white dark:bg-gray-800">
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

        <div className="space-y-2 md:col-span-2">
          <Button variant="default" className="mt-6 bg-purple-600 hover:bg-purple-700 text-white">
            Apply Filters
          </Button>
          <Button variant="ghost" className="mt-6 ml-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50">
            Reset
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-600 dark:text-purple-400">Total Projects</p>
                <p className="text-xl font-bold text-purple-900 dark:text-purple-100">{projectsData.length}</p>
              </div>
              <div className="p-2 bg-purple-600 rounded-lg">
                <Zap className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-600 dark:text-green-400">Active</p>
                <p className="text-xl font-bold text-green-900 dark:text-green-100">
                  {projectsData.filter(p => p.status === "Active").length}
                </p>
              </div>
              <div className="p-2 bg-green-600 rounded-lg">
                <Eye className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400">Draft</p>
                <p className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
                  {projectsData.filter(p => p.status === "Draft").length}
                </p>
              </div>
              <div className="p-2 bg-yellow-600 rounded-lg">
                <Pencil className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Total Images</p>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
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

      {/* Main Table Card */}
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader className="bg-purple-600 text-white">
          <CardTitle className="text-lg font-semibold">All Projects</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/50 border-purple-200 dark:border-purple-800">
                  <TableHead className="font-semibold text-purple-700 dark:text-purple-200 text-sm py-3">Sr No</TableHead>
                  <TableHead className="font-semibold text-purple-700 dark:text-purple-200 text-sm">Project Name</TableHead>
                  <TableHead className="font-semibold text-purple-700 dark:text-purple-200 text-sm">Service Type</TableHead>
                  <TableHead className="font-semibold text-purple-700 dark:text-purple-200 text-sm">Icon</TableHead>
                  <TableHead className="font-semibold text-purple-700 dark:text-purple-200 text-sm">Status</TableHead>
                  <TableHead className="font-semibold text-purple-700 dark:text-purple-200 text-sm">Created At</TableHead>
                  <TableHead className="font-semibold text-purple-700 dark:text-purple-200 text-sm">Image Count</TableHead>
                  <TableHead className="font-semibold text-purple-700 dark:text-purple-200 text-sm text-right w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProjects.map((project, index) => (
                  <TableRow 
                    key={project.id}
                    className="border-purple-100 dark:border-purple-800 hover:bg-purple-50/50 dark:hover:bg-purple-950/20"
                  >
                    <TableCell className="font-medium text-gray-700 dark:text-gray-300 py-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold">
                        {indexOfFirstItem + index + 1}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-800 dark:text-gray-200 text-sm">{project.name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1">
                        {project.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 h-8 w-8 rounded-lg flex items-center justify-center">
                        <span className={project.icon}></span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={getBadgeVariant(project.status).variant as "default" | "destructive" | "outline" | "secondary"}
                        className={`${getBadgeVariant(project.status).className} text-xs px-2 py-1 font-medium`}
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400 text-sm">{project.createdAt}</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 font-medium">
                        {project.imageCount}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-purple-100 dark:hover:bg-purple-900">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 bg-white dark:bg-gray-900 border-purple-200 dark:border-purple-700">
                            <DropdownMenuItem className="hover:bg-purple-50 dark:hover:bg-purple-900 text-sm">
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-purple-50 dark:hover:bg-purple-900 text-sm">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Live Site
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-purple-50 dark:hover:bg-purple-900 text-sm">
                              <Server className="mr-2 h-4 w-4" />
                              Services
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-purple-50 dark:hover:bg-purple-900 text-sm">
                              <Pencil className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                              Update Project
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 text-sm">
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {currentProjects.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500 space-y-3">
                        <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                          <Search className="h-8 w-8 text-purple-500" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-medium">No projects found</p>
                          <p className="text-sm">Try adjusting your search terms or create a new project</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            {filteredProjects.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 bg-purple-50/50 dark:bg-purple-950/20 border-t border-purple-200 dark:border-purple-800">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing <span className="font-medium text-purple-600 dark:text-purple-400">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-medium text-purple-600 dark:text-purple-400">
                    {Math.min(indexOfLastItem, filteredProjects.length)}
                  </span>{" "}
                  of <span className="font-medium text-purple-600 dark:text-purple-400">{filteredProjects.length}</span> projects
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900"} text-sm`}
                      />
                    </PaginationItem>
                    
                    {pageNumbers.map((number) => (
                      <PaginationItem key={number}>
                        <PaginationLink
                          isActive={currentPage === number}
                          onClick={() => handlePageChange(number)}
                          className={`text-sm ${currentPage === number ? "bg-purple-600 hover:bg-purple-700 text-white" : "hover:bg-purple-100 dark:hover:bg-purple-900"}`}
                        >
                          {number}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900"} text-sm`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
