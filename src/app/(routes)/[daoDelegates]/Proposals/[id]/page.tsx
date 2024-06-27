import react from 'react'
import ProposalMain from '@/components/Proposals/ProposalMain';

 
function page({ params }: { params: any }){
    return(
<>
        <ProposalMain props={params}/>
</>
    )
}

export default page;