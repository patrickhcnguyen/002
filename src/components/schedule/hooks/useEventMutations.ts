import { useDeleteEventMutation } from "./mutations/useDeleteEventMutation";
import { useCreateEventMutation } from "./mutations/useCreateEventMutation";
import { useUpdateEventMutation } from "./mutations/useUpdateEventMutation";

export function useEventMutations() {
  const deleteEventMutation = useDeleteEventMutation();
  const createEventMutation = useCreateEventMutation();
  const updateEventMutation = useUpdateEventMutation();

  return {
    deleteEventMutation,
    createEventMutation,
    updateEventMutation,
  };
}