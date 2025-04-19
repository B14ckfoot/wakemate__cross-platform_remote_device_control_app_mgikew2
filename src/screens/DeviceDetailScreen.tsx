import React from 'react';
import { ChevronLeft, Monitor } from 'lucide-react';
import { Device } from '../types/device';
import SettingsButton from '../components/SettingsButton';

interface DeviceDetailScreenProps {
  device: Device | null;
  onBack: () => void;
  onControl: () => void;
  onOpenSettings: () => void;
}

const DeviceDetailScreen: React.FC<DeviceDetailScreenProps> = ({ device, onBack, onControl, onOpenSettings }) => {
  if (!device) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-900 p-6 relative">
      {/* Settings Button */}
      <SettingsButton onPress={onOpenSettings} />

      {/* Header */}
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="text-green-400 mr-4">
          <ChevronLeft size={32} />
        </button>
        <h1 className="text-white text-2xl font-bold">Device Details</h1>
      </div>

      {/* Device Info */}
      <div className="flex flex-col items-center justify-center flex-1">
        <Monitor className="text-green-400 mb-4" size={64} />
        <h2 className="text-white text-3xl font-bold mb-2">{device.name}</h2>
        <p className="text-gray-400 text-lg mb-6">
          {device.status === 'online' ? 'Online' : 'Offline'}
        </p>

        {/* Control Button */}
        <button
          onClick={onControl}
          className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-full text-lg"
        >
          Control Device
        </button>
      </div>
    </div>
  );
};

export default DeviceDetailScreen;
