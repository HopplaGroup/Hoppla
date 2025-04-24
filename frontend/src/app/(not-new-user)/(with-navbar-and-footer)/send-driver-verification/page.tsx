// send-driver-verification/page.tsx
import { redirect } from "next/navigation";
import DriverVerificationForm from "./_components/DriverVerificationForm";
import { getUser } from "@/lib/utils/auth";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { uploadRateLimiter } from "@/app/api/s3-upload/rateLimiter";
import * as m from "@/paraglide/messages.js";

export default async function DriverVerificationPage() {
  const user = await getUser({
    driverVerificationRequest: true,
  } as Prisma.UserInclude);

  if (!user) {
    redirect("/login");
  }

  // Status-specific content configuration
  const statusConfig = {
    PENDING: {
      icon: "⏳",
      title: m.aware_sharp_turkey_soar(),
      description:
        m.quaint_cuddly_dragonfly_hush(),
      color: "bg-yellow-100 text-yellow-800",
    },
    APPROVED: {
      icon: "✅",
      title: m.ornate_light_marmot_earn(),
      description:
        m.fluffy_due_marmot_treat(),
      color: "bg-green-100 text-green-800",
      actionLabel: "Create Your First Ride",
      actionLink: "/add-ride",
    },
    REJECTED: {
      icon: "❌",
      title: m.main_glad_opossum_pinch(),
      description:
        m.close_petty_hamster_pet(),
      color: "bg-red-100 text-red-800",
    },
  };

  let timeUntilRateLimitGained = null,
    isRateLimited = false;

  try {
    const rateLimitInfo = await uploadRateLimiter.get(user.id);
    console.log(rateLimitInfo);
    if (rateLimitInfo) {
      
        isRateLimited = rateLimitInfo.remainingPoints < 3;
        timeUntilRateLimitGained = rateLimitInfo.msBeforeNext;
    }

  } catch (error) {
    if (error instanceof Error && "msBeforeNext" in error) {
      isRateLimited = true;
      timeUntilRateLimitGained = (error as any).msBeforeNext as number;
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-primary/10 rounded-full px-4 py-2 flex items-center space-x-2">
                <svg
                  className="size-5 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span className="text-sm font-medium text-gray-900">
                  {m.fancy_alert_polecat_enjoy()}
                </span>
              </div>
            </div>

            {user.driverVerificationRequest ? (
              // User has an existing verification request
              <div className="mb-8">
                <div className="flex flex-col items-center text-center mb-6">
                  <div
                    className={`text-4xl mb-4 w-20 h-20 flex items-center justify-center rounded-full ${
                      statusConfig[user.driverVerificationRequest.status].color
                    }`}
                  >
                    {statusConfig[user.driverVerificationRequest.status].icon}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {statusConfig[user.driverVerificationRequest.status].title}
                  </h1>
                  <p className="text-gray-600 mt-2">
                    {
                      statusConfig[user.driverVerificationRequest.status]
                        .description
                    }
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h2 className="font-medium text-gray-900 mb-3">
                    {m.legal_top_llama_taste()}
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">{m.left_same_puffin_pick()}</span>
                      <span className="font-medium text-gray-900">
                        {user.driverVerificationRequest.status}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">{m.jumpy_wild_goat_slurp()}</span>
                      <span className="font-medium text-gray-900">
                        {new Date(
                          user.driverVerificationRequest.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{m.honest_extra_puffin_inspire()}</span>
                      <span className="font-medium text-gray-900">
                        {new Date(
                          user.driverVerificationRequest.updatedAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {user.driverVerificationRequest.status === "APPROVED" ? (
                  // If approved, show action button only
                  <div className="mt-6">
                    <Link
                      href={statusConfig.APPROVED.actionLink}
                      className="block w-full py-3 px-4 bg-primary text-center rounded-lg text-white font-medium hover:bg-primary/90 transition-colors"
                    >
                      {statusConfig.APPROVED.actionLabel}
                    </Link>
                    <div className="mt-6 text-center">
                      <Link
                        href="/"
                        className="text-primary hover:text-primary/80 font-medium"
                      >
                        {m.icy_inner_bobcat_emerge()}
                      </Link>
                    </div>
                  </div>
                ) : (
                  // For PENDING or REJECTED, show the form for editing
                  <>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      {user.driverVerificationRequest.status === "REJECTED"
                        ? m.aloof_grand_goldfish_sew()
                        : m.odd_zany_kudu_file()}
                    </h2>
                    <p className="text-gray-600 mb-6">
                      {user.driverVerificationRequest.status === "REJECTED"
                        ? m.mellow_sound_duck_fold()
                        : m.mild_home_vole_blend()}
                    </p>
                    <DriverVerificationForm
                        isRateLimited={isRateLimited}
                        timeUntilRateLimitGained={timeUntilRateLimitGained}
                      existingRequest={user.driverVerificationRequest}
                    />
                  </>
                )}
              </div>
            ) : (
              // New submission - no existing verification request
              <>
                <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                  {m.home_best_stingray_soar()}
                </h1>
                <p className="text-gray-600 mb-8 text-center">
                  {m.zippy_knotty_cuckoo_chop()}
                </p>
                <DriverVerificationForm  isRateLimited={isRateLimited}
                        timeUntilRateLimitGained={timeUntilRateLimitGained} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
