import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, X, Send, Loader, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  text: string;
  isUser: boolean;
  isLoading?: boolean;
}

export default function VoiceChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [genAI, setGenAI] = useState<GoogleGenerativeAI | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  // Initialize Gemini AI
  useEffect(() => {
    if (GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenerativeAI(GEMINI_API_KEY);
        setGenAI(ai);
        console.log('✅ Gemini AI initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize Gemini AI:', error);
      }
    } else {
      console.warn('⚠️ Gemini API key not found in environment variables');
    }
  }, [GEMINI_API_KEY]);

  // Initialize Speech Recognition
  const initializeSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (event.results[event.results.length - 1].isFinal) {
          setInput(transcript);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        toast.error('Voice input error: ' + event.error);
        setIsListening(false);
      };
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      initializeSpeechRecognition();
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
    }
  };

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setIsSending(true);

    // Add loading message
    setMessages((prev) => [...prev, { text: 'Thinking...', isUser: false, isLoading: true }]);

    try {
      if (!genAI) {
        throw new Error('AI assistant is not initialized. Please add VITE_GEMINI_API_KEY to your .env file');
      }

      console.log('✅ Creating Gemini model...');
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
        generationConfig: {
          temperature: 0.9,
          topK: 64,
          topP: 0.95,
          maxOutputTokens: 512,
        }
      });

      const contextPrompt = `You are a helpful AI assistant for Mastersolis Infotech platform. Question: ${userMessage}. Answer in 2-3 friendly sentences. Do not use emojis.`;
      
      console.log('📤 Sending prompt to Gemini...');
      const result = await model.generateContent(contextPrompt);
      const response = await result.response;
      const aiResponse = response.text();
      
      console.log('✅ Gemini response received:', aiResponse);

      // Remove loading message and add AI response
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { text: aiResponse, isUser: false },
      ]);

      // Optional: Speak the response only if voice is enabled
      if (voiceEnabled) {
        speakResponse(aiResponse);
      }
    } catch (error: any) {
      console.error('❌ Gemini error:', error);
      
      let errorText = 'Sorry, I couldn\'t process that. Please try again! 😅';
      
      if (error?.message?.includes('API_KEY_INVALID') || error?.message?.includes('API key')) {
        errorText = '🔑 API key expired or invalid. Please get a new key from https://aistudio.google.com/app/apikey and add it to .env as VITE_GEMINI_API_KEY';
      } else if (error?.message?.includes('quota') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
        errorText = '⏰ API quota exceeded. Please try again later!';
      } else if (error?.message?.includes('initialized')) {
        errorText = '⏳ AI is starting up. Please add VITE_GEMINI_API_KEY to your .env file and restart!';
      }
      
      toast.error('Error getting response', {
        description: errorText,
      });
      
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { text: errorText, isUser: false },
      ]);
    } finally {
      setIsSending(false);
    }
  }, [input, genAI]);

  const speakResponse = (text: string) => {
    if (!voiceEnabled) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-[#6366f1] to-[#14b8a6] shadow-lg shadow-[#6366f1]/50 flex items-center justify-center z-40"
      >
        <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-16 right-4 sm:bottom-24 sm:right-6 w-[90vw] max-w-[500px] sm:w-96 h-[70vh] max-h-[500px] sm:h-[500px] bg-[#1e293b]/90 backdrop-blur-xl border border-[#6366f1]/30 rounded-2xl shadow-2xl z-40 flex flex-col"
          >
            <div className="p-3 sm:p-4 border-b border-[#6366f1]/30 flex items-center justify-between">
              <h3 className="text-sm sm:text-base text-[#f1f5f9]">AI Assistant</h3>
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className="p-1.5 sm:p-2 hover:bg-[#334155] rounded-lg transition-colors"
                  title={voiceEnabled ? 'Turn off voice' : 'Turn on voice'}
                >
                  {voiceEnabled ? (
                    <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#14b8a6]" />
                  ) : (
                    <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-[#94a3b8]" />
                  )}
                </button>
                <button onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-[#f1f5f9]" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
              {messages.length === 0 && (
                <p className="text-xs sm:text-sm text-[#94a3b8] text-center mt-8">
                  Start a conversation or use voice input
                </p>
              )}
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.isUser ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] p-2.5 sm:p-3 rounded-lg flex items-center gap-2 text-sm sm:text-base ${
                      msg.isUser
                        ? 'bg-gradient-to-r from-[#6366f1] to-[#14b8a6] text-white'
                        : 'bg-[#334155] text-[#f1f5f9]'
                    }`}
                  >
                    {msg.isLoading && <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />}
                    <span className="break-words">{msg.text}</span>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 sm:p-4 border-t border-[#6366f1]/30 flex gap-2">
              <Button
                onClick={toggleListening}
                disabled={isSending}
                variant="outline"
                size="icon"
                className={`shrink-0 ${
                  isListening ? 'bg-red-500 animate-pulse' : 'bg-[#334155]'
                } border-none`}
                title={isListening ? 'Listening...' : 'Click to start voice input'}
              >
                <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSend()}
                placeholder="Type your message..."
                disabled={isSending}
                className="flex-1 bg-[#334155] border-none text-[#f1f5f9] text-sm sm:text-base h-9 sm:h-10"
              />
              <Button
                onClick={handleSend}
                disabled={isSending || !input.trim()}
                size="icon"
                className="shrink-0 bg-gradient-to-r from-[#6366f1] to-[#14b8a6]"
              >
                {isSending ? <Loader className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" /> : <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
