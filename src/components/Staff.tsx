import React from 'react';
import { motion } from 'motion/react';
import { NOTES } from '../utils/audio';

const TrebleClef = () => (
  <img 
    src="https://upload.wikimedia.org/wikipedia/commons/e/e3/Treble_clef.svg" 
    alt="Treble Clef" 
    className="absolute left-6 top-4 h-36 pointer-events-none opacity-80" 
  />
);

export const Staff = ({ mode, activeNoteId, targetNoteId, onNoteClick }: any) => {
  const notesToShow = mode === 'learn' ? NOTES : NOTES.filter(n => n.id === targetNoteId);
  
  return (
    <div className="relative w-full max-w-2xl mx-auto h-48 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-4 flex items-center overflow-hidden border-4 border-white">
      <TrebleClef />
      
      {/* Staff Lines */}
      <div className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none">
        {[40, 60, 80, 100, 120].map((y) => (
          <div key={y} className="absolute left-8 right-8 h-[2px] bg-slate-800 rounded-full" style={{ top: `${y}px` }} />
        ))}
      </div>

      {/* Notes */}
      <div className="relative w-full h-full ml-24 sm:ml-32">
        {notesToShow.map((note, index) => {
          const isActive = mode === 'learn' ? activeNoteId === note.id : true;
          const leftPos = mode === 'learn' ? `${(index * 11) + 5}%` : '40%';
          
          return (
            <motion.div
              key={note.id + (mode === 'play' ? '-play' : '')}
              className="absolute cursor-pointer flex items-center justify-center w-8 h-8"
              style={{ 
                left: leftPos, 
                top: `${note.y - 16}px`, // center the 32px container on the line
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onNoteClick && onNoteClick(note)}
            >
              {/* Ledger lines */}
              {note.y === 140 && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-[2px] bg-slate-800 rounded-full" />
              )}
              
              <motion.div 
                className={`relative w-6 h-5 sm:w-7 sm:h-6 rounded-[50%] border-2 sm:border-[3px] border-slate-800 shadow-sm flex items-center justify-center -rotate-12`}
                style={{ backgroundColor: isActive ? note.color : '#1e293b' }}
                animate={{ 
                  backgroundColor: isActive ? note.color : '#1e293b',
                  scale: isActive ? 1.2 : 1,
                  y: isActive ? [0, -5, 0] : 0
                }}
                transition={{ type: 'spring', bounce: 0.6 }}
              >
                {/* Stem */}
                <div 
                  className={`absolute w-[2px] sm:w-[3px] bg-slate-800 rounded-full ${
                    note.stem === 'down'
                      ? 'h-8 sm:h-10 -left-[2px] sm:-left-[3px] top-1/2 origin-top' 
                      : 'h-8 sm:h-10 -right-[2px] sm:-right-[3px] bottom-1/2 origin-bottom'
                  }`}
                  style={{ transform: 'rotate(12deg)' }}
                />
                
                {isActive && (
                  <span className="text-[10px] sm:text-xs font-black text-white rotate-12 z-10">{note.name}</span>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
