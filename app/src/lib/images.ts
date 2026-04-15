// Curated Unsplash images — Indian children, kids smiling, individual child
// portraits, kids in everyday activities. Each is a real child's story vibe,
// NOT generic education stock photos.

const childPortraits = [
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=640&h=360&fit=crop', // smiling children
  'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=640&h=360&fit=crop', // indian kids smiling
  'https://images.unsplash.com/photo-1511949860663-92c5c57d48a7?w=640&h=360&fit=crop', // indian school children
  'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=640&h=360&fit=crop', // children playing
  'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=640&h=360&fit=crop', // happy kid
  'https://images.unsplash.com/photo-1504439904031-93ded9f93e4e?w=640&h=360&fit=crop', // child portrait
  'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=640&h=360&fit=crop', // child looking up
  'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=640&h=360&fit=crop', // kid painting
  'https://images.unsplash.com/photo-1549383028-df014fa3a325?w=640&h=360&fit=crop', // group of kids
  'https://images.unsplash.com/photo-1524069290683-0457abbd6fa3?w=640&h=360&fit=crop', // child drawing
  'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=640&h=360&fit=crop', // child learning
  'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=640&h=360&fit=crop', // child writing
  'https://images.unsplash.com/photo-1610484826917-0f101a7bf7f4?w=640&h=360&fit=crop', // kids reading
  'https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=640&h=360&fit=crop', // kids outdoor activity
  'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=640&h=360&fit=crop', // kids art class
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=640&h=360&fit=crop', // kids studying together
  'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=640&h=360&fit=crop', // girl studying
  'https://images.unsplash.com/photo-1564429238961-bf8ee4e94f48?w=640&h=360&fit=crop', // child with books
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=640&h=360&fit=crop', // kids in group
  'https://images.unsplash.com/photo-1588072432836-e10032774350?w=640&h=360&fit=crop', // children together
];

const schoolImages = [
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=640&h=320&fit=crop', // school building
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=640&h=320&fit=crop', // books
  'https://images.unsplash.com/photo-1588072432836-e10032774350?w=640&h=320&fit=crop', // classroom
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=640&h=320&fit=crop', // school kids
  'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=640&h=320&fit=crop', // colorful school
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=640&h=320&fit=crop', // studying
  'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=640&h=320&fit=crop', // indian kids
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=640&h=320&fit=crop', // happy children
  'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=640&h=320&fit=crop', // studying girl
  'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=640&h=320&fit=crop', // writing
];

/**
 * Get a deterministic child-story thumbnail for a student video.
 */
export function getVideoThumbnail(studentId: string, videoIndex: number): string {
  const hash = simpleHash(studentId + videoIndex);
  return childPortraits[hash % childPortraits.length];
}

/**
 * Get a deterministic image for a school.
 */
export function getSchoolImage(schoolId: string): string {
  const hash = simpleHash(schoolId);
  return schoolImages[hash % schoolImages.length];
}

/**
 * Get a deterministic child portrait for student avatar/fallback.
 */
export function getStudentImage(studentId: string): string {
  const hash = simpleHash(studentId);
  return childPortraits[hash % childPortraits.length];
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}
