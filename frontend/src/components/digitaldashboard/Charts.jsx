export function MiniLineChart({ data, color = "#3B82F6", width = 220, height = 70 }) {
  if (!data?.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const points = data.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * (height - 10) - 5;
    return [x, y];
  });
  const path = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const area = `${path} L${width},${height} L0,${height} Z`;
  const gradId = `grad-${color.replace("#", "")}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === points.length - 1 ? 4 : 0} fill={color} />
      ))}
    </svg>
  );
}

export function MiniBarChart({ data, color = "#EC4899", width = 220, height = 70 }) {
  if (!data?.length) return null;
  const max = Math.max(...data);
  const barWidth = width / data.length - 6;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
      {data.map((v, i) => {
        const h = (v / max) * (height - 6);
        const x = i * (width / data.length) + 3;
        const y = height - h;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={Math.max(barWidth, 4)}
            height={h}
            rx="3"
            fill={color}
            opacity={0.5 + (i / data.length) * 0.5}
          />
        );
      })}
    </svg>
  );
}

export function TrendLineChart({ data, labelKey = "month", valueKey = "value", color = "#8B5CF6" }) {
  const width = 640;
  const height = 220;
  const padding = 30;
  const values = data.map((d) => d[valueKey]);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = (width - padding * 2) / (data.length - 1);

  const points = data.map((d, i) => {
    const x = padding + i * step;
    const y = height - padding - ((d[valueKey] - min) / range) * (height - padding * 2);
    return [x, y];
  });
  const path = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const area = `${path} L${points[points.length - 1][0]},${height - padding} L${points[0][0]},${height - padding} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      <defs>
        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <line
          key={f}
          x1={padding}
          x2={width - padding}
          y1={padding + f * (height - padding * 2)}
          y2={padding + f * (height - padding * 2)}
          stroke="currentColor"
          className="text-gray-200 dark:text-white/5"
          strokeWidth="1"
        />
      ))}
      <path d={area} fill="url(#trendGrad)" />
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill={color} className="drop-shadow" />
      ))}
      {data.map((d, i) => (
        <text
          key={i}
          x={padding + i * step}
          y={height - 6}
          fontSize="10"
          textAnchor="middle"
          className="fill-gray-400 dark:fill-gray-500"
        >
          {d[labelKey]}
        </text>
      ))}
    </svg>
  );
}

const DONUT_COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F97316", "#EC4899"];

export function DonutChart({ data, size = 140, thickness = 20 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-gray-100 dark:text-white/5"
          strokeWidth={thickness}
        />
        {data.map((d, i) => {
          const fraction = d.value / total;
          const dash = fraction * circumference;
          const gap = circumference - dash;
          const circle = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={d.color || DONUT_COLORS[i % DONUT_COLORS.length]}
              strokeWidth={thickness}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += dash;
          return circle;
        })}
      </g>
    </svg>
  );
}
