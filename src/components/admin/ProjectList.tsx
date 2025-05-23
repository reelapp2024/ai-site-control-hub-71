
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListPlus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Sample data for demonstration
const projects = [
  {
    id: "1",
    name: "Corporate Website Redesign",
    type: "Business",
    status: "In Progress",
    lastUpdated: "2023-05-20",
    progress: 65,
  },
  {
    id: "2",
    name: "E-commerce Platform",
    type: "E-commerce",
    status: "Completed",
    lastUpdated: "2023-05-18",
    progress: 100,
  },
  {
    id: "3",
    name: "Personal Blog",
    type: "Blog",
    status: "Draft",
    lastUpdated: "2023-05-15",
    progress: 20,
  },
  {
    id: "4",
    name: "Photography Portfolio",
    type: "Portfolio",
    status: "In Progress",
    lastUpdated: "2023-05-12",
    progress: 45,
  },
  {
    id: "5",
    name: "Restaurant Website",
    type: "Business",
    status: "Completed",
    lastUpdated: "2023-05-10",
    progress: 100,
  },
];

export function ProjectList() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <div className="flex w-full sm:w-auto gap-2">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search projects..."
              className="w-full pl-8"
            />
          </div>
          <Button className="shrink-0">
            <ListPlus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>All Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-4 py-3 rounded-l-lg">Project Name</th>
                  <th scope="col" className="px-4 py-3">Type</th>
                  <th scope="col" className="px-4 py-3">Last Updated</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3">Progress</th>
                  <th scope="col" className="px-4 py-3 rounded-r-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b dark:border-gray-700">
                    <td className="px-4 py-3 font-medium">{project.name}</td>
                    <td className="px-4 py-3">{project.type}</td>
                    <td className="px-4 py-3">{project.lastUpdated}</td>
                    <td className="px-4 py-3">
                      <Badge 
                        variant={
                          project.status === "Completed" ? "success" : 
                          project.status === "In Progress" ? "default" : 
                          "secondary"
                        }
                        className={
                          project.status === "Completed" ? "bg-green-500" : 
                          project.status === "In Progress" ? "bg-blue-500" : 
                          "bg-gray-500"
                        }
                      >
                        {project.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 block">{project.progress}%</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm">View</Button>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No projects found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
