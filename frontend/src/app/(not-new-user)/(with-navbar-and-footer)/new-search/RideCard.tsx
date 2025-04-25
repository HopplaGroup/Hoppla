import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar, Users, MapPin, ChevronRight, Tag, Star } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface RideCardProps {
  ride: {
    id: string;
    from: string;
    to: string;
    departure: Date;
    price: number;
    availableSeats: number;
    distance: number;
    duration: number;
    car: {
      name: string;
      mark: string;
      type: string;
      photos: string[];
    };
    driver: {
      id: string;
      name: string;
      profileImg: string;
    };
    rideRules: {
      rule: {
        labels: {
          en: string;
        };
        svg: string;
      };
    }[];
    ridePassengerRequests: {
      passenger: {
        id: string;
      };
    }[];
  };
}

const RideCard: React.FC<RideCardProps> = ({ ride }) => {
  const departureDate = new Date(ride.departure);
  const passengerCount = ride.ridePassengerRequests.length;
  const seatsRemaining = ride.availableSeats - passengerCount;
  
  // Calculate duration in hours and minutes
  const hours = Math.floor(ride.duration / 60);
  const minutes = Math.round(ride.duration % 60);
  
  // Format time as HH:MM AM/PM
  const formattedTime = format(departureDate, "h:mm a");
  // Format date as Month Day, Year
  const formattedDate = format(departureDate, "MMM d, yyyy");
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 transition-all hover:shadow-lg">
      <div className="flex flex-col md:flex-row">
        {/* Driver and Car Info */}
        <div className="p-5 md:w-1/4 flex flex-col items-center md:border-r border-gray-100">
          <div className="relative w-16 h-16 rounded-full overflow-hidden mb-3 bg-gray-200 shadow-sm">
            <Image 
              src={ride.driver.profileImg || "/assets/placeholder-avatar.png"} 
              alt={ride.driver.name}
              fill
              className="object-cover"
            />
          </div>
          <h3 className="font-medium text-gray-900 text-center">{ride.driver.name}</h3>
          <div className="flex items-center mt-1 mb-3">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-sm text-gray-600">4.8</span>
          </div>
          
          <div className="mt-2 text-center">
            <p className="text-sm text-gray-700 font-medium">{ride.car.mark} {ride.car.name}</p>
            <div className="mt-3 w-full">
              {ride.car.photos && ride.car.photos.length > 0 ? (
                <div className="relative h-24 w-full rounded-md overflow-hidden bg-gray-100">
                  <Image 
                    src={ride.car.photos[0]} 
                    alt={`${ride.car.mark} ${ride.car.name}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-24 w-full rounded-md bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-400 text-xs">No car image</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Ride Details */}
        <div className="p-5 md:p-6 flex-1">
          <div className="flex flex-col md:flex-row md:items-start justify-between">
            <div className="flex-1">
              {/* Route */}
              <div className="flex items-center mb-4">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="w-0.5 h-12 bg-gray-300 my-1"></div>
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                </div>
                
                <div>
                  <div className="mb-3">
                    <p className="text-gray-500 text-sm">From</p>
                    <h3 className="font-semibold text-gray-900">{ride.from}</h3>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">To</p>
                    <h3 className="font-semibold text-gray-900">{ride.to}</h3>
                  </div>
                </div>
              </div>
              
              {/* Additional Details */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm text-gray-700">{formattedDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm text-gray-700">{formattedTime}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm text-gray-700">{seatsRemaining} seat{seatsRemaining !== 1 ? 's' : ''} left</span>
                </div>
              </div>
              
              {/* Journey Details */}
              <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                  {hours > 0 ? `${hours}h ` : ''}{minutes > 0 ? `${minutes}m` : ''}
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                  {ride.distance.toFixed(1)} km
                </span>
              </div>
              
              {/* Rules/Tags */}
              {ride.rideRules && ride.rideRules.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {ride.rideRules.slice(0, 3).map((ruleItem, index) => (
                    <div key={index} className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800">
                      <Tag className="h-3 w-3 mr-1" />
                      {ruleItem.rule.labels.en}
                    </div>
                  ))}
                  {ride.rideRules.length > 3 && (
                    <div className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800">
                      +{ride.rideRules.length - 3} more
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Price and Action */}
            <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end">
              <div className="text-2xl font-bold text-primary">{ride.price.toFixed(2)} ₾</div>
              <p className="text-xs text-gray-500 mb-4">per person</p>
              
              <Link href={`/ride/${ride.id}`} className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors">
                View Details
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideCard;