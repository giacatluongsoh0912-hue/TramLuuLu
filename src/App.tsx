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
} from './data/memoriesData';
import { TributeMessage, PadletNote } from './utils/tributeRules';

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

  // Hydrate from IndexedDB on startup (preserves custom user photos even if localStorage quota was hit)
  useEffect(() => {
    (async () => {
      try {
        const idbMemories = await idbGet<MemoryPhoto[]>('csl_memories');
        if (idbMemories && Array.isArray(idbMemories) && idbMemories.length > 0) {
          setMemories(idbMemories);
        }
        const idbTeachers = await idbGet<TeacherProfile[]>('csl_teachers');
        if (idbTeachers && Array.isArray(idbTeachers) && idbTeachers.length > 0) {
          setTeachers(idbTeachers);
        }
        const idbTributes = await idbGet<TributeMessage[]>('csl_tributes');
        if (idbTributes && Array.isArray(idbTributes) && idbTributes.length > 0) {
          setTributes(idbTributes);
        }
        const idbNotes = await idbGet<PadletNote[]>('csl_padlet_notes');
        if (idbNotes && Array.isArray(idbNotes) && idbNotes.length > 0) {
          setPadletNotes(idbNotes);
        }
      } catch (err) {
        console.warn('IndexedDB initial hydration skipped:', err);
      }
    })();
  }, []);

  // Persist memories to both localStorage and IndexedDB
  useEffect(() => {
    try {
      localStorage.setItem('csl_memories', JSON.stringify(memories));
    } catch {
      // quota fallback to IDB
    }
    idbSet('csl_memories', memories);
  }, [memories]);

  // Persist tributes to both localStorage and IndexedDB
  useEffect(() => {
    try {
      localStorage.setItem('csl_tributes', JSON.stringify(tributes));
    } catch {
      // quota fallback to IDB
    }
    idbSet('csl_tributes', tributes);
  }, [tributes]);

  // Persist teachers to both localStorage and IndexedDB
  useEffect(() => {
    try {
      localStorage.setItem('csl_teachers', JSON.stringify(teachers));
    } catch {
      // quota fallback to IDB
    }
    idbSet('csl_teachers', teachers);
  }, [teachers]);

  // Persist padlet notes to both localStorage and IndexedDB
  useEffect(() => {
    try {
      localStorage.setItem('csl_padlet_notes', JSON.stringify(padletNotes));
    } catch {
      // quota fallback to IDB
    }
    idbSet('csl_padlet_notes', padletNotes);
  }, [padletNotes]);

  const handleAddMemory = (newMem: MemoryPhoto) => {
    setMemories((prev) => [newMem, ...prev]);
  };

  const handleUpdateMemory = (updatedMem: MemoryPhoto) => {
    setMemories((prev) => prev.map((m) => (m.id === updatedMem.id ? updatedMem : m)));
  };

  const handleAddTeacher = (newTch: TeacherProfile) => {
    setTeachers((prev) => [newTch, ...prev]);
  };

  const handleUpdateTeacher = (updatedTch: TeacherProfile) => {
    setTeachers((prev) => prev.map((t) => (t.id === updatedTch.id ? updatedTch : t)));
  };

  const handleAddPadletNote = (newNote: PadletNote) => {
    setPadletNotes((prev) => [newNote, ...prev]);
  };

  const handleUpdatePadletNote = (updatedNote: PadletNote) => {
    setPadletNotes((prev) => prev.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
  };

  const handleDeletePadletNote = (id: string) => {
    setPadletNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleAddTribute = (newTrib: TributeMessage) => {
    setTributes((prev) => [newTrib, ...prev]);
  };

  const handleUpdateTribute = (updatedTrib: TributeMessage) => {
    setTributes((prev) => prev.map((t) => (t.id === updatedTrib.id ? updatedTrib : t)));
  };

  const handleDeleteTribute = (id: string) => {
    setTributes((prev) => prev.filter((t) => t.id !== id));
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
          onSelectMemory={(m) => setSelectedPhoto(m)}
        />

        {/* Section 2: Dedicated Teacher Tribute Gallery with Photos & Bios ("Tri Ân Thầy Cô") */}
        <TeacherGallery
          teachers={teachers}
          onAddTeacher={handleAddTeacher}
          onUpdateTeacher={handleUpdateTeacher}
          onSendTributeToTeacher={handleSendDirectTribute}
        />

        {/* Section 3: Interactive Department Candle Lighting */}
        <TeacherTributes
          departments={INITIAL_DEPARTMENTS}
          onSelectDepartmentForLetter={handleOpenComposerWithRecipient}
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
          departments={INITIAL_DEPARTMENTS}
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
