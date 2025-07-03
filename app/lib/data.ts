import postgres from 'postgres';
import { CustomerField, CustomersTableType, InvoiceForm, InvoicesTable, LatestInvoiceRaw, Revenue, MPinit, MPadd, Ballot, Vote } from './definitions';
import { formatCurrency } from './utils';
import Ballots from '../ui/results/ballots';
import assert from 'node:assert';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue[]>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0][0].count ?? '0');
    const numberOfCustomers = Number(data[1][0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices( query: string, currentPage: number, ) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export const getMPByPostalCode = async (val:string):Promise<MPinit> => {
  const response = await fetchPostalCode(val)
  assertIsDefined(response)
  return response
}

export const getMP = async (val:MPinit):Promise<MPinit> =>{
  const response = await fetchMP(val)
  assertIsDefined(response)
  return response
}

export const getVotes = async (date:string):Promise<Vote[]> => {
  const response = await fetchVotesByDate(date);
  assertIsDefined(response)
  return response
}

export const getBallots = async (url:string):Promise<object[]> => {
  const response = await fetchBallots(url)
  assertIsDefined(response)
  return response;
}

const fetchPostalCode = async (val:string): Promise<MPinit | undefined> => {
  let postal = val.toUpperCase().split(' ').join('')
    try {
        const r = await fetch(`https://represent.opennorth.ca/postcodes/${postal}/`);
        if (r.ok) {
          const response = await r.json()
          const data = formatPostalData(response) as MPinit
          return data as MPinit;
        }
    } catch (err) { 
      console.error('Error:', err);
      throw new Error('Failed to locate postal code');
    }
}

const formatPostalData = (val:any):MPinit => {
    const rep = val.representatives_centroid.filter((el: any) => el.elected_office == 'MP')[0]
    let mp:MPinit = { 
      last: rep.last_name,
      name: rep.name,
      party: rep.party_name, 
      district: rep.district_name, 
      email: rep.email, 
      photoURL: rep.photo_url, 
      address: rep.offices 
    }
    return mp;
}

export const fetchMP = async (val:MPinit):Promise<MPinit | undefined> => {
  let name = val.name
  let last = val.last
  let nameEncode = name.toLowerCase().split(" ").join("-")
  let nameURL = `/politicians/${nameEncode}/?format=json`
  let response;
  try {
    let r = await MPlookup(nameURL)
    if (!r.ok) {
      const lastnameSearch = `/politicians/?family_name=${last}&format=json`
      let altR = await MPlookup(lastnameSearch)
      if (altR.ok) {
        let altResp = await altR.json();
        let altURL = altResp.objects[0].url
        let r2 = await MPlookup(`${altURL}?format=json`)
        if (r2.ok) {
          response = await r2.json();
        }
      }
    } else {
      response = await r.json();
    }
    const data = formatMPData(response, val)
    return data;
    } catch (err) { 
      console.error('Error:', err);
      throw new Error('Failed to fetch MP');
     }
}

// export const fetchMP = async (name:string, last:string):Promise<MPadd | undefined> => {
//   let nameEncode = name.toLowerCase().split(" ").join("-")
//   let nameURL = `/politicians/${nameEncode}/?format=json`
//   let response;
//   try {
//     let r = await MPlookup(nameURL)
//     if (!r.ok) {
//       const lastnameSearch = `/politicians/?family_name=${last}&format=json`
//       let altR = await MPlookup(lastnameSearch)
//       if (altR.ok) {
//         let altResp = await altR.json();
//         let altURL = altResp.objects[0].url
//         let r2 = await MPlookup(`${altURL}?format=json`)
//         if (r2.ok) {
//           response = await r2.json();
//         }
//       }
//     } else {
//       response = await r.json();
//     }
//     const data = formatMPData(response) as MPadd
//     return data;
//     } catch (err) { 
//       console.error('Error:', err);
//       throw new Error('Failed to fetch MP');
//      }
// }

const MPlookup = async (url:string):Promise<any | undefined> => {
  const baseURL = 'https://api.openparliament.ca'
  const r = await fetch(`${baseURL}${url}`)
  return r  
}

// const formatMPData = (val:any):MPadd => {
//   const membership:object[] = val.memberships.map((el: any) => {
//     return { 'startDate': el.start_date, 'endDate': el.end_date }
//   })
//   let mp:MPadd = { 
//     ballotsURL: val.related.ballots_url, 
//     sponsoredURL: val.related.sponsored_bills_url, 
//     link: val.links[0], 
//     membership: membership
//   }
//   return mp;
// }

const formatMPData = (val:any, init:MPinit):MPinit => {
  const membership:object[] = val.memberships.map((el: any) => {
    return { 'startDate': el.start_date, 'endDate': el.end_date }
  })
  let mp:any = { 
    ballotsURL: val.related.ballots_url, 
    sponsoredURL: val.related.sponsored_bills_url, 
    link: val.links[0], 
    membership: membership
  }
  let final:MPinit = Object.assign(mp, init)
  return final;
}

export const fetchVotesByDate = async (date:string):Promise<Vote[] | undefined> => {
  const response = []
  try {
    // let r = await fetch('https://api.openparliament.ca/votes/?date__gte=2019-10-21&limit=500&format=json')
    let r = await fetch(`https://api.openparliament.ca/votes/?date__gte=${date}&limit=500&format=json`)
    if (r.ok) {
      let resp = await r.json();
      response.push(resp.objects)
      let next = resp.pagination.next_url
      let i = 0
      while (next && i < 9) {
        let rr = await fetch('https://api.openparliament.ca' + next)
        if (rr.ok) {
          let rresp = await rr.json();
          response.push(rresp.objects)
          next = rresp.pagination.next_url
          i++
        }
      }
      let output = formatVoteByDate(response)
      return output as Vote[];
    }
  } catch (err) { 
    console.error('Error:', err);
    throw new Error('Failed to fetch MP');
  }
}

const formatVoteByDate = (val:any):Vote[] => {
  let flat = val.flat()
  let filtered:Vote[] = []
  flat.forEach((el:any) => {
    if (el.bill_url) {
      let vote:Vote = {
        billURL: el.bill_url,
        voteURL: el.url,
        result: el.result,
        date: el.date,
        description: el.description.en,
        session: el.session,
        number: el.number,
        contextURL: el.context_statement
      }
      filtered.push(vote)
    }
  })
  return filtered 
}

export const fetchBallots = async (url:string):Promise<object[] | undefined> => {
  let ballotsURL = `${url}&limit=500&format=json`
    const response = []
    try {
        let r = await fetch(`https://api.openparliament.ca${ballotsURL}`)
        if (r.ok) {
          let resp = await r.json();
          response.push(resp.objects)
          let next = resp.pagination.next_url
          let i = 0
          while (next && i < 9) {
           let rr = await fetch('https://api.openparliament.ca' + next)
          if (rr.ok) {
            let rresp = await rr.json();
            response.push(rresp.objects)
            next = rresp.pagination.next_url
            i++
          }
        }
        let output = response.flat();
        assertIsDefined(output)
        // return output as Ballot[]
        return output
      }
    } catch (err) { 
      console.error('Error:', err);
      throw new Error('Failed to fetch MP');
     }
}

const formatBallots = (val:any):Ballot[] => {
  let flat = val.flat()
  let ballots = flat.map((el:any) => {
    let b:Ballot = {
      response: el.ballot,
      voteURL: el.vote_urls
    }
    return b
  })
  return ballots;
}

export const matchVotesBills = (mp_ballots:any[], allBill_votes:Vote[]):Vote[] => {
  // assert(typeof mp_ballots[0] === Object<Ballot>);
  // assertIsDefined(allBill_votes)
  // mp_ballots > allBill_votes
  const ballotVote_urls:string[] = mp_ballots.map((b:any) => b.vote_url)

  let filtered:Vote[] = [];

  allBill_votes.forEach((v:Vote, i:number) => {
    let ballotIndex = ballotVote_urls.indexOf(v.voteURL)
    if (ballotIndex >= 0) {
      let current = {...v}
      let ballotResponse:string = mp_ballots[ballotIndex].ballot
      current.response = ballotResponse
      filtered.push(current)
    }
  })

  // let filtered:Vote[] = allBill_votes.map((v:Vote, i:number) => {
  //   // assertIsDefined(v)
  //   let ballotIndex = ballotVote_urls.indexOf(v.voteURL)
  //   if (ballotIndex > 0) {
  //     let ballotResponse:string = mp_ballots[ballotIndex].ballot
  //     v.response = ballotResponse
  //     return v as Vote;
  //   }
  // })

  return filtered

}

function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(`${value} is not defined`)
  }
}