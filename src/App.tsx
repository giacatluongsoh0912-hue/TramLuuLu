import React, { useState, useEffect } from 'react';
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
import { idbGet, idbSet } from './utils/imageStorage';
import {
  INITIAL_MEMORIES,
  INITIAL_TRIBUTES,
  INITIAL_DEPARTMENTS,
  INITIAL_TEACHERS,
  INITIAL_PADLET_NOTES,
  MemoryPhoto,
  TeacherProfile,
  DepartmentFaculty,
} from './data/memoriesData';
import { TributeMessage, PadletNote } from './utils/tributeRules';
import {
  subscribeMemories,
  syncSaveMemory,
  syncDeleteMemory,
  subscribeTeachers,
  syncSaveTeacher,
  syncDeleteTeacher,
  subscribeDepartments,
  syncSaveDepartment,
  subscribePadletNotes,
  syncSavePadletNote,
  syncDeletePadletNote,
  subscribeTributes,
  syncSaveTribute,
  syncDeleteTribute,
} from './utils/syncService';

export default function App() {
  const [memories, setMemories] = useState<MemoryPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('csl_memories');
      return saved ? JSON.parse(saved) : INITIAL_MEMORIES;
    } catch {
      return INITIAL_MEMORIES;
    }
  });

  const [tributes, setTributes] = useState<TributeMessage[]>(() => {
    try {
      const saved = localStorage.getItem('csl_tributes');
      return saved ? JSON.parse(saved) : INITIAL_TRIBUTES;
    } catch {
      return INITIAL_TRIBUTES;
    }
  });

  const [teachers, setTeachers] = useState<TeacherProfile[]>(() => {
    try {
      const saved = localStorage.getItem('csl_teachers');
      return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
    } catch {
      return INITIAL_TEACHERS;
    }
  });

  const [padletNotes, setPadletNotes] = useState<PadletNote[]>(() => {
    try {
      const saved = localStorage.getItem('csl_padlet_notes');
      return saved ? JSON.parse(saved) : INITIAL_PADLET_NOTES;
    } catch {
      return INITIAL_PADLET_NOTES;
    }
  });

  const [departments, setDepartments] = useState<DepartmentFaculty[]>(() => {
    try {
      const saved = localStorage.getItem('csl_departments');
      return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
    } catch {
      return INITIAL_DEPARTMENTS;
    }
  });

  const [petalsEnabled, setPetalsEnabled] = useState(true);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isCardMakerOpen, setIsCardMakerOpen] = useState(false);
  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false);
  const [isContestRulesOpen, setIsContestRulesOpen] = useState(false);
  const [isPrologueOpen, setIsPrologueOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<MemoryPhoto | null>(null);
  const [preselectedRecipient, setPreselectedRecipient] = useState<string>('');

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

  // Real-time synchronization across all devices and browsers via Cloud Firestore
  useEffect(() => {
    const unsubMemories = subscribeMemories((data) => {
      if (data && data.length > 0) setMemories(data);
    });
    const unsubTeachers = subscribeTeachers((data) => {
      if (data && data.length > 0) setTeachers(data);
    });
    const unsubDepts = subscribeDepartments((data) => {
      if (data && data.length > 0) setDepartments(data);
    });
    const unsubNotes = subscribePadletNotes((data) => {
      if (data && data.length > 0) setPadletNotes(data);
    });
    const unsubTributes = subscribeTributes((data) => {
      if (data && data.length > 0) setTributes(data);
    });

    return () => {
      unsubMemories();
      unsubTeachers();
      unsubDepts();
      unsubNotes();
      unsubTributes();
    };
  }, []);

  const handleAddMemory = (newMem: MemoryPhoto) => {
    setMemories((prev) => [newMem, ...prev]);
    syncSaveMemory(newMem).catch(console.error);
  };

  const handleUpdateMemory = (updatedMem: MemoryPhoto) => {
    setMemories((prev) => prev.map((m) => (m.id === updatedMem.id ? updatedMem : m)));
    syncSaveMemory(updatedMem).catch(console.error);
  };

  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    syncDeleteMemory(id).catch(console.error);
  };

  const handleAddTeacher = (newTch: TeacherProfile) => {
    setTeachers((prev) => [newTch, ...prev]);
    syncSaveTeacher(newTch).catch(console.error);
  };

  const handleUpdateTeacher = (updatedTch: TeacherProfile) => {
    setTeachers((prev) => prev.map((t) => (t.id === updatedTch.id ? updatedTch : t)));
    syncSaveTeacher(updatedTch).catch(console.error);
  };

  const handleDeleteTeacher = (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
    syncDeleteTeacher(id).catch(console.error);
  };

  const handleUpdateDepartment = (updatedDept: DepartmentFaculty) => {
    setDepartments((prev) => prev.map((d) => (d.id === updatedDept.id ? updatedDept : d)));
    syncSaveDepartment(updatedDept).catch(console.error);
  };

  const handleAddPadletNote = (newNote: PadletNote) => {
    setPadletNotes((prev) => [newNote, ...prev]);
    syncSavePadletNote(newNote).catch(console.error);
  };

  const handleUpdatePadletNote = (updatedNote: PadletNote) => {
    setPadletNotes((prev) => prev.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
    syncSavePadletNote(updatedNote).catch(console.error);
  };

  const handleDeletePadletNote = (id: string) => {
    setPadletNotes((prev) => prev.filter((n) => n.id !== id));
    syncDeletePadletNote(id).catch(console.error);
  };

  const handleAddTribute = (newTrib: TributeMessage) => {
    setTributes((prev) => [newTrib, ...prev]);
    syncSaveTribute(newTrib).catch(console.error);
  };

  const handleUpdateTribute = (updatedTrib: TributeMessage) => {
    setTributes((prev) => prev.map((t) => (t.id === updatedTrib.id ? updatedTrib : t)));
    syncSaveTribute(updatedTrib).catch(console.error);
  };

  const handleDeleteTribute = (id: string) => {
    setTributes((prev) => prev.filter((t) => t.id !== id));
    syncDeleteTribute(id).catch(console.error);
  };

  const handleOpenComposerWithRecipient = (deptName: string) => {
    setPreselectedRecipient(`Thầy Cô ${deptName}`);
    setIsComposerOpen(true);
  };

  const handleSendDirectTribute = (teacherName: string, department: string) => {
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
      imageSrc: '/assets/aistudio/Tr_m_k_t_n_i_s___1__108e2677.png',
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
          onDeleteMemory={handleDeleteMemory}
          onSelectMemory={(m) => setSelectedPhoto(m)}
        />

        {/* Section 2: Dedicated Teacher Tribute Gallery with Photos & Bios ("Tri Ân Thầy Cô") */}
        <TeacherGallery
          teachers={teachers}
          onAddTeacher={handleAddTeacher}
          onUpdateTeacher={handleUpdateTeacher}
          onDeleteTeacher={handleDeleteTeacher}
          onSendTributeToTeacher={handleSendDirectTribute}
        />

        {/* Section 3: Interactive Department Candle Lighting */}
        <TeacherTributes
          departments={departments}
          onSelectDepartmentForLetter={handleOpenComposerWithRecipient}
          onUpdateDepartment={handleUpdateDepartment}
        />

        {/* Section 4: Interactive Padlet Wall ("Bảng Tương Tác Padlet & Kỷ Niệm 20/11") */}
        <PadletWall
          notes={padletNotes}
          onAddNote={handleAddPadletNote}
          onUpdateNote={handleUpdatePadletNote}
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
        memory={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onOpenComposer={() => {
          setPreselectedRecipient('');
          setIsComposerOpen(true);
        }}
      />
    </div>
  );
}
