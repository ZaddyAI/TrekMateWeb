// types/types.ts
export interface Booking {
  id: number;
  destinationId: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface DestinationData {
  destination: Destination;
  image: Image | null;
  accomodation: Accomodation;
  transportation: Transportation;
}

export interface Destination {
  id: number;
  name: string;
  shortDescription: string;
  description: string;
  highestElivation: number;
  region: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Image {
  id: number;
  relatedId: number;
  relatedTypes: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccomodationData {
  accomodation: Accomodation;
  image: Image;
}

export interface Accomodation {
  id: number;
  name: string;
  description: string;
  destinationId: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingData {
  id: number;
  userId: number;
  accomodationId: number;
  startingDate: Date;
  endingDate: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  isValidEmail: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransportationData {
  transportation: Transportation;
  image: Image;
}

export interface Transportation {
  id: number;
  destinationId: number;
  price: number;
  grade: string;
  vechileTypeId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccomodationBookingData {
  accomodation_booking: AccomodationBooking;
  user: UserData;
}

export interface AccomodationBooking {
  id: number;
  userId: number;
  accomodationId: number;
  startingDate: Date;
  endingDate: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransportationBookingData {
  transportation_booking: TransportationBooking;
  user: UserData;
}

export interface TransportationBooking {
  id: number;
  userId: number;
  transportationId: number;
  dispatchDate: Date;
  returnDate: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingType = "accommodation" | "transportation";

export interface CombinedBooking {
  id: number;
  type: BookingType;
  user: UserData;
  status: "pending" | "conformed" | "cancelled";
  createdAt: Date;

  // Accommodation specific
  accomodationId?: number;
  startingDate?: Date;
  endingDate?: Date;

  // Transportation specific
  transportationId?: number;
  dispatchDate?: Date;
  returnDate?: Date;
}
