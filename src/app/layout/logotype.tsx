import Image from 'next/image';

export default function Logotype() {
  return (
    <div className="flex justify-center mt-5 mb-3">
      <Image
        priority={true}
        src="/images/logo.png"
        alt="logotype"
        width={60}
        height={60}
      />
    </div>
  )
}