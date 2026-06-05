import React, { useState, useEffect, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkSquare03Icon, ArrowRight02Icon, UserCircleIcon, Logout01Icon } from '@hugeicons/core-free-icons';

// ============================================================================
// THRIVE.CLUB — ONBOARDING FLOW
// Standalone. Screen-by-screen build.
// Screen 1: Upload (this turn)
// More screens to follow.
// ============================================================================

const GOLD = '#69573F';
const GOLD_300 = '#BBB189';
const GOLD_BRIGHT = '#D9C58A';
const BRAND_BLUE = '#3E9EF3';
const INK = '#09090B';
const INK_900 = '#0F0F0F';
const INK_800 = '#18181B';
const INK_700 = '#2F2F32';
const INK_500 = '#525258';
const INK_400 = '#999999';
const INK_200 = '#CCCCCC';
const INK_100 = '#E5E5E5';
const INK_50 = '#F0F0F0';
const WHITE = '#FFFFFF';

// ============================================================================
// APP — screen router
// ============================================================================
const SCREENS = [
  { id: 'upload', label: 'Upload' },
  // future screens will append here
];

export default function ThriveOnboarding() {
  const [screenIdx, setScreenIdx] = useState(0);
  const [simulateProtected, setSimulateProtected] = useState(false);
  const currentScreen = SCREENS[screenIdx];

  const handleAdvance = () => {
    if (screenIdx < SCREENS.length - 1) setScreenIdx(screenIdx + 1);
    // when more screens exist, this will move forward naturally
  };

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: INK_900,
      color: WHITE,
      overflow: 'hidden',
      position: 'relative',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background: ${INK_900}; font-family: 'Manrope', system-ui, sans-serif; }
      `}</style>

      {currentScreen.id === 'upload' && (
        <UploadScreen
          onAdvance={handleAdvance}
          simulateProtected={simulateProtected}
        />
      )}

    </div>
  );
}

// ============================================================================
// DEV NAV
// ============================================================================
const DevNav = ({ screens, currentIdx, onSelect, simulateProtected, onToggleProtected }) => (
  <div style={{
    position: 'absolute',
    bottom: 12, left: '50%', transform: 'translateX(-50%)',
    background: 'rgba(15, 15, 15, 0.85)',
    border: `1px solid ${INK_700}`,
    borderRadius: 999,
    padding: '6px 8px',
    display: 'flex', gap: 4,
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    zIndex: 100,
    fontFamily: 'Manrope, sans-serif',
  }}>
    {screens.map((s, i) => (
      <button
        key={s.id}
        onClick={() => onSelect(i)}
        style={{
          background: i === currentIdx ? GOLD_300 : 'transparent',
          border: 'none',
          padding: '4px 12px',
          borderRadius: 999,
          fontSize: 11,
          fontWeight: 500,
          color: i === currentIdx ? INK : INK_200,
          cursor: 'pointer',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          transition: 'all 0.2s ease',
        }}
      >
        {i + 1}. {s.label}
      </button>
    ))}

    {/* Divider */}
    <div style={{ width: 1, height: 16, background: INK_700, margin: '0 4px' }} />

    {/* PW-protected simulation toggle */}
    <button
      onClick={onToggleProtected}
      title="Simulate next uploaded file as password-protected"
      style={{
        background: simulateProtected ? GOLD_300 : 'transparent',
        border: `1px solid ${simulateProtected ? GOLD_300 : INK_700}`,
        padding: '4px 10px',
        borderRadius: 999,
        fontSize: 10,
        fontWeight: 500,
        color: simulateProtected ? INK : INK_200,
        cursor: 'pointer',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        display: 'flex', alignItems: 'center', gap: 5,
        transition: 'all 0.2s ease',
      }}
    >
      <svg viewBox="0 0 12 12" width="10" height="10" style={{ flexShrink: 0 }}>
        <path d="M4 5 V 3.5 Q 4 1.5 6 1.5 Q 8 1.5 8 3.5 V 5" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <rect x="3" y="5" width="6" height="5" rx="1" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
      Protected
    </button>
  </div>
);

// ============================================================================
// READY SCREEN — "We are ready with your Personalized experience"
// ============================================================================
const ReadyScreen = () => (
  <div style={{
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    animation: 'ready-screen-in 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both',
  }}>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 32,
      width: 547,
    }}>
      {/* Text block */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        textAlign: 'center',
        width: '100%',
      }}>
        <div style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: 32,
          fontWeight: 700,
          lineHeight: '40px',
          letterSpacing: '-0.64px',
          background: 'linear-gradient(0deg, #C1A875, #C1A875), radial-gradient(299.46% 116.44% at -2.24% 25.27%, #F5D08A 0%, #FFE7BB 52.43%, #F5D08A 100%), linear-gradient(74deg, #576265 13.43%, #9EA1A1 26.76%, #848B8A 31.65%, #576265 53.73%, #576265 77.78%, #757A7B 86.51%, #576265 95.7%)',
          backgroundBlendMode: 'color, overlay, normal',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
          whiteSpace: 'nowrap',
        }}>
          Your tax profile is ready
        </div>
        <div style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: 18,
          fontWeight: 500,
          lineHeight: '28px',
          color: '#F0F0F0',
        }}>
          Review, confirm, and file — all in under 30 minutes
        </div>
      </div>

      {/* CTA button — Primary style from component set */}
      <button
        style={{
          height: 48,
          padding: '0 20px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          cursor: 'pointer',
          position: 'relative',
          overflow: 'clip',
          border: '1px solid #826F4C',
          borderRadius: 8,
          background: 'linear-gradient(90deg, #4F4034, #69573F)',
          boxShadow: '0 0 0 1px #2C231C, 0px 1px 2px rgba(8,8,8,0.2), 0px 4px 4px rgba(8,8,8,0.08), inset 0px 1px 1px rgba(212,207,180,0.2), inset 0px 6px 13px rgba(212,207,180,0.12)',
          fontFamily: 'Manrope, sans-serif',
          fontSize: 16,
          fontWeight: 500,
          color: WHITE,
          lineHeight: '18px',
          whiteSpace: 'nowrap',
        }}
      >
        Get started with Thrive
        <HugeiconsIcon icon={ArrowRight02Icon} size={16} color={WHITE} />
      </button>
    </div>
    <style>{`
      @keyframes ready-screen-in {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  </div>
);

// ============================================================================
// SCREEN 1 — UPLOAD
// ============================================================================
const UploadScreen = ({ onAdvance, simulateProtected }) => {
  // States:
  //  'idle'              — no file uploaded yet
  //  'checking'          — file received; running password-protection check (spinner)
  //  'password_required' — file is encrypted; modal is open for password entry
  //  'done'              — file resolved; consent + Upload CTA visible
  //  'finalizing'        — user clicked Upload; brief "Uploading files" beat (~2s)
  //  'parsing'           — scanner card; pages counted 0 → 87 (~10.5s)
  //  'analyzing'         — connected analysis card; status messages cycle every 2400ms
  const [uploadState, setUploadState] = useState('idle');
  const [filename, setFilename] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [pagesRead, setPagesRead] = useState(0);
  const [showDocCards, setShowDocCards] = useState(false);

  const TOTAL_PAGES = 87;

  // After upload starts, run the password-check probe for ~1.6s.
  // Then either open the modal (if protected) or settle to done.
  useEffect(() => {
    if (uploadState !== 'checking') return;
    const t = setTimeout(() => {
      if (simulateProtected) {
        setUploadState('password_required');
      } else {
        setUploadState('done');
      }
    }, 1600);
    return () => clearTimeout(t);
  }, [uploadState, simulateProtected]);

  // Finalization: hold ~2s on the "Uploading files" state, then move to parsing.
  // Finalization: hold ~2s on the "Uploading files" state, then move to parsing.
  // Uses timestamp check to prevent Strict Mode from creating duplicate timers.
  const finalizingStarted = useRef(0);
  useEffect(() => {
    if (uploadState === 'finalizing') {
      const now = Date.now();
      if (now - finalizingStarted.current < 100) return;
      finalizingStarted.current = now;
      setTimeout(() => {
        setPagesRead(1);
        setUploadState('parsing');
      }, 2000);
    }
  }, [uploadState]);

  // Parsing layout phase: 10.5s on the standalone scanner card. The counter
  // runs but does NOT stop here — it keeps going through analyzing too.
  // (See unified counter below.) After 10.5s we transition layout to analyzing.
  useEffect(() => {
    if (uploadState !== 'parsing') return;
    setShowDocCards(true);
    const t = setTimeout(() => setUploadState('analyzing'), 10500);
    return () => clearTimeout(t);
  }, [uploadState]);

  // When the last analysis message appears, wait 4800ms then fade out to the ready screen.
  const [fadingOut, setFadingOut] = useState(false);
  const handleLastMessage = () => {
    setTimeout(() => setFadingOut(true), 4800);
    setTimeout(() => setUploadState('ready'), 4800 + 800);
  };

  // Unified page counter — runs continuously across parsing + analyzing.
  // Uses timestamp-based progress via setInterval, guarded by start-time ref.
  const pageCounterStart = useRef(null);
  useEffect(() => {
    if (uploadState === 'parsing' && !pageCounterStart.current) {
      const TOTAL_SPAN = 10500 + (13 * BEAM_PERIOD);
      pageCounterStart.current = Date.now();
      const id = setInterval(() => {
        const elapsed = Date.now() - pageCounterStart.current;
        const page = Math.min(TOTAL_PAGES, Math.floor(1 + (elapsed / TOTAL_SPAN) * (TOTAL_PAGES - 1)));
        setPagesRead(page);
        if (page >= TOTAL_PAGES) clearInterval(id);
      }, 500);
    }
  }, [uploadState]);

  const handleSimulatedUpload = () => {
    if (uploadState !== 'idle') return;
    setFilename('Kunal_Ahuja_2023_Form1040.pdf');
    setUploadState('checking');
  };

  const handleReset = () => {
    setUploadState('idle');
    setFilename(null);
  };

  const handlePasswordSubmit = () => {
    setUploadState('done');
  };

  const handlePasswordModalClose = () => {
    // If user dismisses the modal without submitting, fall back to remove behavior
    handleReset();
  };

  const handleFinalUpload = () => {
    setUploadState('finalizing');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (uploadState === 'idle') setIsDragOver(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleSimulatedUpload();
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%', height: '100%',
      background: INK_900,
      overflow: 'hidden',
    }}>
      <NoiseGrain />
      <TopNav />

      {uploadState === 'ready' && <ReadyScreen />}

      {/* Centered stack: upload card + PDF list (24px gap) */}
      <div style={{
        position: 'absolute',
        top: (uploadState === 'parsing' || uploadState === 'analyzing') ? 104 : 112,
        left: '50%',
        transform: 'translateX(-50%)',
        animation: 'card-in 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
        zIndex: 5,
        opacity: fadingOut ? 0 : 1,
        transition: 'opacity 0.8s ease',
        pointerEvents: fadingOut || uploadState === 'ready' ? 'none' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 40,
        transition: 'top 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}>
        {(uploadState === 'parsing' || uploadState === 'analyzing') && (
          <div style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: 18,
            fontWeight: 500,
            color: WHITE,
            lineHeight: '24px',
            textAlign: 'center',
            maxWidth: 480,
            animation: 'greeting-in 0.5s ease 0.1s backwards',
          }}>
            Hey Kunal, we're analyzing your return. Give us few seconds to crack the code.
          </div>
        )}

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: uploadState === 'parsing' ? 80 : 24,
          width: '100%',
        }}>
        {uploadState === 'parsing' ? (
            <ParsingCard
              pagesRead={pagesRead}
              totalPages={TOTAL_PAGES}
            />
        ) : uploadState === 'analyzing' ? (
          <AnalyzingCard pagesRead={pagesRead} totalPages={TOTAL_PAGES} onLastMessage={handleLastMessage} />
        ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={uploadState === 'idle' ? handleSimulatedUpload : undefined}
          style={{
            background: INK_900,
            border: `1px solid ${INK_700}`,
            borderRadius: 12,
            padding: 20,
            width: 600,
            display: 'flex', flexDirection: 'column', gap: 16,
            position: 'relative',
            overflow: 'hidden',
            cursor: uploadState === 'idle' ? 'pointer' : 'default',
            boxShadow: '0 0 2px 0 rgba(24, 24, 27, 0.16)',
            transition: 'border-color 0.3s ease',
          }}
        >
          <GoldenGlow active={uploadState !== 'idle'} />

          {/* Heading — hidden during finalizing */}
          {uploadState !== 'finalizing' && (
            <div style={{
              textAlign: 'center',
              display: 'flex', flexDirection: 'column', gap: 6,
              position: 'relative', zIndex: 1,
              animation: 'heading-fade 0.3s ease',
            }}>
              <div style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: 16, fontWeight: 600, color: WHITE,
                lineHeight: '24px',
              }}>
                Upload your previous year 1040 return
              </div>
              <div style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: 14, fontWeight: 300, color: INK_50,
                lineHeight: '20px',
              }}>
                Easy setup, smart planning and filing. All tailored to you.
              </div>
            </div>
          )}

          {/* Dropzone — height shrinks during finalizing */}
          <div style={{
            background: INK_900,
            border: `1px dashed ${isDragOver ? GOLD_300 : INK_700}`,
            borderRadius: 8,
            height: uploadState === 'finalizing' ? 204 : 244,
            position: 'relative',
            overflow: 'hidden',
            transition: 'height 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.2s ease',
          }}>
            <DropzoneGrid />
            {/* Radial darken vignette */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse 280px 122px at 50% 50%, rgba(15,15,15,0.7) 0%, rgba(15,15,15,1) 80%)',
              pointerEvents: 'none',
            }} />

            {/* Content — swaps based on state */}
            <div style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 520,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: uploadState === 'finalizing' ? 20 : 16,
              zIndex: 2,
            }}>
              {uploadState === 'finalizing' ? (
                <>
                  <FileStack hoverable={false} />
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    animation: 'uploading-row-in 0.4s ease',
                  }}>
                    <IndeterminateSpinnerLarge />
                    <span style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: 16, fontWeight: 500, color: WHITE,
                      lineHeight: '24px',
                      whiteSpace: 'nowrap',
                    }}>
                      Uploading files
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div style={{
                    display: 'flex', gap: 4, alignItems: 'center',
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: 14, lineHeight: '20px',
                  }}>
                    <span style={{ color: WHITE }}>Drag and drop your files here or</span>
                    <span style={{ color: BRAND_BLUE }}>click to upload.</span>
                    <InfoIcon />
                  </div>
                  <FileStack />
                  <div style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: 12, fontWeight: 500, color: '#7F7F7F',
                    textAlign: 'center', lineHeight: '16px',
                  }}>
                    Your data is protected with end-to-end encryption,<br />
                    and you're always in control.
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        )}

        {/* PDF list — appears once an upload starts, hidden during finalizing, parsing, analyzing */}
        {uploadState !== 'idle' && uploadState !== 'finalizing' && uploadState !== 'parsing' && uploadState !== 'analyzing' && (
          <PdfListContainer
            filename={filename}
            checking={uploadState === 'checking' || uploadState === 'password_required'}
            done={uploadState === 'done'}
            onRemove={handleReset}
            onUpload={handleFinalUpload}
          />
        )}

        </div>
      </div>

      {/* Doc processing cards — positioned independently so they don't shift with the main stack */}
      {showDocCards && uploadState !== 'ready' && (
        <div style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 6,
          opacity: fadingOut ? 0 : 1,
          transition: 'opacity 0.8s ease',
        }}>
          <DocumentProcessingCards />
        </div>
      )}

      {/* Password modal */}
      {uploadState === 'password_required' && (
        <PasswordModal
          filename={filename}
          onSubmit={handlePasswordSubmit}
          onClose={handlePasswordModalClose}
        />
      )}


      <style>{`
        @keyframes card-in {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes hint-in {
          from { opacity: 0; transform: translateX(-50%) translateY(-4px); }
          to { opacity: 0.7; transform: translateX(-50%) translateY(0); }
        }
        @keyframes heading-fade {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes greeting-in {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes uploading-row-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes footer-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// PIECES
// ============================================================================

const TopNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0,
      height: 64,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 16px',
      zIndex: 20,
    }}>
      <style>{`
        .embossed-btn {
          border: 1px solid transparent;
          background: transparent;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .embossed-btn:hover {
          background: ${INK_900};
        }
        .profile-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 200px;
          background: ${INK_900};
          border: 0.5px solid ${INK_700};
          border-radius: 12px;
          padding: 12px;
          box-shadow: 0 0 2px 0 rgba(134,140,152,0.2);
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 50;
          animation: dropdown-in 0.15s ease;
          overflow: visible;
        }
        .profile-dropdown-item {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0;
          border-radius: 8px;
          font-family: Manrope, sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: ${INK_50};
          line-height: 20px;
          cursor: default;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          margin: -4px;
          padding: 4px;
          border-radius: 8px;
          transition: background 0.12s ease;
        }
        .profile-dropdown-item:hover {
          background: ${INK_700};
        }
        @keyframes dropdown-in {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logos/thrive-logo.svg" alt="Thrive Club" width={102} height={36} />
        </div>
        <div style={{ width: 1, height: 16, background: INK_700 }} />
        <div style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: 14, fontWeight: 500, color: GOLD_300,
          letterSpacing: '0.02em',
        }}>
          Onboarding
        </div>
      </div>

      {/* Profile button + dropdown */}
      <div style={{ position: 'relative' }}>
        <div
          className="embossed-btn"
          onClick={() => setMenuOpen(o => !o)}
          style={{ width: 36, height: 36 }}
        >
          <HugeiconsIcon icon={UserCircleIcon} size={20} color={menuOpen ? WHITE : '#9B9BA1'} />
        </div>

        {menuOpen && (
          <>
            {/* Backdrop to close on outside click */}
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 40 }}
              onClick={() => setMenuOpen(false)}
            />
            <div className="profile-dropdown">
              <div className="profile-dropdown-item">
                <HugeiconsIcon icon={Logout01Icon} size={16} color={INK_50} style={{ flexShrink: 0 }} />
                Signout
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const NoiseGrain = () => (
  <svg
    style={{
      position: 'absolute', inset: 0,
      width: '100%', height: '100%',
      opacity: 0.3,
      mixBlendMode: 'overlay',
      pointerEvents: 'none',
      zIndex: 1,
    }}
  >
    <filter id="onboarding-noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#onboarding-noise)" />
  </svg>
);

const GoldenGlow = ({ active }) => (
  <div style={{
    position: 'absolute',
    bottom: -80, left: '50%', transform: 'translateX(-50%)',
    width: 600, height: 200,
    background: `radial-gradient(ellipse at 50% 100%, ${GOLD_300}${active ? '40' : '20'} 0%, transparent 70%)`,
    pointerEvents: 'none',
    transition: 'all 0.6s ease',
  }} />
);

const DropzoneGrid = () => (
  <svg
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    preserveAspectRatio="none"
    viewBox="0 0 560 244"
  >
    {[1, 81, 161].map(y => (
      <line key={`h-${y}`} x1="12" x2="548" y1={y} y2={y} stroke={INK_700} strokeWidth="0.5" opacity="0.6" />
    ))}
    {[80, 160, 240, 320, 400, 480].map(x => (
      <line key={`v-${x}`} x1={x} x2={x} y1="0" y2="244" stroke={INK_700} strokeWidth="0.5" opacity="0.6" />
    ))}
  </svg>
);

const FileStack = ({ hoverable = true } = {}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ width: 159, height: 120 }}
      onMouseEnter={hoverable ? () => setHovered(true) : undefined}
      onMouseLeave={hoverable ? () => setHovered(false) : undefined}
    >
      <FileSvg hovered={hoverable && hovered} />
    </div>
  );
};

// The full file-stack illustration provided as an asset.
// 156x120 viewBox, three composed PDF cards (left -15°, center, right +15°).
// On hover the two outer files swing outward by an additional 10° each,
// pivoting at their respective "inner-bottom" corners so they fan around
// the center file rather than translating.
const FileSvg = ({ hovered, hideBackFiles = false }) => (
  <svg width="159" height="120" viewBox="0 0 159 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
    {/* LEFT FILE — animates to hover state with measured rigid transform.
        Hidden during parsing state via hideBackFiles. */}
    <g
      style={{
        transformOrigin: '0 0',
        transform: hovered
          ? 'translate(-18.98px, 8.59px) rotate(-10deg)'
          : 'translate(0, 0) rotate(0deg)',
        opacity: hideBackFiles ? 0 : 1,
        transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s ease',
      }}
    >
      <path d="M21.7006 25.8885L57.1371 16.3934C58.014 16.1584 58.3727 16.0662 58.7247 16.059C59.0493 16.0523 59.3728 16.0972 59.6828 16.1935C60.019 16.2979 60.338 16.4866 61.1153 16.9551L85.3752 31.5788C86.1136 32.0238 86.4138 32.2082 86.654 32.4423C86.8755 32.6581 87.0623 32.9068 87.2084 33.1794C87.3668 33.4751 87.4615 33.8144 87.6846 34.6472L103.363 93.1602C103.748 94.5965 104.028 95.6449 104.182 96.4893C104.335 97.328 104.354 97.9223 104.241 98.4521C104.031 99.4398 103.514 100.336 102.763 101.012C102.361 101.374 101.837 101.655 101.034 101.942C100.226 102.231 99.1778 102.512 97.7415 102.897L46.0465 116.749C44.6102 117.134 43.5619 117.414 42.7174 117.568C41.8786 117.721 41.2835 117.74 40.7537 117.627C39.7661 117.417 38.8707 116.899 38.1951 116.149C37.8327 115.747 37.5516 115.223 37.2647 114.42C36.9757 113.612 36.6944 112.563 36.3096 111.127L16.079 35.6255C15.6941 34.1892 15.4137 33.1408 15.2597 32.2964C15.1069 31.4576 15.088 30.8625 15.2006 30.3326C15.4106 29.3453 15.9276 28.4498 16.6777 27.7743C17.0802 27.4119 17.605 27.1306 18.4079 26.8436C19.2162 26.5547 20.2643 26.2734 21.7006 25.8885Z" fill="url(#paint0_linear_664_2077)" stroke="#4C4C4C"/>
    <g filter="url(#filter0_d_664_2077)">
      <path d="M62.5568 27.3637L59.3218 15.2903L87.5792 32.3234L76.356 35.3306C72.5466 36.3514 70.6419 36.8617 68.9882 36.5102C67.5336 36.2011 66.2142 35.4393 65.2192 34.3342C64.0879 33.0778 63.5776 31.1731 62.5568 27.3637Z" fill="url(#paint1_linear_664_2077)"/>
    </g>
    <path d="M59.7778 16.991L59.7665 16.994C59.4344 16.1297 58.5387 15.6119 57.6241 15.7563L57.6213 15.746L59.3221 15.2903L59.7778 16.991Z" fill="#696667"/>
    <path d="M85.8785 32.7789L85.884 32.7996C85.9578 32.7664 86.0345 32.7371 86.1152 32.7155C86.9236 32.4988 87.7549 32.9788 87.9715 33.7872C87.9931 33.8679 88.0061 33.949 88.0142 34.0295L88.0349 34.0239L87.5792 32.3232L85.8785 32.7789Z" fill="#272627"/>
    <rect x="22.0334" y="32.572" width="24.6465" height="1.76046" rx="0.880232" transform="rotate(-15 22.0334 32.572)" fill="#4C4C4C"/>
    <rect x="23.4004" y="37.6735" width="10.5628" height="1.76046" rx="0.880232" transform="rotate(-15 23.4004 37.6735)" fill="#4C4C4C"/>
    <g clipPath="url(#clip0_664_2077)">
      <rect x="40.3159" y="53.1893" width="17.6046" height="10.5628" transform="rotate(-15 40.3159 53.1893)" fill="#292828"/>
      <rect x="57.3208" y="48.6329" width="17.6046" height="10.5628" transform="rotate(-15 57.3208 48.6329)" fill="#383838"/>
      <rect x="43.0498" y="63.3922" width="17.6046" height="10.5628" transform="rotate(-15 43.0498 63.3922)" fill="#383838"/>
      <rect x="60.0544" y="58.8357" width="17.6046" height="10.5628" transform="rotate(-15 60.0544 58.8357)" fill="#484949"/>
      <rect x="45.7834" y="73.595" width="17.6046" height="10.5628" transform="rotate(-15 45.7834 73.595)" fill="#484949"/>
      <rect x="62.7883" y="69.0386" width="17.6046" height="10.5628" transform="rotate(-15 62.7883 69.0386)" fill="#545455"/>
      <rect x="48.5173" y="83.7977" width="17.6046" height="10.5628" transform="rotate(-15 48.5173 83.7977)" fill="#545454"/>
      <rect x="65.5222" y="79.2413" width="17.6046" height="10.5628" transform="rotate(-15 65.5222 79.2413)" fill="#616160"/>
    </g>
    <rect x="40.6221" y="53.3661" width="34.7093" height="41.7512" rx="5.03139" transform="rotate(-15 40.6221 53.3661)" stroke="#323232" strokeWidth="0.5"/>
    <g clipPath="url(#clip1_664_2077)">
      <mask id="mask0_664_2077" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="40" y="70" width="25" height="24">
        <path d="M62.8866 89.0607L47.2072 93.262C46.3716 93.4858 45.5194 93.0148 45.3037 92.2098L40.6171 74.7192C40.4014 73.9142 40.9039 73.0801 41.7395 72.8562L51.9174 70.1291L60.7426 75.0073L64.009 87.1977C64.2247 88.0027 63.7222 88.8368 62.8866 89.0607Z" fill="url(#paint2_linear_664_2077)"/>
      </mask>
      <g mask="url(#mask0_664_2077)">
        <path d="M62.8866 89.0605L47.2072 93.2618C46.3716 93.4857 45.5194 93.0146 45.3037 92.2097L40.6171 74.719C40.4014 73.914 40.9039 73.08 41.7395 72.8561L51.9174 70.1289L60.7426 75.0072L64.009 87.1976C64.2247 88.0026 63.7222 88.8367 62.8866 89.0605Z" fill="url(#paint3_linear_664_2077)"/>
        <g filter="url(#filter1_d_664_2077)">
          <path d="M60.7456 75.0061L56.0693 76.2592C54.778 76.6052 53.4506 75.8388 53.1046 74.5475L51.9204 70.1279L60.7456 75.0061Z" fill="url(#paint4_linear_664_2077)"/>
        </g>
      </g>
      <rect x="40.5767" y="81.3699" width="18.2735" height="10.5628" rx="5.28139" transform="rotate(-15 40.5767 81.3699)" fill="#D5D7DA" fillOpacity="0.2"/>
      <path d="M46.3816 87.3527L45.3875 83.6426L46.71 83.2882C46.9986 83.2109 47.2518 83.1994 47.4696 83.2536C47.6874 83.3079 47.8678 83.4136 48.0108 83.5707C48.1536 83.7266 48.2554 83.9181 48.3162 84.1452C48.3774 84.3734 48.3847 84.5915 48.3381 84.7995C48.2925 85.0059 48.1885 85.1878 48.0261 85.3452C47.8647 85.5011 47.6402 85.6175 47.3528 85.6945L46.4434 85.9382L46.3162 85.4636L47.1749 85.2335C47.3572 85.1846 47.4968 85.1136 47.5935 85.0204C47.6899 84.9259 47.7499 84.8166 47.7736 84.6925C47.7973 84.5684 47.7903 84.4362 47.7528 84.2961C47.7153 84.156 47.6554 84.0388 47.5731 83.9443C47.4908 83.8499 47.3841 83.7872 47.2528 83.7563C47.1228 83.7252 46.9648 83.7345 46.7788 83.7843L46.0759 83.9727L46.9414 87.2027L46.3816 87.3527ZM50.8458 86.1566L49.6448 86.4784L48.6506 82.7682L49.8898 82.4362C50.2533 82.3388 50.5854 82.3294 50.8861 82.4081C51.1864 82.4855 51.4431 82.6439 51.6561 82.8833C51.87 83.1211 52.0285 83.4327 52.1317 83.8179C52.2353 84.2044 52.2536 84.5554 52.1868 84.8711C52.1211 85.1864 51.9755 85.4545 51.7499 85.6755C51.524 85.8952 51.2227 86.0556 50.8458 86.1566ZM50.0735 85.8393L50.684 85.6757C50.9666 85.6 51.1873 85.4839 51.346 85.3274C51.5044 85.1698 51.6029 84.9771 51.6415 84.7492C51.6798 84.5202 51.6597 84.259 51.581 83.9655C51.503 83.6744 51.3904 83.4399 51.243 83.2619C51.0968 83.0836 50.9185 82.9664 50.708 82.9102C50.4975 82.8539 50.2569 82.8621 49.9864 82.9346L49.3415 83.1074L50.0735 85.8393ZM53.3264 85.4919L52.3322 81.7818L54.633 81.1653L54.7621 81.6472L53.0211 82.1137L53.324 83.2441L54.9001 82.8218L55.0288 83.3018L53.4527 83.7242L53.8861 85.3419L53.3264 85.4919Z" fill="white"/>
    </g>
    </g>
    {/* END LEFT FILE */}

    {/* RIGHT FILE — animates to hover state with measured rigid transform.
        Hidden during parsing state via hideBackFiles. */}
    <g
      style={{
        transformOrigin: '0 0',
        transform: hovered
          ? 'translate(23.66px, -18.52px) rotate(10deg)'
          : 'translate(0, 0) rotate(0deg)',
        opacity: hideBackFiles ? 0 : 1,
        transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s ease',
      }}
    >
    <path d="M80.7074 11.9517L116.144 21.4468C117.021 21.6818 117.378 21.7813 117.686 21.951C117.97 22.1075 118.228 22.3082 118.449 22.5466C118.687 22.8051 118.869 23.128 119.308 23.9224L133.006 48.7169C133.423 49.4715 133.591 49.7812 133.682 50.1041C133.766 50.4017 133.803 50.7105 133.793 51.0196C133.783 51.3549 133.695 51.6961 133.472 52.5288L117.793 111.042C117.409 112.478 117.127 113.526 116.838 114.335C116.551 115.137 116.27 115.661 115.908 116.064C115.232 116.814 114.336 117.332 113.348 117.542C112.819 117.654 112.224 117.636 111.386 117.483C110.541 117.329 109.493 117.048 108.056 116.663L56.3615 102.812C54.9252 102.427 53.8771 102.146 53.0687 101.857C52.2659 101.57 51.7411 101.289 51.3386 100.926C50.5883 100.25 50.0717 99.3544 49.8618 98.3668C49.7492 97.837 49.7677 97.2428 49.9206 96.4041C50.0745 95.5596 50.355 94.5112 50.7399 93.0749L70.9705 17.5733C71.3553 16.137 71.6366 15.0889 71.9255 14.2805C72.2125 13.4777 72.4938 12.9529 72.8562 12.5504C73.5317 11.8003 74.4272 11.2833 75.4145 11.0733C75.9444 10.9607 76.5395 10.9795 77.3783 11.1324C78.2228 11.2863 79.2711 11.5668 80.7074 11.9517Z" fill="url(#paint5_linear_664_2077)" stroke="#4C4C4C"/>
    <g filter="url(#filter3_d_664_2077)">
      <path d="M115.352 33.6574L118.587 21.584L134.542 50.4638L123.319 47.4566C119.51 46.4358 117.605 45.9255 116.349 44.7942C115.244 43.7992 114.482 42.4798 114.173 41.0252C113.821 39.3715 114.332 37.4668 115.352 33.6574Z" fill="url(#paint6_linear_664_2077)"/>
    </g>
    <path d="M118.132 23.2848L118.121 23.2817C118.265 22.3671 117.748 21.4708 116.884 21.1387L116.887 21.1283L118.588 21.584L118.132 23.2848Z" fill="#696667"/>
    <path d="M132.842 50.0077L132.836 50.0285C132.917 50.0366 132.998 50.0496 133.079 50.0712C133.887 50.2878 134.367 51.119 134.15 51.9274C134.129 52.0081 134.099 52.0848 134.066 52.1586L134.087 52.1642L134.543 50.4634L132.842 50.0077Z" fill="#272627"/>
    <rect x="77.6538" y="17.9061" width="24.6465" height="1.76046" rx="0.880232" transform="rotate(15 77.6538 17.9061)" fill="#4C4C4C"/>
    <rect x="76.2869" y="23.0076" width="10.5628" height="1.76046" rx="0.880232" transform="rotate(15 76.2869 23.0076)" fill="#4C4C4C"/>
    <g clipPath="url(#clip2_664_2077)">
      <rect x="83.1782" y="44.9025" width="17.6046" height="10.5628" transform="rotate(15 83.1782 44.9025)" fill="#292828"/>
      <rect x="100.183" y="49.4589" width="17.6046" height="10.5628" transform="rotate(15 100.183 49.4589)" fill="#383838"/>
      <rect x="80.4443" y="55.1053" width="17.6046" height="10.5628" transform="rotate(15 80.4443 55.1053)" fill="#383838"/>
      <rect x="97.4492" y="59.6616" width="17.6046" height="10.5628" transform="rotate(15 97.4492 59.6616)" fill="#484949"/>
      <rect x="77.7104" y="65.3081" width="17.6046" height="10.5628" transform="rotate(15 77.7104 65.3081)" fill="#484949"/>
      <rect x="94.7153" y="69.8645" width="17.6046" height="10.5628" transform="rotate(15 94.7153 69.8645)" fill="#545455"/>
      <rect x="74.9766" y="75.5109" width="17.6046" height="10.5628" transform="rotate(15 74.9766 75.5109)" fill="#545454"/>
      <rect x="91.9814" y="80.0673" width="17.6046" height="10.5628" transform="rotate(15 91.9814 80.0673)" fill="#616160"/>
    </g>
    <rect x="83.355" y="45.2087" width="34.7093" height="41.7512" rx="5.03139" transform="rotate(15 83.355 45.2087)" stroke="#323232" strokeWidth="0.5"/>
    <g clipPath="url(#clip3_664_2077)">
      <mask id="mask1_664_2077" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="67" y="62" width="23" height="26">
        <path d="M84.7896 87.2534L69.1102 83.0521C68.2746 82.8282 67.7721 81.9941 67.9878 81.1892L72.6744 63.6985C72.8901 62.8935 73.7423 62.4225 74.5779 62.6464L84.7557 65.3735L89.9595 74.0108L86.6931 86.2012C86.4774 87.0062 85.6251 87.4773 84.7896 87.2534Z" fill="url(#paint7_linear_664_2077)"/>
      </mask>
      <g mask="url(#mask1_664_2077)">
        <path d="M84.7896 87.2533L69.1102 83.052C68.2746 82.8281 67.7721 81.994 67.9878 81.189L72.6744 63.6984C72.8901 62.8934 73.7423 62.4223 74.5779 62.6462L84.7557 65.3734L89.9595 74.0106L86.6931 86.2011C86.4774 87.0061 85.6251 87.4771 84.7896 87.2533Z" fill="url(#paint8_linear_664_2077)"/>
        <g filter="url(#filter4_d_664_2077)">
          <path d="M89.9628 74.0113L85.2865 72.7583C83.9951 72.4123 83.2288 71.0849 83.5748 69.7936L84.759 65.374L89.9628 74.0113Z" fill="url(#paint9_linear_664_2077)"/>
        </g>
      </g>
      <rect x="69.314" y="69.438" width="18.2735" height="10.5628" rx="5.28139" transform="rotate(15 69.314 69.438)" fill="#D5D7DA" fillOpacity="0.2"/>
      <path d="M71.3498 77.5217L72.344 73.8116L73.6664 74.166C73.9551 74.2433 74.1801 74.3599 74.3416 74.5158C74.503 74.6717 74.6064 74.8534 74.6518 75.061C74.6974 75.2674 74.6899 75.4841 74.629 75.7112C74.5679 75.9395 74.4651 76.132 74.3209 76.2888C74.1781 76.4447 73.9971 76.5502 73.7778 76.6054C73.56 76.6597 73.3074 76.6483 73.02 76.5713L72.1106 76.3276L72.2377 75.8529L73.0964 76.083C73.2788 76.1319 73.4352 76.1401 73.5655 76.1078C73.6962 76.0742 73.8028 76.0095 73.8854 75.9139C73.968 75.8182 74.0281 75.7003 74.0656 75.5602C74.1032 75.4201 74.1099 75.2886 74.0859 75.1657C74.0619 75.0427 74.0008 74.9351 73.9025 74.8428C73.8055 74.7508 73.664 74.6798 73.478 74.63L72.7751 74.4417L71.9096 77.6717L71.3498 77.5217ZM75.814 78.7179L74.613 78.3961L75.6071 74.6859L76.8462 75.018C77.2097 75.1154 77.502 75.2733 77.7231 75.4918C77.9445 75.709 78.0876 75.9745 78.1524 76.2883C78.2187 76.6012 78.2002 76.9503 78.097 77.3355C77.9934 77.722 77.8338 78.0352 77.6181 78.2751C77.4035 78.5154 77.1433 78.6748 76.8375 78.7533C76.532 78.8307 76.1909 78.8189 75.814 78.7179ZM75.3038 78.0569L75.9143 78.2205C76.1969 78.2963 76.4461 78.3061 76.6617 78.2499C76.8777 78.1926 77.0594 78.075 77.2068 77.897C77.3545 77.7178 77.4676 77.4815 77.5463 77.188C77.6243 76.8969 77.6439 76.6375 77.6053 76.4097C77.5679 76.1822 77.4721 75.9915 77.3179 75.8375C77.1636 75.6836 76.9513 75.5704 76.6807 75.4979L76.0358 75.3251L75.3038 78.0569ZM78.2946 79.3826L79.2887 75.6724L81.5894 76.2889L81.4603 76.7708L79.7194 76.3043L79.4165 77.4347L80.9925 77.857L80.8639 78.3371L79.2878 77.9148L78.8543 79.5326L78.2946 79.3826Z" fill="white"/>
    </g>
    </g>
    {/* END RIGHT FILE */}

    {/* CENTER FILE — small lateral shift on hover */}
    <g
      style={{
        transformOrigin: '0 0',
        transform: hovered
          ? 'translate(1.16px, 0)'
          : 'translate(0, 0)',
        transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
    >
    <path d="M47.5996 12.5H89.2783C90.3061 12.5 90.7366 12.5036 91.1348 12.6016C91.5 12.6914 91.8489 12.8393 92.167 13.04C92.5124 13.258 92.8127 13.5639 93.5195 14.2979L93.5215 14.3008L93.5283 14.3076L115.85 37.4883C116.526 38.1912 116.808 38.4875 117.008 38.8232C117.191 39.1313 117.327 39.4664 117.408 39.8154C117.497 40.1958 117.5 40.6045 117.5 41.5801V110.4C117.5 112.088 117.5 113.324 117.42 114.3C117.341 115.269 117.185 115.938 116.9 116.497C116.373 117.532 115.532 118.373 114.497 118.9C113.938 119.185 113.269 119.341 112.3 119.42C111.324 119.5 110.088 119.5 108.4 119.5H47.5996C45.9116 119.5 44.6755 119.5 43.7002 119.42C42.7306 119.341 42.0624 119.185 41.5029 118.9C40.4682 118.373 39.6269 117.532 39.0996 116.497C38.8145 115.938 38.6593 115.269 38.5801 114.3C38.5004 113.324 38.5 112.088 38.5 110.4V21.5996L38.501 20.415C38.5048 19.3097 38.5203 18.4316 38.5801 17.7002C38.6593 16.7306 38.8145 16.0624 39.0996 15.5029C39.6269 14.4682 40.4682 13.6269 41.5029 13.0996C42.0624 12.8145 42.7306 12.6593 43.7002 12.5801C44.6755 12.5004 45.9116 12.5 47.5996 12.5Z" fill="url(#paint10_linear_664_2077)" stroke="#4C4C4C"/>
    <g filter="url(#filter6_d_664_2077)">
      <path d="M92 26.2V12L118 39H104.8C100.32 39 98.0794 39 96.3681 38.1281C94.8628 37.3611 93.6389 36.1372 92.8719 34.6319C92 32.9206 92 30.6804 92 26.2Z" fill="url(#paint11_linear_664_2077)"/>
    </g>
    <path d="M92 14C92 12.8954 91.1046 12 90 12H92V14Z" fill="#696667"/>
    <path d="M116 39C117.105 39 118 39.8954 118 41L118 39L116 39Z" fill="#272627"/>
    <rect x="46" y="20" width="28" height="2" rx="1" fill="#4C4C4C"/>
    <rect x="46" y="26" width="12" height="2" rx="1" fill="#4C4C4C"/>
    <g filter="url(#filter7_d_664_2077)">
      <g clipPath="url(#clip4_664_2077)">
        <rect x="60" y="48" width="20" height="12" fill="#292928"/>
        <rect x="80" y="48" width="20" height="12" fill="#383938"/>
        <rect x="60" y="60" width="20" height="12" fill="#383938"/>
        <rect x="80" y="60" width="20" height="12" fill="#494849"/>
        <rect x="60" y="72" width="20" height="12" fill="#494849"/>
        <rect x="80" y="72" width="20" height="12" fill="#555454"/>
        <rect x="60" y="84" width="20" height="12" fill="#545555"/>
        <rect x="80" y="84" width="20" height="12" fill="#616160"/>
      </g>
      <rect x="60.25" y="48.25" width="39.5" height="47.5" rx="5.75" stroke="#323232" strokeWidth="0.5" shapeRendering="crispEdges"/>
    </g>
    <mask id="mask2_664_2077" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="54" y="69" width="22" height="25">
      <path d="M74.2206 93.9998H55.7794C54.7967 93.9998 54 93.2322 54 92.2855V71.714C54 70.7673 54.7967 69.9998 55.7794 69.9998H67.75L76 77.9478V92.2855C76 93.2322 75.2033 93.9998 74.2206 93.9998Z" fill="url(#paint12_linear_664_2077)"/>
    </mask>
    <g mask="url(#mask2_664_2077)">
      <path d="M74.2203 93.9996H55.7792C54.7964 93.9996 53.9998 93.2321 53.9998 92.2853V71.7139C53.9998 70.7671 54.7964 69.9996 55.7792 69.9996H67.7498L75.9998 77.9477V92.2853C75.9998 93.2321 75.2031 93.9996 74.2203 93.9996Z" fill="url(#paint13_linear_664_2077)"/>
      <g filter="url(#filter8_d_664_2077)">
        <path d="M76.0034 77.9477H70.5034C68.9846 77.9477 67.7534 76.7165 67.7534 75.1977V69.9996L76.0034 77.9477Z" fill="url(#paint14_linear_664_2077)"/>
      </g>
    </g>
    <rect x="52" y="79.0005" width="20.7598" height="12" rx="6" fill="#D5D7DA" fillOpacity="0.2"/>
    <path d="M56.8593 87.0005V82.6369H58.4147C58.7542 82.6369 59.0354 82.6986 59.2584 82.8222C59.4814 82.9458 59.6483 83.1148 59.7591 83.3293C59.8699 83.5424 59.9253 83.7824 59.9253 84.0495C59.9253 84.318 59.8692 84.5594 59.757 84.7739C59.6462 84.987 59.4786 85.156 59.2542 85.281C59.0312 85.4046 58.7506 85.4664 58.4126 85.4664H57.343V84.9082H58.3529C58.5674 84.9082 58.7414 84.8712 58.8749 84.7974C59.0084 84.7221 59.1064 84.6198 59.1689 84.4905C59.2314 84.3613 59.2627 84.2143 59.2627 84.0495C59.2627 83.8847 59.2314 83.7384 59.1689 83.6106C59.1064 83.4827 59.0077 83.3826 58.8728 83.3101C58.7393 83.2377 58.5631 83.2015 58.3444 83.2015H57.5177V87.0005H56.8593ZM62.1098 87.0005H60.6972V82.6369H62.1546C62.5821 82.6369 62.9493 82.7242 63.2561 82.8989C63.5629 83.0722 63.798 83.3215 63.9614 83.6468C64.1262 83.9707 64.2085 84.3592 64.2085 84.8123C64.2085 85.2668 64.1254 85.6574 63.9593 85.9842C63.7945 86.3109 63.5558 86.5623 63.2433 86.7384C62.9308 86.9131 62.553 87.0005 62.1098 87.0005ZM61.3556 86.4252H62.0736C62.406 86.4252 62.6823 86.3627 62.9024 86.2377C63.1226 86.1113 63.2874 85.9288 63.3968 85.6901C63.5061 85.4501 63.5608 85.1574 63.5608 84.8123C63.5608 84.4699 63.5061 84.1795 63.3968 83.9408C63.2888 83.7022 63.1276 83.5211 62.9131 83.3975C62.6986 83.2739 62.4323 83.2121 62.1141 83.2121H61.3556V86.4252ZM65.0273 87.0005V82.6369H67.7332V83.2036H65.6856V83.2036H65.6856V83.2036L65.6856 83.2036H65.6856V83.2036H67.7332V83.2036H65.6856V83.2036L65.6856 84.5332H67.5393V85.0978H65.6856V87.0005H65.0273Z" fill="white"/>
    </g>
    {/* END CENTER FILE */}

    <defs>
      <filter id="filter0_d_664_2077" x="57.5613" y="14.4101" width="31.7783" height="24.8516" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="0.880232"/>
        <feGaussianBlur stdDeviation="0.880232"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_664_2077"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_664_2077" result="shape"/>
      </filter>
      <filter id="filter1_d_664_2077" x="49.3897" y="67.4872" width="14.3266" height="11.7158" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="0.220058" dy="0.110029"/>
        <feGaussianBlur stdDeviation="1.37536"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.33 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_664_2077"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_664_2077" result="shape"/>
      </filter>
      <filter id="filter3_d_664_2077" x="112.302" y="20.7038" width="24.0014" height="32.4007" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="0.880232"/>
        <feGaussianBlur stdDeviation="0.880232"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_664_2077"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_664_2077" result="shape"/>
      </filter>
      <filter id="filter4_d_664_2077" x="80.961" y="62.7333" width="11.9726" height="14.1387" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="0.220058" dy="0.110029"/>
        <feGaussianBlur stdDeviation="1.37536"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.33 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_664_2077"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_664_2077" result="shape"/>
      </filter>
      <filter id="filter6_d_664_2077" x="90" y="11" width="30" height="31" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="1"/>
        <feGaussianBlur stdDeviation="1"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_664_2077"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_664_2077" result="shape"/>
      </filter>
      <filter id="filter7_d_664_2077" x="57" y="47" width="46" height="54" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="2"/>
        <feGaussianBlur stdDeviation="1.5"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_664_2077"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_664_2077" result="shape"/>
      </filter>
      <filter id="filter8_d_664_2077" x="64.8784" y="66.9996" width="14.5" height="14.198" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="0.25" dy="0.125"/>
        <feGaussianBlur stdDeviation="1.5625"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.33 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_664_2077"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_664_2077" result="shape"/>
      </filter>
      <linearGradient id="paint0_linear_664_2077" x1="8.3075" y1="28.9596" x2="106.944" y2="104.594" gradientUnits="userSpaceOnUse">
        <stop stopColor="#343434"/>
        <stop offset="1" stopColor="#272627"/>
      </linearGradient>
      <linearGradient id="paint1_linear_664_2077" x1="59.3218" y1="15.2903" x2="71.5213" y2="37.9764" gradientUnits="userSpaceOnUse">
        <stop stopColor="#696667"/>
        <stop offset="1" stopColor="#272627"/>
      </linearGradient>
      <linearGradient id="paint2_linear_664_2077" x1="49.5792" y1="70.7556" x2="55.0469" y2="91.1613" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF7979"/>
        <stop offset="1" stopColor="#E85555"/>
      </linearGradient>
      <linearGradient id="paint3_linear_664_2077" x1="49.5792" y1="70.7554" x2="55.0469" y2="91.1612" gradientUnits="userSpaceOnUse">
        <stop stopColor="#343434"/>
        <stop offset="1" stopColor="#272627"/>
      </linearGradient>
      <linearGradient id="paint4_linear_664_2077" x1="55.4276" y1="69.1882" x2="57.2384" y2="75.9459" gradientUnits="userSpaceOnUse">
        <stop stopColor="#696667"/>
        <stop offset="1" stopColor="#272627"/>
      </linearGradient>
      <linearGradient id="paint5_linear_664_2077" x1="67.5731" y1="7.91469" x2="115.178" y2="122.734" gradientUnits="userSpaceOnUse">
        <stop stopColor="#343434"/>
        <stop offset="1" stopColor="#272627"/>
      </linearGradient>
      <linearGradient id="paint6_linear_664_2077" x1="118.587" y1="21.584" x2="117.809" y2="47.3305" gradientUnits="userSpaceOnUse">
        <stop stopColor="#696667"/>
        <stop offset="1" stopColor="#272627"/>
      </linearGradient>
      <linearGradient id="paint7_linear_664_2077" x1="82.4176" y1="64.747" x2="76.9499" y2="85.1527" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF7979"/>
        <stop offset="1" stopColor="#E85555"/>
      </linearGradient>
      <linearGradient id="paint8_linear_664_2077" x1="82.4176" y1="64.7469" x2="76.9499" y2="85.1526" gradientUnits="userSpaceOnUse">
        <stop stopColor="#343434"/>
        <stop offset="1" stopColor="#272627"/>
      </linearGradient>
      <linearGradient id="paint9_linear_664_2077" x1="88.2663" y1="66.3138" x2="86.4555" y2="73.0715" gradientUnits="userSpaceOnUse">
        <stop stopColor="#696667"/>
        <stop offset="1" stopColor="#272627"/>
      </linearGradient>
      <linearGradient id="paint10_linear_664_2077" x1="38" y1="14" x2="118" y2="124" gradientUnits="userSpaceOnUse">
        <stop stopColor="#343434"/>
        <stop offset="1" stopColor="#272627"/>
      </linearGradient>
      <linearGradient id="paint11_linear_664_2077" x1="92" y1="12" x2="98.7167" y2="40.4818" gradientUnits="userSpaceOnUse">
        <stop stopColor="#696667"/>
        <stop offset="1" stopColor="#272627"/>
      </linearGradient>
      <linearGradient id="paint12_linear_664_2077" x1="65" y1="69.9998" x2="65" y2="93.9998" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF7979"/>
        <stop offset="1" stopColor="#E85555"/>
      </linearGradient>
      <linearGradient id="paint13_linear_664_2077" x1="64.9998" y1="69.9996" x2="64.9998" y2="93.9996" gradientUnits="userSpaceOnUse">
        <stop stopColor="#343434"/>
        <stop offset="1" stopColor="#272627"/>
      </linearGradient>
      <linearGradient id="paint14_linear_664_2077" x1="71.8784" y1="69.9996" x2="71.8784" y2="77.9477" gradientUnits="userSpaceOnUse">
        <stop stopColor="#696667"/>
        <stop offset="1" stopColor="#272627"/>
      </linearGradient>
      <clipPath id="clip0_664_2077">
        <rect x="40.3159" y="53.1893" width="35.2093" height="42.2512" rx="5.28139" transform="rotate(-15 40.3159 53.1893)" fill="white"/>
      </clipPath>
      <clipPath id="clip1_664_2077">
        <rect width="24.6465" height="24.6465" fill="white" transform="translate(36.3699 72.4723) rotate(-15)"/>
      </clipPath>
      <clipPath id="clip2_664_2077">
        <rect x="83.1782" y="44.9025" width="35.2093" height="42.2512" rx="5.28139" transform="rotate(15 83.1782 44.9025)" fill="white"/>
      </clipPath>
      <clipPath id="clip3_664_2077">
        <rect width="24.6465" height="24.6465" fill="white" transform="translate(70.1196 59.629) rotate(15)"/>
      </clipPath>
      <clipPath id="clip4_664_2077">
        <rect x="60" y="48" width="40" height="48" rx="6" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const InfoIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
    <circle cx="8" cy="8" r="6.5" stroke="#7F7F7F" strokeWidth="1.2" />
    <circle cx="8" cy="5" r="0.8" fill="#7F7F7F" />
    <path d="M8 7.5 L8 11.5" stroke="#7F7F7F" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const UploadingState = ({ filename, progress, done }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18,
    animation: 'uploading-in 0.5s ease',
  }}>
    <div style={{
      position: 'relative',
      width: 159, height: 120,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        position: 'absolute', inset: -20,
        background: `radial-gradient(circle, ${GOLD_300}${done ? '40' : '20'} 0%, transparent 60%)`,
        animation: done ? 'none' : 'glow-breathe 2s ease-in-out infinite',
        transition: 'background 0.5s ease',
      }} />
      <FileStack />
    </div>

    <div style={{
      background: INK_900,
      border: `1px solid ${done ? GOLD_300 : INK_700}`,
      borderRadius: 8,
      padding: '8px 12px 8px 10px',
      display: 'flex', alignItems: 'center', gap: 10,
      minWidth: 280, maxWidth: 380,
      transition: 'border-color 0.5s ease',
      boxShadow: done ? `0 0 16px ${GOLD_300}33` : 'none',
    }}>
      <div style={{
        width: 20, height: 22,
        background: '#E94B4B',
        borderRadius: 3,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 7, fontWeight: 700, color: WHITE, letterSpacing: '0.04em' }}>PDF</span>
      </div>
      <div style={{
        flex: 1, minWidth: 0,
        fontFamily: 'Manrope, sans-serif',
        fontSize: 13, color: WHITE, fontWeight: 500,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {filename}
      </div>
      {done ? <DoneCheck /> : <ProgressRing progress={progress} />}
    </div>

    <div style={{
      fontFamily: 'Manrope, sans-serif',
      fontSize: 12, fontWeight: 500,
      color: done ? GOLD_300 : INK_200,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      transition: 'color 0.5s ease',
    }}>
      {done ? 'Uploaded successfully' : `Uploading… ${progress}%`}
    </div>

    <style>{`
      @keyframes uploading-in {
        from { opacity: 0; transform: scale(0.96); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes glow-breathe {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }
    `}</style>
  </div>
);

const ProgressRing = ({ progress }) => {
  const r = 7;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (progress / 100) * circumference;
  return (
    <div style={{ width: 16, height: 16, flexShrink: 0 }}>
      <svg viewBox="0 0 16 16" width="16" height="16">
        <circle cx="8" cy="8" r={r} fill="none" stroke={INK_700} strokeWidth="1.5" />
        <circle
          cx="8" cy="8" r={r} fill="none"
          stroke={GOLD_300} strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 8 8)"
          style={{ transition: 'stroke-dashoffset 0.15s linear' }}
        />
      </svg>
    </div>
  );
};

const DoneCheck = () => (
  <div style={{
    width: 16, height: 16, borderRadius: '50%',
    background: GOLD_300,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
    animation: 'check-pop 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
  }}>
    <svg viewBox="0 0 16 16" width="11" height="11">
      <path d="M3.5 8.5 L7 11.5 L12.5 5" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <style>{`
      @keyframes check-pop {
        from { transform: scale(0); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
    `}</style>
  </div>
);

// ----------------------------------------------------------------------------
// PdfListContainer — sits below the upload card with 24px gap.
// Matches the upload card's outer styling (same border, radius, padding, bg).
// When `done`, expands to include a consent checkbox + Upload CTA row.
// ----------------------------------------------------------------------------
const PdfListContainer = ({ filename, checking, done, onRemove, onUpload }) => {
  const [consented, setConsented] = useState(false);

  return (
    <div
      style={{
        background: INK_900,
        border: `1px solid ${INK_700}`,
        borderRadius: 12,
        padding: 16,
        width: 600,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        animation: 'pdf-list-in 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
    >
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        alignItems: 'center',
      }}>
        <PdfFilePill
          filename={filename}
          checking={checking}
          done={done}
          onRemove={onRemove}
        />
      </div>

      {/* Consent + Upload CTA — appear only once the file is resolved */}
      {done && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          animation: 'consent-block-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}>
          {/* Consent row */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              paddingBottom: 12,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <CustomCheckbox
              checked={consented}
              onChange={() => setConsented(v => !v)}
            />
            <span style={{
              flex: 1,
              fontFamily: 'Manrope, sans-serif',
              fontSize: 12,
              fontWeight: 500,
              color: WHITE,
              lineHeight: '16px',
            }}>
              I agree to share my information for proactive tax planning.
            </span>
          </label>

          {/* Upload CTA */}
          <UploadCta enabled={consented} onClick={onUpload} />
        </div>
      )}

      <style>{`
        @keyframes pdf-list-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes consent-block-in {
          from { opacity: 0; transform: translateY(-4px); max-height: 0; }
          to { opacity: 1; transform: translateY(0); max-height: 160px; }
        }
      `}</style>
    </div>
  );
};

// Custom 20px square checkbox matching Figma styling.
const CustomCheckbox = ({ checked, onChange }) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    onClick={onChange}
    style={{
      width: 20,
      height: 20,
      borderRadius: 6,
      background: checked ? GOLD_300 : INK_700,
      border: `0.5px solid ${checked ? GOLD_300 : '#666666'}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      padding: 0,
      flexShrink: 0,
      transition: 'all 0.18s ease',
    }}
  >
    {checked && (
      <svg viewBox="0 0 16 16" width="12" height="12" style={{ animation: 'check-stroke-in 0.25s ease' }}>
        <path
          d="M3.5 8.5 L7 11.5 L12.5 5"
          fill="none"
          stroke={INK}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
    <style>{`
      @keyframes check-stroke-in {
        from { opacity: 0; transform: scale(0.6); }
        to { opacity: 1; transform: scale(1); }
      }
    `}</style>
  </button>
);

// Gold-gradient Upload CTA. Disabled (opacity 0.2) until consent is checked.
const UploadCta = ({ enabled, onClick }) => (
  <button
    type="button"
    onClick={enabled ? onClick : undefined}
    disabled={!enabled}
    style={{
      position: 'relative',
      width: 120,
      padding: 1, // 1px outer so the inner gradient sits inside the border
      background: 'var(--brand-golden-950, #2c231c)',
      border: 'none',
      borderRadius: 12,
      cursor: enabled ? 'pointer' : 'not-allowed',
      opacity: enabled ? 1 : 0.2,
      transition: 'opacity 0.25s ease, transform 0.15s ease',
      overflow: 'visible',
    }}
    onMouseDown={(e) => { if (enabled) e.currentTarget.style.transform = 'scale(0.98)'; }}
    onMouseUp={(e) => { if (enabled) e.currentTarget.style.transform = 'scale(1)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
  >
    {/* Inner button surface */}
    <div style={{
      position: 'relative',
      width: '100%',
      borderRadius: 11,
      padding: '10px 12px 10px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      background: 'linear-gradient(90deg, #4f4034 0%, #69573f 100%)',
      border: `1px solid ${GOLD}`,
      overflow: 'hidden',
      boxShadow: `
        0 1.128px 2.257px 0 rgba(8, 8, 8, 0.2),
        0 4.514px 4.514px 0 rgba(8, 8, 8, 0.08),
        inset 0 1.128px 1.128px 0 rgba(212, 207, 180, 0.2),
        inset 0 6.771px 13.542px 0 rgba(212, 207, 180, 0.12)
      `,
    }}>
      {/* Top inner highlight stroke */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        background: '#d4cfb4',
        opacity: 0.85,
        pointerEvents: 'none',
      }} />

      {/* Soft glow halo behind text */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 200,
        height: 80,
        background: 'radial-gradient(ellipse at center, rgba(217, 197, 138, 0.35) 0%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(8px)',
      }} />

      <span style={{
        position: 'relative',
        fontFamily: 'Manrope, sans-serif',
        fontSize: 14,
        fontWeight: 400,
        color: WHITE,
        lineHeight: '18px',
        letterSpacing: '-0.32px',
      }}>
        Upload
      </span>
      <svg viewBox="0 0 16 16" width="14" height="14" style={{ position: 'relative', flexShrink: 0 }}>
        <path
          d="M4 8 L12 8 M8 4 L12 8 L8 12"
          fill="none"
          stroke={WHITE}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Bottom inner line accent */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 48,
        right: 48,
        height: 1,
        background: 'linear-gradient(90deg, transparent 0%, rgba(212, 207, 180, 0.4) 50%, transparent 100%)',
        pointerEvents: 'none',
      }} />
    </div>
  </button>
);

const PdfFilePill = ({ filename, checking, done, onRemove }) => (
  <div
    style={{
      background: INK_800,
      border: `1px solid ${INK_700}`,
      borderRadius: 8,
      padding: '6px 12px 6px 8px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      minWidth: 140,
      overflow: 'hidden',
      position: 'relative',
    }}
  >
    {/* PDF icon */}
    <div style={{
      width: 20, height: 20,
      flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg viewBox="0 0 20 20" width="20" height="20">
        <path
          d="M 5 1 H 12 L 17 6 V 17 Q 17 19 15 19 H 5 Q 3 19 3 17 V 3 Q 3 1 5 1 Z"
          fill="#383938"
          stroke="#323232"
          strokeWidth="0.5"
        />
        <path d="M 12 1 L 17 6 L 12 6 Z" fill="#4c4c4c" />
        <rect x="3" y="11" width="11" height="6" rx="2" fill="#E94B4B" opacity="0.9" />
        <text
          x="8.5" y="15.6"
          textAnchor="middle"
          fontFamily="Manrope, sans-serif"
          fontSize="4.3"
          fontWeight="700"
          fill="white"
        >
          PDF
        </text>
      </svg>
    </div>

    {/* Filename */}
    <div style={{
      flex: 1,
      minWidth: 0,
      fontFamily: 'Manrope, sans-serif',
      fontSize: 12,
      fontWeight: 500,
      color: WHITE,
      lineHeight: '16px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }}>
      {filename}
    </div>

    {/* Right slot: indeterminate spinner during checking, × button once resolved */}
    {checking ? (
      <IndeterminateSpinner />
    ) : (
      <button
        onClick={onRemove}
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
          width: 16, height: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          opacity: 0.7,
          transition: 'opacity 0.2s ease',
          animation: 'remove-fade-in 0.3s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.7; }}
        aria-label="Remove file"
      >
        <svg viewBox="0 0 16 16" width="10" height="10">
          <path
            d="M3 3 L13 13 M13 3 L3 13"
            stroke={WHITE}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    )}
    <style>{`
      @keyframes remove-fade-in {
        from { opacity: 0; transform: scale(0.7); }
        to { opacity: 0.7; transform: scale(1); }
      }
    `}</style>
  </div>
);

// Indeterminate spinner — replaces the old ProgressRing usage in the file pill.
// Continuously rotates a short arc, signaling work-in-progress without a percentage.
const IndeterminateSpinner = () => (
  <div style={{ width: 16, height: 16, flexShrink: 0 }}>
    <svg viewBox="0 0 16 16" width="16" height="16">
      <circle cx="8" cy="8" r="6.5" fill="none" stroke={INK_700} strokeWidth="1.5" />
      <g
        style={{
          transformOrigin: '8px 8px',
          animation: 'spin-indeterminate 0.9s linear infinite',
        }}
      >
        <circle
          cx="8" cy="8" r="6.5"
          fill="none"
          stroke={GOLD_300}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 6.5 * 0.25} ${2 * Math.PI * 6.5}`}
        />
      </g>
      <style>{`
        @keyframes spin-indeterminate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </svg>
  </div>
);

// 24px variant for the in-card "Uploading files" status row.
const IndeterminateSpinnerLarge = () => (
  <div style={{ width: 24, height: 24, flexShrink: 0 }}>
    <svg viewBox="0 0 24 24" width="24" height="24">
      <circle cx="12" cy="12" r="10" fill="none" stroke={INK_700} strokeWidth="2" />
      <g
        style={{
          transformOrigin: '12px 12px',
          animation: 'spin-indeterminate 0.9s linear infinite',
        }}
      >
        <circle
          cx="12" cy="12" r="10"
          fill="none"
          stroke={GOLD_300}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 10 * 0.25} ${2 * Math.PI * 10}`}
        />
      </g>
    </svg>
  </div>
);

// ============================================================================
// PARSING CARD — the "Reading files" state.
// Container shrinks to 220×220. Single file illustration shown (back files hidden).
// A glowing gold scanner bar sweeps vertically across the file. At the bottom:
// "Reading files" label + thin progress bar + page counter (e.g. 01/87).
// ============================================================================
const ParsingCard = ({ pagesRead, totalPages }) => (
  <div style={{
    background: INK_900,
    border: `1px solid ${INK_700}`,
    borderRadius: 12,
    padding: 12,
    boxShadow: '0 0 2px 0 rgba(24, 24, 27, 0.16)',
    animation: 'parsing-card-in 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
  }}>
    <GoldenGlow active />
    <LiveScannerCard pagesRead={pagesRead} totalPages={totalPages} />
    <style>{`
      @keyframes parsing-card-in {
        from { opacity: 0; transform: scale(0.92); }
        to { opacity: 1; transform: scale(1); }
      }
    `}</style>
  </div>
);

// The 220×220 dashed inner card with the file illustration, scanner ray,
// and "Reading files" + progress + counter. Used in both the standalone parsing
// state and inside the analyzing layout (where it keeps running).
const LiveScannerCard = ({ pagesRead, totalPages }) => {
  const percent = Math.min(100, Math.max(0, (pagesRead / totalPages) * 100));
  const displayPage = String(pagesRead).padStart(2, '0');
  const displayTotal = String(totalPages).padStart(2, '0');

  return (
    <div style={{
      background: INK,
      border: `1px dashed ${INK_700}`,
      borderRadius: 8,
      width: 220,
      height: 220,
      position: 'relative',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* File illustration */}
      <div style={{
        position: 'absolute',
        top: 'calc(50% - 24px)',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 159,
        height: 120,
      }}>
        <FileSvg hovered={false} hideBackFiles={true} />
        {/* Scanner ray — sweeps vertically across the file, runs continuously */}
        <ScannerRay />
      </div>

      {/* Bottom: status + progress bar + counter */}
      <div style={{
        position: 'absolute',
        left: 8,
        right: 8,
        bottom: 3,
        padding: '0 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}>
        <div style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: 12,
          fontWeight: 400,
          color: INK_200,
          lineHeight: '16px',
        }}>
          Reading files
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <div style={{
            flex: 1,
            height: 4,
            background: INK_700,
            borderRadius: 16,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              top: 0, left: 0,
              height: '100%',
              width: `${percent}%`,
              background: '#a79868',
              borderRadius: 16,
              transition: 'width 0.15s linear',
            }} />
          </div>
          <div style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: 12,
            fontWeight: 500,
            color: WHITE,
            lineHeight: '16px',
            textAlign: 'right',
            width: 36,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {displayPage}/{displayTotal}
          </div>
        </div>
      </div>
    </div>
  );
};

// Scanner ray — matches Figma Scanning 2.0 component.
// 160×160 overlay centered on the file illustration. Contains a soft
// upward glow (12px) and a solid gold gradient line (4px, 120px wide).
const ScannerRay = () => (
  <div style={{
    position: 'absolute',
    left: '50%',
    top: 0,
    transform: 'translateX(-50%)',
    width: 160,
    height: 160,
    pointerEvents: 'none',
    overflow: 'clip',
  }}>
    {/* Animated group that sweeps vertically */}
    <div style={{
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 120,
      height: 16,
      animation: 'scanner-sweep 3.2s ease-in-out infinite',
    }}>
      {/* Soft ray glow above the line */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0, top: 0,
        height: 12,
        background: 'radial-gradient(ellipse 80px 10px at 50% 100%, rgba(152, 135, 90, 0.5) 0%, rgba(130, 111, 76, 0.2) 60%, transparent 100%)',
        filter: 'blur(1px)',
      }} />
      {/* Solid gold gradient line */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0,
        top: 12,
        height: 4,
        borderRadius: 24,
        background: 'linear-gradient(2deg, #826F4C 0%, #98875A 100%)',
        boxShadow: '0 0 8px rgba(152, 135, 90, 0.5)',
      }} />
    </div>
    <style>{`
      @keyframes scanner-sweep {
        0%   { top: 10px; }
        42%  { top: 100px; }
        50%  { top: 100px; }
        92%  { top: 10px; }
        100% { top: 10px; }
      }
    `}</style>
  </div>
);


// ============================================================================
// PASSWORD MODAL
// Appears when an uploaded file is detected as password-protected.
// Faithful to the Figma: lock badge, headline, sub, filename label,
// password input, disabled submit until input has content, close (×) top-right.
// ============================================================================
const PasswordModal = ({ filename, onSubmit, onClose }) => {
  const [password, setPassword] = useState('');
  const canSubmit = password.length > 0;

  // Lock body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Escape closes
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && canSubmit) onSubmit();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [canSubmit, onClose, onSubmit]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        animation: 'modal-overlay-in 0.25s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          background: INK_900,
          border: `1px solid ${INK_700}`,
          borderRadius: 12,
          boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.16), 0 24px 48px -8px rgba(0, 0, 0, 0.6)',
          width: 480,
          padding: '24px 24px 32px',
          animation: 'modal-card-in 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        {/* Close button (top-right) */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 19, right: 19,
            background: INK_700,
            border: 'none',
            borderRadius: 6,
            padding: 4,
            width: 24, height: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#3a3a3e'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = INK_700; }}
        >
          <svg viewBox="0 0 16 16" width="10" height="10">
            <path
              d="M3 3 L13 13 M13 3 L3 13"
              stroke={WHITE}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Main stack */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          width: 432,
          margin: '0 auto',
        }}>
          {/* Lock badge */}
          <LockBadge />

          {/* Headline + sub */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', textAlign: 'center' }}>
            <div style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 20,
              fontWeight: 500,
              color: WHITE,
              lineHeight: '28px',
            }}>
              Your file is password protected.
            </div>
            <div style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 14,
              fontWeight: 400,
              color: INK_50,
              lineHeight: '20px',
            }}>
              Please enter your password to unlock uploaded file.
            </div>
          </div>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
            {/* Filename label + input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ padding: '0 4px' }}>
                <div style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 14,
                  fontWeight: 500,
                  color: WHITE,
                  lineHeight: '20px',
                }}>
                  {filename || 'Form 1040'}
                </div>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your file's password"
                autoFocus
                style={{
                  width: '100%',
                  height: 48,
                  background: INK_800,
                  border: `1px solid ${INK_700}`,
                  borderRadius: 12,
                  padding: '16px 12px',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 14,
                  color: WHITE,
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = GOLD_300; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = INK_700; }}
              />
            </div>

            {/* Submit button */}
            <button
              onClick={canSubmit ? onSubmit : undefined}
              disabled={!canSubmit}
              style={{
                position: 'relative',
                width: '100%',
                height: 48,
                background: INK,
                border: `1px solid ${INK_700}`,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                opacity: canSubmit ? 1 : 0.4,
                transition: 'all 0.2s ease',
                fontFamily: 'Manrope, sans-serif',
                fontSize: 16,
                fontWeight: 400,
                color: WHITE,
                boxShadow: 'inset 0 3px 3px 0 rgba(255, 255, 255, 0.06)',
              }}
              onMouseEnter={(e) => {
                if (canSubmit) e.currentTarget.style.borderColor = GOLD_300;
              }}
              onMouseLeave={(e) => {
                if (canSubmit) e.currentTarget.style.borderColor = INK_700;
              }}
            >
              Submit password
              <svg viewBox="0 0 16 16" width="14" height="14" style={{ flexShrink: 0 }}>
                <path
                  d="M4 8 L12 8 M8 4 L12 8 L8 12"
                  fill="none"
                  stroke={WHITE}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <style>{`
          @keyframes modal-overlay-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes modal-card-in {
            from { opacity: 0; transform: translateY(8px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
};

// Lock badge — 80px circular dark disc with soft gold drop-shadow and lock icon.
const LockBadge = () => (
  <div style={{
    width: 80, height: 80,
    borderRadius: '50%',
    background: INK,
    border: `0.5px solid ${INK_700}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    filter: 'drop-shadow(0 2px 6px rgba(193, 168, 117, 0.25))',
    position: 'relative',
  }}>
    <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
      {/* Shackle */}
      <path
        d="M 13 18 V 13 Q 13 7 20 7 Q 27 7 27 13 V 18"
        stroke={WHITE}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Body */}
      <rect
        x="10" y="18" width="20" height="15"
        rx="3"
        stroke={WHITE}
        strokeWidth="2"
        fill="none"
      />
      {/* Keyhole */}
      <circle cx="20" cy="24" r="1.6" fill={WHITE} />
      <path
        d="M 20 25.5 V 28"
        stroke={WHITE}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

// ============================================================================
// DOCUMENT PROCESSING CARDS
// Sits below the parsing card. Cards spawn sequentially as parsing progresses
// (at ~25%, ~50%, ~75%). Each card shows a rotating form name to convey that
// the system is actively processing distinct document types.
// ============================================================================

// Pool of form names cycled inside each card.
const PROCESSING_FORMS = [
  'Form 1040',
  'Schedule 1',
  'Schedule 2',
  'Schedule A',
  'Schedule B',
  'Form 8889',
  'Form 8959',
  'Form 8960',
  'Form 1040-V',
  'Form W2',
  'Form NJ-1040',
  'Form 1065',
  'Form 1041',
];

const DocumentProcessingCards = () => {
  const [visibleCount, setVisibleCount] = useState(0);

  // Spawn cards on a real-time cadence: first at 800ms, then every 3200ms.
  // Mounted only when parsing begins (parent conditionally renders), so timing
  // starts cleanly from t=0 of the parsing state.
  useEffect(() => {
    const SPAWN_DELAYS = [800, 800 + 3200, 800 + 3200 + 3200]; // 800, 4000, 7200
    const timers = SPAWN_DELAYS.map((delay, i) =>
      setTimeout(() => setVisibleCount(c => Math.max(c, i + 1)), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // Each card starts cycling forms from a different offset so they don't look identical.
  const formOffsets = [0, 4, 8];

  return (
    <div style={{
      display: 'flex',
      gap: 24,
      alignItems: 'flex-start',
      justifyContent: 'center',
      minHeight: 80, // reserves space so card row doesn't push layout when 0 cards visible
      width: 960, // fixed width so cards don't shift when parsing→analyzing changes container width
    }}>
      {[0, 1, 2].map((i) => {
        if (i >= visibleCount) return null;
        return (
          <DocumentProcessingCard
            key={i}
            formOffset={formOffsets[i]}
          />
        );
      })}
    </div>
  );
};

const DocumentProcessingCard = ({ formOffset }) => {
  const [formIndex, setFormIndex] = useState(0);

  // Cycle the form name every 1100ms (slightly slower for more readable rotation
  // now that we have a real slide-in/slide-out animation occupying ~500ms each).
  useEffect(() => {
    const id = setInterval(() => {
      setFormIndex(i => i + 1);
    }, 1100);
    return () => clearInterval(id);
  }, []);

  const currentForm = PROCESSING_FORMS[(formOffset + formIndex) % PROCESSING_FORMS.length];

  return (
    <div style={{
      background: INK_900,
      border: `1px solid ${INK_700}`,
      borderRadius: 12,
      padding: '15px',
      width: 250,
      boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.16)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      animation: 'doc-card-in 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
      position: 'relative',
    }}>
      {/* Top row: file-check icon + label */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <HugeiconsIcon icon={CheckmarkSquare03Icon} size={16} color={INK_200} style={{ flexShrink: 0 }} />
        <div style={{
          fontFamily: 'Inter, Manrope, sans-serif',
          fontSize: 12,
          fontWeight: 400,
          color: INK_200,
          lineHeight: '16px',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>
          Documents Processing
        </div>
      </div>

      {/* Bottom row: Processing label + rotating form name */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <div style={{
          fontFamily: 'Inter, Manrope, sans-serif',
          fontSize: 12,
          fontWeight: 500,
          color: '#B2B2B2',
          lineHeight: '16px',
          whiteSpace: 'nowrap',
        }}>
          Processing
        </div>
        <RotatingFormName form={currentForm} cycleKey={formIndex} />
      </div>

      <style>{`
        @keyframes doc-card-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// Slide-out + slide-in animation for the form name.
// Renders the current value as the "incoming" line (slides up from below),
// and keeps the previous value briefly as the "outgoing" line (slides up and out)
// when cycleKey changes.
const RotatingFormName = ({ form, cycleKey }) => {
  const [outgoing, setOutgoing] = useState(null);
  const prevFormRef = useRef(form);
  const prevKeyRef = useRef(cycleKey);

  useEffect(() => {
    if (cycleKey === prevKeyRef.current) return;
    // Capture the previous value as the outgoing one
    setOutgoing({ form: prevFormRef.current, id: prevKeyRef.current });
    prevFormRef.current = form;
    prevKeyRef.current = cycleKey;
    // Clear the outgoing copy once its animation finishes
    const t = setTimeout(() => setOutgoing(null), 500);
    return () => clearTimeout(t);
  }, [cycleKey, form]);

  const lineStyle = {
    fontFamily: 'Inter, Manrope, sans-serif',
    fontSize: 12,
    fontWeight: 500,
    color: WHITE,
    lineHeight: '16px',
    whiteSpace: 'nowrap',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
  };

  return (
    <div style={{
      flex: 1,
      minWidth: 0,
      position: 'relative',
      height: 16,
      overflow: 'hidden',
    }}>
      {/* Outgoing (previous) — slides UP and out, fades */}
      {outgoing && (
        <div
          key={`out-${outgoing.id}`}
          style={{
            ...lineStyle,
            animation: 'form-name-slide-out 0.45s cubic-bezier(0.4, 0, 0.2, 1) forwards',
          }}
        >
          {outgoing.form}
        </div>
      )}
      {/* Incoming (current) — slides UP from below, fades in */}
      <div
        key={`in-${cycleKey}`}
        style={{
          ...lineStyle,
          animation: 'form-name-slide-in 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        }}
      >
        {form}
      </div>

      <style>{`
        @keyframes form-name-slide-out {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(-16px); opacity: 0; }
        }
        @keyframes form-name-slide-in {
          from { transform: translateY(16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// Small file-with-check icon used in the top-left of each processing card.
const FileCheckIcon = () => (
  <div style={{
    width: 16,
    height: 16,
    flexShrink: 0,
    position: 'relative',
  }}>
    {/* Subtle dark blur square behind the icon for visual depth */}
    <div style={{
      position: 'absolute',
      left: 0, top: 0,
      width: 10, height: 10,
      background: INK_700,
      borderRadius: 2,
    }} />
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" style={{ position: 'relative' }}>
      {/* File outline */}
      <path
        d="M 4 1.5 H 9.5 L 13.5 5.5 V 13 Q 13.5 14.5 12 14.5 H 4 Q 2.5 14.5 2.5 13 V 3 Q 2.5 1.5 4 1.5 Z"
        fill="none"
        stroke={INK_200}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Folded corner */}
      <path
        d="M 9.5 1.5 V 5.5 H 13.5"
        fill="none"
        stroke={INK_200}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Check mark inside */}
      <path
        d="M 5.5 10 L 7 11.5 L 10.5 8"
        fill="none"
        stroke={GOLD_300}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

// ============================================================================
// ANALYZING CARD — the post-parsing analysis state.
// Wide container with:
//   - Scanner card on the left (live counter + ray)
//   - Horizontal running beam line
//   - Perspective card stack (cards flow up from bottom, shrinking as they recede)
//   - Two notification cards on the right with curved connectors
// ============================================================================

const PROFILE_MESSAGES = [
  'Reviewing your filing history',
  'Mapping your income and financial profile',
  'Organizing your tax and investment details',
  'Understanding your income across sources',
  'Reviewing your equity compensation and investments',
  'Structuring your cross-border tax profile',
  'Evaluating your current tax position',
];
const STRATEGY_MESSAGES = [
  'Identifying opportunities to lower your tax bill',
  'Evaluating deductions and credits relevant to you',
  'Reviewing retirement and investment strategies',
  'Analyzing opportunities across your income sources',
];
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const ANALYSIS_MESSAGES = [
  ...shuffleArray([...PROFILE_MESSAGES, ...STRATEGY_MESSAGES]),
  'Personalizing your Thrive tax profile',
  'Tailoring strategies to your financial situation',
  'Preparing your personalized tax recommendations',
];

const BEAM_PERIOD = 2800;

const AnalyzingCard = ({ pagesRead, totalPages, onLastMessage }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const lastMessageFired = useRef(false);

  useEffect(() => {
    if (messageIndex >= ANALYSIS_MESSAGES.length - 1) return;
    const id = setInterval(() => {
      setMessageIndex(i => {
        const next = i + 1;
        if (next >= ANALYSIS_MESSAGES.length - 1) clearInterval(id);
        return next;
      });
    }, BEAM_PERIOD);
    return () => clearInterval(id);
  }, [messageIndex >= ANALYSIS_MESSAGES.length - 1]);

  useEffect(() => {
    if (messageIndex >= ANALYSIS_MESSAGES.length - 1 && !lastMessageFired.current) {
      lastMessageFired.current = true;
      onLastMessage?.();
    }
  }, [messageIndex, onLastMessage]);

  const currentMessage = ANALYSIS_MESSAGES[
    Math.min(messageIndex, ANALYSIS_MESSAGES.length - 1)
  ];

  return (
    <div style={{
      background: INK_900,
      border: `1px solid ${INK_700}`,
      borderRadius: 12,
      padding: 12,
      boxShadow: '0 0 2px 0 rgba(24, 24, 27, 0.16)',
      position: 'relative',
      width: 960,
      height: 244,
      overflow: 'clip',
      animation: 'analyzing-card-in 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
    }}>
      <GoldenGlow active />
      {/* Scanner card — left-aligned with 12px padding on left, top, bottom */}
      <div style={{ position: 'absolute', left: 12, top: 12 }}>
        <LiveScannerCard pagesRead={pagesRead} totalPages={totalPages} />
      </div>

      {/* Horizontal running beam — connects scanner to card stack */}
      <div style={{
        position: 'absolute',
        left: 232,
        top: '50%',
        transform: 'translateY(-50%)',
      }}>
        <RunningBeamLine />
      </div>

      {/* Perspective card stack — cards flow up from bottom */}
      <div style={{
        position: 'absolute',
        left: 308,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 280,
        height: 220,
        overflow: 'clip',
      }}>
        <PerspectiveCardStack message={currentMessage} cycleKey={messageIndex} />
      </div>

      {/* Running-line connectors to notification cards */}
      <svg
        viewBox="0 0 76 157"
        style={{
          position: 'absolute',
          left: 588,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 76,
          height: 157,
          pointerEvents: 'none',
          overflow: 'visible',
        }}
        fill="none"
      >
        <defs>
          <linearGradient id="paint0_line" x1="76" y1="0" x2="0" y2="81.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#666666" stopOpacity="0.1" />
            <stop offset="1" stopColor="#666666" />
          </linearGradient>
          <linearGradient id="paint1_line" x1="76" y1="156.457" x2="7.28262" y2="75.7957" gradientUnits="userSpaceOnUse">
            <stop stopColor="#666666" stopOpacity="0.1" />
            <stop offset="1" stopColor="#666666" />
          </linearGradient>
          <filter id="beam-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Top connector — static line */}
        <path
          id="curve-top"
          d="M0 79.5H32C34.2091 79.5 36 77.7091 36 75.5V4.5C36 2.29086 37.7909 0.5 40 0.5H76"
          stroke="url(#paint0_line)"
        />
        {/* Top connector — running beam */}
        <circle r="3" fill="#98875A" filter="url(#beam-glow)" opacity="0">
          <animateMotion dur="3.2s" repeatCount="indefinite" keyTimes="0;1" keySplines="0.4 0 0.2 1" calcMode="spline">
            <mpath href="#curve-top" />
          </animateMotion>
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur="3.2s" repeatCount="indefinite" />
        </circle>

        {/* Bottom connector — static line */}
        <path
          id="curve-bottom"
          d="M0 80H32C34.2091 80 36 81.7909 36 84V152C36 154.209 37.7909 156 40 156H76"
          stroke="url(#paint1_line)"
        />
        {/* Bottom connector — running beam */}
        <circle r="3" fill="#98875A" filter="url(#beam-glow)" opacity="0">
          <animateMotion dur="3.2s" repeatCount="indefinite" begin="0.4s" keyTimes="0;1" keySplines="0.4 0 0.2 1" calcMode="spline">
            <mpath href="#curve-bottom" />
          </animateMotion>
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur="3.2s" repeatCount="indefinite" begin="0.4s" />
        </circle>
      </svg>

      {/* Right notification cards */}
      <NotificationCard
        label="Building your tax profile"
        doneLabel="Your tax profile is ready"
        top={16}
        right={16}
        delay={0}
        done={messageIndex >= ANALYSIS_MESSAGES.length - 3}
      />
      <NotificationCard
        label="Identifying saving strategies"
        doneLabel="Personalized strategies ready"
        bottom={16}
        right={16}
        delay={0.3}
        done={messageIndex >= ANALYSIS_MESSAGES.length - 1}
      />

      <style>{`
        @keyframes analyzing-card-in {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

// Notification card — positioned absolutely on the right side.
// In-progress: green blinker dot + shimmer text.
// Done: green checkmark in styled container + solid white text + inset shadows.
const NotificationCard = ({ label, doneLabel, top, bottom, right, left, delay, done }) => (
  <div style={{
    position: 'absolute',
    ...(top != null ? { top } : {}),
    ...(bottom != null ? { bottom } : {}),
    ...(right != null ? { right } : {}),
    ...(left != null ? { left } : {}),
    width: 280,
    background: INK_900,
    border: `0.5px solid ${INK_700}`,
    borderRadius: 12,
    padding: 12,
    display: 'flex',
    gap: 8,
    alignItems: 'flex-start',
    animation: `notif-card-in 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s both`,
    boxShadow: done ? 'inset 0px 3px 3px 0px rgba(255, 255, 255, 0.1)' : 'none',
    transition: 'padding 0.4s ease, box-shadow 0.4s ease',
  }}>
    {done ? (
      <div style={{
        width: 24, height: 24,
        borderRadius: 6,
        background: '#095c37',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        position: 'relative',
        boxShadow: '0px 0.564px 0.564px rgba(8, 8, 8, 0.2), 0px 2.257px 1.128px rgba(8, 8, 8, 0.08)',
      }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          boxShadow: 'inset 0px 0.564px 0.564px 0px rgba(255, 255, 255, 0.2), inset 0px 3.385px 6.771px 0px rgba(255, 255, 255, 0.12)',
          pointerEvents: 'none',
        }} />
      </div>
    ) : (
      <div style={{
        width: 24, height: 24,
        borderRadius: 6,
        background: '#053321',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        position: 'relative',
      }}>
        <div style={{
          width: 20, height: 20,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            width: 14, height: 14,
            borderRadius: '50%',
            background: 'rgba(52, 211, 153, 0.3)',
            animation: 'blinker-pulse 2s ease-in-out infinite',
          }} />
          <div style={{
            width: 7.5, height: 7.5,
            borderRadius: '50%',
            background: '#34D399',
            boxShadow: '0 0 6px rgba(52, 211, 153, 0.4)',
            animation: 'blinker-glow 2s ease-in-out infinite',
            position: 'relative',
          }} />
        </div>
      </div>
    )}
    <div style={{
      fontFamily: 'Manrope, sans-serif',
      fontSize: 16,
      fontWeight: 500,
      lineHeight: '24px',
      flex: 1,
      ...(done ? { color: WHITE } : {
        background: 'linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.9) 40%, rgba(255,255,255,0.4) 80%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: 'text-shimmer 2.5s ease-in-out infinite',
      }),
    }}>
      {done && doneLabel ? doneLabel : label}
    </div>
    <style>{`
      @keyframes notif-card-in {
        from { opacity: 0; transform: translateX(12px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes blinker-pulse {
        0%, 100% { transform: scale(1); opacity: 0.3; }
        50% { transform: scale(1.5); opacity: 0; }
      }
      @keyframes blinker-glow {
        0%, 100% { box-shadow: 0 0 6px rgba(52, 211, 153, 0.4); }
        50% { box-shadow: 0 0 12px rgba(52, 211, 153, 0.8); }
      }
      @keyframes text-shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
  </div>
);

// Horizontal running beam line
const RunningBeamLine = () => (
  <div style={{
    position: 'relative',
    width: 76,
    height: 4,
    overflow: 'clip',
    flexShrink: 0,
  }}>
    <div style={{
      position: 'absolute',
      top: 1,
      left: 0,
      width: '100%',
      height: 2,
      background: 'linear-gradient(90deg, rgba(152, 135, 90, 0.6) 0%, rgba(152, 135, 90, 0) 97.5%)',
      borderRadius: '16px 0 0 16px',
    }} />
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: 20,
      height: 2,
      marginTop: 1,
      borderRadius: '16px 0 0 16px',
      background: 'linear-gradient(90deg, #98875A 0%, rgba(152, 135, 90, 0) 97.5%)',
      animation: `beam-run ${BEAM_PERIOD}ms cubic-bezier(0.4, 0, 0.2, 1) infinite`,
    }} />
    <style>{`
      @keyframes beam-run {
        0%   { left: -20px; opacity: 0; }
        10%  { opacity: 1; }
        85%  { opacity: 1; }
        100% { left: 76px; opacity: 0; }
      }
    `}</style>
  </div>
);

const PerspectiveCardStack = ({ message, cycleKey }) => {
  const MAX_VISIBLE = 4;
  const visibleMessages = [];
  for (let i = Math.max(0, cycleKey - (MAX_VISIBLE - 1)); i <= cycleKey; i++) {
    const msg = ANALYSIS_MESSAGES[Math.min(i, ANALYSIS_MESSAGES.length - 1)];
    visibleMessages.push({ msg, key: i });
  }

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
    }}>
      {visibleMessages.map((item, idx) => {
        const isActive = idx === visibleMessages.length - 1;
        const depth = visibleMessages.length - 1 - idx;

        const scale = isActive ? 1.0 : Math.max(0.80, 1 - depth * 0.07);
        const yOffset = isActive ? 0 : -(10 + depth * 2);
        const opacity = isActive ? 1.0 : Math.max(0.15, 1 - depth * 0.35);

        return (
          <div
            key={`stack-${item.key}`}
            style={{
              position: 'absolute',
              left: '50%',
              top: `calc(50% + ${yOffset}px)`,
              transform: `translate(-50%, -50%) scale(${scale})`,
              transformOrigin: 'center center',
              width: 280,
              background: INK_800,
              border: `1px solid ${INK_700}`,
              borderRadius: 12,
              padding: 16,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              boxShadow: '0 0 2px 0 rgba(24, 24, 27, 0.16)',
              opacity,
              zIndex: visibleMessages.length - depth,
              pointerEvents: isActive ? 'auto' : 'none',
              overflow: 'clip',
              transition: 'transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), top 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)',
              ...(isActive ? {
                animation: 'perspective-card-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
              } : {}),
            }}
          >
            <HugeiconsIcon icon={CheckmarkSquare03Icon} size={24} color={INK_200} style={{ flexShrink: 0 }} />
            <div style={{
              flex: 1,
              fontFamily: 'Manrope, sans-serif',
              fontSize: 16,
              fontWeight: 500,
              color: WHITE,
              lineHeight: '24px',
              overflow: 'hidden',
            }}>
              {item.msg}
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes perspective-card-in {
          0%   { opacity: 0; transform: translate(-50%, calc(-50% + 40px)) scale(0.92); }
          40%  { opacity: 0.7; }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </div>
  );
};

const AnalysisFileCheckIcon = ({ size = 28 }) => (
  <div style={{
    width: size, height: size,
    flexShrink: 0,
    position: 'relative',
  }}>
    <div style={{
      position: 'absolute',
      left: 0, top: 0,
      width: size * 0.536, height: size * 0.536,
      background: INK,
      borderRadius: 3 * (size / 28),
    }} />
    <svg viewBox="0 0 28 28" width={size} height={size} fill="none" style={{ position: 'relative' }}>
      <path
        d="M 7 3 H 17 L 24 10 V 23 Q 24 25.5 21.5 25.5 H 7 Q 4.5 25.5 4.5 23 V 5.5 Q 4.5 3 7 3 Z"
        fill="none"
        stroke={INK_200}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M 17 3 V 10 H 24"
        fill="none"
        stroke={INK_200}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M 9 17 L 12 20 L 19 13"
        fill="none"
        stroke={GOLD_300}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);
