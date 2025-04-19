import React, { useEffect, useState } from 'react';
import { Monitor, PlusCircle } from 'lucide-react';
import { Device } from '../types/device';
import SettingsButton from '../components/SettingsButton';

interface HomeScreenProps {
  onNavigate: () => void;
  onOpenSettings: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onOpenSettings }) => {
  const [hasDevices, setHasDevices] = useState<boolean>(false);

  useEffect(() => {
    const savedDevices = localStorage.getItem('devices');
    if (savedDevices) {
      const parsed = JSON.parse(savedDevices) as Device[];
      setHasDevices(parsed.length > 0);
    } else {
      setHasDevices(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-center relative">
      {/* Settings Button top right */}
      <SettingsButton onPress={onOpenSettings} />

      <Monitor size={64} className="text-green-400 mb-6" />
      <h1 className="text-4xl font-bold text-white mb-4">Welcome to WakeMATE</h1>
      <p className="text-gray-400 mb-8 text-lg">
        {hasDevices 
          ? "Manage and control your devices remotely."
          : "No devices yet. Let's add your first device!"}
      </p>

      <button
        onClick={onNavigate}
        className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-full text-lg flex items-center justify-center"
      >
        {hasDevices ? (
          <>
            <Monitor className="mr-2" /> Manage Devices
          </>
        ) : (
          <>
            <PlusCircle className="mr-2" /> Add Device
          </>
        )}
      </button>
    </div>
  );
};

export default HomeScreen;
