import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, XCircle, Settings } from 'lucide-react';
import { Button } from '../components/ui/button';
import GlassCard from '../components/GlassCard';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function CloudinaryTest() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);

  const checkConfig = async () => {
    try {
      const response = await axios.get(`${API_URL}/test/cloudinary-config`);
      setConfig(response.data);
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error('Failed to check configuration');
      console.error(error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_URL}/test/cloudinary-upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
      toast.success('File uploaded successfully!');
    } catch (error: any) {
      const errorData = error.response?.data;
      setResult(errorData || { success: false, message: error.message });
      toast.error('Upload failed');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-[#f1f5f9] mb-8 text-center">
          Cloudinary Storage Test
        </h1>

        {/* Config Check */}
        <GlassCard className="mb-6">
          <h2 className="text-xl text-[#f1f5f9] mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuration Status
          </h2>
          <Button onClick={checkConfig} className="mb-4">
            Check Cloudinary Config
          </Button>
          {config && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                {config.configured ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className="text-[#f1f5f9]">{config.message}</span>
              </div>
              <div className="text-sm text-[#94a3b8] space-y-1 mt-2">
                <div>Cloud Name: {config.config.cloudName}</div>
                <div>API Key: {config.config.apiKey}</div>
                <div>API Secret: {config.config.apiSecret}</div>
              </div>
            </div>
          )}
        </GlassCard>

        {/* File Upload */}
        <GlassCard>
          <h2 className="text-xl text-[#f1f5f9] mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Test File Upload
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-[#f1f5f9] mb-2">Select File</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full text-[#f1f5f9] bg-[#1e293b] border border-[#6366f1]/30 rounded-lg p-2"
              />
            </div>

            {file && (
              <div className="text-[#94a3b8] text-sm">
                <p>File: {file.name}</p>
                <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
                <p>Type: {file.type}</p>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full"
            >
              {uploading ? 'Uploading...' : 'Upload to Cloudinary'}
            </Button>
          </div>

          {/* Result */}
          {result && (
            <div className="mt-6 p-4 rounded-lg border" 
                 style={{
                   borderColor: result.success ? '#10b981' : '#ef4444',
                   backgroundColor: result.success ? '#10b98120' : '#ef444420'
                 }}>
              <div className="flex items-center gap-2 mb-2">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className="text-[#f1f5f9] font-semibold">
                  {result.message}
                </span>
              </div>

              {result.success && result.url && (
                <div className="mt-4">
                  <p className="text-[#94a3b8] text-sm mb-2">Uploaded URL:</p>
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#6366f1] hover:underline break-all text-sm"
                  >
                    {result.url}
                  </a>
                  {result.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                    <div className="mt-4">
                      <img
                        src={result.url}
                        alt="Uploaded"
                        className="max-w-full rounded-lg"
                      />
                    </div>
                  )}
                </div>
              )}

              {result.error && (
                <pre className="mt-2 text-xs text-red-400 overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              )}
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
