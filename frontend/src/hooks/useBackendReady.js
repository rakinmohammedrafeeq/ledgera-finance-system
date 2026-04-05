import { useCallback, useEffect, useRef, useState } from 'react';
import { backendRootURL } from '../api/axios';

const HEALTH_TIMEOUT_MS = 4000;
const DEFAULT_RETRY_INTERVAL = 4000;
const FALLBACK_TIMEOUT_MS = 30000;

const getHealthUrl = () => {
  if (backendRootURL.startsWith('http')) {
    return `${backendRootURL.replace(/\/$/, '')}/health`;
  }
  return '/health';
};

async function checkHealth() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);

  try {
    const response = await fetch(getHealthUrl(), {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    });

    return response.ok;
  } catch (error) {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export default function useBackendReady() {
  const [showLoading, setShowLoading] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const pendingActionRef = useRef(null);
  const isCheckingRef = useRef(false);
  const retryTimeoutRef = useRef(null);
  const fallbackTimeoutRef = useRef(null);

  const clearTimers = () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current);
      fallbackTimeoutRef.current = null;
    }
  };

  const stopLoading = useCallback(() => {
    clearTimers();
    setShowLoading(false);
    setShowFallback(false);
  }, []);

  const pollUntilReady = useCallback(async () => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;

    const ready = await checkHealth();
    if (ready) {
      const action = pendingActionRef.current;
      pendingActionRef.current = null;
      stopLoading();
      isCheckingRef.current = false;
      if (action) {
        await action();
      }
      return;
    }

    if (!showLoading) {
      setShowLoading(true);
      fallbackTimeoutRef.current = setTimeout(() => setShowFallback(true), FALLBACK_TIMEOUT_MS);
    }

    isCheckingRef.current = false;
    retryTimeoutRef.current = setTimeout(() => {
      pollUntilReady();
    }, DEFAULT_RETRY_INTERVAL);
  }, [showLoading, stopLoading]);

  const runWithBackendReady = useCallback(
    async (action) => {
      pendingActionRef.current = action;

      const ready = await checkHealth();
      if (ready) {
        pendingActionRef.current = null;
        stopLoading();
        return action();
      }

      if (!showLoading) {
        setShowLoading(true);
        fallbackTimeoutRef.current = setTimeout(() => setShowFallback(true), FALLBACK_TIMEOUT_MS);
      }

      pollUntilReady();
    },
    [pollUntilReady, showLoading, stopLoading]
  );

  const prewarm = useCallback(async () => {
    await checkHealth();
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
      pendingActionRef.current = null;
    };
  }, []);

  return {
    showLoading,
    showFallback,
    runWithBackendReady,
    prewarm,
  };
}

