import React, { useState } from 'react';
import { ChevronLeft, PlusCircle } from 'lucide-react';
import { Device } from '../types/device';
import SettingsButton from '../components/SettingsButton';

interface AddDeviceScreenProps {
  onBack: () => void;
  onDeviceAdded: (device: Device) => void;
  onOpenSettings: () => void;
}

const AddDeviceScreen: React.FC<AddDeviceScreenProps> = ({ onBack, onDeviceAdded, onOpenSettings }) => {
  const [name, setName] = useState('');
  const [mac, setMac] = useState('');
  const [ip, setIp] = useState('');

  const handleAddDevice = () => {
    if (!name || !mac || !ip) {
      alert('Please fill in all fields.');
      return;
    }

    const newDevice: Device = {
      id: Date.now().toString(),
      name,
      mac,
      ip,
      status: 'offline',
      type: 'wifi', // Always wifi now
    };

    onDeviceAdded(newDevice);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 flex flex-col relative">
      {/* Settings button */}
      <SettingsButton onPress={onOpenSettings} />

      {/* Header */}
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="text-green-400 mr-4">
          <ChevronLeft size={32} />
        </button>
        <h1 className="text-white text-2xl font-bold">Add New Device</h1>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Device Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-4 rounded-lg bg-gray-800 text-white placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="MAC Address (00:11:22:33:44:55)"
          value={mac}
          onChange={(e) => setMac(e.target.value)}
          className="p-4 rounded-lg bg-gray-800 text-white placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="IP Address (192.168.x.x)"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          className="p-4 rounded-lg bg-gray-800 text-white placeholder-gray-400"
        />
      </div>

      {/* Add button */}
      <div className="mt-6">
        <button
          onClick={handleAddDevice}
          className="w-full flex justify-center items-center bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-full text-lg"
        >
          <PlusCircle className="mr-2" /> Add Device
        </button>
      </div>
    </div>
  );
};

export default AddDeviceScreen;
