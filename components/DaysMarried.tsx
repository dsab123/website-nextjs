import { useState } from 'react';
import CountUp from 'react-countup'
import VisibilitySensor from 'react-visibility-sensor';


export default function DaysMarried() {
  const [visible, setVisible] = useState(false);
  const days = Math.floor(((new Date()).getTime() - new Date('08-01-2020').getTime()) / (1000 * 60 * 60 * 24));

  return <>
    <CountUp end={days} useEasing={true}>
      {({ countUpRef, start }) => (
        <VisibilitySensor onChange={start} active={!visible}>
          <span ref={countUpRef} />
        </VisibilitySensor>
      )}
    </CountUp>
  </>
}

