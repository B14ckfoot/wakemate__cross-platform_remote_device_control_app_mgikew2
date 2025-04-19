import React, { useRef } from 'react';
import { ChevronLeft, Power, RefreshCw, Moon, LogOut, Volume2, VolumeX, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Device } from '../types/device';
import SettingsButton from '../components/SettingsButton';
import { deviceService } from '../services/deviceService'; // <-- Import real deviceService

interface ControlsScreenProps {
  device: Device | null;
  onBack: () => void;
  onOpenSettings: () => void;
}

const ControlsScreen: React.FC<ControlsScreenProps> = ({ device, onBack, onOpenSettings }) => {
  const touchpadRef = useRef<HTMLDivElement>(null);

  if (!device) return null;

  const send = async (command: string, params: any = {}) => {
    try {
      await deviceService.sendCommand(command, params);
    } catch (err) {
      console.error(`Failed to send command: ${command}`, err);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (touch) {
      const deltaX = touch.clientX;
      const deltaY = touch.clientY;
      send('mouse_move', { deltaX, deltaY });
    }
  };

  const handleLeftClick = () => send('mouse_click', { button: 'left' });
  const handleRightClick = () => send('mouse_click', { button: 'right' });
  const handleScroll = (direction: 'up' | 'down') => send('mouse_scroll', { direction });

  return (
    <div className="flex flex-col h-screen bg-gray-900 p-6 relative">
      {/* Settings Button */}
      <SettingsButton onPress={onOpenSettings} />

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

      {/* Mouse Touchpad */}
      <div className="relative bg-gray-800 flex-1 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
        <div
          ref={touchpadRef}
          className="w-full h-full"
          onTouchMove={handleTouchMove}
          onDoubleClick={handleLeftClick}
          onContextMenu={(e) => {
            e.preventDefault();
            handleRightClick();
          }}
        >
          <span className="text-gray-400">Touchpad Area</span>
        </div>

        {/* Mouse Wheel Bar */}
        <div className="absolute right-2 top-2 bottom-2 flex flex-col justify-center items-center">
          <button onClick={() => handleScroll('up')} className="bg-gray-700 p-2 rounded-full mb-2">
            ↑
          </button>
          <button onClick={() => handleScroll('down')} className="bg-gray-700 p-2 rounded-full">
            ↓
          </button>
        </div>
      </div>

      {/* Media Controls */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <button onClick={() => send('media_prev')} className="bg-gray-800 p-4 rounded-lg flex justify-center items-center">
          <SkipBack className="text-white" />
        </button>
        <button onClick={() => send('media_play_pause')} className="bg-gray-800 p-4 rounded-lg flex justify-center items-center">
          <Play className="text-white" />
        </button>
        <button onClick={() => send('media_next')} className="bg-gray-800 p-4 rounded-lg flex justify-center items-center">
          <SkipForward className="text-white" />
        </button>
        <button onClick={() => send('volume_mute')} className="bg-gray-800 p-4 rounded-lg flex justify-center items-center">
          <VolumeX className="text-white" />
        </button>
        <button onClick={() => send('volume_up')} className="bg-gray-800 p-4 rounded-lg flex justify-center items-center">
          <Volume2 className="text-white" />
        </button>
        <button onClick={() => send('media_play_pause')} className="bg-gray-800 p-4 rounded-lg flex justify-center items-center">
          <Pause className="text-white" />
        </button>
      </div>

      {/* Power Controls */}
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => send('shutdown')} className="bg-red-500 p-4 rounded-lg flex justify-center items-center flex-col">
          <Power className="text-white mb-2" />
          <span className="text-white text-sm">Shutdown</span>
        </button>
        <button onClick={() => send('restart')} className="bg-yellow-500 p-4 rounded-lg flex justify-center items-center flex-col">
          <RefreshCw className="text-black mb-2" />
          <span className="text-black text-sm">Restart</span>
        </button>
        <button onClick={() => send('sleep')} className="bg-blue-500 p-4 rounded-lg flex justify-center items-center flex-col">
          <Moon className="text-white mb-2" />
          <span className="text-white text-sm">Sleep</span>
        </button>
        <button onClick={() => send('logoff')} className="bg-purple-500 p-4 rounded-lg flex justify-center items-center flex-col">
          <LogOut className="text-white mb-2" />
          <span className="text-white text-sm">Logoff</span>
        </button>
      </div>
    </div>
  );
};

export default ControlsScreen;
