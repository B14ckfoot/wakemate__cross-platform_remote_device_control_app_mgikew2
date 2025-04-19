import React, { useState } from 'react';
import { ChevronLeft, Check, Wifi, Settings } from 'lucide-react';
import { Device } from '../types/device';

interface DeviceSelectorProps {
  onSelectDevice: (device: Device) => void;
  onAddDevice: () => void;
  onBack?: () => void;
  onOpenSettings: () => void;
  devices: Device[];
  selectedDeviceId?: string | null;
}

const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  onSelectDevice,
  onAddDevice,
  onBack,
  onOpenSettings,
  devices,
  selectedDeviceId = null,
}) => {
  const [selected, setSelected] = useState<string | null>(selectedDeviceId);

  const selectDevice = (deviceId: string) => {
    setSelected(deviceId);
    const device = devices.find(d => d.id === deviceId);
    if (device) {
      onSelectDevice(device);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-start bg-gray-900 p-6">
      {/* White Card */}
      <div className="bg-white relative rounded-xl shadow-md w-full max-w-md p-6 flex flex-col min-h-[600px]">

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="absolute top-4 right-4 text-green-400 hover:text-green-500"
        >
          <Settings size={24} />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {onBack ? (
            <button onClick={onBack} className="text-green-400 p-2">
              <ChevronLeft size={28} />
            </button>
          ) : (
            <div className="w-10" />
          )}

          <h1 className="text-lg font-semibold text-gray-800">Select a computer to control</h1>

          {/* Empty space to balance header, no Add button */}
          <div className="w-10" />
        </div>

        {/* Device List */}
        <div className="flex-1 overflow-auto w-full">
          {devices.length > 0 ? (
            <>
              {/* WiFi Section Label */}
              <div className="bg-gray-100 px-4 py-2 flex items-center">
                <Wifi className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-gray-500">WiFi Devices</span>
              </div>

              {/* Devices */}
              {devices.map(device => (
                <DeviceItem
                  key={device.id}
                  device={device}
                  isSelected={selected === device.id}
                  onSelect={() => selectDevice(device.id)}
                />
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1">
              <p className="text-gray-500 mb-4 text-center">No devices found</p>
              <button
                onClick={onAddDevice}
                className="bg-green-500 hover:bg-green-400 text-white font-bold px-6 py-3 rounded-full flex items-center text-lg"
              >
                <Wifi className="w-5 h-5 mr-2" />
                Add a Device
              </button>
            </div>
          )}
        </div>

        {/* Home indicator */}
        <div className="flex justify-center pt-4">
          <div className="w-24 h-1 bg-black rounded-full opacity-20"></div>
        </div>

      </div>
    </div>
  );
};

interface DeviceItemProps {
  device: Device;
  isSelected: boolean;
  onSelect: () => void;
}

const DeviceItem: React.FC<DeviceItemProps> = ({ device, isSelected, onSelect }) => (
  <button
    onClick={onSelect}
    className="w-full flex items-center justify-between px-6 py-4 border-b text-left hover:bg-gray-50"
  >
    <div className="flex items-center">
      <div className="w-8 h-8 flex items-center justify-center">
        <Wifi className={`w-5 h-5 ${device.status === 'online' ? 'text-green-500' : 'text-gray-400'}`} />
      </div>
      <div className="ml-4">
        <span className="text-gray-800 text-lg">{device.name}</span>
        <span className="block text-sm text-gray-500">
          {device.status === 'online' ? 'Online' : 'Offline'}
        </span>
      </div>
    </div>
    {isSelected && <Check className="w-6 h-6 text-green-500" />}
  </button>
);

export default DeviceSelector;