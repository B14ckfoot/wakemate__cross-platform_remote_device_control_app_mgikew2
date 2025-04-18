import React, { useState } from 'react';
import DeviceButton from '../components/DeviceButton';
import { PlusCircle } from 'lucide-react';

interface Device {
  id: string;
  name: string;
  status: 'online' | 'offline';
  ipAddress: string;
  macAddress: string;
}

const HomeScreen: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([
    { 
      id: '1', 
      name: 'Home PC', 
      status: 'offline', 
      ipAddress: '192.168.1.100', 
      macAddress: '00:1A:2B:3C:4D:5E' 
    },
    { 
      id: '2', 
      name: 'Work Laptop', 
      status: 'online', 
      ipAddress: '192.168.1.101', 
      macAddress: '00:1A:2B:3C:4D:5F' 
    },
  ]);

  const handleDevicePress = (device: Device) => {
    console.log('Device pressed:', device);
    // Here you would implement the wake-on-LAN functionality
  };

  const handleAddDevice = () => {
    console.log('Add device pressed');
    // Here you would navigate to an add device screen
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">WakeMATE</h1>
        <p className="text-gray-300 mb-8">Remote device control at your fingertips</p>
        
        <div className="mb-8">
          {devices.map(device => (
            <DeviceButton 
              key={device.id}
              name={device.name}
              status={device.status}
              onPress={() => handleDevicePress(device)}
            />
          ))}
        </div>
        
        <button 
          onClick={handleAddDevice}
          className="w-full p-4 bg-purple-700 rounded-lg flex items-center justify-center
                    transition-all duration-300 hover:bg-purple-600"
        >
          <PlusCircle className="w-5 h-5 mr-2 text-white" />
          <span className="text-white font-medium">Add Device</span>
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;
