import {
  MemoryPhoto,
  TeacherProfile,
  DepartmentFaculty,
  LeadershipMilestone,
} from '../data/memoriesData';

export function buildOrderMap(items: ReadonlyArray<{ id: string }>): Map<string, number> {
  return new Map(items.map((item, idx) => [item.id, idx]));
}

export function sortMemoriesDeterministically(
  list: MemoryPhoto[],
  seedOrder: Map<string, number>
): MemoryPhoto[] {
  return [...list].sort((a, b) => {
    const idxA = seedOrder.get(a.id);
    const idxB = seedOrder.get(b.id);
    const aIsSeed = idxA !== undefined;
    const bIsSeed = idxB !== undefined;

    if (!aIsSeed && !bIsSeed) {
      const createdDiff = (b.createdAt || 0) - (a.createdAt || 0);
      if (createdDiff !== 0) return createdDiff;
      const likesDiff = (b.likes || 0) - (a.likes || 0);
      if (likesDiff !== 0) return likesDiff;
      return (b.id || '').localeCompare(a.id || '');
    }
    if (!aIsSeed) return -1;
    if (!bIsSeed) return 1;
    if (idxA !== idxB) return idxA - idxB;
    return (a.id || '').localeCompare(b.id || '');
  });
}

export function sortTeachersDeterministically(
  list: TeacherProfile[],
  seedOrder: Map<string, number>
): TeacherProfile[] {
  return [...list].sort((a, b) => {
    const idxA = seedOrder.get(a.id);
    const idxB = seedOrder.get(b.id);
    const aIsSeed = idxA !== undefined;
    const bIsSeed = idxB !== undefined;

    if (!aIsSeed && !bIsSeed) {
      const createdDiff = (b.createdAt || 0) - (a.createdAt || 0);
      if (createdDiff !== 0) return createdDiff;
      const likesDiff = (b.likes || 0) - (a.likes || 0);
      if (likesDiff !== 0) return likesDiff;
      return (b.id || '').localeCompare(a.id || '');
    }
    if (!aIsSeed) return -1;
    if (!bIsSeed) return 1;
    if (idxA !== idxB) return idxA - idxB;
    return (a.id || '').localeCompare(b.id || '');
  });
}

export function sortLeadershipDeterministically(
  list: LeadershipMilestone[]
): LeadershipMilestone[] {
  return [...list].sort((a, b) => {
    const orderDiff = (a.order ?? 99) - (b.order ?? 99);
    if (orderDiff !== 0) return orderDiff;
    return (a.id || '').localeCompare(b.id || '');
  });
}

export function sortFilmFramesDeterministically<T extends { id: string; order?: number }>(
  list: T[]
): T[] {
  return [...list].sort((a, b) => {
    const orderDiff = (a.order ?? 99) - (b.order ?? 99);
    if (orderDiff !== 0) return orderDiff;
    return (a.id || '').localeCompare(b.id || '');
  });
}

export function sortDepartmentsDeterministically(
  list: DepartmentFaculty[],
  seedOrder: Map<string, number>
): DepartmentFaculty[] {
  return [...list].sort((a, b) => {
    const orderA = seedOrder.get(a.id) ?? 99;
    const orderB = seedOrder.get(b.id) ?? 99;
    if (orderA !== orderB) return orderA - orderB;
    return (a.id || '').localeCompare(b.id || '');
  });
}

export function sortByNewestDeterministically<T extends { id: string; createdAt?: number }>(
  list: T[]
): T[] {
  return [...list].sort((a, b) => {
    const createdDiff = (b.createdAt || 0) - (a.createdAt || 0);
    if (createdDiff !== 0) return createdDiff;
    return (b.id || '').localeCompare(a.id || '');
  });
}

export function splitDataUrlIntoChunks(dataUrl: string, chunkLimit: number): string[] {
  if (!dataUrl || chunkLimit <= 0) return [];
  const chunks: string[] = [];
  for (let i = 0; i < dataUrl.length; i += chunkLimit) {
    chunks.push(dataUrl.slice(i, i + chunkLimit));
  }
  return chunks;
}

export function assembleMediaChunks(
  chunks: ReadonlyArray<{ index: number; data?: string }>
): string | null {
  if (!chunks || chunks.length === 0) return null;
  const sorted = [...chunks].sort((a, b) => a.index - b.index);
  let combined = '';
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].index !== i || !sorted[i].data) {
      return null;
    }
    combined += sorted[i].data;
  }
  return combined || null;
}

export function mergeLikeCount(
  optimisticLikes: number | undefined,
  cloudLikes: number | undefined
): number {
  const cloud = typeof cloudLikes === 'number' && Number.isFinite(cloudLikes) ? cloudLikes : 0;
  const optimistic =
    typeof optimisticLikes === 'number' && Number.isFinite(optimisticLikes) ? optimisticLikes : 0;
  return Math.max(optimistic, cloud);
}
