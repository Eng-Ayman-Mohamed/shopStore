import { useState, useEffect, useRef } from "react";
import * as api from "../services/api";

export default function useBackendStatus({ intervalMs = 20000 } = {}) {
  const [isOnline, setIsOnline] = useState(true);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    async function check() {
      try {
        const res = await api.ping();
        if (!mounted.current) return;
        setIsOnline(Boolean(res && res.ok));
      } catch (e) {
        if (!mounted.current) return;
        setIsOnline(false);
      }
    }

    check();
    const id = setInterval(check, intervalMs);
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, [intervalMs]);

  return { isOnline };
}
