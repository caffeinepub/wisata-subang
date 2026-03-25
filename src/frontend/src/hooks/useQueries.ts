import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BookingStatus,
  InputBooking,
  InputHotel,
  InputTourAgency,
  InputTourDestination,
  InputTourPackage,
  UserRole,
} from "../backend";
import type { UUID } from "../backend";
import { useActor } from "./useActor";

export function useHomePageData() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["homePageData"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getHomePageData();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useActiveDestinations() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["activeDestinations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveDestinations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDestination(id: UUID | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["destination", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getDestinationWithGallery(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useActiveTourPackages() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["activeTourPackages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveTourPackages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useActiveHotels() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["activeHotels"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveHotels();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useActiveAgencies() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["activeAgencies"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveAgencies();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBooking() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (input: InputBooking) => {
      if (!actor) throw new Error("Not connected");
      return actor.createBooking(input);
    },
  });
}

// Admin queries
export function useAllDestinations() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allDestinations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDestinations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllTourPackages() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allTourPackages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTourPackages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllHotels() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allHotels"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllHotels();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllAgencies() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allAgencies"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAgencies();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllBookings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBookingStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["bookingStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBookingStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminDestinationMutations() {
  const { actor } = useActor();
  const qc = useQueryClient();
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["allDestinations"] });
  const create = useMutation({
    mutationFn: (input: InputTourDestination) =>
      actor!.createDestination(input),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({ id, input }: { id: UUID; input: InputTourDestination }) =>
      actor!.updateDestination(id, input),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: UUID) => actor!.deleteDestination(id),
    onSuccess: invalidate,
  });
  const toggle = useMutation({
    mutationFn: (id: UUID) => actor!.toggleDestinationActive(id),
    onSuccess: invalidate,
  });
  return { create, update, remove, toggle };
}

export function useAdminPackageMutations() {
  const { actor } = useActor();
  const qc = useQueryClient();
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["allTourPackages"] });
  const create = useMutation({
    mutationFn: (input: InputTourPackage) => actor!.createTourPackage(input),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({ id, input }: { id: UUID; input: InputTourPackage }) =>
      actor!.updateTourPackage(id, input),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: UUID) => actor!.deleteTourPackage(id),
    onSuccess: invalidate,
  });
  const toggle = useMutation({
    mutationFn: (id: UUID) => actor!.togglePackageActive(id),
    onSuccess: invalidate,
  });
  return { create, update, remove, toggle };
}

export function useAdminHotelMutations() {
  const { actor } = useActor();
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["allHotels"] });
  const create = useMutation({
    mutationFn: (input: InputHotel) => actor!.createHotel(input),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({ id, input }: { id: UUID; input: InputHotel }) =>
      actor!.updateHotel(id, input),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: UUID) => actor!.deleteHotel(id),
    onSuccess: invalidate,
  });
  const toggle = useMutation({
    mutationFn: (id: UUID) => actor!.toggleHotelActive(id),
    onSuccess: invalidate,
  });
  return { create, update, remove, toggle };
}

export function useAdminAgencyMutations() {
  const { actor } = useActor();
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["allAgencies"] });
  const create = useMutation({
    mutationFn: (input: InputTourAgency) => actor!.createAgency(input),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({ id, input }: { id: UUID; input: InputTourAgency }) =>
      actor!.updateAgency(id, input),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: UUID) => actor!.deleteAgency(id),
    onSuccess: invalidate,
  });
  const toggle = useMutation({
    mutationFn: (id: UUID) => actor!.toggleAgencyActive(id),
    onSuccess: invalidate,
  });
  return { create, update, remove, toggle };
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: UUID; status: BookingStatus }) =>
      actor!.updateBookingStatusAdmin(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allBookings"] }),
  });
}

export function useAssignRole() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: ({ user, role }: { user: Principal; role: UserRole }) =>
      actor!.assignCallerUserRole(user, role),
  });
}

export function useBootstrapAdmin() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.bootstrapAdmin();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["isAdmin"] });
    },
  });
}
