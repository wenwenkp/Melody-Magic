import React, { useState, useEffect } from 'react';
import { Staff } from './components/Staff';
import { Keyboard } from './components/Keyboard';
import { NOTES, playNote } from './utils/audio';
import confetti from 'canvas-confetti';
import { Music, Play, BookOpen, Star, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [mode, setMode] = useState<'learn' | 'play'>('learn');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [targetNoteId, setTargetNoteId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const pickRandomNote = () => {
    const randomNote = NOTES[Math.floor(Math.random() * NOTES.length)];
    setTargetNoteId(randomNote.id);
  };

  useEffect(() => {
    if (mode === 'play') {
      pickRandomNote();
      setScore(0);
      setStreak(0);
    } else {
      setTargetNoteId(null);
    }
  }, [mode]);

  const handleNoteInteraction = (note: typeof NOTES[0]) => {
    playNote(note.freq);
    setActiveNoteId(note.id);
    setTimeout(() => setActiveNoteId(null), 500);

    if (mode === 'play' && targetNoteId) {
      if (note.id === targetNoteId) {
        // Correct!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: [note.color, '#ffffff', '#fde047']
        });
        setScore(s => s + 10);
        setStreak(s => s + 1);
        setTimeout(pickRandomNote, 1000);
      } else {
        // Incorrect
        setScore(0);
        setStreak(0);
      }
    }
  };

  return (
    <div className="min-h-screen bg-sky-100 font-sans text-slate-800 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 text-sky-600">
          <Music className="w-8 h-8" />
          <h1 className="text-2xl font-black tracking-tight">Melody Magic</h1>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-full">
          <button 
            onClick={() => setMode('learn')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${mode === 'learn' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="hidden sm:inline">Learn</span>
          </button>
          <button 
            onClick={() => setMode('play')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${mode === 'play' ? 'bg-white text-pink-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Play className="w-5 h-5" />
            <span className="hidden sm:inline">Play</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 flex flex-col items-center justify-center gap-8">
        
        <AnimatePresence mode="wait">
          {mode === 'play' && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center gap-8 w-full justify-center"
            >
              <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border-2 border-slate-100 flex items-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <span className="text-xl font-black text-slate-700">{score}</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border-2 border-slate-100 flex items-center gap-3">
                <Star className="w-6 h-6 text-orange-400" />
                <span className="text-xl font-black text-slate-700">{streak} Streak!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full flex flex-col items-center gap-12">
          <div className="w-full relative">
            {mode === 'play' && (
              <div className="text-center">
                <h2 className="text-2xl font-black text-slate-700">Which note is this?</h2>
              </div>
            )}
            {mode === 'learn' && (
              <div className="absolute -top-12 left-0 right-0 text-center">
                <h2 className="text-2xl font-black text-slate-700">Click a note to hear it!</h2>
              </div>
            )}
            <Staff 
              mode={mode} 
              activeNoteId={activeNoteId} 
              targetNoteId={targetNoteId} 
              onNoteClick={mode === 'learn' ? handleNoteInteraction : undefined} 
            />
          </div>

          <div className="w-full">
            <Keyboard 
              activeNoteId={activeNoteId} 
              onKeyPress={handleNoteInteraction} 
            />
          </div>
        </div>

      </main>
      
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob" />
        <div className="absolute top-40 right-10 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-40 w-32 h-32 bg-sky-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-4000" />
      </div>
    </div>
  );
}
