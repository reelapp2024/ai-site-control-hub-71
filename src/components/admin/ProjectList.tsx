
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, ExternalLink, Pencil, Search, Server, Trash, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
        return { variant: "default", className: "bg-emerald-500 hover:bg-emerald-600" };
      case "Inactive":
        return { variant: "secondary", className: "bg-slate-500 hover:bg-slate-600" };
      case "Draft":
        return { variant: "outline", className: "border-amber-500 text-amber-500 hover:bg-amber-100" };
      case "Pending":
        return { variant: "secondary", className: "bg-blue-500 hover:bg-blue-600" };
      default:
        return { variant: "secondary", className: "" };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Project Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and monitor all your web generation projects
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Search projects..."
              className="pl-10 pr-4 w-full sm:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
            New Project
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="bg-gray-50 dark:bg-gray-800/50 rounded-t-lg border-b px-6">
          <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            All Projects
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 dark:bg-gray-800/20 hover:bg-gray-50/70 dark:hover:bg-gray-800/30">
                  <TableHead className="w-[80px] font-medium">Sr No</TableHead>
                  <TableHead className="font-medium">Project Name</TableHead>
                  <TableHead className="font-medium">Service Type</TableHead>
                  <TableHead className="font-medium">Icon</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium">Created At</TableHead>
                  <TableHead className="font-medium">Image Count</TableHead>
                  <TableHead className="font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProjects.map((project, index) => (
                  <TableRow 
                    key={project.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-700 dark:text-gray-300">{indexOfFirstItem + index + 1}</TableCell>
                    <TableCell>
                      <div className="font-semibold text-gray-800 dark:text-gray-200">{project.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-medium px-2.5 py-1 rounded-full inline-block">
                        {project.type}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 h-8 w-8 rounded-full flex items-center justify-center">
                        <span className={project.icon}></span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={getBadgeVariant(project.status).variant as "default" | "destructive" | "outline" | "secondary"}
                        className={`${getBadgeVariant(project.status).className} px-2.5 py-0.5 rounded-full text-xs font-medium`}
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{project.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium px-2.5 py-1 rounded-full">
                          {project.imageCount}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end space-x-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Preview">
                          <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Live Site">
                          <ExternalLink className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Services">
                          <Server className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" title="Update Project">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" title="Delete">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {currentProjects.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Search className="h-10 w-10 mb-3 text-gray-400" />
                        <p className="text-lg font-medium">No projects found</p>
                        <p className="text-sm">Try adjusting your search terms</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            {filteredProjects.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredProjects.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredProjects.length}</span> projects
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {pageNumbers.map((number) => (
                      <PaginationItem key={number}>
                        <PaginationLink
                          isActive={currentPage === number}
                          onClick={() => handlePageChange(number)}
                          className={currentPage === number ? "bg-blue-600 hover:bg-blue-700" : ""}
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
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
