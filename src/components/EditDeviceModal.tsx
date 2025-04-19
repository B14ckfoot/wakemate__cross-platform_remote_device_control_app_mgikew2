import React, { useState } from 'react';
import { Device } from '../types/device';

interface EditDeviceModalProps {
  device: Device;
  onSave: (updatedDevice: Device) => void;
  onCancel: () => void;
}

const EditDeviceModal: React.FC<EditDeviceModalProps> = ({ device, onSave, onCancel }) => {
  const [name, setName] = useState(device.name);
  const [mac, setMac] = useState(device.mac);
  const [ip, setIp] = useState(device.ip);

  const handleSave = () => {
    const updatedDevice: Device = {
      ...device,
      name,
      mac,
      ip
    };
    onSave(updatedDevice);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Device</h2>
        
        <div className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Device Name"
            className="p-4 rounded-lg bg-gray-100 text-gray-800"
          />
          <input
            type="text"
            value={mac}
            onChange={(e) => setMac(e.target.value)}
            placeholder="MAC Address (00:11:22:33:44:55)"
            className="p-4 rounded-lg bg-gray-100 text-gray-800"
          />
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="IP Address (192.168.1.100)"
            className="p-4 rounded-lg bg-gray-100 text-gray-800"
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-full bg-green-500 text-white hover:bg-green-400"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDeviceModal;
