import WithNavbarAndFooter from "@/app/_components/navigation/WithNavbarAndFooter";

export default async function WithNavbarLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <WithNavbarAndFooter>{children}</WithNavbarAndFooter>;
}
