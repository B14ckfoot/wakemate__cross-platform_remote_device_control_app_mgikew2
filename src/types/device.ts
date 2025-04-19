// Define common device types to be used across the application

export interface Device {
    id: string;
    name: string;
    mac: string;
    ip: string;
    status: 'online' | 'offline';
    type: 'wifi' | 'bluetooth';
  }
  
  export interface DeviceAction {
    type: 'wake' | 'sleep' | 'restart' | 'shutdown';
    deviceId: string;
  }
  
  export interface ControlCommand {
    type: 'mouse' | 'keyboard' | 'media';
    command: string;
    params?: Record<string, any>;
    deviceId: string;
  }
  
  export interface DeviceListResponse {
    devices: Device[];
    success: boolean;
    error?: string;
  }
  
  export interface DeviceActionResponse {
    success: boolean;
    message?: string;
    error?: string;
  }