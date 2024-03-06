import { useEffect, useRef } from "preact/hooks";
import { JSX, forwardRef } from "preact/compat";
import Confetti, {
  confettiDefaults,
  IConfettiOptions,
} from "./confetti/confetti.ts";

export type Props =
  & Partial<IConfettiOptions>
  & JSX.IntrinsicElements["canvas"]
  & { canvasRef? };

export default function ReactConfettiInternal(props: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiRef = useRef<Confetti | undefined>(undefined);

  useEffect(() => {
    if (canvasRef.current) {
      const confettiOptions = extractCanvasProps(props)[0];
      confettiRef.current = new Confetti(canvasRef.current, confettiOptions);
    }

    return () => {
      if (confettiRef.current) {
        confettiRef.current.stop();
      }
    };
  }, [props]);

  useEffect(() => {
    const confettiOptions = extractCanvasProps(props)[0];
    if (confettiRef.current) {
      confettiRef.current.options = confettiOptions as IConfettiOptions;
    }
  }, [props]);

  const [confettiOptions, passedProps] = extractCanvasProps(props);
  const canvasStyles = {
    zIndex: 2,
    position: "absolute" as const,
    pointerEvents: "none" as const,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    ...(passedProps.style),
  };

  return (
    <canvas
      width={confettiOptions.width}
      height={confettiOptions.height}
      ref={canvasRef}
      {...passedProps}
      style={canvasStyles}
    />
  );
}

interface Refs {
  [key: string];
}

function extractCanvasProps(
  props: Partial<IConfettiOptions>,
): [Partial<IConfettiOptions>, Partial<JSX.IntrinsicElements["canvas"]>, Refs] {
  const confettiOptions: Partial<IConfettiOptions> = {};
  const refs: Refs = {};
  const rest = {};
  const confettiOptionKeys = [
    ...Object.keys(confettiDefaults),
    "confettiSource",
    "drawShape",
    "onConfettiComplete",
  ];
  const refProps = ["canvasRef"];

  for (const prop in props) {
    const val = props[prop as string];
    if (confettiOptionKeys.includes(prop)) {
      confettiOptions[prop as keyof IConfettiOptions] = val;
    } else if (refProps.includes(prop)) {
      refProps[prop] = val;
    } else {
      rest[prop] = val;
    }
  }

  return [confettiOptions, rest, refs];
}

export const ReactConfetti = forwardRef<HTMLCanvasElement, Props>((
  props,
  ref,
) => <ReactConfettiInternal canvasRef={ref} {...props} />);
