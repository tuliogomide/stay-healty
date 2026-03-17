import {
  Circle,
  Fill,
  Group,
  Path,
  PathOp,
  Shader,
  Skia,
  SweepGradient,
  type Vector,
} from "@shopify/react-native-skia";
import React, { useEffect, useMemo } from "react";
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { frag } from "../components";

// --- Helpers ---
const fromCircle = (center: Vector, r: number) => {
  "worklet";
  return Skia.XYWHRect(center.x - r, center.y - r, r * 2, r * 2);
};

const source = frag`
uniform shader image;
uniform vec2 head;
uniform float progress;
uniform vec4 color;
uniform float r;

vec2 rotate(in vec2 coord, in float angle, vec2 origin) {
  vec2 coord1 = coord - origin;
  vec2 rotated = coord1 * mat2( cos(angle), -sin(angle),
                       sin(angle),  cos(angle));
  return rotated + origin;
 }

vec4 main(vec2 xy) {
  float d = distance(xy, head);
  vec2 rotated = rotate(xy, ${-Math.PI} - progress * ${2 * Math.PI}, head);
  if (rotated.y > head.y) {
    return vec4(0, 0, 0, 0);
  }
  if (d > r) {
    return vec4(0, 0, 0, smoothstep(14, 0, d));
  }
  if (progress > 1) {
    return color;
  }
  return image.eval(head);
}
`;

interface RingProps {
  center: Vector;
  strokeWidth: number;
  ring: {
    size: number;
    background: string;
    totalProgress: number;
    colors: string[];
  };
}

export const Ring = ({
  center,
  strokeWidth,
  ring: { size, background, totalProgress, colors },
}: RingProps) => {
  // 1. Para garantir a transição inicial, começamos o sharedValue em 0
  // Se você preferir que ele já apareça no valor atual sem animar no início, 
  // mude para useSharedValue(totalProgress)
  const animatedProgress = useSharedValue(0); 
  const r = size / 2 - strokeWidth / 2;

  // 2. Este useEffect garante a transição inicial (mount) e as atualizações (update)
  useEffect(() => {
    animatedProgress.value = withTiming(totalProgress, { duration: 1500 });
  }, [totalProgress, animatedProgress]);

  const clip = useMemo(() => {
    const outer = Skia.Path.Make();
    outer.addCircle(center.x, center.y, size / 2);
    const inner = Skia.Path.Make();
    inner.addCircle(center.x, center.y, size / 2 - strokeWidth);
    return Skia.Path.MakeFromOp(outer, inner, PathOp.Difference) || outer;
  }, [center.x, center.y, size, strokeWidth]);

  const path = useDerivedValue(() => {
    const p = Skia.Path.Make();
    const current = animatedProgress.value;

    if (current <= 0.001) return p;

    const fullRevolutions = Math.floor(current);
    for (let i = 0; i < fullRevolutions; i++) {
      p.addCircle(center.x, center.y, r);
    }

    const rest = current % 1;
    if (rest > 0.001 || (current > 0 && current < 1)) {
      p.addArc(fromCircle(center, r), 0, 360 * (rest || current));
    }
    return p;
  });

  const matrix = useDerivedValue(() => {
    const m = Skia.Matrix();
    const angle = (animatedProgress.value % 1) * 2 * Math.PI;
    m.translate(center.x, center.y);
    m.rotate(angle);
    m.translate(-center.x, -center.y);
    return m;
  });

  const uniforms = useDerivedValue(() => ({
    head: path.value.getLastPt(),
    r: strokeWidth / 2,
    progress: animatedProgress.value,
    color: [...Skia.Color(colors[1])],
  }));

  // Controla a visibilidade para não aparecer o "pingo" quando estiver zerado
  const layerPaint = useDerivedValue(() => {
    const paint = Skia.Paint();
    paint.setAlphaf(animatedProgress.value > 0.001 ? 1 : 0);
    return paint;
  });

  const startPoint = useMemo(() => ({ x: center.x + r, y: center.y }), [center, r]);

  return (
    <Group transform={[{ rotate: -Math.PI / 2 }]} origin={center}>
      <Group clip={clip}>
        <Fill color={background} />
        <Group layer={layerPaint}>
          <Circle c={startPoint} r={strokeWidth / 2} color={colors[0]} />
          <Path
            path={path}
            strokeWidth={strokeWidth}
            style="stroke"
            strokeCap="round"
          >
            <SweepGradient colors={colors} c={center} matrix={matrix} />
          </Path>
          <Fill>
            <Shader source={source} uniforms={uniforms}>
              <SweepGradient colors={colors} c={center} matrix={matrix} />
            </Shader>
          </Fill>
        </Group>
      </Group>
    </Group>
  );
};