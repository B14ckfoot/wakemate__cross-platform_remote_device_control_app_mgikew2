import React from 'react';
import { colors } from '../theme/colors';

interface DeviceButtonProps {
  name: string;
  status: 'online' | 'offline';
  onPress: () => void;
}

const DeviceButton: React.FC<DeviceButtonProps> = ({ name, status, onPress }) => {
  return (
    <button 
      onClick={onPress}
      className={`
        w-full p-4 mb-3 rounded-lg flex items-center justify-between
        ${status === 'online' ? 'bg-purple-600' : 'bg-purple-900'}
        transition-all duration-300 hover:shadow-lg hover:scale-[1.02]
      `}
    >
      <span className="text-white font-medium">{name}</span>
      <div className="flex items-center">
        <span className="text-sm text-gray-200 mr-2">
          {status === 'online' ? 'Online' : 'Offline'}
        </span>
        <div 
          className={`
            w-3 h-3 rounded-full
            ${status === 'online' ? 'bg-green-400' : 'bg-gray-400'}
          `}
        />
      </div>
    </button>
  );
};

export default DeviceButton;
