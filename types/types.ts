export interface Booking {
  id: number;
  destinationId: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}
export interface DestinationsData {
  destination: Destination;
  image: string[];
}
export interface Destination {
  id: number;
  name: string;
  shortDescription: string;
  description: string;
  highestElivation: number;
  region: string;
  createdAt: string;
  updatedAt: string;
}
