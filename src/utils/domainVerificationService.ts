
import { toast } from "@/hooks/use-toast";

export type VerificationMethod = 'dns' | 'file' | 'meta';

export type VerificationResult = {
  success: boolean;
  method: VerificationMethod;
  message: string;
  timestamp: Date;
};

class DomainVerificationService {
  private baseUrl = '/api/domain-verification';

  async verifyDomain(domain: string, method: VerificationMethod, token: string): Promise<VerificationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain,
          method,
          token,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Domain verified",
          description: `${domain} has been successfully verified using ${method} method.`,
        });
      } else {
        toast({
          title: "Verification failed",
          description: result.message || `Failed to verify ${domain} using ${method} method.`,
          variant: "destructive"
        });
      }

      return {
        success: result.success,
        method,
        message: result.message || (result.success ? 'Domain verified successfully' : 'Verification failed'),
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Domain verification error:', error);
      
      const errorResult: VerificationResult = {
        success: false,
        method,
        message: `Network error: ${error}`,
        timestamp: new Date(),
      };

      toast({
        title: "Verification error",
        description: errorResult.message,
        variant: "destructive"
      });

      return errorResult;
    }
  }

  async checkDNSRecord(domain: string, recordType: string, expectedValue: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/check-dns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain,
          recordType,
          expectedValue,
        }),
      });

      const result = await response.json();
      return result.found;
    } catch (error) {
      console.error('DNS check error:', error);
      return false;
    }
  }

  async checkVerificationFile(domain: string, fileName: string, expectedContent: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/check-file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain,
          fileName,
          expectedContent,
        }),
      });

      const result = await response.json();
      return result.found;
    } catch (error) {
      console.error('File check error:', error);
      return false;
    }
  }

  async checkMetaTag(domain: string, expectedContent: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/check-meta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain,
          expectedContent,
        }),
      });

      const result = await response.json();
      return result.found;
    } catch (error) {
      console.error('Meta tag check error:', error);
      return false;
    }
  }

  generateVerificationToken(domain: string, method: VerificationMethod): string {
    const timestamp = Date.now();
    return `verify-${method}-${domain}-${timestamp}`;
  }
}

export const domainVerificationService = new DomainVerificationService();
