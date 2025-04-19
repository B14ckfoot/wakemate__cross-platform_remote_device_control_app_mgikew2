import React, { useState, useRef } from 'react';
import { ChevronLeft, Wifi, WifiOff, Keyboard, Power, Music, Mouse, ChevronUp, ChevronDown, Hash, AtSign } from 'lucide-react';

const WakeMATE = () => {
  const [activeControl, setActiveControl] = useState(null);
  const [deviceStatus, setDeviceStatus] = useState('online');
  const [keyboardMode, setKeyboardMode] = useState('letters'); // 'letters', 'numbers', 'special'
  const touchpadRef = useRef(null);
  
  const toggleControl = (control) => {
    if (activeControl === control) {
      setActiveControl(null);
    } else {
      setActiveControl(control);
    }
  };
  
  const renderMediaControls = () => (
    <div className="bg-gray-800 p-3 rounded-lg mt-3 mb-4 animate-fadeIn">
      <div className="flex justify-center mb-4">
        <div className="w-36 h-36 bg-gray-700 rounded-full flex items-center justify-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className="w-6 h-6">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <button className="bg-gray-700 p-2 rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>
        <button className="bg-gray-700 p-2 rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
        <button className="bg-gray-700 p-2 rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </button>
        <button className="bg-gray-700 p-2 rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>
        </button>
        <button className="bg-gray-700 p-2 rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          </svg>
        </button>
        <button className="bg-gray-700 p-2 rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
            <path d="M3 9v6h4l5 5V4L7 9H3zm7-.17v6.34L7.83 13H5v-2h2.83L10 8.83zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>
        </button>
      </div>
    </div>
  );
  
  const renderPowerControls = () => (
    <div className="bg-gray-800 p-3 rounded-lg mt-3 mb-4 animate-fadeIn">
      <div className="grid grid-cols-2 gap-3">
        <button className="flex flex-col items-center bg-red-500 rounded-lg py-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6 mb-1">
            <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z" />
          </svg>
          <span className="text-white text-xs">Shutdown</span>
        </button>
        <button className="flex flex-col items-center bg-blue-600 rounded-lg py-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6 mb-1">
            <path d="M9.27 4.49c-1.63 7.54 3.75 12.41 7.66 13.8C15.54 19.38 13.81 20 12 20c-4.41 0-8-3.59-8-8 0-3.45 2.2-6.4 5.27-7.51m12.02-1.67c.73.65.76 1.75.08 2.43-3.9 3.9-5.38 9.06-3.1 13.01.59 1.02-.02 2.31-1.17 2.54-1.77.35-3.8.21-5.8-.42-3.11-.98-5.67-3.16-7.09-5.91-1.86-3.61-1.55-7.97.88-11.25 1.71-2.31 4.31-3.81 7.19-4.17 1.07-.13 2.12.2 2.74 1.08 3.04 4.3 4.62 5.06 6.27 2.69z" />
          </svg>
          <span className="text-white text-xs">Sleep</span>
        </button>
        <button className="flex flex-col items-center bg-yellow-500 rounded-lg py-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className="w-6 h-6 mb-1">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 9h7V2l-2.35 4.35z" />
          </svg>
          <span className="text-black text-xs">Restart</span>
        </button>
        <button className="flex flex-col items-center bg-purple-600 rounded-lg py-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6 mb-1">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
          </svg>
          <span className="text-white text-xs">Logoff</span>
        </button>
      </div>
    </div>
  );
  
  const renderKeyboardControls = () => {
    // Keyboard layout based on the mode
    let keyboardContent;
    
    if (keyboardMode === 'letters') {
      keyboardContent = (
        <>
          <div className="grid grid-cols-10 gap-1 mb-1">
            {['q','w','e','r','t','y','u','i','o','p'].map(key => (
              <button key={key} className="bg-white text-black rounded-lg p-1 text-xs">{key}</button>
            ))}
          </div>
          <div className="grid grid-cols-9 gap-1 mb-1 ml-3">
            {['a','s','d','f','g','h','j','k','l'].map(key => (
              <button key={key} className="bg-white text-black rounded-lg p-1 text-xs">{key}</button>
            ))}
          </div>
          <div className="grid grid-cols-9 gap-1 mb-2 ml-4">
            {['z','x','c','v','b','n','m',',','.'].map(key => (
              <button key={key} className="bg-white text-black rounded-lg p-1 text-xs">{key}</button>
            ))}
          </div>
        </>
      );
    } else if (keyboardMode === 'numbers') {
      keyboardContent = (
        <>
          <div className="grid grid-cols-10 gap-1 mb-1">
            {['1','2','3','4','5','6','7','8','9','0'].map(key => (
              <button key={key} className="bg-white text-black rounded-lg p-1 text-xs">{key}</button>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-1 mb-1">
            {['-','/','*','+','='].map(key => (
              <button key={key} className="bg-white text-black rounded-lg p-1 text-xs">{key}</button>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-1 mb-2">
            {['(',')','{','}','%'].map(key => (
              <button key={key} className="bg-white text-black rounded-lg p-1 text-xs">{key}</button>
            ))}
          </div>
        </>
      );
    } else if (keyboardMode === 'special') {
      keyboardContent = (
        <>
          <div className="grid grid-cols-8 gap-1 mb-1">
            {['!','@','#','$','&','_','^','~'].map(key => (
              <button key={key} className="bg-white text-black rounded-lg p-1 text-xs">{key}</button>
            ))}
          </div>
          <div className="grid grid-cols-8 gap-1 mb-1">
            {['[',']','<','>','|','\\',':',';'].map(key => (
              <button key={key} className="bg-white text-black rounded-lg p-1 text-xs">{key}</button>
            ))}
          </div>
          <div className="grid grid-cols-6 gap-1 mb-2">
            {["'",'"','?','€','£','¥'].map(key => (
              <button key={key} className="bg-white text-black rounded-lg p-1 text-xs">{key}</button>
            ))}
          </div>
        </>
      );
    }
    
    return (
      <div className="bg-gray-100 p-2 rounded-lg mt-3 mb-4 animate-fadeIn">
        {/* Keyboard type selector */}
        <div className="flex bg-gray-300 rounded-lg mb-2 p-1 text-xs">
          <button 
            className={`flex-1 py-1 rounded-lg ${keyboardMode === 'letters' ? 'bg-white shadow-sm' : 'bg-transparent'}`}
            onClick={() => setKeyboardMode('letters')}
          >
            ABC
          </button>
          <button 
            className={`flex-1 py-1 rounded-lg ${keyboardMode === 'numbers' ? 'bg-white shadow-sm' : 'bg-transparent'}`}
            onClick={() => setKeyboardMode('numbers')}
          >
            123
          </button>
          <button 
            className={`flex-1 py-1 rounded-lg ${keyboardMode === 'special' ? 'bg-white shadow-sm' : 'bg-transparent'}`}
            onClick={() => setKeyboardMode('special')}
          >
            #+=
          </button>
        </div>
        
        {/* Dynamic keyboard layout */}
        {keyboardContent}
        
        {/* Common keys */}
        <div className="flex justify-center mb-1">
          <button className="bg-white text-black rounded-lg py-1 px-12 text-xs">space</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button className="bg-gray-300 text-black rounded-lg p-1 text-xs">⌫ Backspace</button>
          <button className="bg-gray-300 text-black rounded-lg p-1 text-xs">↵ Enter</button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-gray-900 p-4 text-white flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <button className="text-white mr-2">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-sm font-medium">Marco's MacBook Pro</h1>
        </div>
        
        {deviceStatus === 'online' ? (
          <div className="flex items-center text-green-400 text-xs">
            <Wifi className="w-4 h-4 mr-1" />
            <span>Connected</span>
          </div>
        ) : (
          <div className="flex items-center text-red-400 text-xs">
            <WifiOff className="w-4 h-4 mr-1" />
            <span>Offline</span>
          </div>
        )}
      </div>
      
      {/* Trackpad container */}
<div className="relative bg-gray-800 h-[50vh] w-[70vw] max-w-md rounded-lg mb-8 mx-auto">

{/* Trackpad content */}
<div className="w-full h-full flex items-center justify-center">
  <p className="text-gray-400 text-sm">Trackpad</p>
</div>

{/* Scroll controls -- hugging outside bottom-right */}
<div className="absolute bottom-0 right-0 translate-x-11 translate-y--1 flex flex-col w-10 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
  <button className="h-10 flex items-center justify-center">
    <ChevronUp className="w-5 h-5" />
  </button>
  <div className="border-t border-gray-700"></div>
  <button className="h-10 flex items-center justify-center">
    <ChevronDown className="w-5 h-5" />
  </button>
</div>

</div>
      
      {/* Mouse buttons - simple visual layout */}
      <div className="flex space-x-1 h-10 mb-4">
        <button className="flex-1 bg-gray-700 rounded-l-lg"></button>
        <button className="w-14 bg-gray-600 border-l border-r border-gray-800"></button>
        <button className="flex-1 bg-gray-700 rounded-r-lg"></button>
      </div>
      
      {/* Control buttons */}
      <div className="flex justify-center mb-2">
        <div className="flex space-x-3">
          <button 
            onClick={() => toggleControl('keyboard')}
            className={`rounded-full w-10 h-10 flex items-center justify-center ${activeControl === 'keyboard' ? 'bg-green-500' : 'bg-gray-700'}`}
          >
            <Keyboard className="w-5 h-5" />
          </button>
          <button 
            onClick={() => toggleControl('media')}
            className={`rounded-full w-10 h-10 flex items-center justify-center ${activeControl === 'media' ? 'bg-green-500' : 'bg-gray-700'}`}
          >
            <Music className="w-5 h-5" />
          </button>
          <button 
            onClick={() => toggleControl('power')}
            className={`rounded-full w-10 h-10 flex items-center justify-center ${activeControl === 'power' ? 'bg-green-500' : 'bg-gray-700'}`}
          >
            <Power className="w-5 h-5" />
          </button>
        </div>
      </div>  

      
      {/* Expanded control panel content */}
      {activeControl === 'media' && renderMediaControls()}
      {activeControl === 'power' && renderPowerControls()}
      {activeControl === 'keyboard' && renderKeyboardControls()}
    </div>
  );
};

export default WakeMATE;