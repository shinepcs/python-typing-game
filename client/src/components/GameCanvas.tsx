// Style reminder: 터미널 아케이드 — React는 프레임, Babylon은 흑청색 코드 조종석을 책임진다.
import { useEffect, useRef } from "react";
import { Engine } from "@babylonjs/core/Engines/engine";
import { createGameScene, type GameHandle } from "@/game/scene";

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || startedRef.current) return;
    startedRef.current = true;

    const engine = new Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      adaptToDeviceRatio: true,
    });

    let handle: GameHandle | null = null;
    createGameScene(engine, canvas)
      .then((gameHandle) => {
        handle = gameHandle;
        engine.runRenderLoop(() => gameHandle.scene.render());
      })
      .catch((error: unknown) => {
        console.error("PyType Arena scene initialization failed", error);
      });

    const onResize = () => engine.resize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      handle?.dispose();
      engine.dispose();
      startedRef.current = false;
    };
  }, []);

  return (
    <>
      <p id="arena-instructions" className="sr-only">PyType Arena 파이썬 타자 연습 게임입니다. 키보드로 화면의 코드를 입력하세요. Escape는 일시정지, Alt+F는 집중 보기, Alt+S는 사운드 토글입니다.</p>
      <p id="arena-live" className="sr-only" aria-live="polite" aria-atomic="true" />
      <canvas ref={canvasRef} className="fixed inset-0 h-full w-full outline-none" style={{ touchAction: "none" }} role="application" aria-label="PyType Arena 파이썬 타자 연습 게임" aria-describedby="arena-instructions arena-live" />
    </>
  );
}
