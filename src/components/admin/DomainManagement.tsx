
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, Copy, Globe, FileText, Code, RefreshCw, Info, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";

const domainSchema = z.object({
  domain: z.string().min(3, {
    message: "Domain must be at least 3 characters.",
  }).refine(val => /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(val), {
    message: "Please enter a valid domain name",
  }),
});

type Domain = {
  id: string;
  domain: string;
  status: "unverified" | "verified" | "active";
  verificationMethod?: "dns" | "file" | "meta";
  createdAt: Date;
};

export function DomainManagement() {
  const [domains, setDomains] = useState<Domain[]>([
    { id: "1", domain: "example.com", status: "verified", verificationMethod: "dns", createdAt: new Date() },
    { id: "2", domain: "mywebsite.org", status: "unverified", verificationMethod: "file", createdAt: new Date() },
  ]);
  
  const [activeDomain, setActiveDomain] = useState<Domain | null>(null);
  const [verificationTab, setVerificationTab] = useState<"dns" | "file" | "meta">("dns");
  const [verificationInProgress, setVerificationInProgress] = useState(false);
  
  const form = useForm<z.infer<typeof domainSchema>>({
    resolver: zodResolver(domainSchema),
    defaultValues: {
      domain: "",
    },
  });

  const onSubmit = (values: z.infer<typeof domainSchema>) => {
    // In a real app, you'd add the domain to your database or service
    const newDomain: Domain = {
      id: Math.random().toString(36).substr(2, 9),
      domain: values.domain,
      status: "unverified",
      createdAt: new Date()
    };

    setDomains([...domains, newDomain]);
    toast({
      title: "Domain added",
      description: "Your domain has been added. Please verify it to continue.",
    });
    form.reset();
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${type} has been copied to your clipboard.`,
    });
  };

  const verifyDomain = (domain: Domain) => {
    setVerificationInProgress(true);
    
    // Simulate verification process
    setTimeout(() => {
      setDomains(domains.map(d => 
        d.id === domain.id ? { ...d, status: "verified", verificationMethod: verificationTab } : d
      ));
      setVerificationInProgress(false);
      toast({
        title: "Domain verified",
        description: `${domain.domain} has been successfully verified!`,
      });
    }, 2000);
  };

  const handleSelectDomain = (domain: Domain) => {
    setActiveDomain(domain);
    // Set default verification method
    setVerificationTab(domain.verificationMethod || "dns");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "unverified":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "active":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Domain Management</h1>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setActiveDomain(null)}>
          Add New Domain
        </Button>
      </div>

      {activeDomain ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Domain Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {activeDomain.domain}
              </CardTitle>
              <CardDescription>
                Added on {activeDomain.createdAt.toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</div>
                  <Badge className={getStatusColor(activeDomain.status)}>
                    {activeDomain.status.charAt(0).toUpperCase() + activeDomain.status.slice(1)}
                  </Badge>
                </div>
                
                {activeDomain.status === "verified" && (
                  <Alert className="bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-300">
                    <Check className="h-4 w-4" />
                    <AlertTitle>Domain Verified</AlertTitle>
                    <AlertDescription>
                      Your domain has been verified successfully.
                    </AlertDescription>
                  </Alert>
                )}

                {activeDomain.status === "unverified" && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Verification Required</AlertTitle>
                    <AlertDescription>
                      Please verify your domain using one of the verification methods.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Domain Verification */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Domain Verification</CardTitle>
              <CardDescription>
                Choose a verification method to verify your domain ownership
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeDomain.status === "unverified" ? (
                <Tabs value={verificationTab} onValueChange={(v) => setVerificationTab(v as "dns" | "file" | "meta")}>
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="dns" className="flex items-center gap-1">
                      <Globe className="h-4 w-4" /> DNS Record
                    </TabsTrigger>
                    <TabsTrigger value="file" className="flex items-center gap-1">
                      <FileText className="h-4 w-4" /> File Upload
                    </TabsTrigger>
                    <TabsTrigger value="meta" className="flex items-center gap-1">
                      <Code className="h-4 w-4" /> Meta Tag
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="dns">
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-sm font-medium">TXT Record</div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 gap-1"
                            onClick={() => copyToClipboard(`verify-${activeDomain.domain}-token`, "TXT Record")}
                          >
                            <Copy className="h-4 w-4" />
                            Copy
                          </Button>
                        </div>
                        <div className="bg-white dark:bg-gray-900 p-2 rounded border text-sm font-mono">
                          verify-{activeDomain.domain}-token
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Instructions:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li>Go to your domain provider's DNS settings</li>
                          <li>Add a new TXT record with the name <span className="font-mono">@</span> or <span className="font-mono">{activeDomain.domain}</span></li>
                          <li>Paste the verification token as the value</li>
                          <li>Save changes and wait for DNS to propagate (may take up to 24 hours)</li>
                          <li>Click verify below</li>
                        </ol>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="file">
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-sm font-medium">Verification File</div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 gap-1"
                            onClick={() => copyToClipboard(`verification-${activeDomain.id}.txt`, "Filename")}
                          >
                            <Copy className="h-4 w-4" />
                            Copy
                          </Button>
                        </div>
                        <div className="bg-white dark:bg-gray-900 p-2 rounded border text-sm font-mono">
                          verification-{activeDomain.id}.txt
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-sm font-medium">File Contents</div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 gap-1"
                            onClick={() => copyToClipboard(`domain-verify-${activeDomain.id}-token`, "File contents")}
                          >
                            <Copy className="h-4 w-4" />
                            Copy
                          </Button>
                        </div>
                        <div className="bg-white dark:bg-gray-900 p-2 rounded border text-sm font-mono">
                          domain-verify-{activeDomain.id}-token
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Instructions:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li>Create a text file with the name above</li>
                          <li>Copy the contents above into the file</li>
                          <li>Upload this file to your domain's root directory (public_html or www folder)</li>
                          <li>The file should be accessible at https://{activeDomain.domain}/verification-{activeDomain.id}.txt</li>
                          <li>Click verify below</li>
                        </ol>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="meta">
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-sm font-medium">Meta Tag</div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 gap-1"
                            onClick={() => copyToClipboard(`<meta name="domain-verification" content="verify-${activeDomain.id}-${activeDomain.domain}" />`, "Meta tag")}
                          >
                            <Copy className="h-4 w-4" />
                            Copy
                          </Button>
                        </div>
                        <div className="bg-white dark:bg-gray-900 p-2 rounded border text-sm font-mono break-all">
                          &lt;meta name="domain-verification" content="verify-{activeDomain.id}-{activeDomain.domain}" /&gt;
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Instructions:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li>Add the meta tag to the &lt;head&gt; section of your domain's homepage</li>
                          <li>The tag should be visible in the HTML source of your homepage</li>
                          <li>Click verify below</li>
                        </ol>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <div className="mt-6">
                    <Button 
                      onClick={() => verifyDomain(activeDomain)} 
                      disabled={verificationInProgress}
                      className="w-full"
                    >
                      {verificationInProgress ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>Verify Domain</>
                      )}
                    </Button>
                  </div>
                </Tabs>
              ) : (
                <div className="space-y-6">
                  <Alert className="bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-300">
                    <Check className="h-4 w-4" />
                    <AlertTitle>Domain Verified</AlertTitle>
                    <AlertDescription>
                      Your domain has been verified using {activeDomain.verificationMethod} verification.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Next Steps</h3>
                    <Card>
                      <CardContent className="pt-6">
                        <ol className="list-decimal list-inside space-y-4">
                          <li className="flex items-start">
                            <span className="mt-1">Configure your domain's DNS settings:</span>
                            <div className="ml-4 mt-2">
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div className="font-medium">Type</div>
                                <div className="font-medium">Name</div>
                                <div className="font-medium">Value</div>
                                <div>A</div>
                                <div>@</div>
                                <div>123.456.789.0</div>
                              </div>
                            </div>
                          </li>
                          <li>
                            Wait for DNS changes to propagate (may take up to 24 hours)
                          </li>
                          <li>
                            Once DNS is configured, your website will be accessible at https://{activeDomain.domain}
                          </li>
                        </ol>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {/* Domain List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Domains</CardTitle>
              <CardDescription>
                Manage domains connected to your website builder
              </CardDescription>
            </CardHeader>
            <CardContent>
              {domains.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Domain</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Added On</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {domains.map((domain) => (
                        <tr key={domain.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-900 dark:text-white">{domain.domain}</div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(domain.status)}>
                              {domain.status.charAt(0).toUpperCase() + domain.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {domain.createdAt.toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSelectDomain(domain)}
                            >
                              Manage
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Globe className="h-6 w-6 text-gray-500" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No domains yet</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Add your first domain to get started.
                  </p>
                </div>
              )}
            </CardContent>
            
            {/* Add new domain form */}
            <CardFooter className="flex flex-col">
              <div className="border-t border-gray-200 dark:border-gray-700 w-full pt-6">
                <h3 className="font-medium mb-4">Add New Domain</h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-4">
                    <FormField
                      control={form.control}
                      name="domain"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="yourdomain.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Add Domain</Button>
                  </form>
                </Form>
              </div>
            </CardFooter>
          </Card>

          {/* Instructions Card */}
          <Card>
            <CardHeader>
              <CardTitle>How Domain Connection Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-700 dark:text-blue-400">Important Information</h4>
                      <p className="text-sm text-blue-600 dark:text-blue-300">
                        Before you begin, ensure you have access to manage DNS settings for your domain.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Steps to connect your domain:</h4>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Add your domain in the form above</li>
                    <li>Verify domain ownership using one of the provided methods</li>
                    <li>Configure DNS settings as instructed</li>
                    <li>Wait for DNS propagation (may take up to 24 hours)</li>
                    <li>Your website will be accessible at your domain</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
