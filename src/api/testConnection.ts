
import { httpHosting } from '@/config';

export interface ConnectionTestRequest {
  protocol: 'ftp' | 'sftp' | 'api' | 'cpanel' | 'plesk' | 'directadmin';
  server: string;
  port: number;
  username: string;
  password?: string;
  apiKey?: string;
}

export interface ConnectionTestResponse {
  success: boolean;
  message: string;
  latency?: number;
}

export const testConnection = async (credentials: ConnectionTestRequest): Promise<ConnectionTestResponse> => {
  try {
    const response = await httpHosting.post('/test-connection', credentials);
    return response.data;
  } catch (error: any) {
    console.error('Connection test failed:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Connection test failed'
    };
  }
};
