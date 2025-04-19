import React, { useState, useEffect } from 'react';
import HomeScreen from './screens/HomeScreen';
import DeviceSelectScreen from './screens/DeviceSelectScreen';
import DeviceDetailScreen from './screens/DeviceDetailScreen';
import ControlsScreen from './screens/ControlsScreen';
import AddDeviceScreen from './screens/AddDeviceScreen';
import SettingsScreen from './screens/SettingsScreen';
import { Device } from './types/device';
import { useAutoDiscoverServer } from './hooks/useAutoDiscoverServer';
import { deviceService } from './services/deviceService';
import { checkDeviceStatus } from './utils/checkDeviceStatus';

type AppScreen = 'home' | 'deviceSelect' | 'deviceDetail' | 'controls' | 'addDevice' | 'settings';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const { serverIp, searching, error, retry } = useAutoDiscoverServer();

  // Load devices on start
  useEffect(() => {
    const storedDevices = localStorage.getItem('devices');
    if (storedDevices) {
      setDevices(JSON.parse(storedDevices));
    }
  }, []);

  // Save devices on change
  useEffect(() => {
    localStorage.setItem('devices', JSON.stringify(devices));
  }, [devices]);

  // Set deviceService server address if found
  useEffect(() => {
    if (serverIp) {
      deviceService.setServerAddress(serverIp);
    }
  }, [serverIp]);

  // Check status of devices periodically
  useEffect(() => {
    if (devices.length === 0) return;

    const checkStatus = async () => {
      const updatedDevices = [...devices];
      let changed = false;

      for (let i = 0; i < updatedDevices.length; i++) {
        try {
          const isOnline = await checkDeviceStatus(updatedDevices[i].ip);
          if (updatedDevices[i].status !== (isOnline ? 'online' : 'offline')) {
            updatedDevices[i].status = isOnline ? 'online' : 'offline';
            changed = true;
          }
        } catch (error) {
          console.error(`Error checking status for device ${updatedDevices[i].name}:`, error);
        }
      }

      if (changed) {
        setDevices(updatedDevices);
      }
    };

    // Check status immediately and then every 60 seconds
    checkStatus();
    const interval = setInterval(checkStatus, 60000);

    return () => clearInterval(interval);
  }, [devices]);

  const serverOnline = serverIp != null && !error;

  const handleDeviceAdded = (newDevice: Device) => {
    setDevices(prev => [...prev, newDevice]);
  };

  const handleDeleteDevice = (deviceId: string) => {
    setDevices(prev => prev.filter(device => device.id !== deviceId));
  };

  const handleUpdateDevice = (updatedDevice: Device) => {
    setDevices(prev => prev.map(device =>
      device.id === updatedDevice.id ? updatedDevice : device
    ));
  };

  const handleClearDevices = () => {
    setDevices([]);
    setCurrentScreen('home');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onNavigate={() => setCurrentScreen(devices.length > 0 ? 'deviceSelect' : 'addDevice')}
            onOpenSettings={() => setCurrentScreen('settings')}
          />
        );
      case 'deviceSelect':
        return (
          <DeviceSelectScreen
            devices={devices}
            onSelectDevice={(device) => {
              setSelectedDevice(device);
              // Skip device detail screen and go directly to controls
              setCurrentScreen('controls'); 
            }}
            onAddDevice={() => setCurrentScreen('addDevice')}
            onOpenSettings={() => setCurrentScreen('settings')}
          />
        );
      case 'deviceDetail': // We'll keep this case for backward compatibility
        return (
          <DeviceDetailScreen
            device={selectedDevice}
            onBack={() => setCurrentScreen('deviceSelect')}
            onControl={() => setCurrentScreen('controls')}
            onOpenSettings={() => setCurrentScreen('settings')}
          />
        );
      case 'controls':
        return (
          <ControlsScreen
            device={selectedDevice}
            onBack={() => setCurrentScreen('deviceSelect')}
            onOpenSettings={() => setCurrentScreen('settings')}
          />
        );
      case 'addDevice':
        return (
          <AddDeviceScreen
            onBack={() => setCurrentScreen('deviceSelect')}
            onDeviceAdded={(device) => {
              handleDeviceAdded(device);
              setCurrentScreen('deviceSelect');
            }}
            onOpenSettings={() => setCurrentScreen('settings')}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            devices={devices}
            onBack={() => setCurrentScreen('home')}
            onClearDevices={handleClearDevices}
            onDeleteDevice={handleDeleteDevice}
            onUpdateDevice={handleUpdateDevice}
            serverOnline={serverOnline}
            searching={searching}
            retry={retry}
          />
        );
      default:
        return <div className="text-white p-4">Unknown Screen</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {renderCurrentScreen()}
    </div>
  );
}

export default App;