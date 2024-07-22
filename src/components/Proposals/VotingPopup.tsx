import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Info } from 'lucide-react';

import {
  GET_LATEST_DELEGATE_VOTES_CHANGED,
  op_client,
} from "@/config/staticDataUtils";

interface VotingOption {
  value: string;
  label: string;
}

interface VotingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (proposalId: string, vote: string[], comment: string) => void;
  proposalId: string;
  proposalTitle: string;
  address: string;
  dao: string;
  customOptions?: VotingOption[];
}

const VotingPopup: React.FC<VotingPopupProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  proposalId, 
  proposalTitle, 
  address, 
  dao,
  customOptions 
}) => {
  const [votes, setVotes] = useState<string[]>([]);
  const [comment, setComment] = useState<string>('');
  const [votesCount, setVotesCount] = useState<number>();
  const [error, setError] = useState<string>('');

  const defaultOptions: VotingOption[] = [
    { value: '1', label: 'For' },
    { value: '0', label: 'Against' },
    { value: '2', label: 'Abstain' }
  ];

  const options = customOptions || defaultOptions;

  const handleSubmit = () => {
    if (votes.length === 0) {
      setError('Please select your choice before submitting.');
      return;
    }
    setError('');
    onSubmit(proposalId, votes, comment);
    onClose();
  };

  const handleVoteChange = (value: string) => {
    if (customOptions) {
      setVotes(prev => 
        prev.includes(value) 
          ? prev.filter(v => v !== value)
          : [...prev, value]
      );
    } else {
      setVotes([value]);
    }
    setError('');
  };

  const totalCount = `query Delegate($input: DelegateInput!) {
    delegate(input: $input) {
      id
      votesCount
      delegatorsCount
    }
  }`;

  const variables = {
    input: {
      address: address,
      governorId: "",
      organizationId: null as number | null,
    },
  };

  if (dao === "arbitrum") {
    variables.input.governorId = "eip155:42161:0x789fC99093B09aD01C34DC7251D0C89ce743e5a4";
    variables.input.organizationId = 2206072050315953936;
  } else {
    variables.input.governorId = "eip155:10:0xcDF27F107725988f2261Ce2256bDfCdE8B382B10";
    variables.input.organizationId = 2206072049871356990;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_TALLY_API_KEY;
        if (!apiKey) {
          throw new Error("API key is missing");
        }
        if (dao === "arbitrum") {
          fetch("https://api.tally.xyz/query", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Api-Key": apiKey,
            },
            body: JSON.stringify({
              query: totalCount,
              variables: variables,
            }),
          })
            .then((result) => result.json())
            .then((finalCounting) => {
              console.log(finalCounting);
              console.log("dataa", finalCounting.data);
              setVotesCount(finalCounting.data.delegate.votesCount?finalCounting.data.delegate.votesCount : 0);
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        } else {
          const data = await op_client
            .query(GET_LATEST_DELEGATE_VOTES_CHANGED, {
              delegate: address.toString(),
            })
            .toPromise();
          console.log("voting data", data.data.delegateVotesChangeds[0]);
          setVotesCount(data.data.delegateVotesChangeds[0]?.newBalance?data.data.delegateVotesChangeds[0]?.newBalance:0);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    if (address) {
      fetchData();
    }
  }, [op_client, address, dao, totalCount, variables]);

  const formatNumber = (number: number) => {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(2) + "m";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(2) + "k";
    } else {
      return number.toString();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {proposalTitle}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm sm:max-w-[350px] text-gray-500">Proposal ID: {proposalId.slice(0,10)}...{proposalId.slice(-4)}</span>
          </div>
          <div className="mb-6">
            <Label className="text-sm font-medium">Voting power</Label>
            <p className="text-2xl font-bold">
              {votesCount !== undefined 
                ? formatNumber(votesCount / 10**18)
                : '0'
              }
            </p>
            {/* <button className="text-blue-600 text-sm flex items-center mt-1">
              <Info className="w-4 h-4 mr-1" />
              How is my voting power calculated?
            </button> */}
          </div>
          {customOptions ? (
            <div className="space-y-3">
              {options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={option.value} 
                    checked={votes.includes(option.value)}
                    onCheckedChange={() => handleVoteChange(option.value)}
                  />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              ))}
            </div>
          ) : (
            <RadioGroup onValueChange={(value) => handleVoteChange(value)} className="space-y-3">
              {options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          )}
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          <div className="mt-6 sm:max-w-[350px]">
            <Label htmlFor="comment" className="text-sm font-medium">Add comment</Label>
            <Textarea
              id="comment"
              placeholder="Why are you voting this way?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <Button 
          onClick={handleSubmit} 
          className="sm:max-w-[350px] mt-4"
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default VotingPopup;