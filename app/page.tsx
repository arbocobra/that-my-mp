import AcmeLogo from '@/app/ui/acme-logo';
import ThatMyMPLogo from '@/app/ui/that-my-mp-logo';
import PostalForm from '@/app/ui/postal-form';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import styles from '@/app/ui/home.module.css';
import { lusitana, lexend } from '@/app/ui/fonts';
import Image from 'next/image';

const Page = () => {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-red-500 p-4 md:h-36">
        <ThatMyMPLogo />
      </div>

      <div className="mt-4 flex grow flex-col gap-4 justify-center md:flex-row">
        <div className="flex items-center justify-center p-6 w-full md:px-28 md:py-12">
          <PostalForm/>
        </div>
      </div>
    </main>
  );
}

export default Page;