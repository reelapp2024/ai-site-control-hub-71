
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type SubAdmin = {
  id: number;
  fullName: string;
  location: string;
  email: string;
  phone: string;
  type: string;
};

const INITIAL_SUBADMINS: SubAdmin[] = [
  {
    id: 1,
    fullName: "sony xperia",
    location: "Xperia",
    email: "sony@xperia.com",
    phone: "7856341234",
    type: "0",
  },
];

export function SubAdminManagement() {
  const [view, setView] = useState<"list" | "add">("list");
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>(INITIAL_SUBADMINS);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form state for adding new sub-admin
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    address: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    // Add new sub-admin
    const newSubAdmin: SubAdmin = {
      id: subAdmins.length + 1,
      fullName: formData.fullName,
      location: formData.address,
      email: formData.email,
      phone: formData.phone,
      type: "0",
    };

    setSubAdmins([...subAdmins, newSubAdmin]);
    
    // Reset form and go back to list view
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      address: "",
    });
    
    toast({
      title: "Success",
      description: "Sub Admin created successfully!",
    });
    
    setView("list");
  };

  const filteredSubAdmins = subAdmins.filter(
    (subAdmin) =>
      subAdmin.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subAdmin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subAdmin.phone.includes(searchTerm)
  );

  if (view === "add") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Add SubAdmin</h1>
          <Button 
            variant="outline" 
            onClick={() => setView("list")}
          >
            Back to List
          </Button>
        </div>

        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a href="#" onClick={() => setView("list")} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                Home
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <a href="#" onClick={() => setView("list")} className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                  Manage SubAdmin
                </a>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Add SubAdmin
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Add SubAdmin</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  E-Mail
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium">
                  Phone
                </label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium">
                  Address
                </label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button 
                type="button" 
                variant="outline" 
                className="mr-2"
                onClick={() => setView("list")}
              >
                Cancel
              </Button>
              <Button type="submit">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage SubAdmin</h1>
        <Button 
          onClick={() => setView("add")}
        >
          Add SubAdmin
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">SubAdmin Listing</h2>
          <div className="relative">
            <Input
              placeholder="Search..."
              className="pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Sr No</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubAdmins.length > 0 ? (
                filteredSubAdmins.map((subAdmin) => (
                  <TableRow key={subAdmin.id}>
                    <TableCell>{subAdmin.id}</TableCell>
                    <TableCell>{subAdmin.fullName}</TableCell>
                    <TableCell>{subAdmin.location}</TableCell>
                    <TableCell>{subAdmin.email}</TableCell>
                    <TableCell>{subAdmin.phone}</TableCell>
                    <TableCell>{subAdmin.type}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No sub-admins found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
