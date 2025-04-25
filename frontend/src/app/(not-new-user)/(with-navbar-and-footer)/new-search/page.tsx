import React from "react";
import db from "@/lib/utils/db";
import SearchBarLanding from "../_components/ASearchBarLanding";
import { parseAsString, createLoader, parseAsIsoDateTime } from "nuqs/server";
import { MapPin, Calendar, Search, AlertCircle, Filter } from "lucide-react";
import RideCard from "./RideCard";

const loadSearchParams = createLoader({
  from: parseAsString,
  to: parseAsString,
  departure: parseAsIsoDateTime,
});

export default async function NewSearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { from, to, departure } = await loadSearchParams(searchParams);

  let rides = await db.ride.findMany({
    where: {
      status: "ACTIVE",
      ...(from && { from }),
      ...(to && { to }),
      ...(departure && {
        departure: {
          gte: departure,
          lt: new Date(departure.getTime() + 24 * 60 * 60 * 1000),
        },
      }),
    },
    include: {
      car: true,
      driver: true,
      rideRules: {
        include: {
          rule: true,
        },
      },
      ridePassengerRequests: {
        include: {
          passenger: true,
        },
      },
    },
    orderBy: {
      departure: "asc",
    },
  });

  // Format the search parameters for display
  const formattedDeparture = departure 
    ? new Date(departure).toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric", 
        year: "numeric" 
      })
    : null;

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Hero Section with Search Bar */}
      <div className="relative w-full">
        <div className="absolute inset-0 h-64 w-full overflow-hidden bg-gradient-to-r from-primary to-primary/70">
          {/* Background pattern using Tailwind's built-in patterns */}
          <div className="absolute inset-0 opacity-20">
            <div className="h-full w-full grid grid-cols-12 grid-rows-12">
              {/* Creates a dot pattern grid */}
              {Array(144)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center justify-center">
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
                  <div key={i} className="h-6 w-full border-b border-white/30 -skew-x-12"></div>
                ))}
            </div>
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40"></div>
        </div>

        {/* Content container */}
        <div className="relative z-10 pt-16 pb-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Find Your Perfect Ride</h1>
              <p className="text-white/90">
                Discover comfortable and affordable rides between cities
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-4">
                <SearchBarLanding />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Section */}
      <div className="container mx-auto px-4 mt-8">
        {/* Search Summary */}
        {(from || to || departure) && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="text-lg font-medium text-gray-800">Search Results</h2>
              
              {from && (
                <div className="flex items-center bg-primary/10 rounded-full px-3 py-1">
                  <MapPin size={16} className="text-primary mr-1" />
                  <span className="text-sm font-medium">From: {from}</span>
                </div>
              )}
              
              {to && (
                <div className="flex items-center bg-primary/10 rounded-full px-3 py-1">
                  <MapPin size={16} className="text-primary mr-1" />
                  <span className="text-sm font-medium">To: {to}</span>
                </div>
              )}
              
              {formattedDeparture && (
                <div className="flex items-center bg-primary/10 rounded-full px-3 py-1">
                  <Calendar size={16} className="text-primary mr-1" />
                  <span className="text-sm font-medium">Date: {formattedDeparture}</span>
                </div>
              )}
              
              <div className="ml-auto">
                <span className="text-sm font-medium text-gray-600">
                  {rides.length} {rides.length === 1 ? 'ride' : 'rides'} found
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Filters Section (Optional - for future expansion) */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            {rides.length > 0 ? (
              <span>Showing all available rides</span>
            ) : (
              <span>No rides available for your search</span>
            )}
          </div>
          
          <button className="flex items-center text-gray-700 bg-white rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-all">
            <Filter size={16} className="mr-2" />
            <span className="font-medium">Filters</span>
          </button>
        </div>

        {/* Rides Grid */}
        <div className="space-y-6">
          {rides.length > 0 ? (
            rides.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
                <AlertCircle size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No rides found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We couldn't find any rides matching your search criteria. Try adjusting your search parameters or check back later.
              </p>
              <button className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors">
                <Search size={18} className="mr-2" />
                Modify Search
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Optional FAQ Section */}
      {rides.length === 0 && (
        <div className="container mx-auto px-4 mt-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">How do I find a ride?</h3>
                <p className="text-gray-600">
                  Simply enter your starting point, destination, and travel date in the search bar above. Browse through the available rides and select the one that best fits your schedule and preferences.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Are the rides safe?</h3>
                <p className="text-gray-600">
                  Yes! All our drivers go through a verification process. You can also check driver ratings and reviews from other passengers before booking your ride.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">How do I pay for my ride?</h3>
                <p className="text-gray-600">
                  You can pay securely through our platform. We support various payment methods including credit cards and digital wallets for your convenience.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}