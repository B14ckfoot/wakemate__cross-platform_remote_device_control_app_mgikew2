import React, { useState } from 'react';
import { ChevronLeft, PlusCircle, Check, Wifi, Bluetooth } from 'lucide-react';

interface Device {
  id: string;
  name: string;
  mac: string;
  ip: string;
  status: 'online' | 'offline';
  type: 'wifi' | 'bluetooth';
}

interface DeviceSelectorProps {
  onSelectDevice: (device: Device) => void;
  onAddDevice: () => void;
  onBack?: () => void;
  devices: Device[];
  selectedDeviceId?: string | null;
}

const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  onSelectDevice,
  onAddDevice,
  onBack,
  devices,
  selectedDeviceId = null
}) => {
  const [selected, setSelected] = useState<string | null>(selectedDeviceId);

  const selectDevice = (deviceId: string) => {
    setSelected(deviceId);
    const device = devices.find(d => d.id === deviceId);
    if (device) {
      onSelectDevice(device);
    }
  };

  // Filter devices by connection type
  const wifiDevices = devices.filter(device => device.type === 'wifi');
  const bluetoothDevices = devices.filter(device => device.type === 'bluetooth');

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {onBack ? (
          <button onClick={onBack} className="p-2">
            <ChevronLeft className="w-6 h-6 text-green-500" />
          </button>
        ) : (
          <div className="w-10"> {/* Empty space for alignment */}</div>
        )}
        <h1 className="text-xl font-normal text-gray-800">Select a computer</h1>
        <button onClick={onAddDevice} className="p-2">
          <PlusCircle className="w-6 h-6 text-green-500" />
        </button>
      </div>

      {/* Device List */}
      <div className="flex-1 overflow-auto">
        {wifiDevices.length > 0 && (
          <>
            {/* WiFi Section */}
            <div className="bg-gray-100 px-4 py-3 flex items-center">
              <Wifi className="w-5 h-5 text-gray-500" />
            </div>

            {/* WiFi Devices */}
            {wifiDevices.map(device => (
              <DeviceItem 
                key={device.id}
                device={device}
                isSelected={selected === device.id}
                onSelect={() => selectDevice(device.id)}
              />
            ))}
          </>
        )}

        {bluetoothDevices.length > 0 && (
          <>
            {/* Bluetooth Section */}
            <div className="bg-gray-100 px-4 py-3 flex items-center">
              <Bluetooth className="w-5 h-5 text-gray-500" />
            </div>

            {/* Bluetooth Devices */}
            {bluetoothDevices.map(device => (
              <DeviceItem 
                key={device.id}
                device={device}
                isSelected={selected === device.id}
                onSelect={() => selectDevice(device.id)}
              />
            ))}
          </>
        )}

        {devices.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <p className="text-gray-500 mb-4 text-center">No devices found</p>
            <button 
              onClick={onAddDevice}
              className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add a Device
            </button>
          </div>
        )}
      </div>

      {/* Home indicator */}
      <div className="flex justify-center py-2">
        <div className="w-32 h-1 bg-black rounded-full opacity-20"></div>
      </div>
    </div>
  );
};

// Individual device list item component
interface DeviceItemProps {
  device: Device;
  isSelected: boolean;
  onSelect: () => void;
}

const DeviceItem: React.FC<DeviceItemProps> = ({ device, isSelected, onSelect }) => {
  return (
    <button 
      className="w-full flex items-center justify-between px-6 py-4 border-b text-left"
      onClick={onSelect}
    >
      <div className="flex items-center">
        <DeviceIcon type={device.type} />
        <span className="ml-4 text-gray-800 text-lg">{device.name}</span>
      </div>
      {isSelected && <Check className="w-6 h-6 text-green-500" />}
    </button>
  );
};

// Device type icon component
interface DeviceIconProps {
  type: 'wifi' | 'bluetooth';
}

const DeviceIcon: React.FC<DeviceIconProps> = ({ type }) => {
  switch(type) {
    case 'bluetooth':
      return (
        <div className="w-8 h-8 flex items-center justify-center">
          <Bluetooth className="w-6 h-6 text-green-500" />
        </div>
      );
    case 'wifi':
    default:
      return (
        <div className="w-8 h-8 flex items-center justify-center">
          <Wifi className="w-6 h-6 text-green-500" />
        </div>
      );
  }
};

export default DeviceSelector;