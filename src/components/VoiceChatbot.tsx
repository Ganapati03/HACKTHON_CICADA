import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [mounted, setMounted] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  // Ensure component is mounted before rendering portal
  useEffect(() => {
    setMounted(true);
    console.log('🟢 VoiceChatbot mounted');
  }, []);

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
      console.warn('⚠️ Gemini API key not found');
    }
  }, [GEMINI_API_KEY]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    } else {
      toast.error('Speech recognition not supported');
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

    setMessages((prev) => [...prev, { text: 'Thinking...', isUser: false, isLoading: true }]);

    try {
      if (!genAI) {
        throw new Error('AI assistant is not initialized. Please add VITE_GEMINI_API_KEY to your .env file');
      }

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
      
      const result = await model.generateContent(contextPrompt);
      const response = await result.response;
      const aiResponse = response.text();

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { text: aiResponse, isUser: false },
      ]);

      if (voiceEnabled) {
        speakResponse(aiResponse);
      }
    } catch (error: any) {
      console.error('❌ Gemini error:', error);
      
      let errorText = 'Sorry, I couldn\'t process that. Please try again!';
      
      if (error?.message?.includes('API_KEY_INVALID') || error?.message?.includes('API key')) {
        errorText = 'API key expired or invalid. Please get a new key from https://aistudio.google.com/app/apikey';
      } else if (error?.message?.includes('quota') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
        errorText = 'API quota exceeded. Please try again later!';
      } else if (error?.message?.includes('initialized')) {
        errorText = 'AI is starting up. Please add VITE_GEMINI_API_KEY to your .env file and restart!';
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
  }, [input, genAI, voiceEnabled]);

  const speakResponse = (text: string) => {
    if (!voiceEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  // Don't render until mounted
  if (!mounted) return null;

  const chatbotContent = (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            console.log('🔵 Chatbot button clicked');
            setIsOpen(true);
          }}
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '9999px',
            background: 'linear-gradient(to right, #6366f1, #14b8a6)',
            boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            border: 'none',
            cursor: 'pointer',
          }}
          title="Open AI Assistant"
        >
          <Mic style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              bottom: '6rem',
              right: '1.5rem',
              width: '24rem',
              maxWidth: 'calc(100vw - 2rem)',
              height: '500px',
              maxHeight: '70vh',
              zIndex: 999999,
              display: 'flex',
              flexDirection: 'column',
            }}
            className="bg-[#1e293b]/95 backdrop-blur-xl border border-[#6366f1]/30 rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#6366f1]/30 flex items-center justify-between bg-gradient-to-r from-[#6366f1]/10 to-[#14b8a6]/10 rounded-t-2xl">
              <div>
                <h3 className="text-base text-[#f1f5f9] font-semibold">AI Assistant</h3>
                <p className="text-xs text-[#94a3b8]">Powered by Gemini</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className="p-2 hover:bg-[#334155] rounded-lg transition-colors"
                  title={voiceEnabled ? 'Turn off voice' : 'Turn on voice'}
                >
                  {voiceEnabled ? (
                    <Volume2 className="w-5 h-5 text-[#14b8a6]" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-[#94a3b8]" />
                  )}
                </button>
                <button 
                  onClick={() => {
                    console.log('🔴 Closing chatbot');
                    setIsOpen(false);
                  }}
                  className="p-2 hover:bg-[#334155] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#f1f5f9]" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center mt-8 space-y-2">
                  <p className="text-sm text-[#94a3b8]">
                    👋 Hi! I'm your AI assistant.
                  </p>
                  <p className="text-xs text-[#64748b]">
                    Ask me anything or use voice input!
                  </p>
                </div>
              )}
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.isUser ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg flex items-center gap-2 text-base ${
                      msg.isUser
                        ? 'bg-gradient-to-r from-[#6366f1] to-[#14b8a6] text-white'
                        : 'bg-[#334155] text-[#f1f5f9]'
                    }`}
                  >
                    {msg.isLoading && <Loader className="w-4 h-4 animate-spin" />}
                    <span className="break-words">{msg.text}</span>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[#6366f1]/30 flex gap-2 bg-[#0f172a]/50 rounded-b-2xl">
              <Button
                onClick={toggleListening}
                disabled={isSending}
                variant="outline"
                size="icon"
                className={`shrink-0 ${
                  isListening ? 'bg-red-500 animate-pulse' : 'bg-[#334155]'
                } border-none hover:bg-[#475569]`}
                title={isListening ? 'Listening...' : 'Click to start voice input'}
              >
                <Mic className="w-4 h-4" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSend()}
                placeholder="Type your message..."
                disabled={isSending}
                className="flex-1 bg-[#334155] border-none text-[#f1f5f9] text-base h-10 placeholder:text-[#64748b]"
              />
              <Button
                onClick={handleSend}
                disabled={isSending || !input.trim()}
                size="icon"
                className="shrink-0 bg-gradient-to-r from-[#6366f1] to-[#14b8a6] hover:from-[#5558e3] hover:to-[#11a89b]"
              >
                {isSending ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  // Use React Portal to render at document.body level
  return createPortal(chatbotContent, document.body);
}