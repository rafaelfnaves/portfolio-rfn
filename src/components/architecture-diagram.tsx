import type { Diagram } from "@/content/projects";

const W = 112;
const H = 36;

/** Point where the segment from a node's center towards (tx, ty) leaves its box. */
function exitPoint(x: number, y: number, tx: number, ty: number) {
  const dx = tx - x;
  const dy = ty - y;
  const scale = Math.min(
    dx === 0 ? Infinity : W / 2 / Math.abs(dx),
    dy === 0 ? Infinity : H / 2 / Math.abs(dy),
  );
  return { x: x + dx * scale, y: y + dy * scale };
}

export function ArchitectureDiagram({
  diagram,
  label,
}: {
  diagram: Diagram;
  label: string;
}) {
  const byId = new Map(diagram.nodes.map((n) => [n.id, n]));

  return (
    <svg
      viewBox="0 0 480 320"
      role="img"
      aria-label={label}
      className="h-auto w-full"
    >
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 8 8"
          refX="7"
          refY="4"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
        >
          <path d="M0 0 8 4 0 8z" className="fill-muted" />
        </marker>
      </defs>
      {diagram.edges.map(([from, to]) => {
        const a = byId.get(from)!;
        const b = byId.get(to)!;
        const start = exitPoint(a.x, a.y, b.x, b.y);
        const end = exitPoint(b.x, b.y, a.x, a.y);
        return (
          <line
            key={`${from}-${to}`}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            className="stroke-line-strong"
            strokeWidth={1.25}
            markerEnd="url(#arrow)"
          />
        );
      })}
      {diagram.nodes.map((n) => (
        <g key={n.id}>
          <rect
            x={n.x - W / 2}
            y={n.y - H / 2}
            width={W}
            height={H}
            rx={4}
            className="fill-bg stroke-line-strong"
          />
          <text
            x={n.x}
            y={n.y}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-strong text-[13px] font-medium"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
