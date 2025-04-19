import React from 'react';
import DeviceSelector from '../components/DeviceSelector';
import { Device } from '../types/device';

interface DeviceSelectScreenProps {
  devices: Device[];
  onSelectDevice: (device: Device) => void;
  onAddDevice: () => void;
  onBack?: () => void;
  onOpenSettings: () => void;
}

const DeviceSelectScreen: React.FC<DeviceSelectScreenProps> = ({
  devices,
  onSelectDevice,
  onAddDevice,
  onBack,
  onOpenSettings
}) => {
  if (!devices) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 text-white">
        <p>Loading devices...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Only DeviceSelector, nothing else */}
      <DeviceSelector
        devices={devices}
        onSelectDevice={onSelectDevice}
        onAddDevice={onAddDevice}
        onBack={onBack}
        onOpenSettings={onOpenSettings}
      />
    </div>
  );
};

export default DeviceSelectScreen;
