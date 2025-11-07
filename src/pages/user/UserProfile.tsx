import { motion } from 'motion/react';
import { useState } from 'react';
import UserLayout from '../../components/UserLayout';
import GlassCard from '../../components/GlassCard';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { User, Mail, Phone, MapPin, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner@2.0.3';

export default function UserProfile() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name: formData.name, email: formData.email });
    toast.success('Profile updated successfully!');
  };

  return (
    <UserLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl text-[#f1f5f9] mb-2">Profile</h1>
        <p className="text-[#94a3b8] mb-8">Manage your account details</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <GlassCard>
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[#6366f1] to-[#14b8a6] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl text-[#f1f5f9] mb-1">{user?.name}</h3>
                <p className="text-[#94a3b8] mb-4">{user?.email}</p>
                
                <Button
                  variant="outline"
                  className="w-full border-[#6366f1] text-[#6366f1]"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Change Photo
                </Button>
              </div>
            </GlassCard>
          </motion.div>

          {/* Profile Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <GlassCard>
              <h2 className="text-2xl text-[#f1f5f9] mb-6">Personal Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-[#f1f5f9]">Full Name</Label>
                    <div className="relative mt-2">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6366f1]" />
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-10 bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-[#f1f5f9]">Email</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6366f1]" />
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10 bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-[#f1f5f9]">Phone</Label>
                    <div className="relative mt-2">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6366f1]" />
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 1234567890"
                        className="pl-10 bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-[#f1f5f9]">Location</Label>
                    <div className="relative mt-2">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6366f1]" />
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Bangalore, India"
                        className="pl-10 bg-[#0f172a]/50 border-[#6366f1]/30 text-[#f1f5f9]"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#6366f1] to-[#14b8a6]"
                >
                  Save Changes
                </Button>
              </form>
            </GlassCard>

            {/* Resume Section */}
            <GlassCard className="mt-6">
              <h2 className="text-2xl text-[#f1f5f9] mb-4">Resume</h2>
              <div className="border-2 border-dashed border-[#6366f1]/30 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-[#6366f1] mx-auto mb-4" />
                <p className="text-[#f1f5f9] mb-2">Upload your resume</p>
                <p className="text-[#94a3b8] text-sm mb-4">PDF, DOC, or DOCX (Max 5MB)</p>
                <Button className="bg-[#6366f1]">
                  Choose File
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>
    </UserLayout>
  );
}
