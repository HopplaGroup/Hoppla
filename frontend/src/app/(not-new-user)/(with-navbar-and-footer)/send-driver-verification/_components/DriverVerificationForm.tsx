// send-driver-verification/_components/DriverVerificationForm.tsx
"use client";

import { useState, useEffect } from "react";
import { User, DriverVerificationRequest } from "@prisma/client";
import { submitDriverVerification } from "../_actions/submitDriverVerification";
import { updateDriverVerification } from "../_actions/updateDriverVerification";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ImageUploader from "@/app/_components/imageUploader/ImageUploader";
import { checkRateLimitAction } from "../_actions/checkRateLimit";
import RateLimitTimer from "./RateLimitTimer";
import * as m from "@/paraglide/messages.js";

interface DriverVerificationFormProps {
    existingRequest?: DriverVerificationRequest;
    isRateLimited: boolean;
    timeUntilRateLimitGained: number | null
}

export default function DriverVerificationForm({ existingRequest, isRateLimited: _isRateLimited, timeUntilRateLimitGained: _timeUntilRateLimitGained }: DriverVerificationFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [licenceFrontImg, setLicenceFrontImg] = useState<string | null>(null);
    const [licenceBackImg, setLicenceBackImg] = useState<string | null>(null);
    const [selfieImg, setSelfieImg] = useState<string | null>(null);

    const [licenceFrontFile, setLicenceFrontFile] = useState<File | null>(null);
    const [licenceBackFile, setLicenceBackFile] = useState<File | null>(null);
    const [selfieFile, setSelfieFile] = useState<File | null>(null);
    const [timeUntilRateLimitGained, setTimeUntilRateLimitGained] = useState<number | null>(_timeUntilRateLimitGained);
    const [isRateLimited, setIsRateLimited] = useState(_isRateLimited);


    // TODO: DONT upload if no new files changed

    const checkRateLimit = async () => {
        try {
            const res = await checkRateLimitAction({});

            if (res.success) {
                console.log(res.data)
                setIsRateLimited(!res.data.canUpload);
                if (!res.data.canUpload) {
                    setTimeUntilRateLimitGained(res.data.msBeforeNext);
                }
            }
        } catch (error) {
            console.error("Failed to check rate limit:", error);
        }
    };

    useEffect(() => {
        if (existingRequest) {
            // Set preview images from existing request
            if (existingRequest.licencePhotos.length >= 2) {
                setLicenceFrontImg(existingRequest.licencePhotos[0]);
                setLicenceBackImg(existingRequest.licencePhotos[1]);
            }
            setSelfieImg(existingRequest.selfie);
        }

    }, [existingRequest]);

    const handleTimerComplete = () => {
        setIsRateLimited(false);
        setTimeUntilRateLimitGained(null);
        checkRateLimit(); // Verify the rate limit is actually lifted
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Double-check rate limit before submission
        await checkRateLimit();
        if (isRateLimited) {
            toast.error(m.home_great_elephant_race());
            return;
        }

        const needsUploadFront = licenceFrontFile !== null;
        const needsUploadBack = licenceBackFile !== null;
        const needsUploadSelfie = selfieFile !== null;

        // If we're editing but no new files selected, validate we already have images
        if (!needsUploadFront && !licenceFrontImg) {
            toast.error(m.noble_dizzy_okapi_imagine());
            return;
        }
        if (!needsUploadBack && !licenceBackImg) {
            toast.error(m.basic_hour_starfish_laugh());
            return;
        }
        if (!needsUploadSelfie && !selfieImg) {
            toast.error(m.aware_quaint_koala_build());
            return;
        }

        setIsSubmitting(true);

        try {
            let frontUrl = licenceFrontImg;
            let backUrl = licenceBackImg;
            let selfieUrl = selfieImg;

            // Only upload new files if they exist
            if (needsUploadFront) {
                const frontFormData = new FormData();
                frontFormData.append("file", licenceFrontFile!, "licence_front.jpg");
                frontFormData.append("category", "licences");
                const frontResponse = await fetch("/api/s3-upload", {
                    method: "POST",
                    body: frontFormData,
                });
                const frontData = await frontResponse.json();
                frontUrl = frontData.fileUrl;
            }

            if (needsUploadBack) {
                const backFormData = new FormData();
                backFormData.append("file", licenceBackFile!, "licence_back.jpg");
                backFormData.append("category", "licences");
                const backResponse = await fetch("/api/s3-upload", {
                    method: "POST",
                    body: backFormData,
                });
                const backData = await backResponse.json();
                backUrl = backData.fileUrl;
            }

            if (needsUploadSelfie) {
                const selfieFormData = new FormData();
                selfieFormData.append("file", selfieFile!, "selfie.jpg");
                selfieFormData.append("category", "selfies");
                const selfieResponse = await fetch("/api/s3-upload", {
                    method: "POST",
                    body: selfieFormData,
                });
                const selfieData = await selfieResponse.json();
                selfieUrl = selfieData.fileUrl;
            }

            // Prepare the data object
            const verificationData = {
                licencePhotos: [frontUrl!, backUrl!],
                selfie: selfieUrl!,
            };

            // Decide whether to update or create based on existingRequest
            const result = existingRequest
                ? await updateDriverVerification({
                    ...verificationData,
                    requestId: existingRequest.id,
                })
                : await submitDriverVerification(verificationData);

            if (result.success) {
                toast.success(existingRequest
                    ? m.stock_wild_beetle_pull()
                    : m.short_sour_bulldog_value()
                );
                router.refresh(); // Refresh the current page to show updated status
                checkRateLimit(); // Check if we're now rate limited after upload
            } else {
                toast.error( m.plain_dizzy_anteater_skip());
            }
        } catch (error) {
            toast.error(m.direct_wide_wren_zap());
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isRateLimited && timeUntilRateLimitGained) {
        return (
            <div className="space-y-6">
                <RateLimitTimer
                    initialTimeMs={timeUntilRateLimitGained}
                    onTimerComplete={handleTimerComplete}
                />

                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{m.left_ornate_carp_boil()}</h3>
                    <p className="text-gray-600">
                        {m.muddy_legal_ostrich_drip()}
                    </p>
                    <p className="text-gray-600 mt-2">
                        {m.swift_aqua_platypus_pray()}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {m.game_basic_mole_splash()} <span className="text-red-500">*</span>
                    </label>
                    <div className="h-40">
                        <ImageUploader
                            imageUrl={licenceFrontImg}
                            onImageChange={(file, preview) => {
                                setLicenceFrontImg(preview);
                                setLicenceFrontFile(file);
                            }}
                            aspectRatio={4 / 3}
                            disabled={isRateLimited}
                        />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                        {m.soft_fresh_stork_cook()}
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {m.north_basic_penguin_support()} <span className="text-red-500">*</span>
                    </label>
                    <div className="h-40">
                        <ImageUploader
                            imageUrl={licenceBackImg}
                            onImageChange={(file, preview) => {
                                setLicenceBackImg(preview);
                                setLicenceBackFile(file);
                            }}
                            aspectRatio={4 / 3}
                            disabled={isRateLimited}
                        />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                        {m.day_sunny_jackal_jest()}
                    </p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {m.stock_equal_whale_exhale()} <span className="text-red-500">*</span>
                </label>
                <div className="sm:size-52 aspect-square">
                    <ImageUploader
                        imageUrl={selfieImg}
                        onImageChange={(file, preview) => {
                            setSelfieImg(preview);
                            setSelfieFile(file);
                        }}
                        aspectRatio={1}
                        disabled={isRateLimited}
                    />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                    {m.loose_odd_starfish_startle()}
                </p>
            </div>

            <div className="mt-8">
                <button
                    type="submit"
                    disabled={isSubmitting || isRateLimited}
                    className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                    ${(isSubmitting || isRateLimited)
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-primary hover:bg-primary/90'}`}
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {m.weary_patchy_capybara_tear()}
                        </div>
                    ) : (
                        existingRequest ? m.good_loved_ox_devour() : m.loud_loose_scallop_sew()
                    )}
                </button>
            </div>

            <div className="text-center text-sm text-gray-500 mt-4">
                <p>
                    {m.loved_silly_donkey_gasp()}
                </p>
            </div>
        </form>
    );
}