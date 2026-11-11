import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import {
  MemoryPhoto,
  TeacherProfile,
  DepartmentFaculty,
  INITIAL_MEMORIES,
  INITIAL_TEACHERS,
  INITIAL_DEPARTMENTS,
  INITIAL_PADLET_NOTES,
  INITIAL_TRIBUTES,
} from '../data/memoriesData';
import { TributeMessage, PadletNote } from './tributeRules';
import { idbSet } from './imageStorage';

export interface ContestMoment {
  id: string;
  title: string;
  cohort: string;
  caption: string;
  imageSrc: string;
  likes: number;
  author: string;
  createdAt: number;
}

export const INITIAL_CONTEST_MOMENTS: ContestMoment[] = [
  {
    id: 'moment-1',
    title: 'Khoảnh khắc giờ tự học chiều thu',
    cohort: 'Chi đoàn 12 Chuyên Toán',
    caption: 'Những giờ phụ đạo say mê bên bục giảng phòng 302, nơi thầy trò cùng giải những bài toán hóc búa chuẩn bị cho kỳ thi HSG.',
    imageSrc: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    likes: 89,
    author: 'K30 Toán',
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
  },
  {
    id: 'moment-2',
    title: 'Mùa hoa ban khoe sắc bên hành lang lớp học',
    cohort: 'Chi đoàn 11 Chuyên Văn',
    caption: 'Tà áo dài trắng thướt tha hòa cùng sắc trắng hoa ban Sơn La tinh khôi, lưu dấu những năm tháng thanh xuân tươi đẹp.',
    imageSrc: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    likes: 124,
    author: 'K31 Văn',
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: 'moment-3',
    title: 'Thắp sáng phòng thực hành đêm muộn',
    cohort: 'Đội tuyển Tin học & Vật lý',
    caption: 'Đèn phòng máy tính vẫn sáng rực lúc 21h, thầy giáo cùng học trò miệt mài gỡ từng dòng code thuật toán.',
    imageSrc: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    likes: 95,
    author: 'Đội tuyển Tin',
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
  },
];

// Helper to seed Firestore if a collection is empty
let isSeeding = false;

// 1. MEMORIES SYNC
export function subscribeMemories(callback: (memories: MemoryPhoto[]) => void) {
  const colRef = collection(db, 'memories');
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty && !isSeeding) {
        isSeeding = true;
        try {
          const batch = writeBatch(db);
          INITIAL_MEMORIES.forEach((mem) => {
            const ref = doc(db, 'memories', mem.id);
            batch.set(ref, mem);
          });
          await batch.commit();
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, 'memories');
        } finally {
          isSeeding = false;
        }
        callback(INITIAL_MEMORIES);
        return;
      }

      const list: MemoryPhoto[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as MemoryPhoto);
      });
      // Sort or preserve order
      list.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      callback(list);
      // Local backup
      try {
        localStorage.setItem('csl_memories', JSON.stringify(list));
        idbSet('csl_memories', list);
      } catch {
        // quota ignore
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'memories');
    }
  );
}

export async function syncSaveMemory(memory: MemoryPhoto): Promise<void> {
  const docRef = doc(db, 'memories', memory.id);
  try {
    await setDoc(docRef, { ...memory, updatedAt: Date.now() }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `memories/${memory.id}`);
    throw err;
  }
}

export async function syncDeleteMemory(memoryId: string): Promise<void> {
  const docRef = doc(db, 'memories', memoryId);
  try {
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `memories/${memoryId}`);
    throw err;
  }
}

// 2. TEACHERS SYNC
export function subscribeTeachers(callback: (teachers: TeacherProfile[]) => void) {
  const colRef = collection(db, 'teachers');
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty && !isSeeding) {
        isSeeding = true;
        try {
          const batch = writeBatch(db);
          INITIAL_TEACHERS.forEach((tch) => {
            const ref = doc(db, 'teachers', tch.id);
            batch.set(ref, tch);
          });
          await batch.commit();
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, 'teachers');
        } finally {
          isSeeding = false;
        }
        callback(INITIAL_TEACHERS);
        return;
      }

      const list: TeacherProfile[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as TeacherProfile);
      });
      callback(list);
      try {
        localStorage.setItem('csl_teachers', JSON.stringify(list));
        idbSet('csl_teachers', list);
      } catch {
        // quota ignore
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'teachers');
    }
  );
}

export async function syncSaveTeacher(teacher: TeacherProfile): Promise<void> {
  const docRef = doc(db, 'teachers', teacher.id);
  try {
    await setDoc(docRef, { ...teacher, updatedAt: Date.now() }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `teachers/${teacher.id}`);
    throw err;
  }
}

export async function syncDeleteTeacher(teacherId: string): Promise<void> {
  const docRef = doc(db, 'teachers', teacherId);
  try {
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `teachers/${teacherId}`);
    throw err;
  }
}

// 3. DEPARTMENTS SYNC
export function subscribeDepartments(callback: (depts: DepartmentFaculty[]) => void) {
  const colRef = collection(db, 'departments');
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty && !isSeeding) {
        isSeeding = true;
        try {
          const batch = writeBatch(db);
          INITIAL_DEPARTMENTS.forEach((dep) => {
            const ref = doc(db, 'departments', dep.id);
            batch.set(ref, dep);
          });
          await batch.commit();
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, 'departments');
        } finally {
          isSeeding = false;
        }
        callback(INITIAL_DEPARTMENTS);
        return;
      }

      const list: DepartmentFaculty[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as DepartmentFaculty);
      });
      // Preserve fixed order if known
      list.sort((a, b) => {
        const orderA = INITIAL_DEPARTMENTS.findIndex((x) => x.id === a.id);
        const orderB = INITIAL_DEPARTMENTS.findIndex((x) => x.id === b.id);
        return (orderA === -1 ? 99 : orderA) - (orderB === -1 ? 99 : orderB);
      });
      callback(list);
      try {
        localStorage.setItem('csl_departments', JSON.stringify(list));
      } catch {
        // ignore
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'departments');
    }
  );
}

export async function syncSaveDepartment(dept: DepartmentFaculty): Promise<void> {
  const docRef = doc(db, 'departments', dept.id);
  try {
    await setDoc(docRef, { ...dept, updatedAt: Date.now() }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `departments/${dept.id}`);
    throw err;
  }
}

// 4. CONTEST MOMENTS SYNC
export function subscribeContestMoments(callback: (moments: ContestMoment[]) => void) {
  const colRef = collection(db, 'contest_moments');
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty && !isSeeding) {
        isSeeding = true;
        try {
          const batch = writeBatch(db);
          INITIAL_CONTEST_MOMENTS.forEach((m) => {
            const ref = doc(db, 'contest_moments', m.id);
            batch.set(ref, m);
          });
          await batch.commit();
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, 'contest_moments');
        } finally {
          isSeeding = false;
        }
        callback(INITIAL_CONTEST_MOMENTS);
        return;
      }

      const list: ContestMoment[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as ContestMoment);
      });
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      callback(list);
      try {
        localStorage.setItem('csl_contest_moments', JSON.stringify(list));
      } catch {
        // ignore
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'contest_moments');
    }
  );
}

export async function syncSaveContestMoment(moment: ContestMoment): Promise<void> {
  const docRef = doc(db, 'contest_moments', moment.id);
  try {
    await setDoc(docRef, moment, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `contest_moments/${moment.id}`);
    throw err;
  }
}

export async function syncDeleteContestMoment(id: string): Promise<void> {
  const docRef = doc(db, 'contest_moments', id);
  try {
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `contest_moments/${id}`);
    throw err;
  }
}

// 5. TRIBUTES (LETTERS) SYNC
export function subscribeTributes(callback: (tributes: TributeMessage[]) => void) {
  const colRef = collection(db, 'tributes');
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty && !isSeeding) {
        isSeeding = true;
        try {
          const batch = writeBatch(db);
          INITIAL_TRIBUTES.forEach((t) => {
            const ref = doc(db, 'tributes', t.id);
            batch.set(ref, t);
          });
          await batch.commit();
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, 'tributes');
        } finally {
          isSeeding = false;
        }
        callback(INITIAL_TRIBUTES);
        return;
      }

      const list: TributeMessage[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as TributeMessage);
      });
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      callback(list);
      try {
        localStorage.setItem('csl_tributes', JSON.stringify(list));
      } catch {
        // ignore
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'tributes');
    }
  );
}

export async function syncSaveTribute(tribute: TributeMessage): Promise<void> {
  const docRef = doc(db, 'tributes', tribute.id);
  try {
    await setDoc(docRef, tribute, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `tributes/${tribute.id}`);
    throw err;
  }
}

export async function syncDeleteTribute(tributeId: string): Promise<void> {
  const docRef = doc(db, 'tributes', tributeId);
  try {
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `tributes/${tributeId}`);
    throw err;
  }
}

// 6. PADLET NOTES SYNC
export function subscribePadletNotes(callback: (notes: PadletNote[]) => void) {
  const colRef = collection(db, 'padlet_notes');
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty && !isSeeding) {
        isSeeding = true;
        try {
          const batch = writeBatch(db);
          INITIAL_PADLET_NOTES.forEach((n) => {
            const ref = doc(db, 'padlet_notes', n.id);
            batch.set(ref, n);
          });
          await batch.commit();
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, 'padlet_notes');
        } finally {
          isSeeding = false;
        }
        callback(INITIAL_PADLET_NOTES);
        return;
      }

      const list: PadletNote[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as PadletNote);
      });
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      callback(list);
      try {
        localStorage.setItem('csl_padlet_notes', JSON.stringify(list));
      } catch {
        // ignore
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'padlet_notes');
    }
  );
}

export async function syncSavePadletNote(note: PadletNote): Promise<void> {
  const docRef = doc(db, 'padlet_notes', note.id);
  try {
    await setDoc(docRef, note, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `padlet_notes/${note.id}`);
    throw err;
  }
}

export async function syncDeletePadletNote(id: string): Promise<void> {
  const docRef = doc(db, 'padlet_notes', id);
  try {
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `padlet_notes/${id}`);
    throw err;
  }
}

// 7. COMPETITION FLOWER STATS
export interface FlowerScoreStats {
  id: string;
  flower9: number;
  flower10: number;
  participationRate: number;
}

const DEFAULT_FLOWER_STATS: FlowerScoreStats = {
  id: 'current_week',
  flower9: 1280,
  flower10: 895,
  participationRate: 100,
};

export function subscribeCompetitionStats(callback: (stats: FlowerScoreStats) => void) {
  const docRef = doc(db, 'competition_stats', 'current_week');
  return onSnapshot(
    docRef,
    async (snapshot) => {
      if (!snapshot.exists()) {
        try {
          await setDoc(docRef, DEFAULT_FLOWER_STATS);
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, 'competition_stats/current_week');
        }
        callback(DEFAULT_FLOWER_STATS);
        return;
      }
      callback(snapshot.data() as FlowerScoreStats);
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, 'competition_stats/current_week');
    }
  );
}

export async function syncAddFlowerScore(type: 'flower9' | 'flower10', delta = 1): Promise<void> {
  const docRef = doc(db, 'competition_stats', 'current_week');
  try {
    const snap = await getDocs(collection(db, 'competition_stats'));
    let current = { ...DEFAULT_FLOWER_STATS };
    snap.forEach((d) => {
      if (d.id === 'current_week') current = d.data() as FlowerScoreStats;
    });
    const updated = {
      ...current,
      [type]: (current[type] || 0) + delta,
      updatedAt: Date.now(),
    };
    await setDoc(docRef, updated, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'competition_stats/current_week');
  }
}
