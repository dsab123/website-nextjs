import Image from 'next/image';

export default function Book() {
  return <>
    <Image
      priority
      src="/book.svg"
      height={300}
      width={300}
      alt="Quite a page turner"
    />
  </>;
}