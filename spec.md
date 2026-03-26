# Wisata Subang - Version 7 Fixes

## Current State
App has 3 issues:
1. Routes page Point A coordinates are set to Purwakarta (~107.4667) instead of Subang (~107.7588)
2. DestinationDetail page throws unhandled errors showing "Something went wrong!" boundary
3. AdminDestinations form has no photo upload/link field

## Requested Changes (Diff)

### Add
- Photo field in AdminDestinations dialog: text input for photo URL AND file upload button (using ExternalBlob.fromURL and ExternalBlob.fromBytes), storing as mainImage in InputTourDestination

### Modify
- Routes.tsx: Change POINT_A coordinates from lat:-6.5833, lng:107.4667 (Purwakarta) to lat:-6.5700, lng:107.7588 (Subang city center / Alun-Alun Subang). Update label to "Kota Subang".
- DestinationDetail.tsx: Add error handling to useDestination query so backend errors are caught and displayed gracefully instead of triggering error boundary. Add `isError` check and show "Destinasi tidak dapat dimuat" message.

### Remove
- Nothing removed

## Implementation Plan
1. Fix POINT_A in Routes.tsx to Subang coordinates
2. Add error state handling in DestinationDetail.tsx using isError from useQuery
3. Add mainImage photo field (URL input + file upload) to AdminDestinations dialog form
