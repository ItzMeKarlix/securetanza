import { CrimeService } from '../services/crime.service'
import type { CrimeIncident as PrismaCrimeIncident } from './generated/prisma'

export interface CrimeIncident {
  id: string
  barangay: string
  date: Date
  time: string
  crimeType: string
  createdAt: Date
  updatedAt: Date
}

export interface CrimeStats {
  totalCrimes: number
  recentCrimes: number
  crimesByType: { type: string; count: number }[]
  crimesByBarangay: { barangay: string; count: number }[]
  monthlyStats: { month: number; count: number }[]
}

// Get crimes for a specific barangay and date range
export async function getCrimesForBarangay(
  barangayName: string,
  startDate?: Date,
  endDate?: Date,
  limit: number = 200
): Promise<CrimeIncident[]> {
  try {
    const crimes = await CrimeService.getCrimes({
      barangay: barangayName,
      startDateCommitted: startDate?.toISOString(),
      endDateCommitted: endDate?.toISOString(),
      limit,
    })

    // Map Prisma model to CrimeIncident interface
    return crimes.map(crime => ({
      id: crime.id,
      barangay: crime.barangay,
      date: crime.dateCommitted,
      time: crime.timeCommitted,
      crimeType: crime.incidentType,
      createdAt: crime.createdAt,
      updatedAt: crime.updatedAt
    }))
  } catch (error) {
    console.error('Error fetching crimes for barangay:', error)
    return []
  }
}

// Get crime statistics for dashboard
export async function getCrimeStats(
  barangayName?: string,
  startDate?: Date,
  endDate?: Date
): Promise<CrimeStats> {
  try {
    return await CrimeService.getStats({
      barangay: barangayName,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    })
  } catch (error) {
    console.error('Error fetching crime statistics:', error)
    return {
      totalCrimes: 0,
      recentCrimes: 0,
      crimesByType: [],
      crimesByBarangay: [],
      monthlyStats: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, count: 0 }))
    }
  }
}

// Get threat level based on crime count (matches your existing logic)
export function getThreatLevel(crimeCount: number): string {
  if (crimeCount <= 1) return "secure"
  if (crimeCount <= 3) return "low"
  if (crimeCount <= 5) return "moderate"
  if (crimeCount <= 6) return "high"
  return "critical"
}

// Convert database crimes to your existing incident format
export function convertToIncidentFormat(crimes: CrimeIncident[]) {
  return crimes.map(crime => ({
    id: crime.id,
    type: crime.crimeType,
    date: crime.date.toLocaleDateString(),
    time: crime.time,
    status: 'Active', // You can add status logic based on your needs
    location: crime.barangay
  }))
}