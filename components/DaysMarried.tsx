import { useMemo } from 'react';
import CountUp from 'react-countup';

export default function DaysMarried() {
  const days = useMemo(
    () => Math.floor(((Date.now()) - new Date('2020-08-01').getTime()) / (1000*60*60*24)),
    []
  );

  return (
    <CountUp
      end={days}
      duration={2}
      enableScrollSpy
      scrollSpyOnce
    >
      {({ countUpRef }) => <span ref={countUpRef} />}
    </CountUp>
  );
}