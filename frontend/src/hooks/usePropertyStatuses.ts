import { useEffect, useMemo, useState } from 'react'
import { getPropertyStatuses } from '../services/propertyService'
import type { PropertyStatus } from '../types/property'
import { STATUS_LABELS } from '../constants/property'

export interface SelectOption {
  value: string
  label: string
}

function toLabel(status: PropertyStatus): string {
  return STATUS_LABELS[status] ?? status.charAt(0).toUpperCase() + status.slice(1)
}

export function usePropertyStatuses() {
  const [statuses, setStatuses] = useState<PropertyStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    setIsLoading(true)
    setError(null)

    void (async () => {
      try {
        const result = await getPropertyStatuses()
        if (!alive) return
        setStatuses(result.data.statuses ?? [])
      } catch (e) {
        if (!alive) return
        setError(e instanceof Error ? e.message : 'Failed to load allowed statuses.')
        setStatuses([])
      } finally {
        if (!alive) return
        setIsLoading(false)
      }
    })()

    return () => {
      alive = false
    }
  }, [])

  const options = useMemo<SelectOption[]>(
    () => statuses.map((s) => ({ value: s, label: toLabel(s) })),
    [statuses],
  )

  return { statuses, options, isLoading, error }
}

