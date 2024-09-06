import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
const arb_abi = require('../artifacts/Dao.sol/arb_proposals_abi.json');

const contractAddress = '0x065620d99E1785Ccf56Fa95462d3012Eb844FDC9';
const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000; // 5 seconds

export const useTransactionListener = () => {
  const [transactionData, setTransactionData] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const setupListener = useCallback(async () => {
    let provider: ethers.WebSocketProvider | undefined;
    console.log("starting...")
    const connect = async () => {
      try {
        provider = new ethers.WebSocketProvider(''
        );
console.log("provider",provider)
        provider.websocket.onopen = () => {
          console.log('WebSocket connection opened');
          setIsListening(true);
          setError(null);
          setRetryCount(0);
        };

        provider.websocket.close = (event) => {
          console.log('WebSocket connection closed', event);
          setIsListening(false);
          if (retryCount < MAX_RETRIES) {
            console.log(`Attempting to reconnect... (Attempt ${retryCount + 1})`);
            setTimeout(connect, RETRY_INTERVAL);
            setRetryCount(prevCount => prevCount + 1);
          } else {
            setError('Max retries reached. Please check your connection and try again.');
          }
        };

        provider.websocket.onerror = (error) => {
          console.error('WebSocket error:', error);
          setError(`WebSocket error: ${error.message}`);
        };

        const contract = new ethers.Contract(contractAddress, arb_abi, provider);
        console.log("Contract instance created:", contract);

        const handleVoteCast = (voter: string, proposalId: number, support: boolean, votes: number, event: any) => {
          console.log('Vote cast detected:', { voter, proposalId, support, votes });
          setTransactionData({
            voter,
            proposalId,
            support,
            votes,
            event,
          });
        };
        const events = await contract.queryFilter('VoteCast');
        console.log('Past VoteCast events:', events);
        console.log(provider._network);
        console.log(arb_abi);
        contract.on('error', (error) => {
            console.error('Error setting up event listener:', error);
          });
        contract.on('VoteCast', handleVoteCast);
        console.log('Event listener for VoteCast set up');
        contract.on('error', (error) => {
            console.error('Error setting up event listener:', error);
          });
        return () => {
          if (provider) {
            contract.off('VoteCast', handleVoteCast);
            provider.websocket?.close();
          }
          setIsListening(false);
          console.log('Stopped listening for VoteCast events');
        };
      } catch (err) {
        console.error('Error in setupListener:', err);
        setError(`Error setting up event listener: ${(err as Error).message}`);
        setIsListening(false);
        if (provider) {
          provider.websocket?.close();
        }
        if (retryCount < MAX_RETRIES) {
          console.log(`Attempting to reconnect... (Attempt ${retryCount + 1})`);
          setTimeout(connect, RETRY_INTERVAL);
          setRetryCount(prevCount => prevCount + 1);
        } else {
          setError('Max retries reached. Please check your connection and try again.');
        }
      }
    };

    return connect();
  }, [retryCount]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    setupListener()
      .then((cleanupFn) => {
        cleanup = cleanupFn;
      })
      .catch((err) => {
        console.error('Error in useEffect:', err);
        setError((err as Error).message);
        setIsListening(false);
      });

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [setupListener]);

  return { transactionData, isListening, error };
};