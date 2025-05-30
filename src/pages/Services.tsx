
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Zap, MoreHorizontal, Pencil, Trash, Bot, Upload, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Service {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export default function Services() {
  const { projectId } = useParams<{ projectId: string }>();
  const [activeSection, setActiveSection] = useState("services");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [manualServices, setManualServices] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Mock data for services - replace with actual API call
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "User Authentication",
      icon: "fas fa-user-shield",
      description: "Complete user authentication system with login, register, and password reset"
    },
    {
      id: "2", 
      name: "Payment Gateway",
      icon: "fas fa-credit-card",
      description: "Stripe integration for handling payments and subscriptions"
    },
    {
      id: "3",
      name: "Email Service",
      icon: "fas fa-envelope",
      description: "Email notification service with templates and scheduling"
    }
  ]);

  const handleEditService = (serviceId: string) => {
    console.log("Edit service:", serviceId);
    // TODO: Navigate to edit service page
  };

  const handleDeleteService = (service: Service) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (serviceToDelete) {
      setServices(services.filter(s => s.id !== serviceToDelete.id));
      toast({
        title: "Service Deleted",
        description: `${serviceToDelete.name} has been deleted successfully.`,
      });
      setServiceToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleGenerateAIServices = () => {
    setGenerateDialogOpen(true);
  };

  const handleCreateNewService = () => {
    console.log("Create new service for project:", projectId);
    // TODO: Navigate to create service page
  };

  const handleManualEntry = () => {
    if (manualServices.trim()) {
      const serviceNames = manualServices.split('\n').filter(name => name.trim());
      const newServices = serviceNames.map((name, index) => ({
        id: `new-${Date.now()}-${index}`,
        name: name.trim(),
        icon: "fas fa-cog",
        description: "Service description to be added"
      }));
      
      setServices([...services, ...newServices]);
      toast({
        title: "Services Added",
        description: `${newServices.length} services have been added manually.`,
      });
      setManualServices("");
      setGenerateDialogOpen(false);
    }
  };

  const handleAIGeneration = () => {
    toast({
      title: "AI Services Generation Started",
      description: "New services will be added in background; description generation will follow.",
    });
    setGenerateDialogOpen(false);
    
    // Simulate AI generation
    setTimeout(() => {
      const aiServices = [
        {
          id: `ai-${Date.now()}-1`,
          name: "AI Content Generator",
          icon: "fas fa-robot",
          description: "AI-powered content generation service"
        },
        {
          id: `ai-${Date.now()}-2`,
          name: "Data Analytics",
          icon: "fas fa-chart-bar",
          description: "Advanced data analytics and reporting service"
        }
      ];
      
      setServices(prev => [...prev, ...aiServices]);
      toast({
        title: "AI Services Generated",
        description: `${aiServices.length} AI services have been generated successfully.`,
      });
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // TODO: Process Excel file
      toast({
        title: "File Selected",
        description: `${file.name} has been selected for upload.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-purple-950 dark:to-gray-900 flex font-poppins">
      <AdminSidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-800/20 min-h-[calc(100vh-4rem)]">
            <div className="p-8">
              {/* Header Section */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-600 text-white">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        Project Services
                      </h1>
                      <p className="text-sm text-purple-600 dark:text-purple-300">
                        Manage and configure services for your project
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handleGenerateAIServices}
                    className="h-10 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    Generate AI Services
                  </Button>
                  <Button 
                    onClick={handleCreateNewService}
                    className="h-10 px-4 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Service
                  </Button>
                </div>
              </div>

              {/* Services Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-600" />
                    Available Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {services.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="p-4 rounded-full bg-purple-100">
                          <Zap className="h-8 w-8 text-purple-500" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium">No services found</h3>
                          <p className="text-sm text-gray-500">
                            Create your first service or generate AI services to get started
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <Button 
                            onClick={handleGenerateAIServices}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                          >
                            <Bot className="h-4 w-4 mr-2" />
                            Generate AI Services
                          </Button>
                          <Button 
                            onClick={handleCreateNewService}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create New Service
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service Name</TableHead>
                          <TableHead>Icon</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {services.map((service) => (
                          <TableRow key={service.id}>
                            <TableCell className="font-medium">
                              {service.name}
                            </TableCell>
                            <TableCell>
                              <i className={`${service.icon} text-xl text-purple-600`}></i>
                            </TableCell>
                            <TableCell className="max-w-md">
                              <p className="text-sm text-gray-600 truncate">
                                {service.description}
                              </p>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40 bg-white shadow-lg border z-50">
                                  <DropdownMenuItem 
                                    onClick={() => handleEditService(service.id)}
                                    className="cursor-pointer"
                                  >
                                    <Pencil className="mr-2 h-4 w-4 text-blue-600" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteService(service)}
                                    className="cursor-pointer text-red-600"
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
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
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the service "{serviceToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Generate AI Services Dialog */}
      <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
        <DialogContent className="bg-white max-w-md">
          <DialogHeader>
            <DialogTitle>How do you want to add services?</DialogTitle>
            <DialogDescription>
              Choose your preferred method to add new services to your project.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Manual Entry Option */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium">📋 Manual Entry</h3>
              </div>
              <p className="text-sm text-gray-600">Enter service names or upload Excel</p>
              <div className="space-y-2">
                <Label htmlFor="services">One service name per line</Label>
                <Textarea
                  id="services"
                  placeholder="Enter service names, one per line..."
                  value={manualServices}
                  onChange={(e) => setManualServices(e.target.value)}
                  rows={3}
                />
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="text-sm"
                  />
                  {selectedFile && (
                    <span className="text-xs text-green-600">
                      {selectedFile.name}
                    </span>
                  )}
                </div>
                <Button 
                  onClick={handleManualEntry}
                  disabled={!manualServices.trim() && !selectedFile}
                  className="w-full"
                >
                  OK
                </Button>
              </div>
            </div>

            {/* AI Services Option */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-purple-600" />
                <h3 className="font-medium">🤖 AI Services</h3>
              </div>
              <p className="text-sm text-gray-600">
                New services will be added in background; description generation will follow.
              </p>
              <Button 
                onClick={handleAIGeneration}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Generate AI Services
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setGenerateDialogOpen(false)}
              className="w-full"
            >
              ❌ Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
