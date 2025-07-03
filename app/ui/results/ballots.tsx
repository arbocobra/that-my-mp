import { lexend } from '@/app/ui/fonts';
import { getMP, getVotes, getBallots, matchVotesBills } from '@/app/lib/data';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import {AltBallotsTable} from '@/app/ui/results/table';
import Pagination from '@/app/ui/results/pagination';
import { Suspense } from 'react'; 

const Ballots = async (props: { data: any, searchParams?: Promise<{ query?: string; page?: string}> }) => {

   const name:string = props.data.name;
   const last:string = props.data.last;

  // const ballotInfo = await fetchMP(name, last)
  const ballotInfo = await getMP(props.data)
  const membership = ballotInfo.membership as any[]
  // const {ballotsURL, sponsoredURL, link, membership} = ballotInfo;
  const startDate = membership.length > 1 ? membership[membership.length - 1].startDate : membership[0].startDate
  const ballotsURL = ballotInfo.ballotsURL as string
  
  const [votesByDate, ballots] = await Promise.all([
      getVotes(startDate),
      getBallots(ballotsURL)
  ]);

  const results = matchVotesBills(ballots, votesByDate)

  // const searchParams = await props.searchParams;
   const currentPage = 1;
   const totalPages = Math.ceil(results.length / 20)
   // const totalPages = await fetchInvoicesPages(query);

  return (
    <div className="w-full md:col-span-5">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lexend.className} text-2xl`}>Ballots in Parliament</h1>
      </div>
      <AltBallotsTable currentPage={currentPage} results={results} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}

export default Ballots;