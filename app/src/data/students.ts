import { Student, Video } from '@/types';
import { getVideoThumbnail } from '@/lib/images';
import { ASSUMED_NAME_POOL, generatePnr, publicName, publicInitials } from '@/lib/utils';

const firstNames = [
  'Aarav', 'Aditi', 'Ananya', 'Arjun', 'Diya', 'Ishaan', 'Kavya', 'Krishna',
  'Lakshmi', 'Manish', 'Neha', 'Pranav', 'Priya', 'Rahul', 'Riya', 'Rohan',
  'Sakshi', 'Sanjay', 'Shreya', 'Tanvi', 'Varun', 'Vidya', 'Vikram', 'Zara',
  'Aditya', 'Bhavya', 'Chetan', 'Divya', 'Esha', 'Farhan', 'Gauri', 'Harini',
  'Ishan', 'Janaki', 'Karan', 'Lavanya', 'Meera', 'Nikhil', 'Pooja', 'Rajesh',
  'Sneha', 'Tejas', 'Uma', 'Vivek', 'Yamini', 'Abhishek', 'Bindu', 'Chandana',
];

const lastNames = [
  'Sharma', 'Kumar', 'Reddy', 'Gowda', 'Nair', 'Patel', 'Singh', 'Verma',
  'Shetty', 'Rao', 'Hegde', 'Kulkarni', 'Joshi', 'Mishra', 'Das', 'Gupta',
];

const storyTypes = [
  'My Story', 'My Journey', 'My Dream', 'A Day in My Life',
  'What I Love', 'My School Life', 'My Favorite Moment', 'Where I Come From',
  'What Inspires Me', 'My Progress', 'My Achievement', 'Looking Ahead',
];

const schoolNames = [
  'Austin Town Boys High School', 'Austin Town Girls High School', 'Bannappa Park High School',
  'Basavanagudi High School', 'Broadway High School', 'Byrasandra High School',
  'Bhairaveshwaranagar High School', 'Chamarajapet High School', 'Cleveland Town High School',
  'Cottonpete High School', 'Cox Town High School', 'Dispensary Road High School',
  'Gandhinagar High School', 'Ganganagar High School', 'Herohalli High School',
  'Jayamahal High School', 'Jogupalya Boys High School', 'Jogupalya Girls High School',
  'Kasturba Nagar High School', 'K.G. Nagar High School', 'Kodandarampura High School',
  'Laggere High School', 'Magadi Road High School', 'Shanthinagar High School',
  'Vijayanagar High School', 'Kattigenahalli High School', 'Mattikere High School',
  'Padarayanapura High School',
];

const schoolIds = schoolNames.map((_, i) => `sch-${String(i + 1).padStart(3, '0')}`);

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function generateVideo(studentId: string, publicStudentName: string, publicFirstName: string, schoolName: string, idx: number): Video {
  const storyType = storyTypes[idx % storyTypes.length];
  const day = Math.floor(Math.random() * 28) + 1;
  const month = Math.floor(Math.random() * 6) + 1;
  const mins = Math.floor(Math.random() * 4) + 1;
  const secs = Math.floor(Math.random() * 60);
  return {
    id: `vid-${studentId}-${idx}`,
    // Public title uses the assumed name only — no real names ever appear in
    // video metadata (Hartej's SOP: "in no video will the child's name be mentioned").
    title: `${publicFirstName}'s Story — ${storyType}`,
    thumbnailUrl: getVideoThumbnail(studentId, idx),
    videoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    duration: `${mins}:${secs.toString().padStart(2, '0')}`,
    durationSeconds: mins * 60 + secs,
    date: `2025-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
    activityType: storyType,
    studentId,
    studentName: publicStudentName,
    schoolName,
  };
}

// Generate 120 realistic students spread across schools
function generateStudents(): Student[] {
  const students: Student[] = [];
  let studentIdx = 0;

  // Stable letter sequence for the assumed last initial — deterministic from
  // the index so it doesn't change across reloads.
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (let s = 0; s < schoolIds.length; s++) {
    const studentsPerSchool = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < studentsPerSchool; i++) {
      studentIdx++;
      const firstName = firstNames[studentIdx % firstNames.length];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${firstName} ${lastName}`;
      const id = `stu-${String(studentIdx).padStart(3, '0')}`;
      const grade = 8 + Math.floor(Math.random() * 3); // Grades 8-10

      // Anonymisation: pick an assumed first name from the pool that does not
      // collide with the real first name (Hartej's constraint).
      let assumedFirstName = ASSUMED_NAME_POOL[studentIdx % ASSUMED_NAME_POOL.length];
      if (assumedFirstName.toLowerCase() === firstName.toLowerCase()) {
        assumedFirstName = ASSUMED_NAME_POOL[(studentIdx + 1) % ASSUMED_NAME_POOL.length];
      }
      const assumedLastInitial = letters[(studentIdx * 7) % 26];
      const pnr = generatePnr(id);
      const stub = { assumedFirstName, assumedLastInitial, pnr, graduated: false };
      const pubName = publicName(stub);
      const pubFirst = assumedFirstName;

      const videoCount = 2 + Math.floor(Math.random() * 4);
      const videos: Video[] = [];
      for (let v = 0; v < videoCount; v++) {
        videos.push(generateVideo(id, pubName, pubFirst, schoolNames[s], v));
      }

      students.push({
        id,
        name: fullName,
        realFirstName: firstName,
        realLastName: lastName,
        assumedFirstName,
        assumedLastInitial,
        pnr,
        graduated: false,
        schoolId: schoolIds[s],
        schoolName: schoolNames[s],
        grade,
        // Avatars are seeded on the public initials so the image itself
        // doesn't leak the real name.
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(pubName)}&backgroundColor=110F28&textColor=5B4DB1`,
        initials: publicInitials(stub),
        videos,
        journalsLogged: 5 + Math.floor(Math.random() * 25),
        skillsEarned: 2 + Math.floor(Math.random() * 8),
        monthsActive: 1 + Math.floor(Math.random() * 18),
        sponsorCount: Math.floor(Math.random() * 15),
      });
    }
  }
  return students;
}

export const students: Student[] = generateStudents();

export function getStudentById(id: string): Student | undefined {
  return students.find((s) => s.id === id);
}

export function getStudentByPnr(pnr: string): Student | undefined {
  const needle = pnr.toUpperCase();
  return students.find((s) => s.pnr === needle);
}

/**
 * Resolve a student by either internal id ("stu-007") or public PNR ("K7M2X9").
 * Used by the dynamic route so old links keep working after the URL slug
 * switched to PNR.
 */
export function lookupStudent(idOrPnr: string): Student | undefined {
  return getStudentByPnr(idOrPnr) ?? getStudentById(idOrPnr);
}

export function getStudentsBySchool(schoolId: string): Student[] {
  return students.filter((s) => s.schoolId === schoolId);
}

export function getTrendingStudents(count: number = 10): Student[] {
  return [...students]
    .sort((a, b) => b.videos.length - a.videos.length)
    .slice(0, count);
}

export function getAllVideos(): Video[] {
  return students.flatMap(s => s.videos).sort((a, b) => b.date.localeCompare(a.date));
}
