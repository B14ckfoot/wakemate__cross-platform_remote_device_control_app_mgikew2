import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import deviceService from '../services/deviceService';

interface ServerContextType {
  serverIp: string;
  setServerIp: (ip: string) => void;
  isConnected: boolean;
  connectionError: string | null;
  testConnection: () => Promise<boolean>;
}

const ServerContext = createContext<ServerContextType | undefined>(undefined);

interface ServerProviderProps {
  children: ReactNode;
}

export const ServerProvider: React.FC<ServerProviderProps> = ({ children }) => {
  const [serverIp, setServerIp] = useState<string>(() => {
    // Try to load from localStorage if available
    const savedIp = localStorage.getItem('serverIp');
    return savedIp || '';
  });
  
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Update the device service and localStorage when IP changes
  useEffect(() => {
    if (serverIp) {
      deviceService.setServerAddress(serverIp);
      localStorage.setItem('serverIp', serverIp);
      
      // Test the connection when IP changes
      testConnection();
    } else {
      setIsConnected(false);
    }
  }, [serverIp]);
  
  // Function to test the connection to the server
  const testConnection = async (): Promise<boolean> => {
    if (!serverIp) {
      setConnectionError('Server IP not set');
      setIsConnected(false);
      return false;
    }
    
    try {
      // Try to fetch devices as a connection test
      await deviceService.getDevices();
      setIsConnected(true);
      setConnectionError(null);
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      setIsConnected(false);
      setConnectionError('Failed to connect to server');
      return false;
    }
  };
  
  return (
    <ServerContext.Provider 
      value={{ 
        serverIp, 
        setServerIp, 
        isConnected, 
        connectionError, 
        testConnection 
      }}
    >
      {children}
    </ServerContext.Provider>
  );
};

// Custom hook to use the server context
export const useServer = (): ServerContextType => {
  const context = useContext(ServerContext);
  if (context === undefined) {
    throw new Error('useServer must be used within a ServerProvider');
  }
  return context;
};
