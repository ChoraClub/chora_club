import { ethers } from "ethers";
import { cacheExchange, createClient, fetchExchange, gql } from "urql/core";

const provider = new ethers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_ENS_RPC_PROVIDER
);

const client = createClient({
  url: "https://api.thegraph.com/subgraphs/name/ensdomains/ens",
  exchanges: [cacheExchange, fetchExchange],
});

const query = gql`
  query DomainsByOwner($address: String!) {
    domains(where: { resolver_: { addr: $address } }) {
      id
      labelName
      name
    }
  }
`;

// export const getEnsName = async (address: string | undefined) => {
//   const displayName = address?.slice(0, 4) + "..." + address?.slice(-4);

<<<<<<< HEAD
  if (address) {
    const query_data: any = await client.query(query, {
      address: address,
    });
    const data = query_data.data?.domains[0]?.name
      ? query_data.data?.domains[0]?.name
      : displayName;
    return data;
  }
};
=======
//   if (address) {
//     const query_data: any = await client.query(query, {
//       address: address,
//     });
//     const ensNameOrAddress = query_data.data?.domains[0]?.name
//       ? query_data.data?.domains[0]?.name
//       : displayName;
//     return ensNameOrAddress;
//   }
// };
>>>>>>> dev2

// export const getEnsNameOfUser = async (address: string | undefined) => {
//   const displayName = address?.slice(0, 4) + "..." + address?.slice(-4);

<<<<<<< HEAD
  if (address) {
    const query_data: any = await client.query(query, {
      address: address,
    });
    const data = query_data.data?.domains[0]?.name
      ? query_data.data?.domains[0]?.name
      : "";
    return data;
  }
};
=======
//   if (address) {
//     const query_data: any = await client.query(query, {
//       address: address,
//     });
//     const data = query_data.data.domains[0]?.name
//       ? query_data.data.domains[0]?.name
//       : "";
//     return data;
//   }
// };
>>>>>>> dev2
