"use client";
import Image from "next/image";
import {
    Medal,
    TrendingUp,
    Users,
    Award,
    Globe,
    ExternalLink,
} from "lucide-react";
import * as m from "@/paraglide/messages.js";

export default function AboutPage() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative w-full">
                <div className="absolute inset-0 h-96 w-full overflow-hidden bg-gradient-to-r from-primary to-primary/70">
                    {/* Background pattern using Tailwind's built-in patterns */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="h-full w-full grid grid-cols-12 grid-rows-12">
                            {/* Creates a dot pattern grid */}
                            {Array(144)
                                .fill(0)
                                .map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-center"
                                    >
                                        <div className="h-1 w-1 rounded-full bg-white"></div>
                                    </div>
                                ))}
                        </div>
                    </div>
                    {/* Diagonal lines pattern overlay */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="h-full w-full flex flex-col">
                            {Array(20)
                                .fill(0)
                                .map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-6 w-full border-b border-white/30 -skew-x-12"
                                    ></div>
                                ))}
                        </div>
                    </div>
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40"></div>
                </div>

                {/* Content container */}
                <div className="relative h-[400px] z-10">
                    <div className="container mx-auto px-4 h-full">
                        <div className="flex flex-col h-full justify-center items-center py-12">
                            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2 mb-6">
                                <TrendingUp size={16} className="text-white" />
                                <span className="text-sm font-medium text-white">
                                    {m.caring_loose_piranha_hurl()}
                                </span>
                            </div>
                            <div className="max-w-2xl text-center">
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                    {m.zesty_bold_falcon_relish()}
                                </h1>
                                <p className="text-xl text-white/90">
                                    {m.spry_crisp_termite_pout()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Video Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center mb-8">
                            <div className="bg-primary/10 rounded-full px-4 py-2 flex items-center space-x-2">
                                <Award size={16} className="text-primary" />
                                <span className="text-sm font-medium text-gray-900">
                                    {m.mad_novel_kudu_drop()}
                                </span>
                            </div>
                        </div>
                        <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
                            <iframe
                                width="100%"
                                height="100%"
                                src="https://www.youtube.com/embed/PXwohGsb5XE"
                                title="Hoppla - SIA Georgia 2024 Finalist"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                            {m.plane_few_cheetah_prosper()}
                        </h2>
                        <div className="bg-white rounded-xl shadow-md p-8">
                            <p className="text-gray-700 mb-6">
                                {m.heavy_calm_lamb_bubble()}
                            </p>
                            <p className="text-gray-700 mb-6">
                                {m.gross_long_tortoise_read()}
                            </p>
                            <div className="flex items-center justify-center mb-6">
                                <div className="bg-primary/10 rounded-full px-4 py-2 flex items-center space-x-2">
                                    <Award size={16} className="text-primary" />
                                    <span className="text-sm font-medium text-gray-900">
                                        {m.noble_away_otter_stab()}
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-700 mb-6">
                                {m.witty_top_felix_lend()}
                            </p>

                            {/* Media Feature Link */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center">
                                    <Globe
                                        className="text-primary mr-3"
                                        size={20}
                                    />
                                    <div>
                                        <h4 className="font-medium text-gray-900">
                                            {m.these_small_raven_jolt()}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {m.quaint_ok_parakeet_mend()}
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href="https://bm.ge/news/ras-stavazobs-damgzavrebis-platforma-hoppla-momkhmarebels"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-primary font-medium hover:text-primary-dark transition-colors"
                                >
                                    {m.tired_spry_ape_launch()}
                                    <ExternalLink size={16} className="ml-1" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Mission */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                        {m.even_early_fox_support()}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                title: m.dirty_simple_blackbird_comfort(),
                                description:
                                m.wide_ideal_lobster_link(),
                                icon: (
                                    <svg
                                        className="size-6"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
                                        <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
                                        <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
                                        <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
                                        <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
                                    </svg>
                                ),
                            },
                            {
                                title: m.heroic_deft_mantis_mend(),
                                description:
                                    m.active_wacky_tadpole_taste(),
                                icon: (
                                    <svg
                                        className="size-6"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                                    </svg>
                                ),
                            },
                            {
                                title: m.inner_stout_goose_approve(),
                                description:
                                    m.lofty_giant_squirrel_persist(),
                                icon: (
                                    <svg
                                        className="size-6"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="m12 14 4-4" />
                                        <path d="M3.34 19a10 10 0 1 1 17.32 0" />
                                    </svg>
                                ),
                            },
                        ].map((mission, index) => (
                            <div key={index} className="flex">
                                <div className="flex-shrink-0 mr-4 h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    {mission.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {mission.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {mission.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-center justify-center mb-2">
                            <div className="flex items-center space-x-2">
                                <Users size={20} className="text-primary" />
                                <h2 className="text-3xl font-bold text-gray-900">
                                    {m.sleek_caring_lion_cook()}
                                </h2>
                            </div>
                        </div>
                        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                            {m.stale_top_panther_reap()}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                {
                                    name: m.quiet_wild_badger_propel(),
                                    role: "Co-founder & CEO",
                                    image: "/assets/team/luka.jpg",
                                },
                                {
                                    name: m.weird_teal_sloth_explore(),
                                    role: "Co-founder & CMO",
                                    image: "/assets/team/mariam.jpg",
                                },
                                {
                                    name: m.lower_calm_fireant_dash(),
                                    role: "Co-founder & CTO",
                                    image: "/assets/team/mikheil.jpg",
                                },

                                {
                                    name: m.fine_formal_dragonfly_advise(),
                                    role: "Co-founder & COO",
                                    image: "/assets/team/demetre.jpg",
                                },
                            ].map((member, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl shadow-sm p-6 text-center"
                                >
                                    <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                                        {/* Placeholder for team member images */}
                                        {/* <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                            <Users size={48} />
                                        </div> */}
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {member.name.split(" ")[0]}
                                        <br />
                                        {member.name.split(" ")[1]}
                                    </h3>
                                    {/* <p className="text-primary">
                                        {member.role}
                                    </p> */}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Achievements */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
                            {m.pink_moving_turtle_grow()}
                        </h2>

                        <div className="space-y-6">
                            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mr-4">
                                        <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                                            <Medal className="h-6 w-6 text-yellow-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {m.jolly_bald_frog_affirm()}
                                        </h3>
                                        <p className="text-gray-600">
                                            {m.these_royal_buzzard_fear()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mr-4">
                                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                            <Globe className="h-6 w-6 text-blue-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            Strategic Partnership with Wissol
                                        </h3>
                                        <p className="text-gray-600">
                                            Signed a memorandum with Wissol
                                            Group to enhance our service
                                            offerings and reach more users
                                            across Georgia.
                                        </p>
                                    </div>
                                </div>
                            </div> */}

                            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mr-4">
                                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                            <Award className="h-6 w-6 text-green-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {m.wise_swift_gopher_blink()}
                                        </h3>
                                        <p className="text-gray-600">
                                            {m.last_weak_dingo_favor()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured In */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-10">
                            {m.east_grassy_macaw_devour()}
                        </h2>

                        <div className="flex flex-wrap justify-center items-center gap-8">
                            <div className="group">
                                <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                                    <p className="font-medium text-gray-900">
                                        BM.GE
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {m.weird_short_crossbill_pride()}
                                    </p>
                                </div>
                            </div>

                            <div className="group">
                                <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                                    <p className="font-medium text-gray-900">
                                        SIA Georgia 2024
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {m.alert_odd_zebra_grow()}
                                    </p>
                                </div>
                            </div>

                            <div className="group">
                                <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                                    <p className="font-medium text-gray-900">
                                        Impact Hub Tbilisi
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {m.round_calm_husky_seek()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Join Us CTA */}
            {/* <section className="py-16 bg-primary">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-white mb-6">
                            Join the Hoppla Community
                        </h2>
                        <p className="text-xl text-white/90 mb-8">
                            Be part of our journey to transform intercity
                            transportation in Georgia. Join thousands of drivers
                            and passengers who are already enjoying affordable,
                            comfortable, and eco-friendly travel.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <button className="px-6 py-3 bg-white text-primary font-medium rounded-lg hover:bg-gray-100 transition-colors">
                                Sign Up as Driver
                            </button>
                            <button className="px-6 py-3 bg-primary-dark text-white font-medium rounded-lg border border-white/20 hover:bg-primary-dark/90 transition-colors">
                                Find a Ride
                            </button>
                        </div>
                    </div>
                </div>
            </section> */}
        </div>
    );
}
