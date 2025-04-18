import React, { useState } from 'react';
import { PlusCircle, Power, Moon, RefreshCw, PowerOff, Mouse, Keyboard, Music, X, Lock, Coffee, Clock, MessageSquare, ChevronLeft, ChevronRight, Volume, Volume2, VolumeX, Maximize, PlaySquare } from 'lucide-react';

// Mock devices data
const initialDevices = [
  { id: '1', name: 'My PC', mac: '00:11:22:33:44:55', ip: '192.168.1.10', status: 'offline' },
  { id: '2', name: 'MacBook Pro', mac: 'AA:BB:CC:DD:EE:FF', ip: '192.168.1.11', status: 'online' }
];

function App() {
  const [devices, setDevices] = useState(initialDevices);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [keyboardTab, setKeyboardTab] = useState('main');
  const [activeDeviceId, setActiveDeviceId] = useState(null);
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceMac, setNewDeviceMac] = useState('');
  const [newDeviceIp, setNewDeviceIp] = useState('');

  const openAddDeviceModal = () => setShowAddDeviceModal(true);
  const closeAddDeviceModal = () => {
    setShowAddDeviceModal(false);
    setNewDeviceName('');
    setNewDeviceMac('');
    setNewDeviceIp('');
  };

  const handleAddDevice = () => {
    if (!newDeviceName || !newDeviceMac || !newDeviceIp) {
      alert('Please fill all fields.');
      return;
    }
    const newDevice = {
      id: Date.now().toString(),
      name: newDeviceName,
      mac: newDeviceMac,
      ip: newDeviceIp,
      status: 'offline'
    };
    setDevices(prev => [...prev, newDevice]);
    closeAddDeviceModal();
  };

  const handleDeleteDevice = (deviceId) => {
    if (confirm('Are you sure you want to delete this device?')) {
      setDevices(prev => prev.filter(device => device.id !== deviceId));
      if (activeDeviceId === deviceId) setActiveDeviceId(null);
    }
  };

  const sendWakeOnLanPacket = (device) => {
    console.log(`Sending WoL packet to ${device.name} (${device.mac})`);
    alert(`Wake command sent to ${device.name}`);
  };

  const sendPowerCommand = (device, command) => {
    console.log(`Sending ${command} command to ${device.name} (${device.ip})`);
    alert(`${command} command sent to ${device.name}`);
  };

  const navigateTo = (screen, device = null) => {
    setCurrentScreen(screen);
    setShowKeyboard(false);
    setKeyboardTab('main');
    if (device) setSelectedDevice(device);
  };

  const toggleActiveDevice = (deviceId) => {
    if (activeDeviceId === deviceId) {
      setActiveDeviceId(null);
    } else {
      setActiveDeviceId(deviceId);
      const device = devices.find(d => d.id === deviceId);
      if (device) setSelectedDevice(device);
    }
  };

  const handleMouseMovement = (deltaX, deltaY) => {
    if (selectedDevice) {
      console.log(`Mouse move: ${deltaX}, ${deltaY} on ${selectedDevice.name}`);
    }
  };

  const handleLeftClick = () => {
    if (selectedDevice) console.log(`Left click on ${selectedDevice.name}`);
  };

  const handleRightClick = () => {
    if (selectedDevice) console.log(`Right click on ${selectedDevice.name}`);
  };

  const handleKeyPress = (key) => {
    if (selectedDevice) console.log(`Key press: ${key} on ${selectedDevice.name}`);
  };

  const handleMediaCommand = (command) => {
    if (selectedDevice) console.log(`Media command: ${command} on ${selectedDevice.name}`);
  };

  const toggleKeyboard = () => setShowKeyboard(!showKeyboard);
  const switchKeyboardTab = (tab) => setKeyboardTab(tab);

  const mainKeyboard = [['1','2','3','4','5','6','7','8','9','0'],['q','w','e','r','t','y','u','i','o','p'],['a','s','d','f','g','h','j','k','l'],['z','x','c','v','b','n','m',',','.']];
  const specialKeyboard = [['!','@','#','$','%','^','&','*','(',')'],['-','_','=','+','[',']','{','}','\\','|'],['/','?',';',':','\'','"','<','>','~','`'],['€','£','¥','©','®','™','°','•','§','¶']];

  const renderScreen = () => {
    // [ OMITTED for brevity, same renderScreen as your last one ]
    // It includes the home screen, device control, mouse control, keyboard control, and media control.
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {renderScreen()}

      {/* Add Device Modal */}
      {showAddDeviceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-80">
            <h2 className="text-2xl font-bold text-white mb-4">Add Device</h2>
            <input type="text" placeholder="Device Name" className="w-full mb-3 p-2 rounded bg-gray-700 text-white" value={newDeviceName} onChange={(e) => setNewDeviceName(e.target.value)} />
            <input type="text" placeholder="MAC Address" className="w-full mb-3 p-2 rounded bg-gray-700 text-white" value={newDeviceMac} onChange={(e) => setNewDeviceMac(e.target.value)} />
            <input type="text" placeholder="IP Address" className="w-full mb-4 p-2 rounded bg-gray-700 text-white" value={newDeviceIp} onChange={(e) => setNewDeviceIp(e.target.value)} />
            <div className="flex justify-between">
              <button className="bg-green-500 text-black px-4 py-2 rounded" onClick={handleAddDevice}>Add</button>
              <button className="bg-red-500 text-black px-4 py-2 rounded" onClick={closeAddDeviceModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
