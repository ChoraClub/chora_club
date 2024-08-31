import { NextRequest, NextResponse } from 'next/server';
import { Client, cacheExchange, fetchExchange, gql } from 'urql';
export const revalidate = 0;

const op_client = new Client({
    url: 'https://api.studio.thegraph.com/query/68573/op/v0.0.9',
    exchanges: [cacheExchange, fetchExchange],
});
const arb_client = new Client({
    url: 'https://api.studio.thegraph.com/query/68573/arb_token/version/latest',
    exchanges: [cacheExchange, fetchExchange],
});
const DELEGATE_QUERY = gql`
query MyQuery($id: String!) {
  delegates(where:{id: $id}) {
    latestBalance
    id
    blockTimestamp
  }
}
`;
export const GET = async (req: NextRequest) => {
    try {
        console.log("search delegate")
        const { searchParams } = new URL(req.url);
        const address = searchParams.get('address')?.toLocaleLowerCase();
        const dao = searchParams.get('dao');
        if (!address || !dao) {
            return NextResponse.json({ error: 'Address and DAO parameters are required.' }, { status: 400 });
        }
        let data;
        console.log(address,dao)
        if(dao==="optimism"){
         data = await op_client.query(DELEGATE_QUERY,{id:address}).toPromise();
        }else{
          data = await arb_client.query(DELEGATE_QUERY,{id:address}).toPromise();
        } 
        if (!data || !data.data || !data.data.delegates || data.data.delegates.length === 0) {
            return NextResponse.json({ error: 'Delegate not found.' }, { status: 404 });
        }
        console.log(data.data)
        return NextResponse.json(data.data.delegates);
    } catch (e) {
        console.log(e);
        return NextResponse.json({ error: 'An error occurred.' }, { status: 500 });
    }
}