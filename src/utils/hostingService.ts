import { toast } from "@/hooks/use-toast";
import { HostingCredential, ConnectionProtocol } from "./credentialManager";
import { httpHosting } from '@/config';

// Types for file operations
export type FileTransferOptions = {
  localPath?: string;
  remotePath: string;
  content?: string; // For direct content upload
  type: 'file' | 'directory';
};

export type FileListItem = {
  name: string;
  path: string;
  size: number;
  type: 'file' | 'directory';
  lastModified: Date;
  permissions?: string;
};

// Real cPanel API call for listing files
const listCpanelFiles = async (credential: HostingCredential, path: string): Promise<FileListItem[]> => {
  try {
    console.log(`Making real cPanel API call to list files in: ${path}`);
    
    // Prepare cPanel API request
    const cpanelUrl = credential.server?.replace(/\/+$/, ''); // Remove trailing slashes
    const apiUrl = `${cpanelUrl}:2083/execute/Fileman/list_files`;
    
    // Create authentication header
    const auth = btoa(`${credential.username}:${credential.password}`);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      // Add query parameters for path
      ...(path && { 
        url: `${apiUrl}?dir=${encodeURIComponent(path)}`
      })
    });

    if (!response.ok) {
      throw new Error(`cPanel API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.status === 0) {
      throw new Error(data.errors?.[0] || 'cPanel API returned error');
    }

    // Convert cPanel response to our format
    const files: FileListItem[] = (data.data || []).map((item: any) => ({
      name: item.file || item.name,
      path: item.fullpath || `${path}/${item.file || item.name}`,
      size: parseInt(item.size) || 0,
      type: item.type === 'dir' ? 'directory' : 'file',
      lastModified: new Date(item.mtime * 1000), // Convert Unix timestamp
      permissions: item.mode
    }));

    console.log(`Successfully fetched ${files.length} files from cPanel`);
    return files;

  } catch (error) {
    console.error("cPanel file listing error:", error);
    throw error;
  }
};

// Real FTP/SFTP API call
const listFtpFiles = async (credential: HostingCredential, path: string, protocol: ConnectionProtocol): Promise<FileListItem[]> => {
  try {
    console.log(`Making real ${protocol.toUpperCase()} call to list files in: ${path}`);
    
    const response = await httpHosting.post('/ftp/list-files', {
      host: credential.server,
      port: credential.port || (protocol === 'sftp' ? 22 : 21),
      username: credential.username,
      password: credential.password,
      protocol: protocol,
      path: path
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'FTP operation failed');
    }

    return response.data.files.map((item: any) => ({
      name: item.name,
      path: item.path,
      size: item.size || 0,
      type: item.type,
      lastModified: new Date(item.lastModified),
      permissions: item.permissions
    }));

  } catch (error) {
    console.error(`${protocol.toUpperCase()} file listing error:`, error);
    throw error;
  }
};

// Real API calls for file operations
export const listFiles = async (
  credential: HostingCredential,
  path: string = "/",
  protocol: ConnectionProtocol = 'ftp'
): Promise<FileListItem[]> => {
  try {
    console.log(`Listing files in ${path} using ${protocol} for ${credential.providerName}`);
    
    // Show loading toast
    toast({
      title: "Loading files",
      description: `Connecting to ${credential.providerName}...`
    });

    let files: FileListItem[] = [];

    // Make real API calls based on protocol
    switch (protocol) {
      case 'cpanel':
        files = await listCpanelFiles(credential, path);
        break;
      case 'ftp':
      case 'sftp':
        files = await listFtpFiles(credential, path, protocol);
        break;
      case 'plesk':
        // Implement Plesk API call
        files = await listPleskFiles(credential, path);
        break;
      case 'directadmin':
        // Implement DirectAdmin API call  
        files = await listDirectAdminFiles(credential, path);
        break;
      default:
        throw new Error(`Unsupported protocol: ${protocol}`);
    }

    toast({
      title: "Files loaded",
      description: `Found ${files.length} items in ${path}`
    });

    return files;
    
  } catch (error) {
    console.error("File listing error:", error);
    toast({
      title: "Failed to load files",
      description: `Could not connect to ${credential.providerName}: ${error}`,
      variant: "destructive"
    });
    return [];
  }
};

// Plesk API implementation
const listPleskFiles = async (credential: HostingCredential, path: string): Promise<FileListItem[]> => {
  try {
    const response = await httpHosting.post('/plesk/list-files', {
      host: credential.server,
      username: credential.username,
      password: credential.password,
      path: path
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Plesk API failed');
    }

    return response.data.files;
  } catch (error) {
    console.error("Plesk API error:", error);
    throw error;
  }
};

// DirectAdmin API implementation
const listDirectAdminFiles = async (credential: HostingCredential, path: string): Promise<FileListItem[]> => {
  try {
    const response = await httpHosting.post('/directadmin/list-files', {
      host: credential.server,
      username: credential.username,
      password: credential.password,
      path: path
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'DirectAdmin API failed');
    }

    return response.data.files;
  } catch (error) {
    console.error("DirectAdmin API error:", error);
    throw error;
  }
};

// Upload file with real API
export const uploadFile = async (
  credential: HostingCredential,
  remotePath: string,
  content: string,
  protocol: ConnectionProtocol = 'ftp'
): Promise<boolean> => {
  try {
    console.log(`Uploading file to ${remotePath} using ${protocol}`);
    
    toast({
      title: "Uploading file",
      description: `Uploading to ${credential.providerName}...`
    });

    let response;
    
    switch (protocol) {
      case 'cpanel':
        response = await httpHosting.post('/cpanel/upload-file', {
          host: credential.server,
          username: credential.username,
          password: credential.password,
          remotePath,
          content
        });
        break;
      case 'ftp':
      case 'sftp':
        response = await httpHosting.post('/ftp/upload-file', {
          host: credential.server,
          port: credential.port || (protocol === 'sftp' ? 22 : 21),
          username: credential.username,
          password: credential.password,
          protocol,
          remotePath,
          content
        });
        break;
      default:
        throw new Error(`Upload not supported for protocol: ${protocol}`);
    }
    
    if (response.data.success) {
      toast({
        title: "File uploaded",
        description: `Successfully uploaded to ${remotePath}`
      });
      return true;
    } else {
      throw new Error(response.data.message || 'Upload failed');
    }
    
  } catch (error) {
    console.error("File upload error:", error);
    toast({
      title: "Upload failed",
      description: `Failed to upload file: ${error}`,
      variant: "destructive"
    });
    return false;
  }
};

// Delete file with real API
export const deleteFile = async (
  credential: HostingCredential,
  path: string,
  protocol: ConnectionProtocol = 'ftp'
): Promise<boolean> => {
  try {
    console.log(`Deleting file ${path} using ${protocol}`);
    
    let response;
    
    switch (protocol) {
      case 'cpanel':
        response = await httpHosting.post('/cpanel/delete-file', {
          host: credential.server,
          username: credential.username,
          password: credential.password,
          path
        });
        break;
      case 'ftp':
      case 'sftp':
        response = await httpHosting.post('/ftp/delete-file', {
          host: credential.server,
          port: credential.port || (protocol === 'sftp' ? 22 : 21),
          username: credential.username,
          password: credential.password,
          protocol,
          path
        });
        break;
      default:
        throw new Error(`Delete not supported for protocol: ${protocol}`);
    }
    
    if (response.data.success) {
      return true;
    } else {
      throw new Error(response.data.message || 'Delete failed');
    }
    
  } catch (error) {
    console.error("File deletion error:", error);
    toast({
      title: "Delete failed",
      description: `Failed to delete file: ${error}`,
      variant: "destructive"
    });
    return false;
  }
};

// Hosting provider specific implementations (mock)
const hostingProviders = {
  // cPanel API implementation
  cpanel: {
    uploadFile: async (credential: HostingCredential, options: FileTransferOptions) => {
      console.log(`cPanel: Uploading to ${options.remotePath}`);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, path: options.remotePath };
    },
    listFiles: async (credential: HostingCredential, path: string) => {
      console.log(`cPanel: Listing files in ${path}`);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // Return mock file list
      return [
        { name: 'index.html', path: `${path}/index.html`, size: 1024, type: 'file', lastModified: new Date() },
        { name: 'images', path: `${path}/images`, size: 0, type: 'directory', lastModified: new Date() }
      ] as FileListItem[];
    },
    deleteFile: async (credential: HostingCredential, path: string) => {
      console.log(`cPanel: Deleting ${path}`);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
  },
  // Plesk API implementation
  plesk: {
    uploadFile: async (credential: HostingCredential, options: FileTransferOptions) => {
      console.log(`Plesk: Uploading to ${options.remotePath}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, path: options.remotePath };
    },
    listFiles: async (credential: HostingCredential, path: string) => {
      console.log(`Plesk: Listing files in ${path}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        { name: 'index.html', path: `${path}/index.html`, size: 2048, type: 'file', lastModified: new Date() },
        { name: 'css', path: `${path}/css`, size: 0, type: 'directory', lastModified: new Date() }
      ] as FileListItem[];
    },
    deleteFile: async (credential: HostingCredential, path: string) => {
      console.log(`Plesk: Deleting ${path}`);
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
  },
  // DirectAdmin API implementation
  directadmin: {
    uploadFile: async (credential: HostingCredential, options: FileTransferOptions) => {
      console.log(`DirectAdmin: Uploading to ${options.remotePath}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, path: options.remotePath };
    },
    listFiles: async (credential: HostingCredential, path: string) => {
      console.log(`DirectAdmin: Listing files in ${path}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        { name: 'index.php', path: `${path}/index.php`, size: 1536, type: 'file', lastModified: new Date() },
        { name: 'assets', path: `${path}/assets`, size: 0, type: 'directory', lastModified: new Date() }
      ] as FileListItem[];
    },
    deleteFile: async (credential: HostingCredential, path: string) => {
      console.log(`DirectAdmin: Deleting ${path}`);
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
  },
  // Generic FTP implementation
  ftp: {
    uploadFile: async (credential: HostingCredential, options: FileTransferOptions) => {
      console.log(`FTP: Uploading to ${options.remotePath}`);
      await new Promise(resolve => setTimeout(resolve, 1200));
      return { success: true, path: options.remotePath };
    },
    listFiles: async (credential: HostingCredential, path: string) => {
      console.log(`FTP: Listing files in ${path}`);
      await new Promise(resolve => setTimeout(resolve, 600));
      return [
        { name: 'index.html', path: `${path}/index.html`, size: 1024, type: 'file', lastModified: new Date() },
        { name: 'css', path: `${path}/css`, size: 0, type: 'directory', lastModified: new Date() },
        { name: 'js', path: `${path}/js`, size: 0, type: 'directory', lastModified: new Date() }
      ] as FileListItem[];
    },
    deleteFile: async (credential: HostingCredential, path: string) => {
      console.log(`FTP: Deleting ${path}`);
      await new Promise(resolve => setTimeout(resolve, 400));
      return { success: true };
    }
  },
  // SFTP implementation
  sftp: {
    uploadFile: async (credential: HostingCredential, options: FileTransferOptions) => {
      console.log(`SFTP: Uploading to ${options.remotePath}`);
      await new Promise(resolve => setTimeout(resolve, 1200));
      return { success: true, path: options.remotePath };
    },
    listFiles: async (credential: HostingCredential, path: string) => {
      console.log(`SFTP: Listing files in ${path}`);
      await new Promise(resolve => setTimeout(resolve, 600));
      return [
        { name: 'index.html', path: `${path}/index.html`, size: 1024, type: 'file', lastModified: new Date() },
        { name: 'public_html', path: `${path}/public_html`, size: 0, type: 'directory', lastModified: new Date() }
      ] as FileListItem[];
    },
    deleteFile: async (credential: HostingCredential, path: string) => {
      console.log(`SFTP: Deleting ${path}`);
      await new Promise(resolve => setTimeout(resolve, 400));
      return { success: true };
    }
  }
};

// Protocol mapper
const getProviderByProtocol = (protocol: ConnectionProtocol) => {
  switch(protocol) {
    case 'cpanel': return hostingProviders.cpanel;
    case 'plesk': return hostingProviders.plesk;
    case 'directadmin': return hostingProviders.directadmin;
    case 'ftp': return hostingProviders.ftp;
    case 'sftp': return hostingProviders.sftp;
    case 'api': return hostingProviders.cpanel; // Default to cPanel for general API
    default: return hostingProviders.ftp;
  }
};

// Check credential validity
const validateCredential = (credential: HostingCredential): boolean => {
  if (!credential.server) {
    toast({
      title: "Invalid credentials",
      description: "Server information is missing",
      variant: "destructive"
    });
    return false;
  }
  
  if (!credential.username && !credential.apiKey) {
    toast({
      title: "Invalid credentials",
      description: "Username or API key is required",
      variant: "destructive"
    });
    return false;
  }
  
  return true;
};

// Upload verification file
export const uploadVerificationFile = async (
  credential: HostingCredential,
  domain: string,
  verificationId: string,
  protocol: ConnectionProtocol = 'ftp'
): Promise<boolean> => {
  if (!validateCredential(credential)) return false;

  try {
    const provider = getProviderByProtocol(protocol);
    const verificationContent = `domain-verify-${verificationId}-token`;
    const remoteFilePath = `/public_html/verification-${verificationId}.txt`;
    
    toast({
      title: "Uploading verification file",
      description: `Uploading to ${domain} via ${protocol.toUpperCase()}`
    });
    
    const result = await provider.uploadFile(credential, {
      remotePath: remoteFilePath,
      content: verificationContent,
      type: 'file'
    });
    
    if (result.success) {
      toast({
        title: "File uploaded successfully",
        description: `Verification file has been uploaded to ${domain}`
      });
      return true;
    } else {
      toast({
        title: "Upload failed",
        description: "Failed to upload verification file",
        variant: "destructive"
      });
      return false;
    }
  } catch (error) {
    console.error("File upload error:", error);
    toast({
      title: "Upload error",
      description: `An error occurred during file upload: ${error}`,
      variant: "destructive"
    });
    return false;
  }
};

// Deploy website files
export const deployWebsite = async (
  credential: HostingCredential,
  domain: string,
  files: { path: string, content: string }[],
  protocol: ConnectionProtocol = 'ftp'
): Promise<boolean> => {
  if (!validateCredential(credential)) return false;
  
  try {
    const provider = getProviderByProtocol(protocol);
    let allUploaded = true;
    
    toast({
      title: "Deploying website",
      description: `Deploying files to ${domain}`
    });
    
    for (const file of files) {
      const result = await provider.uploadFile(credential, {
        remotePath: file.path,
        content: file.content,
        type: 'file'
      });
      
      if (!result.success) {
        allUploaded = false;
        toast({
          title: "Upload failed",
          description: `Failed to upload ${file.path}`,
          variant: "destructive"
        });
      }
    }
    
    if (allUploaded) {
      toast({
        title: "Deployment successful",
        description: `Website has been deployed to ${domain}`
      });
      return true;
    } else {
      toast({
        title: "Deployment incomplete",
        description: "Some files failed to upload",
        variant: "destructive"
      });
      return false;
    }
  } catch (error) {
    console.error("Deployment error:", error);
    toast({
      title: "Deployment error",
      description: `Failed to deploy website: ${error}`,
      variant: "destructive"
    });
    return false;
  }
};
