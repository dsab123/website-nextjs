import Image from 'next/image';

export default function TeabagMug() {
  return <>
    <Image
      priority
      src="/teabag-mug.svg"
      height={60}
      width={60}
      alt="Building a website"
    />
  </>;
}