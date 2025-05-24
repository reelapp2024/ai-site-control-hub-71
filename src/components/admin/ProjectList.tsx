import { useState, useEffect } from "react";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Comprehensive list of 50+ countries
const countries = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "in", label: "India" },
  { value: "jp", label: "Japan" },
  { value: "br", label: "Brazil" },
  { value: "mx", label: "Mexico" },
  { value: "it", label: "Italy" },
  { value: "es", label: "Spain" },
  { value: "ru", label: "Russia" },
  { value: "cn", label: "China" },
  { value: "kr", label: "South Korea" },
  { value: "ar", label: "Argentina" },
  { value: "cl", label: "Chile" },
  { value: "co", label: "Colombia" },
  { value: "pe", label: "Peru" },
  { value: "ve", label: "Venezuela" },
  { value: "za", label: "South Africa" },
  { value: "ng", label: "Nigeria" },
  { value: "eg", label: "Egypt" },
  { value: "ma", label: "Morocco" },
  { value: "ke", label: "Kenya" },
  { value: "gh", label: "Ghana" },
  { value: "et", label: "Ethiopia" },
  { value: "tz", label: "Tanzania" },
  { value: "ug", label: "Uganda" },
  { value: "zw", label: "Zimbabwe" },
  { value: "nl", label: "Netherlands" },
  { value: "be", label: "Belgium" },
  { value: "ch", label: "Switzerland" },
  { value: "at", label: "Austria" },
  { value: "se", label: "Sweden" },
  { value: "no", label: "Norway" },
  { value: "dk", label: "Denmark" },
  { value: "fi", label: "Finland" },
  { value: "pl", label: "Poland" },
  { value: "cz", label: "Czech Republic" },
  { value: "hu", label: "Hungary" },
  { value: "ro", label: "Romania" },
  { value: "bg", label: "Bulgaria" },
  { value: "hr", label: "Croatia" },
  { value: "si", label: "Slovenia" },
  { value: "sk", label: "Slovakia" },
  { value: "ee", label: "Estonia" },
  { value: "lv", label: "Latvia" },
  { value: "lt", label: "Lithuania" },
  { value: "ie", label: "Ireland" },
  { value: "pt", label: "Portugal" },
  { value: "gr", label: "Greece" },
  { value: "tr", label: "Turkey" },
  { value: "il", label: "Israel" },
  { value: "ae", label: "United Arab Emirates" },
  { value: "sa", label: "Saudi Arabia" },
  { value: "qa", label: "Qatar" },
  { value: "kw", label: "Kuwait" },
  { value: "bh", label: "Bahrain" },
  { value: "om", label: "Oman" },
  { value: "jo", label: "Jordan" },
  { value: "lb", label: "Lebanon" },
  { value: "sy", label: "Syria" },
  { value: "iq", label: "Iraq" },
  { value: "ir", label: "Iran" },
  { value: "af", label: "Afghanistan" },
  { value: "pk", label: "Pakistan" },
  { value: "bd", label: "Bangladesh" },
  { value: "lk", label: "Sri Lanka" },
  { value: "np", label: "Nepal" },
  { value: "bt", label: "Bhutan" },
  { value: "mv", label: "Maldives" },
  { value: "th", label: "Thailand" },
  { value: "vn", label: "Vietnam" },
  { value: "sg", label: "Singapore" },
  { value: "my", label: "Malaysia" },
  { value: "id", label: "Indonesia" },
  { value: "ph", label: "Philippines" },
  { value: "mm", label: "Myanmar" },
  { value: "kh", label: "Cambodia" },
  { value: "la", label: "Laos" },
  { value: "bn", label: "Brunei" },
  { value: "nz", label: "New Zealand" },
  { value: "fj", label: "Fiji" },
  { value: "pg", label: "Papua New Guinea" },
];

// Comprehensive states/provinces by country
const statesByCountry = {
  us: [
    { value: "al", label: "Alabama" },
    { value: "ak", label: "Alaska" },
    { value: "az", label: "Arizona" },
    { value: "ar", label: "Arkansas" },
    { value: "ca", label: "California" },
    { value: "co", label: "Colorado" },
    { value: "ct", label: "Connecticut" },
    { value: "de", label: "Delaware" },
    { value: "fl", label: "Florida" },
    { value: "ga", label: "Georgia" },
    { value: "hi", label: "Hawaii" },
    { value: "id", label: "Idaho" },
    { value: "il", label: "Illinois" },
    { value: "in", label: "Indiana" },
    { value: "ia", label: "Iowa" },
    { value: "ks", label: "Kansas" },
    { value: "ky", label: "Kentucky" },
    { value: "la", label: "Louisiana" },
    { value: "me", label: "Maine" },
    { value: "md", label: "Maryland" },
    { value: "ma", label: "Massachusetts" },
    { value: "mi", label: "Michigan" },
    { value: "mn", label: "Minnesota" },
    { value: "ms", label: "Mississippi" },
    { value: "mo", label: "Missouri" },
    { value: "mt", label: "Montana" },
    { value: "ne", label: "Nebraska" },
    { value: "nv", label: "Nevada" },
    { value: "nh", label: "New Hampshire" },
    { value: "nj", label: "New Jersey" },
    { value: "nm", label: "New Mexico" },
    { value: "ny", label: "New York" },
    { value: "nc", label: "North Carolina" },
    { value: "nd", label: "North Dakota" },
    { value: "oh", label: "Ohio" },
    { value: "ok", label: "Oklahoma" },
    { value: "or", label: "Oregon" },
    { value: "pa", label: "Pennsylvania" },
    { value: "ri", label: "Rhode Island" },
    { value: "sc", label: "South Carolina" },
    { value: "sd", label: "South Dakota" },
    { value: "tn", label: "Tennessee" },
    { value: "tx", label: "Texas" },
    { value: "ut", label: "Utah" },
    { value: "vt", label: "Vermont" },
    { value: "va", label: "Virginia" },
    { value: "wa", label: "Washington" },
    { value: "wv", label: "West Virginia" },
    { value: "wi", label: "Wisconsin" },
    { value: "wy", label: "Wyoming" },
  ],
  ca: [
    { value: "ab", label: "Alberta" },
    { value: "bc", label: "British Columbia" },
    { value: "mb", label: "Manitoba" },
    { value: "nb", label: "New Brunswick" },
    { value: "nl", label: "Newfoundland and Labrador" },
    { value: "nt", label: "Northwest Territories" },
    { value: "ns", label: "Nova Scotia" },
    { value: "nu", label: "Nunavut" },
    { value: "on", label: "Ontario" },
    { value: "pe", label: "Prince Edward Island" },
    { value: "qc", label: "Quebec" },
    { value: "sk", label: "Saskatchewan" },
    { value: "yt", label: "Yukon" },
  ],
  uk: [
    { value: "eng", label: "England" },
    { value: "sct", label: "Scotland" },
    { value: "wls", label: "Wales" },
    { value: "nir", label: "Northern Ireland" },
  ],
  au: [
    { value: "nsw", label: "New South Wales" },
    { value: "vic", label: "Victoria" },
    { value: "qld", label: "Queensland" },
    { value: "wa", label: "Western Australia" },
    { value: "sa", label: "South Australia" },
    { value: "tas", label: "Tasmania" },
    { value: "act", label: "Australian Capital Territory" },
    { value: "nt", label: "Northern Territory" },
  ],
  in: [
    { value: "ap", label: "Andhra Pradesh" },
    { value: "ar", label: "Arunachal Pradesh" },
    { value: "as", label: "Assam" },
    { value: "br", label: "Bihar" },
    { value: "ct", label: "Chhattisgarh" },
    { value: "ga", label: "Goa" },
    { value: "gj", label: "Gujarat" },
    { value: "hr", label: "Haryana" },
    { value: "hp", label: "Himachal Pradesh" },
    { value: "jh", label: "Jharkhand" },
    { value: "ka", label: "Karnataka" },
    { value: "kl", label: "Kerala" },
    { value: "mp", label: "Madhya Pradesh" },
    { value: "mh", label: "Maharashtra" },
    { value: "mn", label: "Manipur" },
    { value: "ml", label: "Meghalaya" },
    { value: "mz", label: "Mizoram" },
    { value: "nl", label: "Nagaland" },
    { value: "or", label: "Odisha" },
    { value: "pb", label: "Punjab" },
    { value: "rj", label: "Rajasthan" },
    { value: "sk", label: "Sikkim" },
    { value: "tn", label: "Tamil Nadu" },
    { value: "tg", label: "Telangana" },
    { value: "tr", label: "Tripura" },
    { value: "up", label: "Uttar Pradesh" },
    { value: "ut", label: "Uttarakhand" },
    { value: "wb", label: "West Bengal" },
    { value: "dl", label: "Delhi" },
  ],
  de: [
    { value: "bw", label: "Baden-Württemberg" },
    { value: "by", label: "Bavaria" },
    { value: "be", label: "Berlin" },
    { value: "bb", label: "Brandenburg" },
    { value: "hb", label: "Bremen" },
    { value: "hh", label: "Hamburg" },
    { value: "he", label: "Hesse" },
    { value: "mv", label: "Mecklenburg-Vorpommern" },
    { value: "ni", label: "Lower Saxony" },
    { value: "nw", label: "North Rhine-Westphalia" },
    { value: "rp", label: "Rhineland-Palatinate" },
    { value: "sl", label: "Saarland" },
    { value: "sn", label: "Saxony" },
    { value: "st", label: "Saxony-Anhalt" },
    { value: "sh", label: "Schleswig-Holstein" },
    { value: "th", label: "Thuringia" },
  ],
  fr: [
    { value: "ara", label: "Auvergne-Rhône-Alpes" },
    { value: "bfc", label: "Bourgogne-Franche-Comté" },
    { value: "bre", label: "Brittany" },
    { value: "cvl", label: "Centre-Val de Loire" },
    { value: "cor", label: "Corsica" },
    { value: "ges", label: "Grand Est" },
    { value: "hdf", label: "Hauts-de-France" },
    { value: "idf", label: "Île-de-France" },
    { value: "nor", label: "Normandy" },
    { value: "naq", label: "Nouvelle-Aquitaine" },
    { value: "occ", label: "Occitanie" },
    { value: "pdl", label: "Pays de la Loire" },
    { value: "paca", label: "Provence-Alpes-Côte d'Azur" },
  ],
  br: [
    { value: "ac", label: "Acre" },
    { value: "al", label: "Alagoas" },
    { value: "ap", label: "Amapá" },
    { value: "am", label: "Amazonas" },
    { value: "ba", label: "Bahia" },
    { value: "ce", label: "Ceará" },
    { value: "df", label: "Distrito Federal" },
    { value: "es", label: "Espírito Santo" },
    { value: "go", label: "Goiás" },
    { value: "ma", label: "Maranhão" },
    { value: "mt", label: "Mato Grosso" },
    { value: "ms", label: "Mato Grosso do Sul" },
    { value: "mg", label: "Minas Gerais" },
    { value: "pa", label: "Pará" },
    { value: "pb", label: "Paraíba" },
    { value: "pr", label: "Paraná" },
    { value: "pe", label: "Pernambuco" },
    { value: "pi", label: "Piauí" },
    { value: "rj", label: "Rio de Janeiro" },
    { value: "rn", label: "Rio Grande do Norte" },
    { value: "rs", label: "Rio Grande do Sul" },
    { value: "ro", label: "Rondônia" },
    { value: "rr", label: "Roraima" },
    { value: "sc", label: "Santa Catarina" },
    { value: "sp", label: "São Paulo" },
    { value: "se", label: "Sergipe" },
    { value: "to", label: "Tocantins" },
  ],
  // Add more states for other countries as needed
  mx: [
    { value: "ags", label: "Aguascalientes" },
    { value: "bc", label: "Baja California" },
    { value: "bcs", label: "Baja California Sur" },
    { value: "cam", label: "Campeche" },
    { value: "chp", label: "Chiapas" },
    { value: "chh", label: "Chihuahua" },
    { value: "cdmx", label: "Ciudad de México" },
    { value: "coa", label: "Coahuila" },
    { value: "col", label: "Colima" },
    { value: "dur", label: "Durango" },
    { value: "gua", label: "Guanajuato" },
    { value: "gue", label: "Guerrero" },
    { value: "hid", label: "Hidalgo" },
    { value: "jal", label: "Jalisco" },
    { value: "mex", label: "México" },
    { value: "mic", label: "Michoacán" },
    { value: "mor", label: "Morelos" },
    { value: "nay", label: "Nayarit" },
    { value: "nl", label: "Nuevo León" },
    { value: "oax", label: "Oaxaca" },
    { value: "pue", label: "Puebla" },
    { value: "que", label: "Querétaro" },
    { value: "qr", label: "Quintana Roo" },
    { value: "slp", label: "San Luis Potosí" },
    { value: "sin", label: "Sinaloa" },
    { value: "son", label: "Sonora" },
    { value: "tab", label: "Tabasco" },
    { value: "tam", label: "Tamaulipas" },
    { value: "tla", label: "Tlaxcala" },
    { value: "ver", label: "Veracruz" },
    { value: "yuc", label: "Yucatán" },
    { value: "zac", label: "Zacatecas" },
  ],
};

// Sample data for demonstration
const projectsData = [
  {
    id: "1",
    name: "House cleaning",
    type: "House cleaning",
    icon: "🏠",
    status: "Active",
    createdAt: "5/23/2025",
    imageCount: 5,
  },
  {
    id: "2",
    name: "Office Maintenance",
    type: "Commercial",
    icon: "🏢",
    status: "Draft",
    createdAt: "5/20/2025",
    imageCount: 8,
  },
  {
    id: "3",
    name: "Garden Landscaping",
    type: "Outdoor",
    icon: "🌿",
    status: "Active",
    createdAt: "5/18/2025",
    imageCount: 12,
  },
  {
    id: "4",
    name: "Home Repairs",
    type: "Maintenance",
    icon: "🔧",
    status: "Pending",
    createdAt: "5/16/2025",
    imageCount: 3,
  },
  {
    id: "5",
    name: "Plumbing Services",
    type: "Specialty",
    icon: "🚰",
    status: "Active",
    createdAt: "5/15/2025",
    imageCount: 6,
  },
  {
    id: "6",
    name: "Electrical Work",
    type: "Specialty",
    icon: "⚡",
    status: "Inactive",
    createdAt: "5/14/2025",
    imageCount: 4,
  },
  {
    id: "7",
    name: "Carpet Cleaning",
    type: "House cleaning",
    icon: "🧹",
    status: "Active",
    createdAt: "5/12/2025",
    imageCount: 7,
  },
  {
    id: "8",
    name: "Window Washing",
    type: "House cleaning",
    icon: "🪟",
    status: "Active",
    createdAt: "5/10/2025",
    imageCount: 9,
  },
];

export function ProjectList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const itemsPerPage = 6;

  // Reset state when country changes
  useEffect(() => {
    setSelectedState("");
  }, [selectedCountry]);

  // Filter projects based on search term
  const filteredProjects = projectsData.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Pending":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6 font-poppins">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-600 text-white">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                Project Management
              </h1>
              <p className="text-sm text-purple-600 dark:text-purple-300">
                Manage and monitor your projects
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search projects..."
              className="pl-10 pr-4 w-full sm:w-[250px] h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="h-10 px-4 bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Country
            </label>
            <Popover open={countryOpen} onOpenChange={setCountryOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={countryOpen}
                  className="w-full justify-between bg-white"
                >
                  {selectedCountry
                    ? countries.find((country) => country.value === selectedCountry)?.label
                    : "Choose Countries..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-white border shadow-lg z-50">
                <Command>
                  <CommandInput placeholder="Search country..." />
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup className="max-h-[200px] overflow-y-auto">
                    {countries.map((country) => (
                      <CommandItem
                        key={country.value}
                        value={country.value}
                        onSelect={(currentValue) => {
                          setSelectedCountry(currentValue === selectedCountry ? "" : currentValue);
                          setCountryOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedCountry === country.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {country.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              State/Province
            </label>
            <Popover open={stateOpen} onOpenChange={setStateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={stateOpen}
                  className="w-full justify-between bg-white"
                  disabled={!selectedCountry}
                >
                  {selectedState && selectedCountry
                    ? statesByCountry[selectedCountry as keyof typeof statesByCountry]?.find(
                        (state) => state.value === selectedState
                      )?.label
                    : "Choose States..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-white border shadow-lg z-50">
                <Command>
                  <CommandInput placeholder="Search state..." />
                  <CommandEmpty>No state found.</CommandEmpty>
                  <CommandGroup className="max-h-[200px] overflow-y-auto">
                    {selectedCountry &&
                      statesByCountry[selectedCountry as keyof typeof statesByCountry]?.map((state) => (
                        <CommandItem
                          key={state.value}
                          value={state.value}
                          onSelect={(currentValue) => {
                            setSelectedState(currentValue === selectedState ? "" : currentValue);
                            setStateOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedState === state.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {state.label}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2 md:col-span-2 flex items-end gap-2">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Apply Filters
            </Button>
            <Button variant="outline" className="text-purple-600 hover:text-purple-700">
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-600">Total Projects</p>
                <p className="text-2xl font-bold text-purple-900">{projectsData.length}</p>
              </div>
              <div className="p-2 bg-purple-600 rounded-lg">
                <Zap className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-600">Active</p>
                <p className="text-2xl font-bold text-green-900">
                  {projectsData.filter(p => p.status === "Active").length}
                </p>
              </div>
              <div className="p-2 bg-green-600 rounded-lg">
                <Eye className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-yellow-600">Draft</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {projectsData.filter(p => p.status === "Draft").length}
                </p>
              </div>
              <div className="p-2 bg-yellow-600 rounded-lg">
                <Pencil className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600">Total Images</p>
                <p className="text-2xl font-bold text-blue-900">
                  {projectsData.reduce((sum, p) => sum + p.imageCount, 0)}
                </p>
              </div>
              <div className="p-2 bg-blue-600 rounded-lg">
                <Server className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow duration-200 border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{project.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{project.name}</h3>
                    <p className="text-xs text-gray-500">{project.type}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Site
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4 text-blue-600" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Status</span>
                  <Badge className={`text-xs px-2 py-1 ${getBadgeVariant(project.status)}`}>
                    {project.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Created</span>
                  <span className="text-xs text-gray-700">{project.createdAt}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Images</span>
                  <Badge className="bg-purple-100 text-purple-700 text-xs px-2 py-1">
                    {project.imageCount}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {currentProjects.length === 0 && (
        <Card className="py-16">
          <CardContent className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 rounded-full bg-purple-100">
                <Search className="h-8 w-8 text-purple-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">No projects found</h3>
                <p className="text-sm text-gray-500">Try adjusting your search terms or create a new project</p>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create New Project
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {filteredProjects.length > 0 && (
        <div className="flex items-center justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <PaginationItem key={number}>
                  <PaginationLink
                    isActive={currentPage === number}
                    onClick={() => handlePageChange(number)}
                    className="cursor-pointer"
                  >
                    {number}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
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
  );
}
