import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

actor {
  // Components
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Types
  type UUID = Nat;

  type Coordinates = {
    latitude : Float;
    longitude : Float;
  };

  type TourDestination = {
    id : UUID;
    name : Text;
    description : Text;
    category : Text;
    location : Coordinates;
    address : Text;
    directions : Text;
    featured : Bool;
    active : Bool;
    mainImage : ?Storage.ExternalBlob;
    rating : Nat;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  type TourPackage = {
    id : UUID;
    name : Text;
    description : Text;
    price : Float;
    duration : Nat;
    inclusions : [Text];
    maxParticipants : Nat;
    active : Bool;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  type Hotel = {
    id : UUID;
    name : Text;
    description : Text;
    address : Text;
    pricePerNight : Float;
    rating : Nat;
    amenities : [Text];
    phone : Text;
    website : Text;
    active : Bool;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  type TourAgency = {
    id : UUID;
    name : Text;
    description : Text;
    address : Text;
    phone : Text;
    email : Text;
    services : [Text];
    active : Bool;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  type PaymentMethod = {
    #ovo;
    #gopay;
    #dana;
    #linkAja;
  };

  type BookingStatus = {
    #pending;
    #confirmed;
    #cancelled;
  };

  type Booking = {
    id : UUID;
    destinationId : ?UUID;
    packageId : ?UUID;
    customerName : Text;
    customerPhone : Text;
    customerEmail : Text;
    bookingDate : Time.Time;
    numGuests : Nat;
    paymentMethod : PaymentMethod;
    totalPrice : Float;
    status : BookingStatus;
    createdAt : Time.Time;
    bookedBy : Principal;
  };

  type InputTourDestination = {
    name : Text;
    description : Text;
    category : Text;
    coordinates : Coordinates;
    address : Text;
    directions : Text;
    featured : Bool;
    mainImage : ?Storage.ExternalBlob;
  };

  type InputTourPackage = {
    name : Text;
    description : Text;
    price : Float;
    duration : Nat;
    inclusions : [Text];
    maxParticipants : Nat;
  };

  type InputHotel = {
    name : Text;
    description : Text;
    address : Text;
    pricePerNight : Float;
    rating : Nat;
    amenities : [Text];
    phone : Text;
    website : Text;
  };

  type InputTourAgency = {
    name : Text;
    description : Text;
    address : Text;
    phone : Text;
    email : Text;
    services : [Text];
  };

  type InputBooking = {
    destinationId : ?UUID;
    packageId : ?UUID;
    customerName : Text;
    customerPhone : Text;
    customerEmail : Text;
    numGuests : Nat;
    paymentMethod : PaymentMethod;
    totalPrice : Float;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  module Booking {
    public func compareByTimestamp(booking1 : Booking, booking2 : Booking) : Order.Order {
      Nat.compare(booking1.id, booking2.id) // Fallback to compare by ID
    };
  };

  // State
  let destinations = Map.empty<UUID, TourDestination>();
  let tourPackages = Map.empty<UUID, TourPackage>();
  let hotels = Map.empty<UUID, Hotel>();
  let agencies = Map.empty<UUID, TourAgency>();
  let bookings = Map.empty<UUID, Booking>();
  let galleries = Map.empty<UUID, [Storage.ExternalBlob]>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextId : UUID = 1;

  // Helper Functions
  func generateId() : UUID {
    let id = nextId;
    nextId += 1;
    id;
  };

  func getTimestamp() : Time.Time {
    Time.now();
  };

  func getDestinationInternal(id : UUID) : TourDestination {
    switch (destinations.get(id)) {
      case (null) { Runtime.trap("Destination not found") };
      case (?destination) { destination };
    };
  };

  func getPackageInternal(id : UUID) : TourPackage {
    switch (tourPackages.get(id)) {
      case (null) { Runtime.trap("Package not found") };
      case (?p) { p };
    };
  };

  func getHotelInternal(id : UUID) : Hotel {
    switch (hotels.get(id)) {
      case (null) { Runtime.trap("Hotel not found") };
      case (?hotel) { hotel };
    };
  };

  func getAgencyInternal(id : UUID) : TourAgency {
    switch (agencies.get(id)) {
      case (null) { Runtime.trap("Agency not found") };
      case (?agency) { agency };
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Destination Management
  public shared ({ caller }) func createDestination(input : InputTourDestination) : async UUID {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };

    let id = generateId();
    let timestamp = getTimestamp();

    let destination : TourDestination = {
      id;
      name = input.name;
      description = input.description;
      category = input.category;
      location = input.coordinates;
      address = input.address;
      directions = input.directions;
      featured = input.featured;
      active = true;
      mainImage = input.mainImage;
      rating = 0;
      createdAt = timestamp;
      updatedAt = timestamp;
    };

    destinations.add(id, destination);
    id;
  };

  public shared ({ caller }) func updateDestination(id : UUID, input : InputTourDestination) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };

    let existing = getDestinationInternal(id);
    let updated : TourDestination = {
      existing with
      name = input.name;
      description = input.description;
      category = input.category;
      location = input.coordinates;
      address = input.address;
      directions = input.directions;
      featured = input.featured;
      mainImage = input.mainImage;
      updatedAt = getTimestamp();
    };

    destinations.add(id, updated);
  };

  public shared ({ caller }) func toggleDestinationActive(id : UUID) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    let existing = getDestinationInternal(id);
    let updated : TourDestination = {
      existing with
      active = not existing.active;
      updatedAt = getTimestamp();
    };
    destinations.add(id, updated);
  };

  public shared ({ caller }) func deleteDestination(id : UUID) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    if (not destinations.containsKey(id)) {
      Runtime.trap("Destination not found");
    };
    destinations.remove(id);
  };

  public query ({ caller }) func getDestination(id : UUID) : async TourDestination {
    getDestinationInternal(id);
  };

  public query ({ caller }) func getAllDestinations() : async [TourDestination] {
    destinations.values().toArray();
  };

  public query ({ caller }) func getActiveDestinations() : async [TourDestination] {
    destinations.values().toArray().filter(func(d) { d.active });
  };

  public query ({ caller }) func getFeaturedDestinations() : async [TourDestination] {
    destinations.values().toArray().filter(func(d) { d.featured and d.active });
  };

  // Tour Package Management
  public shared ({ caller }) func createTourPackage(input : InputTourPackage) : async UUID {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };

    let id = generateId();
    let timestamp = getTimestamp();

    let tourPackage : TourPackage = {
      id;
      name = input.name;
      description = input.description;
      price = input.price;
      duration = input.duration;
      inclusions = input.inclusions;
      maxParticipants = input.maxParticipants;
      active = true;
      createdAt = timestamp;
      updatedAt = timestamp;
    };

    tourPackages.add(id, tourPackage);
    id;
  };

  public shared ({ caller }) func updateTourPackage(id : UUID, input : InputTourPackage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };

    let existing = getPackageInternal(id);
    let updated : TourPackage = {
      existing with
      name = input.name;
      description = input.description;
      price = input.price;
      duration = input.duration;
      inclusions = input.inclusions;
      maxParticipants = input.maxParticipants;
      updatedAt = getTimestamp();
    };

    tourPackages.add(id, updated);
  };

  public shared ({ caller }) func togglePackageActive(id : UUID) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    let existing = getPackageInternal(id);
    let updated : TourPackage = {
      existing with
      active = not existing.active;
      updatedAt = getTimestamp();
    };
    tourPackages.add(id, updated);
  };

  public shared ({ caller }) func deleteTourPackage(id : UUID) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    if (not tourPackages.containsKey(id)) {
      Runtime.trap("Tour package not found");
    };
    tourPackages.remove(id);
  };

  public query ({ caller }) func getTourPackage(id : UUID) : async TourPackage {
    getPackageInternal(id);
  };

  public query ({ caller }) func getAllTourPackages() : async [TourPackage] {
    tourPackages.values().toArray();
  };

  public query ({ caller }) func getActiveTourPackages() : async [TourPackage] {
    tourPackages.values().toArray().filter(func(p) { p.active });
  };

  // Hotel Management
  public shared ({ caller }) func createHotel(input : InputHotel) : async UUID {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };

    let id = generateId();
    let timestamp = getTimestamp();

    let hotel : Hotel = {
      id;
      name = input.name;
      description = input.description;
      address = input.address;
      pricePerNight = input.pricePerNight;
      rating = input.rating;
      amenities = input.amenities;
      phone = input.phone;
      website = input.website;
      active = true;
      createdAt = timestamp;
      updatedAt = timestamp;
    };

    hotels.add(id, hotel);
    id;
  };

  public shared ({ caller }) func updateHotel(id : UUID, input : InputHotel) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };

    let existing = getHotelInternal(id);
    let updated : Hotel = {
      existing with
      name = input.name;
      description = input.description;
      address = input.address;
      pricePerNight = input.pricePerNight;
      rating = input.rating;
      amenities = input.amenities;
      phone = input.phone;
      website = input.website;
      updatedAt = getTimestamp();
    };

    hotels.add(id, updated);
  };

  public shared ({ caller }) func toggleHotelActive(id : UUID) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    let existing = getHotelInternal(id);
    let updated : Hotel = {
      existing with
      active = not existing.active;
      updatedAt = getTimestamp();
    };
    hotels.add(id, updated);
  };

  public shared ({ caller }) func deleteHotel(id : UUID) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    if (not hotels.containsKey(id)) {
      Runtime.trap("Hotel not found");
    };
    hotels.remove(id);
  };

  public query ({ caller }) func getHotel(id : UUID) : async Hotel {
    getHotelInternal(id);
  };

  public query ({ caller }) func getAllHotels() : async [Hotel] {
    hotels.values().toArray();
  };

  public query ({ caller }) func getActiveHotels() : async [Hotel] {
    hotels.values().toArray().filter(func(h) { h.active });
  };

  // Tour Agency Management
  public shared ({ caller }) func createAgency(input : InputTourAgency) : async UUID {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };

    let id = generateId();
    let timestamp = getTimestamp();

    let agency : TourAgency = {
      id;
      name = input.name;
      description = input.description;
      address = input.address;
      phone = input.phone;
      email = input.email;
      services = input.services;
      active = true;
      createdAt = timestamp;
      updatedAt = timestamp;
    };

    agencies.add(id, agency);
    id;
  };

  public shared ({ caller }) func updateAgency(id : UUID, input : InputTourAgency) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };

    let existing = getAgencyInternal(id);
    let updated : TourAgency = {
      existing with
      name = input.name;
      description = input.description;
      address = input.address;
      phone = input.phone;
      email = input.email;
      services = input.services;
      updatedAt = getTimestamp();
    };

    agencies.add(id, updated);
  };

  public shared ({ caller }) func toggleAgencyActive(id : UUID) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    let existing = getAgencyInternal(id);
    let updated : TourAgency = {
      existing with
      active = not existing.active;
      updatedAt = getTimestamp();
    };
    agencies.add(id, updated);
  };

  public shared ({ caller }) func deleteAgency(id : UUID) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    if (not agencies.containsKey(id)) {
      Runtime.trap("Agency not found");
    };
    agencies.remove(id);
  };

  public query ({ caller }) func getAgency(id : UUID) : async TourAgency {
    getAgencyInternal(id);
  };

  public query ({ caller }) func getAllAgencies() : async [TourAgency] {
    agencies.values().toArray();
  };

  public query ({ caller }) func getActiveAgencies() : async [TourAgency] {
    agencies.values().toArray().filter(func(a) { a.active });
  };

  // Booking Management
  public shared ({ caller }) func createBooking(input : InputBooking) : async UUID {
    // Allow any user including guests to create bookings
    let id = generateId();
    let timestamp = getTimestamp();

    let booking : Booking = {
      id;
      destinationId = input.destinationId;
      packageId = input.packageId;
      customerName = input.customerName;
      customerPhone = input.customerPhone;
      customerEmail = input.customerEmail;
      bookingDate = timestamp;
      numGuests = input.numGuests;
      paymentMethod = input.paymentMethod;
      totalPrice = input.totalPrice;
      status = #pending;
      createdAt = timestamp;
      bookedBy = caller;
    };

    bookings.add(id, booking);
    id;
  };

  public query ({ caller }) func checkBookingStatus(bookingId : UUID) : async BookingStatus {
    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        // Allow admin or booking owner to check status
        if (caller != booking.bookedBy and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only check your own booking status");
        };
        booking.status;
      };
    };
  };

  public shared ({ caller }) func updateBookingStatusAdmin(bookingId : UUID, newStatus : BookingStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        let updatedBooking : Booking = {
          booking with
          status = newStatus;
        };
        bookings.add(bookingId, updatedBooking);
      };
    };
  };

  public shared ({ caller }) func cancelBookingClient(bookingId : UUID) : async () {
    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        // Only the booking owner or admin can cancel
        if (caller != booking.bookedBy and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only cancel your own bookings");
        };
        let updatedBooking : Booking = {
          booking with
          status = #cancelled;
        };
        bookings.add(bookingId, updatedBooking);
      };
    };
  };

  public query ({ caller }) func getUserBookings(customerEmail : Text) : async [Booking] {
    // Only allow users to view their own bookings or admin to view any
    let userBookings = bookings.values().toArray().filter(func(b) { b.customerEmail == customerEmail });
    
    // Check if caller owns any of these bookings or is admin
    if (userBookings.size() > 0) {
      let firstBooking = userBookings[0];
      if (caller != firstBooking.bookedBy and not AccessControl.isAdmin(accessControlState, caller)) {
        Runtime.trap("Unauthorized: Can only view your own bookings");
      };
    };
    
    userBookings;
  };

  public query ({ caller }) func getBooking(bookingId : UUID) : async Booking {
    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        // Only allow booking owner or admin to view
        if (caller != booking.bookedBy and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own bookings");
        };
        booking;
      };
    };
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    bookings.values().toArray().sort(Booking.compareByTimestamp);
  };

  // Gallery Management
  public shared ({ caller }) func addGalleryImages(destinationId : UUID, newImages : [Storage.ExternalBlob]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    if (not destinations.containsKey(destinationId)) {
      Runtime.trap("Destination not found");
    };
    let existing = switch (galleries.get(destinationId)) {
      case (null) { [] };
      case (?existing) { existing };
    };
    let updatedGallery = existing.concat(newImages);
    galleries.add(destinationId, updatedGallery);
  };

  public query ({ caller }) func getGalleryImages(destinationId : UUID) : async [Storage.ExternalBlob] {
    switch (galleries.get(destinationId)) {
      case (null) { Runtime.trap("Gallery not found") };
      case (?gallery) { gallery };
    };
  };

  public query ({ caller }) func getAllFeaturedWithGallery() : async [(TourDestination, [Storage.ExternalBlob])] {
    let featuredDestinations = destinations.values().toArray().filter(func(d) { d.featured });
    featuredDestinations.map(
      func(destination) {
        let gallery = switch (galleries.get(destination.id)) {
          case (null) { [] };
          case (?existing) { existing };
        };
        (destination, gallery);
      }
    );
  };

  public query ({ caller }) func getDestinationWithGallery(destinationId : UUID) : async (TourDestination, [Storage.ExternalBlob]) {
    let destination = getDestinationInternal(destinationId);
    let gallery = switch (galleries.get(destinationId)) {
      case (null) { [] };
      case (?existing) { existing };
    };
    (destination, gallery);
  };

  public query ({ caller }) func getDestinationGalleryImages(destinationId : UUID) : async [Storage.ExternalBlob] {
    switch (galleries.get(destinationId)) {
      case (null) { Runtime.trap("Gallery not found") };
      case (?gallery) { gallery };
    };
  };

  // Analytics Queries
  public query ({ caller }) func getBookingStats() : async {
    totalBookings : Nat;
    confirmedBookings : Nat;
    pendingBookings : Nat;
    cancelledBookings : Nat;
    activeDestinations : Nat;
    activePackages : Nat;
    activeHotels : Nat;
  } {
    let (confirmedCount, pendingCount, cancelledCount) = bookings.values().foldLeft(
      (0, 0, 0),
      func(acc, booking) {
        let (confirmed, pending, cancelled) = acc;
        switch (booking.status) {
          case (#confirmed) { (confirmed + 1, pending, cancelled) };
          case (#pending) { (confirmed, pending + 1, cancelled) };
          case (#cancelled) { (confirmed, pending, cancelled + 1) };
        };
      },
    );

    let activeDestinations = destinations.values().toArray().filter(func(d) { d.active }).size();
    let activePackages = tourPackages.values().toArray().filter(func(p) { p.active }).size();
    let activeHotels = hotels.values().toArray().filter(func(h) { h.active }).size();

    {
      totalBookings = bookings.size();
      confirmedBookings = confirmedCount;
      pendingBookings = pendingCount;
      cancelledBookings = cancelledCount;
      activeDestinations;
      activePackages;
      activeHotels;
    };
  };

  // Admin Utility Query
  public query ({ caller }) func getAllConfirmedBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    bookings.values().toArray().filter(func(b) { b.status == #confirmed });
  };

  // Home Page Data Query
  public query ({ caller }) func getHomePageData() : async {
    featuredDestinations : [TourDestination];
    popularHotels : [Hotel];
    tourPackages : [TourPackage];
    agencies : [TourAgency];
  } {
    let featuredDestinations = destinations.values().toArray().filter(func(d) { d.featured });
    let popularHotels = hotels.values().toArray().filter(func(h) { h.active and h.rating >= 8 });
    let activePackages = tourPackages.values().toArray().filter(func(p) { p.active });
    let activeAgencies = agencies.values().toArray().filter(func(a) { a.active });

    {
      featuredDestinations;
      popularHotels;
      tourPackages = activePackages;
      agencies = activeAgencies;
    };
  };
};
