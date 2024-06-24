import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
    const url = new URL(req.url);
    const user = url.searchParams.get('user');
    const lastCursor = url.searchParams.get('lastCursor');
    console.log("user", user);
    console.log("lastCursor", lastCursor);

    let query = '';
    let variables = {};

    if (user) {
        // Specific delegate query
        query = `query Delegate($input: DelegateInput!) {
          delegate(input: $input) {
            account {
              address
              ens
              picture
            }
            statement{
              statement
           }
            delegatorsCount
            votesCount
          }
        }`;

        variables = {
            "input": {
                "address": user,
                "governorId": "eip155:42161:0x789fC99093B09aD01C34DC7251D0C89ce743e5a4",
                "organizationId": "2206072050315953936"
              }
        };
    } else {
        // Delegate list query
        query = `query FetchDelegatesAddresses($input: DelegatesInput!) {
          delegates(input: $input) {
            nodes {
              ... on Delegate {
                account {
                  address,
                  ens
                  picture
                }
                votesCount
              }
            }
            pageInfo {
              lastCursor
            }
          }
        }`;

        variables = {
            "input": {
                "filters": {
                    "governorId": "eip155:42161:0x789fC99093B09aD01C34DC7251D0C89ce743e5a4",
                    "organizationId": "2206072050315953936"
                },
                "page": {
                    "afterCursor": lastCursor || null,
                    "limit": 20
                },
                "sort": {
                    "isDescending": true,
                    "sortBy": "votes"
                }
            }
        };
    }

    try {
        const apiKey = process.env.NEXT_PUBLIC_TALLY_API_KEY; // Ensure you have this in your .env file
        if (!apiKey) {
            throw new Error('API key is missing');
        }
        const response = await fetch('https://api.tally.xyz/query', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Api-Key": apiKey,
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            }),
        });

        const data = await response.json();
       
        console.log("data", data);

        if (response.ok) {
            return NextResponse.json(data.data, { status: 200 });
        } 
        return NextResponse.json({ error: 'user not found' }, { status: 200 });
        
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'An error occurred.' }, { status: 500 });
    }
};
