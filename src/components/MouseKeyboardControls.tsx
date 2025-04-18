import React, { useState } from 'react';
import { Keyboard, Mouse, Music, X, ChevronLeft, ChevronRight, Volume, Volume2, VolumeX, PlaySquare } from 'lucide-react';
import deviceService from '../services/deviceService';

interface ControlsProps {
  deviceId: string;
  deviceIp: string;
  onBack: () => void;
}

const MouseKeyboardControls: React.FC<ControlsProps> = ({ deviceId, deviceIp, onBack }) => {
  const [activeTab, setActiveTab] = useState<'mouse' | 'keyboard' | 'media'>('mouse');
  const [keyboardTab, setKeyboardTab] = useState<'main' | 'special'>('main');
  const [showKeyboard, setShowKeyboard] = useState(true);

  // Main keyboard keys layout
  const mainKeyboard = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.']
  ];

  // Special characters keyboard layout
  const specialKeyboard = [
    ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'],
    ['-', '_', '=', '+', '[', ']', '{', '}', '\\', '|'],
    ['/', '?', ';', ':', "'", '"', '<', '>', '~', '`'],
    ['€', '£', '¥', '©', '®', '™', '°', '•', '§', '¶']
  ];

  // Handle mouse movement
  const handleMouseMovement = (deltaX: number, deltaY: number) => {
    deviceService.sendMouseCommand(deviceId, deviceIp, 'move', { deltaX, deltaY })
      .catch(error => console.error('Error sending mouse movement:', error));
  };

  // Handle mouse clicks
  const handleMouseClick = (button: 'left' | 'right') => {
    deviceService.sendMouseCommand(deviceId, deviceIp, button === 'left' ? 'leftClick' : 'rightClick')
      .catch(error => console.error(`Error sending mouse ${button} click:`, error));
  };

  // Handle keyboard key press
  const handleKeyPress = (key: string) => {
    deviceService.sendKeyboardCommand(deviceId, deviceIp, key)
      .catch(error => console.error(`Error sending key press (${key}):`, error));
  };

  // Handle media command
  const handleMediaCommand = (command: string) => {
    deviceService.sendMediaCommand(deviceId, deviceIp, command)
      .catch(error => console.error(`Error sending media command (${command}):`, error));
  };

  // Handle volume command
  const handleVolumeCommand = (command: string) => {
    deviceService.sendVolumeCommand(deviceId, deviceIp, command)
      .catch(error => console.error(`Error sending volume command (${command}):`, error));
  };

  // Render mouse controls
  const renderMouseControls = () => {
    return (
      <div className="bg-purple-800 p-4 rounded-lg">
        <h3 className="text-white text-lg font-bold mb-4">Mouse Control</h3>
        
        {/* Touchpad area */}
        <div 
          className="bg-purple-700 h-64 rounded-lg flex items-center justify-center mb-4 cursor-pointer relative"
          onMouseDown={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const startX = e.clientX;
            const startY = e.clientY;
            
            const handleMouseMove = (moveEvent: MouseEvent) => {
              const deltaX = moveEvent.clientX - startX;
              const deltaY = moveEvent.clientY - startY;
              handleMouseMovement(deltaX, deltaY);
            };
            
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        >
          <div className="absolute inset-0 opacity-20">
            <svg 
              viewBox="0 0 400 200" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <path d="M0,200 L150,80 L250,120 L400,200 Z" fill="#ffffff" />
              <circle cx="300" cy="60" r="30" fill="#ffffff" />
              <path d="M50,100 Q100,50 150,100 T250,100" stroke="#ffffff" fill="none" strokeWidth="2" />
              <path d="M70,90 Q120,40 170,90" stroke="#ffffff" fill="none" strokeWidth="1" />
              <circle cx="80" cy="80" r="5" fill="#ffffff" />
              <circle cx="120" cy="60" r="4" fill="#ffffff" />
              <circle cx="160" cy="70" r="6" fill="#ffffff" />
              <circle cx="200" cy="80" r="5" fill="#ffffff" />
              <circle cx="240" cy="60" r="4" fill="#ffffff" />
            </svg>
          </div>
          
          <p className="text-white text-center z-10">
            <span className="block font-bold">Touchpad Area</span>
            <span className="text-sm text-gray-300">Click and drag to move cursor</span>
          </p>
        </div>
        
        {/* Click buttons */}
        <div className="flex justify-between mb-6">
          <button 
            className="bg-purple-700 text-white px-4 py-3 rounded-lg w-[48%] flex items-center justify-center"
            onClick={() => handleMouseClick('left')}
          >
            <span>Left Click</span>
          </button>
          <button 
            className="bg-purple-600 text-white px-4 py-3 rounded-lg w-[48%] flex items-center justify-center"
            onClick={() => handleMouseClick('right')}
          >
            <span>Right Click</span>
          </button>
        </div>
        
        {/* Additional mouse controls */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            className="bg-purple-700 text-white p-2 rounded-lg flex items-center justify-center"
            onClick={() => deviceService.sendMouseCommand(deviceId, deviceIp, 'doubleClick')}
          >
            Double Click
          </button>
          <button 
            className="bg-purple-700 text-white p-2 rounded-lg flex items-center justify-center"
            onClick={() => deviceService.sendMouseCommand(deviceId, deviceIp, 'scrollUp', { amount: 5 })}
          >
            Scroll Up
          </button>
          <button 
            className="bg-purple-700 text-white p-2 rounded-lg flex items-center justify-center"
            onClick={() => deviceService.sendMouseCommand(deviceId, deviceIp, 'scrollDown', { amount: 5 })}
          >
            Scroll Down
          </button>
          <button 
            className="bg-purple-700 text-white p-2 rounded-lg flex items-center justify-center"
            onClick={() => deviceService.sendKeyboardCommand(deviceId, deviceIp, 'ESC')}
          >
            Escape
          </button>
        </div>
      </div>
    );
  };

  // Render keyboard controls
  const renderKeyboardControls = () => {
    return (
      <div className="bg-purple-800 p-4 rounded-lg">
        <h3 className="text-white text-lg font-bold mb-4">Keyboard Control</h3>
        
        {/* Keyboard tabs */}
        <div className="flex mb-4">
          <button 
            className={`flex-1 py-2 rounded-tl-md rounded-bl-md ${keyboardTab === 'main' ? 'bg-purple-600 text-white' : 'bg-purple-900 text-gray-300'}`}
            onClick={() => setKeyboardTab('main')}
          >
            Main Keys
          </button>
          <button 
            className={`flex-1 py-2 rounded-tr-md rounded-br-md ${keyboardTab === 'special' ? 'bg-purple-600 text-white' : 'bg-purple-900 text-gray-300'}`}
            onClick={() => setKeyboardTab('special')}
          >
            Special Chars
          </button>
        </div>
        
        {/* Keyboard layout - Main */}
        {keyboardTab === 'main' && (
          <>
            {mainKeyboard.map((row, rowIndex) => (
              <div key={`row-${rowIndex}`} className="flex justify-center mb-1">
                {row.map(key => (
                  <button
                    key={key}
                    className="bg-purple-700 text-white w-8 h-8 m-0.5 rounded-md flex items-center justify-center text-xs"
                    onClick={() => handleKeyPress(key)}
                  >
                    {key.toUpperCase()}
                  </button>
                ))}
              </div>
            ))}
          </>
        )}
        
        {/* Keyboard layout - Special */}
        {keyboardTab === 'special' && (
          <>
            {specialKeyboard.map((row, rowIndex) => (
              <div key={`special-row-${rowIndex}`} className="flex justify-center mb-1">
                {row.map(key => (
                  <button
                    key={key}
                    className="bg-purple-700 text-white w-8 h-8 m-0.5 rounded-md flex items-center justify-center text-xs"
                    onClick={() => handleKeyPress(key)}
                  >
                    {key}
                  </button>
                ))}
              </div>
            ))}
          </>
        )}
        
        {/* Special keys */}
        <div className="flex justify-around mt-4">
          {[
            { key: 'space', label: 'Space' },
            { key: 'backspace', label: 'Backspace' },
            { key: 'enter', label: 'Enter' },
            { key: 'tab', label: 'Tab' }
          ].map(({ key, label }) => (
            <button
              key={key}
              className="bg-purple-600 text-white px-2 py-1 rounded-md text-xs"
              onClick={() => handleKeyPress(key)}
            >
              {label}
            </button>
          ))}
        </div>
        
        {/* Common key combinations */}
        <div className="mt-4">
          <h4 className="text-white text-sm mb-2">Common Combinations</h4>
          <div className="grid grid-cols-2 gap-2">
            <button 
              className="bg-purple-600 text-white p-2 rounded-md text-sm"
              onClick={() => handleKeyPress('CTRL+C')}
            >
              Ctrl+C (Copy)
            </button>
            <button 
              className="bg-purple-600 text-white p-2 rounded-md text-sm"
              onClick={() => handleKeyPress('CTRL+V')}
            >
              Ctrl+V (Paste)
            </button>
            <button 
              className="bg-purple-600 text-white p-2 rounded-md text-sm"
              onClick={() => handleKeyPress('CTRL+Z')}
            >
              Ctrl+Z (Undo)
            </button>
            <button 
              className="bg-purple-600 text-white p-2 rounded-md text-sm"
              onClick={() => handleKeyPress('CTRL+ALT+DELETE')}
            >
              Ctrl+Alt+Del
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render media controls
  const renderMediaControls = () => {
    return (
      <div className="bg-purple-800 p-4 rounded-lg">
        <h3 className="text-white text-lg font-bold mb-4">Media Controls</h3>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          <button 
            className="bg-gray-200 text-black p-4 rounded-lg flex items-center justify-center"
            onClick={() => handleMediaCommand('previous')}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            className="bg-gray-200 text-black p-4 rounded-lg flex items-center justify-center"
            onClick={() => handleMediaCommand('play')}
          >
            <PlaySquare className="w-6 h-6" />
          </button>
          <button 
            className="bg-gray-200 text-black p-4 rounded-lg flex items-center justify-center"
            onClick={() => handleMediaCommand('next')}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          <button 
            className="bg-gray-200 text-black p-4 rounded-lg flex items-center justify-center"
            onClick={() => handleVolumeCommand('mute')}
          >
            <VolumeX className="w-6 h-6" />
          </button>
          <button 
            className="bg-gray-200 text-black p-4 rounded-lg flex items-center justify-center"
            onClick={() => handleVolumeCommand('down')}
          >
            <Volume className="w-6 h-6" />
          </button>
          <button 
            className="bg-gray-200 text-black p-4 rounded-lg flex items-center justify-center"
            onClick={() => handleVolumeCommand('up')}
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>
        
        {/* Additional media controls */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            className="bg-purple-700 text-white p-3 rounded-lg flex items-center justify-center"
            onClick={() => handleKeyPress('CTRL+ALT+p')}
          >
            Play/Pause (Alt)
          </button>
          <button 
            className="bg-purple-700 text-white p-3 rounded-lg flex items-center justify-center"
            onClick={() => handleMediaCommand('fullscreen')}
          >
            Fullscreen
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <button 
        className="mb-4 text-white bg-purple-800 px-4 py-2 rounded-lg flex items-center"
        onClick={onBack}
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back
      </button>
      
      {/* Tab navigation */}
      <div className="flex mb-4">
        <button
          className={`flex-1 py-3 flex items-center justify-center ${activeTab === 'mouse' ? 'bg-purple-600 text-white' : 'bg-purple-800 text-gray-300'}`}
          onClick={() => setActiveTab('mouse')}
        >
          <Mouse className="w-5 h-5 mr-2" />
          Mouse
        </button>
        <button
          className={`flex-1 py-3 flex items-center justify-center ${activeTab === 'keyboard' ? 'bg-purple-600 text-white' : 'bg-purple-800 text-gray-300'}`}
          onClick={() => setActiveTab('keyboard')}
        >
          <Keyboard className="w-5 h-5 mr-2" />
          Keyboard
        </button>
        <button
          className={`flex-1 py-3 flex items-center justify-center ${activeTab === 'media' ? 'bg-purple-600 text-white' : 'bg-purple-800 text-gray-300'}`}
          onClick={() => setActiveTab('media')}
        >
          <Music className="w-5 h-5 mr-2" />
          Media
        </button>
      </div>
      
      {/* Control panels */}
      {activeTab === 'mouse' && renderMouseControls()}
      {activeTab === 'keyboard' && renderKeyboardControls()}
      {activeTab === 'media' && renderMediaControls()}
    </div>
  );
};

export default MouseKeyboardControls;