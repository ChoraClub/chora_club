import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
    const url = new URL(req.url);
    const user = url.searchParams.get('user');
    const lastCursor = url.searchParams.get('lastCursor');
    console.log("user", user);
    console.log("lastCursor", lastCursor);

    let query = '';
    let variables = {};

   
        // Specific delegate query
        query = `query GovernanceProposals($input: ProposalsInput!) {
  proposalsV2(input: $input) {
    nodes {
      ... on ProposalV2 {
        id
        onchainId
        status
        originalId
        createdAt
        voteStats {
          votesCount
          percent
          type
          votersCount
        }
        metadata {
          description
        }
        block {
          timestamp
        }
        governor {
          id
          quorum
          name
          timelockId
          token {
            decimals
          }
        }
      }
    }
    pageInfo {
      firstCursor
      lastCursor
    }
  }
}
`;

        variables = {"input":{
            "filters": {
              "organizationId": "2206072050315953936"
            },
            "page": {
              "limit": 20,
            },
            "sort": {
              "sortBy": "id",
              "isDescending": true
            }
          }
          };
   

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
