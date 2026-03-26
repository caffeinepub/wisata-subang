# Wisata Subang

## Current State
- DestinationDetail shows map only when coordinates are valid; rating shows NaN when undefined
- No tour packages section on destination detail page
- AdminPackages already has a price input form
- Packages page shows active packages from backend (falls back to sample data)

## Requested Changes (Diff)

### Add
- Tour packages section on DestinationDetail page showing active packages with price, duration, inclusions
- Default map fallback (center of Subang) when destination has no valid coordinates

### Modify
- DestinationDetail: fix NaN rating with defensive check; show map always (default Subang center coords if no valid coords); add packages section below gallery
- Packages.tsx: ensure it shows real backend data prominently (no functional change needed, already works)

### Remove
- Nothing removed

## Implementation Plan
1. Update DestinationDetail.tsx:
   - Use Subang default coordinates (-6.5, 107.7) when destination has no valid/nonzero coordinates
   - Fix rating display with null check
   - Add useActiveTourPackages hook and render packages section below gallery
2. No backend changes needed
