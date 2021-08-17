import * as React from "react";
import moment from "moment";
import { AddButton as SmallButton } from "./AddButton";
import { RetroCountdownTimerT } from "../hooks/use-retro-countdown-timer";

type RetroCountdownTimerPropsT = {
  timer: RetroCountdownTimerT;
};

export function RetroCountdownTimer({ timer }: RetroCountdownTimerPropsT) {
  const symbol = timer.isPaused ? <Play /> : <Pause />;
  const handleClick = timer.isPaused ? timer.start : timer.pause;

  const handleChangeTime = (milliseconds: number) => {
    timer.setTime(milliseconds);
    return;
  };

  return (
    <div className="h-12 p-4 bg-white border border-blue text-blue flex items-center justify-center text-xl">
      <TimerDisplayInput
        timeLeft={timer.timeLeft}
        isPaused={timer.isPaused}
        onChange={handleChangeTime}
      />
      <SmallButton
        style={{ boxShadow: "none", borderColor: "white" }}
        onClick={handleClick}
      >
        {symbol}
      </SmallButton>
      <SmallButton
        style={{ boxShadow: "none", borderColor: "white", fontSize: "0.75em" }}
        onClick={timer.add1Min}
      >
        +1m
      </SmallButton>
      {timer.isPaused ? (
        <SmallButton
          style={{ boxShadow: "none", borderColor: "white" }}
          onClick={timer.reset}
        >
          <Restart />
        </SmallButton>
      ) : null}
    </div>
  );
}

function TimerDisplayInput({
  isPaused,
  timeLeft,
  onChange
}: {
  isPaused: boolean;
  timeLeft: number;
  onChange: (milliseconds: number) => void;
}) {
  const formRef = React.useRef<any>(null);

  let duration = moment.duration(timeLeft, "milliseconds");
  let s = duration.seconds();
  let displayTimeLeft = `${duration.minutes()}:${s === 0 ? "00" : s}`;

  const [minutes, setMinutes] = React.useState("");
  const [seconds, setSeconds] = React.useState("");

  React.useEffect(() => {
    if (displayTimeLeft) {
      const [m, s] = displayTimeLeft.split(":");
      setMinutes(m);
      setSeconds(s);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isPaused]);

  const sanitize = (string: string) => {
    return string.replace(/[^\d]/, "");
  };

  const handleChangeMinutes = (event: any) => {
    const minutes = sanitize(event.target.value);
    if (parseInt(minutes) > 99) {
      return;
    }
    setMinutes(minutes);
    return;
  };

  const handleChangeSeconds = (event: any) => {
    const seconds = sanitize(event.target.value);
    if (parseInt(seconds) > 59) {
      return;
    }
    setSeconds(seconds);
    return;
  };

  const handleOnBlur = () => {
    const minutes = formRef.current.minutes.value;
    const seconds = formRef.current.seconds.value;

    const milliseconds = moment.duration({ minutes, seconds }).asMilliseconds();
    onChange(milliseconds);
    return;
  };

  return isPaused ? (
    <form className="flex" ref={(ref) => (formRef.current = ref)}>
      <input
        name="minutes"
        type="number"
        min="00"
        max="99"
        maxLength={2}
        step="1"
        className="border w-16 h-8 text-center bg-white text-blue border-red"
        value={minutes}
        onChange={handleChangeMinutes}
        onBlur={handleOnBlur}
      />
      <span>:</span>
      <input
        name="seconds"
        type="number"
        min="00"
        max="59"
        maxLength={2}
        className="border w-16 h-8 text-center bg-white text-blue border-red"
        value={seconds}
        onChange={handleChangeSeconds}
        onBlur={handleOnBlur}
      />
    </form>
  ) : (
    <div className="border w-32 h-8 text-center bg-blue text-white border-white">
      {displayTimeLeft}
    </div>
  );
}

const Play = () => <span>&#9658;</span>;
const Pause = () => <span>||</span>;
const Restart = () => <span>&#x21bb;</span>;
