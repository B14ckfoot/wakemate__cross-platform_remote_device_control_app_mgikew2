import axios from 'axios';

// This service handles all communication with the companion server

interface DeviceCommand {
  deviceId: string;
  command: string;
  mac?: string;
  ip?: string;
  params?: Record<string, any>;
}

class DeviceService {
  private baseUrl: string | null = null;
  
  // Set the companion server IP address
  setServerAddress(ipAddress: string): void {
    this.baseUrl = `http://${ipAddress}:7777`;
    console.log(`Server address set to: ${this.baseUrl}`);
  }
  
  // Get the current server address
  getServerAddress(): string | null {
    return this.baseUrl;
  }
  
  // Send a wake-on-lan packet
  async sendWakeOnLan(deviceId: string, macAddress: string): Promise<boolean> {
    if (!this.baseUrl) {
      throw new Error('Server address not set. Call setServerAddress first.');
    }
    
    try {
      const response = await axios.post(`${this.baseUrl}/wake`, {
        deviceId,
        mac: macAddress
      });
      
      console.log('Wake-on-LAN response:', response.data);
      return response.data.success || false;
    } catch (error) {
      console.error('Error sending Wake-on-LAN packet:', error);
      throw error;
    }
  }
  
  // Send a power command (sleep, restart, shutdown)
  async sendPowerCommand(deviceId: string, ipAddress: string, command: string): Promise<boolean> {
    if (!this.baseUrl) {
      throw new Error('Server address not set. Call setServerAddress first.');
    }
    
    try {
      const response = await axios.post(`${this.baseUrl}/power`, {
        deviceId,
        ip: ipAddress,
        command
      });
      
      console.log(`Power command (${command}) response:`, response.data);
      return response.data.success || false;
    } catch (error) {
      console.error(`Error sending power command (${command}):`, error);
      throw error;
    }
  }
  
  // Send a mouse movement command
  async sendMouseMovement(deviceId: string, ipAddress: string, deltaX: number, deltaY: number): Promise<boolean> {
    if (!this.baseUrl) {
      throw new Error('Server address not set. Call setServerAddress first.');
    }
    
    try {
      const response = await axios.post(`${this.baseUrl}/mouse/move`, {
        deviceId,
        ip: ipAddress,
        deltaX,
        deltaY
      });
      
      return response.data.success || false;
    } catch (error) {
      console.error('Error sending mouse movement:', error);
      throw error;
    }
  }
  
  // Send a mouse click command
  async sendMouseClick(deviceId: string, ipAddress: string, button: 'left' | 'right'): Promise<boolean> {
    if (!this.baseUrl) {
      throw new Error('Server address not set. Call setServerAddress first.');
    }
    
    try {
      const response = await axios.post(`${this.baseUrl}/mouse/click`, {
        deviceId,
        ip: ipAddress,
        button
      });
      
      return response.data.success || false;
    } catch (error) {
      console.error(`Error sending mouse ${button} click:`, error);
      throw error;
    }
  }
  
  // Send a keyboard key press
  async sendKeyPress(deviceId: string, ipAddress: string, key: string): Promise<boolean> {
    if (!this.baseUrl) {
      throw new Error('Server address not set. Call setServerAddress first.');
    }
    
    try {
      const response = await axios.post(`${this.baseUrl}/keyboard/press`, {
        deviceId,
        ip: ipAddress,
        key
      });
      
      return response.data.success || false;
    } catch (error) {
      console.error(`Error sending key press (${key}):`, error);
      throw error;
    }
  }
  
  // Send a media control command
  async sendMediaCommand(deviceId: string, ipAddress: string, command: string): Promise<boolean> {
    if (!this.baseUrl) {
      throw new Error('Server address not set. Call setServerAddress first.');
    }
    
    try {
      const response = await axios.post(`${this.baseUrl}/media`, {
        deviceId,
        ip: ipAddress,
        command
      });
      
      return response.data.success || false;
    } catch (error) {
      console.error(`Error sending media command (${command}):`, error);
      throw error;
    }
  }
  
  // Get all devices from the server
  async getDevices(): Promise<any[]> {
    if (!this.baseUrl) {
      throw new Error('Server address not set. Call setServerAddress first.');
    }
    
    try {
      const response = await axios.get(`${this.baseUrl}/devices`);
      return response.data.devices || [];
    } catch (error) {
      console.error('Error fetching devices:', error);
      throw error;
    }
  }
  
  // Add a new device to the server
  async addDevice(name: string, macAddress: string, ipAddress: string): Promise<any> {
    if (!this.baseUrl) {
      throw new Error('Server address not set. Call setServerAddress first.');
    }
    
    try {
      const response = await axios.post(`${this.baseUrl}/devices`, {
        name,
        mac: macAddress,
        ip: ipAddress
      });
      
      return response.data;
    } catch (error) {
      console.error('Error adding device:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const deviceService = new DeviceService();
export default deviceService;
