"use client";

import { useState, useRef, useEffect } from "react";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop";

interface CropperModalProps {
    imageUrl: string;
    aspectRatio: number;
    onCropComplete: (croppedBlob: Blob) => void;
    onClose: () => void;
}

export default function CropperModal({
    imageUrl,
    aspectRatio,
    onCropComplete,
    onClose
}: CropperModalProps) {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [loading, setLoading] = useState(false);

    // Handle modal click to prevent closing when clicking inside content
    const handleModalContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const onCropChange = (location: Point) => {
        setCrop(location);
    };

    const onZoomChange = (newZoom: number) => {
        setZoom(newZoom);
    };

    const onCropAreaChange = (croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const createCroppedImage = async () => {
        try {
            setLoading(true);
            const croppedBlob = await getCroppedImg(imageUrl, croppedAreaPixels);
            if (croppedBlob) {
                onCropComplete(croppedBlob);
            }
        } catch (error) {
            console.error("Error creating cropped image:", error);
        } finally {
            setLoading(false);
        }
    };

    // Function to crop the image
    const getCroppedImg = async (imageSrc: string, pixelCrop?: Area | null): Promise<Blob | null> => {
        if (!pixelCrop) return null;

        const image = new Image();
        image.src = imageSrc;

        return new Promise((resolve) => {
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    resolve(null);
                    return;
                }

                canvas.width = pixelCrop.width;
                canvas.height = pixelCrop.height;

                ctx.drawImage(
                    image,
                    pixelCrop.x,
                    pixelCrop.y,
                    pixelCrop.width,
                    pixelCrop.height,
                    0,
                    0,
                    pixelCrop.width,
                    pixelCrop.height
                );

                canvas.toBlob(
                    (blob) => {
                        resolve(blob);
                    },
                    'image/jpeg',
                    0.95
                );
            };
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-xl shadow-xl max-w-md w-full relative overflow-hidden"
                onClick={handleModalContentClick}
            >
                <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Crop Image</h3>
                    <button
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        onClick={onClose}
                    >
                        <svg
                            className="w-5 h-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                <div className="relative h-72">
                    <Cropper
                        image={imageUrl}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspectRatio}
                        onCropChange={onCropChange}
                        onCropComplete={onCropAreaChange}
                        onZoomChange={onZoomChange}
                    />
                </div>

                <div className="p-4">
                    <div className="mb-4">
                        <label htmlFor="zoom" className="block text-sm font-medium text-gray-700 mb-1">
                            Zoom
                        </label>
                        <input
                            id="zoom"
                            type="range"
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={createCroppedImage}
                            disabled={loading}
                            className="flex-1 py-2 px-4 bg-primary rounded-lg text-white font-medium hover:bg-primary/90 transition-colors disabled:bg-primary/70"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing
                                </div>
                            ) : (
                                "Apply"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}