import React, { useState, useRef, useCallback } from 'react';
import { Mic, Square, Loader2, SendHorizontal } from 'lucide-react';
import { transcribeAudio } from '../services/geminiService';

interface AudioRecorderProps {
  onTranscription: (text: string) => void;
  isSending: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onTranscription, isSending }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        await handleTranscription(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Impossibile accedere al microfono. Verifica i permessi.");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const handleTranscription = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        // Remove the Data URL prefix (e.g., "data:audio/webm;base64,")
        const base64Content = base64String.split(',')[1];
        const mimeType = base64String.split(';')[0].split(':')[1] || 'audio/webm';

        const text = await transcribeAudio(base64Content, mimeType);
        onTranscription(text);
        setIsProcessing(false);
      };
    } catch (error) {
      console.error("Transcription failed", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isProcessing ? (
        <div className="flex items-center gap-2 text-gray-500 bg-gray-100 px-3 py-2 rounded-full">
          <Loader2 className="w-5 h-5 animate-spin text-green-600" />
          <span className="text-sm font-medium">Trascrizione con Gemini...</span>
        </div>
      ) : isRecording ? (
        <button
          onClick={stopRecording}
          className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors animate-pulse shadow-lg"
          title="Stop Recording"
        >
          <Square className="w-5 h-5 fill-current" />
        </button>
      ) : (
        <button
          onClick={startRecording}
          disabled={isSending}
          className="p-3 text-gray-500 hover:bg-gray-100 rounded-full transition-colors active:scale-95 disabled:opacity-50"
          title="Record Audio Message"
        >
          <Mic className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};