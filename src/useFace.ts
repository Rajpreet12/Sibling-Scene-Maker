import { useCurrentFrame } from "remotion";

export function useFace(talking: boolean) {
  const frame = useCurrentFrame();
  const mouthOpen = talking && Math.floor(frame / 4) % 2 === 0;
  const blinking = frame % 95 < 5;
  const wiggle = talking ? Math.sin(frame / 5) * 3 : 0;
  return { mouthOpen, blinking, wiggle };
}
