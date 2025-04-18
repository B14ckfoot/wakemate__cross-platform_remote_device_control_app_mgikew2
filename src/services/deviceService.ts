import axios from 'axios';

// This service handles all communication with the companion server

interface DeviceCommand {
  command: string;
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
  
  // Send a generic command to the server - made public for ServerContext
  async sendCommand(command: DeviceCommand): Promise<any> {
    if (!this.baseUrl) {
      throw new Error('Server address not set. Call setServerAddress first.');
    }
    
    try {
      const response = await axios.post(this.baseUrl, command);
      console.log(`Command response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error sending command (${command.command}):`, error);
      throw error;
    }
  }
  
  // Send a wake-on-lan packet
  async sendWakeOnLan(deviceId: string, macAddress: string): Promise<boolean> {
    try {
      const response = await this.sendCommand({
        command: "wake",
        params: {
          deviceId,
          mac: macAddress
        }
      });
      
      return response.status === "success";
    } catch (error) {
      console.error('Error sending Wake-on-LAN packet:', error);
      throw error;
    }
  }
  
  // Send a power command (sleep, restart, shutdown)
  async sendPowerCommand(deviceId: string, ipAddress: string, command: string): Promise<boolean> {
    try {
      const response = await this.sendCommand({
        command,
        params: {
          deviceId,
          ip: ipAddress
        }
      });
      
      return response.status === "success";
    } catch (error) {
      console.error(`Error sending power command (${command}):`, error);
      throw error;
    }
  }
  
  // Send a mouse movement command
  async sendMouseCommand(deviceId: string, ipAddress: string, command: string, data?: any): Promise<boolean> {
    try {
      let cmdParams: any = {
        deviceId,
        ip: ipAddress,
        ...data
      };
      
      // Map command to the format the server expects
      let serverCommand = "";
      if (command === "move") {
        serverCommand = "mouse_move";
      } else if (command === "leftClick") {
        serverCommand = "mouse_click";
        cmdParams.button = "left";
      } else if (command === "rightClick") {
        serverCommand = "mouse_click";
        cmdParams.button = "right";
      } else if (command === "doubleClick") {
        serverCommand = "mouse_click";
        cmdParams.button = "left";
        cmdParams.double = true;
      } else if (command.startsWith("scroll")) {
        serverCommand = "mouse_scroll";
        cmdParams.direction = command === "scrollUp" ? "up" : "down";
      }
      
      const response = await this.sendCommand({
        command: serverCommand,
        params: cmdParams
      });
      
      return response.status === "success";
    } catch (error) {
      console.error(`Error sending mouse command (${command}):`, error);
      throw error;
    }
  }
  
  // Send a keyboard key press
  async sendKeyboardCommand(deviceId: string, ipAddress: string, key: string): Promise<boolean> {
    try {
      // Map special keys as needed
      let serverKey = key;
      
      const response = await this.sendCommand({
        command: "key_press",
        params: {
          deviceId,
          ip: ipAddress,
          key: serverKey
        }
      });
      
      return response.status === "success";
    } catch (error) {
      console.error(`Error sending key press (${key}):`, error);
      throw error;
    }
  }
  
  // Send a text input command
  async sendTextInput(deviceId: string, ipAddress: string, text: string): Promise<boolean> {
    try {
      const response = await this.sendCommand({
        command: "text_input",
        params: {
          deviceId,
          ip: ipAddress,
          text
        }
      });
      
      return response.status === "success";
    } catch (error) {
      console.error(`Error sending text input:`, error);
      throw error;
    }
  }
  
  // Send a media control command
  async sendMediaCommand(deviceId: string, ipAddress: string, command: string): Promise<boolean> {
    try {
      // Map commands to the format the server expects
      let serverCommand = "";
      if (command === "play" || command === "pause") {
        serverCommand = "media_play_pause";
      } else if (command === "next") {
        serverCommand = "media_next";
      } else if (command === "previous") {
        serverCommand = "media_prev";
      } else if (command === "fullscreen") {
        // Handle this with keyboard shortcuts
        return this.sendKeyboardCommand(deviceId, ipAddress, "f");
      }
      
      const response = await this.sendCommand({
        command: serverCommand,
        params: {
          deviceId,
          ip: ipAddress
        }
      });
      
      return response.status === "success";
    } catch (error) {
      console.error(`Error sending media command (${command}):`, error);
      throw error;
    }
  }
  
  // Send a volume control command
  async sendVolumeCommand(deviceId: string, ipAddress: string, command: string): Promise<boolean> {
    try {
      // Map commands to the format the server expects
      let serverCommand = "";
      if (command === "up") {
        serverCommand = "volume_up";
      } else if (command === "down") {
        serverCommand = "volume_down";
      } else if (command === "mute") {
        serverCommand = "volume_mute";
      }
      
      const response = await this.sendCommand({
        command: serverCommand,
        params: {
          deviceId,
          ip: ipAddress
        }
      });
      
      return response.status === "success";
    } catch (error) {
      console.error(`Error sending volume command (${command}):`, error);
      throw error;
    }
  }
  
  // Get all devices from the server
  async getDevices(): Promise<any[]> {
    try {
      const response = await this.sendCommand({
        command: "get_devices",
        params: {}
      });
      
      return response.data?.devices || [];
    } catch (error) {
      console.error('Error fetching devices:', error);
      throw error;
    }
  }
  
  // Add a new device to the server
  async addDevice(device: any): Promise<any> {
    try {
      const response = await this.sendCommand({
        command: "add_device",
        params: {
          name: device.name,
          mac: device.mac,
          ip: device.ip
        }
      });
      
      return response.status === "success";
    } catch (error) {
      console.error('Error adding device:', error);
      throw error;
    }
  }
  
  // Remove a device from the server
  async removeDevice(deviceId: string): Promise<boolean> {
    try {
      const response = await this.sendCommand({
        command: "remove_device",
        params: {
          deviceId
        }
      });
      
      return response.status === "success";
    } catch (error) {
      console.error('Error removing device:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const deviceService = new DeviceService();
export default deviceService;