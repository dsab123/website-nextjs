import Image from 'next/image';

export default function PaperCup() {
  return <>
    <Image
      priority
      src="/paper-cup.svg"
      height={60}
      width={60}
      alt="Building a website"
    />
  </>;
}