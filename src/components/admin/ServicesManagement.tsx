
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Zap,
  Edit,
  Trash2,
  ArrowLeft,
  MoreHorizontal,
  Settings,
  Globe,
  Code
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { httpFile } from "../../config.js";
import { toast } from "react-toastify";

interface Service {
  _id: string;
  serviceName: string;
  serviceType: string;
  status: number;
  description: string;
  createdAt: string;
  lastModified: string;
}

export function ServicesManagement() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState("");

  // Mock data for now - replace with API call
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        // For now, using mock data
        const mockServices: Service[] = [
          {
            _id: "1",
            serviceName: "Authentication Service",
            serviceType: "API",
            status: 1,
            description: "User authentication and authorization",
            createdAt: "2024-01-15T10:30:00Z",
            lastModified: "2024-01-20T14:20:00Z"
          },
          {
            _id: "2",
            serviceName: "Payment Gateway",
            serviceType: "Integration",
            status: 1,
            description: "Stripe payment processing integration",
            createdAt: "2024-01-16T09:15:00Z",
            lastModified: "2024-01-18T16:45:00Z"
          },
          {
            _id: "3",
            serviceName: "Email Service",
            serviceType: "Utility",
            status: 0,
            description: "Email notification and marketing service",
            createdAt: "2024-01-17T11:00:00Z",
            lastModified: "2024-01-17T11:00:00Z"
          }
        ];
        
        setServices(mockServices);
        setProjectName("Sample Project");
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch services");
        setLoading(false);
      }
    };

    fetchServices();
  }, [projectId]);

  const filteredServices = services.filter(service =>
    service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditService = (serviceId: string) => {
    navigate(`/admin/project/${projectId}/service/${serviceId}/edit`);
  };

  const handleDeleteService = async (serviceId: string) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        // API call would go here
        setServices(services.filter(s => s._id !== serviceId));
        toast.success("Service deleted successfully");
      } catch (error) {
        toast.error("Failed to delete service");
      }
    }
  };

  const handleAddNewService = () => {
    navigate(`/admin/project/${projectId}/service/new`);
  };

  const handleGenerateService = () => {
    navigate(`/admin/project/${projectId}/service/generate`);
  };

  const getBadgeVariant = (status: number) => {
    return status === 1 
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getServiceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'api':
        return <Code className="h-4 w-4" />;
      case 'integration':
        return <Settings className="h-4 w-4" />;
      case 'utility':
        return <Globe className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-poppins">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/admin/project-list")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600 text-white">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                Services Management
              </h1>
              <p className="text-sm text-blue-600 dark:text-blue-300">
                {projectName} - Manage project services
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search services..."
            className="pl-10 pr-4 w-full lg:w-[300px] h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={handleAddNewService}
            className="h-10 px-4 bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Service
          </Button>
          <Button 
            onClick={handleGenerateService}
            className="h-10 px-4 bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Zap className="h-4 w-4 mr-2" />
            Generate New Service
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600">Total Services</p>
                <p className="text-2xl font-bold text-blue-900">{services.length}</p>
              </div>
              <div className="p-2 bg-blue-600 rounded-lg">
                <Settings className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-600">Active Services</p>
                <p className="text-2xl font-bold text-green-900">
                  {services.filter(s => s.status === 1).length}
                </p>
              </div>
              <div className="p-2 bg-green-600 rounded-lg">
                <Zap className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-orange-600">Inactive Services</p>
                <p className="text-2xl font-bold text-orange-900">
                  {services.filter(s => s.status === 0).length}
                </p>
              </div>
              <div className="p-2 bg-orange-600 rounded-lg">
                <Globe className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Services ({filteredServices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 rounded-full bg-blue-100">
                  <Settings className="h-8 w-8 text-blue-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">No services found</h3>
                  <p className="text-sm text-gray-500">
                    {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first service"}
                  </p>
                </div>
                <Button onClick={handleAddNewService} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Service
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getServiceIcon(service.serviceType)}
                        <span className="font-medium">{service.serviceName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {service.serviceType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getBadgeVariant(service.status)}>
                        {service.status === 1 ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {service.description}
                    </TableCell>
                    <TableCell>
                      {new Date(service.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => handleEditService(service._id)}>
                            <Edit className="mr-2 h-4 w-4 text-blue-600" />
                            Edit Service
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteService(service._id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Service
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
