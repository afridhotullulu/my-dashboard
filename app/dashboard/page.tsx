'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; // 🌟 Menggunakan session bawaan NextAuth

export default function DashboardUpload() {
  const router = useRouter();
  const { data: session, status } = useSession(); // 🌟 Ambil data user & status login Google
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');

  // 🔒 SATPAM: Cek Akun Google Otomatis
  useEffect(() => {
    if (status === 'unauthenticated') {
      // Jika terbukti TIDAK login Google, tendang ke halaman login
      router.push('/login');
    }
  }, [status, router]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileInputRef.current?.files?.[0]) {
      setUploadStatus('Silakan pilih file terlebih dahulu.');
      return;
    }

    const file = fileInputRef.current.files[0];
    setUploading(true);
    setUploadStatus('Sedang mengunggah ke server cloud Vercel...');

    try {
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      const newBlob = await response.json();

      if (response.ok && newBlob.success) {
        setUploadStatus('🎉 Hore! File berhasil diunggah.');
        setFileUrl(newBlob.url);
      } else {
        setUploadStatus('❌ Gagal mengunggah file.');
      }
    } catch (error) {
      setUploadStatus('❌ Terjadi kesalahan jaringan.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  // Jika sedang loading mengecek akun Google, tampilkan loading agar dashboard tidak mengintip
  if (status === 'loading') {
    return <div className="p-6 text-center text-sm text-gray-500">Memeriksa akun Google...</div>;
  }

  // Jika aman dan user sudah login, tampilkan fitur upload & profil
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-2xl shadow-md border border-gray-100 my-10">
      {/* 👤 MENAMPILKAN PROFIL USER GOOGLE */}
      {session?.user && (
        <div className="flex items-center gap-3 mb-6 p-3 bg-blue-50 rounded-xl">
          {session.user.image && (
            <img src={session.user.image} alt="Foto Profil" className="w-10 h-10 rounded-full" />
          )}
          <div>
            <p className="text-xs text-gray-500">Selamat datang,</p>
            <p className="text-sm font-bold text-gray-800">{session.user.name}</p>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold mb-2 text-gray-800">Upload File Ke Cloud Dashboard</h2>
      <p className="text-xs text-gray-500 mb-6">File akan disimpan secara permanen di server Vercel Blob.</p>
      
      <form onSubmit={handleUpload} className="space-y-4">
        <input 
          type="file" 
          ref={fileInputRef}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          required
        />
        <button 
          type="submit" 
          disabled={uploading}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition disabled:bg-gray-400"
        >
          {uploading ? 'Proses Upload...' : 'Upload Sekarang'}
        </button>
      </form>

      {uploadStatus && (
        <p className={`mt-4 p-3 text-xs text-center rounded-lg font-medium ${uploadStatus.includes('🎉') ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
          {uploadStatus}
        </p>
      )}

      {fileUrl && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
          <p className="text-xs text-gray-600 mb-2">Link File Kamu:</p>
          <a href={fileUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline break-all">
            {fileUrl}
          </a>
        </div>
      )}
    </div>
  );
}