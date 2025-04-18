import React, { useState, useEffect } from 'react';
import { useServer } from '../context/ServerContext';
import { Wifi, WifiOff, Check, AlertCircle } from 'lucide-react';
import deviceService from '../services/deviceService';

const ServerSetup: React.FC = () => {
  const { serverIp, setServerIp, isConnected, connectionError, testConnection } = useServer();
  const [inputIp, setInputIp] = useState(serverIp);
  const [isEditing, setIsEditing] = useState(!serverIp);
  const [isTesting, setIsTesting] = useState(false);
  
  // Update input when serverIp changes
  useEffect(() => {
    setInputIp(serverIp);
  }, [serverIp]);
  
  const handleSave = async () => {
    try {
      // Set the server IP in the device service
      deviceService.setServerAddress(inputIp);
      setServerIp(inputIp);
      setIsEditing(false);
      
      // Test the connection
      setIsTesting(true);
      await testConnection();
      setIsTesting(false);
    } catch (error) {
      console.error('Error saving server address:', error);
      setIsTesting(false);
    }
  };
  
  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      await testConnection();
    } catch (error) {
      console.error('Connection test failed:', error);
    } finally {
      setIsTesting(false);
    }
  };
  
  const isValidIp = (ip: string) => {
    // Simple IP validation regex - could be improved
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
              <Wifi className="w-4 h-4 mr-1" />
              <span className="text-sm">Connected</span>
            </div>
          ) : (
            <div className="flex items-center text-red-400">
              <WifiOff className="w-4 h-4 mr-1" />
              <span className="text-sm">Disconnected</span>
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
            <Check className="w-5 h-5 text-black" />
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
      
      {connectionError && (
        <div className="flex items-center text-red-400 text-sm mt-2">
          <AlertCircle className="w-4 h-4 mr-1" />
          <span>{connectionError}</span>
        </div>
      )}
      
      {!isEditing && (
        <button
          onClick={handleTestConnection}
          disabled={isTesting}
          className="w-full mt-2 bg-purple-700 text-white p-2 rounded-lg transition-colors hover:bg-purple-600 flex justify-center items-center"
        >
          {isTesting ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Testing...
            </>
          ) : (
            'Test Connection'
          )}
        </button>
      )}
    </div>
  );
};

export default ServerSetup;