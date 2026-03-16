import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, LayoutTemplate, ImagePlus,
  FlipHorizontal, FlipVertical, RotateCcw, RotateCw,
  Download, Share2, ChevronLeft, ChevronRight, Check, Sparkles, X, Image as ImageIcon,
  ZoomIn, ZoomOut, ArrowUp, ArrowDown, ArrowLeft, ArrowRight
} from 'lucide-react';

// --- DESIGN SYSTEM COLORS ---
const THEME = {
  pink: '#fe005b',
  blue: '#007fff',
  bg: '#fdfbf7',
};

// --- CẤU HÌNH LAYOUTS (Tỉ lệ phần trăm % theo khung 2:3 ~ w=2000, h=3000) ---
const LAYOUTS = [
  {
    id: 'single',
    name: '1 ảnh',
    bgImage: '',
    frameOverlay: 'http://localhost:5173/pingbooth/1.1.png',
    showSlotBorders: true,
    slots: [{ id: 1, top: 4, left: 4, width: 92, height: 80 }],
  },
  {
    id: 'grid',
    name: '4 ảnh',
    bgImage: '',
    frameOverlay: 'http://localhost:5173/pingbooth/4.1.png',
    showSlotBorders: true,
    slots: [
      { id: 1, top: 4.5, left: 4.5, width: 45, height: 40 },
      { id: 2, top: 4.5, left: 51, width: 45, height: 40 },
      { id: 3, top: 44, left: 4, width: 45, height: 40 },
      { id: 4, top: 44, left: 51, width: 45, height: 40 }
    ],
  },
  {
    id: 'triple',
    name: '6 ảnh',
    bgImage: '',
    frameOverlay: 'http://localhost:5173/pingbooth/6.1.png',
    showSlotBorders: true,
    slots: [
      { id: 1, top: 3, left: 4.5, width: 45, height: 28 },
      { id: 2, top: 3.2, left: 51, width: 45, height: 28 },
      { id: 3, top: 31.5, left: 4, width: 45, height: 28 },
      { id: 4, top: 31.5, left: 51, width: 45, height: 28 },
      { id: 5, top: 59, left: 4, width: 45, height: 29 },
      { id: 6, top: 59, left: 51, width: 45, height: 29 }
    ],
  }
];

// --- UTILS ---
const loadImage = (file) => {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ url, imgObj: img, width: img.width, height: img.height });
    img.src = url;
  });
};

const UI_FRAME_WIDTH = 300;
const UI_FRAME_HEIGHT = 450;

// --- COMPONENTS ---

export default function PingBoothApp() {
  const [step, setStep] = useState('home');
  const [selectedLayoutId, setSelectedLayoutId] = useState(null);
  const [photos, setPhotos] = useState({});

  useEffect(() => {
    const preventIOSGestures = (e) => {
      if (e.touches && e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventIOSGestures, { passive: false });

    return () => {
      document.removeEventListener('touchmove', preventIOSGestures);
    };
  }, []);

  const goNext = (nextStep) => setStep(nextStep);
  const goBack = (prevStep) => setStep(prevStep);
  const resetApp = () => {
    setPhotos({});
    setSelectedLayoutId(null);
    setStep('home');
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-[#1a1a1a] flex justify-center items-center font-sans overflow-hidden overscroll-none">
      <div
        className="w-full max-w-md h-full max-h-[900px] relative overflow-hidden flex flex-col shadow-2xl sm:rounded-[40px] sm:h-[95vh] sm:border-[6px] sm:border-black overscroll-none"
        style={{ backgroundColor: THEME.bg }}
      >
        <div className="flex items-center justify-between p-4 border-b-[3px] border-black z-20 bg-white/90 backdrop-blur-md shrink-0">
          {step !== 'home' ? (
            <button
              onClick={() => {
                if(step === 'frames') goBack('home');
                if(step === 'editor') goBack('frames');
                if(step === 'export') goBack('editor');
              }}
              className="p-2 bg-white rounded-full border-[2px] border-black shadow-[0_2px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all"
            >
              <ChevronLeft size={24} className="text-black" strokeWidth={3} />
            </button>
          ) : <div className="w-12" />}

          <div className="flex rounded-full border-[2px] border-black overflow-hidden shadow-[0_0_15px_rgba(254,0,91,0.2)] scale-95 origin-center">
            <div className="bg-[#fe005b] px-4 py-1 text-white font-black text-xl tracking-wider">PING</div>
            <div className="bg-[#007fff] px-4 py-1 text-white font-black text-xl tracking-wider border-l-[2px] border-black">BOOTH</div>
          </div>

          <div className="w-12" />
        </div>

        <div className="flex-1 relative overflow-hidden bg-[radial-gradient(#d1d5db_1.5px,transparent_1.5px)] [background-size:20px_20px]">
          <AnimatePresence mode="wait">
            {step === 'home' && <HomeView key="home" onNext={() => goNext('frames')} />}
            {step === 'frames' && <FramesView key="frames" onSelect={(id) => { setSelectedLayoutId(id); goNext('editor'); }} />}
            {step === 'editor' && (
              <EditorView
                key="editor"
                layout={LAYOUTS.find(l => l.id === selectedLayoutId)}
                photos={photos}
                setPhotos={setPhotos}
                onNext={() => goNext('export')}
              />
            )}
            {step === 'export' && (
              <ExportView
                key="export"
                layout={LAYOUTS.find(l => l.id === selectedLayoutId)}
                photos={photos}
                onReset={resetApp}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* =========================================
   1. HOME VIEW
========================================= */
function HomeView({ onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: -100 }}
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-6 text-center overflow-y-auto overscroll-none"
    >
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="relative mb-10 shrink-0"
      >
        <div className="absolute -inset-6 bg-[#fe005b] rounded-full blur-3xl opacity-30"></div>
        <div className="bg-[#fe005b] w-40 h-40 rounded-[40px] rotate-3 border-[4px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex items-center justify-center relative z-10 overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#007fff] border-l-[4px] border-black"></div>
          <Camera size={64} className="text-white relative z-20 drop-shadow-md" strokeWidth={2.5} />
        </div>
        <Sparkles className="absolute -top-6 -right-6 text-[#007fff] z-20" size={56} strokeWidth={2.5} />
        <div className="absolute -bottom-4 -left-4 bg-yellow-300 border-[2px] border-black rounded-full px-3 py-1 rotate-[-15deg] z-30 shadow-[2px_2px_0_0_#000]">
          <span className="text-black font-black text-sm">HOT! 🔥</span>
        </div>
      </motion.div>

      <h2 className="text-4xl font-black text-black mb-3 uppercase tracking-tight leading-none shrink-0">
        Chụp Hình<br/>Lấy Ngay!
      </h2>
      <p className="text-gray-600 mb-12 font-bold tracking-widest uppercase text-sm shrink-0">Lưu giữ khoảnh khắc Gen Z</p>

      <button
        onClick={onNext}
        className="w-full max-w-[280px] shrink-0 h-[60px] bg-[#007fff] text-white font-black text-xl rounded-full border-[3px] border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] hover:bg-blue-500 active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center gap-2 tracking-wider"
      >
        BẮT ĐẦU CHỤP <ChevronRight size={28} strokeWidth={4} />
      </button>
    </motion.div>
  );
}

/* =========================================
   2. FRAMES SELECTION VIEW
========================================= */
function FramesView({ onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="absolute inset-0 w-full h-full p-6 flex flex-col overscroll-none"
    >
      <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-black uppercase tracking-wider shrink-0">
        <LayoutTemplate className="text-[#fe005b]" strokeWidth={3} /> Chọn Layout
      </h3>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 flex-1 overflow-y-auto pb-10 overscroll-none">
        {LAYOUTS.map((layout) => (
          <button
            key={layout.id}
            onClick={() => onSelect(layout.id)}
            // ĐÃ SỬA: Làm cho Card bo tròn mượt mà, viền mỏng và thanh lịch hơn, hiệu ứng hover đẹp và không bị thô
            className="group relative bg-white rounded-[24px] border-2 border-gray-200 overflow-hidden hover:border-[#fe005b] hover:shadow-[0_10px_25px_rgba(254,0,91,0.15)] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 flex flex-col"
          >
            <div
              className="relative w-full aspect-[2/3] bg-center bg-[length:100%_100%] bg-gray-50/50"
              style={{
                backgroundColor: layout.bgImage ? 'transparent' : (layout.frameOverlay ? '#ffffff' : `${THEME.pink}10`),
                backgroundImage: layout.bgImage ? `url(${layout.bgImage})` : undefined
              }}
            >
              {layout.slots.map(slot => (
                <div
                  key={slot.id}
                  className="absolute bg-white/90 rounded-[4px] shadow-sm"
                  style={{
                    top: `${slot.top}%`, left: `${slot.left}%`,
                    width: `${slot.width}%`, height: `${slot.height}%`,
                    border: layout.showSlotBorders ? '1px solid rgba(0,0,0,0.06)' : 'none'
                  }}
                />
              ))}
              {layout.frameOverlay && (
                <img
                  src={layout.frameOverlay}
                  alt="Frame"
                  className="absolute inset-0 w-full h-full z-10 pointer-events-none drop-shadow-sm"
                />
              )}
            </div>
            {/* ĐÃ SỬA: Phần text bên dưới card hiển thị thanh nhã hơn */}
            <div className="py-3.5 bg-white border-t-2 border-gray-50 text-gray-500 font-bold uppercase tracking-widest text-xs sm:text-sm group-hover:text-[#fe005b] group-hover:bg-pink-50/30 transition-colors w-full">
              {layout.name}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

/* =========================================
   3. EDITOR VIEW
========================================= */
function EditorView({ layout, photos, setPhotos, onNext }) {
  const [activeSlot, setActiveSlot] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !activeSlot) return;

    const photoData = await loadImage(file);
    const slot = layout.slots.find(s => s.id === activeSlot);
    const slotWidthPx = (slot.width / 100) * UI_FRAME_WIDTH;
    const slotHeightPx = (slot.height / 100) * UI_FRAME_HEIGHT;
    const baseScale = Math.max(slotWidthPx / photoData.width, slotHeightPx / photoData.height);

    setPhotos(prev => ({
      ...prev,
      [activeSlot]: {
        ...photoData,
        transform: { x: 0, y: 0, scale: baseScale, userScale: 1, rotate: 0, flipX: 1, flipY: 1 }
      }
    }));
    e.target.value = '';
  };

  const handleToolAction = (action) => {
    if (!activeSlot || !photos[activeSlot]) return;
    setPhotos(prev => {
      const p = prev[activeSlot];
      const t = { ...p.transform };

      switch (action) {
        case 'rotate-left': t.rotate -= 90; break;
        case 'rotate-right': t.rotate += 90; break;
        case 'flip-h': t.flipX *= -1; break;
        case 'flip-v': t.flipY *= -1; break;
        case 'zoom-in': t.userScale *= 1.15; break;
        case 'zoom-out': t.userScale /= 1.15; break;
        case 'move-up': t.y -= 15; break;
        case 'move-down': t.y += 15; break;
        case 'move-left': t.x -= 15; break;
        case 'move-right': t.x += 15; break;
        case 'delete': return { ...prev, [activeSlot]: null };
        default: break;
      }
      return { ...prev, [activeSlot]: { ...p, transform: t } };
    });
  };

  const updateTransform = (slotId, newTransform) => {
    setPhotos(prev => ({
      ...prev,
      [slotId]: { ...prev[slotId], transform: { ...prev[slotId].transform, ...newTransform } }
    }));
  };

  const isAllFilled = layout.slots.every(s => photos[s.id]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="absolute inset-0 w-full h-full flex flex-col overscroll-none"
    >
      <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileChange} />

      <div
        className="flex-1 flex items-center justify-center p-4 pb-36 overflow-y-auto overscroll-none"
        onClick={() => setActiveSlot(null)}
      >
        <motion.div
          animate={{ scale: activeSlot ? 0.98 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative shrink-0 cursor-default overflow-hidden bg-center bg-[length:100%_100%] touch-none shadow-xl border border-black/10 rounded-[20px]"
          style={{
            width: UI_FRAME_WIDTH,
            height: UI_FRAME_HEIGHT,
            backgroundColor: layout.bgImage ? 'transparent' : (layout.frameOverlay ? '#ffffff' : THEME.pink),
            backgroundImage: layout.bgImage ? `url(${layout.bgImage})` : undefined
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {layout.slots.map(slot => (
            <PhotoSlot
              key={slot.id}
              slot={slot}
              photo={photos[slot.id]}
              isActive={activeSlot === slot.id}
              onClick={() => {
                setActiveSlot(slot.id);
                if (!photos[slot.id]) fileInputRef.current?.click();
              }}
              onUpdateTransform={(t) => updateTransform(slot.id, t)}
              showSlotBorders={layout.showSlotBorders}
            />
          ))}

          {layout.frameOverlay && (
            <img
              src={layout.frameOverlay}
              alt="Frame Overlay"
              className="absolute inset-0 w-full h-full z-20 pointer-events-none"
            />
          )}

          {!layout.frameOverlay && !layout.bgImage && (
            <div className="absolute bottom-[4%] w-full flex justify-center pointer-events-none z-30">
               <div className="flex rounded-full border-2 border-black overflow-hidden shadow-[0_0_10px_rgba(254,0,91,0.5)] scale-75 origin-bottom">
                  <div className="bg-[#fe005b] px-3 py-1 text-white font-black tracking-wider">PING</div>
                  <div className="bg-[#007fff] px-3 py-1 text-white font-black tracking-wider border-l-2 border-black">BOOTH</div>
                </div>
            </div>
          )}
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-0 w-full px-6 flex flex-col items-center gap-3 pointer-events-none z-50">
        <div className="min-h-[64px] flex items-center justify-center pointer-events-auto w-full">
          <AnimatePresence mode="wait">
            {(!activeSlot || !photos[activeSlot]) ? (
              <motion.div
                key="helper"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white px-6 py-3 rounded-full border-[2px] border-black shadow-[0_3px_0_0_#000]"
              >
                <p className="text-gray-800 font-black text-xs sm:text-sm uppercase tracking-wider animate-pulse">
                  {isAllFilled ? "✨ Trông tuyệt lắm! Xuất ảnh thôi!" : "👆 Chạm vào ô trống để thêm ảnh"}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="tools"
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="flex gap-2 bg-white p-2 rounded-3xl border-[2px] border-black shadow-[0_3px_0_0_#000] overflow-x-auto w-max max-w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
              >
                <ToolBtn icon={<ArrowUp size={20} strokeWidth={2.5}/>} label="Lên" onClick={() => handleToolAction('move-up')} />
                <ToolBtn icon={<ArrowDown size={20} strokeWidth={2.5}/>} label="Xuống" onClick={() => handleToolAction('move-down')} />
                <ToolBtn icon={<ArrowLeft size={20} strokeWidth={2.5}/>} label="Trái" onClick={() => handleToolAction('move-left')} />
                <ToolBtn icon={<ArrowRight size={20} strokeWidth={2.5}/>} label="Phải" onClick={() => handleToolAction('move-right')} />
                <div className="w-[2px] h-10 bg-black/10 mx-1 self-center rounded-full shrink-0"></div>

                <ToolBtn icon={<ZoomIn size={20} strokeWidth={2.5}/>} label="Phóng" onClick={() => handleToolAction('zoom-in')} />
                <ToolBtn icon={<ZoomOut size={20} strokeWidth={2.5}/>} label="Thu" onClick={() => handleToolAction('zoom-out')} />
                <div className="w-[2px] h-10 bg-black/10 mx-1 self-center rounded-full shrink-0"></div>

                <ToolBtn icon={<RotateCcw size={20} strokeWidth={2.5}/>} label="X.Trái" onClick={() => handleToolAction('rotate-left')} />
                <ToolBtn icon={<RotateCw size={20} strokeWidth={2.5}/>} label="X.Phải" onClick={() => handleToolAction('rotate-right')} />
                <ToolBtn icon={<FlipHorizontal size={20} strokeWidth={2.5}/>} label="Ngang" onClick={() => handleToolAction('flip-h')} />
                <ToolBtn icon={<FlipVertical size={20} strokeWidth={2.5}/>} label="Dọc" onClick={() => handleToolAction('flip-v')} />
                <div className="w-[2px] h-10 bg-black/10 mx-1 self-center rounded-full shrink-0"></div>

                <ToolBtn icon={<X size={20} strokeWidth={3}/>} label="Xoá" onClick={() => handleToolAction('delete')} danger />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={onNext}
          disabled={!isAllFilled}
          className={`h-[56px] w-full max-w-[320px] rounded-full border-[3px] border-black font-black text-lg uppercase tracking-widest transition-all flex items-center justify-center gap-2 pointer-events-auto mt-2 ${
            isAllFilled
              ? 'bg-[#007fff] text-white shadow-[0_4px_0_0_rgba(0,0,0,1)] active:translate-y-[4px] active:shadow-none cursor-pointer hover:bg-blue-500'
              : 'bg-gray-200 text-gray-400 border-gray-300 shadow-none cursor-not-allowed'
          }`}
        >
          <Check size={24} strokeWidth={4} /> XUẤT ẢNH NGAY
        </button>
      </div>

    </motion.div>
  );
}

function ToolBtn({ icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-[52px] h-[52px] rounded-[14px] border-[2px] border-black flex flex-col items-center justify-center gap-[2px] shadow-[0_2px_0_0_#000] active:translate-y-[2px] active:shadow-none transition-all shrink-0 ${
        danger ? 'bg-[#fe005b] text-white hover:bg-pink-600' : 'bg-[#fdfbf7] text-black hover:bg-gray-200'
      }`}
    >
      {icon}
      {label && <span className="text-[9px] font-black uppercase tracking-tighter leading-none">{label}</span>}
    </button>
  );
}

/* =========================================
   3.1 PHOTO SLOT
========================================= */
function PhotoSlot({ slot, photo, isActive, onClick, onUpdateTransform, showSlotBorders }) {
  const containerRef = useRef(null);

  const gesture = useRef({
    activePointers: new Map(),
    initialDist: null,
    startScale: 1,
    startCenter: null,
    startX: 0,
    startY: 0
  });

  const currentTransform = useRef(null);

  useEffect(() => {
    if (photo && gesture.current.activePointers.size === 0) {
      currentTransform.current = { ...photo.transform };
    }
  }, [photo]);

  const resetBaselines = () => {
    const pointers = Array.from(gesture.current.activePointers.values());
    if (!currentTransform.current) return;

    gesture.current.startX = currentTransform.current.x;
    gesture.current.startY = currentTransform.current.y;
    gesture.current.startScale = currentTransform.current.userScale;

    if (pointers.length === 1) {
      gesture.current.startCenter = pointers[0];
      gesture.current.initialDist = null;
    } else if (pointers.length === 2) {
      const [p1, p2] = pointers;
      gesture.current.startCenter = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
      gesture.current.initialDist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
    }
  };

  const handlePointerDown = (e) => {
    if (!photo) return;
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);

    if (!currentTransform.current) currentTransform.current = { ...photo.transform };

    gesture.current.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    resetBaselines();
  };

  const handlePointerMove = (e) => {
    if (!photo || !gesture.current.activePointers.has(e.pointerId)) return;
    e.stopPropagation();

    gesture.current.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pointers = Array.from(gesture.current.activePointers.values());

    if (pointers.length === 1 && gesture.current.startCenter) {
      const p = pointers[0];
      const dx = p.x - gesture.current.startCenter.x;
      const dy = p.y - gesture.current.startCenter.y;

      const newX = gesture.current.startX + dx;
      const newY = gesture.current.startY + dy;

      currentTransform.current = { ...currentTransform.current, x: newX, y: newY };
      onUpdateTransform({ x: newX, y: newY });

    } else if (pointers.length === 2 && gesture.current.initialDist) {
      const [p1, p2] = pointers;
      const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      const center = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

      const scaleFactor = dist / gesture.current.initialDist;
      const dx = center.x - gesture.current.startCenter.x;
      const dy = center.y - gesture.current.startCenter.y;

      const newX = gesture.current.startX + dx;
      const newY = gesture.current.startY + dy;
      const newScale = gesture.current.startScale * scaleFactor;

      currentTransform.current = { ...currentTransform.current, x: newX, y: newY, userScale: newScale };
      onUpdateTransform({ x: newX, y: newY, userScale: newScale });
    }
  };

  const handlePointerUp = (e) => {
    if (!photo) return;
    e.stopPropagation();
    gesture.current.activePointers.delete(e.pointerId);
    resetBaselines();
  };

  return (
    <div
      ref={containerRef}
      className={`absolute overflow-hidden cursor-pointer touch-none select-none transition-all duration-200 ${
        isActive ? 'z-10 ring-4 ring-[#007fff]' : 'z-0'
      }`}
      style={{
        top: `${slot.top}%`, left: `${slot.left}%`,
        width: `${slot.width}%`, height: `${slot.height}%`,
        backgroundColor: photo ? 'transparent' : 'rgba(255, 255, 255, 0.85)',
        border: showSlotBorders ? '0.5px solid #000' : 'none'
      }}
      onClick={onClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {!photo ? (
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 hover:bg-white/50 transition-colors gap-1 sm:gap-2">
          <ImagePlus size={32} strokeWidth={2.5} />
          <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-wider text-center px-1 leading-tight">Thêm ảnh</span>
        </div>
      ) : (
        <div className="w-full h-full relative overflow-hidden pointer-events-none">
          <img
            src={photo.url}
            alt="Slot"
            className="absolute max-w-none pointer-events-none transition-transform duration-75"
            style={{
              top: '50%',
              left: '50%',
              width: photo.width,
              height: photo.height,
              transform: `
                translate(calc(-50% + ${photo.transform.x}px), calc(-50% + ${photo.transform.y}px))
                scale(${photo.transform.scale * photo.transform.userScale * photo.transform.flipX}, ${photo.transform.scale * photo.transform.userScale * photo.transform.flipY})
                rotate(${photo.transform.rotate}deg)
              `,
              transformOrigin: 'center center'
            }}
            draggable={false}
          />
        </div>
      )}
    </div>
  );
}

/* =========================================
   4. EXPORT VIEW
========================================= */
function ExportView({ layout, photos, onReset }) {
  const [resultImage, setResultImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const generateCanvas = async () => {
      setIsGenerating(true);
      try {
        const canvas = document.createElement('canvas');
        const SCALE = 4;
        canvas.width = UI_FRAME_WIDTH * SCALE;
        canvas.height = UI_FRAME_HEIGHT * SCALE;
        const ctx = canvas.getContext('2d');

        if (layout.bgImage) {
          const bgImg = new Image();
          bgImg.crossOrigin = "anonymous";
          bgImg.src = layout.bgImage;
          await new Promise(r => { bgImg.onload = r; bgImg.onerror = r; });
          ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        } else if (!layout.frameOverlay) {
          ctx.fillStyle = THEME.pink;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        for (const slot of layout.slots) {
          const sX = (slot.left / 100) * canvas.width;
          const sY = (slot.top / 100) * canvas.height;
          const sW = (slot.width / 100) * canvas.width;
          const sH = (slot.height / 100) * canvas.height;

          ctx.save();
          ctx.beginPath();
          ctx.rect(sX, sY, sW, sH);
          ctx.clip();
          ctx.fillStyle = '#ffffff';
          ctx.fill();

          const photo = photos[slot.id];
          if (photo && photo.imgObj) {
            const t = photo.transform;
            const centerX = sX + sW / 2;
            const centerY = sY + sH / 2;

            ctx.translate(centerX, centerY);
            ctx.translate(t.x * SCALE, t.y * SCALE);

            ctx.scale(
              t.scale * t.userScale * t.flipX * SCALE,
              t.scale * t.userScale * t.flipY * SCALE
            );

            ctx.rotate((t.rotate * Math.PI) / 180);

            ctx.drawImage(photo.imgObj, -photo.width / 2, -photo.height / 2, photo.width, photo.height);
          }
          ctx.restore();

          if (layout.showSlotBorders) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(sX, sY, sW, sH);
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 0.5 * SCALE;
            ctx.stroke();
            ctx.restore();
          }
        }

        if (layout.frameOverlay) {
          const overlayImg = new Image();
          overlayImg.crossOrigin = "anonymous";
          overlayImg.src = layout.frameOverlay;
          await new Promise(r => { overlayImg.onload = r; overlayImg.onerror = r; });
          ctx.drawImage(overlayImg, 0, 0, canvas.width, canvas.height);
        }

        if (!layout.frameOverlay && !layout.bgImage) {
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 8 * SCALE;
          ctx.strokeRect(0, 0, canvas.width, canvas.height);
        }

        if (!layout.frameOverlay && !layout.bgImage) {
          const brandW = 160 * SCALE;
          const brandH = 40 * SCALE;
          const brandX = (canvas.width - brandW) / 2;
          const brandY = canvas.height * 0.92;
          const brandRadius = 20 * SCALE;

          ctx.fillStyle = THEME.pink;
          ctx.beginPath();
          ctx.roundRect(brandX, brandY, brandW/2, brandH, [brandRadius, 0, 0, brandRadius]);
          ctx.fill();

          ctx.fillStyle = THEME.blue;
          ctx.beginPath();
          ctx.roundRect(brandX + brandW/2, brandY, brandW/2, brandH, [0, brandRadius, brandRadius, 0]);
          ctx.fill();

          ctx.lineWidth = 4 * SCALE;
          ctx.strokeStyle = '#000000';
          ctx.beginPath();
          ctx.roundRect(brandX, brandY, brandW, brandH, brandRadius);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(brandX + brandW/2, brandY);
          ctx.lineTo(brandX + brandW/2, brandY + brandH);
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = `900 ${18 * SCALE}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const textCenterY = brandY + brandH/2 + (1.5*SCALE);

          ctx.fillText("PING", brandX + brandW*0.25, textCenterY);
          ctx.fillText("BOOTH", brandX + brandW*0.75, textCenterY);
        }

        setResultImage(canvas.toDataURL('image/png', 1.0));
      } catch (err) {
        console.error("Lỗi tạo ảnh:", err);
      }
      setIsGenerating(false);
    };

    setTimeout(generateCanvas, 300);
  }, [layout, photos]);

  const handleDownload = () => {
    if (!resultImage) return;
    const a = document.createElement('a');
    a.href = resultImage;
    a.download = `PINGBOOTH_${new Date().getTime()}.png`;
    a.click();
  };

  const handleShare = async () => {
    if (!resultImage) return;
    try {
      const blob = await (await fetch(resultImage)).blob();
      const file = new File([blob], 'pingbooth.png', { type: 'image/png' });
      if (navigator.share) {
        await navigator.share({
          title: 'Ảnh từ PINGBOOTH',
          text: 'Nhìn bức ảnh cực chất của tôi này! ✨',
          files: [file]
        });
      } else {
        alert('Trình duyệt của bạn không hỗ trợ chia sẻ trực tiếp!');
      }
    } catch (err) {
      console.log('Share failed', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 w-full h-full overflow-y-auto overscroll-none"
    >
      <div className="min-h-full flex flex-col p-6 items-center">

        <h3 className="text-2xl font-black mb-6 text-black text-center uppercase tracking-wider shrink-0 mt-2">
          Tadaaa! ✨<br/>Thành quả của bạn
        </h3>

        <div className="w-full flex justify-center relative shrink-0">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-4 text-[#fe005b] font-black tracking-widest uppercase animate-pulse py-20">
              <ImageIcon size={48} className="animate-bounce" />
              <p>Đang in ảnh...</p>
            </div>
          ) : (
            <div className="relative w-full max-w-[320px]">
              <img
                src={resultImage}
                alt="Result"
                className="relative z-10 w-full h-auto object-contain shadow-xl rounded-[24px] border-[2px] border-black/10"
              />
            </div>
          )}
        </div>

        <div className="w-full max-w-[320px] mt-8 flex flex-col gap-3 pb-12 shrink-0">
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="w-full h-[56px] bg-[#fe005b] text-white font-black text-lg rounded-full border-[3px] border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] hover:bg-pink-600 active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50 tracking-wider"
          >
            <Download size={24} strokeWidth={3} /> LƯU VỀ MÁY
          </button>

          <button
            onClick={handleShare}
            disabled={isGenerating}
            className="w-full h-[56px] bg-[#007fff] text-white font-black text-lg rounded-full border-[3px] border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] hover:bg-blue-600 active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50 tracking-wider"
          >
            <Share2 size={24} strokeWidth={3} /> CHIA SẺ
          </button>

          <button
            onClick={onReset}
            className="w-full mt-2 text-gray-500 font-black py-2 hover:text-black transition-colors uppercase tracking-widest text-sm"
          >
            Chụp lại từ đầu
          </button>
        </div>

      </div>
    </motion.div>
  );
}