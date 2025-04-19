import React, { useState, useEffect } from 'react';
import HomeScreen from './screens/HomeScreen';
import DeviceSelectScreen from './screens/DeviceDetailScreen';
import DeviceDetailScreen from './screens/DeviceDetailScreen';
import ControlsScreen from './screens/ControlsScreen';
import AddDeviceScreen from './screens/AddDeviceScreen';
import { Device } from './types/device';

type AppScreen = 'home' | 'deviceSelect' | 'deviceDetail' | 'controls' | 'addDevice';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved devices from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('devices');
    if (saved) {
      setDevices(JSON.parse(saved));
    }
  }, []);

  // Save devices to localStorage
  useEffect(() => {
    localStorage.setItem('devices', JSON.stringify(devices));
  }, [devices]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onNavigate={() => setCurrentScreen('deviceSelect')}
          />
        );
      case 'deviceSelect':
        return (
          <DeviceSelectScreen
            devices={devices}
            onSelectDevice={(device) => {
              setSelectedDevice(device);
              setCurrentScreen('deviceDetail');
            }}
            onAddDevice={() => setCurrentScreen('addDevice')}
          />
        );
      case 'deviceDetail':
        return (
          <DeviceDetailScreen
            device={selectedDevice}
            onBack={() => setCurrentScreen('deviceSelect')}
            onControl={() => setCurrentScreen('controls')}
          />
        );
      case 'controls':
        return (
          <ControlsScreen
            device={selectedDevice}
            onBack={() => setCurrentScreen('deviceDetail')}
          />
        );
      case 'addDevice':
        return (
          <AddDeviceScreen
            onBack={() => setCurrentScreen('deviceSelect')}
            onDeviceAdded={(newDevice) => {
              setDevices(prev => [...prev, newDevice]);
              setCurrentScreen('deviceSelect');
            }}
          />
        );
      default:
        return <div className="text-white p-4">Unknown Screen</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full" />
        </div>
      )}
      {renderScreen()}
    </div>
  );
}

export default App;
