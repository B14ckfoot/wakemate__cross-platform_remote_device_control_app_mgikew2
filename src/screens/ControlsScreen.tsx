import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Wifi, WifiOff, Keyboard, Power, Music, Mouse, ChevronUp, ChevronDown, ArrowUp } from 'lucide-react';
import { Device } from '../types/device';
import SettingsButton from '../components/SettingsButton';
import deviceService from '../services/deviceService';

interface ControlsScreenProps {
  device: Device | null;
  onBack: () => void;
  onOpenSettings: () => void;
}

const ControlsScreen: React.FC<ControlsScreenProps> = ({ device, onBack, onOpenSettings }) => {
  const [activeControl, setActiveControl] = useState<string | null>(null);
  const [keyboardMode, setKeyboardMode] = useState<'letters' | 'numbers' | 'special'>('letters');
  const [shiftState, setShiftState] = useState<'none' | 'once' | 'locked'>('none');
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputText, setInputText] = useState("");
  const [lastKey, setLastKey] = useState("");
  const touchpadRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  
  // Handle sending commands to the device
  const sendMouseCommand = (action: string, params: any = {}) => {
    if (!device) return;
    
    deviceService.sendMouseCommand(device.id, device.ip, action, params)
      .catch(error => console.error(`Error sending mouse ${action}:`, error));
  };
  
  const sendKeyboardCommand = (key: string) => {
    if (!device) return;
    
    deviceService.sendKeyboardCommand(device.id, device.ip, key)
      .catch(error => console.error(`Error sending key press (${key}):`, error));
  };
  
  const sendMediaCommand = (command: string) => {
    if (!device) return;
    
    deviceService.sendMediaCommand(device.id, device.ip, command)
      .catch(error => console.error(`Error sending media command (${command}):`, error));
  };
  
  const toggleControl = (control: string) => {
    if (activeControl === control) {
      setActiveControl(null);
    } else {
      setActiveControl(control);
    }
  };
  
  // Handle Shift key state
  const handleShiftPress = () => {
    // Cycle through shift states: none -> once -> locked -> none
    if (shiftState === 'none') {
      setShiftState('once');
    } else if (shiftState === 'once') {
      setShiftState('locked');
    } else {
      setShiftState('none');
    }
  };
  
  // Check if auto-capitalization should occur after certain punctuation
  useEffect(() => {
    if (['.', '!', '?'].includes(lastKey) && shiftState === 'none') {
      setShiftState('once');
    }
  }, [lastKey]);
  
  // Handle key press
  const handleKeyPress = (key: string) => {
    // Process the key
    if (key === 'BACKSPACE') {
      setInputText(prev => prev.slice(0, -1));
      sendKeyboardCommand('backspace');
    } else if (key === 'ENTER') {
      setInputText(prev => prev + '\n');
      sendKeyboardCommand('enter');
    } else {
      setInputText(prev => prev + key);
      sendKeyboardCommand(key);
    }
    
    setLastKey(key);
    
    // If shift is in "once" mode, reset it after a key press
    if (shiftState === 'once') {
      setShiftState('none');
    }
  };
  
  // Handle mouse interactions for the touchpad
  const handleTouchpadMouseDown = (e: React.MouseEvent) => {
    if (!touchpadRef.current) return;
    
    const rect = touchpadRef.current.getBoundingClientRect();
    setStartPoint({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  };
  
  const handleTouchpadMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startPoint.x;
    const deltaY = e.clientY - startPoint.y;
    
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      sendMouseCommand('move', { deltaX, deltaY });
      setStartPoint({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleTouchpadMouseUp = () => {
    setIsDragging(false);
  };
  
  // Handle mouse clicks
  const handleMouseClick = (button: 'left' | 'right' | 'middle') => {
    sendMouseCommand(button === 'left' ? 'leftClick' : button === 'right' ? 'rightClick' : 'middleClick');
  };
  
  // Render the iOS-style keyboard
  const renderKeyboard = () => {
    let keyboardContent;
    
    if (keyboardMode === 'letters') {
      // Define key arrays based on shift state
      const qwertyRow = ['q','w','e','r','t','y','u','i','o','p'].map(
        key => shiftState !== 'none' ? key.toUpperCase() : key
      );
      
      const asdfRow = ['a','s','d','f','g','h','j','k','l'].map(
        key => shiftState !== 'none' ? key.toUpperCase() : key
      );
      
      const zxcvRow = ['z','x','c','v','b','n','m',',','.'].map(
        key => shiftState !== 'none' ? key : key
      );
      
      keyboardContent = (
        <>
          <div className="grid grid-cols-10 gap-1 mb-1">
            {qwertyRow.map(key => (
              <button 
                key={key} 
                className="bg-white text-black rounded-lg p-2 text-sm"
                onClick={() => handleKeyPress(key)}
              >
                {key}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-9 gap-1 mb-1 ml-3">
            {asdfRow.map(key => (
              <button 
                key={key} 
                className="bg-white text-black rounded-lg p-2 text-sm"
                onClick={() => handleKeyPress(key)}
              >
                {key}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-9 gap-1 mb-2 ml-4">
            {zxcvRow.map(key => (
              <button 
                key={key} 
                className="bg-white text-black rounded-lg p-2 text-sm"
                onClick={() => handleKeyPress(key)}
              >
                {key}
              </button>
            ))}
          </div>
        </>
      );
    } else if (keyboardMode === 'numbers') {
      keyboardContent = (
        <>
          <div className="grid grid-cols-10 gap-1 mb-1">
            {['1','2','3','4','5','6','7','8','9','0'].map(key => (
              <button 
                key={key} 
                className="bg-white text-black rounded-lg p-2 text-sm"
                onClick={() => handleKeyPress(key)}
              >
                {key}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-1 mb-1">
            {['-','/','*','+','='].map(key => (
              <button 
                key={key} 
                className="bg-white text-black rounded-lg p-2 text-sm"
                onClick={() => handleKeyPress(key)}
              >
                {key}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-1 mb-2">
            {['(',')','{','}','%'].map(key => (
              <button 
                key={key} 
                className="bg-white text-black rounded-lg p-2 text-sm"
                onClick={() => handleKeyPress(key)}
              >
                {key}
              </button>
            ))}
          </div>
        </>
      );
    } else if (keyboardMode === 'special') {
      keyboardContent = (
        <>
          <div className="grid grid-cols-8 gap-1 mb-1">
            {['!','@','#','$','&','_','^','~'].map(key => (
              <button 
                key={key} 
                className="bg-white text-black rounded-lg p-2 text-sm"
                onClick={() => handleKeyPress(key)}
              >
                {key}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-8 gap-1 mb-1">
            {['[',']','<','>','|','\\',':',';'].map(key => (
              <button 
                key={key} 
                className="bg-white text-black rounded-lg p-2 text-sm"
                onClick={() => handleKeyPress(key)}
              >
                {key}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-6 gap-1 mb-2">
            {["'",'"','?','€','£','¥'].map(key => (
              <button 
                key={key} 
                className="bg-white text-black rounded-lg p-2 text-sm"
                onClick={() => handleKeyPress(key)}
              >
                {key}
              </button>
            ))}
          </div>
        </>
      );
    }
    
    return (
      <div className="bg-gray-100 p-3 rounded-lg mt-3 mb-4 animate-fadeIn">
        {/* Text input display */}
        <div className="bg-white text-black rounded-lg p-2 mb-2 min-h-12 max-h-24 overflow-y-auto">
          <p className="break-words">{inputText}<span className="animate-pulse">|</span></p>
        </div>
        
        {/* Keyboard type selector */}
        <div className="flex bg-gray-300 rounded-lg mb-2 p-1 text-xs">
          <button 
            className={`flex-1 py-2 rounded-lg ${keyboardMode === 'letters' ? 'bg-white shadow-sm' : 'bg-transparent'}`}
            onClick={() => setKeyboardMode('letters')}
          >
            ABC
          </button>
          <button 
            className={`flex-1 py-2 rounded-lg ${keyboardMode === 'numbers' ? 'bg-white shadow-sm' : 'bg-transparent'}`}
            onClick={() => setKeyboardMode('numbers')}
          >
            123
          </button>
          <button 
            className={`flex-1 py-2 rounded-lg ${keyboardMode === 'special' ? 'bg-white shadow-sm' : 'bg-transparent'}`}
            onClick={() => setKeyboardMode('special')}
          >
            #+=
          </button>
        </div>
        
        {/* Dynamic keyboard layout */}
        {keyboardContent}
        
        {/* Special keys row with Shift */}
        <div className="flex justify-between mb-1">
          <button 
            className={`flex items-center justify-center px-2 py-2 rounded-lg text-sm ${
              shiftState !== 'none' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-300 text-black'
            }`}
            onClick={handleShiftPress}
          >
            <ArrowUp className="w-4 h-4 mr-1" />
            {shiftState === 'locked' ? 'LOCK' : 'Shift'}
          </button>
          <button 
            className="bg-white text-black rounded-lg py-2 px-12 text-sm"
            onClick={() => handleKeyPress(' ')}
          >
            space
          </button>
          <button 
            className="bg-gray-300 text-black rounded-lg px-3 py-2 text-sm"
            onClick={() => handleKeyPress('BACKSPACE')}
          >
            ⌫
          </button>
        </div>
        
        {/* Return key */}
        <div className="flex justify-end">
          <button 
            className="bg-blue-500 text-white rounded-lg p-2 text-sm w-20"
            onClick={() => handleKeyPress('ENTER')}
          >
            return
          </button>
        </div>
      </div>
    );
  };
  
  // Render media controls
  const renderMediaControls = () => (
    <div className="bg-gray-800 p-4 rounded-lg mt-3 mb-4 animate-fadeIn">
      <div className="flex justify-center mb-6">
        <div className="w-36 h-36 bg-gray-700 rounded-full flex items-center justify-center">
          <button 
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center"
            onClick={() => {
              setIsPlaying(!isPlaying);
              sendMediaCommand(isPlaying ? 'pause' : 'play');
            }}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className="w-8 h-8">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className="w-8 h-8">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <button 
          className="bg-gray-700 p-3 rounded-lg flex items-center justify-center"
          onClick={() => sendMediaCommand('previous')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>
        <button 
          className="bg-gray-700 p-3 rounded-lg flex items-center justify-center"
          onClick={() => {
            setIsPlaying(!isPlaying);
            sendMediaCommand(isPlaying ? 'pause' : 'play');
          }}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <button 
          className="bg-gray-700 p-3 rounded-lg flex items-center justify-center"
          onClick={() => sendMediaCommand('next')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </button>
        <button 
          className="bg-gray-700 p-3 rounded-lg flex items-center justify-center"
          onClick={() => sendMediaCommand('volumeDown')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>
        </button>
        <button 
          className="bg-gray-700 p-3 rounded-lg flex items-center justify-center"
          onClick={() => sendMediaCommand('mute')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          </svg>
        </button>
        <button 
          className="bg-gray-700 p-3 rounded-lg flex items-center justify-center"
          onClick={() => sendMediaCommand('volumeUp')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM16 3v2c4.97 0 9 4.03 9 9s-4.03 9-9 9v2c6.08 0 11-4.93 11-11S22.08 3 16 3zm0 4v2c2.76 0 5 2.24 5 5s-2.24 5-5 5v2c3.87 0 7-3.13 7-7s-3.13-7-7-7z M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>
        </button>
      </div>
    </div>
  );
  
  // Render power controls
  const renderPowerControls = () => (
    <div className="bg-gray-800 p-3 rounded-lg mt-3 mb-4 animate-fadeIn">
      <div className="grid grid-cols-2 gap-3">
        <button 
          className="flex flex-col items-center bg-red-500 rounded-lg py-3"
          onClick={() => deviceService.sendCommand({ command: "shutdown", deviceId: device?.id || '' })}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6 mb-1">
            <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z" />
          </svg>
          <span className="text-white text-xs">Shutdown</span>
        </button>
        <button 
          className="flex flex-col items-center bg-blue-600 rounded-lg py-3"
          onClick={() => deviceService.sendCommand({ command: "sleep", deviceId: device?.id || '' })}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6 mb-1">
            <path d="M9.5 2c-1.82 0-3.53.5-5 1.35 2.99 1.73 5 4.95 5 8.65s-2.01 6.92-5 8.65c1.47.85 3.18 1.35 5 1.35 5.52 0 10-4.48 10-10S15.02 2 9.5 2z" />
          </svg>
          <span className="text-white text-xs">Sleep</span>
        </button>
        <button 
          className="flex flex-col items-center bg-yellow-500 rounded-lg py-3"
          onClick={() => deviceService.sendCommand({ command: "restart", deviceId: device?.id || '' })}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className="w-6 h-6 mb-1">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 9h7V2l-2.35 4.35z" />
          </svg>
          <span className="text-black text-xs">Restart</span>
        </button>
        <button 
          className="flex flex-col items-center bg-purple-600 rounded-lg py-3"
          onClick={() => deviceService.sendCommand({ command: "logoff", deviceId: device?.id || '' })}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6 mb-1">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
          </svg>
          <span className="text-white text-xs">Logoff</span>
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="bg-gray-900 p-4 text-white flex flex-col min-h-screen relative">
      {/* Settings Button */}
      <SettingsButton onPress={onOpenSettings} />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <button 
            className="text-white mr-2"
            onClick={onBack}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-sm font-medium">{device ? device.name : "Device"}</h1>
        </div>
        
        <div className="flex items-center text-green-400 text-xs mr-8">
          <Wifi className="w-4 h-4 mr-1" />
          <span>Connected</span>
        </div>
      </div>
      
      {/* Trackpad container */}
      <div 
        ref={touchpadRef}
        className="relative bg-gray-800 h-[40vh] w-full max-w-md rounded-lg mb-6 mx-auto cursor-pointer"
        onMouseDown={handleTouchpadMouseDown}
        onMouseMove={handleTouchpadMouseMove}
        onMouseUp={handleTouchpadMouseUp}
        onMouseLeave={handleTouchpadMouseUp}
      >
        {/* Touchpad surface */}
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-gray-400 text-sm select-none">Slide to move cursor</p>
        </div>
        
        {/* Scroll controls */}
        <div className="absolute bottom-0 right-0 translate-x-11 translate-y-1 flex flex-col w-10 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <button 
            className="h-10 flex items-center justify-center"
            onClick={() => sendMouseCommand('scrollUp', { amount: 5 })}
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <div className="border-t border-gray-700"></div>
          <button 
            className="h-10 flex items-center justify-center"
            onClick={() => sendMouseCommand('scrollDown', { amount: 5 })}
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Mouse buttons */}
      <div className="flex space-x-1 h-12 mb-4">
        <button 
          className="flex-1 bg-gray-700 rounded-l-lg active:bg-gray-600"
          onMouseDown={() => handleMouseClick('left')}
        ></button>
        <button 
          className="w-14 bg-gray-600 border-l border-r border-gray-800 active:bg-gray-500"
          onMouseDown={() => handleMouseClick('middle')}
        ></button>
        <button 
          className="flex-1 bg-gray-700 rounded-r-lg active:bg-gray-600"
          onMouseDown={() => handleMouseClick('right')}
        ></button>
      </div>
      
      {/* Control buttons */}
      <div className="flex justify-center mb-2">
        <div className="flex space-x-4">
          <button 
            onClick={() => toggleControl('keyboard')}
            className={`rounded-full w-12 h-12 flex items-center justify-center ${activeControl === 'keyboard' ? 'bg-green-500' : 'bg-gray-700'}`}
          >
            <Keyboard className="w-6 h-6" />
          </button>
          <button 
            onClick={() => toggleControl('media')}
            className={`rounded-full w-12 h-12 flex items-center justify-center ${activeControl === 'media' ? 'bg-green-500' : 'bg-gray-700'}`}
          >
            <Music className="w-6 h-6" />
          </button>
          <button 
            onClick={() => toggleControl('power')}
            className={`rounded-full w-12 h-12 flex items-center justify-center ${activeControl === 'power' ? 'bg-green-500' : 'bg-gray-700'}`}
          >
            <Power className="w-6 h-6" />
          </button>
        </div>
      </div>  
      
      {/* Expanded control panel content */}
      {activeControl === 'media' && renderMediaControls()}
      {activeControl === 'power' && renderPowerControls()}
      {activeControl === 'keyboard' && renderKeyboard()}
    </div>
  );
};

export default ControlsScreen;