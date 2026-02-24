import React from 'react';
import { motion } from 'motion/react';
import { NOTES } from '../utils/audio';

export const Keyboard = ({ activeNoteId, mode, onKeyPress }: any) => {
  return (
    <div className="flex justify-center items-start relative mt-12 select-none max-w-3xl mx-auto">
      {/* Hand labels */}
      <div className="absolute -top-10 left-0 right-0 flex pointer-events-none">
        <div className="flex justify-center items-center text-slate-500 font-bold text-sm sm:text-lg" style={{ width: `${(3/7)*100}%` }}>
          Left Hand
        </div>
        <div className="flex justify-center items-center text-slate-500 font-bold text-sm sm:text-lg" style={{ width: `${(4/7)*100}%` }}>
          Right Hand
        </div>
      </div>

      {NOTES.map((note) => {
        const isActive = activeNoteId === note.id;
        return (
          <motion.div
            key={note.id}
            className={`relative w-10 sm:w-16 md:w-20 h-40 sm:h-48 md:h-56 border-2 sm:border-4 border-slate-800 rounded-b-xl sm:rounded-b-2xl mx-[1px] sm:mx-1 cursor-pointer flex items-end justify-center pb-4 sm:pb-6 shadow-lg transition-colors`}
            style={{ 
              backgroundColor: isActive ? note.color : '#ffffff',
              zIndex: 1
            }}
            whileHover={{ backgroundColor: isActive ? note.color : '#f8fafc' }}
            whileTap={{ scaleY: 0.95, transformOrigin: 'top' }}
            onMouseDown={() => onKeyPress(note)}
            onTouchStart={() => { onKeyPress(note); }}
          >
            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${isActive ? 'bg-white/20' : 'bg-slate-100'}`}>
              <span className={`font-black text-sm sm:text-lg ${isActive ? 'text-white' : 'text-slate-400'}`}>
                {mode == 'learn' ? note.name : ''}
              </span>
            </div>
          </motion.div>
        );
      })}
      
      {/* Black keys */}
      <div className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none">
        {NOTES.map((note, i) => {
          const hasBlackKey = [0, 1, 3, 4].includes(i);
          return (
            <div key={`wrap-${i}`} className="relative w-10 sm:w-16 md:w-20 mx-[1px] sm:mx-1">
              {hasBlackKey && (
                <div className="absolute -right-[10px] sm:-right-[16px] md:-right-[20px] top-0 w-5 sm:w-8 md:w-10 h-24 sm:h-28 md:h-32 bg-slate-800 rounded-b-lg sm:rounded-b-xl z-10 shadow-xl" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
