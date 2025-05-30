
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Plus, 
  Wand2, 
  Edit, 
  Trash2, 
  Eye, 
  Upload,
  Settings
} from "lucide-react";
import { toast } from "react-toastify";

interface Service {
  id: string;
  name: string;
  icon: string;
  description: string;
  createdAt: string;
}

export function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Web Development",
      icon: "fas fa-code",
      description: "Custom web development services with modern technologies",
      createdAt: "2024-01-15"
    },
    {
      id: "2", 
      name: "SEO Optimization",
      icon: "fas fa-search",
      description: "Search engine optimization to improve your website ranking",
      createdAt: "2024-01-14"
    },
    {
      id: "3",
      name: "Digital Marketing",
      icon: "fas fa-bullhorn",
      description: "Comprehensive digital marketing strategies for your business",
      createdAt: "2024-01-13"
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [generateOption, setGenerateOption] = useState<string>("");
  const [manualServices, setManualServices] = useState("");
  
  const [newService, setNewService] = useState({
    name: "",
    icon: "fas fa-star",
    description: ""
  });

  const handleCreateService = () => {
    if (!newService.name.trim()) {
      toast.error("Service name is required");
      return;
    }

    const service: Service = {
      id: Date.now().toString(),
      name: newService.name,
      icon: newService.icon,
      description: newService.description,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setServices(prev => [...prev, service]);
    setNewService({ name: "", icon: "fas fa-star", description: "" });
    setIsCreateDialogOpen(false);
    toast.success("Service created successfully!");
  };

  const handleEditService = () => {
    if (!selectedService || !newService.name.trim()) return;

    setServices(prev => prev.map(service => 
      service.id === selectedService.id 
        ? { ...service, name: newService.name, icon: newService.icon, description: newService.description }
        : service
    ));
    
    setIsEditDialogOpen(false);
    setSelectedService(null);
    setNewService({ name: "", icon: "fas fa-star", description: "" });
    toast.success("Service updated successfully!");
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(prev => prev.filter(service => service.id !== serviceId));
    toast.success("Service deleted successfully!");
  };

  const openEditDialog = (service: Service) => {
    setSelectedService(service);
    setNewService({
      name: service.name,
      icon: service.icon,
      description: service.description
    });
    setIsEditDialogOpen(true);
  };

  const openPreviewDialog = (service: Service) => {
    setSelectedService(service);
    setIsPreviewDialogOpen(true);
  };

  const handleGenerateServices = () => {
    if (generateOption === "manual") {
      if (!manualServices.trim()) {
        toast.error("Please enter service names");
        return;
      }
      
      const serviceNames = manualServices.split('\n').filter(name => name.trim());
      const newServices = serviceNames.map(name => ({
        id: Date.now().toString() + Math.random(),
        name: name.trim(),
        icon: "fas fa-star",
        description: `Professional ${name.trim().toLowerCase()} services`,
        createdAt: new Date().toISOString().split('T')[0]
      }));
      
      setServices(prev => [...prev, ...newServices]);
      setManualServices("");
      toast.success(`${newServices.length} services added successfully!`);
    } else if (generateOption === "ai") {
      // Simulate AI generation
      const aiServices = [
        { name: "AI Content Writing", icon: "fas fa-robot", description: "AI-powered content creation services" },
        { name: "Chatbot Development", icon: "fas fa-comments", description: "Intelligent chatbot solutions" },
        { name: "Data Analytics", icon: "fas fa-chart-bar", description: "Advanced data analysis and insights" }
      ].map(service => ({
        ...service,
        id: Date.now().toString() + Math.random(),
        createdAt: new Date().toISOString().split('T')[0]
      }));
      
      setServices(prev => [...prev, ...aiServices]);
      toast.success("AI services generated successfully!");
    }
    
    setGenerateOption("");
    setIsGenerateDialogOpen(false);
  };

  return (
    <div className="space-y-6 font-poppins">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600 text-white">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                Services Management
              </h1>
              <p className="text-sm text-blue-600 dark:text-blue-300">
                Manage your project services
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Wand2 className="h-4 w-4 mr-2" />
                Generate AI Services
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle>How do you want to add services?</DialogTitle>
                <DialogDescription>Choose your preferred method</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    generateOption === "manual" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setGenerateOption("manual")}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">📋</span>
                    <div>
                      <h4 className="font-medium">Manual Entry</h4>
                      <p className="text-sm text-gray-600">Enter service names or upload Excel</p>
                    </div>
                  </div>
                  
                  {generateOption === "manual" && (
                    <div className="mt-3 space-y-3">
                      <div>
                        <label className="text-sm text-gray-600">One service name per line</label>
                        <Textarea 
                          placeholder="Web Development&#10;SEO Services&#10;Digital Marketing"
                          value={manualServices}
                          onChange={(e) => setManualServices(e.target.value)}
                          className="mt-1"
                          rows={4}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Excel
                        </Button>
                        <span className="text-sm text-gray-500">No file chosen</span>
                      </div>
                    </div>
                  )}
                </div>

                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    generateOption === "ai" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setGenerateOption("ai")}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🤖</span>
                    <div>
                      <h4 className="font-medium">AI Services</h4>
                      <p className="text-sm text-gray-600">
                        New services will be added in background; description generation will follow.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsGenerateDialogOpen(false);
                    setGenerateOption("");
                    setManualServices("");
                  }}
                >
                  ❌ Cancel
                </Button>
                <Button 
                  onClick={handleGenerateServices}
                  disabled={!generateOption}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  OK
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add New Service
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Service</DialogTitle>
                <DialogDescription>Add a new service to your project</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium">Service Name</label>
                  <Input 
                    value={newService.name}
                    onChange={(e) => setNewService(prev => ({...prev, name: e.target.value}))}
                    placeholder="Enter service name"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Icon Class</label>
                  <Input 
                    value={newService.icon}
                    onChange={(e) => setNewService(prev => ({...prev, icon: e.target.value}))}
                    placeholder="fas fa-star"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea 
                    value={newService.description}
                    onChange={(e) => setNewService(prev => ({...prev, description: e.target.value}))}
                    placeholder="Enter service description"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateService}>Create Service</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>Services List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>
                    <i className={`${service.icon} text-lg text-blue-600`}></i>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{service.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openPreviewDialog(service)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(service)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Service</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{service.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteService(service.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>Update service information</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Service Name</label>
              <Input 
                value={newService.name}
                onChange={(e) => setNewService(prev => ({...prev, name: e.target.value}))}
                placeholder="Enter service name"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Icon Class</label>
              <Input 
                value={newService.icon}
                onChange={(e) => setNewService(prev => ({...prev, icon: e.target.value}))}
                placeholder="fas fa-star"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                value={newService.description}
                onChange={(e) => setNewService(prev => ({...prev, description: e.target.value}))}
                placeholder="Enter service description"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditService}>Update Service</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Service Preview</DialogTitle>
          </DialogHeader>
          
          {selectedService && (
            <div className="space-y-4 py-4">
              <div className="text-center">
                <i className={`${selectedService.icon} text-4xl text-blue-600 mb-3`}></i>
                <h3 className="text-xl font-semibold">{selectedService.name}</h3>
              </div>
              
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Description:</span>
                  <p className="text-gray-600 mt-1">{selectedService.description}</p>
                </div>
                
                <div>
                  <span className="font-medium">Created:</span>
                  <p className="text-gray-600">{selectedService.createdAt}</p>
                </div>
                
                <div>
                  <span className="font-medium">Icon Class:</span>
                  <Badge variant="outline" className="ml-2">{selectedService.icon}</Badge>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button onClick={() => setIsPreviewDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
