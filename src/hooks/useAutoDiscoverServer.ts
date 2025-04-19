import { useState, useEffect } from 'react';

export function useAutoDiscoverServer() {
  const [serverIp, setServerIp] = useState<string | null>(null);
  const [searching, setSearching] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const scanNetwork = async () => {
    setSearching(true);
    setError(false);

    const baseIp = "192.168.1."; // 🔥 Customize if needed (dynamic later)
    const timeout = 1000; // 1 second timeout per IP

    for (let i = 2; i <= 254; i++) {
      const ip = baseIp + i;
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(`http://${ip}:7777/status`, { signal: controller.signal });
        clearTimeout(id);

        if (response.ok) {
          const data = await response.json();
          if (data.status === "online") {
            setServerIp(ip);
            localStorage.setItem('serverIp', ip);
            break;
          }
        }
      } catch (e) {
        // Ignore timeout errors
      }
    }

    if (!serverIp) {
      setError(true);
    }
    setSearching(false);
  };

  useEffect(() => {
    const storedIp = localStorage.getItem('serverIp');
    if (storedIp) {
      setServerIp(storedIp);
      setSearching(false);
    } else {
      scanNetwork();
    }
  }, []);

  const retry = () => {
    scanNetwork();
  };

  return { serverIp, searching, error, retry };
}
