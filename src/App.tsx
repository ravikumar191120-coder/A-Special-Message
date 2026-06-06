import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Lock,
  Mail,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  Check,
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  Coffee,
  CloudRain,
  ChevronDown,
  ChevronUp,
  User,
  HeartCrack
} from 'lucide-react';
import { FloatingHeart } from './types';

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [customHearts, setCustomHearts] = useState<FloatingHeart[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activeTab, setActiveTab] = useState<number>(1);
  const [activeSection, setActiveSection] = useState<number>(1);

  // Health and test checkbox interactive elements
  const [tookFood, setTookFood] = useState(false);
  const [tookWater, setTookWater] = useState(false);
  const [tookSleep, setTookSleep] = useState(false);
  const [tookStressFree, setTookStressFree] = useState(false);

  // Chat message visual indicators
  const [visibleChats, setVisibleChats] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Lazy initialize background piano music
  useEffect(() => {
    audioRef.current = new Audio('https://assets.codepen.io/4358584/Anisina.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log('Audio blocked:', err);
      });
    }
  };

  const handleOpenLetter = () => {
    setIsOpened(true);
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log('Autoplay policy caught:', e));
    }
    triggerScreenBurstHearts();

    // Staggered chat visibility trigger for Section 2
    setTimeout(() => {
      setVisibleChats(1);
    }, 1500);
  };

  // Stagger chat bubbles reveal
  useEffect(() => {
    if (isOpened && visibleChats > 0 && visibleChats < 3) {
      const timer = setTimeout(() => {
        setVisibleChats((prev) => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpened, visibleChats]);

  // Click-to-spawn hearts around where click happens
  const handleSpawnHeart = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startY = e.clientY + window.scrollY;

    const newHearts: FloatingHeart[] = Array.from({ length: 6 }).map((_, idx) => ({
      id: Date.now() + idx + Math.random(),
      x: startX + (Math.random() - 0.5) * 45,
      y: startY - Math.random() * 15,
      size: Math.random() * 18 + 12,
      speedY: -(Math.random() * 2.5 + 1.5),
      opacity: 1,
      scale: 1,
      rotation: (Math.random() - 0.5) * 45
    }));

    setCustomHearts((prev) => [...prev, ...newHearts]);
  };

  // Burst screen trigger
  const triggerScreenBurstHearts = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight + window.scrollY;

    const burstHearts: FloatingHeart[] = Array.from({ length: 25 }).map((_, idx) => ({
      id: Date.now() + idx + Math.random(),
      x: Math.random() * screenWidth,
      y: screenHeight - 60,
      size: Math.random() * 22 + 10,
      speedY: -(Math.random() * 3.5 + 2),
      opacity: 1,
      scale: 1,
      rotation: (Math.random() - 0.5) * 60
    }));

    setCustomHearts((prev) => [...prev, ...burstHearts]);
  };

  // Heart animation updates
  useEffect(() => {
    if (customHearts.length === 0) return;

    const interval = setInterval(() => {
      setCustomHearts((prev) =>
        prev
          .map((h) => ({
            ...h,
            y: h.y + h.speedY,
            opacity: h.opacity - 0.012,
            scale: h.scale * 1.002,
            rotation: h.rotation + 0.4
          }))
          .filter((h) => h.opacity > 0)
      );
    }, 16);

    return () => clearInterval(interval);
  }, [customHearts]);

  // Toast / Response copying helper
  const handleCopyText = (text: string, responseLabel: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setToastMessage(`Copied: "${responseLabel}" ❤️ send it to him.`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    });
  };

  return (
    <div
      onClick={handleSpawnHeart}
      className="relative min-h-screen bg-[#0f0f0f] text-[#f3f4f6] pb-24 selection:bg-purple-800 selection:text-purple-100 overflow-x-hidden font-sans"
    >
      {/* Floating particles effect container */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft glowing ambient backgrounds */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-purple-600/5 rounded-full blur-[110px]" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-pink-600/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      {/* Spawners floating hearts rendering globally */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {customHearts.map((heart) => (
          <div
            key={heart.id}
            style={{
              left: `${heart.x}px`,
              top: `${heart.y}px`,
              opacity: heart.opacity,
              transform: `scale(${heart.scale}) rotate(${heart.rotation}deg)`,
              width: `${heart.size}px`,
              height: `${heart.size}px`,
              color: '#f43f5e'
            }}
            className="absolute transition-transform duration-75 text-rose-500 pointer-events-none"
          >
            <Heart className="w-full h-full fill-current drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
          </div>
        ))}
      </div>

      {/* Header Fixed Bar containing Soundwave controls */}
      <AnimatePresence>
        {isOpened && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-40 flex items-center gap-3"
          >
            {/* Ambient Track Status */}
            <div className="hidden sm:flex items-center gap-2 bg-[#121212]/80 border border-white/5 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] text-white/60">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
              <span>Playing: Peaceful Piano Track</span>
            </div>

            {/* Equalizer Audio Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              style={{ contentVisibility: 'auto' }}
              className="flex items-center justify-center p-3 rounded-full bg-black/60 border border-white/10 backdrop-blur-lg hover:border-purple-500/50 shadow-lg text-white transition-all cursor-pointer group"
              title="Play beautiful ambient background music"
            >
              {isPlaying ? (
                <div className="flex items-center gap-1 h-4 px-1">
                  <span className="w-0.5 bg-purple-400 rounded-full h-3 animate-pulse" />
                  <span className="w-0.5 bg-pink-400 rounded-full h-4 animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span className="w-0.5 bg-blue-400 rounded-full h-2 animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <span className="w-0.5 bg-cyan-400 rounded-full h-4 animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <Volume2 className="w-3.5 h-3.5 ml-1.5 text-purple-400" />
                </div>
              ) : (
                <div className="flex items-center">
                  <VolumeX className="w-3.5 h-3.5 text-white/50 group-hover:text-purple-400 transition-colors" />
                </div>
              )}
            </button>

            {/* Restart Trigger */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpened(false);
                setVisibleChats(0);
              }}
              className="p-3 rounded-full bg-black/60 border border-white/10 backdrop-blur-lg hover:border-pink-500/50 shadow-lg text-white/60 hover:text-white transition-all cursor-pointer"
              title="Restart reading from beginning"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <AnimatePresence mode="wait">
        {!isOpened ? (
          /* SECTION: SEALED EMORY ENVELOPE (Private Message Intro) */
          <motion.div
            key="sealed_envelope"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center min-h-screen px-4 py-8 relative z-10"
          >
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-[90px] pointer-events-none" />

            <motion.div
              initial={{ y: 25 }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', stiffness: 90 }}
              className="max-w-md w-full relative group"
            >
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 opacity-20 group-hover:opacity-45 blur-xl transition duration-1000 animate-pulse" />

              {/* Cover envelope content */}
              <div
                id="sealed_glass_letter"
                className="relative backdrop-blur-2xl bg-[#121212]/90 border border-white/10 rounded-3xl p-8 text-center flex flex-col items-center shadow-2xl"
              >
                <div className="relative mb-6">
                  <div className="absolute -inset-2.5 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full opacity-30 blur-md animate-ping" />
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 border border-white/25 flex items-center justify-center shadow-lg">
                    <Mail className="w-7 h-7 text-white stroke-[1.5]" />
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-widest bg-purple-950/40 text-purple-300 border border-purple-500/30 font-mono mb-4">
                  🔐 Private Connection • For Bacha
                </span>

                <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-white mb-3">
                  Aapke Liye Ek Message
                </h1>

                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  Maine isko bohot dhyan se likha hai, taaki main apni genuine feelings aap tak bina kisi bahar ke shor ke pahuncha sakun. Ek baar pura padhna, please. ❤️
                </p>

                <button
                  id="open_note_action"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenLetter();
                  }}
                  className="relative w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 font-display font-medium text-white shadow-xl hover:shadow-pink-500/20 active:scale-95 cursor-pointer overflow-hidden group/btn transition-all duration-300 border border-white/15"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                  <span className="relative flex items-center justify-center gap-2">
                    Open Note ❤️
                  </span>
                </button>

                <div className="mt-5 text-zinc-600 text-xs font-mono">
                  Radhey Radhey 🙏 • Late Night Note
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          /* THE MULTI-SECTION STORYTELLING VIEW */
          <div className="relative z-10 max-w-2xl mx-auto px-4 pt-12 md:pt-20">
            
            {/* SECTION 1 — INTRO */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center pt-8 pb-16 border-b border-white/5 mb-12"
            >
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-purple-950/30 border border-purple-500/20 text-purple-300 font-mono text-xs">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-purple-400" style={{ animationDuration: '6s' }} />
                <span>Aaj bas kuch baatein kehni thi...</span>
              </div>
              
              <h2 className="font-serif text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-blue-300 font-semibold italic select-none">
                &ldquo;Please pura padh lena bacha ❤️&rdquo;
              </h2>
              
              <div className="mt-4 text-xs text-zinc-500 font-mono">
                ✨ Scroll or touch slowly to read. Tap anywhere to float hearts.
              </div>
            </motion.div>


            {/* SECTION 2 — FEELINGS (Chat Bubbles style) */}
            <div className="mb-16">
              <span className="text-[10px] tracking-widest font-mono text-zinc-500 uppercase block mb-4">
                SECTION 02 — FEELINGS & SILENCE
              </span>

              <div className="flex flex-col gap-4 bg-zinc-900/40 p-4 rounded-3xl border border-white/5 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-2 right-4 flex items-center gap-2 text-[10px] font-mono text-purple-400/70">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping" />
                  <span>Late Night Chat Format</span>
                </div>

                {/* Bubble 1: Left */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="max-w-[85%] self-start flex items-start gap-2"
                >
                  <div className="w-7 h-7 rounded-full bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-xs text-purple-200">
                    🫠
                  </div>
                  <div className="p-4 rounded-2xl rounded-tl-none bg-purple-900/20 border border-purple-500/20 text-sm sm:text-base leading-relaxed text-purple-100">
                    <p>Bacha, gussa aur ego itna bhi achha nahi hota...</p>
                  </div>
                </motion.div>

                {/* Bubble 2: Right */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="max-w-[85%] self-end flex items-start gap-2 flex-row-reverse"
                >
                  <div className="w-7 h-7 rounded-full bg-pink-900/40 border border-pink-500/30 flex items-center justify-center text-xs text-pink-200">
                    🥹
                  </div>
                  <div className="p-4 rounded-2xl rounded-tr-none bg-pink-900/20 border border-pink-500/20 text-sm sm:text-base leading-relaxed text-pink-100">
                    <p>Aapke ek baar bolne par maine apni saari female friends remove kar di thi. To kya main itna bhi expect nahi kar sakta ki meri baat ko bhi thoda sa importance mile?</p>
                  </div>
                </motion.div>

                {/* Bubble 3: Left */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 1.1 }}
                  className="max-w-[85%] self-start flex items-start gap-2"
                >
                  <div className="w-7 h-7 rounded-full bg-purple-900/30 border border-blue-500/30 flex items-center justify-center text-xs text-blue-200">
                    😶
                  </div>
                  <div className="p-4 rounded-2xl rounded-tl-none bg-blue-950/20 border border-blue-500/20 text-sm sm:text-base leading-relaxed text-blue-100">
                    <p>Agar main text na karun aur aap bhi text na karo... to usse ego nahi to aur kya kahenge bacha?</p>
                  </div>
                </motion.div>
                
                <div className="text-center text-[10px] text-zinc-600 font-mono mt-1 select-none">
                  ⚡ Silent delay simulation active
                </div>
              </div>
            </div>


            {/* SECTION 3 — PRIVACY & INSECURITY (Special Glassmorphism Card with lock & heart) */}
            <div className="mb-16">
              <span className="text-[10px] tracking-widest font-mono text-zinc-500 uppercase block mb-4">
                SECTION 03 — PRIVACY & INSECURITY
              </span>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative rounded-3xl backdrop-blur-xl bg-gradient-to-b from-[#18181b]/90 to-[#121212]/90 border border-cyan-500/20 p-6 sm:p-8 overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.1)] hover:border-cyan-500/40 transition-colors"
              >
                {/* Visual icons glow layers */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                    <Heart className="w-4 h-4 fill-rose-500/20" />
                  </div>
                </div>

                <div className="text-sm font-mono text-cyan-400/80 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Concern, Not Control
                </div>

                <div className="flex flex-col gap-6 select-text">
                  <p className="text-base sm:text-lg text-zinc-100 font-medium leading-relaxed">
                    🔒 Mujhe aapke accounts ya posts se kabhi problem nahi thi. Main bas unwanted log aur aapki privacy ko lekar concern tha.
                  </p>
                  
                  <div className="h-[1px] bg-white/10" />

                  <p className="text-base sm:text-lg text-zinc-200 leading-relaxed italic">
                    🥺 Public account hone se mujhe insecurity hoti hai bacha. Chahe main account ho ya secondary. Mujhe bas aapki tension rehti hai.
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Insecurity stems from extreme genuine love</span>
                  <span>🔒 Protect Mode</span>
                </div>
              </motion.div>
            </div>


            {/* SECTION 4 — HEALTH (Cute care card with floating emoji icons) */}
            <div className="mb-16 relative">
              <span className="text-[10px] tracking-widest font-mono text-zinc-500 uppercase block mb-4">
                SECTION 04 — CUTE NURTURING CHARGE
              </span>

              {/* Floating food/sleep emoji animation layers behind this section */}
              <div className="absolute -left-4 top-10 pointer-events-none text-xl animate-bounce" style={{ animationDuration: '3s' }}>
                🍽️
              </div>
              <div className="absolute -right-4 top-20 pointer-events-none text-xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>
                💧
              </div>
              <div className="absolute -left-6 bottom-10 pointer-events-none text-xl animate-pulse" style={{ animationDuration: '5s' }}>
                😴
              </div>
              <div className="absolute -right-6 bottom-4 pointer-events-none text-xl animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>
                ❤️
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-3xl border border-pink-500/20 bg-gradient-to-tr from-pink-950/20 via-[#18181b]/90 to-transparent p-6 sm:p-8 shadow-[0_0_20px_rgba(236,72,153,0.1)] text-center relative"
              >
                <div className="w-12 h-12 bg-pink-500/10 text-pink-400 border border-pink-500/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Heart className="w-6 h-6 fill-pink-500/20" />
                </div>

                <p className="text-lg sm:text-xl font-display font-medium text-pink-300 leading-relaxed mb-4">
                  ❤️ Aur haan...
                </p>

                <p className="text-base sm:text-lg text-zinc-200 leading-relaxed font-sans max-w-md mx-auto">
                  Thoda apna khayal bhi rakha karo.<br className="block my-2" />Har baat pe gussa nahi karte.<br className="block my-2" />Mera cute sa bacha ho aap. 🫶
                </p>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-pink-400/80 font-mono">
                  <span>✨ Non-blaming sweet care</span>
                  <span>🐾</span>
                </div>
              </motion.div>
            </div>


            {/* SECTION 5 — EFFORTS (Conversation - Hurt & Honest Style) */}
            <div className="mb-16">
              <span className="text-[10px] tracking-widest font-mono text-zinc-500 uppercase block mb-4">
                SECTION 05 — EFFORT & SILENCE CONCERNS
              </span>

              <div className="flex flex-col gap-6">
                
                {/* Block 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="rounded-2xl border border-white/5 bg-[#121212]/90 p-6 flex gap-4 hover:border-blue-500/30 transition-colors"
                >
                  <div className="text-2xl pt-0.5">📖</div>
                  <div>
                    <h4 className="text-zinc-400 font-mono text-[11px] uppercase mb-1">Mera Sincere Darr</h4>
                    <p className="text-sm sm:text-base text-zinc-200 leading-relaxed">
                      Mujhe lag raha hai ki jitna serious aur effort main hoon, shayad utna aap nahi ho ab. Agar sach me aisa hai to honestly bata dena. Jhooth me na aapka time waste ho aur na mera.
                    </p>
                  </div>
                </motion.div>

                {/* Block 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="rounded-2xl border border-white/5 bg-[#121212]/90 p-6 flex gap-4 hover:border-purple-500/30 transition-colors"
                >
                  <div className="text-2xl pt-0.5">🤷‍♂️</div>
                  <div>
                    <h4 className="text-zinc-400 font-mono text-[11px] uppercase mb-1">Equal Treatment Aspect</h4>
                    <p className="text-sm sm:text-base text-zinc-200 leading-relaxed">
                      Kabhi-kabhi aisa feel hota hai ki possessiveness aur efforts dono side equal nahi hain. Bas apna present feeling bata raha hoon.
                    </p>
                  </div>
                </motion.div>

                {/* Block 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="rounded-2xl border border-white/5 bg-[#121212]/90 p-6 flex gap-4 hover:border-pink-500/30 transition-colors"
                >
                  <div className="text-2xl pt-0.5">😔</div>
                  <div>
                    <h4 className="text-zinc-400 font-mono text-[11px] uppercase mb-1">The Silence is Killing</h4>
                    <p className="text-sm sm:text-base text-zinc-200 leading-relaxed">
                      Mujhe bhi achha nahi lag raha aapse baat na karke. Believe me... Bilkul bhi nahi.
                    </p>
                  </div>
                </motion.div>

                {/* Block 4 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.45 }}
                  className="rounded-2xl border border-white/5 bg-[#121212]/90 p-6 flex gap-4 hover:border-blue-500/30 transition-colors"
                >
                  <div className="text-2xl pt-0.5">🫂</div>
                  <div>
                    <h4 className="text-zinc-400 font-mono text-[11px] uppercase mb-1">Mutual Respect Aspect</h4>
                    <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-sans">
                      Zid dono me hai bacha... To respect bhi dono ki baaton ki honi chahiye na.
                    </p>
                  </div>
                </motion.div>

              </div>
            </div>


            {/* SECTION 6 — TOMORROW PLAN (Ticket / Bullet layout card) */}
            <div className="mb-16">
              <span className="text-[10px] tracking-widest font-mono text-zinc-500 uppercase block mb-4">
                SECTION 06 — TOMORROW PLAN
              </span>

              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative rounded-3xl bg-gradient-to-r from-purple-950/20 via-zinc-900/95 to-purple-950/30 border border-purple-500/40 p-6 sm:p-8 shadow-[0_0_30px_rgba(168,85,247,0.2)] overflow-hidden"
              >
                {/* Neon dot indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 text-purple-400 font-mono text-[10px] uppercase">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                  Arrival Pending Check
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-white">Tomorrow&apos;s Coordinate</h3>
                    <p className="text-xs text-zinc-400 font-mono">Let him know if you decide to go</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                    <div className="flex items-center gap-2 text-pink-400 font-mono text-xs uppercase mb-2">
                      <Clock className="w-3.5 h-3.5" />
                      🕛 Call / Text Cutoff
                    </div>
                    <span className="text-sm font-semibold text-white">Before 12 PM</span>
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                    <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase mb-2">
                      <span>🏃‍♂️ Expected Arrival</span>
                    </div>
                    <span className="text-sm font-semibold text-white">12:30 – 12:45 PM</span>
                  </div>
                </div>

                {/* The actual original text preserved exactly */}
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed border-t border-white/5 pt-4">
                  📱 Kal saath chalna ho to 12 baje se pehle ek text ya call kar dena. Main 12:30–12:45 tak pahunchne ki poori koshish karunga. 🏃‍♂️
                </p>
              </motion.div>
            </div>


            {/* SECTION 7 — MAIN POV (Longest section, typing feel with custom delay) */}
            <div className="mb-16">
              <span className="text-[10px] tracking-widest font-mono text-zinc-500 uppercase block mb-4">
                SECTION 07 — MAIN POINT OF VIEW
              </span>

              <div className="space-y-6">
                
                {/* Card 1: POV Statement */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="p-6 rounded-3xl border border-white/5 bg-gradient-to-r from-[#121212] to-transparent"
                >
                  <p className="text-base sm:text-lg text-zinc-100 font-medium leading-relaxed italic">
                    ✨ Ek baar mera POV se bhi dekhne ki koshish karna. Agar phir bhi lage ki main galat hoon to main maan jaunga. Mujhe aapse trust issue nahi hai. Main bas kabhi-kabhi same treatment aur same effort feel karna chahta hoon. ❤️
                  </p>
                </motion.div>

                {/* Card 2: Apology */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="p-6 rounded-3xl border border-white/5 bg-gradient-to-l from-[#121212] to-transparent text-right"
                >
                  <p className="text-base sm:text-lg text-rose-300 font-medium leading-relaxed">
                    🥺 Agar meri kisi baat se bura laga ho... To sorry. Main bas apni feelings bata raha tha.
                  </p>
                </motion.div>

                {/* Card 3: Decide details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="p-6 rounded-3xl border border-purple-500/15 bg-black/40 shadow-inner leading-relaxed"
                >
                  <h4 className="text-[11px] font-mono text-purple-400 uppercase tracking-widest mb-2">Our Agreement</h4>
                  <p className="text-sm sm:text-base text-zinc-200">
                    Bacha... Ham dono ka jo decide hua tha, woh mujhe yaad hai. Aur main apni baat par abhi bhi khada hoon. ❤️
                  </p>
                </motion.div>

                {/* Card 4: Silence */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="p-6 rounded-3xl border border-white/5 bg-[#121212]"
                >
                  <h4 className="text-[11px] font-mono text-indigo-400 uppercase tracking-widest mb-2">My Sincere Intention</h4>
                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                    Lekin sach bolun to mujhe ye silence bilkul achha nahi lag raha. Main ye website isliye nahi bana raha ki aapko force karun ya guilt feel karwaun.
                  </p>
                </motion.div>

              </div>
            </div>


            {/* SECTION 8 — HEALTH & TEST (Visually the most stunning with checklists) */}
            <div className="mb-16">
              <span className="text-[10px] tracking-widest font-mono text-zinc-500 uppercase block mb-4">
                SECTION 08 — HEALTH & TEST CARE
              </span>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative rounded-3xl bg-gradient-to-tr from-[#121212]/95 via-purple-950/15 to-blue-950/15 border border-cyan-500/30 p-6 sm:p-8 shadow-[0_0_40px_rgba(6,182,212,0.15)] overflow-hidden"
              >
                {/* Visual sparkles header */}
                <div className="absolute top-4 left-4 text-purple-400 opacity-40 animate-pulse">
                  <CloudRain className="w-8 h-8" />
                </div>

                <div className="text-center mb-6">
                  <span className="px-3 py-1 inline-block rounded-full text-[10px] uppercase tracking-widest bg-cyan-950/40 text-cyan-300 border border-cyan-500/20 font-mono mb-2">
                    🌧️ CRITICAL ADVISORY FOR BACHA
                  </span>
                  
                  {/* Preserved entire message exactly */}
                  <p className="text-sm sm:text-base text-zinc-100 italic leading-relaxed mt-3 border-b border-white/5 pb-4">
                    Ab meri baat chhodo... Aap apni tabiyat ka khayal rakho. ❤️ Aur haan... Test bhi hai. 📚 Isliye please stress mat lo. Achhe se khana khana 🍽️ Paani peena 💧 Time pe sona 😴 Aur fresh mind se exam dena. Mujhe sabse zyada isi baat ki tension rehti hai ki aap thik ho ya nahi. 🫶❤️
                  </p>
                </div>

                {/* Gorgeous interactive check checklist grid to engage the user emotionally */}
                <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-widest text-center mb-4">
                  Bacha, Promise me you will check these:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTookFood(!tookFood);
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-medium transition-all duration-300 cursor-pointer ${
                      tookFood
                        ? 'bg-green-950/30 border-green-500/40 text-green-300'
                        : 'bg-black/40 border-white/5 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🍽️</span>
                      <span>Achha Se Khana Khana</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${tookFood ? 'bg-green-500 border-green-400 text-white' : 'border-white/20'}`}>
                      {tookFood && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTookWater(!tookWater);
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-medium transition-all duration-300 cursor-pointer ${
                      tookWater
                        ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300'
                        : 'bg-black/40 border-white/5 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💧</span>
                      <span>Regular Paani Peena</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${tookWater ? 'bg-cyan-500 border-cyan-400 text-white' : 'border-white/20'}`}>
                      {tookWater && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTookSleep(!tookSleep);
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-medium transition-all duration-300 cursor-pointer ${
                      tookSleep
                        ? 'bg-purple-950/30 border-purple-500/40 text-purple-300'
                        : 'bg-black/40 border-white/5 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">😴</span>
                      <span>Time Pe Sona (No Stress)</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${tookSleep ? 'bg-purple-500 border-purple-400 text-white' : 'border-white/20'}`}>
                      {tookSleep && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTookStressFree(!tookStressFree);
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-medium transition-all duration-300 cursor-pointer ${
                      tookStressFree
                        ? 'bg-pink-950/30 border-pink-500/40 text-pink-300'
                        : 'bg-black/40 border-white/5 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📚</span>
                      <span>Fresh Mind Se Exam Dena</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${tookStressFree ? 'bg-pink-500 border-pink-400 text-white' : 'border-white/20'}`}>
                      {tookStressFree && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                </div>
              </motion.div>
            </div>


            {/* SECTION 9 — REPLY REQUEST */}
            <div className="mb-16">
              <span className="text-[10px] tracking-widest font-mono text-zinc-500 uppercase block mb-4">
                SECTION 09 — THE SINCERE REQUEST
              </span>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="rounded-3xl border border-white/15 bg-black/40 p-6 sm:p-8 relative"
              >
                <div className="flex items-center gap-2 text-xs font-mono text-pink-400 mb-4 select-none">
                  <Sparkles className="w-4 h-4 animate-spin text-pink-400" style={{ animationDuration: '4s' }} />
                  <span>My Honest Request</span>
                </div>

                <div className="space-y-4 select-text">
                  <p className="text-sm sm:text-base text-zinc-200 leading-relaxed">
                    Bas itna chahta hoon ki agar aapko lagta hai ki meri baaton me thodi si bhi sachchai hai, ya aap mera POV samajh pa rahe ho...
                  </p>
                  
                  <blockquote className="p-4 rounded-2xl bg-[#121212] border-l-2 border-pink-500 text-base sm:text-lg font-serif italic text-pink-300 my-4 leading-relaxed">
                    &ldquo;To ek baar khud se reply kar dena. 🥺&rdquo;
                  </blockquote>

                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                    Chahe &ldquo;haan&rdquo;, &ldquo;na&rdquo;, &ldquo;samajh gayi&rdquo;, ya sirf ek emoji hi kyu na ho...
                  </p>

                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                    Bas itna pata chal jayega ki meri baat aap tak pahunchi. ❤️
                  </p>

                  <p className="text-xs text-zinc-500 italic mt-2">
                    Decision aapka hoga. Reply bhi aapki marzi se hoga. Main bas wait karunga... 🙂🫶
                  </p>
                </div>
              </motion.div>
            </div>


            {/* SECTION 10 — FINAL MESSAGE (Message 12/13 and 20, then the huge centered statement) */}
            <div className="mb-16">
              <span className="text-[10px] tracking-widest font-mono text-zinc-500 uppercase block mb-4">
                SECTION 10 — LAST CONVERSATION
              </span>

              <div className="space-y-6">
                
                {/* Message 13 (The Ignore check) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl border border-white/5 bg-[#121212]/80"
                >
                  <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed">
                    💭 Aap khud jaante ho... Ignore hone ya baat na suni jaane par kaisa lagta hai.
                  </p>
                </motion.div>

                {/* Message 20 (Last note preserved complete) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 }}
                  className="p-6 sm:p-8 rounded-3xl border border-pink-500/25 bg-gradient-to-b from-[#18181b]/95 to-[#121212]/95 shadow-[0_0_20px_rgba(236,72,153,0.1)] relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-pink-400/80">
                    💌 LAST NOTE FOR YOU
                  </div>

                  <p className="text-base sm:text-lg text-zinc-100 font-medium leading-relaxed mb-4">
                    Bacha... Main aaj bhi aapke reply ka wait kar raha hoon.
                  </p>

                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-4">
                    Baat karni ho to kar lena. Daantna ho to daant lena. Gussa karna ho to woh bhi kar lena. Bas apna khayal rakhna. 🫂❤️
                  </p>

                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
                    Aur kal agar saath chalna ho... To ek text kar dena.
                  </p>
                </motion.div>

                {/* HUGE CENTERED STATEMENT GIVING CHILLS */}
                <div className="pt-12 text-center relative overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-rose-500/10 rounded-full blur-[70px] pointer-events-none" />

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="relative"
                  >
                    <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.4)] px-4 leading-tight">
                      ❤️ Ego jeet bhi gaya na bacha...
                    </h3>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 1.4 }}
                    className="relative mt-4"
                  >
                    <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)] px-4 leading-tight">
                      ❤️ To bhi ham dono hi haar jayenge. ❤️
                    </h3>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.8 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 2.2 }}
                    className="mt-10 flex flex-col items-center gap-1.5 text-zinc-500 font-mono text-xs select-none"
                  >
                    <span>Good Night 🌙 • Radhey Radhey 🙏 • Tata 👋❤️</span>
                  </motion.div>
                </div>

              </div>
            </div>


            {/* FINAL SCREEN (Pure beautiful dark waiting center with cursor animation) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="mt-16 text-center select-none"
              id="final_reply_panel"
            >
              <div className="relative rounded-3xl bg-[#0a0a0a] border border-purple-500/25 p-8 overflow-hidden shadow-[inset_0_0_30px_rgba(168,85,247,0.1),_0_0_35px_rgba(0,0,0,0.8)]">
                
                {/* Sparkling dots */}
                <div className="absolute top-3 left-3 animate-pulse text-purple-400">
                  <Sparkles className="w-4 h-4 opacity-70" />
                </div>
                <div className="absolute bottom-3 right-3 animate-pulse text-pink-400">
                  <Sparkles className="w-4 h-4 opacity-70" />
                </div>

                <div className="h-10" />

                <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 drop-shadow-[0_0_12px_rgba(168,85,247,0.3)] animate-pulse duration-[1500ms] mb-2">
                  Waiting for your reply... ❤️
                  <span className="inline-block w-1.5 h-6 ml-1 bg-pink-500 animate-[ping_1.5s_infinite]" />
                </h1>

                <p className="font-sans text-sm text-zinc-400 mb-8 max-w-sm mx-auto">
                  Main yahin hoon. 🙂
                </p>

                {/* Instant action click prompts to respond directly without any unrequested auto-replies */}
                <div className="flex flex-col gap-2.5 max-w-xs mx-auto mb-6">
                  <h4 className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-1">
                    Quickly Copy Your Reaction Response:
                  </h4>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyText('Haan, kal saath chalte hain. Pura letter padh liya maine ❤️', 'Haan...');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-purple-600/10 hover:bg-purple-600/25 border border-purple-500/20 font-mono text-[11px] text-purple-200 hover:text-white transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <span>CopyToClipboard: &ldquo;Haan...&rdquo;</span>
                    <Heart className="w-3 h-3 text-purple-400 group-hover:scale-125 transition-transform" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyText('Samajh gayi. Pura letter padha. Baat karte hain... 🥺', 'Samajh gayi');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-pink-600/10 hover:bg-pink-600/25 border border-pink-500/20 font-mono text-[11px] text-pink-200 hover:text-white transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <span>CopyToClipboard: &ldquo;Samajh gayi&rdquo;</span>
                    <Heart className="w-3 h-3 text-pink-400 group-hover:scale-125 transition-transform" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyText('✨🫶 (Mera cute bacha)', 'Emoji pair');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-cyan-600/10 hover:bg-cyan-600/25 border border-cyan-500/20 font-mono text-[11px] text-cyan-200 hover:text-white transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <span>CopyToClipboard: &ldquo;✨🫶&rdquo;</span>
                    <Heart className="w-3 h-3 text-cyan-400 group-hover:scale-125 transition-transform" />
                  </button>
                </div>

                <div className="text-[10px] text-zinc-600 font-mono select-none uppercase tracking-widest mt-2 border-t border-white/5 pt-4">
                  🔒 Encrypted • Private Receiver Space Only
                </div>
              </div>
            </motion.div>

            {/* Warm closing footer info */}
            <div className="text-center mt-12 text-zinc-700 text-[10px] font-mono select-none">
              <p>Designed with utmost emotional sincerity.</p>
              <p className="mt-1">Copyright © 2026 • Radhey Radhey 🙏</p>
            </div>

          </div>
        )}
      </AnimatePresence>

      {/* Toast Prompt Notification alerts */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-black/95 border border-purple-500/30 rounded-2xl shadow-2xl flex items-center gap-2.5 max-w-sm w-11/12 justify-center pointer-events-none"
          >
            <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
              <Heart className="w-3 h-3 fill-current" />
            </div>
            <p className="text-xs text-zinc-200 font-medium">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
