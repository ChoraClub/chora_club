import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
    const url = new URL(req.url);
    const proposalId = url.searchParams.get('proposalId');
    const lastCursor = url.searchParams.get('lastCursor');
    console.log("proposalId", proposalId);
    console.log("lastCursor", lastCursor);

    if (!proposalId) {
        return NextResponse.json({ error: 'Proposal ID is required' }, { status: 400 });
    }

    const query = `
        query ProposalVotesCastList($input: VotesInput!) {
            votes(input: $input) {
                nodes {
                    ... on VoteV2 {
                        voter {
                            name
                            picture
                            address
                            twitter
                        }
                        amount
                        type
                    }
                }
                pageInfo {
                    lastCursor
                }
               
            }
        }
    `;

    const variables = {
        input: {
            filters: { proposalId },
            page:{
                afterCursor: lastCursor || null,
                limit:20,
            },
            sort: { sortBy: "amount", isDescending: true },
            
        }
    };

    try {
        const apiKey = process.env.NEXT_PUBLIC_TALLY_API_KEY;
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
            return NextResponse.json({
                votes: data.data.votes.nodes,
                pageInfo: data.data.votes.pageInfo
            }, { status: 200 });
        } 
        return NextResponse.json({ error: 'Failed to fetch votes' }, { status: 500 });
        
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'An error occurred.' }, { status: 500 });
    }
};