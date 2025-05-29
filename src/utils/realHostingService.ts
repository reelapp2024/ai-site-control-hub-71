
import { toast } from "@/hooks/use-toast";
import { HostingCredential, ConnectionProtocol } from "./credentialManager";

export type FileTransferOptions = {
  localPath?: string;
  remotePath: string;
  content?: string;
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

export type DeploymentStatus = {
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'failed';
  progress: number;
  message: string;
  startTime: Date;
  endTime?: Date;
};

// Real API service for hosting providers
class RealHostingService {
  private baseUrl = '/api/hosting';

  async uploadFile(credential: HostingCredential, options: FileTransferOptions): Promise<{ success: boolean; path?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: this.sanitizeCredential(credential),
          options,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Upload failed');
      }

      return result;
    } catch (error) {
      console.error('Upload error:', error);
      return { success: false, error: String(error) };
    }
  }

  async listFiles(credential: HostingCredential, path: string = "/"): Promise<FileListItem[]> {
    try {
      const response = await fetch(`${this.baseUrl}/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: this.sanitizeCredential(credential),
          path,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to list files');
      }

      return result.files || [];
    } catch (error) {
      console.error('List files error:', error);
      toast({
        title: "File listing error",
        description: `Failed to list files: ${error}`,
        variant: "destructive"
      });
      return [];
    }
  }

  async deleteFile(credential: HostingCredential, path: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: this.sanitizeCredential(credential),
          path,
        }),
      });

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Delete file error:', error);
      return false;
    }
  }

  async verifyDomain(domain: string, verificationMethod: 'dns' | 'file' | 'meta', verificationToken: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/verify-domain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain,
          method: verificationMethod,
          token: verificationToken,
        }),
      });

      const result = await response.json();
      return result.verified;
    } catch (error) {
      console.error('Domain verification error:', error);
      return false;
    }
  }

  async deployWebsite(credential: HostingCredential, domain: string, files: { path: string, content: string }[]): Promise<DeploymentStatus> {
    const deploymentId = Math.random().toString(36).substr(2, 9);
    
    try {
      const response = await fetch(`${this.baseUrl}/deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deploymentId,
          credential: this.sanitizeCredential(credential),
          domain,
          files,
        }),
      });

      const result = await response.json();
      
      return {
        id: deploymentId,
        status: result.success ? 'success' : 'failed',
        progress: result.success ? 100 : 0,
        message: result.message || (result.success ? 'Deployment completed' : 'Deployment failed'),
        startTime: new Date(),
        endTime: new Date(),
      };
    } catch (error) {
      console.error('Deployment error:', error);
      return {
        id: deploymentId,
        status: 'failed',
        progress: 0,
        message: `Deployment failed: ${error}`,
        startTime: new Date(),
        endTime: new Date(),
      };
    }
  }

  private sanitizeCredential(credential: HostingCredential) {
    // Remove sensitive data before sending to API
    return {
      id: credential.id,
      providerId: credential.providerId,
      providerName: credential.providerName,
      server: credential.server,
      port: credential.port,
      protocol: credential.protocol,
      // Note: In a real implementation, credentials would be securely stored on the backend
    };
  }
}

export const realHostingService = new RealHostingService();

// Updated functions that use real service
export const uploadVerificationFile = async (
  credential: HostingCredential,
  domain: string,
  verificationId: string,
  protocol: ConnectionProtocol = 'ftp'
): Promise<boolean> => {
  try {
    const verificationContent = `domain-verify-${verificationId}-token`;
    const remoteFilePath = `/public_html/verification-${verificationId}.txt`;
    
    toast({
      title: "Uploading verification file",
      description: `Uploading to ${domain} via ${protocol.toUpperCase()}`
    });
    
    const result = await realHostingService.uploadFile(credential, {
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
        description: result.error || "Failed to upload verification file",
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

export const listFiles = async (
  credential: HostingCredential,
  path: string = "/",
  protocol: ConnectionProtocol = 'ftp'
): Promise<FileListItem[]> => {
  return realHostingService.listFiles(credential, path);
};

export const deleteFile = async (
  credential: HostingCredential,
  path: string,
  protocol: ConnectionProtocol = 'ftp'
): Promise<boolean> => {
  return realHostingService.deleteFile(credential, path);
};

export const deployWebsite = async (
  credential: HostingCredential,
  domain: string,
  files: { path: string, content: string }[],
  protocol: ConnectionProtocol = 'ftp'
): Promise<boolean> => {
  try {
    toast({
      title: "Deploying website",
      description: `Deploying files to ${domain}`
    });
    
    const deployment = await realHostingService.deployWebsite(credential, domain, files);
    
    if (deployment.status === 'success') {
      toast({
        title: "Deployment successful",
        description: `Website has been deployed to ${domain}`
      });
      return true;
    } else {
      toast({
        title: "Deployment failed",
        description: deployment.message,
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
