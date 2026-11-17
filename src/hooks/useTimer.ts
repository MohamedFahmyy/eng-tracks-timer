import { useState, useEffect, useRef, useCallback } from 'react';
import { TimerState } from '../types';
import { playTimerFinishSound } from '../services/sound';

interface UseTimerProps {
  initialDurationSeconds?: number;
  soundAlert?: boolean;
  soundProfile?: 'melodic' | 'bell' | 'digital' | 'chime';
  soundVolume?: number;
  onFinish?: () => void;
}

const STORAGE_KEY = 'eng_tracks_active_timer_v1';

export function useTimer({
  initialDurationSeconds = 15 * 60, // 15 mins default
  soundAlert = true,
  soundProfile = 'melodic',
  soundVolume = 0.8,
  onFinish
}: UseTimerProps = {}) {
  // Initialize timer state from storage if active, else default
  const [timerState, setTimerState] = useState<TimerState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.isRunning && parsed.targetEndTime) {
          const now = Date.now();
          if (parsed.targetEndTime > now) {
            const rem = Math.ceil((parsed.targetEndTime - now) / 1000);
            return {
              ...parsed,
              remainingSeconds: rem,
              isCompleted: false,
              overtimeSeconds: 0
            };
          } else {
            const overtime = Math.floor((now - parsed.targetEndTime) / 1000);
            return {
              ...parsed,
              remainingSeconds: 0,
              isCompleted: true,
              overtimeSeconds: overtime
            };
          }
        }
        return parsed;
      }
    } catch {
      // fallback
    }

    return {
      initialSeconds: initialDurationSeconds,
      remainingSeconds: initialDurationSeconds,
      isRunning: false,
      isPaused: false,
      isCompleted: false,
      overtimeSeconds: 0,
      startTime: null,
      targetEndTime: null,
    };
  });

  const soundPlayedRef = useRef(false);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;
  const [resetCount, setResetCount] = useState(0);

  // Persist timer state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(timerState));
    } catch {
      // ignore
    }
  }, [timerState]);

  // Main tick loop with drift-free timestamp calculation
  useEffect(() => {
    if (!timerState.isRunning || timerState.isPaused) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const now = Date.now();
      const target = timerState.targetEndTime;

      if (!target) return;

      if (now < target) {
        const remaining = Math.ceil((target - now) / 1000);
        setTimerState(prev => ({
          ...prev,
          remainingSeconds: remaining,
          isCompleted: false,
          overtimeSeconds: 0
        }));
      } else {
        const overtime = Math.floor((now - target) / 1000);
        setTimerState(prev => {
          if (!prev.isCompleted) {
            if (soundAlert && !soundPlayedRef.current) {
              playTimerFinishSound(soundProfile, soundVolume);
              soundPlayedRef.current = true;
            }
            if (onFinishRef.current) {
              onFinishRef.current();
            }
          }
          return {
            ...prev,
            remainingSeconds: 0,
            isCompleted: true,
            overtimeSeconds: overtime
          };
        });
      }
    }, 200); // 200ms tick for high responsiveness and smooth UI

    return () => clearInterval(intervalId);
  }, [timerState.isRunning, timerState.isPaused, timerState.targetEndTime, soundAlert, soundProfile, soundVolume]);

  // Handle VisibilityChange and Window Focus for instant resync when switching back to tab
  useEffect(() => {
    const handleSync = () => {
      if (timerState.isRunning && !timerState.isPaused && timerState.targetEndTime) {
        const now = Date.now();
        if (now < timerState.targetEndTime) {
          const remaining = Math.ceil((timerState.targetEndTime - now) / 1000);
          setTimerState(prev => ({
            ...prev,
            remainingSeconds: remaining,
            isCompleted: false
          }));
        } else {
          const overtime = Math.floor((now - timerState.targetEndTime) / 1000);
          setTimerState(prev => ({
            ...prev,
            remainingSeconds: 0,
            isCompleted: true,
            overtimeSeconds: overtime
          }));
        }
      }
    };

    document.addEventListener('visibilitychange', handleSync);
    window.addEventListener('focus', handleSync);

    return () => {
      document.removeEventListener('visibilitychange', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, [timerState.isRunning, timerState.isPaused, timerState.targetEndTime]);

  // Start timer
  const startTimer = useCallback((durationInSeconds?: number) => {
    soundPlayedRef.current = false;
    const duration = durationInSeconds !== undefined ? durationInSeconds : timerState.remainingSeconds;
    const now = Date.now();
    const target = now + duration * 1000;

    setTimerState({
      initialSeconds: duration,
      remainingSeconds: duration,
      isRunning: true,
      isPaused: false,
      isCompleted: false,
      overtimeSeconds: 0,
      startTime: now,
      targetEndTime: target,
    });
  }, [timerState.remainingSeconds]);

  // Pause timer
  const pauseTimer = useCallback(() => {
    if (!timerState.isRunning || timerState.isPaused) return;

    const now = Date.now();
    let currentRemaining = timerState.remainingSeconds;
    if (timerState.targetEndTime) {
      currentRemaining = Math.max(0, Math.ceil((timerState.targetEndTime - now) / 1000));
    }

    setTimerState(prev => ({
      ...prev,
      remainingSeconds: currentRemaining,
      isRunning: true,
      isPaused: true,
      targetEndTime: null,
    }));
  }, [timerState.isRunning, timerState.isPaused, timerState.targetEndTime, timerState.remainingSeconds]);

  // Resume timer
  const resumeTimer = useCallback(() => {
    if (!timerState.isRunning || !timerState.isPaused) return;

    const now = Date.now();
    const target = now + timerState.remainingSeconds * 1000;

    setTimerState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      targetEndTime: target,
    }));
  }, [timerState.isRunning, timerState.isPaused, timerState.remainingSeconds]);

  // Reset timer
  const resetTimer = useCallback((newDuration?: number) => {
    soundPlayedRef.current = false;
    setResetCount(c => c + 1);
    const duration = newDuration !== undefined ? newDuration : timerState.initialSeconds;

    setTimerState({
      initialSeconds: duration,
      remainingSeconds: duration,
      isRunning: false,
      isPaused: false,
      isCompleted: false,
      overtimeSeconds: 0,
      startTime: null,
      targetEndTime: null,
    });
  }, [timerState.initialSeconds]);

  // Set new duration
  const setDuration = useCallback((seconds: number, autoStart = false) => {
    soundPlayedRef.current = false;
    setResetCount(c => c + 1);
    const now = Date.now();
    const target = autoStart ? now + seconds * 1000 : null;

    setTimerState({
      initialSeconds: seconds,
      remainingSeconds: seconds,
      isRunning: autoStart,
      isPaused: false,
      isCompleted: false,
      overtimeSeconds: 0,
      startTime: autoStart ? now : null,
      targetEndTime: target,
    });
  }, []);

  // Quick adjust +/- seconds (e.g. +60s, +300s, -60s)
  const adjustTime = useCallback((deltaSeconds: number) => {
    setTimerState(prev => {
      const newRemaining = Math.max(0, prev.remainingSeconds + deltaSeconds);
      const newInitial = Math.max(newRemaining, prev.initialSeconds + (deltaSeconds > 0 ? deltaSeconds : 0));
      const now = Date.now();
      const newTarget = prev.isRunning && !prev.isPaused ? now + newRemaining * 1000 : null;

      return {
        ...prev,
        initialSeconds: newInitial,
        remainingSeconds: newRemaining,
        targetEndTime: newTarget,
        isCompleted: newRemaining === 0 && prev.isRunning,
      };
    });
  }, []);

  return {
    timerState,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    setDuration,
    adjustTime,
    resetCount,
  };
}
