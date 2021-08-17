import * as React from "react";
import firebase from "../lib/firebase";
import { Retro, RetroChildRef } from "../types/retro";
import { RealtimeDatabaseRefs } from "../constants/realtime-database-refs";
import { useCurrentUser } from "./use-current-user";
import { AnalyticsEvent, useAnalyticsEvent } from "./use-analytics-event";

type CountdownTimerT = RetroChildRef["countdownTimer"];
type CountdownTimerUpdateFieldT = { key: keyof CountdownTimerT; value: any };
type PartialCountdownTimerT = Partial<CountdownTimerT>;

enum CountdownTimerState {
  CLOSED = "CLOSED",
  PAUSED = "PAUSED",
  COUNTING = "COUNTING"
}

export type RetroCountdownTimerT = {
  isTimerOpen: boolean | null;
  toggleTimer: () => Promise<void>;
  timeLeft: number;
  isPaused: boolean;
  start: () => void;
  pause: () => void;
  setTime: (milliseconds: number) => void;
  reset: () => void;
  add1Min: () => void;
};

export function useRetroCountdownTimer(retroId: Retro["id"]): RetroCountdownTimerT {
  const [countdownTimer, setCountdownTimer] = React.useState<CountdownTimerT | null>(
    null
  );
  const serverTimeOffset = useServerTimeOffset();
  const [timeLeft, setTimeLeft] = React.useState(0);
  const initialTime = 600_000;

  const currentUser = useCurrentUser();
  const track = useAnalyticsEvent();
  const handleTrack = (event: AnalyticsEvent, properties: object = {}) => {
    track(event, {
      retroId,
      userId: currentUser?.data?.id,
      ...properties
    });
    return;
  };

  React.useEffect(() => {
    const ref = getRetroRef(retroId);
    if (ref) {
      ref.on("value", (snapshot) => {
        const data = snapshot.val();
        setCountdownTimer(data.countdownTimer);
      });
      return () => ref.off();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retroId]);

  const handleUpdate = async (fields: CountdownTimerUpdateFieldT[]) => {
    const updates: PartialCountdownTimerT = fields.reduce((object: any, field) => {
      object[`countdownTimer/${field.key}`] = field.value;
      return object;
    }, {});
    await updateCountdownTimer(retroId, updates);
    return;
  };

  React.useEffect(() => {
    const initialzeTimer = () => {
      handleUpdate([
        { key: "milliseconds", value: initialTime },
        { key: "state", value: CountdownTimerState.CLOSED }
      ]);
    };
    initialzeTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let milliseconds = countdownTimer?.milliseconds;
  React.useEffect(() => {
    if (milliseconds) {
      setTimeLeft(milliseconds);
    }
  }, [milliseconds]);

  const _getServerTimestamp = () => {
    return firebase.database.ServerValue.TIMESTAMP;
  };

  const handleChangeTime = (milliseconds: number) => {
    handleUpdate([{ key: "milliseconds", value: milliseconds }]);
    handleTrack(AnalyticsEvent.RETRO_TIMER_UPDATED, { milliseconds });
    return;
  };

  const handleAdd1Min = () => {
    handleChangeTime((countdownTimer?.milliseconds || 0) + 60_000);
    handleTrack(AnalyticsEvent.RETRO_TIMER_ADD_1);
    return;
  };

  const handleResetTime = () => {
    handleChangeTime(initialTime);
    handleTrack(AnalyticsEvent.RETRO_TIMER_RESET);
    return;
  };

  const handleStartTimer = () => {
    handleUpdate([
      { key: "state", value: CountdownTimerState.COUNTING },
      { key: "startAt", value: _getServerTimestamp() }
    ]);
    handleTrack(AnalyticsEvent.RETRO_TIMER_STARTED);
    return;
  };

  const handlePauseTimer = () => {
    handleUpdate([
      { key: "state", value: CountdownTimerState.PAUSED },
      { key: "milliseconds", value: timeLeft > 0 ? timeLeft : 0 }
    ]);
    handleTrack(AnalyticsEvent.RETRO_TIMER_PAUSED, { timeLeft });
    return;
  };

  const intervalRef = useInterval(
    () => {
      const diff = Date.now() - countdownTimer?.startAt - serverTimeOffset;
      setTimeLeft((countdownTimer?.milliseconds || 0) - diff);
      if (timeLeft < 0) {
        window.clearInterval(intervalRef.current);
        handleChangeTime(0);
        handlePauseTimer();
      }
    },
    countdownTimer?.state === CountdownTimerState.COUNTING ? 100 : null
  );

  const isOpen = countdownTimer && countdownTimer.state !== CountdownTimerState.CLOSED;
  const handleToggleTimer = async () => {
    const nextState = isOpen ? CountdownTimerState.CLOSED : CountdownTimerState.PAUSED;
    await handleUpdate([{ key: "state", value: nextState }]);
    handleTrack(AnalyticsEvent.RETRO_TIMER_TOGGLED, { nextState });
    return;
  };

  return {
    isTimerOpen: isOpen,
    toggleTimer: handleToggleTimer,
    /**
     * The amount of time remaining in milliseconds.
     */
    timeLeft,
    isPaused: countdownTimer?.state === CountdownTimerState.PAUSED,
    start: handleStartTimer,
    pause: handlePauseTimer,
    setTime: handleChangeTime,
    reset: handleResetTime,
    add1Min: handleAdd1Min
  };
}

// Helpers
const _retroRef = firebase.database().ref(RealtimeDatabaseRefs.RETRO);
function getRetroRef(retroId: string) {
  return _retroRef.child(retroId);
}
function updateCountdownTimer(retroId: string, updates: PartialCountdownTimerT) {
  return _retroRef.child(retroId).update(updates);
}

/**
 * @returns The server time offset to use to calculate the difference
 * between the server's time and the local client's time.
 */
function useServerTimeOffset() {
  const [serverTimeOffset, setServerTimeOffset] = React.useState(0);

  React.useEffect(() => {
    const serverTimeOffsetRef = firebase.database().ref(".info/serverTimeOffset");
    serverTimeOffsetRef.on("value", (snapshot) => setServerTimeOffset(snapshot.val()));
    return () => serverTimeOffsetRef.off();
  }, []);

  return serverTimeOffset;
}

function useInterval(callback: () => void, delay: number | null) {
  const intervalRef = React.useRef<any>(null);
  const savedCallback = React.useRef(callback);

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    // Bail early if delay is null.
    if (delay === null) {
      return;
    }
    const tick = () => savedCallback.current();
    intervalRef.current = window.setInterval(tick, delay);
    return () => window.clearInterval(intervalRef.current);
  }, [delay]);

  return intervalRef;
}
