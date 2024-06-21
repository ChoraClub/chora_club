import React, { useEffect, useRef } from 'react';
import { useStudioState } from '@/store/studioState';

interface IAudioProps {
  stream: MediaStream;
  name: string;
}

type HTMLAudioElementWithSetSinkId = HTMLAudioElement & {
  setSinkId: (id: string) => void;
};

const Audio: React.FC<
  IAudioProps &
    React.DetailedHTMLProps<
      React.AudioHTMLAttributes<HTMLAudioElementWithSetSinkId>,
      HTMLAudioElementWithSetSinkId
    >
> = ({ stream, name }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { isRecordAudio, audioOutputDevice } = useStudioState();

  useEffect(() => {
    const audioObj = audioRef.current;

    if (audioObj && stream) {
      audioObj.srcObject = stream;
      audioObj.onloadedmetadata = async () => {
        try {
          await audioObj.play();
        } catch (error) {
          console.error(error);
        }
      };
      audioObj.onerror = () => {
        console.error('audioCard() | Error is hapenning...');
      };
    }
  }, []);

  useEffect(() => {
    const audioObj = audioRef.current as HTMLAudioElementWithSetSinkId;
    if (audioObj && audioOutputDevice) {
      audioObj.setSinkId(audioOutputDevice.deviceId);
    }
  }, [audioOutputDevice]);

  return (
    <>
      <audio ref={audioRef}>Audio</audio>
    </>
  );
};

export default Audio;
