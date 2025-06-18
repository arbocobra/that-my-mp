import { CalendarIcon } from '@heroicons/react/24/outline';
import { lexend } from '@/app/ui/fonts';
import { fetchMP } from '@/app/lib/data';

const Picture = async (props: {photoURL: string}) => {

const photoURL = props.photoURL

  return (
    <div className="w-full md:col-span-2">
      <h2 className={`${lexend.className} mb-4 text-xl md:text-2xl`}>
        Contact Information
      </h2>
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="flex flex-col rounded-md bg-white p-4">
          <img width={142} height={240} src={photoURL}/>
        </div>
        <div className="flex items-center pb-2 pt-6">
          <h3 className="ml-2 text-sm text-gray-500 ">something 
          </h3>
        </div>
      </div>
    </div>
  );
}

export default Picture;