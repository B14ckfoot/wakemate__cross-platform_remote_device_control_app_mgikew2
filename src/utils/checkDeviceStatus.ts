export async function checkDeviceStatus(ip: string, port: number = 7777): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
  
      const response = await fetch(`http://${ip}:${port}/status`, {
        method: 'GET',
        signal: controller.signal,
      });
  
      clearTimeout(timeoutId);
  
      if (response.ok) {
        const data = await response.json();
        return data.status === "online";
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
  