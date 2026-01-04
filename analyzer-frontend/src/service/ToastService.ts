import { reactive } from "vue";

export interface Toast {
  id: number;
  message: string;
  type: "error" | "success";
}

const state = reactive({
  toasts: [] as Toast[],
  nextId: 1,
});

export function pushErrorToast(message: string, duration = 3000) {
  const id = state.nextId++;
  state.toasts.push({ id, message, type: "error" });

  window.setTimeout(() => {
    const idx = state.toasts.findIndex((t) => t.id === id);
    if (idx !== -1) state.toasts.splice(idx, 1);
  }, duration);
}

export function pushSuccessToast(message: string, duration = 3000) {
  const id = state.nextId++;
  state.toasts.push({ id, message, type: "success" });

  window.setTimeout(() => {
    const idx = state.toasts.findIndex((t) => t.id === id);
    if (idx !== -1) state.toasts.splice(idx, 1);
  }, duration);
}

export function useErrorToasts() {
  return state.toasts;
}
