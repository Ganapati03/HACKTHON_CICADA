import { motion } from 'motion/react';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Mail, Phone, MapPin, Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    setTimeout(() => {
      setSending(false);
      toast.success('Message sent successfully!', {
        description: 'Our AI assistant has received your message. We\'ll get back to you within 24 hours.',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'hello@mastersolis.com' },
    { icon: Phone, label: 'Phone', value: '+91 1234 567 890' },
    { icon: MapPin, label: 'Address', value: 'Bangalore, Karnataka, India' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl text-[#f1f5f9] mb-6">Get In Touch</h1>
            <p className="text-xl text-[#94a3b8] max-w-3xl mx-auto">
              Have a question or want to work together? We'd love to hear from you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard hover={false}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#14b8a6] flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-[#6366f1] mb-1">{info.label}</p>
                        <p className="text-[#f1f5f9]">{info.value}</p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}

              <GlassCard hover={false} className="bg-gradient-to-br from-[#6366f1]/10 to-[#14b8a6]/10">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-[#6366f1] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-[#f1f5f9] mb-2">AI-Powered Response</p>
                    <p className="text-[#94a3b8] text-sm">
                      Our AI assistant will analyze your message and route it to the right team
                      for the fastest response time.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <GlassCard>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[#f1f5f9] mb-2 block">Name</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="Your name"
                        className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
                      />
                    </div>
                    <div>
                      <label className="text-[#f1f5f9] mb-2 block">Email</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        placeholder="your@email.com"
                        className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[#f1f5f9] mb-2 block">Subject</label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      placeholder="How can we help?"
                      className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
                    />
                  </div>

                  <div>
                    <label className="text-[#f1f5f9] mb-2 block">Message</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      placeholder="Tell us more about your project..."
                      rows={6}
                      className="bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-gradient-to-r from-[#6366f1] to-[#14b8a6] rounded-lg py-6"
                  >
                    {sending ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="mr-2"
                        >
                          <Sparkles className="w-5 h-5" />
                        </motion.div>
                        Sending with AI...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </GlassCard>
            </motion.div>
          </div>

          {/* Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <GlassCard hover={false}>
              <div className="h-64 bg-gradient-to-br from-[#6366f1]/20 to-[#14b8a6]/20 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-[#6366f1] mx-auto mb-4" />
                  <p className="text-[#f1f5f9]">Find us in Bangalore</p>
                  <p className="text-[#94a3b8] text-sm">Interactive map coming soon</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
