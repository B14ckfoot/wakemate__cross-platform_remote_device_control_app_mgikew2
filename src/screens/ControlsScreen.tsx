import React from 'react';
import { ChevronLeft, Power, RefreshCw, Moon, LogOut, Volume2, VolumeX, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Device } from '../types/device';

interface ControlsScreenProps {
  device: Device | null;
  onBack: () => void;
}

const ControlsScreen: React.FC<ControlsScreenProps> = ({ device, onBack }) => {
  if (!device) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-900 p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="text-green-400 mr-4">
          <ChevronLeft size={32} />
        </button>
        <h1 className="text-white text-2xl font-bold">Controls</h1>
      </div>

      {/* Device Name */}
      <div className="text-center mb-8">
        <h2 className="text-white text-xl">{device.name}</h2>
        <p className="text-gray-400 text-sm">{device.status === 'online' ? 'Online' : 'Offline'}</p>
      </div>

      {/* Mouse Control Placeholder */}
      <div className="bg-gray-800 flex-1 rounded-lg mb-6 flex items-center justify-center">
        <span className="text-gray-400">Touchpad Area</span>
      </div>

      {/* Media Controls */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <button className="bg-gray-800 p-4 rounded-lg flex justify-center items-center">
          <SkipBack className="text-white" />
        </button>
        <button className="bg-gray-800 p-4 rounded-lg flex justify-center items-center">
          <Play className="text-white" />
        </button>
        <button className="bg-gray-800 p-4 rounded-lg flex justify-center items-center">
          <SkipForward className="text-white" />
        </button>

        <button className="bg-gray-800 p-4 rounded-lg flex justify-center items-center">
          <VolumeX className="text-white" />
        </button>
        <button className="bg-gray-800 p-4 rounded-lg flex justify-center items-center">
          <Volume2 className="text-white" />
        </button>
        <button className="bg-gray-800 p-4 rounded-lg flex justify-center items-center">
          <Pause className="text-white" />
        </button>
      </div>

      {/* Power Controls */}
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-red-500 p-4 rounded-lg flex justify-center items-center flex-col">
          <Power className="text-white mb-2" />
          <span className="text-white text-sm">Shutdown</span>
        </button>
        <button className="bg-yellow-500 p-4 rounded-lg flex justify-center items-center flex-col">
          <RefreshCw className="text-black mb-2" />
          <span className="text-black text-sm">Restart</span>
        </button>
        <button className="bg-blue-500 p-4 rounded-lg flex justify-center items-center flex-col">
          <Moon className="text-white mb-2" />
          <span className="text-white text-sm">Sleep</span>
        </button>
        <button className="bg-purple-500 p-4 rounded-lg flex justify-center items-center flex-col">
          <LogOut className="text-white mb-2" />
          <span className="text-white text-sm">Logoff</span>
        </button>
      </div>
    </div>
  );
};

export default ControlsScreen;
