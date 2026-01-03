'use client';

import { useState, useRef } from 'react';

interface FileUploadProps {
  title: string;
  description: string;
  uploadUrl: string;
  onSuccess?: (count: number) => void;
}

export default function FileUpload({ title, description, uploadUrl, onSuccess }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: '请先选择文件' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        let message = result.message || '上传成功';
        // 如果有警告信息，也显示出来
        if (result.data?.errors && result.data.errors.length > 0) {
          message += `\n注意：${result.data.errors.slice(0, 3).join('; ')}${result.data.errors.length > 3 ? '...' : ''}`;
        }
        setMessage({
          type: 'success',
          text: message
        });
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        if (onSuccess && result.data?.insertedCount) {
          onSuccess(result.data.insertedCount);
        }
      } else {
        setMessage({
          type: 'error',
          text: result.message || '上传失败'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: '网络错误，请重试'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>

      <div className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        {file && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700 truncate flex-1">
              {file.name}
            </span>
            <span className="text-xs text-gray-500 ml-2">
              {(file.size / 1024).toFixed(1)} KB
            </span>
          </div>
        )}

        {message && (
          <div
            className={`p-3 rounded-lg text-sm whitespace-pre-line ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition-colors ${
            !file || uploading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {uploading ? '上传中...' : '确认上传'}
        </button>
      </div>
    </div>
  );
}
