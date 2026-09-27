import { MorrowMark } from "@/components/Icons";
import { CAMPAIGN } from "@/lib/campaign";

/**
 * An illustrated map of the block around the café. It's a friendly sketch, not a survey: the
 * street grid is invented, and the written address under it is the source of truth.
 *
 * Coordinates are in a 400 × 240 viewBox. The avenues run along x = 132 and y = 120, the
 * side streets along x = 300, y = 48 and y = 196; everything else is blocks.
 *
 * Motion: the loops are CSS (pin bob, pulse, clouds, compass, pond ripple) and SMIL for the
 * scooter and traffic, because SMIL follows a path in viewBox units at any rendered size.
 * GSAP only owns the entrance (animations/scenes/miniMap.ts), on the data-map-* hooks.
 */

/** From off the map's left edge, up the avenue and along to the café's door. */
const ROUTE = "M-12 196H122Q132 196 132 186V130Q132 120 142 120H226";

/** [x, y, width, height]. Edge blocks overhang the viewBox so the city carries on. */
const BLOCKS: ReadonlyArray<readonly [number, number, number, number]> = [
  [-6, -6, 62, 44.5],
  [62, -6, 58, 44.5],
  [144, -6, 66, 44.5],
  [216, -6, 74.5, 44.5],
  [309.5, -6, 96.5, 44.5],
  [-6, 57.5, 126, 50.5],
  [144, 57.5, 146.5, 50.5],
  [309.5, 57.5, 96.5, 50.5],
  [-6, 132, 62, 54.5],
  [62, 132, 58, 54.5],
  [309.5, 132, 96.5, 24],
  [309.5, 162, 96.5, 24.5],
  [-6, 205.5, 126, 40.5],
  [144, 205.5, 146.5, 40.5],
  [309.5, 205.5, 96.5, 40.5],
];

const TREES: ReadonlyArray<readonly [number, number, number]> = [
  [158, 145, 6],
  [176, 170, 7],
  [157, 176, 5],
  [194, 146, 5],
  [206, 174, 5.5],
  [281, 142, 5],
  [280, 177, 6],
];

export function MiniMap() {
  return (
    <svg className="mini-map" viewBox="0 0 400 240" data-mini-map aria-hidden="true" focusable="false">
      <defs>
        <g id="mini-map-cloud">
          <circle cx="14" cy="14" r="9" />
          <circle cx="26" cy="9" r="11" />
          <circle cx="38" cy="15" r="8" />
          <rect x="5" y="14" width="41" height="9" rx="4.5" />
        </g>
      </defs>

      {/* Streets are the background showing through; only the avenues get a centre line. */}
      <path className="mini-map-lane" d="M0 120H400M132 0V240" />

      {BLOCKS.map(([x, y, width, height]) => (
        <rect
          key={`${x},${y}`}
          className="mini-map-block"
          x={x}
          y={y}
          width={width}
          height={height}
          rx="6"
          data-map-block
        />
      ))}
      <rect className="mini-map-cafe" x="212" y="82" width="32" height="26" rx="4" data-map-block />
      <g data-map-block>
        <rect className="mini-map-park" x="144" y="132" width="146.5" height="54.5" rx="8" />
        <ellipse className="mini-map-pond" cx="246" cy="160" rx="22" ry="12" />
        <ellipse className="mini-map-ripple" cx="250" cy="161" rx="6" ry="3" />
        {TREES.map(([cx, cy, r]) => (
          <circle key={`${cx},${cy}`} className="mini-map-tree" cx={cx} cy={cy} r={r} />
        ))}
      </g>
      <text className="mini-map-area" x="57" y="86" textAnchor="middle">
        {CAMPAIGN.area.split(",")[0]}
      </text>

      <path className="mini-map-route-glow" d={ROUTE} data-map-route />
      <path className="mini-map-route" d={ROUTE} data-map-route />

      {/* Traffic keeps to the left. rotate="auto" turns each vehicle to face along its path. */}
      <g className="mini-map-car">
        <animateMotion dur="9s" repeatCount="indefinite" rotate="auto" path="M412 125.5H-12" />
        <rect x="-6" y="-3.5" width="12" height="7" rx="2" />
        <rect className="mini-map-glass" x="1" y="-2.5" width="2.5" height="5" rx="0.8" />
      </g>
      <g className="mini-map-car mini-map-car-alt">
        <animateMotion dur="7s" begin="-3s" repeatCount="indefinite" rotate="auto" path="M136.5 -12V252" />
        <rect x="-6" y="-3.5" width="12" height="7" rx="2" />
        <rect className="mini-map-glass" x="1" y="-2.5" width="2.5" height="5" rx="0.8" />
      </g>

      {/* The scooter rides the route, waits at the door, then fades and starts again. */}
      <g data-map-rider>
        <g className="mini-map-rider">
          <animateMotion
            dur="7s"
            repeatCount="indefinite"
            rotate="auto"
            calcMode="linear"
            keyPoints="0;1;1"
            keyTimes="0;0.72;1"
            path={ROUTE}
          />
          <animate attributeName="opacity" dur="7s" repeatCount="indefinite" values="0;1;1;0;0" keyTimes="0;0.05;0.8;0.9;1" />
          <rect className="mini-map-rider-body" x="-6.5" y="-2.8" width="13" height="5.6" rx="2.8" />
          <path className="mini-map-rider-bar" d="M4 -4.2V4.2" />
          <circle className="mini-map-rider-head" cx="-0.5" cy="0" r="2.7" />
        </g>
      </g>

      {[
        { y: 22, delay: "-8s" },
        { y: 150, delay: "-31s" },
      ].map(({ y, delay }) => (
        <g key={y} className="mini-map-cloud" style={{ animationDelay: delay }}>
          <use className="mini-map-cloud-shadow" href="#mini-map-cloud" x="5" y={y + 8} />
          <use className="mini-map-cloud-puff" href="#mini-map-cloud" y={y} />
        </g>
      ))}

      <g className="mini-map-compass">
        <circle cx="378" cy="24" r="13" />
        <g className="mini-map-needle">
          <path className="mini-map-needle-n" d="M378 13l4 11h-8z" />
          <path className="mini-map-needle-s" d="M378 35l4-11h-8z" />
        </g>
      </g>

      {/* Outer group: GSAP's drop-in. Inner: the CSS bob. One owner per transform. */}
      <g data-map-pin>
        <ellipse className="mini-map-pin-shadow" cx="228" cy="99" rx="7" ry="2.6" />
        <ellipse className="mini-map-pulse" cx="228" cy="99" rx="7" ry="2.6" />
        <g className="mini-map-pin">
          <path d="M228 98c-6-8-13-14-13-26a13 13 0 0 1 26 0c0 12-7 18-13 26z" />
          <MorrowMark x={219} y={63} width={18} height={18} />
        </g>
      </g>
      <g data-map-label>
        <rect className="mini-map-label" x="246" y="60" width="88" height="22" rx="11" />
        <text className="mini-map-label-text" x="290" y="75.5" textAnchor="middle">
          {CAMPAIGN.cafe}
        </text>
      </g>
    </svg>
  );
}
