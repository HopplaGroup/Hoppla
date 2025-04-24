"use client";
import Image from "next/image";
import * as m from "@/paraglide/messages.js";
import { menv } from "@/lib/utils/menv";
import { cn } from "@/lib/utils/cn";
import {
    LogoutLink,
    RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { Prisma } from "@prisma/client";
import { Link } from "@/lib/i18n";
import { useState, useRef, useEffect } from "react";
import {
    ChevronDown,
    User,
    Settings,
    LogOut,
    Shield,
    FileCheck,
} from "lucide-react";

export default function AuthBlock({
    user,
}: {
    user: Prisma.UserGetPayload<{
        include: { driverVerificationRequest: { select: { status: true } } };
    }> | null;
}) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Function to close dropdown
    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    return (
        <>
            {user && (
                <div className="relative" ref={dropdownRef}>
                    <button
                        className="relative flex min-w-10 justify-between items-center py-3.5 px-4 rounded-full bg-transparent hover:bg-gray-200 transition-colors"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <Image
                            src={user.profileImg}
                            alt="user avatar"
                            width={25}
                            height={25}
                            className="absolute left-3 object-cover size-[30px] rounded-full"
                        />
                        <div className="w-[25px]"></div>
                        <div className="md:flex flex-col items-start ml-2 max-w-[200px] overflow-hidden">
                            <div className="flex justify-center items-center gap-1">
                                <span className="text-sm">
                                    {user.balance.toFixed(2)}
                                </span>
                            </div>
                        </div>
                        <ChevronDown className="h-4 w-4 ml-2" />
                    </button>

                    {/* Dropdown menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                            {/* Label */}
                            <div className="px-4 py-2 text-sm font-medium text-gray-900">
                                {m.raw_front_goat_scold()}
                            </div>

                            {/* Separator */}
                            <div className="h-px bg-gray-200 my-1"></div>

                            {/* Profile Link */}
                            <Link
                                href="/profile"
                                className="flex items-center px-4 py-2 text-sm  hover:bg-gray-100"
                                onClick={closeDropdown}
                            >
                                <User className="h-4 w-4 mr-2" />
                                {m.bad_caring_wallaby_pull()}
                            </Link>

                            {/* Admin Link - conditional */}
                            {user.role === "ADMIN" && (
                                <Link
                                    href="/admin"
                                    className="flex items-center px-4 py-2 text-sm  hover:bg-gray-100"
                                    onClick={closeDropdown}
                                >
                                    <Shield className="h-4 w-4 mr-2" />
                                    {m.quaint_elegant_stork_climb()}
                                </Link>
                            )}

                            {/* Driver Verification Link - conditional */}
                            {(!user.driverVerificationRequest ||
                                user.driverVerificationRequest.status ==
                                "PENDING") && (
                                    <Link
                                        href="/send-driver-verification"
                                        className="flex items-center px-4 py-2 text-sm  hover:bg-gray-100"
                                        onClick={closeDropdown}
                                    >
                                        <FileCheck className="h-4 w-4 mr-2" />
                                        {m.suave_keen_lion_enjoy()}
                                    </Link>
                                )}
                            {user.driverVerificationRequest && user.driverVerificationRequest.status !== "PENDING" &&
                                <Link
                                    href="/send-driver-verification"
                                    className="flex items-center px-4 py-2 text-sm  hover:bg-gray-100"
                                    onClick={closeDropdown}
                                >
                                    <FileCheck className="h-4 w-4 mr-2" />
                                    {m.fine_silly_bison_pet()}
                                </Link>
                            }
                            {/* Logout Link */}
                            <div className="p-0">
                                <LogoutLink
                                    className="w-full h-full px-4 py-2 flex items-center text-sm  hover:bg-gray-100"
                                    onClick={closeDropdown}
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    {m.extra_lucky_rook_trust()}
                                </LogoutLink>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Login button for non-authenticated users */}
            {!user && (
                <RegisterLink
                    authUrlParams={{
                        connection_id: menv.NEXT_PUBLIC_KINDE_CONNECTION_GOOGLE,
                    }}
                    className={cn(
                        "bg-transparent hover:bg-gray-200 ",
                        "flex items-center gap-2 rounded-full px-4 py-3.5 text-sm font-medium transition-colors"
                    )}
                >
                    <>
                        <img
                            alt="google logo"
                            className="size-5"
                            src="/assets/g-logo.png"
                        />{" "}
                        <span className="hidden sm:block">
                            {m.plane_weird_macaw_slurp()}
                        </span>
                    </>
                </RegisterLink>
            )}
        </>
    );
}
