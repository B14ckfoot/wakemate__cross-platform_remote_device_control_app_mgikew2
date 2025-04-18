import React, { useState, useEffect } from 'react';
import {
  PlusCircle, Power, Moon, RefreshCw, PowerOff, X, ChevronLeft,
} from 'lucide-react';

import { ServerProvider } from './context/ServerContext';
import ServerSetup          from './components/ServerSetup';
import MouseKeyboardControls from './components/MouseKeyboardControls';
import deviceService         from './services/deviceService';

// ✅ relative import (no "@/")
import { checkDeviceStatus } from './utils/checkDeviceStatus';

function App() {
  /* ------------------------------------------------------------------ */
  /* state                                                              */
  /* ------------------------------------------------------------------ */
  const [devices,        setDevices]        = useState([]);
  const [currentScreen,  setCurrentScreen]  = useState<'home' | 'deviceControl'>('home');
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [activeDeviceId, setActiveDeviceId] = useState<string | null>(null);

  const [isLoading,      setIsLoading]      = useState(false);
  const [errorMessage,   setErrorMessage]   = useState('');

  /* “Add device” modal */
  const [showAddModal,   setShowAddModal]   = useState(false);
  const [newDeviceName,  setNewDeviceName]  = useState('');
  const [newDeviceMac,   setNewDeviceMac]   = useState('');
  const [newDeviceIp,    setNewDeviceIp]    = useState('');

  /* ------------------------------------------------------------------ */
  /* helpers                                                            */
  /* ------------------------------------------------------------------ */

  /** Pull list from server, then live‑probe each device */
  const fetchDevices = async () => {
    try {
      setIsLoading(true); setErrorMessage('');
      const res = await deviceService.getDevices();
      if (res?.data?.devices) {
        const enriched = await Promise.all(
          res.data.devices.map(async (d:any) => ({
            ...d,
            status: (await checkDeviceStatus(d.ip)) ? 'online' : 'offline',
          })),
        );
        setDevices(enriched);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to fetch devices from server');
    } finally { setIsLoading(false); }
  };

  /* initial load + 15 s polling */
  useEffect(() => {
    const savedIp = localStorage.getItem('serverIp');
    if (!savedIp) return;
    deviceService.setServerAddress(savedIp);
    fetchDevices();
    const id = setInterval(fetchDevices, 15_000);
    return () => clearInterval(id);
  }, []);

  /* ------------------------------------------------------------------ */
  /* actions                                                            */
  /* ------------------------------------------------------------------ */

  const sendWake        = (d:any) => deviceAction(d, 'wake',        5_000);
  const sendSleep       = (d:any) => deviceAction(d, 'sleep',       5_000);
  const sendRestart     = (d:any) => deviceAction(d, 'restart',     0);
  const sendShutdown    = (d:any) => deviceAction(d, 'shutdown',    5_000);

  async function deviceAction(device:any, command:string, refreshDelay:number) {
    try {
      setIsLoading(true); setErrorMessage('');
      const ok = command === 'wake'
        ? await deviceService.sendWakeOnLan(device.id, device.mac)
        : await deviceService.sendPowerCommand(device.id, device.ip, command);
      alert(ok ? `${command} command sent to ${device.name}` : `Failed to send ${command}`);
      if (refreshDelay) setTimeout(fetchDevices, refreshDelay);
    } catch (err:any) {
      console.error(err); alert(err.message ?? 'Action failed');
    } finally { setIsLoading(false); }
  }

  /* add device */
  const handleAddDevice = async () => {
    if (!newDeviceName || !newDeviceMac || !newDeviceIp) {
      alert('Please fill all fields'); return;
    }
    try {
      setIsLoading(true);
      const payload = { name:newDeviceName, mac:newDeviceMac, ip:newDeviceIp };
      const ok = await deviceService.addDevice(payload);
      if (ok) {
        const online = await checkDeviceStatus(payload.ip);
        setDevices(prev => [...prev, {
          ...payload, id: Date.now().toString(), status: online ? 'online' : 'offline',
        }]);
        closeAddModal();
      } else setErrorMessage('Server rejected device');
    } catch (err:any) {
      console.error(err); setErrorMessage(err.message ?? 'Add failed');
    } finally { setIsLoading(false); }
  };

  /* delete */
  const handleDeleteDevice = async (id:string) => {
    if (!confirm('Delete this device?')) return;
    try {
      setIsLoading(true);
      if (await deviceService.removeDevice(id)) {
        setDevices(prev => prev.filter(d => d.id !== id));
        if (activeDeviceId === id) setActiveDeviceId(null);
        if (selectedDevice?.id === id) { setSelectedDevice(null); setCurrentScreen('home'); }
      } else setErrorMessage('Delete failed');
    } catch (err:any) {
      console.error(err); setErrorMessage(err.message ?? 'Delete failed');
    } finally { setIsLoading(false); }
  };

  /* UI helpers */
  const openAddModal  = () => setShowAddModal(true);
  const closeAddModal = () => {
    setShowAddModal(false); setErrorMessage('');
    setNewDeviceName(''); setNewDeviceMac(''); setNewDeviceIp('');
  };

  /* ------------------------------------------------------------------ */
  /*  RENDER‑TREE                                                       */
  /* ------------------------------------------------------------------ */

  /* status‑dot — now animated (fade & scale) */
  const StatusDot = ({ status }:{status:'online'|'offline'}) => (
    <span
      className={`
        w-3 h-3 rounded-full transition-all duration-500 ease-in-out transform
        ${status === 'online' ? 'bg-green-400 scale-110' : 'bg-gray-400 scale-100'}
      `}
    />
  );

  /* Home ------------------------------------------------------------- */
  const Home = () => (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-md mx-auto">
        <ServerSetup />

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
                  <X className="w-4 h-4" />
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
                      <ActionBtn icon={<Power  />}   text="Wake"     onClick={() => sendWake(device)} />
                      <ActionBtn icon={<Moon   />}   text="Sleep"    onClick={() => sendSleep(device)} />
                      <ActionBtn icon={<RefreshCw/>} text="Restart"  onClick={() => sendRestart(device)} />
                      <ActionBtn icon={<PowerOff/>}  text="Shutdown" onClick={() => sendShutdown(device)} />
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
          <PlusCircle className="w-5 h-5 mr-2 text-white" />
          Add Device
        </button>
      </div>
    </div>
  );

  /* generic “action” button used above */
  const ActionBtn = ({ icon, text, onClick }:{icon:JSX.Element,text:string,onClick:()=>void}) => (
    <button
      className="bg-green-500 p-3 rounded flex items-center justify-center hover:bg-green-400 transition"
      onClick={e => { e.stopPropagation(); onClick(); }}
    >
      {React.cloneElement(icon, { className:'w-5 h-5 mr-2 text-black' })}
      <span className="text-black font-bold">{text}</span>
    </button>
  );

  /* Device‑control ---------------------------------------------------- */
  const DeviceControl = () => selectedDevice && (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-md mx-auto">
        <button
          className="mb-4 flex items-center text-white bg-purple-800 px-4 py-2 rounded"
          onClick={() => setCurrentScreen('home')}
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </button>

        <h1 className="text-3xl font-bold text-white mb-2">{selectedDevice.name}</h1>
        <p className="text-gray-300 mb-6">
          {selectedDevice.status === 'online' ? 'Currently online' : 'Currently offline'}
        </p>

        <MouseKeyboardControls
          deviceId={selectedDevice.id}
          deviceIp={selectedDevice.ip}
          onBack={() => setCurrentScreen('home')}
        />
      </div>
    </div>
  );

  /* ------------------------------------------------------------------ */
  /* RENDER                                                             */
  /* ------------------------------------------------------------------ */
  return (
    <ServerProvider>
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full" />
        </div>
      )}

      {currentScreen === 'home'          && <Home />}
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
              <button className="bg-red-500 text-black px-4 py-2 rounded"  onClick={closeAddModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </ServerProvider>
  );
}

export default App;
