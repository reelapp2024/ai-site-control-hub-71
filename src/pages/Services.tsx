
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Upload,
  Bot,
  FileText,
  X,
  Wand2,
  Settings,
  Zap
} from 'lucide-react';
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";

interface Service {
  id: string;
  name: string;
  icon: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

const Services = () => {
  const { projectId } = useParams();
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Web Development',
      icon: '🌐',
      description: 'Complete web development solutions',
      status: 'active',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Mobile App Development',
      icon: '📱',
      description: 'iOS and Android app development',
      status: 'active',
      createdAt: '2024-01-14'
    },
    {
      id: '3',
      name: 'Digital Marketing',
      icon: '📢',
      description: 'SEO, Social Media, and Content Marketing',
      status: 'inactive',
      createdAt: '2024-01-13'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeSection, setActiveSection] = useState('services');

  const [newService, setNewService] = useState({
    name: '',
    icon: '',
    description: ''
  });

  const [manualServices, setManualServices] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateService = () => {
    if (newService.name && newService.description) {
      const service: Service = {
        id: Date.now().toString(),
        name: newService.name,
        icon: newService.icon || '⚙️',
        description: newService.description,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setServices(prev => [...prev, service]);
      setNewService({ name: '', icon: '', description: '' });
      setShowCreateDialog(false);
    }
  };

  const handleEditService = () => {
    if (selectedService && newService.name && newService.description) {
      setServices(prev => prev.map(service =>
        service.id === selectedService.id
          ? { ...service, name: newService.name, icon: newService.icon || service.icon, description: newService.description }
          : service
      ));
      setShowEditDialog(false);
      setSelectedService(null);
      setNewService({ name: '', icon: '', description: '' });
    }
  };

  const handleDeleteService = () => {
    if (selectedService) {
      setServices(prev => prev.filter(service => service.id !== selectedService.id));
      setShowDeleteDialog(false);
      setSelectedService(null);
    }
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setNewService({
      name: service.name,
      icon: service.icon,
      description: service.description
    });
    setShowEditDialog(true);
  };

  const handleDelete = (service: Service) => {
    setSelectedService(service);
    setShowDeleteDialog(true);
  };

  const handlePreview = (service: Service) => {
    setSelectedService(service);
    setShowPreviewDialog(true);
  };

  const handleManualEntry = () => {
    const serviceNames = manualServices.split('\n').filter(name => name.trim());
    const newServices: Service[] = serviceNames.map(name => ({
      id: Date.now().toString() + Math.random(),
      name: name.trim(),
      icon: '⚙️',
      description: `Auto-generated service: ${name.trim()}`,
      status: 'active' as const,
      createdAt: new Date().toISOString().split('T')[0]
    }));
    
    setServices(prev => [...prev, ...newServices]);
    setManualServices('');
    setSelectedFile(null);
    setShowGenerateDialog(false);
  };

  const handleAIGeneration = () => {
    // Simulate AI service generation
    const aiServices: Service[] = [
      {
        id: Date.now().toString() + '1',
        name: 'AI Content Writing',
        icon: '🤖',
        description: 'AI-powered content creation and copywriting services',
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      },
      {
        id: Date.now().toString() + '2',
        name: 'Data Analytics',
        icon: '📊',
        description: 'Advanced data analysis and business intelligence',
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      }
    ];
    
    setServices(prev => [...prev, ...aiServices]);
    setShowGenerateDialog(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-purple-950 dark:to-gray-900 flex font-poppins">
      <AdminSidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />
      
      <main className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-800/20 min-h-[calc(100vh-4rem)]">
            <div className="p-4 sm:p-6 lg:p-8">
              
              {/* Header Section */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-600 text-white">
                      <Settings className="h-5 w-5" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        Service Management
                      </h1>
                      <p className="text-sm text-purple-600 dark:text-purple-300">
                        Manage services for Project ID: {projectId}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search services..."
                      className="pl-10 pr-4 w-full sm:w-[250px] h-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setShowCreateDialog(true)}
                      className="h-10 px-4 bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Service
                    </Button>
                    <Button 
                      onClick={() => setShowGenerateDialog(true)}
                      className="h-10 px-4 bg-purple-600 hover:bg-purple-700 text-white flex-1 sm:flex-none"
                    >
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate AI Services
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                          {services.filter(s => s.status === 'active').length}
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
                          {services.filter(s => s.status === 'inactive').length}
                        </p>
                      </div>
                      <div className="p-2 bg-orange-600 rounded-lg">
                        <X className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-purple-600">This Month</p>
                        <p className="text-2xl font-bold text-purple-900">+3</p>
                      </div>
                      <div className="p-2 bg-purple-600 rounded-lg">
                        <Plus className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Services Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Services ({filteredServices.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px]">Icon</TableHead>
                          <TableHead>Service Name</TableHead>
                          <TableHead className="hidden md:table-cell">Description</TableHead>
                          <TableHead className="hidden sm:table-cell">Status</TableHead>
                          <TableHead className="hidden lg:table-cell">Created</TableHead>
                          <TableHead className="text-right w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredServices.map((service) => (
                          <TableRow key={service.id}>
                            <TableCell>
                              <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg text-lg">
                                {service.icon}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{service.name}</TableCell>
                            <TableCell className="hidden md:table-cell max-w-xs truncate">
                              {service.description}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Badge 
                                className={cn(
                                  service.status === 'active' 
                                    ? 'bg-green-100 text-green-800 border-green-200' 
                                    : 'bg-gray-100 text-gray-800 border-gray-200'
                                )}
                              >
                                {service.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">{service.createdAt}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                  <DropdownMenuItem 
                                    onClick={() => handlePreview(service)}
                                    className="cursor-pointer"
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Preview
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleEdit(service)}
                                    className="cursor-pointer"
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDelete(service)}
                                    className="cursor-pointer text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {filteredServices.length === 0 && (
                    <div className="text-center py-12">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800">
                          <Settings className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium">No services found</h3>
                          <p className="text-sm text-gray-500">
                            {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first service'}
                          </p>
                        </div>
                        <Button onClick={() => setShowCreateDialog(true)} className="bg-purple-600 hover:bg-purple-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Add New Service
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </main>

      {/* Create/Edit Service Dialog */}
      <Dialog open={showCreateDialog || showEditDialog} onOpenChange={(open) => {
        if (!open) {
          setShowCreateDialog(false);
          setShowEditDialog(false);
          setNewService({ name: '', icon: '', description: '' });
          setSelectedService(null);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{showEditDialog ? 'Edit Service' : 'Create New Service'}</DialogTitle>
            <DialogDescription>
              {showEditDialog ? 'Update the service details below.' : 'Fill in the details to create a new service.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="serviceName">Service Name</Label>
              <Input
                id="serviceName"
                value={newService.name}
                onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter service name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceIcon">Icon (Emoji)</Label>
              <Input
                id="serviceIcon"
                value={newService.icon}
                onChange={(e) => setNewService(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="🌐"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceDescription">Description</Label>
              <Textarea
                id="serviceDescription"
                value={newService.description}
                onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter service description"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowCreateDialog(false);
                setShowEditDialog(false);
                setNewService({ name: '', icon: '', description: '' });
                setSelectedService(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={showEditDialog ? handleEditService : handleCreateService}
              disabled={!newService.name || !newService.description}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {showEditDialog ? 'Update' : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Service Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Service Preview</DialogTitle>
            <DialogDescription>Preview of the selected service</DialogDescription>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg text-2xl">
                  {selectedService.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedService.name}</h3>
                  <Badge 
                    className={cn(
                      selectedService.status === 'active' 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-gray-100 text-gray-800 border-gray-200'
                    )}
                  >
                    {selectedService.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="font-medium">Description</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {selectedService.description}
                </p>
              </div>
              <div>
                <Label className="font-medium">Created Date</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {selectedService.createdAt}
                </p>
              </div>
            </div>
          )}
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the service 
              "{selectedService?.name}" from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteService}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Generate Services Dialog */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>How do you want to add services?</DialogTitle>
            <DialogDescription>
              Choose your preferred method to add new services
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            
            {/* Manual Entry Option */}
            <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-blue-50/50 dark:bg-blue-950/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold">📋 Manual Entry</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enter service names or upload Excel
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="manualServices" className="text-sm">
                    One service name per line
                  </Label>
                  <Textarea
                    id="manualServices"
                    value={manualServices}
                    onChange={(e) => setManualServices(e.target.value)}
                    placeholder="Web Development&#10;Mobile App Development&#10;Digital Marketing"
                    rows={4}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="fileUpload" className="text-sm">
                    Or upload Excel file
                  </Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Input
                      id="fileUpload"
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileUpload}
                      className="file:mr-2 file:px-2 file:py-1 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                    />
                  </div>
                  {selectedFile && (
                    <p className="text-xs text-green-600 mt-1">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
                
                <Button 
                  onClick={handleManualEntry}
                  disabled={!manualServices.trim() && !selectedFile}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  OK
                </Button>
              </div>
            </div>

            {/* AI Services Option */}
            <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-purple-50/50 dark:bg-purple-950/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Bot className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold">🤖 AI Services</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    New services will be added in background; description generation will follow.
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={handleAIGeneration}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Generate AI Services
              </Button>
            </div>

          </div>
          
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setShowGenerateDialog(false)}>
              ❌ Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Services;
