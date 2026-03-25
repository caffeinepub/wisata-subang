import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface TourDestination {
    id: UUID;
    featured: boolean;
    active: boolean;
    directions: string;
    name: string;
    createdAt: Time;
    description: string;
    updatedAt: Time;
    address: string;
    category: string;
    rating: bigint;
    mainImage?: ExternalBlob;
    location: Coordinates;
}
export type Time = bigint;
export interface TourAgency {
    id: UUID;
    active: boolean;
    name: string;
    createdAt: Time;
    description: string;
    email: string;
    updatedAt: Time;
    address: string;
    phone: string;
    services: Array<string>;
}
export interface InputTourPackage {
    duration: bigint;
    name: string;
    description: string;
    inclusions: Array<string>;
    maxParticipants: bigint;
    price: number;
}
export interface TourPackage {
    id: UUID;
    duration: bigint;
    active: boolean;
    name: string;
    createdAt: Time;
    description: string;
    inclusions: Array<string>;
    updatedAt: Time;
    maxParticipants: bigint;
    price: number;
}
export interface Coordinates {
    latitude: number;
    longitude: number;
}
export interface InputBooking {
    customerName: string;
    paymentMethod: PaymentMethod;
    customerPhone: string;
    destinationId?: UUID;
    numGuests: bigint;
    totalPrice: number;
    customerEmail: string;
    packageId?: UUID;
}
export interface InputTourDestination {
    featured: boolean;
    directions: string;
    name: string;
    description: string;
    address: string;
    category: string;
    mainImage?: ExternalBlob;
    coordinates: Coordinates;
}
export interface InputHotel {
    pricePerNight: number;
    name: string;
    description: string;
    amenities: Array<string>;
    website: string;
    address: string;
    rating: bigint;
    phone: string;
}
export interface Hotel {
    id: UUID;
    active: boolean;
    pricePerNight: number;
    name: string;
    createdAt: Time;
    description: string;
    amenities: Array<string>;
    website: string;
    updatedAt: Time;
    address: string;
    rating: bigint;
    phone: string;
}
export type UUID = bigint;
export interface Booking {
    id: UUID;
    customerName: string;
    status: BookingStatus;
    paymentMethod: PaymentMethod;
    bookedBy: Principal;
    customerPhone: string;
    destinationId?: UUID;
    createdAt: Time;
    numGuests: bigint;
    bookingDate: Time;
    totalPrice: number;
    customerEmail: string;
    packageId?: UUID;
}
export interface InputTourAgency {
    name: string;
    description: string;
    email: string;
    address: string;
    phone: string;
    services: Array<string>;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export enum BookingStatus {
    cancelled = "cancelled",
    pending = "pending",
    confirmed = "confirmed"
}
export enum PaymentMethod {
    ovo = "ovo",
    linkAja = "linkAja",
    dana = "dana",
    gopay = "gopay"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addGalleryImages(destinationId: UUID, newImages: Array<ExternalBlob>): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelBookingClient(bookingId: UUID): Promise<void>;
    checkBookingStatus(bookingId: UUID): Promise<BookingStatus>;
    createAgency(input: InputTourAgency): Promise<UUID>;
    createBooking(input: InputBooking): Promise<UUID>;
    createDestination(input: InputTourDestination): Promise<UUID>;
    createHotel(input: InputHotel): Promise<UUID>;
    createTourPackage(input: InputTourPackage): Promise<UUID>;
    deleteAgency(id: UUID): Promise<void>;
    deleteDestination(id: UUID): Promise<void>;
    deleteHotel(id: UUID): Promise<void>;
    deleteTourPackage(id: UUID): Promise<void>;
    getActiveAgencies(): Promise<Array<TourAgency>>;
    getActiveDestinations(): Promise<Array<TourDestination>>;
    getActiveHotels(): Promise<Array<Hotel>>;
    getActiveTourPackages(): Promise<Array<TourPackage>>;
    getAgency(id: UUID): Promise<TourAgency>;
    getAllAgencies(): Promise<Array<TourAgency>>;
    getAllBookings(): Promise<Array<Booking>>;
    getAllConfirmedBookings(): Promise<Array<Booking>>;
    getAllDestinations(): Promise<Array<TourDestination>>;
    getAllFeaturedWithGallery(): Promise<Array<[TourDestination, Array<ExternalBlob>]>>;
    getAllHotels(): Promise<Array<Hotel>>;
    getAllTourPackages(): Promise<Array<TourPackage>>;
    getBooking(bookingId: UUID): Promise<Booking>;
    getBookingStats(): Promise<{
        pendingBookings: bigint;
        activeHotels: bigint;
        activePackages: bigint;
        cancelledBookings: bigint;
        totalBookings: bigint;
        confirmedBookings: bigint;
        activeDestinations: bigint;
    }>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDestination(id: UUID): Promise<TourDestination>;
    getDestinationGalleryImages(destinationId: UUID): Promise<Array<ExternalBlob>>;
    getDestinationWithGallery(destinationId: UUID): Promise<[TourDestination, Array<ExternalBlob>]>;
    getFeaturedDestinations(): Promise<Array<TourDestination>>;
    getGalleryImages(destinationId: UUID): Promise<Array<ExternalBlob>>;
    getHomePageData(): Promise<{
        agencies: Array<TourAgency>;
        popularHotels: Array<Hotel>;
        tourPackages: Array<TourPackage>;
        featuredDestinations: Array<TourDestination>;
    }>;
    getHotel(id: UUID): Promise<Hotel>;
    getTourPackage(id: UUID): Promise<TourPackage>;
    getUserBookings(customerEmail: string): Promise<Array<Booking>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    toggleAgencyActive(id: UUID): Promise<void>;
    toggleDestinationActive(id: UUID): Promise<void>;
    toggleHotelActive(id: UUID): Promise<void>;
    togglePackageActive(id: UUID): Promise<void>;
    updateAgency(id: UUID, input: InputTourAgency): Promise<void>;
    updateBookingStatusAdmin(bookingId: UUID, newStatus: BookingStatus): Promise<void>;
    updateDestination(id: UUID, input: InputTourDestination): Promise<void>;
    updateHotel(id: UUID, input: InputHotel): Promise<void>;
    updateTourPackage(id: UUID, input: InputTourPackage): Promise<void>;
}
