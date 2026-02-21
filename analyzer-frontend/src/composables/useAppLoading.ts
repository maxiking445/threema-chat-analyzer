import { useLoading } from 'vue-loading-overlay'

export function useAppLoading() {
  return useLoading({
    color: '#1abc5b',
    backgroundColor: '#1a1d23',
    opacity: 0.7,
    isFullPage: false,
  })
}