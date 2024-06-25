import react from 'react'
import ProposalMain from '@/components/Proposals/ProposalMain';

 
function page({ params }: { params: string }){
    return(
<>
        <ProposalMain props={params}/>
</>
    )
}

export default page;