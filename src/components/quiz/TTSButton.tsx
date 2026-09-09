'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, Square, Play, Pause } from 'lucide-react';

interface TTSButtonProps {
  text: string;
}

export default function TTSButton({ text }: TTSButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSupported(false);
    }
    
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlay = () => {
    if (!supported) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a good voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en-') && !v.localService) || voices.find(v => v.lang.startsWith('en-'));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    
    utterance.rate = 0.95; // Slightly slower for better comprehension of medical terms
    
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };
    
    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (!supported) return;
    window.speechSynthesis.pause();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleStop = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  if (!supported) return null;

  return (
    <div className="flex items-center gap-2 bg-black/20 rounded-lg p-1">
      {!isPlaying ? (
        <button 
          onClick={handlePlay}
          className="p-1.5 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Read out loud"
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      ) : (
        <button 
          onClick={handlePause}
          className="p-1.5 rounded-md text-blue-400 hover:bg-white/10 transition-colors"
          title="Pause reading"
        >
          <Pause className="w-4 h-4" />
        </button>
      )}
      
      {(isPlaying || isPaused) && (
        <button 
          onClick={handleStop}
          className="p-1.5 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Stop reading"
        >
          <Square className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
