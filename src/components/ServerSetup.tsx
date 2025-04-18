import React, { useState } from 'react';
import { useServer } from '../context/ServerContext';
import { Wifi, WifiOff, Check, AlertCircle } from 'lucide-react';

const ServerSetup: React.FC = () => {
  const { serverIp, setServerIp, isConnected, connectionError, testConnection } = useServer();
  const [inputIp, setInputIp] = useState(serverIp);
  const [isEditing, setIsEditing] = useState(!serverIp);
  
  const handleSave = async () => {
    setServerIp(inputIp);
    setIsEditing(false);
    await testConnection();
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
                className="flex-1 bg-purple-800 text-white p-2 rounded-lg border border-purple-700 focus:outline-none focus:border-purple-500"
              />
              <span className="text-white ml-2">:7777</span>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="ml-2 bg-green-500 p-2 rounded-lg"
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
          onClick={testConnection}
          className="w-full mt-2 bg-purple-700 text-white p-2 rounded-lg"
        >
          Test Connection
        </button>
      )}
    </div>
  );
};

export default ServerSetup;
