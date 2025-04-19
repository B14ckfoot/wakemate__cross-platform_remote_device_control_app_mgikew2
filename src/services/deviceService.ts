let serverIp: string | null = null;

export const deviceService = {
  setServerAddress(ip: string) {
    serverIp = ip;
  },

  async sendCommand(command: string, params: any = {}) {
    if (!serverIp) {
      throw new Error('Server IP not set!');
    }

    const url = `http://${serverIp}:7777`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command, params }),
    });

    if (!response.ok) {
      throw new Error('Command failed');
    }

    return await response.json();
  },

  async checkStatus() {
    if (!serverIp) {
      return false;
    }

    try {
      const response = await fetch(`http://${serverIp}:7777/status`);
      if (!response.ok) return false;
      const data = await response.json();
      return data.status === 'online';
    } catch {
      return false;
    }
  }
};
