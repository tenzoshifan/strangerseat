import { useAppStore } from '../store/appStore'

export function useAppSettings() {
  const settings = useAppStore((state) => state.settings)
  const updateSettings = useAppStore((state) => state.updateSettings)

  return { settings, updateSettings }
}
