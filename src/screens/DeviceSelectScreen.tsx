import React, { useState, useEffect } from 'react';
import DeviceSelector from '../components/DeviceSelector';

interface Device {
  id: string;
  name: string;
  mac: string;
  ip: string;
  status: 'online' | 'offline';
  type: 'wifi' | 'bluetooth';
}

interface DeviceSelectScreenProps {
  onSelectDevice: (device: Device) => void;
  onAddDevice: () => void;
  onBack?: () => void;
}

const DeviceSelectScreen: React.FC<DeviceSelectScreenProps> = ({
  onSelectDevice,
  onAddDevice,
  onBack
}) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch devices from your service
    const fetchDevices = async () => {
      try {
        setLoading(true);
        
        // Replace this with your actual API call
        // For example: const response = await deviceService.getDevices();
        
        // Simulating API response for demo
        const mockDevices: Device[] = [
          { 
            id: '1', 
            name: "Marco's MacBook Pro", 
            mac: "AA:BB:CC:DD:EE:FF", 
            ip: "192.168.1.11", 
            status: "online",
            type: "wifi"
          },
          { 
            id: '2', 
            name: "Mac - Bluetooth", 
            mac: "AA:BB:CC:DD:EE:00", 
            ip: "192.168.1.12", 
            status: "offline",
            type: "bluetooth"
          }
        ];
        
        // Simulating network delay
        setTimeout(() => {
          setDevices(mockDevices);
          setLoading(false);
        }, 500);
        
      } catch (err) {
        console.error('Error fetching devices:', err);
        setError('Failed to load devices. Please try again.');
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white p-6">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <DeviceSelector
      devices={devices}
      onSelectDevice={onSelectDevice}
      onAddDevice={onAddDevice}
      onBack={onBack}
    />
  );
};

export default DeviceSelectScreen;