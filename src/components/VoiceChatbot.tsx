import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, X, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function VoiceChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages([...messages, { text: input, isUser: true }]);
    
    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "I'm here to help! This is a demo AI assistant for Mastersolis Infotech.", 
        isUser: false 
      }]);
    }, 1000);
    
    setInput('');
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setInput("Voice input detected (demo)");
      }, 2000);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-[#6366f1] to-[#14b8a6] shadow-lg shadow-[#6366f1]/50 flex items-center justify-center z-40"
      >
        <Mic className="w-6 h-6 text-white" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-[#1e293b]/90 backdrop-blur-xl border border-[#6366f1]/30 rounded-2xl shadow-2xl z-40 flex flex-col"
          >
            <div className="p-4 border-b border-[#6366f1]/30 flex items-center justify-between">
              <h3 className="text-[#f1f5f9]">AI Assistant</h3>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5 text-[#f1f5f9]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <p className="text-[#94a3b8] text-center mt-8">
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
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.isUser
                        ? 'bg-gradient-to-r from-[#6366f1] to-[#14b8a6] text-white'
                        : 'bg-[#334155] text-[#f1f5f9]'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-4 border-t border-[#6366f1]/30 flex gap-2">
              <Button
                onClick={toggleListening}
                variant="outline"
                size="icon"
                className={`${
                  isListening ? 'bg-red-500 animate-pulse' : 'bg-[#334155]'
                } border-none`}
              >
                <Mic className="w-4 h-4" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 bg-[#334155] border-none text-[#f1f5f9]"
              />
              <Button
                onClick={handleSend}
                size="icon"
                className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6]"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
