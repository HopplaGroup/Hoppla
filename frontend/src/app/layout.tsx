import { LanguageProvider } from "@inlang/paraglide-next";
import { languageTag } from "@/paraglide/runtime.js";
import "react-loading-skeleton/dist/skeleton.css";
import "react-responsive-pagination/themes/classic.css";
import "@/lib/styles/globals.css";
import { cn } from "@/lib/utils/cn";
import { Toaster } from "react-hot-toast";
import { getUser } from "@/lib/utils/auth";
import type { Metadata, Viewport } from "next";
import * as m from "@/paraglide/messages.js";
import Script from "next/script";
import { menv } from "@/lib/utils/menv";
import BlockedUserPage from "./_components/BlockedUserPage";
import Providers from "@/lib/providers";
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
    return {
        metadataBase: new URL("https://hoppla.ge"),
        title: m.weird_salty_baboon_slide(),
        description: m.long_suave_tern_intend(),
        openGraph: {
            locale: languageTag(),
            images: "/assets/opengraph-image.jpg",
        },
    };
}

export const viewport: Viewport = {
    themeColor: "#000000",
    initialScale: 1,
    width: "device-width",
    maximumScale: 1,
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getUser();
    return (
        <LanguageProvider>
            <html lang={languageTag()} suppressHydrationWarning>
                <body
                    className={cn(
                        "min-h-screen font-sans antialiased bg-gray-100"
                    )}
                >
                    <NuqsAdapter>
                    <Providers user={user}>
                        {user && user.status === "BLOCKED" ? (
                            <BlockedUserPage />
                        ) : (
                            children
                        )}
                        <Toaster />
                    </Providers>
                    </NuqsAdapter>
                </body>

                {menv.NODE_ENV === "production" && (
                    <Script
                        defer
                        src="https://umami.hoppla.ge/script.js"
                        data-website-id="830aaf27-d46b-4952-9620-6d29c00e2617"
                    />
                )}
            </html>
        </LanguageProvider>
    );
}
