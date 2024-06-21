import { IChatMessage, useStudioState } from '@/store/studioState';
import { BasicIcons } from '@/utils/BasicIcons';
import clsx from 'clsx';
import Link from 'next/link';

const ChatsPreview = () => {
  const { chatMessages } = useStudioState();

  const validateUrl = (text: string) => {
    const urlRegex =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/;
    return urlRegex.test(text);
  };

  return (
    <>
      {chatMessages.map((chat: IChatMessage) => {
        return (
          <div
            key={chat.name}
            className={clsx(
              chat.isUser
                ? 'ml-auto text-md break-words max-w-xs w-fit py-1 px-2 mb-2 bg-[#216CFC] rounded-lg items-center flex'
                : 'w-fit py-1 px-2 break-words max-w-xs text-md mb-2 rounded-lg bg-[#343744]',
              validateUrl(chat.text) && 'hover:bg-blue-500/50'
            )}
          >
            <div className='text-xs text-blue-300'>
              {chat.isUser ? null : chat.name}
            </div>
            {validateUrl(chat.text) ? (
              <Link href={chat.text} target='_blank' rel='noreferrer'>
                <div className='flex gap-2 items-center justify-center'>
                  <span>{BasicIcons.folder}</span>
                  <span>{chat?.fileName}</span>
                </div>
              </Link>
            ) : (
              chat.text
            )}
          </div>
        );
      })}
    </>
  );
};

export default ChatsPreview;
