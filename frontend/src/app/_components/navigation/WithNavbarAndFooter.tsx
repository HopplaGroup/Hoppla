import { getUser } from "@/lib/utils/auth";
import Footer from "../Footer";
import WholeNavigation from "./WholeNavigation";

export default async function WithNavbarAndFooter({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUser({
        driverVerificationRequest: {
            select: {
                status: true,
            },
        },
    });

    return (
        <div className="grid grid-rows-[auto_1fr_auto] grid-cols-1 min-h-screen">
            <header>
                <WholeNavigation user={user} />
            </header>
            <main className="md:mt-20">{children}</main>
            <div>
                <Footer />
            </div>
        </div>
    );
}
