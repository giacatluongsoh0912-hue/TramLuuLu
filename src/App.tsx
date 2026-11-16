import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MemoryScrapbook } from './components/MemoryScrapbook';
import { TeacherGallery } from './components/TeacherGallery';
import { TeacherTributes } from './components/TeacherTributes';
import { PadletWall } from './components/PadletWall';
import { GuestbookSection } from './components/GuestbookSection';
import { GratitudeCardModal } from './components/GratitudeCardModal';
import { PhotoDetailModal } from './components/PhotoDetailModal';
import { QuizNostalgia } from './components/QuizNostalgia';
import { ContestFramework } from './components/ContestFramework';
import { QRCodeModal } from './components/QRCodeModal';
import { ContestRulesModal } from './components/ContestRulesModal';
import { Footer } from './components/Footer';
import { PetalCanvas } from './components/PetalCanvas';
import { MiniMusicPlayer } from './components/MiniMusicPlayer';
import { CinematicPrologue } from './components/CinematicPrologue';
import { CinematicLetterDesk } from './components/CinematicLetterDesk';
import { idbGet } from './utils/imageStorage';
import {
  INITIAL_MEMORIES,
  INITIAL_TRIBUTES,
  INITIAL_DEPARTMENTS,
  INITIAL_TEACHERS,
  INITIAL_PADLET_NOTES,
  LEADERSHIP_TIMELINE_DATA,
  MemoryPhoto,
  TeacherProfile,
  DepartmentFaculty,
  LeadershipMilestone,
} from './data/memoriesData';
import { TributeMessage, PadletNote } from './utils/tributeRules';
import {
  subscribeMemories,
  syncSaveMemory,
  syncDeleteMemory,
  subscribeTeachers,
  syncSaveTeacher,
  syncDeleteTeacher,
  subscribeLeadership,
  syncSaveLeadership,
  subscribeDepartments,
  syncSaveDepartment,
  subscribePadletNotes,
  syncSavePadletNote,
  syncDeletePadletNote,
  subscribeTributes,
  syncSaveTribute,
  syncDeleteTribute,
  syncIncrementDepartmentCandle,
  syncIncrementDocumentLikes,
} from './utils/syncService';

export default function App() {
  const [memories, setMemories] = useState<MemoryPhoto[]>(INITIAL_MEMORIES);
  const [tributes, setTributes] = useState<TributeMessage[]>(INITIAL_TRIBUTES);
  const [teachers, setTeachers] = useState<TeacherProfile[]>(INITIAL_TEACHERS);
  const [leadership, setLeadership] = useState<LeadershipMilestone[]>(LEADERSHIP_TIMELINE_DATA);
  const [padletNotes, setPadletNotes] = useState<PadletNote[]>(INITIAL_PADLET_NOTES);
  const [departments, setDepartments] = useState<DepartmentFaculty[]>(INITIAL_DEPARTMENTS);

  const [petalsEnabled, setPetalsEnabled] = useState(true);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isCardMakerOpen, setIsCardMakerOpen] = useState(false);
  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false);
  const [isContestRulesOpen, setIsContestRulesOpen] = useState(false);
  const [isPrologueOpen, setIsPrologueOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<MemoryPhoto | null>(null);
  const [preselectedRecipient, setPreselectedRecipient] = useState<string>('');

  const cloudSyncedRef = useRef({
    memories: false,
    teachers: false,
    leadership: false,
    departments: false,
    padletNotes: false,
    tributes: false,
  });

  // Auto-open cinematic prologue on first launch for emotional impression
  useEffect(() => {
    try {
      const seen = sessionStorage.getItem('csl_prologue_session_seen');
      if (!seen) {
        setIsPrologueOpen(true);
        sessionStorage.setItem('csl_prologue_session_seen', 'true');
      }
    } catch {
      // ignore
    }
  }, []);

  // Hydrate cached data from IndexedDB ONLY if cloud snapshot has not arrived yet
  useEffect(() => {
    let active = true;
    Promise.all([
      idbGet<MemoryPhoto[]>('csl_memories'),
      idbGet<TeacherProfile[]>('csl_teachers'),
      idbGet<LeadershipMilestone[]>('csl_leadership'),
      idbGet<DepartmentFaculty[]>('csl_departments'),
      idbGet<PadletNote[]>('csl_padlet_notes'),
      idbGet<TributeMessage[]>('csl_tributes'),
    ])
      .then(([mems, tchs, leads, depts, notes, tribs]) => {
        if (!active) return;
        if (!cloudSyncedRef.current.memories && mems && mems.length > 0) setMemories(mems);
        if (!cloudSyncedRef.current.teachers && tchs && tchs.length > 0) setTeachers(tchs);
        if (!cloudSyncedRef.current.leadership && leads && leads.length > 0) setLeadership(leads);
        if (!cloudSyncedRef.current.departments && depts && depts.length > 0) setDepartments(depts);
        if (!cloudSyncedRef.current.padletNotes && notes && notes.length > 0) setPadletNotes(notes);
        if (!cloudSyncedRef.current.tributes && tribs && tribs.length > 0) setTributes(tribs);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  // Real-time synchronization across all devices and browsers via Cloud Firestore
  useEffect(() => {
    const unsubMemories = subscribeMemories((data) => {
      cloudSyncedRef.current.memories = true;
      if (data && data.length > 0) setMemories(data);
    });
    const unsubTeachers = subscribeTeachers((data) => {
      cloudSyncedRef.current.teachers = true;
      if (data && data.length > 0) setTeachers(data);
    });
    const unsubLeadership = subscribeLeadership((data) => {
      cloudSyncedRef.current.leadership = true;
      if (data && data.length > 0) setLeadership(data);
    });
    const unsubDepts = subscribeDepartments((data) => {
      cloudSyncedRef.current.departments = true;
      if (data && data.length > 0) setDepartments(data);
    });
    const unsubNotes = subscribePadletNotes((data) => {
      cloudSyncedRef.current.padletNotes = true;
      if (data && data.length > 0) setPadletNotes(data);
    });
    const unsubTributes = subscribeTributes((data) => {
      cloudSyncedRef.current.tributes = true;
      if (data && data.length > 0) setTributes(data);
    });

    return () => {
      unsubMemories();
      unsubTeachers();
      unsubLeadership();
      unsubDepts();
      unsubNotes();
      unsubTributes();
    };
  }, []);

  const handleAddMemory = async (newMem: MemoryPhoto) => {
    setMemories((prev) => [newMem, ...prev]);
    try {
      await syncSaveMemory(newMem);
    } catch (err) {
      setMemories((prev) => prev.filter((m) => m.id !== newMem.id));
      throw err;
    }
  };

  const handleUpdateMemory = async (updatedMem: MemoryPhoto) => {
    let previous: MemoryPhoto[] | null = null;
    setMemories((prev) => {
      previous = prev;
      return prev.map((m) => (m.id === updatedMem.id ? updatedMem : m));
    });
    try {
      await syncSaveMemory(updatedMem);
    } catch (err) {
      if (previous) setMemories(previous);
      throw err;
    }
  };

  const handleLikeMemory = async (mem: MemoryPhoto) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === mem.id ? { ...m, likes: (m.likes || 0) + 1 } : m))
    );
    await syncIncrementDocumentLikes('memories', mem.id, mem).catch(console.error);
  };

  const handleDeleteMemory = async (id: string) => {
    let previous: MemoryPhoto[] | null = null;
    setMemories((prev) => {
      previous = prev;
      return prev.filter((m) => m.id !== id);
    });
    try {
      await syncDeleteMemory(id);
    } catch (err) {
      if (previous) setMemories(previous);
      throw err;
    }
  };

  const handleAddTeacher = async (newTch: TeacherProfile) => {
    setTeachers((prev) => [newTch, ...prev]);
    try {
      await syncSaveTeacher(newTch);
    } catch (err) {
      setTeachers((prev) => prev.filter((t) => t.id !== newTch.id));
      throw err;
    }
  };

  const handleUpdateTeacher = async (updatedTch: TeacherProfile) => {
    let previous: TeacherProfile[] | null = null;
    setTeachers((prev) => {
      previous = prev;
      return prev.map((t) => (t.id === updatedTch.id ? updatedTch : t));
    });
    try {
      await syncSaveTeacher(updatedTch);
    } catch (err) {
      if (previous) setTeachers(previous);
      throw err;
    }
  };

  const handleLikeTeacher = async (teacher: TeacherProfile) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === teacher.id ? { ...t, likes: (t.likes || 0) + 1 } : t))
    );
    await syncIncrementDocumentLikes('teachers', teacher.id, teacher).catch(console.error);
  };

  const handleDeleteTeacher = async (id: string) => {
    let previous: TeacherProfile[] | null = null;
    setTeachers((prev) => {
      previous = prev;
      return prev.filter((t) => t.id !== id);
    });
    try {
      await syncDeleteTeacher(id);
    } catch (err) {
      if (previous) setTeachers(previous);
      throw err;
    }
  };

  const handleUpdateLeadership = async (updatedLead: LeadershipMilestone) => {
    let previous: LeadershipMilestone[] | null = null;
    setLeadership((prev) => {
      previous = prev;
      return prev.map((l) => (l.id === updatedLead.id ? updatedLead : l));
    });
    try {
      await syncSaveLeadership(updatedLead);
    } catch (err) {
      if (previous) setLeadership(previous);
      throw err;
    }
  };

  const handleUpdateDepartment = async (updatedDept: DepartmentFaculty) => {
    let previous: DepartmentFaculty[] | null = null;
    setDepartments((prev) => {
      previous = prev;
      return prev.map((d) => (d.id === updatedDept.id ? updatedDept : d));
    });
    try {
      await syncSaveDepartment(updatedDept);
    } catch (err) {
      if (previous) setDepartments(previous);
      throw err;
    }
  };

  const handleLightCandle = async (dept: DepartmentFaculty) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === dept.id ? { ...d, candleCount: (d.candleCount || 0) + 1 } : d))
    );
    await syncIncrementDepartmentCandle(dept.id, dept).catch(console.error);
  };

  const handleAddPadletNote = async (newNote: PadletNote) => {
    setPadletNotes((prev) => [newNote, ...prev]);
    try {
      await syncSavePadletNote(newNote);
    } catch (err) {
      setPadletNotes((prev) => prev.filter((n) => n.id !== newNote.id));
      throw err;
    }
  };

  const handleUpdatePadletNote = async (updatedNote: PadletNote) => {
    let previous: PadletNote[] | null = null;
    setPadletNotes((prev) => {
      previous = prev;
      return prev.map((n) => (n.id === updatedNote.id ? updatedNote : n));
    });
    try {
      await syncSavePadletNote(updatedNote);
    } catch (err) {
      if (previous) setPadletNotes(previous);
      throw err;
    }
  };

  const handleLikePadletNote = async (note: PadletNote) => {
    setPadletNotes((prev) =>
      prev.map((n) => (n.id === note.id ? { ...n, likes: (n.likes || 0) + 1 } : n))
    );
    await syncIncrementDocumentLikes('padlet_notes', note.id, note).catch(console.error);
  };

  const handleDeletePadletNote = async (id: string) => {
    let previous: PadletNote[] | null = null;
    setPadletNotes((prev) => {
      previous = prev;
      return prev.filter((n) => n.id !== id);
    });
    try {
      await syncDeletePadletNote(id);
    } catch (err) {
      if (previous) setPadletNotes(previous);
      throw err;
    }
  };

  const handleAddTribute = async (newTrib: TributeMessage) => {
    setTributes((prev) => [newTrib, ...prev]);
    try {
      await syncSaveTribute(newTrib);
    } catch (err) {
      setTributes((prev) => prev.filter((t) => t.id !== newTrib.id));
      throw err;
    }
  };

  const handleUpdateTribute = async (updatedTrib: TributeMessage) => {
    let previous: TributeMessage[] | null = null;
    setTributes((prev) => {
      previous = prev;
      return prev.map((t) => (t.id === updatedTrib.id ? updatedTrib : t));
    });
    try {
      await syncSaveTribute(updatedTrib);
    } catch (err) {
      if (previous) setTributes(previous);
      throw err;
    }
  };

  const handleLikeTribute = async (tribute: TributeMessage) => {
    setTributes((prev) =>
      prev.map((t) => (t.id === tribute.id ? { ...t, likes: (t.likes || 0) + 1 } : t))
    );
    await syncIncrementDocumentLikes('tributes', tribute.id, tribute).catch(console.error);
  };

  const handleDeleteTribute = async (id: string) => {
    let previous: TributeMessage[] | null = null;
    setTributes((prev) => {
      previous = prev;
      return prev.filter((t) => t.id !== id);
    });
    try {
      await syncDeleteTribute(id);
    } catch (err) {
      if (previous) setTributes(previous);
      throw err;
    }
  };

  const handleOpenComposerWithRecipient = (deptName: string) => {
    setPreselectedRecipient(`Thầy Cô ${deptName}`);
    setIsComposerOpen(true);
  };

  const handleSendDirectTribute = (teacherName: string, _department: string) => {
    setPreselectedRecipient(teacherName);
    setIsComposerOpen(true);
  };

  const handleInspectHeroPhoto = () => {
    setSelectedPhoto({
      id: 'hero-main-photo',
      title: 'Trường THPT Chuyên Tỉnh Sơn La - Nơi Ký Ức Chưa Bao Giờ Vơi Đi',
      year: 'Chiềng Sinh, TP. Sơn La',
      category: 'classroom',
      caption: 'Kiến trúc mái vòm tam giác kiêu hãnh của Chuyên Sơn La dưới nắng vàng Tây Bắc. Nơi lưu giữ thanh xuân và bao kỷ niệm của các thế hệ học trò.',
      author: 'Ban Truyền Thông CSL',
      imageSrc: '/assets/aistudio/image_3c5728ff.png',
      tags: ['Chuyên Sơn La', 'Mái trường', 'Tri ân'],
      likes: 520,
    });
  };

  const handleScrollToScrapbook = () => {
    const el = document.getElementById('scrapbook');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen cinematic-nature-bg text-[#f7f3e8] font-body relative selection:bg-[#e4c77d] selection:text-[#18261d]">
      {/* Drifting Hoa Ban Petals and Sparkles */}
      <PetalCanvas enabled={petalsEnabled} />

      {/* Top Bar Navigation */}
      <Navbar
        onOpenComposer={() => {
          setPreselectedRecipient('');
          setIsComposerOpen(true);
        }}
        onOpenCardMaker={() => setIsCardMakerOpen(true)}
        onOpenPrologue={() => setIsPrologueOpen(true)}
        petalsEnabled={petalsEnabled}
        onTogglePetals={() => setPetalsEnabled(!petalsEnabled)}
      />

      <main>
        {/* Hero Section displaying full-fidelity master artwork */}
        <HeroSection
          onOpenComposer={() => {
            setPreselectedRecipient('');
            setIsComposerOpen(true);
          }}
          onExploreMemories={handleScrollToScrapbook}
          onInspectHeroPhoto={handleInspectHeroPhoto}
          onOpenQRCode={() => setIsQRCodeOpen(true)}
          onOpenContestInfo={() => setIsContestRulesOpen(true)}
        />

        {/* Khung 4 Nội Dung Bắt Buộc Theo Kế Hoạch Cuộc Thi 20/11 */}
        <ContestFramework
          onOpenComposer={() => {
            setPreselectedRecipient('');
            setIsComposerOpen(true);
          }}
          onOpenQRCode={() => setIsQRCodeOpen(true)}
        />

        {/* Section 1: Memory Scrapbook & Timeline ("Lật Giở Ký Ức") - With Photo Editing */}
        <MemoryScrapbook
          memories={memories}
          onAddMemory={handleAddMemory}
          onUpdateMemory={handleUpdateMemory}
          onLikeMemory={handleLikeMemory}
          onDeleteMemory={handleDeleteMemory}
          onSelectMemory={(m) => setSelectedPhoto(m)}
        />

        {/* Section 2: Dedicated Teacher Tribute Gallery with Photos & Bios ("Tri Ân Thầy Cô") */}
        <TeacherGallery
          teachers={teachers}
          leadership={leadership}
          onAddTeacher={handleAddTeacher}
          onUpdateTeacher={handleUpdateTeacher}
          onLikeTeacher={handleLikeTeacher}
          onDeleteTeacher={handleDeleteTeacher}
          onUpdateLeadership={handleUpdateLeadership}
          onSendTributeToTeacher={handleSendDirectTribute}
        />

        {/* Section 3: Interactive Department Candle Lighting */}
        <TeacherTributes
          departments={departments}
          onSelectDepartmentForLetter={handleOpenComposerWithRecipient}
          onUpdateDepartment={handleUpdateDepartment}
          onLightCandle={handleLightCandle}
        />

        {/* Section 4: Interactive Padlet Wall ("Bảng Tương Tác Padlet & Kỷ Niệm 20/11") */}
        <PadletWall
          notes={padletNotes}
          onAddNote={handleAddPadletNote}
          onUpdateNote={handleUpdatePadletNote}
          onLikeNote={handleLikePadletNote}
          onDeleteNote={handleDeletePadletNote}
        />

        {/* Section 5: Cinematic Film Reel & Letter Writing Desk ("Cuộn Phim Tri Ân & Thư Bay Gửi Thầy Cô") */}
        <CinematicLetterDesk
          departments={departments}
          onAddTribute={handleAddTribute}
          onScrollToGuestbook={() => {
            const el = document.getElementById('guestbook');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Section 6: Digital Guestbook ("Hòm Thư Số Tri Ân - Trọng Tâm") */}
        <GuestbookSection
          tributes={tributes}
          onAddTribute={handleAddTribute}
          onUpdateTribute={handleUpdateTribute}
          onLikeTribute={handleLikeTribute}
          onDeleteTribute={handleDeleteTribute}
          isComposerOpen={isComposerOpen}
          onCloseComposer={() => setIsComposerOpen(false)}
          onOpenComposer={() => {
            setPreselectedRecipient('');
            setIsComposerOpen(true);
          }}
          preselectedRecipient={preselectedRecipient}
        />

        {/* Section 4: Nostalgia Quiz ("Góc Hoài Niệm") */}
        <QuizNostalgia
          onOpenCardMaker={() => setIsCardMakerOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Subtle Mini Corner Audio Player */}
      <MiniMusicPlayer />

      {/* Cinematic Slow-Motion Opening Prologue */}
      <CinematicPrologue
        isOpen={isPrologueOpen}
        onClose={() => setIsPrologueOpen(false)}
        onStartExperience={() => setIsPrologueOpen(false)}
      />

      {/* Modals */}
      <GratitudeCardModal
        isOpen={isCardMakerOpen}
        onClose={() => setIsCardMakerOpen(false)}
      />

      <QRCodeModal
        isOpen={isQRCodeOpen}
        onClose={() => setIsQRCodeOpen(false)}
      />

      <ContestRulesModal
        isOpen={isContestRulesOpen}
        onClose={() => setIsContestRulesOpen(false)}
        onOpenQRCode={() => {
          setIsContestRulesOpen(false);
          setIsQRCodeOpen(true);
        }}
      />

      <PhotoDetailModal
        memory={
          selectedPhoto
            ? memories.find((m) => m.id === selectedPhoto.id) || selectedPhoto
            : null
        }
        onClose={() => setSelectedPhoto(null)}
        onOpenComposer={() => {
          setPreselectedRecipient('');
          setIsComposerOpen(true);
        }}
      />
    </div>
  );
}
