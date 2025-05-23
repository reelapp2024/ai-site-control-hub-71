
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, ExternalLink, Pencil, Search, Server, Trash } from "lucide-react";
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
        return { variant: "default", className: "bg-green-500" };
      case "Inactive":
        return { variant: "secondary", className: "bg-gray-500" };
      case "Draft":
        return { variant: "outline", className: "border-amber-500 text-amber-500" };
      case "Pending":
        return { variant: "secondary", className: "bg-blue-500" };
      default:
        return { variant: "secondary", className: "" };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Project Listing</h1>
        <div className="flex w-full sm:w-auto gap-2">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by project name..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>All Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sr No</TableHead>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Image Count</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProjects.map((project, index) => (
                  <TableRow key={project.id}>
                    <TableCell>{indexOfFirstItem + index + 1}</TableCell>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{project.type}</TableCell>
                    <TableCell><span className={project.icon}></span></TableCell>
                    <TableCell>
                      <Badge 
                        variant={getBadgeVariant(project.status).variant as "default" | "destructive" | "outline" | "secondary"}
                        className={getBadgeVariant(project.status).className}
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{project.createdAt}</TableCell>
                    <TableCell>{project.imageCount}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" title="Preview">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Live Site">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Services">
                          <Server className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Update Project">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {currentProjects.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                      No projects found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            {filteredProjects.length > 0 && (
              <div className="mt-4">
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
