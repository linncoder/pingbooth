import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  Image as ImageIcon,
  Download,
  Printer,
  Settings,
  Type,
  Smile,
  ZoomIn,
  RotateCw,
  FlipHorizontal,
  Trash2,
  Check,
  QrCode,
  ArrowLeft,
  X,
  Palette,
  Layout,
} from "lucide-react";

// --- CONFIG & MOCK DATA ---
const BASE_WIDTH = 1200;
const BASE_HEIGHT = 1800;

// Màu sắc thương hiệu PING BOX
const THEME = {
  pink: "#FF005C",
  blue: "#0080FF",
  black: "#000000",
  white: "#FFFFFF",
  bg: "#F4F4F4",
};

// Viền PNG trong suốt
const SAMPLE_PNG_FRAME =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1800">
    <path d="M0,0 H1200 V1800 H0 Z M100,150 V1350 H1100 V150 Z" fill="#FF005C" fill-opacity="0.1" fill-rule="evenodd"/>
    <rect x="80" y="130" width="1040" height="1240" fill="none" stroke="#FF005C" stroke-width="15" stroke-dasharray="30,20"/>
    <text x="600" y="1550" font-family="sans-serif" font-size="90" fill="#0080FF" text-anchor="middle" font-weight="900">PING BOX</text>
  </svg>
`);

const FRAMES = [
  {
    id: "png_overlay",
    name: "Khung PING BOX (Mẫu)",
    bgColor: "#ffffff",
    frameImg: SAMPLE_PNG_FRAME,
    slots: [{ id: "s1", x: 100, y: 150, w: 1000, h: 1200 }],
    decorations: [],
  },
  {
    id: "polaroid",
    name: "Cổ điển (Polaroid)",
    bgColor: "#ffffff",
    slots: [{ id: "s1", x: 100, y: 100, w: 1000, h: 1200 }],
    decorations: [
      {
        type: "static_text",
        text: "PING BOX MEMORIES",
        x: 600,
        y: 1500,
        size: 70,
        font: "sans-serif",
        color: "#000000",
      },
    ],
  },
  {
    id: "strip",
    name: "Photobooth Strip",
    bgColor: "#FF005C",
    slots: [
      { id: "s1", x: 100, y: 100, w: 1000, h: 500 },
      { id: "s2", x: 100, y: 650, w: 1000, h: 500 },
      { id: "s3", x: 100, y: 1200, w: 1000, h: 500 },
    ],
    decorations: [],
  },
  {
    id: "grid",
    name: "Lưới 4 Ảnh",
    bgColor: "#0080FF",
    slots: [
      { id: "s1", x: 50, y: 250, w: 525, h: 625 },
      { id: "s2", x: 625, y: 250, w: 525, h: 625 },
      { id: "s3", x: 50, y: 925, w: 525, h: 625 },
      { id: "s4", x: 625, y: 925, w: 525, h: 625 },
    ],
    decorations: [
      {
        type: "static_text",
        text: "V I B E S",
        x: 600,
        y: 125,
        size: 100,
        font: "sans-serif",
        color: "#ffffff",
      },
    ],
  },
];

const STICKERS = ["✨", "❤️", "🔥", "👑", "🌸", "🎈", "🎉", "✌️", "😎", "👻"];
const COLORS = [
  "#ffffff",
  "#000000",
  THEME.pink,
  THEME.blue,
  "#00ff00",
  "#ffff00",
  "#ff00ff",
  "#00ffff",
];

// --- UI COMPONENTS (NEO-BRUTALISM) ---
const ButtonPrimary = ({
  children,
  onClick,
  className = "",
  style = "pink",
}) => {
  const bg = style === "pink" ? "bg-[#FF005C]" : "bg-[#0080FF]";
  return (
    <button
      onClick={onClick}
      className={`relative ${bg} text-white font-black border-4 border-black rounded-2xl px-6 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all uppercase tracking-wider flex items-center justify-center ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "", onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden ${onClick ? "cursor-pointer hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all" : ""} ${className}`}
  >
    {children}
  </div>
);

// --- MAIN COMPONENT ---
export default function App() {
  const [view, setView] = useState("home");
  const [selectedFrame, setSelectedFrame] = useState(null);

  return (
    <div className="min-h-screen bg-[#F4F4F4] font-sans text-black flex justify-center selection:bg-[#FF005C] selection:text-white">
      {/* Background pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: "radial-gradient(#000 2px, transparent 2px)",
          backgroundSize: "30px 30px",
        }}
      ></div>

      <div className="w-full max-w-md bg-white border-x-4 border-black relative min-h-screen flex flex-col overflow-hidden shadow-2xl">
        {/* Header - Styled like PING BOX Logo */}
        <header className="bg-white border-b-4 border-black pt-5 pb-3 px-4 flex items-center justify-between z-10 shrink-0">
          <div className="flex flex-col">
            <div className="flex text-3xl font-black drop-shadow-[0_0_15px_rgba(255,0,92,0.4)]">
              <span className="bg-[#FF005C] text-white px-3 py-1 rounded-l-2xl border-4 border-black border-r-0 relative z-10">
                PING
              </span>
              <span className="bg-[#0080FF] text-white px-3 py-1 rounded-r-2xl border-4 border-black border-l-[3px] -ml-2 pl-4">
                BOX
              </span>
            </div>
            <span className="text-[9px] font-extrabold tracking-[0.25em] mt-1 ml-1 uppercase text-black">
              Music Box & Mini Mart
            </span>
          </div>
          {view === "home" && (
            <button
              onClick={() => setView("admin")}
              className="p-2 bg-[#0080FF] text-white rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <Settings size={22} strokeWidth={3} />
            </button>
          )}
        </header>

        {/* Views */}
        <main className="flex-1 overflow-y-auto relative bg-[#F9F9F9]">
          {view === "home" && <HomeView onStart={() => setView("frames")} />}
          {view === "admin" && <AdminView onBack={() => setView("home")} />}
          {view === "frames" && (
            <FrameSelectView
              onBack={() => setView("home")}
              onSelect={(frame) => {
                setSelectedFrame(frame);
                setView("editor");
              }}
            />
          )}
          {view === "editor" && selectedFrame && (
            <EditorView
              frame={selectedFrame}
              onBack={() => setView("frames")}
              onComplete={(dataUrl) => {
                setView("export");
                setSelectedFrame({ ...selectedFrame, finalImage: dataUrl });
              }}
            />
          )}
          {view === "export" && selectedFrame?.finalImage && (
            <ExportView
              image={selectedFrame.finalImage}
              onBack={() => setView("editor")}
              onHome={() => {
                setView("home");
                setSelectedFrame(null);
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// --- VIEWS ---

function HomeView({ onStart }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="relative mb-10">
        <div className="w-48 h-48 bg-[#0080FF] rounded-full flex items-center justify-center border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-10 relative">
          <Camera size={90} color="#fff" strokeWidth={2} />
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#FF005C] rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce"></div>
        <div className="absolute -bottom-2 -left-6 w-16 h-16 bg-[#FFC107] rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-12"></div>
      </div>

      <h2 className="text-4xl font-black mb-4 uppercase tracking-tight leading-none text-black drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]">
        Ghi lại <br />
        <span className="text-[#FF005C]">Khoảnh khắc</span>
      </h2>
      <p className="font-bold text-gray-600 mb-10 border-2 border-black bg-white px-4 py-2 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
        Chọn khung hình, tải ảnh lên và trang trí theo phong cách PING BOX!
      </p>

      <ButtonPrimary
        onClick={onStart}
        className="w-full py-5 text-xl flex items-center justify-center space-x-3"
      >
        <Camera size={28} strokeWidth={3} />
        <span>Bắt đầu chụp</span>
      </ButtonPrimary>
    </div>
  );
}

function AdminView({ onBack }) {
  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : "https://example.com";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="p-6 h-full flex flex-col">
      <button
        onClick={onBack}
        className="flex items-center font-black mb-6 border-2 border-black px-4 py-2 rounded-xl w-max hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
      >
        <ArrowLeft size={20} className="mr-2" strokeWidth={3} /> QUAY LẠI
      </button>
      <h2 className="text-3xl font-black mb-6 uppercase">Quản trị viên</h2>

      <Card className="p-6 text-center mb-6 bg-[#E0F0FF]">
        <h3 className="font-black text-xl mb-2 flex items-center justify-center uppercase">
          <QrCode size={24} className="mr-2" strokeWidth={3} /> QR Code App
        </h3>
        <p className="font-bold text-sm mb-4">
          Người dùng quét mã này để truy cập.
        </p>
        <div className="bg-white p-4 border-4 border-black rounded-2xl w-max mx-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
        </div>
      </Card>

      <Card className="p-6 flex-1 bg-[#FFEBF2]">
        <h3 className="font-black text-xl mb-4 flex items-center uppercase">
          <Layout size={24} className="mr-2" strokeWidth={3} /> Quản lý Khung
        </h3>
        <ul className="space-y-4">
          {FRAMES.map((f) => (
            <li
              key={f.id}
              className="flex justify-between items-center p-4 bg-white border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <span className="font-bold text-lg">{f.name}</span>
              <span className="text-sm bg-[#0080FF] text-white font-bold px-3 py-1 rounded-lg border-2 border-black">
                {f.slots.length} Ô ẢNH
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function FrameSelectView({ onBack, onSelect }) {
  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="flex items-center font-black mb-6 border-2 border-black px-4 py-2 rounded-xl w-max hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
      >
        <ArrowLeft size={20} className="mr-2" strokeWidth={3} /> QUAY LẠI
      </button>
      <h2 className="text-3xl font-black mb-6 text-center uppercase">
        Chọn khung hình
      </h2>

      <div className="grid grid-cols-2 gap-5">
        {FRAMES.map((frame) => (
          <Card
            key={frame.id}
            onClick={() => onSelect(frame)}
            className="flex flex-col h-full bg-white"
          >
            <div className="h-48 w-full flex items-center justify-center p-3 bg-gray-100 border-b-4 border-black relative">
              {/* Pattern overlay for frame preview */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)",
                  backgroundSize: "10px 10px",
                  backgroundPosition: "0 0, 5px 5px",
                }}
              ></div>

              <div
                className="relative w-full h-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] z-10"
                style={{ backgroundColor: frame.bgColor }}
              >
                {frame.slots.map((s) => (
                  <div
                    key={s.id}
                    className="absolute bg-white/80 border border-dashed border-gray-400"
                    style={{
                      left: `${(s.x / BASE_WIDTH) * 100}%`,
                      top: `${(s.y / BASE_HEIGHT) * 100}%`,
                      width: `${(s.w / BASE_WIDTH) * 100}%`,
                      height: `${(s.h / BASE_HEIGHT) * 100}%`,
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="p-4 text-center font-black uppercase tracking-wide text-sm">
              {frame.name}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function EditorView({ frame, onBack, onComplete }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [slotsData, setSlotsData] = useState({});
  const [decorations, setDecorations] = useState([]);
  const [activeSlotId, setActiveSlotId] = useState(null);
  const [activeDecoId, setActiveDecoId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Giảm trừ padding lớn hơn để hợp với viền dày của style mới
        const scaleX = (rect.width - 40) / BASE_WIDTH;
        const scaleY = (rect.height - 40) / BASE_HEIGHT;
        setScale(Math.min(scaleX, scaleY));
      }
    };
    setTimeout(updateScale, 10);
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const handleFileUpload = (slotId, file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const slot = frame.slots.find((s) => s.id === slotId);
      const imgAspect = img.width / img.height;
      const slotAspect = slot.w / slot.h;

      let initialScale =
        imgAspect > slotAspect ? slot.h / img.height : slot.w / img.width;

      setSlotsData((prev) => ({
        ...prev,
        [slotId]: {
          imgUrl: url,
          imgObj: img,
          panX: 0,
          panY: 0,
          scale: initialScale,
          rotate: 0,
          flipX: false,
        },
      }));
      setActiveSlotId(slotId);
      setActiveDecoId(null);
    };
    img.src = url;
  };

  const handleExport = async () => {
    setIsGenerating(true);
    setTimeout(async () => {
      try {
        const EXPORT_MULT = 2; // HD
        const canvas = document.createElement("canvas");
        canvas.width = BASE_WIDTH * EXPORT_MULT;
        canvas.height = BASE_HEIGHT * EXPORT_MULT;
        const ctx = canvas.getContext("2d");

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.scale(EXPORT_MULT, EXPORT_MULT);

        // Fill background
        ctx.fillStyle = frame.bgColor;
        ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

        frame.slots.forEach((slot) => {
          ctx.save();
          ctx.beginPath();
          ctx.rect(slot.x, slot.y, slot.w, slot.h);
          ctx.clip();

          ctx.fillStyle = "#f3f4f6";
          ctx.fillRect(slot.x, slot.y, slot.w, slot.h);

          const data = slotsData[slot.id];
          if (data && data.imgObj) {
            ctx.translate(slot.x + slot.w / 2, slot.y + slot.h / 2);
            ctx.translate(data.panX, data.panY);
            ctx.rotate((data.rotate * Math.PI) / 180);
            ctx.scale(data.flipX ? -data.scale : data.scale, data.scale);
            ctx.drawImage(
              data.imgObj,
              -data.imgObj.width / 2,
              -data.imgObj.height / 2,
            );
          }
          ctx.restore();
        });

        if (frame.frameImg) {
          const overlayImg = await new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error("Lỗi tải ảnh khung viền PNG"));
            img.src = frame.frameImg;
          });
          ctx.drawImage(overlayImg, 0, 0, BASE_WIDTH, BASE_HEIGHT);
        }

        frame.decorations.forEach((dec) => {
          if (dec.type === "static_text") {
            ctx.save();
            ctx.translate(dec.x, dec.y);
            ctx.font = `bold ${dec.size}px ${dec.font}`;
            ctx.fillStyle = dec.color;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(dec.text, 0, 0);
            ctx.restore();
          }
        });

        decorations.forEach((dec) => {
          ctx.save();
          ctx.translate(dec.x, dec.y);
          if (dec.type === "text") {
            ctx.font = `900 ${dec.size}px sans-serif`;
            ctx.fillStyle = dec.color;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(dec.text, 0, 0);

            // Text Stroke effect for Neo-brutalism
            ctx.lineWidth = dec.size * 0.05;
            ctx.strokeStyle = "#000000";
            ctx.strokeText(dec.text, 0, 0);
          } else if (dec.type === "sticker") {
            ctx.font = `${dec.size}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(dec.content, 0, 0);
          }
          ctx.restore();
        });

        const dataUrl = canvas.toDataURL("image/jpeg", 1.0);
        onComplete(dataUrl);
      } catch (err) {
        alert("Lỗi khi xuất ảnh!");
        console.error(err);
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  };

  const handleSlotPointerMove = (e, slotId) => {
    if (e.buttons !== 1) return;
    if (activeSlotId !== slotId) return;

    setSlotsData((prev) => {
      if (!prev[slotId]) return prev;
      return {
        ...prev,
        [slotId]: {
          ...prev[slotId],
          panX: prev[slotId].panX + e.movementX / scale,
          panY: prev[slotId].panY + e.movementY / scale,
        },
      };
    });
  };

  const handleDecoPointerMove = (e, id) => {
    if (e.buttons !== 1) return;
    setDecorations((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, x: d.x + e.movementX / scale, y: d.y + e.movementY / scale }
          : d,
      ),
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] overflow-hidden relative">
      {/* Top Navbar Editor */}
      <div className="flex justify-between items-center p-4 bg-white border-b-4 border-black z-10 w-full shrink-0">
        <button
          onClick={onBack}
          className="p-2 bg-white border-4 border-black rounded-xl hover:bg-gray-100 shadow-[4px_4px_0px_0px_#000] transition-all"
        >
          <ArrowLeft size={20} strokeWidth={3} />
        </button>
        <div className="font-black text-lg uppercase tracking-widest">
          {frame.name}
        </div>
        <button
          onClick={handleExport}
          disabled={isGenerating}
          className={`px-4 py-2 rounded-xl font-black text-sm flex items-center border-4 border-black uppercase transition-all ${isGenerating ? "bg-gray-400 text-gray-700" : "bg-[#FF005C] text-white shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]"}`}
        >
          {isGenerating ? (
            "ĐANG..."
          ) : (
            <span className="flex items-center">
              <Check size={18} className="mr-1" strokeWidth={3} /> XONG
            </span>
          )}
        </button>
      </div>

      {/* Main Workspace */}
      <div
        ref={containerRef}
        className="flex-1 w-full flex items-center justify-center relative touch-none overflow-hidden"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setActiveSlotId(null);
            setActiveDecoId(null);
          }
        }}
      >
        <div
          style={{
            width: BASE_WIDTH * scale,
            height: BASE_HEIGHT * scale,
            position: "relative",
            flexShrink: 0,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setActiveSlotId(null);
              setActiveDecoId(null);
            }
          }}
        >
          <div
            style={{
              width: BASE_WIDTH,
              height: BASE_HEIGHT,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              backgroundColor: frame.bgColor,
              position: "absolute",
              top: 0,
              left: 0,
              boxShadow: "15px 15px 0px 0px rgba(0,0,0,1)", // Retro Hard shadow
              border: "10px solid #000", // Khung viền cứng bọc toàn bộ khung ảnh
              overflow: "hidden",
            }}
          >
            {/* Static Decorations */}
            {frame.decorations.map((dec, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: dec.x,
                  top: dec.y,
                  transform: "translate(-50%, -50%)",
                  fontSize: dec.size,
                  fontFamily: dec.font,
                  color: dec.color,
                  fontWeight: "900",
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {dec.text}
              </div>
            ))}

            {/* Slots */}
            {frame.slots.map((slot) => {
              const data = slotsData[slot.id];
              const isActive = activeSlotId === slot.id;
              return (
                <div
                  key={slot.id}
                  onPointerDown={() => {
                    setActiveSlotId(slot.id);
                    setActiveDecoId(null);
                  }}
                  onPointerMove={(e) => handleSlotPointerMove(e, slot.id)}
                  style={{
                    position: "absolute",
                    left: slot.x,
                    top: slot.y,
                    width: slot.w,
                    height: slot.h,
                    backgroundColor: "#f3f4f6",
                    overflow: "hidden",
                    border: isActive ? "12px solid #0080FF" : "none",
                    zIndex: isActive ? 10 : 1,
                    cursor: data ? "grab" : "pointer",
                  }}
                >
                  {!data ? (
                    <label className="w-full h-full flex flex-col items-center justify-center text-gray-500 font-bold bg-[#E0F0FF] cursor-pointer hover:bg-[#cce5ff] transition border-4 border-dashed border-[#0080FF]">
                      <div className="bg-white p-4 rounded-full border-4 border-black mb-4 shadow-[4px_4px_0px_0px_#000]">
                        <ImageIcon
                          size={60 * (1 / scale)}
                          color="#0080FF"
                          strokeWidth={2}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 30 * (1 / scale),
                          textTransform: "uppercase",
                        }}
                      >
                        Bấm chọn ảnh
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onClick={(e) => {
                          e.target.value = null;
                        }}
                        onChange={(e) =>
                          handleFileUpload(slot.id, e.target.files[0])
                        }
                      />
                    </label>
                  ) : (
                    <img
                      src={data.imgUrl}
                      alt="User upload"
                      draggable={false}
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: `translate(-50%, -50%) translate(${data.panX}px, ${data.panY}px) rotate(${data.rotate}deg) scale(${data.flipX ? -data.scale : data.scale}, ${data.scale})`,
                        transformOrigin: "center",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                </div>
              );
            })}

            {/* Transparent PNG Frame Overlay */}
            {frame.frameImg && (
              <img
                src={frame.frameImg}
                alt="Frame Overlay"
                draggable={false}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: BASE_WIDTH,
                  height: BASE_HEIGHT,
                  pointerEvents: "none",
                  zIndex: 15,
                }}
              />
            )}

            {/* User Decorations */}
            {decorations.map((dec) => {
              const isActive = activeDecoId === dec.id;
              return (
                <div
                  key={dec.id}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    setActiveDecoId(dec.id);
                    setActiveSlotId(null);
                  }}
                  onPointerMove={(e) => handleDecoPointerMove(e, dec.id)}
                  style={{
                    position: "absolute",
                    left: dec.x,
                    top: dec.y,
                    transform: "translate(-50%, -50%)",
                    cursor: "grab",
                    zIndex: 20,
                    border: isActive ? "8px dashed #0080FF" : "none",
                    padding: 20,
                    // Thêm text-shadow đen để chuẩn style Pop-art
                    textShadow:
                      dec.type === "text" ? "4px 4px 0px #000" : "none",
                  }}
                >
                  {dec.type === "text" ? (
                    <span
                      style={{
                        fontSize: dec.size,
                        color: dec.color,
                        fontWeight: "900",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {dec.text}
                    </span>
                  ) : (
                    <span style={{ fontSize: dec.size }}>{dec.content}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Toolbars - Neo Brutalism styling */}
      <div className="bg-white border-t-8 border-black rounded-t-3xl shadow-[0_-10px_0px_rgba(0,0,0,1)] z-20 w-full p-5 pb-8 flex flex-col shrink-0 transition-all">
        {/* Active Slot Tools */}
        {activeSlotId && slotsData[activeSlotId] && (
          <div className="flex items-center justify-between mb-4 bg-[#E0F0FF] border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_#000]">
            <div className="flex flex-col space-y-4 flex-1 mr-4">
              <div className="flex items-center space-x-3">
                <ZoomIn size={20} className="text-black" strokeWidth={3} />
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={slotsData[activeSlotId].scale}
                  onChange={(e) =>
                    setSlotsData((prev) => ({
                      ...prev,
                      [activeSlotId]: {
                        ...prev[activeSlotId],
                        scale: parseFloat(e.target.value),
                      },
                    }))
                  }
                  className="flex-1 accent-[#FF005C]"
                />
              </div>
              <div className="flex items-center space-x-3">
                <RotateCw size={20} className="text-black" strokeWidth={3} />
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={slotsData[activeSlotId].rotate}
                  onChange={(e) =>
                    setSlotsData((prev) => ({
                      ...prev,
                      [activeSlotId]: {
                        ...prev[activeSlotId],
                        rotate: parseFloat(e.target.value),
                      },
                    }))
                  }
                  className="flex-1 accent-[#0080FF]"
                />
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() =>
                  setSlotsData((prev) => ({
                    ...prev,
                    [activeSlotId]: {
                      ...prev[activeSlotId],
                      flipX: !prev[activeSlotId].flipX,
                    },
                  }))
                }
                className="p-3 bg-white border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:shadow-none"
              >
                <FlipHorizontal size={22} strokeWidth={3} />
              </button>
              <label className="p-3 bg-[#FF005C] text-white border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] cursor-pointer active:translate-y-1 active:shadow-none">
                <ImageIcon size={22} strokeWidth={3} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onClick={(e) => {
                    e.target.value = null;
                  }}
                  onChange={(e) =>
                    handleFileUpload(activeSlotId, e.target.files[0])
                  }
                />
              </label>
            </div>
          </div>
        )}

        {/* Active Text Tools */}
        {activeDecoId &&
          decorations.find((d) => d.id === activeDecoId)?.type === "text" && (
            <div className="flex flex-col mb-4 bg-[#FFEBF2] border-4 border-black p-4 rounded-2xl space-y-4 shadow-[4px_4px_0px_0px_#000]">
              <input
                type="text"
                value={decorations.find((d) => d.id === activeDecoId).text}
                onChange={(e) =>
                  setDecorations((prev) =>
                    prev.map((d) =>
                      d.id === activeDecoId
                        ? { ...d, text: e.target.value }
                        : d,
                    ),
                  )
                }
                className="w-full p-3 border-4 border-black rounded-xl font-black uppercase"
                placeholder="NHẬP CHỮ..."
              />
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() =>
                        setDecorations((prev) =>
                          prev.map((d) =>
                            d.id === activeDecoId ? { ...d, color: c } : d,
                          ),
                        )
                      }
                      className="w-8 h-8 rounded-full border-4 border-black hover:scale-110 transition-transform shadow-[2px_2px_0px_0px_#000]"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <button
                  onClick={() => {
                    setDecorations((prev) =>
                      prev.filter((d) => d.id !== activeDecoId),
                    );
                    setActiveDecoId(null);
                  }}
                  className="p-2 bg-white text-red-600 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#000]"
                >
                  <Trash2 size={24} strokeWidth={3} />
                </button>
              </div>
            </div>
          )}

        {/* Active Sticker Tools */}
        {activeDecoId &&
          decorations.find((d) => d.id === activeDecoId)?.type ===
            "sticker" && (
            <div className="flex items-center justify-between mb-4 bg-gray-100 border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_#000]">
              <div className="flex items-center space-x-3 flex-1 mr-4">
                <ZoomIn size={20} className="text-black" strokeWidth={3} />
                <input
                  type="range"
                  min="50"
                  max="400"
                  step="10"
                  value={decorations.find((d) => d.id === activeDecoId).size}
                  onChange={(e) =>
                    setDecorations((prev) =>
                      prev.map((d) =>
                        d.id === activeDecoId
                          ? { ...d, size: parseFloat(e.target.value) }
                          : d,
                      ),
                    )
                  }
                  className="flex-1 accent-[#FF005C]"
                />
              </div>
              <button
                onClick={() => {
                  setDecorations((prev) =>
                    prev.filter((d) => d.id !== activeDecoId),
                  );
                  setActiveDecoId(null);
                }}
                className="p-2 bg-white text-red-600 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#000]"
              >
                <Trash2 size={24} strokeWidth={3} />
              </button>
            </div>
          )}

        {/* Global Tools */}
        {!activeSlotId && !activeDecoId && (
          <div className="flex justify-around py-2">
            <button
              onClick={() => {
                setDecorations([
                  ...decorations,
                  {
                    id: Date.now(),
                    type: "text",
                    text: "PING BOX",
                    x: BASE_WIDTH / 2,
                    y: BASE_HEIGHT / 2,
                    size: 100,
                    color: "#FF005C",
                  },
                ]);
                setActiveDecoId(Date.now());
              }}
              className="flex flex-col items-center group"
            >
              <div className="w-16 h-16 bg-[#FF005C] text-white border-4 border-black rounded-2xl flex items-center justify-center mb-2 shadow-[4px_4px_0px_0px_#000] group-active:translate-y-1 group-active:shadow-none transition-all">
                <Type size={28} strokeWidth={3} />
              </div>
              <span className="text-sm font-black uppercase">Chữ</span>
            </button>

            <div className="relative group flex flex-col items-center">
              <button className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#0080FF] text-white border-4 border-black rounded-2xl flex items-center justify-center mb-2 shadow-[4px_4px_0px_0px_#000] group-active:translate-y-1 group-active:shadow-none transition-all">
                  <Smile size={28} strokeWidth={3} />
                </div>
                <span className="text-sm font-black uppercase">Sticker</span>
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-white border-4 border-black p-3 rounded-2xl shadow-[8px_8px_0px_0px_#000] flex flex-wrap w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {STICKERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setDecorations([
                        ...decorations,
                        {
                          id: Date.now(),
                          type: "sticker",
                          content: s,
                          x: BASE_WIDTH / 2,
                          y: BASE_HEIGHT / 2,
                          size: 200,
                        },
                      ]);
                    }}
                    className="text-3xl p-2 hover:bg-gray-200 rounded-xl hover:scale-125 transition-transform"
                  >
                    {s}
                  </button>
                ))}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-4 border-r-4 border-black transform rotate-45"></div>
              </div>
            </div>

            <button
              onClick={() => alert("Chức năng đang phát triển!")}
              className="flex flex-col items-center group"
            >
              <div className="w-16 h-16 bg-[#FFC107] text-black border-4 border-black rounded-2xl flex items-center justify-center mb-2 shadow-[4px_4px_0px_0px_#000] group-active:translate-y-1 group-active:shadow-none transition-all">
                <Palette size={28} strokeWidth={3} />
              </div>
              <span className="text-sm font-black uppercase">Nền</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ExportView({ image, onBack, onHome }) {
  const downloadImage = (format) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = `PINGBOX-${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const printImage = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full bg-[#F4F4F4] relative">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100vw; height: 100vh; margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; }
          .print-area img { max-width: 100%; max-height: 100%; object-fit: contain; }
          @page { size: auto; margin: 0mm; }
        }
      `}</style>

      <div className="p-4 flex justify-between items-center border-b-4 border-black bg-white">
        <button
          onClick={onBack}
          className="p-2 border-2 border-black rounded-xl hover:bg-gray-100 shadow-[2px_2px_0px_0px_#000]"
        >
          <ArrowLeft size={20} strokeWidth={3} />
        </button>
        <h2 className="font-black text-xl uppercase tracking-widest">
          Lưu Ảnh
        </h2>
        <button
          onClick={onHome}
          className="p-2 border-2 border-black rounded-xl bg-[#FF005C] text-white shadow-[2px_2px_0px_0px_#000]"
        >
          <X size={20} strokeWidth={3} />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6 flex flex-col items-center">
        <div className="print-area w-full max-w-sm bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-3 mb-10">
          <img
            src={image}
            alt="Final Photo"
            className="w-full h-auto rounded border-2 border-black"
          />
        </div>

        <div className="w-full space-y-4">
          <ButtonPrimary
            style="blue"
            onClick={() => downloadImage("jpg")}
            className="w-full text-lg"
          >
            <Download size={24} className="mr-3" strokeWidth={3} /> TẢI ẢNH HD
          </ButtonPrimary>

          <ButtonPrimary
            style="pink"
            onClick={printImage}
            className="w-full text-lg"
          >
            <Printer size={24} className="mr-3" strokeWidth={3} /> IN TẠI QUẦY
            (CANON)
          </ButtonPrimary>

          <p className="font-bold text-center text-gray-500 mt-4 text-xs uppercase tracking-wide">
            Cảm ơn bạn đã trải nghiệm <br />
            <span className="text-black">PING BOX - Music Box & Mini Mart</span>
          </p>
        </div>
      </div>
    </div>
  );
}
