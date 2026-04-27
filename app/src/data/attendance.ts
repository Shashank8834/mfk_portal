import { MENTORS } from './mentors'

export type AttendanceStatus = 'ontime' | 'late' | 'absent'

export type AttendanceRecord = {
  mentorId: string
  schoolId: string
  date: string // YYYY-MM-DD
  timeIn: string | null
  timeOut: string | null
  status: AttendanceStatus
}

export type Holiday = {
  schoolId: string | 'ALL'
  date: string
  name: string
}

export const HOLIDAYS: Holiday[] = [
  { schoolId: 'ALL',    date: '2026-04-14', name: 'Dr. Ambedkar Jayanti' },
  { schoolId: 'SCH003', date: '2026-04-25', name: 'GHPS Whitefield Annual Day' },
  { schoolId: 'ALL',    date: '2026-05-01', name: 'Labour Day' },
  { schoolId: 'ALL',    date: '2026-05-23', name: 'Karnataka Rajyotsava Prep Day' },
]

function hash(s: string): number {
  return Math.abs(s.split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0))
}

function mockStatus(mentorId: string, date: string): AttendanceStatus {
  const h = hash(mentorId + date) % 10
  if (h < 6) return 'ontime'
  if (h < 8) return 'late'
  return 'absent'
}

function mockTimeIn(status: AttendanceStatus, mentorId: string, date: string): string | null {
  if (status === 'absent') return null
  const h = hash(mentorId + date + 'in') % 100
  if (status === 'ontime') return `09:${(h % 15).toString().padStart(2, '0')}`
  return `09:${(20 + (h % 35)).toString().padStart(2, '0')}`
}

function mockTimeOut(mentorId: string, date: string): string | null {
  const h = hash(mentorId + date + 'out') % 60
  return `12:${h.toString().padStart(2, '0')}`
}

// April 2026 past school days (today = Apr 19, Sunday)
const MWF_PAST = ['2026-04-06', '2026-04-08', '2026-04-10', '2026-04-13', '2026-04-15', '2026-04-17']
const TTS_PAST = ['2026-04-07', '2026-04-09', '2026-04-11', '2026-04-16', '2026-04-18']

const HOLIDAY_DATES = new Set(HOLIDAYS.filter((h) => h.schoolId === 'ALL').map((h) => h.date))

function generateRecords(): AttendanceRecord[] {
  const records: AttendanceRecord[] = []

  for (const mentor of MENTORS) {
    const isMWF = mentor.mandatoryDays.includes(1)
    const pastDays = isMWF ? MWF_PAST : TTS_PAST

    for (const schoolId of mentor.schoolIds) {
      for (const date of pastDays) {
        if (HOLIDAY_DATES.has(date)) continue

        const status = mockStatus(mentor.id, date)
        records.push({
          mentorId: mentor.id,
          schoolId,
          date,
          timeIn: mockTimeIn(status, mentor.id, date),
          timeOut: status !== 'absent' ? mockTimeOut(mentor.id, date) : null,
          status,
        })
      }
    }
  }

  return records
}

export const ATTENDANCE_RECORDS: AttendanceRecord[] = generateRecords()

export function recordsFor(mentorId: string, schoolId: string): AttendanceRecord[] {
  return ATTENDANCE_RECORDS.filter((r) => r.mentorId === mentorId && r.schoolId === schoolId)
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function latestStatus(mentorId: string, schoolId: string): AttendanceStatus | null {
  const records = recordsFor(mentorId, schoolId)
  return records.length ? records[records.length - 1].status : null
}

export function isHoliday(date: string, schoolId: string): Holiday | undefined {
  return HOLIDAYS.find((h) => h.date === date && (h.schoolId === 'ALL' || h.schoolId === schoolId))
}
