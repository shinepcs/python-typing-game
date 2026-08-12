import { Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import * as GUI from "@babylonjs/gui";
import { MISSIONS, type Mission } from "./snippets";
import { TypingArena } from "./TypingArena";

const ASSETS = {
  preview: "/manus-storage/pytype-arena-visual-target_7a8ca389.png",
};

const COLORS = {
  base: "#07131C",
  surface: "#0B1A24",
  raised: "#102631",
  lime: "#C8FF4A",
  cyan: "#69D6D5",
  coral: "#FF7A6B",
  ink: "#F0F5E9",
  muted: "#8DA5A7",
  frame: "#24414A",
};

export type GameHandle = { scene: Scene; dispose: () => void };

function text(name: string, value: string, size: number, color = COLORS.ink) {
  const control = new GUI.TextBlock(name, value);
  control.color = color;
  control.fontFamily = "IBM Plex Mono, monospace";
  control.fontSize = size;
  control.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  control.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  control.resizeToFit = true;
  return control;
}

function frame(name: string, background = COLORS.surface) {
  const control = new GUI.Rectangle(name);
  control.background = background;
  control.color = COLORS.frame;
  control.thickness = 1;
  control.cornerRadius = 0;
  control.paddingLeft = "16px";
  control.paddingRight = "16px";
  control.paddingTop = "14px";
  control.paddingBottom = "14px";
  return control;
}

function button(name: string, label: string, primary = false) {
  const control = GUI.Button.CreateSimpleButton(name, label);
  control.height = "40px";
  control.color = primary ? COLORS.base : COLORS.ink;
  control.background = primary ? COLORS.lime : "#0E202A";
  control.thickness = 1;
  control.cornerRadius = 0;
  control.fontFamily = "IBM Plex Mono, monospace";
  control.fontSize = 13;
  control.paddingLeft = "10px";
  control.paddingRight = "10px";
  control.onPointerEnterObservable.add(() => {
    control.background = primary ? "#DCFf82" : "#173541";
  });
  control.onPointerOutObservable.add(() => {
    control.background = primary ? COLORS.lime : "#0E202A";
  });
  return control;
}

function signalBar(name: string, color: string, height: string) {
  const control = new GUI.Rectangle(name);
  control.height = height;
  control.width = "100%";
  control.background = color;
  control.thickness = 0;
  control.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  return control;
}

export async function createGameScene(engine: Engine, canvas: HTMLCanvasElement): Promise<GameHandle> {
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.027, 0.075, 0.11, 1);

  const camera = new FreeCamera("ui-camera", new Vector3(0, 0, -10), scene);
  camera.setTarget(Vector3.Zero());
  scene.activeCamera = camera;

  const ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("pytype-ui", true, scene);
  const layout = new GUI.Grid("app-layout");
  layout.width = 1;
  layout.height = 1;
  layout.paddingLeft = "18px";
  layout.paddingRight = "18px";
  layout.paddingTop = "14px";
  layout.paddingBottom = "12px";
  layout.addRowDefinition(68, true);
  layout.addRowDefinition(1, false);
  layout.addRowDefinition(30, true);
  ui.addControl(layout);

  const header = frame("header", "#081720D9");
  header.paddingLeft = "14px";
  header.paddingRight = "14px";
  const headerGrid = new GUI.Grid("header-grid");
  headerGrid.addColumnDefinition(1, false);
  headerGrid.addColumnDefinition(256, true);
  headerGrid.addColumnDefinition(120, true);
  header.addControl(headerGrid);

  const identity = new GUI.StackPanel("identity");
  identity.isVertical = false;
  identity.height = "100%";
  identity.spacing = 10;
  const logoMark = new GUI.Rectangle("logo-mark");
  logoMark.width = "42px";
  logoMark.height = "42px";
  logoMark.background = "#0C222B";
  logoMark.color = COLORS.lime;
  logoMark.thickness = 1;
  const logoGlyph = text("logo-glyph", ">_", 17, COLORS.lime);
  logoGlyph.fontWeight = "800";
  logoGlyph.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  logoGlyph.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  logoMark.addControl(logoGlyph);
  identity.addControl(logoMark);
  const brandStack = new GUI.StackPanel("brand-stack");
  brandStack.width = "250px";
  brandStack.height = "100%";
  const brand = text("brand", "PYTYPE ARENA", 19, COLORS.ink);
  brand.fontFamily = "Space Grotesk, sans-serif";
  brand.fontWeight = "800";
  brand.height = "27px";
  const tag = text("brand-tag", "PYTHON / TYPING PROTOCOL", 10, COLORS.cyan);
  tag.height = "16px";
  brandStack.addControl(brand);
  brandStack.addControl(tag);
  identity.addControl(brandStack);
  headerGrid.addControl(identity, 0, 0);

  const xpStack = new GUI.StackPanel("xp-stack");
  xpStack.width = "230px";
  xpStack.height = "100%";
  xpStack.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  const xpLabel = text("xp-label", "LV. 03  /  680 XP", 10, COLORS.muted);
  xpLabel.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  xpLabel.height = "22px";
  const xpTrack = new GUI.Rectangle("xp-track");
  xpTrack.width = "100%";
  xpTrack.height = "7px";
  xpTrack.background = "#162C35";
  xpTrack.thickness = 0;
  const xpFill = new GUI.Rectangle("xp-fill");
  xpFill.width = "62%";
  xpFill.height = "100%";
  xpFill.background = COLORS.lime;
  xpFill.thickness = 0;
  xpFill.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  xpTrack.addControl(xpFill);
  xpStack.addControl(xpLabel);
  xpStack.addControl(xpTrack);
  headerGrid.addControl(xpStack, 0, 1);

  const liveMark = text("live-mark", "●  LIVE", 11, COLORS.lime);
  liveMark.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  headerGrid.addControl(liveMark, 0, 2);
  layout.addControl(header, 0, 0);

  const arenaGrid = new GUI.Grid("arena-grid");
  arenaGrid.paddingTop = "14px";
  arenaGrid.paddingBottom = "10px";
  arenaGrid.addColumnDefinition(238, true);
  arenaGrid.addColumnDefinition(1, false);
  arenaGrid.addColumnDefinition(248, true);
  layout.addControl(arenaGrid, 1, 0);

  const missionRail = frame("mission-rail", "#081720D9");
  const missionStack = new GUI.StackPanel("mission-stack");
  missionStack.spacing = 10;
  const missionKicker = text("mission-kicker", "MISSION QUEUE", 10, COLORS.cyan);
  missionKicker.height = "24px";
  const missionTitle = text("mission-title", "오늘의 리듬", 20, COLORS.ink);
  missionTitle.fontFamily = "Space Grotesk, Noto Sans KR, sans-serif";
  missionTitle.fontWeight = "700";
  missionTitle.height = "34px";
  const missionBody = text("mission-body", "짧은 구문을 정확하게\n입력하며 문법의 감각을 만드세요.", 12, COLORS.muted);
  missionBody.height = "50px";
  missionStack.addControl(missionKicker);
  missionStack.addControl(missionTitle);
  missionStack.addControl(missionBody);
  const missionButtons: GUI.Button[] = [];
  MISSIONS.forEach((mission, index) => {
    const entry = button(`mission-${mission.id}`, `${String(index + 1).padStart(2, "0")}  ${mission.title}`, index === 0);
    entry.height = "48px";
    entry.width = "100%";
    entry.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    missionButtons.push(entry);
    missionStack.addControl(entry);
  });
  const rule = new GUI.Rectangle("rail-rule");
  rule.height = "1px";
  rule.width = "100%";
  rule.background = COLORS.frame;
  rule.thickness = 0;
  rule.paddingTop = "8px";
  rule.paddingBottom = "8px";
  missionStack.addControl(rule);
  const preview = new GUI.Image("mission-preview", ASSETS.preview);
  preview.width = "100%";
  preview.height = "116px";
  preview.alpha = 0.68;
  preview.stretch = GUI.Image.STRETCH_UNIFORM;
  missionStack.addControl(preview);
  const previewCaption = text("preview-caption", "ARENA SCAN  ·  SPRINT MODE", 9, COLORS.muted);
  previewCaption.height = "19px";
  missionStack.addControl(previewCaption);
  missionRail.addControl(missionStack);
  arenaGrid.addControl(missionRail, 0, 0);

  const terminal = frame("terminal", "#07131CE8");
  terminal.paddingLeft = "22px";
  terminal.paddingRight = "22px";
  terminal.paddingTop = "20px";
  terminal.paddingBottom = "18px";
  const terminalStack = new GUI.StackPanel("terminal-stack");
  terminalStack.spacing = 8;
  const terminalHeader = new GUI.Grid("terminal-header");
  terminalHeader.height = "30px";
  terminalHeader.addColumnDefinition(1, false);
  terminalHeader.addColumnDefinition(130, true);
  const prompt = text("terminal-prompt", "> TYPE THE SEQUENCE", 11, COLORS.lime);
  const language = text("language", "PYTHON 3.13", 10, COLORS.muted);
  language.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  terminalHeader.addControl(prompt, 0, 0);
  terminalHeader.addControl(language, 0, 1);
  terminalStack.addControl(terminalHeader);
  const codeRule = new GUI.Rectangle("code-rule");
  codeRule.width = "100%";
  codeRule.height = "1px";
  codeRule.background = COLORS.frame;
  codeRule.thickness = 0;
  terminalStack.addControl(codeRule);
  const conceptText = text("concept", "for · range", 13, COLORS.cyan);
  conceptText.height = "28px";
  terminalStack.addControl(conceptText);
  const codeContainer = new GUI.StackPanel("code-container");
  codeContainer.height = "206px";
  codeContainer.paddingTop = "14px";
  terminalStack.addControl(codeContainer);
  const statusStrip = new GUI.Grid("status-strip");
  statusStrip.height = "44px";
  statusStrip.addColumnDefinition(1, false);
  statusStrip.addColumnDefinition(112, true);
  const inputHint = text("input-hint", "키보드를 누르면 즉시 시작됩니다.", 11, COLORS.muted);
  const characterCount = text("character-count", "0 / 0", 11, COLORS.cyan);
  characterCount.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  statusStrip.addControl(inputHint, 0, 0);
  statusStrip.addControl(characterCount, 0, 1);
  terminalStack.addControl(statusStrip);
  const progressTrack = new GUI.Rectangle("progress-track");
  progressTrack.width = "100%";
  progressTrack.height = "8px";
  progressTrack.background = "#16303B";
  progressTrack.thickness = 0;
  const progressFill = new GUI.Rectangle("progress-fill");
  progressFill.width = "0%";
  progressFill.height = "100%";
  progressFill.background = COLORS.lime;
  progressFill.thickness = 0;
  progressFill.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  progressTrack.addControl(progressFill);
  terminalStack.addControl(progressTrack);
  const controls = new GUI.StackPanel("controls");
  controls.isVertical = false;
  controls.height = "56px";
  controls.spacing = 8;
  const restart = button("restart", "▶  스프린트 시작", true);
  restart.width = "132px";
  const pause = button("pause", "Ⅱ  일시정지", false);
  pause.width = "132px";
  controls.addControl(restart);
  controls.addControl(pause);
  terminalStack.addControl(controls);
  terminal.addControl(terminalStack);
  arenaGrid.addControl(terminal, 0, 1);

  const telemetry = frame("telemetry", "#081720D9");
  const teleStack = new GUI.StackPanel("telemetry-stack");
  teleStack.spacing = 10;
  const teleKicker = text("tele-kicker", "PERFORMANCE SIGNAL", 10, COLORS.cyan);
  teleKicker.height = "24px";
  teleStack.addControl(teleKicker);
  const accuracyDial = new GUI.Ellipse("accuracy-dial");
  accuracyDial.width = "116px";
  accuracyDial.height = "116px";
  accuracyDial.thickness = 3;
  accuracyDial.color = COLORS.lime;
  accuracyDial.background = "#0D2029";
  accuracyDial.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  const accuracyText = text("accuracy", "100%", 25, COLORS.ink);
  accuracyText.fontWeight = "700";
  accuracyText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  accuracyDial.addControl(accuracyText);
  teleStack.addControl(accuracyDial);
  const accuracyCaption = text("accuracy-caption", "정확도", 11, COLORS.muted);
  accuracyCaption.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  accuracyCaption.height = "22px";
  teleStack.addControl(accuracyCaption);
  const metricGrid = new GUI.Grid("metric-grid");
  metricGrid.height = "108px";
  metricGrid.addColumnDefinition(1, false);
  metricGrid.addColumnDefinition(1, false);
  metricGrid.addRowDefinition(1, false);
  metricGrid.addRowDefinition(1, false);
  const wpmNumber = text("wpm-number", "0", 30, COLORS.lime);
  wpmNumber.fontWeight = "800";
  wpmNumber.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  const wpmLabel = text("wpm-label", "WPM", 10, COLORS.muted);
  wpmLabel.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  const comboNumber = text("combo-number", "0", 30, COLORS.cyan);
  comboNumber.fontWeight = "800";
  comboNumber.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  const comboLabel = text("combo-label", "COMBO", 10, COLORS.muted);
  comboLabel.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  metricGrid.addControl(wpmNumber, 0, 0);
  metricGrid.addControl(comboNumber, 0, 1);
  metricGrid.addControl(wpmLabel, 1, 0);
  metricGrid.addControl(comboLabel, 1, 1);
  teleStack.addControl(metricGrid);
  const timerFrame = frame("timer-frame", "#0D2029");
  timerFrame.height = "64px";
  timerFrame.paddingTop = "6px";
  timerFrame.paddingBottom = "6px";
  const timerStack = new GUI.StackPanel("timer-stack");
  const timerLabel = text("timer-label", "TIME REMAINING", 9, COLORS.muted);
  timerLabel.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  timerLabel.height = "16px";
  const timerValue = text("timer", "00:35", 25, COLORS.ink);
  timerValue.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  timerValue.fontWeight = "800";
  timerValue.height = "32px";
  timerStack.addControl(timerLabel);
  timerStack.addControl(timerValue);
  timerFrame.addControl(timerStack);
  teleStack.addControl(timerFrame);
  const streakNode = new GUI.Rectangle("streak-node");
  streakNode.width = "104px";
  streakNode.height = "104px";
  streakNode.background = "#0D2029";
  streakNode.color = COLORS.frame;
  streakNode.thickness = 1;
  streakNode.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  const streakGlyph = text("streak-glyph", "↗", 38, COLORS.lime);
  streakGlyph.fontFamily = "Space Grotesk, sans-serif";
  streakGlyph.fontWeight = "800";
  streakGlyph.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  streakGlyph.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  streakNode.addControl(streakGlyph);
  teleStack.addControl(streakNode);
  const streakCaption = text("streak-caption", "정확한 흐름을 끊지 마세요.", 11, COLORS.muted);
  streakCaption.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  streakCaption.height = "22px";
  teleStack.addControl(streakCaption);
  telemetry.addControl(teleStack);
  arenaGrid.addControl(telemetry, 0, 2);

  const footer = new GUI.Grid("footer");
  footer.addColumnDefinition(1, false);
  footer.addColumnDefinition(1, false);
  const footerLeft = text("footer-left", "[ ESC ] pause  ·  [ BACKSPACE ] revise  ·  [ ENTER ] new line", 10, COLORS.muted);
  const footerRight = text("footer-right", "SYSTEM READY  /  v1.0", 10, COLORS.muted);
  footerRight.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  footer.addControl(footerLeft, 0, 0);
  footer.addControl(footerRight, 0, 1);
  layout.addControl(footer, 2, 0);

  const overlay = new GUI.Rectangle("overlay");
  overlay.width = 1;
  overlay.height = 1;
  overlay.background = "#05101800";
  overlay.thickness = 0;
  overlay.isPointerBlocker = true;
  const overlayCard = frame("overlay-card", "#091923F5");
  overlayCard.width = "430px";
  overlayCard.height = "330px";
  overlayCard.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  overlayCard.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  const overlayStack = new GUI.StackPanel("overlay-stack");
  overlayStack.spacing = 12;
  const overlayKicker = text("overlay-kicker", "PYTHON TYPING PROTOCOL", 11, COLORS.cyan);
  overlayKicker.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  overlayKicker.height = "24px";
  const overlayTitle = text("overlay-title", "코드를 손끝에\n남겨보세요.", 28, COLORS.ink);
  overlayTitle.fontFamily = "Space Grotesk, Noto Sans KR, sans-serif";
  overlayTitle.fontWeight = "800";
  overlayTitle.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  overlayTitle.height = "86px";
  const overlayDesc = text("overlay-desc", "선택한 파이썬 구문을 정확히 입력해\n속도와 문법 감각을 함께 끌어올리세요.", 13, COLORS.muted);
  overlayDesc.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  overlayDesc.height = "50px";
  const primaryAction = button("start", "▶  스프린트 시작", true);
  primaryAction.width = "100%";
  primaryAction.height = "48px";
  overlayStack.addControl(overlayKicker);
  overlayStack.addControl(overlayTitle);
  overlayStack.addControl(overlayDesc);
  overlayStack.addControl(primaryAction);
  overlayCard.addControl(overlayStack);
  overlay.addControl(overlayCard);
  ui.addControl(overlay);

  const arena = new TypingArena(MISSIONS[0]);
  let selectedMissionIndex = 0;
  let lastIndex = -1;
  let lastMissionId = "";
  const demoMode = new URLSearchParams(window.location.search).has("demo");
  let demoAccumulator = 0;
  let demoDelay = 800;
  let lastCompact: boolean | null = null;
  overlay.isVisible = false;

  const selectMission = (index: number) => {
    selectedMissionIndex = index;
    arena.setMission(MISSIONS[index]);
    missionButtons.forEach((missionButton, itemIndex) => {
      const selected = itemIndex === index;
      missionButton.background = selected ? COLORS.lime : "#0E202A";
      missionButton.color = selected ? COLORS.base : COLORS.ink;
    });
    overlay.isVisible = false;
    inputHint.text = `${MISSIONS[index].concept} 미션을 장전했습니다. 스프린트를 시작하세요.`;
    restart.textBlock!.text = "▶  스프린트 시작";
  };

  const startRound = () => {
    arena.start();
    overlay.isVisible = false;
    restart.textBlock!.text = "↻  다시 도전";
  };

  const showResult = () => {
    overlay.isVisible = true;
    overlayKicker.text = arena.timeRemaining <= 0 && arena.progress < 1 ? "TIME OUT  /  SIGNAL SAVED" : "SEQUENCE COMPLETE  /  XP ADDED";
    overlayTitle.text = arena.timeRemaining <= 0 && arena.progress < 1 ? "한 번 더,\n더 정확하게." : "흐름을\n완성했습니다.";
    overlayDesc.text = `WPM ${arena.wpm}  ·  정확도 ${arena.accuracy}%  ·  +${arena.resultXp} XP\n다음 미션에서 더 긴 문장을 정복하세요.`;
    primaryAction.textBlock!.text = "↻  같은 미션 다시 도전";
  };

  const renderCode = () => {
    codeContainer.clearControls();
    const target = arena.target;
    const lines = target.split("\n");
    const compactCode = engine.getRenderWidth() < 800;
    const codeSize = compactCode ? 14 : 20;
    let lineStart = 0;
    lines.forEach((line, lineIndex) => {
      const row = new GUI.StackPanel(`code-row-${lineIndex}`);
      row.isVertical = false;
      row.height = "42px";
      row.width = "100%";
      const number = text(`line-${lineIndex + 1}`, String(lineIndex + 1).padStart(2, "0"), 13, "#587078");
      number.width = compactCode ? "26px" : "38px";
      number.height = "38px";
      number.resizeToFit = false;
      row.addControl(number);
      const typedLength = Math.max(0, Math.min(line.length, arena.index - lineStart));
      const activeInLine = arena.index >= lineStart && arena.index < lineStart + line.length;
      const doneText = line.slice(0, typedLength);
      const activeChar = activeInLine ? line[typedLength] : "";
      const restText = line.slice(typedLength + (activeInLine ? 1 : 0));
      const typedSegment = text(`typed-${lineIndex}`, doneText, codeSize, COLORS.lime);
      typedSegment.height = "38px";
      const activeSegment = text(`active-${lineIndex}`, activeChar ? `▍${activeChar}` : arena.index === lineStart + line.length ? "▍" : "", codeSize, arena.errorActive ? COLORS.coral : COLORS.lime);
      activeSegment.height = "38px";
      const restSegment = text(`rest-${lineIndex}`, restText, codeSize, "#6E8487");
      restSegment.height = "38px";
      row.addControl(typedSegment);
      row.addControl(activeSegment);
      row.addControl(restSegment);
      codeContainer.addControl(row);
      lineStart += line.length + 1;
    });
  };

  const updateHud = () => {
    const mission: Mission = arena.activeMission;
    conceptText.text = `${mission.concept}  /  ${mission.difficulty.toUpperCase()}`;
    language.text = `${mission.title.toUpperCase()}  ·  PYTHON 3.13`;
    characterCount.text = `${arena.index} / ${arena.target.length}`;
    progressFill.width = `${arena.progress * 100}%`;
    accuracyText.text = `${arena.accuracy}%`;
    accuracyDial.color = arena.accuracy < 90 ? COLORS.coral : COLORS.lime;
    wpmNumber.text = String(arena.wpm);
    comboNumber.text = String(arena.combo);
    timerValue.text = `00:${String(Math.ceil(arena.timeRemaining)).padStart(2, "0")}`;
    inputHint.text = arena.status === "paused" ? "일시정지됨 · ESC로 계속하기" : arena.errorActive ? "오타입니다. 현재 문자를 다시 입력하세요." : arena.status === "playing" ? "지금 흐름이 좋습니다. 정확도를 지키세요." : "키보드를 누르면 즉시 시작됩니다.";
    inputHint.color = arena.errorActive ? COLORS.coral : COLORS.muted;
    if (arena.index !== lastIndex || mission.id !== lastMissionId) {
      renderCode();
      lastIndex = arena.index;
      lastMissionId = mission.id;
    }
  };

  const keyHandler = (event: KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key === "Escape") {
      arena.togglePause();
      event.preventDefault();
      return;
    }
    if (event.key === "Tab" || event.key === "Shift" || event.key === "CapsLock") return;
    if (["Backspace", "Enter", " "].includes(event.key) || event.key.length === 1) event.preventDefault();
    arena.handleKey(event.key);
    if (arena.status === "complete") showResult();
  };
  window.addEventListener("keydown", keyHandler);

  primaryAction.onPointerUpObservable.add(() => {
    if (arena.status === "complete") arena.reset();
    startRound();
  });
  restart.onPointerUpObservable.add(() => {
    arena.reset();
    startRound();
  });
  pause.onPointerUpObservable.add(() => arena.togglePause());
  missionButtons.forEach((missionButton, index) => missionButton.onPointerUpObservable.add(() => selectMission(index)));

  scene.onBeforeRenderObservable.add(() => {
    arena.tick();
    if (demoMode) {
      demoDelay -= engine.getDeltaTime();
      if (demoDelay <= 0 && arena.status === "idle") startRound();
      if (arena.status === "playing") {
        demoAccumulator += engine.getDeltaTime();
        if (demoAccumulator > 75) {
          const next = arena.target[arena.index];
          if (next) arena.handleKey(next === "\n" ? "Enter" : next);
          demoAccumulator = 0;
        }
      }
    }
    if (arena.status === "complete" && !overlay.isVisible) showResult();
    updateHud();

    const compact = engine.getRenderWidth() < 800;
    if (compact !== lastCompact) {
      lastCompact = compact;
      missionRail.isVisible = !compact;
      telemetry.isVisible = !compact;
      footer.isVisible = !compact;
      identity.isVisible = !compact;
      arenaGrid.setColumnDefinition(0, compact ? 0 : 238, true);
      arenaGrid.setColumnDefinition(1, 1, false);
      arenaGrid.setColumnDefinition(2, compact ? 0 : 248, true);
      headerGrid.setColumnDefinition(0, compact ? 0 : 1, false);
      headerGrid.setColumnDefinition(1, 1, false);
      headerGrid.setColumnDefinition(2, 98, true);
      xpStack.width = compact ? "172px" : "230px";
      terminal.paddingLeft = compact ? "12px" : "22px";
      terminal.paddingRight = compact ? "12px" : "22px";
      codeContainer.height = compact ? "220px" : "206px";
      lastIndex = -1;
    }
  });

  canvas.tabIndex = 0;
  canvas.focus();
  updateHud();

  return {
    scene,
    dispose: () => {
      window.removeEventListener("keydown", keyHandler);
      ui.dispose();
      scene.dispose();
    },
  };
}
