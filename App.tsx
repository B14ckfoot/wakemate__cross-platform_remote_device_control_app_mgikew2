import React, { useState, useEffect } from 'react';
import { PlusCircle, Power, Moon, RefreshCw, PowerOff, Mouse, Keyboard, Music, X, Lock, Coffee, Clock, MessageSquare, ChevronLeft, ChevronRight, Volume, Volume2, VolumeX, Maximize, PlaySquare } from 'lucide-react';
import { ServerProvider } from './context/ServerContext';
import ServerSetup from './components/ServerSetup';
import deviceService from './services/deviceService';

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
  const [keyboardTab, setKeyboardTab] = useState('main'); // 'main' or 'special'
  const [activeDeviceId, setActiveDeviceId] = useState(null);
  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const [newDevice, setNewDevice] = useState({ name: '', mac: '', ip: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch devices from server
  const fetchDevices = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const fetchedDevices = await deviceService.getDevices();
      if (fetchedDevices && fetchedDevices.length > 0) {
        setDevices(fetchedDevices);
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
      setErrorMessage('Failed to fetch devices from server');
    } finally {
      setIsLoading(false);
    }
  };

  const sendWakeOnLanPacket = async (device) => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const success = await deviceService.sendWakeOnLan(device.id, device.mac);
      if (success) {
        alert(`Wake command sent to ${device.name}`);
      } else {
        alert(`Failed to send wake command to ${device.name}`);
      }
    } catch (error) {
      console.error(`Error sending WoL packet:`, error);
      alert(`Error: ${error.message || 'Failed to send wake command'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const sendPowerCommand = async (device, command) => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const success = await deviceService.sendPowerCommand(device.id, device.ip, command);
      if (success) {
        alert(`${command} command sent to ${device.name}`);
      } else {
        alert(`Failed to send ${command} command to ${device.name}`);
      }
    } catch (error) {
      console.error(`Error sending power command:`, error);
      alert(`Error: ${error.message || 'Failed to send command'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle keyboard control
  const sendKeyboardCommand = async (key) => {
    if (!selectedDevice) return;
    
    try {
      setIsLoading(true);
      setErrorMessage('');
      const success = await deviceService.sendKeyboardCommand(selectedDevice.id, selectedDevice.ip, key);
      if (!success) {
        console.error(`Failed to send keyboard command: ${key}`);
      }
    } catch (error) {
      console.error(`Error sending keyboard command:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle mouse control
  const sendMouseCommand = async (command, data = {}) => {
    if (!selectedDevice) return;
    
    try {
      setIsLoading(true);
      setErrorMessage('');
      const success = await deviceService.sendMouseCommand(selectedDevice.id, selectedDevice.ip, command, data);
      if (!success) {
        console.error(`Failed to send mouse command: ${command}`);
      }
    } catch (error) {
      console.error(`Error sending mouse command:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle media control
  const sendMediaCommand = async (command) => {
    if (!selectedDevice) return;
    
    try {
      setIsLoading(true);
      setErrorMessage('');
      const success = await deviceService.sendMediaCommand(selectedDevice.id, selectedDevice.ip, command);
      if (!success) {
        console.error(`Failed to send media command: ${command}`);
      }
    } catch (error) {
      console.error(`Error sending media command:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle volume control
  const sendVolumeCommand = async (command) => {
    if (!selectedDevice) return;
    
    try {
      setIsLoading(true);
      setErrorMessage('');
      const success = await deviceService.sendVolumeCommand(selectedDevice.id, selectedDevice.ip, command);
      if (!success) {
        console.error(`Failed to send volume command: ${command}`);
      }
    } catch (error) {
      console.error(`Error sending volume command:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add new device
  const handleAddDevice = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      // Validate input
      if (!newDevice.name || !newDevice.mac || !newDevice.ip) {
        setErrorMessage('All fields are required');
        return;
      }
      
      const success = await deviceService.addDevice(newDevice);
      if (success) {
        setDevices([...devices, {...newDevice, id: Date.now().toString(), status: 'offline'}]);
        setNewDevice({ name: '', mac: '', ip: '' });
        setIsAddingDevice(false);
      } else {
        setErrorMessage('Failed to add device');
      }
    } catch (error) {
      console.error('Error adding device:', error);
      setErrorMessage(error.message || 'Failed to add device');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove device
  const handleRemoveDevice = async (deviceId) => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const success = await deviceService.removeDevice(deviceId);
      if (success) {
        setDevices(devices.filter(device => device.id !== deviceId));
        if (selectedDevice && selectedDevice.id === deviceId) {
          setSelectedDevice(null);
          setCurrentScreen('home');
        }
      } else {
        setErrorMessage('Failed to remove device');
      }
    } catch (error) {
      console.error('Error removing device:', error);
      setErrorMessage(error.message || 'Failed to remove device');
    } finally {
      setIsLoading(false);
    }
  };

  // Load devices on component mount
  useEffect(() => {
    fetchDevices();
    // Set up polling for device status every 30 seconds
    const intervalId = setInterval(fetchDevices, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // Select a device and navigate to control screen
  const handleSelectDevice = (device) => {
    setSelectedDevice(device);
    setCurrentScreen('control');
    setActiveDeviceId(device.id);
  };

  // Navigation
  const navigateToHome = () => {
    setCurrentScreen('home');
    setSelectedDevice(null);
    setShowKeyboard(false);
  };

  const navigateToSettings = () => {
    setCurrentScreen('settings');
  };

  // Render keyboard controls
  const renderKeyboard = () => {
    // Main keyboard keys
    const mainKeys = [
      ['ESC', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
      ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'BACKSPACE'],
      ['TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
      ['CAPS', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'ENTER'],
      ['SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'SHIFT'],
      ['CTRL', 'WIN', 'ALT', 'SPACE', 'ALT', 'FN', 'MENU', 'CTRL']
    ];

    // Special keys
    const specialKeys = [
      ['PRINT', 'SCROLL', 'PAUSE'],
      ['INSERT', 'HOME', 'PAGE UP'],
      ['DELETE', 'END', 'PAGE DOWN'],
      ['', '↑', ''],
      ['←', '↓', '→']
    ];

    return (
      <div className="keyboard-container">
        <div className="keyboard-tabs">
          <button 
            className={keyboardTab === 'main' ? 'active' : ''} 
            onClick={() => setKeyboardTab('main')}
          >
            Main Keys
          </button>
          <button 
            className={keyboardTab === 'special' ? 'active' : ''} 
            onClick={() => setKeyboardTab('special')}
          >
            Special Keys
          </button>
          <button onClick={() => setShowKeyboard(false)} className="close-btn">
            <X size={16} />
          </button>
        </div>
        <div className="keyboard-keys">
          {keyboardTab === 'main' ? (
            mainKeys.map((row, rowIndex) => (
              <div key={`row-${rowIndex}`} className="key-row">
                {row.map((key) => (
                  <button
                    key={key}
                    className={`key ${key === 'SPACE' ? 'space-key' : ''} ${key === 'BACKSPACE' || key === 'ENTER' || key === 'SHIFT' || key === 'CTRL' ? 'wide-key' : ''}`}
                    onClick={() => sendKeyboardCommand(key)}
                  >
                    {key}
                  </button>
                ))}
              </div>
            ))
          ) : (
            specialKeys.map((row, rowIndex) => (
              <div key={`special-row-${rowIndex}`} className="key-row">
                {row.map((key, keyIndex) => (
                  <button
                    key={`special-${keyIndex}`}
                    className={`key ${!key ? 'empty-key' : ''}`}
                    onClick={() => key && sendKeyboardCommand(key)}
                    disabled={!key}
                  >
                    {key}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // Render mouse controls
  const renderMouseControls = () => {
    return (
      <div className="mouse-controls">
        <div className="mouse-pad" 
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            sendMouseCommand('move', { x, y });
          }}
          onClick={() => sendMouseCommand('leftClick')}
          onContextMenu={(e) => {
            e.preventDefault();
            sendMouseCommand('rightClick');
          }}
        >
          <div className="mouse-indicator">
            <Mouse size={24} />
          </div>
        </div>
        <div className="mouse-buttons">
          <button onClick={() => sendMouseCommand('leftClick')}>Left Click</button>
          <button onClick={() => sendMouseCommand('rightClick')}>Right Click</button>
          <button onClick={() => sendMouseCommand('doubleClick')}>Double Click</button>
          <button onClick={() => sendMouseCommand('scrollUp')}>Scroll Up</button>
          <button onClick={() => sendMouseCommand('scrollDown')}>Scroll Down</button>
        </div>
      </div>
    );
  };

  // Render media controls
  const renderMediaControls = () => {
    return (
      <div className="media-controls">
        <div className="control-row">
          <button onClick={() => sendMediaCommand('previous')}>
            <ChevronLeft size={24} />
          </button>
          <button onClick={() => sendMediaCommand('play')}>
            <PlaySquare size={24} />
          </button>
          <button onClick={() => sendMediaCommand('next')}>
            <ChevronRight size={24} />
          </button>
        </div>
        <div className="control-row">
          <button onClick={() => sendVolumeCommand('mute')}>
            <VolumeX size={24} />
          </button>
          <button onClick={() => sendVolumeCommand('down')}>
            <Volume size={24} />
          </button>
          <button onClick={() => sendVolumeCommand('up')}>
            <Volume2 size={24} />
          </button>
        </div>
        <div className="control-row">
          <button onClick={() => sendMediaCommand('fullscreen')}>
            <Maximize size={24} />
          </button>
        </div>
      </div>
    );
  };

  // Render device card
  const renderDeviceCard = (device) => {
    const isActive = device.id === activeDeviceId;
    
    return (
      <div 
        key={device.id}
        className={`device-card ${isActive ? 'active' : ''} ${device.status === 'online' ? 'online' : 'offline'}`}
        onClick={() => handleSelectDevice(device)}
      >
        <div className="device-info">
          <h3>{device.name}</h3>
          <p>{device.ip}</p>
          <p className="mac">{device.mac}</p>
          <span className={`status-indicator ${device.status}`}></span>
        </div>
        <div className="device-actions">
          {device.status === 'offline' ? (
            <button 
              className="wake-btn"
              onClick={(e) => {
                e.stopPropagation();
                sendWakeOnLanPacket(device);
              }}
            >
              <Power size={16} />
              Wake Up
            </button>
          ) : (
            <>
              <button 
                className="sleep-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  sendPowerCommand(device, 'sleep');
                }}
              >
                <Moon size={16} />
                Sleep
              </button>
              <button 
                className="shutdown-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  sendPowerCommand(device, 'shutdown');
                }}
              >
                <PowerOff size={16} />
                Shutdown
              </button>
              <button 
                className="reboot-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  sendPowerCommand(device, 'reboot');
                }}
              >
                <RefreshCw size={16} />
                Reboot
              </button>
            </>
          )}
          <button 
            className="remove-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Are you sure you want to remove ${device.name}?`)) {
                handleRemoveDevice(device.id);
              }
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  };

  // Render add device form
  const renderAddDeviceForm = () => {
    return (
      <div className="add-device-form">
        <h2>Add New Device</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="form-group">
          <label>Device Name</label>
          <input 
            type="text" 
            value={newDevice.name}
            onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
            placeholder="e.g. Home PC"
          />
        </div>
        <div className="form-group">
          <label>MAC Address</label>
          <input 
            type="text" 
            value={newDevice.mac}
            onChange={(e) => setNewDevice({...newDevice, mac: e.target.value})}
            placeholder="e.g. 00:11:22:33:44:55"
          />
        </div>
        <div className="form-group">
          <label>IP Address</label>
          <input 
            type="text" 
            value={newDevice.ip}
            onChange={(e) => setNewDevice({...newDevice, ip: e.target.value})}
            placeholder="e.g. 192.168.1.10"
          />
        </div>
        <div className="form-actions">
          <button 
            className="cancel-btn"
            onClick={() => {
              setIsAddingDevice(false);
              setNewDevice({ name: '', mac: '', ip: '' });
              setErrorMessage('');
            }}
          >
            Cancel
          </button>
          <button 
            className="save-btn"
            onClick={handleAddDevice}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Device'}
          </button>
        </div>
      </div>
    );
  };

  // Render home screen
  const renderHomeScreen = () => {
    return (
      <div className="home-screen">
        <div className="header">
          <h1>My Devices</h1>
          <button 
            className="refresh-btn"
            onClick={fetchDevices}
            disabled={isLoading}
          >
            <RefreshCw size={16} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button 
            className="add-btn"
            onClick={() => setIsAddingDevice(true)}
          >
            <PlusCircle size={16} />
            Add Device
          </button>
        </div>
        
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        
        {isAddingDevice ? (
          renderAddDeviceForm()
        ) : (
          <div className="devices-list">
            {devices.length === 0 ? (
              <div className="no-devices">
                <p>No devices found. Add a device to get started.</p>
              </div>
            ) : (
              devices.map(device => renderDeviceCard(device))
            )}
          </div>
        )}
      </div>
    );
  };

  // Render control screen
  const renderControlScreen = () => {
    if (!selectedDevice) return null;
    
    return (
      <div className="control-screen">
        <div className="header">
          <button className="back-btn" onClick={navigateToHome}>
            <ChevronLeft size={16} />
            Back
          </button>
          <h1>{selectedDevice.name}</h1>
          <span className={`status-badge ${selectedDevice.status}`}>
            {selectedDevice.status}
          </span>
        </div>
        
        {selectedDevice.status === 'online' ? (
          <div className="control-panels">
            <div className="power-controls panel">
              <h2>Power Controls</h2>
              <div className="buttons-row">
                <button onClick={() => sendPowerCommand(selectedDevice, 'sleep')}>
                  <Moon size={24} />
                  Sleep
                </button>
                <button onClick={() => sendPowerCommand(selectedDevice, 'shutdown')}>
                  <PowerOff size={24} />
                  Shutdown
                </button>
                <button onClick={() => sendPowerCommand(selectedDevice, 'reboot')}>
                  <RefreshCw size={24} />
                  Reboot
                </button>
                <button onClick={() => sendPowerCommand(selectedDevice, 'lock')}>
                  <Lock size={24} />
                  Lock
                </button>
              </div>
            </div>
            
            <div className="input-controls panel">
              <h2>Input Controls</h2>
              <div className="buttons-row">
                <button 
                  className={showKeyboard ? 'active' : ''}
                  onClick={() => setShowKeyboard(!showKeyboard)}
                >
                  <Keyboard size={24} />
                  Keyboard
                </button>
                <button onClick={() => setCurrentScreen('mouse')}>
                  <Mouse size={24} />
                  Mouse
                </button>
              </div>
              {showKeyboard && renderKeyboard()}
            </div>
            
            <div className="media-panel panel">
              <h2>Media Controls</h2>
              {renderMediaControls()}
            </div>
            
            <div className="quick-actions panel">
              <h2>Quick Actions</h2>
              <div className="buttons-row">
                <button onClick={() => sendKeyboardCommand('WIN+D')}>
                  <Maximize size={24} />
                  Show Desktop
                </button>
                <button onClick={() => sendKeyboardCommand('ALT+TAB')}>
                  <PlaySquare size={24} />
                  Alt+Tab
                </button>
                <button onClick={() => sendKeyboardCommand('WIN+L')}>
                  <Lock size={24} />
                  Lock Screen
                </button>
                <button onClick={() => sendKeyboardCommand('CTRL+ALT+DELETE')}>
                  <Power size={24} />
                  Ctrl+Alt+Del
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="offline-message">
            <p>This device is currently offline.</p>
            <button 
              className="wake-btn"
              onClick={() => sendWakeOnLanPacket(selectedDevice)}
            >
              <Power size={16} />
              Wake Up
            </button>
          </div>
        )}
      </div>
    );
  };

  // Render mouse control screen
  const renderMouseScreen = () => {
    if (!selectedDevice) return null;
    
    return (
      <div className="mouse-screen">
        <div className="header">
          <button className="back-btn" onClick={() => setCurrentScreen('control')}>
            <ChevronLeft size={16} />
            Back
          </button>
          <h1>Mouse Control - {selectedDevice.name}</h1>
        </div>
        {renderMouseControls()}
      </div>
    );
  };

  // Render settings screen
  const renderSettingsScreen = () => {
    return (
      <div className="settings-screen">
        <div className="header">
          <button className="back-btn" onClick={navigateToHome}>
            <ChevronLeft size={16} />
            Back
          </button>
          <h1>Settings</h1>
        </div>
        
        <div className="settings-content">
          <div className="server-settings panel">
            <h2>Server Configuration</h2>
            <ServerSetup />
          </div>
          
          <div className="about-panel panel">
            <h2>About</h2>
            <p>Remote Control App v1.0.0</p>
            <p>Control your devices from anywhere</p>
          </div>
        </div>
      </div>
    );
  };

  // Main render function
  return (
    <ServerProvider>
      <div className="app-container">
        {isLoading && <div className="loading-overlay"><div className="spinner"></div></div>}
        
        {currentScreen === 'home' && renderHomeScreen()}
        {currentScreen === 'control' && renderControlScreen()}
        {currentScreen === 'mouse' && renderMouseScreen()}
        {currentScreen === 'settings' && renderSettingsScreen()}
        
        <div className="footer">
          <button 
            className={currentScreen === 'home' ? 'active' : ''}
            onClick={navigateToHome}
          >
            Home
          </button>
          <button
            className={currentScreen === 'settings' ? 'active' : ''}
            onClick={navigateToSettings}
          >
            Settings
          </button>
        </div>
      </div>
    </ServerProvider>
  );
}

export default App;