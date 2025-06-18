import ContactInfo from '@/app/ui/results/contact';
import Picture from '@/app/ui/results/picture';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import Ballots from '@/app/ui/results/ballots';
import { lexend } from '@/app/ui/fonts';
import { Suspense } from 'react';
import CardWrapper from '@/app/ui/dashboard/cards';
import { ContactSkeleton, BallotsSkeleton, PictureSkeleton, CardsSkeleton } from '@/app/ui/skeletons';
import { Metadata } from 'next';
import { fetchPostalCode, fetchMP } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Results',
};

const Page = async (props: { params: Promise<{ postal: string }> }) => {

   const params = await props.params;
   const postal = params.postal;

   // const [valA, valB] = await Promise.all([
   //     fetchMP(postal)
   // ]);

   const data = await fetchPostalCode(postal)

   if (!data) { notFound() }

   return (
    <main>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-10">
        <Suspense fallback={<PictureSkeleton />}>
          <Picture photoURL={data.photoURL} />
        </Suspense>
        <Suspense fallback={<BallotsSkeleton />}>
          <Ballots data={data} />
        </Suspense>
        <Suspense fallback={<ContactSkeleton />}>
          <ContactInfo data={data} />
        </Suspense>
      </div>
    </main>
  );
}
export default Page;