import Image from 'next/image';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { Vote } from '@/app/lib/definitions'
import styles from '@/app/ui/results/results.module.css'
import { CheckCircleIcon, XCircleIcon, HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/react/24/outline';
// import { useState } from 'react';

// const BallotsTable = async ({ query, currentPage, ballotInfo }: { query: string; currentPage: number; ballotInfo:any }) => {

//   const invoices = await fetchFilteredInvoices(query, currentPage);

//     // const {ballotsURL, sponsoredURL, link, membership} = ballotInfo;
//   // const invoices = await fetchFilteredInvoices(query, currentPage);
//   // const startDate = membership.length > 1 ? membership[-1].startDate : membership[0].startDate
 
//   return (
//     <div className="mt-6 flow-root">
//       <div className="inline-block min-w-full align-middle">
//         <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
//           <div className="md:hidden">
//             {invoices?.map((invoice) => (
//               <div key={invoice.id} className="mb-2 w-full rounded-md bg-white p-4" >
//                 <div className="flex items-center justify-between border-b pb-4">
//                   <div>
//                     <div className="mb-2 flex items-center">
//                       <Image src={invoice.image_url} className="mr-2 rounded-full" width={28} height={28} alt={`${invoice.name}'s profile picture`} />
//                       <p>{invoice.name}</p>
//                     </div>
//                     <p className="text-sm text-gray-500">{invoice.email}</p>
//                   </div>
//                   <InvoiceStatus status={invoice.status} />
//                 </div>
//                 <div className="flex w-full items-center justify-between pt-4">
//                   <div>
//                     <p className="text-xl font-medium">
//                       {formatCurrency(invoice.amount)}
//                     </p>
//                     <p>{formatDateToLocal(invoice.date)}</p>
//                   </div>
//                   <div className="flex justify-end gap-2">
//                     <UpdateInvoice id={invoice.id} />
//                     <DeleteInvoice id={invoice.id} />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <table className="hidden min-w-full text-gray-900 md:table">
//             <thead className="rounded-lg text-left text-sm font-normal">
//               <tr>
//                 <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
//                   Customer
//                 </th>
//                 <th scope="col" className="px-3 py-5 font-medium">
//                   Email
//                 </th>
//                 <th scope="col" className="px-3 py-5 font-medium">
//                   Amount
//                 </th>
//                 <th scope="col" className="px-3 py-5 font-medium">
//                   Date
//                 </th>
//                 <th scope="col" className="px-3 py-5 font-medium">
//                   Status
//                 </th>
//                 <th scope="col" className="relative py-3 pl-6 pr-3">
//                   <span className="sr-only">Edit</span>
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white">
//               {invoices?.map((invoice) => (
//                 <tr
//                   key={invoice.id}
//                   className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
//                 >
//                   <td className="whitespace-nowrap py-3 pl-6 pr-3">
//                     <div className="flex items-center gap-3">
//                       <Image
//                         src={invoice.image_url}
//                         className="rounded-full"
//                         width={28}
//                         height={28}
//                         alt={`${invoice.name}'s profile picture`}
//                       />
//                       <p>{invoice.name}</p>
//                     </div>
//                   </td>
//                   <td className="whitespace-nowrap px-3 py-3">
//                     {invoice.email}
//                   </td>
//                   <td className="whitespace-nowrap px-3 py-3">
//                     {formatCurrency(invoice.amount)}
//                   </td>
//                   <td className="whitespace-nowrap px-3 py-3">
//                     {formatDateToLocal(invoice.date)}
//                   </td>
//                   <td className="whitespace-nowrap px-3 py-3">
//                     <InvoiceStatus status={invoice.status} />
//                   </td>
//                   <td className="whitespace-nowrap py-3 pl-6 pr-3">
//                     <div className="flex justify-end gap-3">
//                       <UpdateInvoice id={invoice.id} />
//                       <DeleteInvoice id={invoice.id} />
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

export const AltBallotsTable = async (props: { currentPage:number, results:any}) => {
  const { currentPage, results } = props
  const firstIndex = (currentPage - 1) * 20
  const lastIndex = currentPage * 20
  const display = []

  for (let i = firstIndex; i <= lastIndex; i++) {
    if (i == results.length) break
    else display.push(results[i])
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="mb-4 rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            <div className="mb-2 w-full rounded-md bg-white p-4" >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>Picture</p>
                      <p>Name</p>
                    </div>
                    <p className="text-sm text-gray-500">Email</p>
                  </div>
                  <p>Status</p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      Amount
                    </p>
                    <p>Date</p>
                  </div>
                  <div className="flex justify-end gap-3">
                      <p>Update</p>
                      <p>Delete</p>
                  </div>
                </div>
              </div>
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="w-1/4 px-3 py-5 font-medium sm:pl-6">
                  Session / Number
                </th>
                <th scope="col" className="w-1/2 px-3 py-5 font-medium">
                  Bill
                </th>
                <th scope="col" className="w-1/8 px-3 py-5 font-medium">
                  MP Voted
                </th>
                <th scope="col" className="w-1/8 px-3 py-5 font-medium">
                  Bill Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {display && display.map((el,i) => (
                <tr key={`row-${i}`} className={styles.table_row} >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {`${el.session}-${el.number}`}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {el.billURL}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {el.response == 'Yes' ? <HandThumbUpIcon className='w-8'/> : <HandThumbDownIcon className='w-8'/>}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {el.result == 'Passed' ? <CheckCircleIcon className='w-8'/> : <XCircleIcon className='w-8'/>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// export default BallotsTable;