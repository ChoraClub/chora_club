export interface TopTen {
    balance: number;
    id: string;
    lastUpdatedBlock: number;
    user: string;
    timestamp: string;
  }
export interface Holder {
    TopTen: TopTen[];
    firstCollector: TopTen;
    latestCollector: TopTen;
    maxSupply: number;
    selectedToken: any;
  }