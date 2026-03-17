import { Canvas, vec } from "@shopify/react-native-skia";
import React from "react";

import { Ring } from "./Ring";

const width = 150
const center = vec(100, 100);

export const { PI } = Math;
export const SIZE = width;
export const strokeWidth = 20;

const color = (r: number, g: number, b: number) =>
  `rgb(${r * 255}, ${g * 255}, ${b * 255})`;

export const Rings = ({
  totalProgressMovement = 0,
  totalProgressDiet = 0,
  totalTraining = 0
}) => {
  const rings = [
  {
    totalProgress: totalProgressMovement,
    colors: [`rgb(77,94,10)`, `rgb(77,94,10)`],
    background: `rgb(170,175,150)`,
    size: SIZE - strokeWidth * 4,
  },
  {
    totalProgress: totalProgressDiet,
    colors: totalProgressDiet > 1 
      ? [`rgb(141,49,17)`, `rgb(141,49,17)`] 
      : [`rgb(115,141,17)`, `rgb(115,141,17)`],
    background: totalProgressDiet > 1 ? `rgb(221,194,184)` : `rgb(182,189,152)`,
    size: SIZE - strokeWidth * 2,
  },
  {
    totalProgress: totalTraining,
    colors: [`rgb(150,183,25)`, `rgb(150,183,25)`],
    background: `rgb(192,202,155)`,
    size: SIZE,
  },
];

  return (
    <Canvas style={{ flex: 1 }}>
      {rings.map((ring, index) => {
        return (
          <Ring
            key={index}
            ring={ring}
            center={center}
            strokeWidth={strokeWidth}
          />
        );
      })}
    </Canvas>
  );
};
