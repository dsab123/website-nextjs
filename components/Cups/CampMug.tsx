import Image from 'next/image';

export default function CampMug() {
  return <>
    <Image
      priority
      src="/camp-mug.svg"
      height={70}
      width={70}
      alt="Building a website"
    />
  </>
}