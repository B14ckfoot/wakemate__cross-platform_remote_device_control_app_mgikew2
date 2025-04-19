import React from 'react';
import { Monitor } from 'lucide-react';

interface HomeScreenProps {
  onNavigate: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-center">
      <Monitor size={64} className="text-green-400 mb-6" />
      <h1 className="text-4xl font-bold text-white mb-4">Welcome to WakeMATE</h1>
      <p className="text-gray-400 mb-8 text-lg">
        Remotely wake, control, and manage your computers effortlessly.
      </p>
      <button
        onClick={onNavigate}
        className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-full text-lg"
      >
        Manage Devices
      </button>
    </div>
  );
};

export default HomeScreen;
