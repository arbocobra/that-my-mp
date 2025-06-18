import { lexend } from '@/app/ui/fonts';
import Image from 'next/image';

const ThatMyMPLogo = () => {
  return (
    <div className={`${lexend.className} flex flex-row items-center leading-none text-white gap-4`} >
      <Image className="size-12 md:size-16" src='/Maple_Leaf.svg' alt='Maple Leaf' width={70} height={70} />
      <p className="text-[28px] md:text-[44px] italic">That My MP?</p>
    </div>
  );
}

export default ThatMyMPLogo;