import test from 'node:test';
import assert from 'node:assert/strict';
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
  mergeLikeCount,
} from './syncHelpers';
import type {
  MemoryPhoto,
  TeacherProfile,
  DepartmentFaculty,
  LeadershipMilestone,
} from '../data/memoriesData';

test('sortMemoriesDeterministically places new user memories newest-first and keeps seed items in canonical order', () => {
  const seeds: MemoryPhoto[] = [
    {
      id: 'mem-1',
      title: 'Seed 1',
      year: '2024',
      category: 'classroom',
      caption: 'c1',
      author: 'a1',
      imageSrc: '/1.png',
      tags: [],
      likes: 10,
    },
    {
      id: 'mem-2',
      title: 'Seed 2',
      year: '2024',
      category: 'classroom',
      caption: 'c2',
      author: 'a2',
      imageSrc: '/2.png',
      tags: [],
      likes: 500,
    },
  ];
  const orderMap = buildOrderMap(seeds);

  const shuffled: MemoryPhoto[] = [
    seeds[1],
    {
      ...seeds[0],
      likes: 999, // Changing likes must NOT reorder seed cards across clients
    },
    {
      id: 'mem-user-old',
      title: 'User Old',
      year: '2026',
      category: 'classroom',
      caption: 'u1',
      author: 'u1',
      imageSrc: '/u1.png',
      tags: [],
      likes: 1,
      createdAt: 1000,
    },
    {
      id: 'mem-user-new',
      title: 'User New',
      year: '2026',
      category: 'classroom',
      caption: 'u2',
      author: 'u2',
      imageSrc: '/u2.png',
      tags: [],
      likes: 0,
      createdAt: 2000,
    },
  ];

  const sorted = sortMemoriesDeterministically(shuffled, orderMap);
  assert.deepEqual(
    sorted.map((m) => m.id),
    ['mem-user-new', 'mem-user-old', 'mem-1', 'mem-2']
  );
});

test('sortTeachersDeterministically keeps user-added newest first and preserves seed order', () => {
  const seeds: TeacherProfile[] = [
    {
      id: 't-1',
      name: 'Cô A',
      role: 'GV',
      department: 'Toán',
      departmentName: 'Tổ Toán',
      avatar: '/a.png',
      quote: 'q',
      achievements: [],
      bio: 'b',
      yearsOfService: '2010',
      likes: 10,
    },
    {
      id: 't-2',
      name: 'Thầy B',
      role: 'GV',
      department: 'Văn',
      departmentName: 'Tổ Văn',
      avatar: '/b.png',
      quote: 'q',
      achievements: [],
      bio: 'b',
      yearsOfService: '2012',
      likes: 20,
    },
  ];
  const orderMap = buildOrderMap(seeds);

  const sorted = sortTeachersDeterministically(
    [
      seeds[1],
      seeds[0],
      { ...seeds[0], id: 't-user-1', createdAt: 500 },
      { ...seeds[0], id: 't-user-2', createdAt: 900 },
    ],
    orderMap
  );
  assert.deepEqual(
    sorted.map((t) => t.id),
    ['t-user-2', 't-user-1', 't-1', 't-2']
  );
});

test('sortLeadershipDeterministically sorts by order ascending then id', () => {
  const items: LeadershipMilestone[] = [
    {
      id: 'lead-3',
      name: 'C',
      title: 'Hiệu trưởng',
      roleType: 'principal',
      period: '2020',
      milestoneTitle: 'm3',
      contributions: 'c',
      quote: 'q',
      avatar: '/c.png',
      order: 3,
    },
    {
      id: 'lead-1',
      name: 'A',
      title: 'Hiệu trưởng',
      roleType: 'principal',
      period: '1995',
      milestoneTitle: 'm1',
      contributions: 'a',
      quote: 'q',
      avatar: '/a.png',
      order: 1,
    },
    {
      id: 'lead-2',
      name: 'B',
      title: 'Hiệu trưởng',
      roleType: 'principal',
      period: '2005',
      milestoneTitle: 'm2',
      contributions: 'b',
      quote: 'q',
      avatar: '/b.png',
      order: 2,
    },
  ];
  assert.deepEqual(
    sortLeadershipDeterministically(items).map((l) => l.id),
    ['lead-1', 'lead-2', 'lead-3']
  );
});

test('sortFilmFramesDeterministically preserves 4-frame slot order across edits', () => {
  const frames = [
    { id: 'frame-4', order: 4, label: '04' },
    { id: 'frame-2', order: 2, label: '02' },
    { id: 'frame-1', order: 1, label: '01' },
    { id: 'frame-3', order: 3, label: '03' },
  ];
  assert.deepEqual(
    sortFilmFramesDeterministically(frames).map((f) => f.id),
    ['frame-1', 'frame-2', 'frame-3', 'frame-4']
  );
});

test('sortDepartmentsDeterministically preserves canonical seed order regardless of candleCount', () => {
  const seeds: DepartmentFaculty[] = [
    {
      id: 'd-toan',
      name: 'Toán',
      code: 'TOAN',
      tagline: '',
      teacherCount: 10,
      featuredQuote: '',
      headTeacher: 'Cô A',
      candleCount: 10,
    },
    {
      id: 'd-van',
      name: 'Văn',
      code: 'VAN',
      tagline: '',
      teacherCount: 8,
      featuredQuote: '',
      headTeacher: 'Cô B',
      candleCount: 5,
    },
  ];
  const orderMap = buildOrderMap(seeds);
  const sorted = sortDepartmentsDeterministically(
    [{ ...seeds[1], candleCount: 999 }, seeds[0]],
    orderMap
  );
  assert.deepEqual(
    sorted.map((d) => d.id),
    ['d-toan', 'd-van']
  );
});

test('sortByNewestDeterministically breaks ties by id descending', () => {
  const items = [
    { id: 'note-a', createdAt: 1000 },
    { id: 'note-c', createdAt: 2000 },
    { id: 'note-b', createdAt: 1000 },
  ];
  assert.deepEqual(
    sortByNewestDeterministically(items).map((i) => i.id),
    ['note-c', 'note-b', 'note-a']
  );
});

test('splitDataUrlIntoChunks and assembleMediaChunks round-trip cleanly and reject incomplete chunks', () => {
  const sample = 'data:image/png;base64,' + 'A'.repeat(250);
  const chunks = splitDataUrlIntoChunks(sample, 60);
  assert.equal(chunks.length, 5);

  const assembled = assembleMediaChunks(
    chunks.map((data, index) => ({ index, data })).reverse()
  );
  assert.equal(assembled, sample);

  // Missing chunk index 2 must return null instead of corrupted image string
  const incomplete = assembleMediaChunks([
    { index: 0, data: chunks[0] },
    { index: 1, data: chunks[1] },
    { index: 3, data: chunks[3] },
  ]);
  assert.equal(incomplete, null);
});

test('mergeLikeCount takes the higher of optimistic and cloud counts so remote updates show up', () => {
  assert.equal(mergeLikeCount(undefined, 12), 12);
  assert.equal(mergeLikeCount(13, 12), 13);
  assert.equal(mergeLikeCount(13, 25), 25);
  assert.equal(mergeLikeCount(undefined, undefined), 0);
});
