"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  startCall as startCallApi,
  endCall as endCallApi,
} from "@/services/crmService";

export function useCalling({
  contactId,
  onCallEnded,
  onCallFailed,
} = {}) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callState, setCallState] = useState("ready");
  const [durationSeconds, setDurationSeconds] = useState(0);

  const callIdRef = useRef(null);
  const intervalRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  const dial = useCallback((digit) => {
    setPhoneNumber((prev) => prev + digit);
  }, []);

  const backspace = useCallback(() => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  }, []);

  const setNumber = useCallback((value) => {
    setPhoneNumber(value);
  }, []);

  const startCall = useCallback(async () => {
    if (!phoneNumber) return;

    if (callState === "calling" || callState === "connected") return;

    setCallState("calling");
    setDurationSeconds(0);

    try {
      if (contactId) {
        const response = await startCallApi(contactId, phoneNumber);
        callIdRef.current = response.callId;
      }

      // Simulated connection delay
      setTimeout(() => {
        setCallState("connected");

        intervalRef.current = setInterval(() => {
          setDurationSeconds((prev) => prev + 1);
        }, 1000);
      }, 900);
    } catch (error) {
      console.error(error);

      clearTimer();
      setCallState("failed");

      if (onCallFailed) {
        onCallFailed();
      }
    }
  }, [
    phoneNumber,
    callState,
    contactId,
    onCallFailed,
    clearTimer,
  ]);

  const endCall = useCallback(async () => {
    if (callState !== "calling" && callState !== "connected") return;

    clearTimer();

    setCallState("ended");

    const finalDuration = durationSeconds;

    try {
      if (callIdRef.current) {
        await endCallApi(callIdRef.current, finalDuration);
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (onCallEnded) {
        onCallEnded(finalDuration);
      }
    }
  }, [
    callState,
    durationSeconds,
    clearTimer,
    onCallEnded,
  ]);

  const resetAfterFailure = useCallback(() => {
    clearTimer();
    setPhoneNumber("");
    setDurationSeconds(0);
    setCallState("ready");
    callIdRef.current = null;
  }, [clearTimer]);

  const resetForNextContact = useCallback(() => {
    clearTimer();
    setPhoneNumber("");
    setDurationSeconds(0);
    setCallState("ready");
    callIdRef.current = null;
  }, [clearTimer]);

  return {
    phoneNumber,
    callState,
    durationSeconds,

    dial,
    backspace,
    setNumber,

    startCall,
    endCall,

    resetAfterFailure,
    resetForNextContact,
  };
}