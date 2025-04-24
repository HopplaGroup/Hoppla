"use client";

import {
    CarFront,
    Globe,
    Info,
    LogOut,
    Milestone,
    Phone,
    Settings,
    Shield,
    Ticket,
    UserIcon,
    X,
} from "lucide-react";
import * as m from "@/paraglide/messages.js";
import { Prisma } from "@prisma/client";
import { useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { Link } from "@/lib/i18n";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import LanguageSwitcher from "../LanguageSwitcher";

export default function Sidebar({
    isSidebarOpen,
    setIsSidebarOpen,
    user,
}: {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
    user: Prisma.UserGetPayload<{
        include: { driverVerificationRequest: { select: { status: true } } };
    }> | null;
}) {
    const SIDEBAR_NAV_ITEMS = [
        { href: "/about", label: m.tense_every_swallow_clap(), icon: Info },
        { href: "/contact", label: m.round_sour_gazelle_peel(), icon: Phone },
        {
            href: "/profile",
            label: m.wild_tidy_alpaca_nurture(),
            icon: UserIcon,
            requiresAuth: true,
        },
        {
            href: "/profile/settings",
            label: m.deft_chunky_toad_snap(),
            icon: Settings,
            requiresAuth: true,
        },
        {
            href: "/profile/trips",
            label: m.long_upper_seal_revive(),
            icon: Ticket,
            requiresAuth: true,
        },
        {
            href: "/profile/rides",
            label: m.candid_silly_stingray_tear(),
            icon: Milestone,
            requiresAuth: true,
        },
    ];

    if (
        user

    ) {
        if (!user.driverVerificationRequest ||
            user.driverVerificationRequest?.status == "PENDING") {
            SIDEBAR_NAV_ITEMS.push({
                href: "/send-driver-verification",
                label: m.royal_civil_tuna_slide(),
                icon: CarFront,
            });
        } else {
            SIDEBAR_NAV_ITEMS.push({
                href: "/send-driver-verification",
                label: m.fine_silly_bison_pet(),
                icon: CarFront,
            });
        }
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // useEffect(() => {
    //     if (isSidebarOpen) {
    //         document.body.style.overflow = "hidden";
    //     } else {
    //         document.body.style.overflow = "";
    //     }
    //     return () => {
    //         document.body.style.overflow = "";
    //     };
    // }, [isSidebarOpen]);

    return (
        <>
            <div
                className={cn(
                    "fixed inset-0 bg-black bg-opacity-50 z-[300] duration-300",
                    {
                        "visible opacity-100": isSidebarOpen,
                        "invisible opacity-0": !isSidebarOpen,
                    }
                )}
                onClick={toggleSidebar}
            />

            <div
                className={`fixed bottom-0 right-0 md:left-0 md:right-auto w-3/4 md:w-56 h-screen bg-white z-[400] transform transition-transform duration-300 ease-in-out ${isSidebarOpen
                    ? "translate-x-0"
                    : "md:-translate-x-full translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold">
                            {m.fun_less_vole_hug()}
                        </h2>
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-full hover:bg-gray-100"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto py-2 w-full">
                        {SIDEBAR_NAV_ITEMS.map((item, index) => {
                            if (item.requiresAuth && !user) return null;

                            return (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className="flex items-center px-4 py-3 hover:bg-gray-100"
                                    onClick={toggleSidebar}
                                >
                                    <item.icon size={20} className="mr-3" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                        <LanguageSwitcher
                            position="left"
                            className="block"
                            customButton={(t, label) => (
                                <button
                                    className="flex items-center px-4 py-3 hover:bg-gray-100 w-full"
                                    onClick={t}
                                >
                                    <Globe size={20} className="mr-3" />
                                    <span>{label}</span>
                                </button>
                            )}
                        />
                        {user && (
                            <LogoutLink className="flex items-center px-4 py-3 hover:bg-gray-100 w-full">
                                <LogOut size={20} className="mr-3" />

                                <span>{m.extra_lucky_rook_trust()}</span>
                            </LogoutLink>
                        )}
                        {user && user.role === "ADMIN" && (
                            <Link
                                href="/admin"
                                className="flex items-center px-4 py-3 hover:bg-gray-100 w-full"
                                onClick={toggleSidebar}
                            >
                                <Shield size={20} className="mr-3" />
                                <span>{m.tough_hour_robin_sing()}</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
