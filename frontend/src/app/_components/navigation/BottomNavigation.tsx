"use client";

import {
    Home,
    Info,
    Ticket,
    Menu,
    X,
    Phone,
    Plus,
    User as UserIcon,
    Globe,
    Settings,
    Milestone,
    LogOut,
    Shield,
    CarFront,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import * as m from "@/paraglide/messages.js";
import { Prisma, User } from "@prisma/client";
import {
    LogoutLink,
    RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { menv } from "@/lib/utils/menv";
import { cn } from "@/lib/utils/cn";
import LanguageSwitcher from "../LanguageSwitcher";

export default function BottomNavigation({
    user,
    openSidebar,
}: {
    user: Prisma.UserGetPayload<{
        include: { driverVerificationRequest: { select: { status: true } } };
    }> | null;
    openSidebar: () => void;
}) {

    const MAIN_NAV_ITEMS = [
        { href: "/", label: m.lofty_nimble_goat_succeed(), icon: Home },
        {
            href: "/upcoming-rides",
            label: m.odd_sleek_mink_taste(),
            icon: Ticket,
        },
        {
            href: "/add-ride",
            label: m.actual_watery_fireant_foster(),
            icon: Plus,
            requiresAuth: true,
        },
    ];



    return (
        <>
            {/* Bottom Navigation Bar */}
            <div
                className={`fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-[200] md:hidden transition-transform duration-300`}
            >
                <div className="h-px bg-gray-200"></div>
                <div className="flex justify-around items-center h-16">
                    {MAIN_NAV_ITEMS.map(
                        ({ href, label, icon: Icon, requiresAuth }, index) => {
                            if (requiresAuth && !user) return null;

                            return (
                                <Link
                                    key={index}
                                    href={href}
                                    prefetch={false}
                                    className="flex flex-col items-center justify-center flex-1 h-full py-1 hover:text-primary transition-colors"
                                >
                                    <Icon size={20} className="mb-1" />
                                    <span className="text-xs font-medium line-clamp-1 max-w-20 text-center">
                                        {label}
                                    </span>
                                </Link>
                            );
                        }
                    )}
                    {!user && (
                        <RegisterLink
                            authUrlParams={{
                                connection_id:
                                    menv.NEXT_PUBLIC_KINDE_CONNECTION_GOOGLE,
                            }}
                            className="flex flex-col items-center justify-center flex-1 h-full py-1 hover:text-primary transition-colors"
                        >
                            <>
                                <UserIcon size={20} className="mb-1" />
                                <span className="text-xs font-medium line-clamp-1 max-w-20 text-center">
                                    {m.plane_weird_macaw_slurp()}
                                </span>
                            </>
                        </RegisterLink>
                    )}

                    {/* More menu button */}
                    <button
                        onClick={openSidebar}
                        className="flex flex-col items-center justify-center flex-1 h-full py-1 hover:text-primary transition-colors"
                    >
                        <Menu size={20} className="mb-1" />
                        <span className="text-xs font-medium">
                            {m.tiny_plane_mouse_catch()}
                        </span>
                    </button>
                </div>
            </div>


        </>
    );
}
