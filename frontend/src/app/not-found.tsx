import * as m from "@/paraglide/messages.js";
import WithNavbarAndFooter from "./_components/navigation/WithNavbarAndFooter";
import { Link } from "@/lib/i18n";

export default async function NotFoundPage() {
    return (
        <WithNavbarAndFooter>
            <div className="flex items-center justify-center min-h-[70vh] px-4">
                <div className="text-center max-w-lg">
                    <div className="relative">
                        <h1 className="text-9xl font-black text-primary">
                            404
                        </h1>
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-secondary/20 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
                    </div>

                    <p className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl mt-6">
                        {m.super_weary_shrike_commend()}!
                    </p>

                    <p className="mt-6 text-lg text-foreground/80">
                        {m.glad_level_gazelle_smile()}
                    </p>

                    <div className="mt-10">
                        <Link
                            href={"/"}
                            className="btn-animate inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary rounded-md shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                        >
                            {m.aqua_petty_bird_tickle()}
                        </Link>
                    </div>

                    <div className="mt-12 flex justify-center space-x-4">
                        <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                        <div className="w-2 h-2 rounded-full bg-primary/40"></div>
                        <div className="w-2 h-2 rounded-full bg-primary/20"></div>
                    </div>
                </div>
            </div>
        </WithNavbarAndFooter>
    );
}
