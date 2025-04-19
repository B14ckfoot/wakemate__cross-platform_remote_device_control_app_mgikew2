import React, { useState, useEffect } from 'react';

// Simple icons
const IconHome = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const IconSettings = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

const IconBack = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const IconPower = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18.36 6.64A9 9 0 0 1 20.77 15"></path>
    <path d="M6.16 6.16a9 9 0 1 0 12.68 12.68"></path>
    <path d="M12 2v4"></path>
    <path d="m2 2 20 20"></path>
  </svg>
);

const IconMoon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
  </svg>
);

const IconRefresh = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
    <path d="M21 3v5h-5"></path>
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
    <path d="M8 16H3v5"></path>
  </svg>
);

const IconX = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Mock functions and components
const mockCheckDeviceStatus = async (ip) => {
  // In a real app this would actually check if the device is online
  return Math.random() > 0.5;
};

const mockDeviceService = {
  getServerAddress() {
    return localStorage.getItem('serverIp') || '';
  },
  async sendWakeOnLan(deviceId, mac) {
    console.log(`Wake-on-LAN packet sent to device ${deviceId} with MAC ${mac}`);
    return true;
  },
  async sendPowerCommand(deviceId, ip, command) {
    console.log(`${command} command sent to device ${deviceId} at IP ${ip}`);
    return true;
  }
};

// Main App component
function App() {
  // State
  const [devices, setDevices] = useState(() => {
    const savedDevices = localStorage.getItem('devices');
    return savedDevices ? JSON.parse(savedDevices) : [];
  });
  
  const [currentTab, setCurrentTab] = useState('home');
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [activeDeviceId, setActiveDeviceId] = useState(null);
  const [serverIp, setServerIp] = useState(() => localStorage.getItem('serverIp') || '');
  const [isConnected, setIsConnected] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Add device modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceMac, setNewDeviceMac] = useState('');
  const [newDeviceIp, setNewDeviceIp] = useState('');
  
  // Save devices to localStorage
  useEffect(() => {
    localStorage.setItem('devices', JSON.stringify(devices));
  }, [devices]);
  
  // Update server connection status
  useEffect(() => {
    if (serverIp) {
      localStorage.setItem('serverIp', serverIp);
      // Simulate connection success
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [serverIp]);
  
  // Check device status periodically
  useEffect(() => {
    if (devices.length === 0) return;
    
    const checkDevicesStatus = async () => {
      try {
        const updatedDevices = await Promise.all(
          devices.map(async (device) => ({
            ...device,
            status: (await mockCheckDeviceStatus(device.ip)) ? 'online' : 'offline',
          }))
        );
        
        setDevices(updatedDevices);
      } catch (err) {
        console.error('Error checking device status:', err);
      }
    };
    
    // Initial check
    checkDevicesStatus();
    
    // Set up polling every 15 seconds
    const intervalId = setInterval(checkDevicesStatus, 15000);
    
    return () => clearInterval(intervalId);
  }, [devices.length]);
  
  // Device actions
  const sendWake = (device) => deviceAction(device, 'wake', 5000);
  const sendSleep = (device) => deviceAction(device, 'sleep', 5000);
  const sendRestart = (device) => deviceAction(device, 'restart', 0);
  const sendShutdown = (device) => deviceAction(device, 'shutdown', 5000);
  
  async function deviceAction(device, command, refreshDelay) {
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      let ok = false;
      
      if (isConnected) {
        // Use the mock service for the command
        ok = command === 'wake'
          ? await mockDeviceService.sendWakeOnLan(device.id, device.mac)
          : await mockDeviceService.sendPowerCommand(device.id, device.ip, command);
      } else {
        alert('Server connection is required for device control. Please set up the server in Settings.');
        setIsLoading(false);
        return;
      }
      
      alert(ok ? `${command} command sent to ${device.name}` : `Failed to send ${command}`);
      
      if (refreshDelay) {
        // After a delay, update the device status
        setTimeout(() => {
          const updatedDevices = devices.map(d => 
            d.id === device.id
              ? { ...d, status: (command === 'wake' ? 'online' : 'offline') }
              : d
          );
          setDevices(updatedDevices);
        }, refreshDelay);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Action failed');
    } finally {
      setIsLoading(false);
    }
  }
  
  // Handle adding a new device
  const handleAddDevice = async () => {
    if (!newDeviceName || !newDeviceMac || !newDeviceIp) {
      alert('Please fill all fields');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Check if we have a device with the same IP or MAC
      const isDuplicate = devices.some(
        d => d.ip === newDeviceIp || d.mac === newDeviceMac
      );
      
      if (isDuplicate) {
        alert('A device with this IP or MAC address already exists.');
        setIsLoading(false);
        return;
      }
      
      const newDevice = {
        id: Date.now().toString(),
        name: newDeviceName,
        mac: newDeviceMac,
        ip: newDeviceIp,
        status: 'offline'
      };
      
      // Check the status
      try {
        const isOnline = await mockCheckDeviceStatus(newDeviceIp);
        newDevice.status = isOnline ? 'online' : 'offline';
      } catch (error) {
        console.error('Error checking device status:', error);
      }
      
      // Add to devices array
      setDevices(prev => [...prev, newDevice]);
      closeAddModal();
      
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Add failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete a device
  const handleDeleteDevice = (id) => {
    if (!confirm('Delete this device?')) return;
    
    setDevices(prev => prev.filter(d => d.id !== id));
    
    if (activeDeviceId === id) setActiveDeviceId(null);
    if (selectedDevice?.id === id) {
      setSelectedDevice(null);
      setCurrentScreen('home');
    }
  };
  
  // Modal helpers
  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => {
    setShowAddModal(false);
    setErrorMessage('');
    setNewDeviceName('');
    setNewDeviceMac('');
    setNewDeviceIp('');
  };
  
  // Server setup helpers
  const handleSaveServerIp = (ip) => {
    setServerIp(ip);
  };
  
  // Status indicator component
  const StatusDot = ({ status }) => (
    <span
      className={`
        w-3 h-3 rounded-full transition-all duration-500 ease-in-out transform
        ${status === 'online' ? 'bg-green-400 scale-110' : 'bg-gray-400 scale-100'}
      `}
    />
  );
  
  // Action button component
  const ActionBtn = ({ icon, text, onClick }) => (
    <button
      className="bg-green-500 p-3 rounded flex items-center justify-center hover:bg-green-400 transition"
      onClick={e => { e.stopPropagation(); onClick(); }}
    >
      <span className="w-5 h-5 mr-2 text-black">{icon}</span>
      <span className="text-black font-bold">{text}</span>
    </button>
  );
  
  // Server setup component
  const ServerSetup = () => {
    const [inputIp, setInputIp] = useState(serverIp);
    const [isEditing, setIsEditing] = useState(!serverIp);
    
    const handleSave = () => {
      handleSaveServerIp(inputIp);
      setIsEditing(false);
    };
    
    const isValidIp = (ip) => {
      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
      return ipRegex.test(ip);
    };
    
    return (
      <div className="bg-purple-900 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-white">Companion Server</h2>
          <div className="flex items-center">
            {isConnected ? (
              <div className="flex items-center text-green-400">
                <span className="text-sm ml-1">Connected</span>
              </div>
            ) : (
              <div className="flex items-center text-red-400">
                <span className="text-sm ml-1">Disconnected</span>
              </div>
            )}
          </div>
        </div>
        
        {isEditing ? (
          <div className="flex items-center mb-2">
            <div className="flex-1">
              <div className="flex items-center">
                <span className="text-white mr-2">http://</span>
                <input
                  type="text"
                  value={inputIp}
                  onChange={(e) => setInputIp(e.target.value)}
                  placeholder="192.168.1.100"
                  className={`flex-1 bg-purple-800 text-white p-2 rounded-lg border ${
                    !isValidIp(inputIp) && inputIp ? 'border-red-500' : 'border-purple-700'
                  } focus:outline-none focus:border-purple-500`}
                />
                <span className="text-white ml-2">:7777</span>
              </div>
              {!isValidIp(inputIp) && inputIp && (
                <p className="text-red-400 text-xs mt-1">Please enter a valid IP address</p>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={!isValidIp(inputIp) || !inputIp}
              className={`ml-2 p-2 rounded-lg ${
                !isValidIp(inputIp) || !inputIp ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500'
              }`}
            >
              Save
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-300">
              http://{serverIp}:7777
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="text-purple-400 text-sm underline"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    );
  };
  
  // Home tab component
  const HomeTab = () => (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">WakeMATE</h1>
      <p className="text-gray-300 mb-8">Remote device control at your fingertips</p>

      {errorMessage && <div className="bg-red-500 text-white p-4 rounded mb-4">{errorMessage}</div>}

      <div className="mb-8">
        {devices.length === 0 ? (
          <div className="bg-purple-900 p-6 rounded text-center text-gray-300">
            No devices yet — add one below.
          </div>
        ) : (
          devices.map(device => (
            <div
              key={device.id}
              className={`bg-purple-900 p-4 mb-4 rounded relative cursor-pointer
                transition-all ${activeDeviceId === device.id ? 'border-2 border-green-500' : ''}`}
              onClick={() => setActiveDeviceId(activeDeviceId === device.id ? null : device.id)}
            >
              {/* delete mini‑button */}
              <button
                onClick={e => { e.stopPropagation(); handleDeleteDevice(device.id); }}
                className="absolute top-3 right-3 p-1 bg-red-500 rounded-full text-white"
              >
                <span className="flex items-center justify-center w-4 h-4">
                  <IconX />
                </span>
              </button>

              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-white">{device.name}</h2>
                <div className="flex items-center">
                  <span className="text-sm text-gray-300 mr-2">{device.status}</span>
                  <StatusDot status={device.status} />
                </div>
              </div>

              <p className="text-gray-300 text-sm">MAC: {device.mac}</p>
              <p className="text-gray-300 text-sm mb-4">IP: {device.ip}</p>

              {activeDeviceId === device.id && (
                <>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <ActionBtn icon={<IconPower />} text="Wake" onClick={() => sendWake(device)} />
                    <ActionBtn icon={<IconMoon />} text="Sleep" onClick={() => sendSleep(device)} />
                    <ActionBtn icon={<IconRefresh />} text="Restart" onClick={() => sendRestart(device)} />
                    <ActionBtn icon={<IconPower />} text="Shutdown" onClick={() => sendShutdown(device)} />
                  </div>

                  <button
                    className="w-full bg-green-500 p-3 rounded hover:bg-green-400 transition"
                    onClick={() => { setSelectedDevice(device); setCurrentScreen('deviceControl'); }}
                  >
                    Control Device
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <button
        onClick={openAddModal}
        className="w-full p-4 bg-purple-700 rounded flex justify-center items-center hover:bg-purple-600 transition"
      >
        <IconPlus />
        <span className="ml-2">Add Device</span>
      </button>
    </div>
  );
  
  // Settings tab component
  const SettingsTab = () => (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Companion Server</h2>
        <p className="text-gray-300 mb-4">
          Connect to the WakeMATE companion server to enable remote control features
        </p>
        
        <ServerSetup />
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">About</h2>
        <div className="bg-purple-900 p-4 rounded-lg">
          <p className="text-gray-300 mb-2">Version: 1.0.0</p>
          <p className="text-gray-300">
            WakeMATE allows you to control your devices remotely. Some features require
            the companion server to be installed on the target computer.
          </p>
        </div>
      </div>
    </div>
  );
  
  // Device control component
  const DeviceControl = () => {
    if (!selectedDevice) return null;
    
    return (
      <div className="p-6">
        <button
          className="mb-4 flex items-center text-white bg-purple-800 px-4 py-2 rounded"
          onClick={() => setCurrentScreen('home')}
        >
          <IconBack />
          <span className="ml-1">Back</span>
        </button>

        <h1 className="text-3xl font-bold text-white mb-2">{selectedDevice.name}</h1>
        <p className="text-gray-300 mb-6">
          {selectedDevice.status === 'online' ? 'Currently online' : 'Currently offline'}
        </p>

        {/* Simple mouse/keyboard control panel */}
        <div className="bg-purple-800 p-4 rounded-lg mb-4">
          <h3 className="text-white text-lg font-bold mb-4">Mouse Control</h3>
          
          {/* Touchpad area */}
          <div 
            className="bg-purple-700 h-64 rounded-lg flex items-center justify-center mb-4 cursor-pointer"
          >
            <p className="text-white text-center">
              <span className="block font-bold">Touchpad Area</span>
              <span className="text-sm text-gray-300">Click and drag to move cursor</span>
            </p>
          </div>
          
          {/* Click buttons */}
          <div className="flex justify-between mb-6">
            <button className="bg-purple-700 text-white px-4 py-3 rounded-lg w-[48%] flex items-center justify-center">
              <span>Left Click</span>
            </button>
            <button className="bg-purple-600 text-white px-4 py-3 rounded-lg w-[48%] flex items-center justify-center">
              <span>Right Click</span>
            </button>
          </div>
        </div>

        {/* Media controls */}
        <div className="bg-purple-800 p-4 rounded-lg">
          <h3 className="text-white text-lg font-bold mb-4">Media Controls</h3>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            <button className="bg-gray-200 text-black p-4 rounded-lg flex items-center justify-center">
              <span>Previous</span>
            </button>
            <button className="bg-gray-200 text-black p-4 rounded-lg flex items-center justify-center">
              <span>Play/Pause</span>
            </button>
            <button className="bg-gray-200 text-black p-4 rounded-lg flex items-center justify-center">
              <span>Next</span>
            </button>
            
            <button className="bg-gray-200 text-black p-4 rounded-lg flex items-center justify-center">
              <span>Mute</span>
            </button>
            <button className="bg-gray-200 text-black p-4 rounded-lg flex items-center justify-center">
              <span>Volume -</span>
            </button>
            <button className="bg-gray-200 text-black p-4 rounded-lg flex items-center justify-center">
              <span>Volume +</span>
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Main render
  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full" />
        </div>
      )}

      <div className="min-h-screen bg-gray-900">
        {/* Main content area */}
        {currentScreen === 'home' && (
          <div className="flex flex-col h-screen">
            <div className="flex-1 overflow-y-auto">
              {currentTab === 'home' && <HomeTab />}
              {currentTab === 'settings' && <SettingsTab />}
            </div>
            
            {/* Bottom tab navigation */}
            <div className="bg-purple-800 p-4 flex justify-around">
              <button
                className={`flex flex-col items-center ${currentTab === 'home' ? 'text-white' : 'text-gray-400'}`}
                onClick={() => setCurrentTab('home')}
              >
                <span className="w-6 h-6 mb-1"><IconHome /></span>
                <span className="text-xs">Home</span>
              </button>
              
              <button
                className={`flex flex-col items-center ${currentTab === 'settings' ? 'text-white' : 'text-gray-400'}`}
                onClick={() => setCurrentTab('settings')}
              >
                <span className="w-6 h-6 mb-1"><IconSettings /></span>
                <span className="text-xs">Settings</span>
              </button>
            </div>
          </div>
        )}
        
        {currentScreen === 'deviceControl' && <DeviceControl />}

        {/* Add‑device modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded w-80">
              <h2 className="text-2xl font-bold text-white mb-4">Add Device</h2>

              {errorMessage && <div className="bg-red-500 text-white p-2 rounded mb-3 text-sm">{errorMessage}</div>}

              <input className="w-full mb-3 p-2 rounded bg-gray-700 text-white" placeholder="Name"
                value={newDeviceName} onChange={e => setNewDeviceName(e.target.value)} />
              <input className="w-full mb-3 p-2 rounded bg-gray-700 text-white" placeholder="MAC (00:11:22:33:44:55)"
                value={newDeviceMac} onChange={e => setNewDeviceMac(e.target.value)} />
              <input className="w-full mb-4 p-2 rounded bg-gray-700 text-white" placeholder="IP (192.168.x.x)"
                value={newDeviceIp} onChange={e => setNewDeviceIp(e.target.value)} />

              <div className="flex justify-between">
                <button className="bg-green-500 text-black px-4 py-2 rounded" onClick={handleAddDevice}>Add</button>
                <button className="bg-red-500 text-black px-4 py-2 rounded" onClick={closeAddModal}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;