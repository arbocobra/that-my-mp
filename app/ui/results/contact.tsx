import { CalendarIcon } from '@heroicons/react/24/outline';
import { lexend } from '@/app/ui/fonts';

const ContactInfo = async (props: {data: any}) => {

   type Address = {
      type: string;
      tel: string;
      fax: string;
      postal: string;
   }
   const email: string = props.data.email;
   const address:Address[] = props.data.address

  return (
    <div className="w-full md:col-span-3">
      <h2 className={`${lexend.className} mb-4 text-xl md:text-2xl`}>
        Contact Information
      </h2>
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="flex flex-col rounded-md bg-white p-4">
          <div>Email: {email}</div>
        </div>
        { address.length && address.map((a:Address) => (

            <div className="mt-6 flex flex-col rounded-md bg-white p-4">
               <div>
                  {a.type} Address
               </div>
               <div className="flex flex-row">
                  Tel: {a.tel}
               </div>
               <div className="flex flex-row">
                  Fax: {a.fax}
               </div>
               <div className="flex flex-col">

                  {a.postal}
               </div>

        </div> )) }
        
        <div className="flex items-center pb-2 pt-6">
          <h3 className="ml-2 text-sm text-gray-500 ">Fetched via: Represent Civic Information API 
          </h3>
        </div>
      </div>
    </div>
  );
}

export default ContactInfo;