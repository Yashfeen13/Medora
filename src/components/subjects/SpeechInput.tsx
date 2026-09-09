'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechInputProps {
  onResult: (text: string) => void;
}

export default function SpeechInput({ onResult }: SpeechInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check support
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
        return;
      }
      
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setError('');
        setTranscript('');
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const text = result[0].transcript;
        
        setTranscript(text);
        
        if (result.isFinal) {
          onResult(text);
          setIsRecording(false);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
        
        if (event.error === 'not-allowed') {
          setError('Microphone access denied');
        } else {
          setError('Error recording. Please try again.');
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [onResult]);

  const toggleRecording = () => {
    if (!isSupported) return;
    
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
      } catch (e) {
        // Handle case where recognition is already started
        console.error(e);
      }
    }
  };

  if (!isSupported) {
    return (
      <button 
        disabled
        className="p-3 rounded-full bg-white/5 text-gray-500 cursor-not-allowed border border-white/10"
        title="Voice search not supported in this browser"
      >
        <MicOff className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="relative flex items-center">
      <button
        onClick={toggleRecording}
        className={`relative p-3 rounded-full transition-all duration-300 ${
          isRecording 
            ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
            : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
        }`}
        title={isRecording ? 'Stop recording' : 'Search by voice'}
      >
        {isRecording && (
          <span className="absolute inset-0 rounded-full border border-red-500 animate-ping opacity-75" />
        )}
        
        {isRecording ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5" />}
      </button>
      
      {/* Tooltip for transcript or error */}
      {(transcript || error) && (
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-xl text-sm whitespace-nowrap border border-white/10 pointer-events-none animate-in fade-in zoom-in duration-200">
          {error ? (
            <span className="text-red-400">{error}</span>
          ) : (
            <span className="text-white italic">&quot;{transcript}&quot;</span>
          )}
        </div>
      )}
    </div>
  );
}
