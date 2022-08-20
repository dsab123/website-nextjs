export default function DaysMarried() {

  const days = Math.floor(((new Date()).getTime() - new Date('08-01-2020').getTime()) / (1000 * 60 * 60 * 24));

  return <>
    <span>
      {days}
    </span>
  </>
}