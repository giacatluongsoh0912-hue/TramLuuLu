import {
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  runTransaction,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import {
  MemoryPhoto,
  TeacherProfile,
  DepartmentFaculty,
  LeadershipMilestone,
  LEADERSHIP_TIMELINE_DATA,
  INITIAL_MEMORIES,
  INITIAL_TEACHERS,
  INITIAL_DEPARTMENTS,
  INITIAL_PADLET_NOTES,
  INITIAL_TRIBUTES,
} from '../data/memoriesData';
import { TributeMessage, PadletNote } from './tributeRules';
import { compressDataUrl, idbGet, idbSet } from './imageStorage';
import {
  DEFAULT_SCHOOL_FACEBOOK_URL,
  type ParsedFacebookPost,
  selectNewFacebookPostsToSync,
} from './facebookFeedParser';
import {
  buildOrderMap,
  sortMemoriesDeterministically,
  sortTeachersDeterministically,
  sortLeadershipDeterministically,
  sortFilmFramesDeterministically,
  sortDepartmentsDeterministically,
  sortByNewestDeterministically,
  splitDataUrlIntoChunks,
  assembleMediaChunks,
} from './syncHelpers';

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
    title: 'Những Tiết Sinh Hoạt Ấm Áp & Bụi Phấn Bục Giảng',
    cohort: 'KHỐI 12',
    caption:
      'Lời dặn dò ân cần trước kỳ thi quan trọng, những giờ phụ đạo say mê bên bục giảng và sự tận tâm như người cha, người mẹ thứ hai của thầy cô Chuyên Sơn La.',
    imageSrc: '/assets/aistudio/image_7c4a105b.png',
    likes: 142,
    author: 'K31 Chuyên Sơn La',
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
  },
  {
    id: 'moment-2',
    title: 'Mùa Hoa Ban Nở Trắng & Vòng Xòe Đoàn Kết',
    cohort: 'NGOẠI KHÓA',
    caption:
      'Tháng Ba Tây Bắc, thầy và trò cùng hòa chung bước xòe dưới tán hoa ban trắng muốt sân trường, lưu dấu thanh xuân rực rỡ.',
    imageSrc: '/assets/aistudio/Tr_m_k_t_n_i_s___2__3771c580.png',
    likes: 168,
    author: 'Đoàn trường CSL',
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: 'moment-3',
    title: 'Thắp Sáng Phòng Ôn Thi Đội Tuyển Quốc Gia',
    cohort: 'GIỜ HỌC TỐT',
    caption:
      'Ánh đèn phòng thực hành và lớp chuyên vẫn sáng rực đêm muộn, thầy trò miệt mài cùng nhau chinh phục những đỉnh cao tri thức mới.',
    imageSrc: '/assets/aistudio/image_788055f8.png',
    likes: 135,
    author: 'Đội tuyển HSG CSL',
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
  },
];

// ============================================================================
// HIGH-CAPACITY CHUNKED CLOUD MEDIA STORAGE (Firestore + IndexedDB cache)
// Allows large photo uploads (up to ~4.5 MB encoded JPEG) without hitting
// localStorage 5MB limits or Firestore 1MB per-document limits.
// ============================================================================

const MEDIA_PREFIX = 'media://';
const CHUNK_CHAR_LIMIT = 400_000; // safely below firestore.rules limit (600_000)
const MAX_CHUNKS = 20;
const DEFAULT_FALLBACK_IMAGE = '/assets/aistudio/Logo_THPT_Chuyen_Son_La_bf6a8e06.png';

const mediaMemoryCache = new Map<string, string>();
const mediaInflight = new Map<string, Promise<string>>();

export function isMediaRef(src?: string | null): boolean {
  return Boolean(src && src.startsWith(MEDIA_PREFIX));
}

export function getCachedMediaUrl(src?: string | null): string | null {
  if (!src) return null;
  if (!src.startsWith(MEDIA_PREFIX)) return src;
  const mediaId = src.slice(MEDIA_PREFIX.length);
  return mediaId ? mediaMemoryCache.get(mediaId) || null : null;
}

export async function uploadMediaAsset(dataUrlOrUrl: string): Promise<string> {
  if (!dataUrlOrUrl || !dataUrlOrUrl.startsWith('data:')) {
    return dataUrlOrUrl;
  }

  const mediaId = `med_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const mimeMatch = dataUrlOrUrl.match(/^data:([^;]+);/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

  const chunks = splitDataUrlIntoChunks(dataUrlOrUrl, CHUNK_CHAR_LIMIT);

  if (chunks.length === 0 || chunks.length > MAX_CHUNKS) {
    throw new Error('Dung lượng ảnh vượt quá giới hạn lưu trữ cho phép. Vui lòng chọn ảnh nhỏ hơn.');
  }

  try {
    // Commit chunks in safe batches (max 8 chunks per batch to stay well under 10MB HTTP request limit)
    const BATCH_CHUNK_SIZE = 8;
    for (let start = 0; start < chunks.length; start += BATCH_CHUNK_SIZE) {
      const slice = chunks.slice(start, start + BATCH_CHUNK_SIZE);
      const batch = writeBatch(db);
      slice.forEach((chunkData, offset) => {
        const index = start + offset;
        const chunkRef = doc(db, 'media_chunks', `${mediaId}_${index}`);
        batch.set(chunkRef, {
          mediaId,
          index,
          data: chunkData,
        });
      });

      const isFinalBatch = start + BATCH_CHUNK_SIZE >= chunks.length;
      if (isFinalBatch) {
        const manifestRef = doc(db, 'media_assets', mediaId);
        batch.set(manifestRef, {
          id: mediaId,
          mimeType,
          totalChunks: chunks.length,
          totalBytes: dataUrlOrUrl.length,
          totalLength: dataUrlOrUrl.length,
          createdAt: Date.now(),
        });
      }

      await batch.commit();
    }

    mediaMemoryCache.set(mediaId, dataUrlOrUrl);
    await idbSet(`media:${mediaId}`, dataUrlOrUrl);

    return `${MEDIA_PREFIX}${mediaId}`;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `media_assets/${mediaId}`);
    throw err;
  }
}

async function fetchMediaFromFirestore(mediaId: string): Promise<string | null> {
  const manifestRef = doc(db, 'media_assets', mediaId);
  const manifestSnap = await getDoc(manifestRef);
  if (!manifestSnap.exists()) {
    return null;
  }

  const manifest = manifestSnap.data() as { totalChunks?: number };
  const totalChunks = manifest.totalChunks || 0;
  if (totalChunks <= 0 || totalChunks > MAX_CHUNKS) {
    return null;
  }

  const chunkSnaps = await Promise.all(
    Array.from({ length: totalChunks }, (_, idx) =>
      getDoc(doc(db, 'media_chunks', `${mediaId}_${idx}`))
    )
  );

  const chunks: Array<{ index: number; data?: string }> = [];
  for (let idx = 0; idx < chunkSnaps.length; idx++) {
    const snap = chunkSnaps[idx];
    if (!snap.exists()) return null;
    const d = snap.data() as { index?: number; data?: string };
    chunks.push({ index: d.index ?? idx, data: d.data });
  }

  return assembleMediaChunks(chunks);
}

export async function resolveMediaUrl(src: string): Promise<string> {
  if (!src) return DEFAULT_FALLBACK_IMAGE;
  if (!src.startsWith(MEDIA_PREFIX)) return src;

  const mediaId = src.slice(MEDIA_PREFIX.length);
  if (!mediaId) return DEFAULT_FALLBACK_IMAGE;

  const memCached = mediaMemoryCache.get(mediaId);
  if (memCached) return memCached;

  const existingPromise = mediaInflight.get(mediaId);
  if (existingPromise) return existingPromise;

  const task = (async () => {
    try {
      const localCached = await idbGet<string>(`media:${mediaId}`);
      if (localCached && localCached.startsWith('data:')) {
        mediaMemoryCache.set(mediaId, localCached);
        return localCached;
      }

      let combined = await fetchMediaFromFirestore(mediaId);
      if (!combined) {
        // Brief propagation retry in case another client just wrote chunks + doc
        await new Promise((r) => setTimeout(r, 350));
        combined = await fetchMediaFromFirestore(mediaId);
      }

      if (!combined) return DEFAULT_FALLBACK_IMAGE;
      mediaMemoryCache.set(mediaId, combined);
      await idbSet(`media:${mediaId}`, combined);
      return combined;
    } catch {
      return DEFAULT_FALLBACK_IMAGE;
    } finally {
      mediaInflight.delete(mediaId);
    }
  })();

  mediaInflight.set(mediaId, task);
  return task;
}

// ============================================================================
// MIGRATION & CLEANUP HELPERS
// ============================================================================

const LEGACY_FICTIONAL_NAMES = new Set([
  'Thầy Trần Văn Cường',
  'Cô Nguyễn Thị Lan Hương',
  'Thầy Lê Anh Tuấn',
  'Cô Hoàng Thu Trang',
  'Thầy Hoàng Văn Minh',
  'Cô Lò Thị Thu Thủy',
  'NGƯT. Lê Văn A',
  'ThS. Phạm Văn C',
  'Cô Nguyễn Thị B',
]);

function isStalePlaceholderUrl(url?: string): boolean {
  if (!url) return true;
  return url.includes('images.unsplash.com') || url.includes('Tr_m_k_t_n_i_s___1');
}

function clearBloatLocalStorageKeys() {
  try {
    [
      'csl_memories',
      'csl_teachers',
      'csl_contest_moments',
      'csl_contest_part2_moments',
      'csl_flower_competition_stats',
    ].forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}

clearBloatLocalStorageKeys();

const MEMORY_SEED_ORDER = buildOrderMap(INITIAL_MEMORIES);
const TEACHER_SEED_ORDER = buildOrderMap(INITIAL_TEACHERS);
const DEPARTMENT_SEED_ORDER = buildOrderMap(INITIAL_DEPARTMENTS);

let didMigrateMemories = false;
let didMigrateTeachers = false;
let didMigrateLeadership = false;
let didMigrateDepartments = false;
let didMigrateMoments = false;

// ============================================================================
// 1. MEMORIES SYNC
// ============================================================================

export function subscribeMemories(callback: (memories: MemoryPhoto[]) => void) {
  const colRef = collection(db, 'memories');
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          INITIAL_MEMORIES.forEach((mem) => {
            batch.set(doc(db, 'memories', mem.id), mem);
          });
          await batch.commit();
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, 'memories');
        }
        callback(INITIAL_MEMORIES);
        idbSet('csl_memories', INITIAL_MEMORIES);
        return;
      }

      const list: MemoryPhoto[] = [];
      const byId = new Map<string, MemoryPhoto>();
      snapshot.forEach((d) => {
        const data = d.data() as MemoryPhoto;
        list.push(data);
        byId.set(data.id, data);
      });

      // One-time idempotent repair for stale Unsplash/banner placeholders on default memories
      if (!didMigrateMemories) {
        didMigrateMemories = true;
        const fixes: MemoryPhoto[] = [];
        for (const seed of INITIAL_MEMORIES) {
          const existing = byId.get(seed.id);
          if (!existing) {
            fixes.push(seed);
          } else if (isStalePlaceholderUrl(existing.imageSrc)) {
            fixes.push({ ...existing, imageSrc: seed.imageSrc });
          }
        }
        if (fixes.length > 0) {
          try {
            const batch = writeBatch(db);
            fixes.forEach((f) => batch.set(doc(db, 'memories', f.id), f, { merge: true }));
            await batch.commit();
          } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, 'memories_migration');
          }
        }
      }

      const sorted = sortMemoriesDeterministically(list, MEMORY_SEED_ORDER);
      callback(sorted);
      idbSet('csl_memories', sorted);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'memories');
    }
  );
}

export async function syncSaveMemory(memory: MemoryPhoto): Promise<void> {
  let preparedSrc = memory.imageSrc;
  if (preparedSrc && preparedSrc.startsWith('data:')) {
    preparedSrc = await uploadMediaAsset(preparedSrc);
  }
  const payload: MemoryPhoto = { ...memory, imageSrc: preparedSrc };
  const docRef = doc(db, 'memories', memory.id);
  try {
    await setDoc(docRef, { ...payload, updatedAt: Date.now() }, { merge: true });
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

// ============================================================================
// 2. TEACHERS SYNC
// ============================================================================

export function subscribeTeachers(callback: (teachers: TeacherProfile[]) => void) {
  const colRef = collection(db, 'teachers');
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          INITIAL_TEACHERS.forEach((tch) => {
            batch.set(doc(db, 'teachers', tch.id), tch);
          });
          await batch.commit();
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, 'teachers');
        }
        callback(INITIAL_TEACHERS);
        idbSet('csl_teachers', INITIAL_TEACHERS);
        return;
      }

      const list: TeacherProfile[] = [];
      const byId = new Map<string, TeacherProfile>();
      snapshot.forEach((d) => {
        const data = d.data() as TeacherProfile;
        list.push(data);
        byId.set(data.id, data);
      });

      // One-time idempotent migration: seed missing verified teachers & upgrade stale placeholder entries
      if (!didMigrateTeachers) {
        didMigrateTeachers = true;
        const toWrite: TeacherProfile[] = [];
        for (const seed of INITIAL_TEACHERS) {
          const existing = byId.get(seed.id);
          if (!existing) {
            toWrite.push(seed);
          } else {
            const hasUserUploadedAvatar =
              existing.avatar?.startsWith('media://') || existing.avatar?.startsWith('data:');
            const isLegacySeed =
              !hasUserUploadedAvatar &&
              (isStalePlaceholderUrl(existing.avatar) ||
                LEGACY_FICTIONAL_NAMES.has(existing.name) ||
                !existing.avatar?.startsWith('/assets/teachers/'));
            if (isLegacySeed) {
              toWrite.push({
                ...seed,
                likes: Math.max(seed.likes, existing.likes || 0),
              });
            }
          }
        }
        if (toWrite.length > 0) {
          try {
            const batch = writeBatch(db);
            toWrite.forEach((t) => batch.set(doc(db, 'teachers', t.id), t, { merge: true }));
            await batch.commit();
          } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, 'teachers_migration');
          }
        }
      }

      const sorted = sortTeachersDeterministically(list, TEACHER_SEED_ORDER);
      callback(sorted);
      idbSet('csl_teachers', sorted);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'teachers');
    }
  );
}

export async function syncSaveTeacher(teacher: TeacherProfile): Promise<void> {
  let preparedAvatar = teacher.avatar;
  if (preparedAvatar && preparedAvatar.startsWith('data:')) {
    preparedAvatar = await uploadMediaAsset(preparedAvatar);
  }
  const payload: TeacherProfile = { ...teacher, avatar: preparedAvatar };
  const docRef = doc(db, 'teachers', teacher.id);
  try {
    await setDoc(docRef, { ...payload, updatedAt: Date.now() }, { merge: true });
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

// ============================================================================
// 3. LEADERSHIP TIMELINE SYNC
// ============================================================================

export function subscribeLeadership(callback: (items: LeadershipMilestone[]) => void) {
  const colRef = collection(db, 'leadership');
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          LEADERSHIP_TIMELINE_DATA.forEach((item) => {
            batch.set(doc(db, 'leadership', item.id), item);
          });
          await batch.commit();
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, 'leadership');
        }
        callback(LEADERSHIP_TIMELINE_DATA);
        idbSet('csl_leadership', LEADERSHIP_TIMELINE_DATA);
        return;
      }

      const list: LeadershipMilestone[] = [];
      const byId = new Map<string, LeadershipMilestone>();
      snapshot.forEach((d) => {
        const data = d.data() as LeadershipMilestone;
        list.push(data);
        byId.set(data.id, data);
      });

      if (!didMigrateLeadership) {
        didMigrateLeadership = true;
        const toWrite: LeadershipMilestone[] = [];
        for (const seed of LEADERSHIP_TIMELINE_DATA) {
          const existing = byId.get(seed.id);
          if (!existing) {
            toWrite.push(seed);
          } else {
            const hasUserUploadedAvatar =
              existing.avatar?.startsWith('media://') || existing.avatar?.startsWith('data:');
            if (!hasUserUploadedAvatar && isStalePlaceholderUrl(existing.avatar)) {
              toWrite.push({ ...existing, avatar: seed.avatar });
            }
          }
        }
        if (toWrite.length > 0) {
          try {
            const batch = writeBatch(db);
            toWrite.forEach((item) => batch.set(doc(db, 'leadership', item.id), item, { merge: true }));
            await batch.commit();
          } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, 'leadership_migration');
          }
        }
      }

      const sorted = sortLeadershipDeterministically(list);
      callback(sorted);
      idbSet('csl_leadership', sorted);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'leadership');
    }
  );
}

export async function syncSaveLeadership(item: LeadershipMilestone): Promise<void> {
  let preparedAvatar = item.avatar;
  if (preparedAvatar && preparedAvatar.startsWith('data:')) {
    preparedAvatar = await uploadMediaAsset(preparedAvatar);
  }
  const payload: LeadershipMilestone = { ...item, avatar: preparedAvatar };
  const docRef = doc(db, 'leadership', item.id);
  try {
    await setDoc(docRef, { ...payload, updatedAt: Date.now() }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `leadership/${item.id}`);
    throw err;
  }
}

export async function syncDeleteLeadership(leadId: string): Promise<void> {
  const docRef = doc(db, 'leadership', leadId);
  try {
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `leadership/${leadId}`);
    throw err;
  }
}

// ============================================================================
// 4. DEPARTMENTS SYNC
// ============================================================================

export function subscribeDepartments(callback: (depts: DepartmentFaculty[]) => void) {
  const colRef = collection(db, 'departments');
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          INITIAL_DEPARTMENTS.forEach((dep) => {
            batch.set(doc(db, 'departments', dep.id), dep);
          });
          await batch.commit();
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, 'departments');
        }
        callback(INITIAL_DEPARTMENTS);
        idbSet('csl_departments', INITIAL_DEPARTMENTS);
        return;
      }

      const list: DepartmentFaculty[] = [];
      const byId = new Map<string, DepartmentFaculty>();
      snapshot.forEach((d) => {
        const data = d.data() as DepartmentFaculty;
        list.push(data);
        byId.set(data.id, data);
      });

      if (!didMigrateDepartments) {
        didMigrateDepartments = true;
        const fixes: DepartmentFaculty[] = [];
        for (const seed of INITIAL_DEPARTMENTS) {
          const existing = byId.get(seed.id);
          if (!existing) {
            fixes.push(seed);
          } else if (
            existing.headTeacher &&
            (existing.headTeacher.startsWith('Tập thể Thầy Cô') ||
              existing.headTeacher.startsWith('Ban Giám Hiệu Trường') ||
              existing.headTeacher.startsWith('Các thầy cô tổ'))
          ) {
            fixes.push({ ...existing, headTeacher: seed.headTeacher });
          }
        }
        if (fixes.length > 0) {
          try {
            const batch = writeBatch(db);
            fixes.forEach((d) => batch.set(doc(db, 'departments', d.id), d, { merge: true }));
            await batch.commit();
          } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, 'departments_migration');
          }
        }
      }

      const sorted = sortDepartmentsDeterministically(list, DEPARTMENT_SEED_ORDER);
      callback(sorted);
      idbSet('csl_departments', sorted);
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

// ============================================================================
// 5. CONTEST MOMENTS SYNC
// ============================================================================

export function subscribeContestMoments(callback: (moments: ContestMoment[]) => void) {
  const colRef = collection(db, 'contest_moments');
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          INITIAL_CONTEST_MOMENTS.forEach((m) => {
            batch.set(doc(db, 'contest_moments', m.id), m);
          });
          await batch.commit();
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, 'contest_moments');
        }
        callback(INITIAL_CONTEST_MOMENTS);
        idbSet('csl_contest_moments', INITIAL_CONTEST_MOMENTS);
        return;
      }

      const list: ContestMoment[] = [];
      const fixes: ContestMoment[] = [];
      const fallbackMap = new Map<string, string>([
        ['moment-1', '/assets/aistudio/image_7c4a105b.png'],
        ['moment-2', '/assets/aistudio/Tr_m_k_t_n_i_s___2__3771c580.png'],
        ['moment-3', '/assets/aistudio/image_788055f8.png'],
        ['p2-1', '/assets/aistudio/image_7c4a105b.png'],
        ['p2-2', '/assets/aistudio/Tr_m_k_t_n_i_s___2__3771c580.png'],
        ['p2-3', '/assets/aistudio/image_788055f8.png'],
      ]);

      snapshot.forEach((d) => {
        const data = d.data() as ContestMoment;
        list.push(data);
        if (!didMigrateMoments && isStalePlaceholderUrl(data.imageSrc)) {
          fixes.push({
            ...data,
            imageSrc: fallbackMap.get(data.id) || '/assets/aistudio/image_3c5728ff.png',
          });
        }
      });

      if (!didMigrateMoments) {
        didMigrateMoments = true;
        if (fixes.length > 0) {
          try {
            const batch = writeBatch(db);
            fixes.forEach((m) => batch.set(doc(db, 'contest_moments', m.id), m, { merge: true }));
            await batch.commit();
          } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, 'contest_moments_migration');
          }
        }
      }

      const sorted = sortByNewestDeterministically(list);
      callback(sorted);
      idbSet('csl_contest_moments', sorted);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'contest_moments');
    }
  );
}

export async function syncSaveContestMoment(moment: ContestMoment): Promise<void> {
  let preparedSrc = moment.imageSrc;
  if (preparedSrc && preparedSrc.startsWith('data:')) {
    preparedSrc = await uploadMediaAsset(preparedSrc);
  }
  const payload: ContestMoment = { ...moment, imageSrc: preparedSrc };
  const docRef = doc(db, 'contest_moments', moment.id);
  try {
    await setDoc(docRef, { ...payload, updatedAt: Date.now() }, { merge: true });
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

// ============================================================================
// 6. TRIBUTES (LETTERS) SYNC
// ============================================================================

export function subscribeTributes(callback: (tributes: TributeMessage[]) => void) {
  const colRef = collection(db, 'tributes');
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          INITIAL_TRIBUTES.forEach((t) => {
            batch.set(doc(db, 'tributes', t.id), t);
          });
          await batch.commit();
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, 'tributes');
        }
        callback(INITIAL_TRIBUTES);
        idbSet('csl_tributes', INITIAL_TRIBUTES);
        return;
      }

      const list: TributeMessage[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as TributeMessage);
      });
      const sorted = sortByNewestDeterministically(list);
      callback(sorted);
      idbSet('csl_tributes', sorted);
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

// ============================================================================
// 7. PADLET NOTES SYNC
// ============================================================================

export function subscribePadletNotes(callback: (notes: PadletNote[]) => void) {
  const colRef = collection(db, 'padlet_notes');
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          INITIAL_PADLET_NOTES.forEach((n) => {
            batch.set(doc(db, 'padlet_notes', n.id), n);
          });
          await batch.commit();
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, 'padlet_notes');
        }
        callback(INITIAL_PADLET_NOTES);
        idbSet('csl_padlet_notes', INITIAL_PADLET_NOTES);
        return;
      }

      const list: PadletNote[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as PadletNote);
      });
      const sorted = sortByNewestDeterministically(list);
      callback(sorted);
      idbSet('csl_padlet_notes', sorted);
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

// ============================================================================
// 8. COMPETITION FLOWER STATS SYNC
// ============================================================================

export interface FlowerScoreStats {
  id: string;
  flower9: number;
  flower10: number;
  participationRate: number;
  lastUpdated?: string;
}

export const DEFAULT_FLOWER_STATS: FlowerScoreStats = {
  id: 'current_week',
  flower9: 1280,
  flower10: 895,
  participationRate: 100,
  lastUpdated: 'Cập nhật tuần cao điểm 20/11',
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
        idbSet('csl_flower_stats', DEFAULT_FLOWER_STATS);
        return;
      }
      const data = { ...DEFAULT_FLOWER_STATS, ...(snapshot.data() as FlowerScoreStats) };
      callback(data);
      idbSet('csl_flower_stats', data);
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, 'competition_stats/current_week');
    }
  );
}

export async function syncAddFlowerScore(type: 'flower9' | 'flower10', delta = 1): Promise<void> {
  const docRef = doc(db, 'competition_stats', 'current_week');
  try {
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(docRef);
      const current = snap.exists()
        ? { ...DEFAULT_FLOWER_STATS, ...(snap.data() as FlowerScoreStats) }
        : { ...DEFAULT_FLOWER_STATS };
      const updated = {
        ...current,
        [type]: Math.max(0, (current[type] || 0) + delta),
        updatedAt: Date.now(),
      };
      tx.set(docRef, updated, { merge: true });
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'competition_stats/current_week');
    throw err;
  }
}

export async function syncUpdateFlowerStats(stats: {
  flower9: number;
  flower10: number;
  participationRate: number;
  lastUpdated?: string;
}): Promise<void> {
  const docRef = doc(db, 'competition_stats', 'current_week');
  try {
    await setDoc(
      docRef,
      {
        id: 'current_week',
        flower9: stats.flower9,
        flower10: stats.flower10,
        participationRate: stats.participationRate,
        lastUpdated: stats.lastUpdated || DEFAULT_FLOWER_STATS.lastUpdated,
        updatedAt: Date.now(),
      },
      { merge: true }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'competition_stats/current_week');
    throw err;
  }
}

// ============================================================================
// 9. ATOMIC COUNTER HELPERS (Candles & Likes across concurrent users)
// ============================================================================

export async function syncIncrementDepartmentCandle(
  deptId: string,
  fallbackDept?: DepartmentFaculty
): Promise<void> {
  const docRef = doc(db, 'departments', deptId);
  try {
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(docRef);
      if (snap.exists()) {
        const data = snap.data() as DepartmentFaculty;
        tx.set(
          docRef,
          {
            ...data,
            candleCount: (data.candleCount || 0) + 1,
            updatedAt: Date.now(),
          },
          { merge: true }
        );
      } else if (fallbackDept) {
        tx.set(
          docRef,
          {
            ...fallbackDept,
            candleCount: (fallbackDept.candleCount || 0) + 1,
            updatedAt: Date.now(),
          },
          { merge: true }
        );
      }
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `departments/${deptId}`);
    throw err;
  }
}

export async function syncIncrementDocumentLikes<T extends { id: string; likes?: number }>(
  colName: 'memories' | 'teachers' | 'tributes' | 'padlet_notes',
  docId: string,
  fallbackDoc?: T
): Promise<void> {
  const docRef = doc(db, colName, docId);
  try {
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(docRef);
      if (snap.exists()) {
        const data = snap.data() as T;
        tx.set(
          docRef,
          {
            ...data,
            likes: (data.likes || 0) + 1,
          },
          { merge: true }
        );
      } else if (fallbackDoc) {
        tx.set(
          docRef,
          {
            ...fallbackDoc,
            likes: (fallbackDoc.likes || 0) + 1,
          },
          { merge: true }
        );
      }
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${colName}/${docId}`);
    throw err;
  }
}

// ============================================================================
// 10. CINEMATIC FILM REEL FRAMES SYNC (4 editable showcase photos)
// ============================================================================

export interface FilmFrame {
  id: string;
  label: string;
  alt: string;
  imageSrc: string;
  objectPosition?: string;
  order: number;
  updatedAt?: number;
}

export const INITIAL_FILM_FRAMES: FilmFrame[] = [
  {
    id: 'frame-1',
    label: 'Khung hình 01 · Chiềng Sinh 1995',
    alt: 'Mái trường Chuyên Sơn La',
    imageSrc: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
    objectPosition: '20% 40%',
    order: 1,
  },
  {
    id: 'frame-2',
    label: 'Khung hình 02 · Mùa Hoa Tri Ân',
    alt: 'Hoa ban đại ngàn',
    imageSrc: '/assets/aistudio/Tr_m_k_t_n_i_s___2__3771c580.png',
    objectPosition: '50% 50%',
    order: 2,
  },
  {
    id: 'frame-3',
    label: 'Khung hình 03 · Bụi Phấn Bục Giảng',
    alt: 'Giờ học say mê',
    imageSrc: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
    objectPosition: '80% 65%',
    order: 3,
  },
  {
    id: 'frame-4',
    label: 'Khung hình 04 · Khát Vọng Tương Lai',
    alt: 'Thế hệ học trò vươn xa',
    imageSrc: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
    objectPosition: '15% 15%',
    order: 4,
  },
];

export function subscribeFilmFrames(callback: (frames: FilmFrame[]) => void) {
  const colRef = collection(db, 'film_frames');
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          INITIAL_FILM_FRAMES.forEach((frame) => {
            batch.set(doc(db, 'film_frames', frame.id), frame);
          });
          await batch.commit();
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, 'film_frames');
        }
        callback(INITIAL_FILM_FRAMES);
        idbSet('csl_film_frames', INITIAL_FILM_FRAMES);
        return;
      }

      const byId = new Map<string, FilmFrame>();
      snapshot.forEach((d) => {
        const data = d.data() as FilmFrame;
        if (data?.id) byId.set(data.id, data);
      });

      // Ensure all 4 canonical slots exist so missing seed frames never disappear
      const merged = INITIAL_FILM_FRAMES.map((seed) => byId.get(seed.id) || seed);
      const sorted = sortFilmFramesDeterministically(merged);
      callback(sorted);
      idbSet('csl_film_frames', sorted);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'film_frames');
    }
  );
}

export async function syncSaveFilmFrame(frame: FilmFrame): Promise<void> {
  let preparedSrc = frame.imageSrc;
  if (preparedSrc && preparedSrc.startsWith('data:')) {
    preparedSrc = await uploadMediaAsset(preparedSrc);
  }
  const payload: FilmFrame = {
    ...frame,
    imageSrc: preparedSrc,
    updatedAt: Date.now(),
  };
  const docRef = doc(db, 'film_frames', frame.id);
  try {
    await setDoc(docRef, payload, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `film_frames/${frame.id}`);
    throw err;
  }
}

// ============================================================================
// 11. SCHOOL FACEBOOK FANPAGE AUTO-SYNC TO "LẬT GIỞ KÝ ỨC"
// ============================================================================

export interface FacebookSyncState {
  id: string;
  pageUrl: string;
  pageName: string;
  followerCount: string;
  autoSyncEnabled: boolean;
  lastSyncAt: number;
  syncedCount: number;
  dismissedIds: string[];
}

export const DEFAULT_FACEBOOK_SYNC_STATE: FacebookSyncState = {
  id: 'school_fanpage',
  pageUrl: DEFAULT_SCHOOL_FACEBOOK_URL,
  pageName: 'Trường THPT Chuyên Sơn La',
  followerCount: '',
  autoSyncEnabled: true,
  lastSyncAt: 0,
  syncedCount: 0,
  dismissedIds: [],
};

export function subscribeFacebookSyncState(callback: (state: FacebookSyncState) => void) {
  const docRef = doc(db, 'facebook_sync', 'school_fanpage');
  return onSnapshot(
    docRef,
    async (snapshot) => {
      if (!snapshot.exists()) {
        try {
          await setDoc(docRef, DEFAULT_FACEBOOK_SYNC_STATE);
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, 'facebook_sync/school_fanpage');
        }
        callback(DEFAULT_FACEBOOK_SYNC_STATE);
        idbSet('csl_facebook_sync', DEFAULT_FACEBOOK_SYNC_STATE);
        return;
      }
      const data = {
        ...DEFAULT_FACEBOOK_SYNC_STATE,
        ...(snapshot.data() as FacebookSyncState),
      };
      callback(data);
      idbSet('csl_facebook_sync', data);
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, 'facebook_sync/school_fanpage');
    }
  );
}

export async function syncSaveFacebookSyncState(
  patch: Partial<FacebookSyncState>
): Promise<FacebookSyncState> {
  const docRef = doc(db, 'facebook_sync', 'school_fanpage');
  try {
    let finalState: FacebookSyncState = { ...DEFAULT_FACEBOOK_SYNC_STATE, ...patch, id: 'school_fanpage' };
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(docRef);
      const current = snap.exists()
        ? { ...DEFAULT_FACEBOOK_SYNC_STATE, ...(snap.data() as FacebookSyncState) }
        : { ...DEFAULT_FACEBOOK_SYNC_STATE };
      finalState = {
        ...current,
        ...patch,
        id: 'school_fanpage',
        dismissedIds: (patch.dismissedIds ?? current.dismissedIds ?? []).slice(-200),
      };
      tx.set(docRef, finalState, { merge: true });
    });
    idbSet('csl_facebook_sync', finalState);
    return finalState;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'facebook_sync/school_fanpage');
    throw err;
  }
}

export async function syncRecordDismissedFacebookId(memoryId: string): Promise<void> {
  if (!memoryId.startsWith('fb-')) return;
  const docRef = doc(db, 'facebook_sync', 'school_fanpage');
  try {
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(docRef);
      const current = snap.exists()
        ? { ...DEFAULT_FACEBOOK_SYNC_STATE, ...(snap.data() as FacebookSyncState) }
        : { ...DEFAULT_FACEBOOK_SYNC_STATE };
      const existing = Array.isArray(current.dismissedIds) ? current.dismissedIds : [];
      if (existing.includes(memoryId)) return;
      const next = [...existing, memoryId].slice(-200);
      tx.set(docRef, { ...current, dismissedIds: next }, { merge: true });
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'facebook_sync/school_fanpage');
  }
}

let activeFacebookSyncPromise: Promise<FacebookSyncResult> | null = null;

export interface FacebookSyncResult {
  addedCount: number;
  totalFetched: number;
  pageName: string;
  followerCount: string;
  pageUrl: string;
  syncedAt: number;
  addedMemories: MemoryPhoto[];
}

async function persistFacebookImageToCloud(imageUrl: string): Promise<string> {
  try {
    const res = await fetch(
      `/api/facebook/image?format=dataurl&url=${encodeURIComponent(imageUrl)}`
    );
    if (!res.ok) return imageUrl;
    const json = (await res.json()) as { ok?: boolean; dataUrl?: string };
    if (!json.ok || !json.dataUrl || !json.dataUrl.startsWith('data:image/')) {
      return imageUrl;
    }
    const compressed = await compressDataUrl(json.dataUrl, 1400, 1400, 0.85);
    return await uploadMediaAsset(compressed);
  } catch {
    return imageUrl;
  }
}

export async function syncFacebookPostsToCloud(params: {
  pageUrl?: string;
  existingMemories: ReadonlyArray<MemoryPhoto>;
  dismissedIds: ReadonlyArray<string>;
  includeDismissed?: boolean;
  forceRefresh?: boolean;
}): Promise<FacebookSyncResult> {
  if (activeFacebookSyncPromise) {
    return activeFacebookSyncPromise;
  }

  activeFacebookSyncPromise = (async () => {
    const targetUrl = params.pageUrl || DEFAULT_SCHOOL_FACEBOOK_URL;
    const apiUrl = new URL('/api/facebook/posts', window.location.origin);
    apiUrl.searchParams.set('pageUrl', targetUrl);
    if (params.forceRefresh) {
      apiUrl.searchParams.set('force', '1');
    }

    const res = await fetch(apiUrl.toString());
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(
        (errBody as { error?: string }).error || `Lỗi máy chủ (${res.status}) khi đọc Facebook.`
      );
    }

    const data = (await res.json()) as {
      ok?: boolean;
      pageName?: string;
      followerCount?: string;
      pageUrl?: string;
      posts?: ParsedFacebookPost[];
      error?: string;
    };

    if (!data.ok || !Array.isArray(data.posts)) {
      throw new Error(data.error || 'Không lấy được danh sách bài viết từ Facebook.');
    }

    const candidates = selectNewFacebookPostsToSync(
      data.posts,
      params.existingMemories,
      params.dismissedIds,
      { includeDismissed: params.includeDismissed, maxItems: 6 }
    );

    const addedMemories: MemoryPhoto[] = [];
    for (const post of candidates) {
      const storedImageSrc = await persistFacebookImageToCloud(post.imageUrl);
      const mem: MemoryPhoto = {
        id: post.id,
        externalId: post.externalId,
        title: post.title,
        year: post.year,
        category: post.category,
        caption: post.caption,
        author: post.author,
        imageSrc: storedImageSrc,
        tags: post.tags,
        likes: post.likes,
        source: 'facebook',
        sourceUrl: post.sourceUrl,
        createdAt: post.createdAt,
      };
      await syncSaveMemory(mem);
      addedMemories.push(mem);
    }

    const syncedAt = Date.now();
    const resolvedPageUrl = data.pageUrl || targetUrl;
    const resolvedPageName = data.pageName || 'Trường THPT Chuyên Sơn La';
    const resolvedFollowers = data.followerCount || '';

    const nextDismissed = params.includeDismissed
      ? params.dismissedIds.filter((id) => !addedMemories.some((m) => m.id === id))
      : params.dismissedIds;

    await syncSaveFacebookSyncState({
      pageUrl: resolvedPageUrl,
      pageName: resolvedPageName,
      followerCount: resolvedFollowers,
      lastSyncAt: syncedAt,
      syncedCount: addedMemories.length,
      dismissedIds: [...nextDismissed],
    });

    return {
      addedCount: addedMemories.length,
      totalFetched: data.posts.length,
      pageName: resolvedPageName,
      followerCount: resolvedFollowers,
      pageUrl: resolvedPageUrl,
      syncedAt,
      addedMemories,
    };
  })().finally(() => {
    activeFacebookSyncPromise = null;
  });

  return activeFacebookSyncPromise;
}

