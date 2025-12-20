import { reactive } from "vue";

export interface Toast {
  id: number;
  message: string;
}

const state = reactive({
  toasts: [] as Toast[],
  nextId: 1,
});

export function pushErrorToast(message: string, duration = 3000) {
  const id = state.nextId++;
  state.toasts.push({ id, message });

  window.setTimeout(() => {
    const idx = state.toasts.findIndex((t) => t.id === id);
    if (idx !== -1) state.toasts.splice(idx, 1);
  }, duration);
}

export function useErrorToasts() {
  return state.toasts;
}
