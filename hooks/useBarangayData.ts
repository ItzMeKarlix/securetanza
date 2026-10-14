import { useState, useEffect } from 'react'
import { fetchCrimes, transformCrimeToIncident } from '@/lib/api'
import { BarangayData } from '@/constants/dummy'
import { useMapContext } from '@/context/MapContext'
import { useTimeRangeData } from './useTimeRangeData'
import { buildMapQueries, mergeMapStats, readMapCrimes, readMapResponses } from './map-query'

export function useBarangayData(barangayName: string | null) {
  const scope = useMapContext()
  const ranges = useTimeRangeData()
  const statsKey = JSON.stringify(buildMapQueries(scope, ranges, "stats", barangayName).map(query => query.toString()))
  const crimesKey = JSON.stringify(buildMapQueries(scope, ranges, "barangay-counts", barangayName).map(query => query.toString()))
  const key = `${statsKey}:${crimesKey}`
  const [settled, setSettled] = useState<{ key: string; data: BarangayData | null; error: string | null } | null>(null)

  useEffect(() => {
    if (!barangayName) return
    const controller = new AbortController()

    async function loadBarangayData() {
      try {
        const statQueries = (JSON.parse(statsKey) as string[]).map(value => new URLSearchParams(value))
        const crimeQueries = (JSON.parse(crimesKey) as string[]).map(value => new URLSearchParams(value))
        const [results, recent] = await Promise.all([
          readMapResponses("stats", statQueries, controller.signal),
          readMapCrimes(crimeQueries, controller.signal, fetchCrimes, 5),
        ])
        if (controller.signal.aborted) return
        const totals = mergeMapStats(results)
        const stats = {
          ...totals,
          activeCases: results.reduce((sum, result) => sum + (result.activeCases ?? 0), 0),
          resolvedToday: results.reduce((sum, result) => sum + (result.resolvedToday ?? 0), 0),
          activity: Array.from({ length: 12 }, (_, month) => results.reduce((sum, result) => sum + (result.activity?.[month] ?? 0), 0)),
        }
        const crimes = recent.sort((a, b) => +new Date(b.dateCommitted) - +new Date(a.dateCommitted)).slice(0, 5)

        // Transform crimes to incidents
        const incidents = crimes.map(transformCrimeToIncident)

        // Calculate active patrols based on active cases
        const activePatrols = Math.max(1, Math.floor(stats.activeCases / 10))

        // Determine status and risk based on active cases
        const status = stats.activeCases > 20 ? "Alert" : stats.activeCases > 10 ? "Nominal" : "Secure"
        const risk = stats.activeCases > 20 ? "High" : stats.activeCases > 10 ? "Medium" : "Low"

        // Create barangay data object
        const barangayData: BarangayData = {
          name: barangayName!,
          stats: {
            activeCases: stats.activeCases,
            resolvedToday: stats.resolvedToday,
            safetyIndex: stats.safetyIndex,
            activePatrols,
            status,
            risk
          },
          activity: stats.activity,
          incidents,
          analysis: {
            safetyPerformance: stats.activeCases > 20 ? "Critical Zone" : "Stable Output",
            description: `Real-time security metrics for ${barangayName!}. Current threat assessment based on active incidents and resolution rates.`,
            distribution: stats.crimesByType.slice(0, 3).map(crime => ({
              label: crime.type,
              val: crime.count
            })),
            hotspots: [
              `${barangayName!} Main Area`,
              `${barangayName!} Commercial District`
            ]
          }
        }

        setSettled({ key, data: barangayData, error: null })
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Error loading barangay data:', error)
          setSettled({ key, data: null, error: error instanceof Error ? error.message : 'Failed to load barangay data' })
        }
      }
    }

    void loadBarangayData()
    return () => controller.abort()
  }, [barangayName, statsKey, crimesKey, key])

  const current = Boolean(barangayName && settled?.key === key)
  return { data: current ? settled?.data ?? null : null, loading: Boolean(barangayName && !current), error: current ? settled?.error ?? null : null }
}
