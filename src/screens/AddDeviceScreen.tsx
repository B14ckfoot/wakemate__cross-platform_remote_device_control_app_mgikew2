import React, { useState } from 'react';
import { ChevronLeft, PlusCircle } from 'lucide-react';
import { Device } from '../types/device';

interface AddDeviceScreenProps {
  onBack: () => void;
  onDeviceAdded: (device: Device) => void;
}

const AddDeviceScreen: React.FC<AddDeviceScreenProps> = ({ onBack, onDeviceAdded }) => {
  const [name, setName] = useState('');
  const [mac, setMac] = useState('');
  const [ip, setIp] = useState('');

  const handleAdd = () => {
    if (!name || !mac || !ip) {
      alert('Please fill all fields.');
      return;
    }

    const newDevice: Device = {
      id: Date.now().toString(),
      name,
      mac,
      ip,
      status: 'offline',
      type: mac.startsWith('00:') ? 'wifi' : 'bluetooth', // simple example
    };

    onDeviceAdded(newDevice);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="text-green-400 mr-4">
          <ChevronLeft size={32} />
        </button>
        <h1 className="text-white text-2xl font-bold">Add Device</h1>
      </div>

      {/* Form Inputs */}
      <div className="flex flex-col gap-4 flex-1 justify-center">
        <input
          className="bg-gray-800 p-4 rounded-lg text-white placeholder-gray-400"
          placeholder="Device Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="bg-gray-800 p-4 rounded-lg text-white placeholder-gray-400"
          placeholder="MAC Address (00:11:22:33:44:55)"
          value={mac}
          onChange={(e) => setMac(e.target.value)}
        />
        <input
          className="bg-gray-800 p-4 rounded-lg text-white placeholder-gray-400"
          placeholder="IP Address (192.168.x.x)"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
        />
      </div>

      {/* Add Button */}
      <div className="mt-6">
        <button
          onClick={handleAdd}
          className="w-full flex justify-center items-center bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-full text-lg"
        >
          <PlusCircle className="mr-2" /> Add Device
        </button>
      </div>
    </div>
  );
};

export default AddDeviceScreen;
