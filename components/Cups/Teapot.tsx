import Image from 'next/image';

export default function Teapot() {
  return <>
    <Image
      priority
      src="/teapot.svg"
      height={70}
      width={70}
      alt="Building a website"
    />
  </>
}