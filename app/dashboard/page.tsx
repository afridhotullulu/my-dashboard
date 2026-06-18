'use client';

import { useState, useRef, useEffect } from 'react';
// 1. Pastikan import useRouter berasal dari 'next/navigation' (bukan 'next/router')
import { useRouter } from 'next/navigation'; 

export default function DashboardUpload() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [status, setStatus] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true); // Untuk mencegah "flicker" UI

  // 🔒 Pengecekan Login
  useEffect(() => {
    // Ambil data status login (sesuaikan nama 'isLoggedIn' dengan yang kamu pakai di halaman login)
    const isUserLoggedIn = localStorage.getItem('isLoggedIn'); 
    
    if (!isUserLoggedIn) {
      // Jika tidak ada data login, langsung pindahkan ke halaman login
      router.push('/login'); 
    } else {
      // Jika ada, matikan loading pengecekan
      setCheckingAuth(false);
    }
  }, [router]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fileInputRef.current?.files?.[0]) {
      setStatus('Silakan pilih file terlebih dahulu.');
      return;
    }

    const file = fileInputRef.current.files[0];
    setUploading(true);
    setStatus('Sedang mengunggah ke server cloud Vercel...');

    try {
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      const newBlob = await response.json();

      if (response.ok && newBlob.success) {
        setStatus('🎉 Hore! File berhasil diunggah.');
        setFileUrl(newBlob.url);
      } else {
        setStatus('❌ Gagal mengunggah file.');
      }
    } catch (error) {
      setStatus('❌ Terjadi kesalahan jaringan.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  // Jika masih proses mengecek status login, tampilkan loading kosong agar halaman dashboard tidak mengintip
  if (checkingAuth) {
    return <div className="p-6 text-center text-sm text-gray-500">Memeriksa autentikasi...</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-2xl shadow-md border border-gray-100 my-10">
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

      {status && (
        <p className={`mt-4 p-3 text-xs text-center rounded-lg font-medium ${status.includes('🎉') ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
          {status}
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