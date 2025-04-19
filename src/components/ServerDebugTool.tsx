import React, { useState } from 'react';
import { Terminal, Send, Check, XCircle } from 'lucide-react';

interface ServerDebugToolProps {
  serverIp: string;
}

const ServerDebugTool: React.FC<ServerDebugToolProps> = ({ serverIp }) => {
  const [command, setCommand] = useState<string>('get_status');
  const [params, setParams] = useState<string>('{}');
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSendCommand = async () => {
    if (!serverIp) {
      setError('Server IP not set');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Parse params JSON (or use empty object if invalid)
      let parsedParams = {};
      try {
        parsedParams = JSON.parse(params);
      } catch (e) {
        setError('Invalid JSON params, using empty object');
      }
      
      // Prepare the request
      const payload = {
        command,
        params: parsedParams
      };
      
      // Log the request details
      console.log('Debug request:', {
        url: `http://${serverIp}:7777`,
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      // Send the request
      const response = await fetch(`http://${serverIp}:7777`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      // Parse response
      const data = await response.json();
      setResponse({
        status: response.status,
        body: data
      });
    } catch (err) {
      console.error('Debug request failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <div className="flex items-center mb-4">
        <Terminal className="text-purple-400 w-5 h-5 mr-2" />
        <h2 className="text-white font-bold">Server Debug Tool</h2>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-300 text-sm mb-1">Command:</label>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="w-full bg-gray-800 text-white p-2 rounded"
          placeholder="get_status"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-300 text-sm mb-1">Params (JSON):</label>
        <textarea
          value={params}
          onChange={(e) => setParams(e.target.value)}
          className="w-full bg-gray-800 text-white p-2 rounded font-mono text-sm h-24"
          placeholder="{}"
        />
      </div>
      
      <button
        onClick={handleSendCommand}
        disabled={isLoading || !serverIp}
        className={`flex items-center justify-center w-full py-2 rounded-lg mb-4 ${
          isLoading || !serverIp 
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
            : 'bg-purple-600 text-white hover:bg-purple-500'
        }`}
      >
        {isLoading ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Send Command
          </>
        )}
      </button>
      
      {error && (
        <div className="bg-red-900 bg-opacity-30 p-3 rounded mb-4 text-red-400 text-sm flex items-start">
          <XCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      
      {response && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-bold text-sm">Response:</h3>
            <span className={`text-xs px-2 py-1 rounded ${
              response.status >= 200 && response.status < 300 
                ? 'bg-green-900 text-green-400' 
                : 'bg-red-900 text-red-400'
            }`}>
              Status: {response.status}
            </span>
          </div>
          
          <div className="bg-gray-800 p-3 rounded font-mono text-sm text-white overflow-auto max-h-60">
            <pre>{JSON.stringify(response.body, null, 2)}</pre>
          </div>
        </div>
      )}
      
      <div className="mt-6 text-gray-400 text-xs border-t border-gray-800 pt-4">
        <h4 className="font-bold mb-2">Common Commands:</h4>
        <ul className="space-y-2">
          <li className="p-2 bg-gray-800 rounded">
            <div className="font-bold flex items-center">
              <Check className="w-3 h-3 text-green-400 mr-1" />
              get_status
            </div>
            <div className="text-gray-500 mt-1">Returns server status information</div>
          </li>
          <li className="p-2 bg-gray-800 rounded">
            <div className="font-bold">mouse_move</div>
            <div className="text-gray-500 mt-1">Params: {"{ \"deltaX\": 10, \"deltaY\": 10 }"}</div>
          </li>
          <li className="p-2 bg-gray-800 rounded">
            <div className="font-bold">key_press</div>
            <div className="text-gray-500 mt-1">Params: {"{ \"key\": \"space\" }"}</div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ServerDebugTool;