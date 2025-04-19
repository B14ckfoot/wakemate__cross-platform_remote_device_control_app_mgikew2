import React from 'react';
import { Settings } from 'lucide-react';

interface SettingsButtonProps {
  onPress: () => void;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ onPress }) => {
  return (
    <button
      onClick={onPress}
      className="absolute top-4 right-4 text-green-400 hover:text-green-300"
    >
      <Settings size={28} />
    </button>
  );
};

export default SettingsButton;
