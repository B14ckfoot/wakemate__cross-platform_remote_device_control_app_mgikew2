import React, { useState } from 'react';
import { ChevronLeft, Trash2, Info, Wifi } from 'lucide-react';
import { Device } from '../types/device';
import EditDeviceModal from '../components/EditDeviceModal';

interface SettingsScreenProps {
  onBack: () => void;
  onClearDevices: () => void;
  devices: Device[];
  onDeleteDevice: (deviceId: string) => void;
  onUpdateDevice: (updatedDevice: Device) => void;
  serverOnline: boolean; // 🔥 New prop: true if server found
  searching: boolean; // 🔥 New prop: true if scanning
  retry: () => void; // 🔥 New prop: retry scanning
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onClearDevices,
  devices,
  onDeleteDevice,
  onUpdateDevice,
  serverOnline,
  searching,
  retry,
}) => {
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);

  const handleSaveEditedDevice = (updatedDevice: Device) => {
    onUpdateDevice(updatedDevice);
    setEditingDevice(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 flex flex-col">
      {/* Edit Modal */}
      {editingDevice && (
        <EditDeviceModal
          device={editingDevice}
          onSave={handleSaveEditedDevice}
          onCancel={() => setEditingDevice(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center mb-6 relative">
        <button onClick={onBack} className="text-green-400 mr-4">
          <ChevronLeft size={32} />
        </button>
        <h1 className="text-white text-2xl font-bold">Settings</h1>
      </div>

      {/* Server Status */}
      <div className="flex items-center bg-gray-800 p-4 rounded-lg mb-6 justify-between">
        <div className="flex items-center">
          <Wifi className="text-green-400 mr-3" />
          <div className="flex flex-col">
            <span className="text-white font-bold">Server Connection</span>
            {searching ? (
              <span className="text-yellow-400 text-sm">🔍 Searching...</span>
            ) : serverOnline ? (
              <span className="text-green-400 text-sm">🟢 Connected</span>
            ) : (
              <span className="text-red-400 text-sm">🔴 Offline</span>
            )}
          </div>
        </div>
        {!serverOnline && !searching && (
          <button
            onClick={retry}
            className="bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-full text-sm"
          >
            Retry
          </button>
        )}
      </div>

      {/* Devices Management */}
      <div className="flex flex-col gap-4">
        {devices.length > 0 ? (
          devices.map((device) => (
            <div
              key={device.id}
              className="flex items-center justify-between bg-gray-800 p-4 rounded-lg"
            >
              <div className="flex flex-col text-white">
                <span>{device.name}</span>
                <span className="text-gray-400 text-sm">{device.ip}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingDevice(device)}
                  className="text-green-400 hover:text-green-300"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDeleteDevice(device.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No devices found.</p>
        )}
      </div>

      {/* Clear All Devices */}
      <div className="mt-8">
        <button
          onClick={onClearDevices}
          className="flex items-center bg-red-500 hover:bg-red-400 text-white p-4 rounded-lg w-full justify-center"
        >
          <Trash2 className="mr-3" />
          Clear All Devices
        </button>
      </div>

      {/* About Info */}
      <div className="flex items-center bg-gray-800 p-4 rounded-lg mt-8">
        <Info className="text-green-400 mr-3" />
        <div className="flex flex-col">
          <span className="text-white font-bold">WakeMATE v1.0</span>
          <span className="text-gray-400 text-sm">Built with ❤️ by Marco</span>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
