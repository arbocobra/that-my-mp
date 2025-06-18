// // @ts-nocheck

'use client';



import { lexend } from '@/app/ui/fonts';
import { AtSymbolIcon, KeyIcon, ExclamationCircleIcon, MapPinIcon } from '@heroicons/react/24/outline';
// import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useActionState, useEffect, useState } from 'react';
import { redirect, useRouter, usePathname } from 'next/navigation'
import Link from 'next/link';
import { useDebouncedCallback } from 'use-debounce';
import styles from '@/app/ui/home.module.css';

// import { submitPostalCode } from '@/app/lib/actions';
// // import { useSearchParams } from 'next/navigation';

// const PostalForm = () => {
// {/* <div>
// <label htmlFor="postal_code" className="block mb-2 text-sm md:text-base font-medium text-gray-900">Enter Your Postal Code</label>
// <input type="text" id="postal_code" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm md:text-base rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5" placeholder="A0A0A0" required />
// <button type="submit" className="mt-4 text-white bg-red-500 border-4 border-red-500 hover:bg-white hover:text-red-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm md:text-base w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
// </div> */}
//   const callbackUrl = '/results'
//   const [errorMessage, formAction, isPending] = useActionState(submitPostalCode, undefined);

 /*} return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8 md:px-24 md:pb-20 md:pt-24">
        <h1 className={`${lexend.className} mb-4 text-2xl`}>
          Please Enter Your Postal Code
        </h1>
        <div className="w-full">
          <div>
            <div className="relative">
              <input id="postal-code" type="text" name="postal-code" placeholder="A1A1A1" required 
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 
                placeholder:text-gray-500" />
              <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
            </div>
          </div>
        </div>
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <Button className="mt-4 w-1/2 items-end" aria-disabled={isPending}>
          Look Up <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true" >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}

// export default PostalForm;
*/
// // const UpdateInvoice = ({ id }: { id: string }) => {
// //   return (
// //     <Link href={`/dashboard/invoices/${id}/edit`} className="rounded-md border p-2 hover:bg-gray-100" >
// //       <PencilIcon className="w-5" />
// //     </Link>
// //   );
// // }
// // 'flex h-12 items-center rounded-lg bg-red-500 px-4 text-base font-medium text-white transition-colors hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50'
// // 'mt-4 w-1/2 items-end'






// import { useRouter } from 'next/router'

// const moveSomething = async (_, formData) => {
//   const val = await tryThis(formData)
//   // const router = useRouter()
//   return val
// }

const PostalForm = () => {
  const [postalQuery, setPostalQuery] = useState('')
  const [error, setError] = useState(false)
  const path = usePathname()
  const router = useRouter()

  const navigate = () => {
    if (postalQuery.length !== 6) {
      setError(true)
    } else redirect(`/results/${postalQuery}`)
  }
  // const handleSearch = useDebouncedCallback(() => setPostalQuery(), 300)
  
  useEffect(() => {
    if (path !== '/') router.replace('/')
  }, [])

  return (
    <form className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8 md:px-24 md:pb-20 md:pt-24">
        <h1 className={`${lexend.className} mb-4 text-2xl`}>
          Please Enter Your Postal Code
        </h1>
        <div className="w-full">
          <div>
            <div className="relative">
              <input id="postal-code" type="text" name="postal-code" placeholder="A1A1A1" value={postalQuery} required onChange={(e) => setPostalQuery(e.target.value)} className={styles.postal_input} />
              <MapPinIcon className={styles.postal_icon} />
            </div>
            {/* <div className="relative">
              <input id="postal-code2" type="text" name="postal-code" placeholder="A1A1A1" value={postalCode} required onChange={(e) => handleSearch(e.target.value)} className="peer block mb-2 w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm md:text-base outline-2 placeholder:text-gray-500 focus:ring-red-500 focus:border-red-500" />
              <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
            </div> */}
          </div>
        </div>
        {/* <Link aria-disabled={true} className='flex h-12 text-sm md:text-base items-center rounded-lg bg-red-500 px-4 text-base font-medium text-white transition-colors hover:bg-red-400 aria-disabled:cursor-not-allowed' href={`/results/${postalCode}`} >
          Submit
        </Link> */}
        <input type='button' onClick={navigate} className={styles.postal_link} value='Submit' />
        {/* <Link className={styles.postal_link} href={`/results/${postalQuery}`} >Submit</Link> */}
        <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true" >
          {error && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">Must write 6-digit postal code without spaces</p>
            </>
          )}
        </div>
      </div>
    </form>
  )
}

export default PostalForm;