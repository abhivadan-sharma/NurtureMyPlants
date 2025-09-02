import { useRef, useState } from 'react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
}

const ImageUpload = ({ onImageSelect }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Please upload a JPEG, PNG, or WebP image file.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 10MB.';
    }
    return null;
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const MAX_SIZE = 1024;
        let { width, height } = img;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > MAX_SIZE) {
            height = (height * MAX_SIZE) / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = (width * MAX_SIZE) / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          file.type,
          0.8 // Quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };


  const handleFileSelect = async (file: File) => {
    setError(null);
    setIsProcessing(true);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setIsProcessing(false);
      return;
    }

    try {
      // Compress the image
      const compressedFile = await compressImage(file);
      
      // Create preview
      const previewUrl = URL.createObjectURL(compressedFile);
      setPreview(previewUrl);
      
      // Call parent callback
      onImageSelect(compressedFile);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to process image. Please try another file.');
      }
      console.error('Image processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setError(null);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
            isProcessing
              ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 cursor-wait'
              : isDragging
              ? 'border-plant-green bg-gradient-to-br from-soft-mint to-green-50 transform scale-105'
              : error
              ? 'border-red-400 bg-gradient-to-br from-red-50 to-pink-50'
              : 'border-gray-300 hover:border-plant-green hover:bg-gradient-to-br hover:from-soft-mint hover:to-green-50 hover:transform hover:scale-105'
          }`}
        >
          <div className="space-y-6">
            <div className={`text-7xl transition-all duration-300 ${isDragging ? 'animate-bounce-subtle' : ''}`}>
              📸
            </div>
            <div>
              <p className="text-xl font-display font-semibold text-gray-800 mb-3">
                {isProcessing ? 'Processing Image...' : 'Upload Your Plant Photo'}
              </p>
              <p className="text-sage-green mb-2">
                {isProcessing ? 'Optimizing image for analysis' : 'Click here or drag and drop your image'}
              </p>
              <p className="text-xs text-gray-500 bg-white/70 rounded-full px-3 py-1 inline-block">
                JPEG, PNG, WebP • Max 10MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative max-w-xs mx-auto">
          <img
            src={preview}
            alt="Plant preview"
            className="w-full h-48 object-cover rounded-xl shadow-lg"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-md transition-colors duration-200"
          >
            ×
          </button>
          <div className="mt-4 p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border border-green-200">
            <p className="text-sm text-green-800 text-center font-medium">
              ✅ Image ready for identification
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;