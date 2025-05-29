
import { useState, useEffect, useCallback } from 'react';
import { DeploymentStatus } from '@/utils/realHostingService';

export function useDeploymentMonitor(deploymentId: string | null) {
  const [status, setStatus] = useState<DeploymentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!deploymentId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/deployment-status/${deploymentId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setStatus(data);
    } catch (err) {
      console.error('Failed to fetch deployment status:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [deploymentId]);

  useEffect(() => {
    if (!deploymentId) {
      setStatus(null);
      return;
    }

    fetchStatus();

    // Poll for updates every 2 seconds while deployment is in progress
    const interval = setInterval(() => {
      if (status?.status === 'uploading' || status?.status === 'pending') {
        fetchStatus();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [deploymentId, fetchStatus, status?.status]);

  return {
    status,
    isLoading,
    error,
    refetch: fetchStatus,
  };
}
