import { useEffect, useState } from 'react';

const OUTLINE = '#3a2418';
const RED = '#b03235';
const RED_DARK = '#7a1e20';
const RED_HI = '#c75056';
const PAGE = '#f3e8cc';
const PAGE_EDGE = '#d8c8a4';
const PAGE_TEXT = '#b0a078';
const GOLD = '#c8963e';

const VB_W = 54;
const VB_H = 38;

const BASE_HALF_W = 20;
const BASE_BOOK_H = 26;

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function pageCurvePath(
  hinge: number,
  w: number,
  toRight: boolean,
  bow: number,
  bookY: number,
  bookH: number,
) {
  const x1 = toRight ? hinge : hinge - w;
  const x2 = toRight ? hinge + w : hinge;
  const midX = (x1 + x2) / 2;
  const yT = bookY;
  const yB = bookY + bookH;
  return `M ${x1} ${yT} Q ${midX} ${yT - bow}, ${x2} ${yT} L ${x2} ${yB} Q ${midX} ${yB + bow}, ${x1} ${yB} Z`;
}

function PageTextLines({
  xStart,
  xEnd,
  bookY,
  bookH,
  opacity = 1,
  alignRight = false,
}: {
  xStart: number;
  xEnd: number;
  bookY: number;
  bookH: number;
  opacity?: number;
  alignRight?: boolean;
}) {
  if (opacity < 0.05 || xEnd - xStart < 4) return null;
  const ratios = [0.18, 0.28, 0.38, 0.48, 0.58, 0.68, 0.78];
  const usable = xEnd - xStart - 2;
  return (
    <g opacity={opacity}>
      {ratios.map((r, i) => {
        const frac = i % 3 === 0 ? 0.92 : i % 3 === 1 ? 0.78 : 0.86;
        const lineW = usable * frac;
        const lx1 = alignRight ? xEnd - 1 - lineW : xStart + 1;
        const lx2 = alignRight ? xEnd - 1 : xStart + 1 + lineW;
        return (
          <line
            key={i}
            x1={lx1}
            y1={bookY + r * bookH}
            x2={lx2}
            y2={bookY + r * bookH}
            stroke={PAGE_TEXT}
            strokeWidth={0.4}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
}

function FlipPage({
  hinge,
  flipProgress,
  halfW,
  bookY,
  bookH,
}: {
  hinge: number;
  flipProgress: number;
  halfW: number;
  bookY: number;
  bookH: number;
}) {
  const angle = flipProgress * Math.PI;
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  const w = halfW * Math.abs(cosA);
  if (w < 0.4) return null;
  const toRight = cosA > 0;
  const bow = 1.6 * sinA * Math.max(0.35, Math.abs(cosA));
  const path = pageCurvePath(hinge, w, toRight, bow, bookY, bookH);
  const freeX = toRight ? hinge + w : hinge - w;
  const textOpacity = Math.max(0, Math.abs(cosA) - 0.15) * 1.2;

  return (
    <g>
      <path
        d={path}
        fill={PAGE}
        stroke={OUTLINE}
        strokeWidth={0.5}
        strokeLinejoin="round"
      />
      <PageTextLines
        xStart={toRight ? hinge : hinge - w}
        xEnd={toRight ? hinge + w : hinge}
        bookY={bookY}
        bookH={bookH}
        opacity={textOpacity}
        alignRight={!toRight}
      />
      {w > 1.5 && (
        <line
          x1={freeX}
          y1={bookY + 1.2}
          x2={freeX}
          y2={bookY + bookH - 1.2}
          stroke={PAGE_EDGE}
          strokeWidth={0.5}
          strokeLinecap="round"
          opacity={0.7}
        />
      )}
    </g>
  );
}

function FrontCover({
  hinge,
  width,
  showDetails,
  bookY,
  bookH,
}: {
  hinge: number;
  width: number;
  showDetails: boolean;
  bookY: number;
  bookH: number;
}) {
  const rx = Math.min(1.8, width / 2);
  return (
    <g>
      <rect
        x={hinge}
        y={bookY}
        width={width}
        height={bookH}
        rx={rx}
        ry={rx}
        fill={RED}
        stroke={OUTLINE}
        strokeWidth={0.6}
      />
      {width > 3 && (
        <rect
          x={hinge + 0.6}
          y={bookY + 0.6}
          width={width - 1.2}
          height={bookH - 1.2}
          rx={Math.min(1.2, (width - 1.2) / 2)}
          ry={1.2}
          fill="none"
          stroke={RED_HI}
          strokeWidth={0.3}
          opacity={0.7}
        />
      )}
      {showDetails && width > 8 && (
        <g>
          <line
            x1={hinge + 2.5}
            y1={bookY + bookH * 0.32}
            x2={hinge + width - 2.5}
            y2={bookY + bookH * 0.32}
            stroke={GOLD}
            strokeWidth={0.6}
            strokeLinecap="round"
          />
          <line
            x1={hinge + 3.5}
            y1={bookY + bookH * 0.45}
            x2={hinge + width - 3.5}
            y2={bookY + bookH * 0.45}
            stroke={GOLD}
            strokeWidth={0.35}
            strokeLinecap="round"
            opacity={0.8}
          />
          <line
            x1={hinge + 3}
            y1={bookY + bookH * 0.52}
            x2={hinge + width - 3}
            y2={bookY + bookH * 0.52}
            stroke={GOLD}
            strokeWidth={0.35}
            strokeLinecap="round"
            opacity={0.8}
          />
          <line
            x1={hinge + 2.5}
            y1={bookY + bookH * 0.72}
            x2={hinge + width - 2.5}
            y2={bookY + bookH * 0.72}
            stroke={GOLD}
            strokeWidth={0.6}
            strokeLinecap="round"
          />
          <line
            x1={hinge + 1.2}
            y1={bookY + 2}
            x2={hinge + 1.2}
            y2={bookY + bookH - 2}
            stroke={RED_DARK}
            strokeWidth={0.4}
            opacity={0.6}
          />
        </g>
      )}
    </g>
  );
}

export default function ScrollBook() {
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dims, setDims] = useState({ halfW: BASE_HALF_W, bookH: BASE_BOOK_H });

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const syncMobile = () => setIsMobile(mq.matches);
    syncMobile();
    mq.addEventListener('change', syncMobile);

    const randScale = () => 0.7 + Math.random() * 0.6;
    setDims({
      halfW: BASE_HALF_W * randScale(),
      bookH: BASE_BOOK_H * randScale(),
    });
    setMounted(true);
    const update = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      mq.removeEventListener('change', syncMobile);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  if (isMobile) return null;

  const { halfW, bookH } = dims;
  const bookY = (VB_H - bookH) / 2;
  const hingeClosed = (VB_W - halfW) / 2;
  const hingeOpen = VB_W / 2;

  let openness: number;
  let flip: number | null = null;
  if (progress < 0.15) {
    openness = easeInOut(progress / 0.15);
  } else if (progress < 0.85) {
    openness = 1;
    const phase = (progress - 0.15) / 0.7;
    flip = (phase * 16) % 1;
  } else {
    openness = easeInOut((1 - progress) / 0.15);
  }
  openness = Math.max(0, Math.min(1, openness));

  const angle = openness * Math.PI;
  const cosA = Math.cos(angle);
  const rightCoverW = cosA > 0 ? halfW * cosA : 0;
  const leftCoverW = cosA < 0 ? halfW * -cosA : 0;
  const hinge = hingeClosed + (hingeOpen - hingeClosed) * openness;

  const bookLeft = hinge - leftCoverW;
  const bookRight = hinge + halfW;
  const shadowSpan = bookRight - bookLeft;

  const closed = openness < 0.04;

  const rightTextOpacity = Math.min(1, Math.max(0, (openness - 0.3) * 2));
  const leftTextOpacity = Math.min(1, Math.max(0, (leftCoverW - halfW * 0.9) / (halfW * 0.1)));
  const coverBackOpacity = 1 - leftTextOpacity;

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        width: 156,
        height: 110,
        pointerEvents: 'none',
        zIndex: 50,
        opacity: mounted ? 1 : 0,
        transition: 'opacity 300ms',
      }}
    >
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%">
        <ellipse
          cx={(bookLeft + bookRight) / 2}
          cy={bookY + bookH + 1.6}
          rx={shadowSpan * 0.5 + 1}
          ry={1}
          fill="#000"
          opacity={0.15}
        />

        {openness > 0.02 && (
          <rect
            x={hinge - leftCoverW - 0.6}
            y={bookY - 0.4}
            width={halfW + leftCoverW + 1.2}
            height={bookH + 0.8}
            rx={2}
            ry={2}
            fill={RED}
            stroke={OUTLINE}
            strokeWidth={0.5}
          />
        )}

        {openness > 0.02 && (
          <rect
            x={hinge + 0.2}
            y={bookY + 0.2}
            width={halfW - 0.4}
            height={bookH - 0.4}
            rx={1.4}
            ry={1.4}
            fill={PAGE}
            stroke={OUTLINE}
            strokeWidth={0.4}
          />
        )}

        {leftCoverW > 0.3 && (
          <rect
            x={hinge - leftCoverW + 0.2}
            y={bookY + 0.2}
            width={leftCoverW - 0.4}
            height={bookH - 0.4}
            rx={Math.min(1.4, leftCoverW / 2)}
            ry={1.4}
            fill={PAGE}
            stroke={OUTLINE}
            strokeWidth={0.4}
          />
        )}

        {openness > 0.3 && (
          <line
            x1={hinge}
            y1={bookY + 1.2}
            x2={hinge}
            y2={bookY + bookH - 1.2}
            stroke={OUTLINE}
            strokeWidth={0.6}
            strokeLinecap="round"
          />
        )}

        {rightTextOpacity > 0.05 && (
          <PageTextLines
            xStart={hinge}
            xEnd={hinge + halfW}
            bookY={bookY}
            bookH={bookH}
            opacity={rightTextOpacity}
          />
        )}

        {leftTextOpacity > 0.05 && (
          <PageTextLines
            xStart={hinge - halfW}
            xEnd={hinge}
            bookY={bookY}
            bookH={bookH}
            opacity={leftTextOpacity}
            alignRight
          />
        )}

        {rightCoverW > 0.5 && (
          <FrontCover
            hinge={hinge}
            width={rightCoverW}
            showDetails={closed}
            bookY={bookY}
            bookH={bookH}
          />
        )}

        {leftCoverW > 0.5 && coverBackOpacity > 0.05 && (
          <g opacity={coverBackOpacity}>
            <rect
              x={hinge - leftCoverW - 0.4}
              y={bookY - 0.4}
              width={leftCoverW + 0.4}
              height={bookH + 0.8}
              rx={Math.min(2, leftCoverW / 2)}
              ry={2}
              fill={PAGE}
              stroke={OUTLINE}
              strokeWidth={0.5}
            />
            <rect
              x={hinge - leftCoverW + 0.6}
              y={bookY + 0.5}
              width={Math.max(0, leftCoverW - 1.2)}
              height={bookH - 1}
              rx={Math.min(1, leftCoverW / 3)}
              ry={1}
              fill="none"
              stroke={PAGE_EDGE}
              strokeWidth={0.3}
            />
          </g>
        )}

        {flip !== null && (
          <FlipPage
            hinge={hinge}
            flipProgress={flip}
            halfW={halfW}
            bookY={bookY}
            bookH={bookH}
          />
        )}
      </svg>
    </div>
  );
}
