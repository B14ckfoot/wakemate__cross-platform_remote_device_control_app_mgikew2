import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { useServer } from '../context/ServerContext';
import { runDiagnostics } from '../utils/serverStatusChecker';

interface ServerMonitorProps {
  onDiagnosticsComplete?: (success: boolean) => void;
}

const ServerMonitor: React.FC<ServerMonitorProps> = ({ onDiagnosticsComplete }) => {
  const { serverIp, isConnected, connectionError, testConnection } = useServer();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);
  
  // When the component mounts, check the connection
  useEffect(() => {
    if (serverIp) {
      testConnection();
    }
  }, []);
  
  const handleRunDiagnostics = async () => {
    if (!serverIp) return;
    
    setIsTesting(true);
    setDiagnosticResults(null);
    
    try {
      const results = await runDiagnostics(serverIp);
      setDiagnosticResults(results);
      
      if (onDiagnosticsComplete) {
        onDiagnosticsComplete(results.overall);
      }
    } catch (error) {
      console.error('Diagnostics failed:', error);
      setDiagnosticResults({
        overall: false,
        steps: [{
          name: 'Diagnostics',
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error',
        }]
      });
      
      if (onDiagnosticsComplete) {
        onDiagnosticsComplete(false);
      }
    } finally {
      setIsTesting(false);
    }
  };
  
  const handleRefresh = async () => {
    setIsTesting(true);
    try {
      await testConnection();
    } finally {
      setIsTesting(false);
    }
  };
  
  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-white">Companion Server</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white text-xs underline"
        >
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center">
          {isConnected ? (
            <div className="flex items-center text-green-400">
              <Wifi className="w-4 h-4 mr-1" />
              <span className="text-sm">Connected to {serverIp}</span>
            </div>
          ) : (
            <div className="flex items-center text-red-400">
              <WifiOff className="w-4 h-4 mr-1" />
              <span className="text-sm">
                {serverIp ? `Disconnected from ${serverIp}` : 'Server not configured'}
              </span>
            </div>
          )}
        </div>
        
        <button 
          onClick={handleRefresh}
          disabled={isTesting || !serverIp}
          className={`flex items-center text-sm p-2 rounded-lg ${
            isTesting || !serverIp
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-purple-700 text-white hover:bg-purple-600'
          }`}
        >
          {isTesting ? (
            <>
              <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full mr-1"></div>
              Testing...
            </>
          ) : (
            <>
              <RefreshCw className="w-3 h-3 mr-1" />
              Refresh
            </>
          )}
        </button>
      </div>
      
      {connectionError && (
        <div className="flex items-center text-red-400 text-sm mt-2 bg-red-900 bg-opacity-20 p-2 rounded">
          <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
          <span>{connectionError}</span>
        </div>
      )}
      
      {isExpanded && (
        <div className="mt-4 border-t border-gray-700 pt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-bold text-sm">Diagnostics</h3>
            <button
              onClick={handleRunDiagnostics}
              disabled={isTesting || !serverIp}
              className={`text-xs p-1 rounded ${
                isTesting || !serverIp
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-700 text-white hover:bg-purple-600'
              }`}
            >
              Run Tests
            </button>
          </div>
          
          {diagnosticResults && (
            <div className="mt-2 text-sm">
              <div className={`p-2 rounded mb-2 ${
                diagnosticResults.overall ? 'bg-green-900 bg-opacity-20' : 'bg-red-900 bg-opacity-20'
              }`}>
                <div className="flex items-center">
                  {diagnosticResults.overall ? (
                    <Check className="w-4 h-4 text-green-400 mr-1" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400 mr-1" />
                  )}
                  <span className={diagnosticResults.overall ? 'text-green-400' : 'text-red-400'}>
                    {diagnosticResults.overall ? 'All tests passed' : 'Some tests failed'}
                  </span>
                </div>
              </div>
              
              {diagnosticResults.steps.map((step: any, index: number) => (
                <div key={index} className="mb-1 p-2 bg-gray-900 rounded">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {step.success ? (
                        <Check className="w-3 h-3 text-green-400 mr-1" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-red-400 mr-1" />
                      )}
                      <span className="text-white">{step.name}</span>
                    </div>
                    <span className={step.success ? 'text-green-400' : 'text-red-400'}>
                      {step.success ? 'Pass' : 'Fail'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">{step.message}</p>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4 text-xs text-gray-400">
            <p>
              If you're having connectivity issues:
            </p>
            <ul className="list-disc pl-4 mt-1 space-y-1">
              <li>Ensure the companion server is running on your computer</li>
              <li>Check that your phone and computer are on the same network</li>
              <li>Verify that port 7777 is not blocked by your firewall</li>
              <li>Try restarting the companion server application</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServerMonitor;