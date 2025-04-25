/* eslint-disable */
const metadata = {
    models: {
        user: {
            name: 'User', fields: {
                id: {
                    name: "id",
                    type: "String",
                    isId: true,
                    attributes: [{ "name": "@default", "args": [] }],
                }, createdAt: {
                    name: "createdAt",
                    type: "DateTime",
                    attributes: [{ "name": "@default", "args": [] }],
                }, updatedAt: {
                    name: "updatedAt",
                    type: "DateTime",
                    attributes: [{ "name": "@updatedAt", "args": [] }],
                }, isNewUser: {
                    name: "isNewUser",
                    type: "Boolean",
                    attributes: [{ "name": "@default", "args": [{ "value": true }] }],
                }, email: {
                    name: "email",
                    type: "String",
                }, name: {
                    name: "name",
                    type: "String",
                }, mobileNumber: {
                    name: "mobileNumber",
                    type: "String",
                    attributes: [{ "name": "@default", "args": [{ "value": "+995..." }] }],
                }, idNumber: {
                    name: "idNumber",
                    type: "String",
                    attributes: [{ "name": "@default", "args": [{ "value": "5900..." }] }],
                }, birthDate: {
                    name: "birthDate",
                    type: "DateTime",
                    attributes: [{ "name": "@default", "args": [] }],
                }, profileImg: {
                    name: "profileImg",
                    type: "String",
                }, bio: {
                    name: "bio",
                    type: "String",
                    attributes: [{ "name": "@default", "args": [{ "value": "" }] }],
                }, sex: {
                    name: "sex",
                    type: "UserSex",
                    attributes: [{ "name": "@default", "args": [] }],
                }, role: {
                    name: "role",
                    type: "UserRole",
                    attributes: [{ "name": "@default", "args": [] }],
                }, status: {
                    name: "status",
                    type: "UserStatus",
                    attributes: [{ "name": "@default", "args": [] }],
                }, balance: {
                    name: "balance",
                    type: "Float",
                    attributes: [{ "name": "@default", "args": [{ "value": 0 }] }],
                }, IDPhotos: {
                    name: "IDPhotos",
                    type: "String",
                    isArray: true,
                }, isUserVerified: {
                    name: "isUserVerified",
                    type: "Boolean",
                    attributes: [{ "name": "@default", "args": [{ "value": false }] }],
                }, driverVerificationRequest: {
                    name: "driverVerificationRequest",
                    type: "DriverVerificationRequest",
                    isDataModel: true,
                    isOptional: true,
                    backLink: 'driver',
                }, ridesAsDriver: {
                    name: "ridesAsDriver",
                    type: "Ride",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'driver',
                }, passengerRideRequests: {
                    name: "passengerRideRequests",
                    type: "RidePassengerRequest",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'passenger',
                }, cars: {
                    name: "cars",
                    type: "Car",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'owner',
                }, userReviewsByMe: {
                    name: "userReviewsByMe",
                    type: "UserReview",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'author',
                }, userReviewsAboutMe: {
                    name: "userReviewsAboutMe",
                    type: "UserReview",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'reviewee',
                }, rideStartedConfirmations: {
                    name: "rideStartedConfirmations",
                    type: "RideStartedConfirmation",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'user',
                },
            }
            , uniqueConstraints: {
                id: {
                    name: "id",
                    fields: ["id"]
                }, email: {
                    name: "email",
                    fields: ["email"]
                },
            }
            ,
        }
        ,
        driverVerificationRequest: {
            name: 'DriverVerificationRequest', fields: {
                id: {
                    name: "id",
                    type: "String",
                    isId: true,
                    attributes: [{ "name": "@default", "args": [] }],
                }, createdAt: {
                    name: "createdAt",
                    type: "DateTime",
                    attributes: [{ "name": "@default", "args": [] }],
                }, updatedAt: {
                    name: "updatedAt",
                    type: "DateTime",
                    attributes: [{ "name": "@updatedAt", "args": [] }],
                }, licencePhotos: {
                    name: "licencePhotos",
                    type: "String",
                    isArray: true,
                }, selfie: {
                    name: "selfie",
                    type: "String",
                }, status: {
                    name: "status",
                    type: "DriverVerificationRequestStatus",
                }, driver: {
                    name: "driver",
                    type: "User",
                    isDataModel: true,
                    backLink: 'driverVerificationRequest',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "driverId" },
                }, driverId: {
                    name: "driverId",
                    type: "String",
                    attributes: [{ "name": "@default", "args": [] }],
                    isForeignKey: true,
                    relationField: 'driver',
                    defaultValueProvider: $default$DriverVerificationRequest$driverId,
                },
            }
            , uniqueConstraints: {
                id: {
                    name: "id",
                    fields: ["id"]
                }, driverId: {
                    name: "driverId",
                    fields: ["driverId"]
                },
            }
            ,
        }
        ,
        car: {
            name: 'Car', fields: {
                id: {
                    name: "id",
                    type: "String",
                    isId: true,
                    attributes: [{ "name": "@default", "args": [] }],
                }, createdAt: {
                    name: "createdAt",
                    type: "DateTime",
                    attributes: [{ "name": "@default", "args": [] }],
                }, updatedAt: {
                    name: "updatedAt",
                    type: "DateTime",
                    attributes: [{ "name": "@updatedAt", "args": [] }],
                }, name: {
                    name: "name",
                    type: "String",
                }, type: {
                    name: "type",
                    type: "CarType",
                }, plate: {
                    name: "plate",
                    type: "String",
                }, mark: {
                    name: "mark",
                    type: "String",
                }, capacity: {
                    name: "capacity",
                    type: "Int",
                }, status: {
                    name: "status",
                    type: "CarStatus",
                    attributes: [{ "name": "@default", "args": [] }],
                }, photos: {
                    name: "photos",
                    type: "String",
                    isArray: true,
                }, licensePhotos: {
                    name: "licensePhotos",
                    type: "String",
                    isArray: true,
                }, fuelType: {
                    name: "fuelType",
                    type: "CarFuelType",
                }, owner: {
                    name: "owner",
                    type: "User",
                    isDataModel: true,
                    backLink: 'cars',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "ownerId" },
                }, ownerId: {
                    name: "ownerId",
                    type: "String",
                    attributes: [{ "name": "@default", "args": [] }],
                    isForeignKey: true,
                    relationField: 'owner',
                    defaultValueProvider: $default$Car$ownerId,
                }, rides: {
                    name: "rides",
                    type: "Ride",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'car',
                }, demetre: {
                    name: "demetre",
                    type: "Int",
                    isOptional: true,
                },
            }
            , uniqueConstraints: {
                id: {
                    name: "id",
                    fields: ["id"]
                },
            }
            ,
        }
        ,
        ride: {
            name: 'Ride', fields: {
                id: {
                    name: "id",
                    type: "String",
                    isId: true,
                    attributes: [{ "name": "@default", "args": [] }],
                }, createdAt: {
                    name: "createdAt",
                    type: "DateTime",
                    attributes: [{ "name": "@default", "args": [] }],
                }, updatedAt: {
                    name: "updatedAt",
                    type: "DateTime",
                    attributes: [{ "name": "@updatedAt", "args": [] }],
                }, availableSeats: {
                    name: "availableSeats",
                    type: "Int",
                }, price: {
                    name: "price",
                    type: "Float",
                }, from: {
                    name: "from",
                    type: "String",
                }, to: {
                    name: "to",
                    type: "String",
                }, departure: {
                    name: "departure",
                    type: "DateTime",
                }, distance: {
                    name: "distance",
                    type: "Float",
                }, duration: {
                    name: "duration",
                    type: "Float",
                }, driver: {
                    name: "driver",
                    type: "User",
                    isDataModel: true,
                    backLink: 'ridesAsDriver',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "driverId" },
                }, driverId: {
                    name: "driverId",
                    type: "String",
                    attributes: [{ "name": "@default", "args": [] }],
                    isForeignKey: true,
                    relationField: 'driver',
                    defaultValueProvider: $default$Ride$driverId,
                }, ridePassengerRequests: {
                    name: "ridePassengerRequests",
                    type: "RidePassengerRequest",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'ride',
                }, status: {
                    name: "status",
                    type: "RideStatus",
                    attributes: [{ "name": "@default", "args": [] }],
                }, rideRules: {
                    name: "rideRules",
                    type: "RideRule",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'ride',
                }, car: {
                    name: "car",
                    type: "Car",
                    isDataModel: true,
                    backLink: 'rides',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "carId" },
                }, carId: {
                    name: "carId",
                    type: "String",
                    isForeignKey: true,
                    relationField: 'car',
                }, startedConfirmations: {
                    name: "startedConfirmations",
                    type: "RideStartedConfirmation",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'ride',
                },
            }
            , uniqueConstraints: {
                id: {
                    name: "id",
                    fields: ["id"]
                },
            }
            ,
        }
        ,
        ridePassengerRequest: {
            name: 'RidePassengerRequest', fields: {
                id: {
                    name: "id",
                    type: "String",
                    isId: true,
                    attributes: [{ "name": "@default", "args": [] }],
                }, createdAt: {
                    name: "createdAt",
                    type: "DateTime",
                    attributes: [{ "name": "@default", "args": [] }],
                }, updatedAt: {
                    name: "updatedAt",
                    type: "DateTime",
                    attributes: [{ "name": "@updatedAt", "args": [] }],
                }, passenger: {
                    name: "passenger",
                    type: "User",
                    isDataModel: true,
                    backLink: 'passengerRideRequests',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "passengerId" },
                }, passengerId: {
                    name: "passengerId",
                    type: "String",
                    attributes: [{ "name": "@default", "args": [] }],
                    isForeignKey: true,
                    relationField: 'passenger',
                    defaultValueProvider: $default$RidePassengerRequest$passengerId,
                }, ride: {
                    name: "ride",
                    type: "Ride",
                    isDataModel: true,
                    backLink: 'ridePassengerRequests',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "rideId" },
                }, rideId: {
                    name: "rideId",
                    type: "String",
                    isForeignKey: true,
                    relationField: 'ride',
                }, bogOrderId: {
                    name: "bogOrderId",
                    type: "String",
                    isOptional: true,
                }, status: {
                    name: "status",
                    type: "RidePassengerRequestStatus",
                    attributes: [{ "name": "@default", "args": [] }],
                }, preferredPrice: {
                    name: "preferredPrice",
                    type: "Float",
                    isOptional: true,
                }, description: {
                    name: "description",
                    type: "String",
                    isOptional: true,
                },
            }
            , uniqueConstraints: {
                id: {
                    name: "id",
                    fields: ["id"]
                }, passengerId_rideId: {
                    name: "passengerId_rideId",
                    fields: ["passengerId", "rideId"]
                },
            }
            ,
        }
        ,
        rideStartedConfirmation: {
            name: 'RideStartedConfirmation', fields: {
                id: {
                    name: "id",
                    type: "String",
                    isId: true,
                    attributes: [{ "name": "@default", "args": [] }],
                }, createdAt: {
                    name: "createdAt",
                    type: "DateTime",
                    attributes: [{ "name": "@default", "args": [] }],
                }, updatedAt: {
                    name: "updatedAt",
                    type: "DateTime",
                    attributes: [{ "name": "@updatedAt", "args": [] }],
                }, user: {
                    name: "user",
                    type: "User",
                    isDataModel: true,
                    backLink: 'rideStartedConfirmations',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "userId" },
                }, userId: {
                    name: "userId",
                    type: "String",
                    attributes: [{ "name": "@default", "args": [] }],
                    isForeignKey: true,
                    relationField: 'user',
                    defaultValueProvider: $default$RideStartedConfirmation$userId,
                }, ride: {
                    name: "ride",
                    type: "Ride",
                    isDataModel: true,
                    backLink: 'startedConfirmations',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "rideId" },
                }, rideId: {
                    name: "rideId",
                    type: "String",
                    isForeignKey: true,
                    relationField: 'ride',
                },
            }
            , uniqueConstraints: {
                id: {
                    name: "id",
                    fields: ["id"]
                }, rideId_userId: {
                    name: "rideId_userId",
                    fields: ["rideId", "userId"]
                },
            }
            ,
        }
        ,
        rideRule: {
            name: 'RideRule', fields: {
                id: {
                    name: "id",
                    type: "String",
                    isId: true,
                    attributes: [{ "name": "@default", "args": [] }],
                }, createdAt: {
                    name: "createdAt",
                    type: "DateTime",
                    attributes: [{ "name": "@default", "args": [] }],
                }, updatedAt: {
                    name: "updatedAt",
                    type: "DateTime",
                    attributes: [{ "name": "@updatedAt", "args": [] }],
                }, rule: {
                    name: "rule",
                    type: "Rule",
                    isDataModel: true,
                    backLink: 'ruleRides',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "ruleId" },
                }, ruleId: {
                    name: "ruleId",
                    type: "String",
                    isForeignKey: true,
                    relationField: 'rule',
                }, ride: {
                    name: "ride",
                    type: "Ride",
                    isDataModel: true,
                    backLink: 'rideRules',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "rideId" },
                }, rideId: {
                    name: "rideId",
                    type: "String",
                    isForeignKey: true,
                    relationField: 'ride',
                },
            }
            , uniqueConstraints: {
                id: {
                    name: "id",
                    fields: ["id"]
                }, ruleId_rideId: {
                    name: "ruleId_rideId",
                    fields: ["ruleId", "rideId"]
                },
            }
            ,
        }
        ,
        rule: {
            name: 'Rule', fields: {
                id: {
                    name: "id",
                    type: "String",
                    isId: true,
                    attributes: [{ "name": "@default", "args": [] }],
                }, createdAt: {
                    name: "createdAt",
                    type: "DateTime",
                    attributes: [{ "name": "@default", "args": [] }],
                }, updatedAt: {
                    name: "updatedAt",
                    type: "DateTime",
                    attributes: [{ "name": "@updatedAt", "args": [] }],
                }, price: {
                    name: "price",
                    type: "Float",
                }, labels: {
                    name: "labels",
                    type: "Json",
                    attributes: [{ "name": "@default", "args": [{ "value": "{ \"en\": \"No Smoking\", \"ka\": \"არ ვეწევით\" }" }] }],
                }, svg: {
                    name: "svg",
                    type: "String",
                    attributes: [{ "name": "@default", "args": [{ "value": "" }] }],
                }, ruleRides: {
                    name: "ruleRides",
                    type: "RideRule",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'rule',
                },
            }
            , uniqueConstraints: {
                id: {
                    name: "id",
                    fields: ["id"]
                },
            }
            ,
        }
        ,
        userReview: {
            name: 'UserReview', fields: {
                id: {
                    name: "id",
                    type: "String",
                    isId: true,
                    attributes: [{ "name": "@default", "args": [] }],
                }, createdAt: {
                    name: "createdAt",
                    type: "DateTime",
                    attributes: [{ "name": "@default", "args": [] }],
                }, updatedAt: {
                    name: "updatedAt",
                    type: "DateTime",
                    attributes: [{ "name": "@updatedAt", "args": [] }],
                }, comment: {
                    name: "comment",
                    type: "String",
                }, rating: {
                    name: "rating",
                    type: "Float",
                }, author: {
                    name: "author",
                    type: "User",
                    isDataModel: true,
                    backLink: 'userReviewsByMe',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "authorId" },
                }, authorId: {
                    name: "authorId",
                    type: "String",
                    attributes: [{ "name": "@default", "args": [] }],
                    isForeignKey: true,
                    relationField: 'author',
                    defaultValueProvider: $default$UserReview$authorId,
                }, reviewee: {
                    name: "reviewee",
                    type: "User",
                    isDataModel: true,
                    backLink: 'userReviewsAboutMe',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "revieweeId" },
                }, revieweeId: {
                    name: "revieweeId",
                    type: "String",
                    isForeignKey: true,
                    relationField: 'reviewee',
                },
            }
            , uniqueConstraints: {
                id: {
                    name: "id",
                    fields: ["id"]
                }, authorId_revieweeId: {
                    name: "authorId_revieweeId",
                    fields: ["authorId", "revieweeId"]
                },
            }
            ,
        }
        ,
        contactSubmission: {
            name: 'ContactSubmission', fields: {
                id: {
                    name: "id",
                    type: "String",
                    isId: true,
                    attributes: [{ "name": "@default", "args": [] }],
                }, createdAt: {
                    name: "createdAt",
                    type: "DateTime",
                    attributes: [{ "name": "@default", "args": [] }],
                }, updatedAt: {
                    name: "updatedAt",
                    type: "DateTime",
                    attributes: [{ "name": "@updatedAt", "args": [] }],
                }, name: {
                    name: "name",
                    type: "String",
                }, email: {
                    name: "email",
                    type: "String",
                }, message: {
                    name: "message",
                    type: "String",
                }, status: {
                    name: "status",
                    type: "ContactSubmissionStatus",
                    attributes: [{ "name": "@default", "args": [] }],
                }, type: {
                    name: "type",
                    type: "ContactSubmissionType",
                },
            }
            , uniqueConstraints: {
                id: {
                    name: "id",
                    fields: ["id"]
                },
            }
            ,
        }
        ,
    }
    ,
    deleteCascade: {
        ride: ['RideRule'],
        rule: ['RideRule'],
    }
    ,
    authModel: 'User'
};
function $default$DriverVerificationRequest$driverId(user: any): unknown {
    return user?.id;
}

function $default$Car$ownerId(user: any): unknown {
    return user?.id;
}

function $default$Ride$driverId(user: any): unknown {
    return user?.id;
}

function $default$RidePassengerRequest$passengerId(user: any): unknown {
    return user?.id;
}

function $default$RideStartedConfirmation$userId(user: any): unknown {
    return user?.id;
}

function $default$UserReview$authorId(user: any): unknown {
    return user?.id;
}
export default metadata;
