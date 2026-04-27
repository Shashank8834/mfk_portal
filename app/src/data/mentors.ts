export type School = {
  id: string
  name: string
  code: string
  ssid: string
  location: string
}

export type Mentor = {
  id: string
  name: string
  phone: string
  schoolIds: string[]
  // 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
  mandatoryDays: number[]
}

export const SCHOOLS: School[] = [
  { id: 'SCH001', name: 'Jawahar Navodaya Vidyalaya', code: '10234', ssid: 'JNV_SCHOOL_NET', location: 'Koramangala' },
  { id: 'SCH002', name: 'Kendriya Vidyalaya HSR Layout', code: '10411', ssid: 'KV_HSR_WIFI', location: 'HSR Layout' },
  { id: 'SCH003', name: 'GHPS Whitefield', code: '20187', ssid: 'GHPS_WFLD_EDU', location: 'Whitefield' },
  { id: 'SCH004', name: 'Government High School Yelahanka', code: '30562', ssid: 'GHS_YLHK_NET', location: 'Yelahanka' },
  { id: 'SCH005', name: 'BGS Public School Rajajinagar', code: '41093', ssid: 'BGS_RJN_WIFI', location: 'Rajajinagar' },
]

export const MENTORS: Mentor[] = [
  { id: 'M001', name: 'Priya Sharma',    phone: '9876543210', schoolIds: ['SCH001', 'SCH002'], mandatoryDays: [1, 3, 5] },
  { id: 'M002', name: 'Anita Rao',       phone: '9876543211', schoolIds: ['SCH001'],            mandatoryDays: [1, 3, 5] },
  { id: 'M003', name: 'Meera Krishnan',  phone: '9876543212', schoolIds: ['SCH002', 'SCH003'], mandatoryDays: [2, 4, 6] },
  { id: 'M004', name: 'Sunita Verma',    phone: '9876543213', schoolIds: ['SCH003'],            mandatoryDays: [1, 3, 5] },
  { id: 'M005', name: 'Radha Pillai',    phone: '9876543214', schoolIds: ['SCH004'],            mandatoryDays: [1, 3, 5] },
  { id: 'M006', name: 'Kavitha Nair',    phone: '9876543215', schoolIds: ['SCH004', 'SCH005'], mandatoryDays: [1, 3, 5] },
  { id: 'M007', name: 'Deepa Iyer',      phone: '9876543216', schoolIds: ['SCH005'],            mandatoryDays: [2, 4, 6] },
  { id: 'M008', name: 'Lavanya Murthy',  phone: '9876543217', schoolIds: ['SCH001', 'SCH005'], mandatoryDays: [1, 3, 5] },
]

export function schoolById(id: string) {
  return SCHOOLS.find((s) => s.id === id)
}

export function mentorById(id: string) {
  return MENTORS.find((m) => m.id === id)
}
