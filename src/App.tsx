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
            onNavigate={() => setCurrentScreen('deviceSelect')}
            onOpenSettings={() => setCurrentScreen('settings')}
            serverOnline={serverOnline}
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
            onOpenSettings={() => setCurrentScreen('settings')}
            serverOnline={serverOnline}
          />
        );
      case 'deviceDetail':
        return (
          <DeviceDetailScreen
            device={selectedDevice}
            onBack={() => setCurrentScreen('deviceSelect')}
            onControl={() => setCurrentScreen('controls')}
            onOpenSettings={() => setCurrentScreen('settings')}
            serverOnline={serverOnline}
          />
        );
      case 'controls':
        return (
          <ControlsScreen
            device={selectedDevice}
            onBack={() => setCurrentScreen('deviceDetail')}
            onOpenSettings={() => setCurrentScreen('settings')}
            serverOnline={serverOnline}
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
            serverOnline={serverOnline}
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
            serverOnline={serverOnline} // 🔥 Pass this to show "Server Connected: Yes/No"
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
