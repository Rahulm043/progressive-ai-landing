"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { LiveKitRoom, RoomAudioRenderer, StartAudio } from '@livekit/components-react';
import { SimpleAssistant } from './SimpleAssistant';
import { useConnection } from '@/hooks/useConnection';
import { useWindowResize } from '@/hooks/useWindowResize';

interface VoiceWidgetProps {
  wsUrl: string;
  token: string;
  onError: (error: Error) => void;
}

export const VoiceWidget = ({ wsUrl, token, onError }: VoiceWidgetProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { shouldConnect, connect, disconnect } = useConnection();
  const windowSize = useWindowResize();
  const isMobile = windowSize.width < 768;

  const handleConnect = async (c: boolean) => {
    if (c) {
      connect();
      setIsConnected(true);
    } else {
      disconnect();
      setIsConnected(false);
      setIsActive(false);
    }
  };

  const handleBlobClick = () => {
    setIsActive(true);
    handleConnect(true);
  };

  return (
    <div className="relative w-full max-w-[800px] mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={isActive ? 'active' : 'inactive'}
          initial={false}
          animate={{
            height: isMobile ? '220px' : (isActive ? '240px' : '240px'),
            borderRadius: '24px',
            scale: isMobile ? 0.95 : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`relative mx-auto overflow-hidden ${isActive ? 'bg-black/80 backdrop-blur-lg' : 'bg-gradient-to-r from-progressive-400 to-progressive-600 shadow-lg hover:shadow-progressive-400/20 cursor-pointer'}`}
          onClick={!isActive ? handleBlobClick : undefined}
        >
          {/* Background animation */}
          {!isActive && (
            <>
              <div className="absolute inset-0 bg-progressive-400 blur-lg opacity-40" />
              <motion.div
                className="absolute inset-0 border-2 border-progressive-400"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </>
          )}

          {/* Content */}
          <AnimatePresence mode="wait">
            {!isActive ? (
              <motion.div
                key="blob"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center text-white overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#FF6B6B] via-[#4ECDC4] to-[#45B7D1] opacity-90"
                  style={{ filter: 'blur(30px)', transform: 'scale(1.5)' }}
                  animate={{
                    background: [
                      'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1)',
                      'linear-gradient(90deg, #45B7D1, #FF6B6B, #4ECDC4)',
                      'linear-gradient(180deg, #4ECDC4, #45B7D1, #FF6B6B)',
                      'linear-gradient(270deg, #FF6B6B, #4ECDC4, #45B7D1)',
                    ],
                    scale: [1.5, 1.7, 1.5],
                    opacity: [0.8, 0.9, 0.8],
                  }}
                  transition={{
                    duration: 10,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tl from-[#9D50BB] via-[#6E48AA] to-[#FF6B6B] opacity-80"
                  style={{ filter: 'blur(40px)', transform: 'scale(1.2)' }}
                  animate={{
                    scale: [1.2, 1.4, 1.2],
                    opacity: [0.7, 0.8, 0.7],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 15,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                />
                <div className="relative z-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="assistant"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-full h-full flex items-center px-8"
              >
                <LiveKitRoom
                  className="w-full h-full"
                  serverUrl={wsUrl}
                  token={token}
                  connect={shouldConnect}
                  onError={onError}
                >
                  <SimpleAssistant onConnect={handleConnect} />
                  <RoomAudioRenderer />
                  <StartAudio label="Click to enable audio" />
                </LiveKitRoom>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
