
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
import { Plus, Zap, MoreHorizontal, Pencil, Trash, Bot } from "lucide-react";

interface Service {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export default function Services() {
  const { projectId } = useParams<{ projectId: string }>();
  const [activeSection, setActiveSection] = useState("services");
  
  // Mock data for services - replace with actual API call
  const [services] = useState<Service[]>([
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

  const handleDeleteService = (serviceId: string) => {
    console.log("Delete service:", serviceId);
    // TODO: Implement delete functionality
  };

  const handleGenerateAIServices = () => {
    console.log("Generate AI services for project:", projectId);
    // TODO: Implement AI service generation
  };

  const handleCreateNewService = () => {
    console.log("Create new service for project:", projectId);
    // TODO: Navigate to create service page
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
                                <DropdownMenuContent align="end" className="w-40 bg-white shadow-lg border">
                                  <DropdownMenuItem 
                                    onClick={() => handleEditService(service.id)}
                                    className="cursor-pointer"
                                  >
                                    <Pencil className="mr-2 h-4 w-4 text-blue-600" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteService(service.id)}
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
    </div>
  );
}
