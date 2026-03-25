# Wisata Subang

## Current State
New project, no existing application.

## Requested Changes (Diff)

### Add
- **Homepage** with hero section (banner), featured destinations, interactive map placeholder, tour packages, hotel directory, tour & travel directory, booking section with e-wallet options
- **Destinations** page: list + detail pages with photo gallery, description, directions
- **Tour Packages** page: list of packages with pricing and booking
- **Hotels & Penginapan** page: directory with ratings, amenities, contact
- **Tour & Travel Directory** page: list of travel agents/services
- **Booking** page: booking form with e-wallet payment options (OVO, GoPay, DANA, LinkAja)
- **Admin Panel**: manage destinations, tour packages, hotels, tour agencies, bookings
- Role-based access: public visitors vs admin
- Photo galleries with blob storage

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend: Destinations CRUD, Tour Packages CRUD, Hotels CRUD, Tour Agencies CRUD, Bookings CRUD, Admin role check
2. Components: authorization (admin roles), blob-storage (photo galleries)
3. Frontend: Full multi-page app with navigation, public pages, admin panel
4. Sample content: Subang destinations (Sari Ater, Ciater, Gunung Tangkuban Parahu, Curug Cinulang, etc.), sample hotels, tour packages
