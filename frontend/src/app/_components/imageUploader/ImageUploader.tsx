// send-driver-verification/_components/ImageUploader.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import CropperModal from "./CropperModal";

interface ImageUploaderProps {
    imageUrl: string | null;
    onImageChange: (file: File, previewUrl: string) => void;
    aspectRatio?: number;
    disabled?: boolean;

}

export default function ImageUploader({
    imageUrl,
    onImageChange,
    aspectRatio = 1,
    disabled = false,
}: ImageUploaderProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result as string);
                setIsModalOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = async (croppedImageBlob: Blob) => {
        const croppedImageUrl = URL.createObjectURL(croppedImageBlob);

        const imageFile = new File([croppedImageBlob], "cropped_image.jpg", {
            type: croppedImageBlob.type,
        });

        onImageChange(imageFile, croppedImageUrl);
        setIsModalOpen(false);
        if (fileInputRef.current?.value) {
            fileInputRef.current.value = ""
        }
    };

    return (
        <>
            <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center relative h-full overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
            >
                {imageUrl ? (
                    <>
                        <img
                            src={imageUrl}
                            alt="Uploaded"
                            className="object-cover w-full h-full absolute inset-0"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <p className="text-white font-medium">Click to change</p>
                        </div>
                    </>
                ) : (
                    <>
                        <svg
                            className="w-10 h-10 text-gray-400 mb-2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                            />
                        </svg>
                        <p className="text-sm text-gray-500 text-center">
                            Click to upload or drag and drop<br />
                            <span className="text-xs">JPG, PNG, GIF (max 5MB)</span>
                        </p>
                    </>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            {/* Cropper Modal */}
            {isModalOpen && selectedImage && (
                <CropperModal
                    imageUrl={selectedImage}
                    aspectRatio={aspectRatio}
                    onCropComplete={handleCropComplete}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
}