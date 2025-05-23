import { useState } from "react";
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
  const itemsPerPage = 5;

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
        return { variant: "default", className: "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0" };
      case "Inactive":
        return { variant: "secondary", className: "bg-gradient-to-r from-slate-400 to-slate-500 hover:from-slate-500 hover:to-slate-600 text-white border-0" };
      case "Draft":
        return { variant: "outline", className: "bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-300 text-amber-700 hover:from-amber-200 hover:to-yellow-200" };
      case "Pending":
        return { variant: "secondary", className: "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0" };
      default:
        return { variant: "secondary", className: "" };
    }
  };

  return (
    <div className="space-y-8 font-poppins">
      {/* Header Section */}
      <div className="flex flex-col space-y-6 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Project Management
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                Create, manage and monitor your AI-powered web projects
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search projects..."
              className="pl-12 pr-4 w-full sm:w-[300px] h-12 text-base border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-12 px-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Filter className="h-5 w-5 mr-2" />
            Filter
          </Button>
          <Button className="h-12 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg shadow-purple-500/25 transition-all">
            <Plus className="h-5 w-5 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Total Projects</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{projectsData.length}</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-xl">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-600 dark:text-green-400">Active</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {projectsData.filter(p => p.status === "Active").length}
                </p>
              </div>
              <div className="p-3 bg-green-500 rounded-xl">
                <Eye className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-950 dark:to-yellow-900 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">Draft</p>
                <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                  {projectsData.filter(p => p.status === "Draft").length}
                </p>
              </div>
              <div className="p-3 bg-amber-500 rounded-xl">
                <Pencil className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950 dark:to-pink-900 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">Total Images</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                  {projectsData.reduce((sum, p) => sum + p.imageCount, 0)}
                </p>
              </div>
              <div className="p-3 bg-purple-500 rounded-xl">
                <Server className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-xl">
          <CardTitle className="text-2xl font-bold">All Projects</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/80 dark:bg-gray-800/50 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 border-b-2 border-gray-200 dark:border-gray-700">
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200 text-base py-4">Sr No</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200 text-base">Project Name</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200 text-base">Service Type</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200 text-base">Icon</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200 text-base">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200 text-base">Created At</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200 text-base">Image Count</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200 text-base text-right w-[60px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProjects.map((project, index) => (
                  <TableRow 
                    key={project.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 dark:hover:from-purple-950/20 dark:hover:to-pink-950/20 transition-all duration-200"
                  >
                    <TableCell className="font-semibold text-gray-700 dark:text-gray-300 py-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold">
                        {indexOfFirstItem + index + 1}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-gray-800 dark:text-gray-200 text-base">{project.name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-800 dark:text-gray-200 border-0 font-medium px-3 py-1">
                        {project.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 h-10 w-10 rounded-xl flex items-center justify-center shadow-sm">
                        <span className={project.icon}></span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={getBadgeVariant(project.status).variant as "default" | "destructive" | "outline" | "secondary"}
                        className={`${getBadgeVariant(project.status).className} px-3 py-1 font-semibold shadow-sm`}
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400 font-medium">{project.createdAt}</TableCell>
                    <TableCell>
                      <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 border-0 font-semibold px-3 py-1">
                        {project.imageCount}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950/50 dark:hover:to-pink-950/50 transition-all">
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl">
                            <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950/50 dark:hover:to-indigo-950/50 rounded-lg m-1 transition-all">
                              <Eye className="mr-3 h-4 w-4" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-950/50 dark:hover:to-emerald-950/50 rounded-lg m-1 transition-all">
                              <ExternalLink className="mr-3 h-4 w-4" />
                              Live Site
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950/50 dark:hover:to-pink-950/50 rounded-lg m-1 transition-all">
                              <Server className="mr-3 h-4 w-4" />
                              Services
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 dark:hover:from-amber-950/50 dark:hover:to-yellow-950/50 rounded-lg m-1 transition-all">
                              <Pencil className="mr-3 h-4 w-4 text-blue-600 dark:text-blue-400" />
                              Update Project
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-950/50 dark:hover:to-pink-950/50 rounded-lg m-1 transition-all">
                              <Trash className="mr-3 h-4 w-4" />
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
                    <TableCell colSpan={8} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500 space-y-4">
                        <div className="p-4 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                          <Search className="h-12 w-12 text-gray-400" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-xl font-semibold">No projects found</p>
                          <p className="text-base">Try adjusting your search terms or create a new project</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            {filteredProjects.length > 0 && (
              <div className="flex items-center justify-between px-8 py-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-t border-gray-100 dark:border-gray-700">
                <div className="text-base text-gray-600 dark:text-gray-400 font-medium">
                  Showing <span className="font-bold text-purple-600 dark:text-purple-400">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {Math.min(indexOfLastItem, filteredProjects.length)}
                  </span>{" "}
                  of <span className="font-bold text-purple-600 dark:text-purple-400">{filteredProjects.length}</span> projects
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950/50 dark:hover:to-pink-950/50"} rounded-xl transition-all`}
                      />
                    </PaginationItem>
                    
                    {pageNumbers.map((number) => (
                      <PaginationItem key={number}>
                        <PaginationLink
                          isActive={currentPage === number}
                          onClick={() => handlePageChange(number)}
                          className={`rounded-xl transition-all ${currentPage === number ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white" : "hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950/50 dark:hover:to-pink-950/50"}`}
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
                        className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950/50 dark:hover:to-pink-950/50"} rounded-xl transition-all`}
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
