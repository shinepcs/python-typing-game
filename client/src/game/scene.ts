import { Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import * as GUI from "@babylonjs/gui";
import { ProgressStore } from "./progress";
import { SoundEngine } from "./SoundEngine";
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
  muted: "#BDD0D1",
  frame: "#42646D",
};

export type GameHandle = { scene: Scene; dispose: () => void };

function text(name: string, value: string, size: number, color = COLORS.ink) {
  const control = new GUI.TextBlock(name, value);
  control.color = color;
  control.fontFamily = "IBM Plex Mono, monospace";
  control.fontSize = Math.max(13, size);
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
  control.height = "44px";
  control.color = primary ? COLORS.base : COLORS.ink;
  control.background = primary ? COLORS.lime : "#0E202A";
  control.thickness = 1;
  control.cornerRadius = 0;
  control.fontFamily = "IBM Plex Mono, monospace";
  control.fontSize = 15;
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
  headerGrid.addColumnDefinition(92, true);
  headerGrid.addColumnDefinition(104, true);
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
  const tag = text("brand-tag", "PYTHON / TYPING PROTOCOL", 13, COLORS.cyan);
  tag.height = "16px";
  brandStack.addControl(brand);
  brandStack.addControl(tag);
  identity.addControl(brandStack);
  headerGrid.addControl(identity, 0, 0);

  const xpStack = new GUI.StackPanel("xp-stack");
  xpStack.width = "230px";
  xpStack.height = "100%";
  xpStack.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  const xpLabel = text("xp-label", "LV. 03  /  680 XP", 13, COLORS.muted);
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

  const soundToggle = button("sound-toggle", "SFX  ON", false);
  soundToggle.width = "84px";
  soundToggle.height = "34px";
  headerGrid.addControl(soundToggle, 0, 2);
  const focusToggle = button("focus-toggle", "FOCUS", false);
  focusToggle.width = "96px";
  focusToggle.height = "34px";
  headerGrid.addControl(focusToggle, 0, 3);
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
  const missionKicker = text("mission-kicker", "MISSION QUEUE", 13, COLORS.cyan);
  missionKicker.height = "24px";
  const missionTitle = text("mission-title", "연속 코드 연습", 20, COLORS.ink);
  missionTitle.fontFamily = "Space Grotesk, Noto Sans KR, sans-serif";
  missionTitle.fontWeight = "700";
  missionTitle.height = "34px";
  const missionBody = text("mission-body", "5·20자 워밍업 후\n함수·프로그램 코드로\n연속 연습합니다.", 14, COLORS.muted);
  missionBody.height = "70px";
  missionStack.addControl(missionKicker);
  missionStack.addControl(missionTitle);
  missionStack.addControl(missionBody);
  const visibleMissionIndexes = [0, 1, 2];
  const missionButtons: GUI.Button[] = [];
  visibleMissionIndexes.forEach((missionIndex, index) => {
    const mission = MISSIONS[missionIndex];
    const entry = button(`mission-${mission.id}`, `${String(missionIndex + 1).padStart(2, "0")}  ${mission.title}`, index === 0);
    entry.height = "48px";
    entry.width = "100%";
    entry.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    missionButtons.push(entry);
    missionStack.addControl(entry);
  });
  const deckButton = button("mission-deck", "⟳  다른 미션 세트", false);
  deckButton.height = "38px";
  deckButton.width = "100%";
  missionStack.addControl(deckButton);
  const practicalKicker = text("practical-kicker", "PRACTICAL CODE", 13, COLORS.cyan);
  practicalKicker.height = "24px";
  missionStack.addControl(practicalKicker);
  const functionEntry = button("function-entry", "ƒ  함수 코드 연습", false);
  functionEntry.height = "38px";
  functionEntry.width = "100%";
  missionStack.addControl(functionEntry);
  const programEntry = button("program-entry", "▣  프로그램 코드 연습", false);
  programEntry.height = "38px";
  programEntry.width = "100%";
  missionStack.addControl(programEntry);
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
  const previewCaption = text("preview-caption", "ARENA SCAN  ·  SPRINT MODE", 12, COLORS.muted);
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
  const prompt = text("terminal-prompt", "> KEEP THE FLOW", 14, COLORS.lime);
  const language = text("language", "PYTHON 3.13", 13, COLORS.muted);
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
  const conceptText = text("concept", "for · range", 16, COLORS.cyan);
  conceptText.height = "28px";
  terminalStack.addControl(conceptText);
  const codeContainer = new GUI.StackPanel("code-container");
  codeContainer.height = "360px";
  codeContainer.paddingTop = "14px";
  terminalStack.addControl(codeContainer);
  const statusStrip = new GUI.Grid("status-strip");
  statusStrip.height = "44px";
  statusStrip.addColumnDefinition(1, false);
  statusStrip.addColumnDefinition(112, true);
  const inputHint = text("input-hint", "키보드를 누르면 즉시 시작됩니다.", 14, COLORS.muted);
  const characterCount = text("character-count", "0 / 0", 14, COLORS.cyan);
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
  const restart = button("restart", "▶  연습 시작", true);
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
  const teleKicker = text("tele-kicker", "PERFORMANCE SIGNAL", 13, COLORS.cyan);
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
  const accuracyCaption = text("accuracy-caption", "정확도", 14, COLORS.muted);
  accuracyCaption.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  accuracyCaption.height = "22px";
  teleStack.addControl(accuracyCaption);
  const metricGrid = new GUI.Grid("metric-grid");
  metricGrid.height = "108px";
  metricGrid.addColumnDefinition(1, false);
  metricGrid.addColumnDefinition(1, false);
  metricGrid.addRowDefinition(1, false);
  metricGrid.addRowDefinition(1, false);
  const cpmNumber = text("cpm-number", "0", 30, COLORS.lime);
  cpmNumber.fontWeight = "800";
  cpmNumber.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  const cpmLabel = text("cpm-label", "분당 타수", 14, COLORS.muted);
  cpmLabel.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  const comboNumber = text("combo-number", "0", 30, COLORS.cyan);
  comboNumber.fontWeight = "800";
  comboNumber.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  const comboLabel = text("combo-label", "COMBO", 14, COLORS.muted);
  comboLabel.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  metricGrid.addControl(cpmNumber, 0, 0);
  metricGrid.addControl(comboNumber, 0, 1);
  metricGrid.addControl(cpmLabel, 1, 0);
  metricGrid.addControl(comboLabel, 1, 1);
  teleStack.addControl(metricGrid);
  const timerFrame = frame("timer-frame", "#0D2029");
  timerFrame.height = "64px";
  timerFrame.paddingTop = "6px";
  timerFrame.paddingBottom = "6px";
  const timerStack = new GUI.StackPanel("timer-stack");
  const timerLabel = text("timer-label", "TIME REMAINING", 12, COLORS.muted);
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
  const streakCaption = text("streak-caption", "정확한 흐름을 끊지 마세요.", 14, COLORS.muted);
  streakCaption.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  streakCaption.height = "22px";
  teleStack.addControl(streakCaption);
  const dashboardToggle = button("dashboard-toggle", "▥  성장 대시보드", false);
  dashboardToggle.height = "44px";
  dashboardToggle.width = "100%";
  teleStack.addControl(dashboardToggle);
  telemetry.addControl(teleStack);
  arenaGrid.addControl(telemetry, 0, 2);

  const footer = new GUI.Grid("footer");
  footer.addColumnDefinition(1, false);
  footer.addColumnDefinition(1, false);
  const footerLeft = text("footer-left", "[ ESC ] pause  ·  [ BACKSPACE ] revise  ·  [ ALT+F ] focus  ·  [ ALT+S ] sound", 10, COLORS.muted);
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
  overlayCard.height = "380px";
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
  const nextMissionAction = button("next-mission", "다음 추천 미션", false);
  nextMissionAction.width = "100%";
  nextMissionAction.height = "42px";
  nextMissionAction.isVisible = false;
  overlayStack.addControl(nextMissionAction);
  overlayCard.addControl(overlayStack);
  overlay.addControl(overlayCard);
  ui.addControl(overlay);

  const dashboardOverlay = new GUI.Rectangle("dashboard-overlay");
  dashboardOverlay.width = 1;
  dashboardOverlay.height = 1;
  dashboardOverlay.background = "#051018E8";
  dashboardOverlay.thickness = 0;
  dashboardOverlay.isPointerBlocker = true;
  dashboardOverlay.isVisible = false;
  const dashboardCard = frame("dashboard-card", "#091923FA");
  dashboardCard.width = "780px";
  dashboardCard.height = "510px";
  dashboardCard.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  dashboardCard.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  const dashboardStack = new GUI.StackPanel("dashboard-stack");
  dashboardStack.spacing = 14;
  const dashboardHeader = new GUI.Grid("dashboard-header");
  dashboardHeader.height = "42px";
  dashboardHeader.addColumnDefinition(1, false);
  dashboardHeader.addColumnDefinition(112, true);
  const dashboardTitle = text("dashboard-title", "성장 대시보드", 24, COLORS.ink);
  dashboardTitle.fontFamily = "Space Grotesk, Noto Sans KR, sans-serif";
  dashboardTitle.fontWeight = "800";
  const dashboardClose = button("dashboard-close", "닫기", false);
  dashboardClose.width = "96px";
  dashboardClose.height = "40px";
  dashboardHeader.addControl(dashboardTitle, 0, 0);
  dashboardHeader.addControl(dashboardClose, 0, 1);
  const dashboardSubhead = text("dashboard-subhead", "최근 완료 세션의 실제 분당 타수 추이", 14, COLORS.cyan);
  dashboardSubhead.height = "28px";
  const dashboardMetrics = new GUI.Grid("dashboard-metrics");
  dashboardMetrics.height = "88px";
  dashboardMetrics.addColumnDefinition(1, false);
  dashboardMetrics.addColumnDefinition(1, false);
  dashboardMetrics.addColumnDefinition(1, false);
  const bestCpmMetric = text("dashboard-best", "0", 28, COLORS.lime);
  bestCpmMetric.fontWeight = "800";
  bestCpmMetric.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  const averageCpmMetric = text("dashboard-average", "0", 28, COLORS.cyan);
  averageCpmMetric.fontWeight = "800";
  averageCpmMetric.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  const countMetric = text("dashboard-count", "0", 28, COLORS.ink);
  countMetric.fontWeight = "800";
  countMetric.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  const bestCpmLabel = text("dashboard-best-label", "최고 분당 타수", 14, COLORS.muted);
  bestCpmLabel.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  const averageCpmLabel = text("dashboard-average-label", "최근 평균", 14, COLORS.muted);
  averageCpmLabel.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  const countLabel = text("dashboard-count-label", "완료 세션", 14, COLORS.muted);
  countLabel.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  dashboardMetrics.addControl(bestCpmMetric, 0, 0);
  dashboardMetrics.addControl(averageCpmMetric, 0, 1);
  dashboardMetrics.addControl(countMetric, 0, 2);
  dashboardMetrics.addControl(bestCpmLabel, 1, 0);
  dashboardMetrics.addControl(averageCpmLabel, 1, 1);
  dashboardMetrics.addControl(countLabel, 1, 2);
  const chartFrame = new GUI.Rectangle("cpm-chart-frame");
  chartFrame.width = "100%";
  chartFrame.height = "250px";
  chartFrame.background = "#07151E";
  chartFrame.color = COLORS.frame;
  chartFrame.thickness = 1;
  chartFrame.paddingLeft = "16px";
  chartFrame.paddingRight = "16px";
  chartFrame.paddingTop = "16px";
  chartFrame.paddingBottom = "14px";
  const chartBars = new GUI.Grid("cpm-chart-bars");
  chartFrame.addControl(chartBars);
  const chartFooter = text("dashboard-chart-footer", "최근 12개 완료 세션 · 분당 타수", 13, COLORS.muted);
  chartFooter.height = "24px";
  chartFooter.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  dashboardStack.addControl(dashboardHeader);
  dashboardStack.addControl(dashboardSubhead);
  dashboardStack.addControl(dashboardMetrics);
  dashboardStack.addControl(chartFrame);
  dashboardStack.addControl(chartFooter);
  dashboardCard.addControl(dashboardStack);
  dashboardOverlay.addControl(dashboardCard);
  ui.addControl(dashboardOverlay);

  const arena = new TypingArena(MISSIONS[0]);
  const progressStore = new ProgressStore();
  const soundEngine = new SoundEngine();
  let selectedMissionIndex = 0;
  let lastIndex = -1;
  let lastMissionId = "";
  const demoMode = new URLSearchParams(window.location.search).has("demo");
  let demoAccumulator = 0;
  let demoDelay = demoMode ? 280 : 800;
  let lastCompact: boolean | null = null;
  let sessionRecorded = false;
  let latestEarnedXp = 0;
  let missionDeckPage = 0;
  let practiceSetIndex = 0;
  let focusMode = false;
  let lastFeedbackKey = "";
  // ── 오타 토스트 상태 ──────────────────────────────────────────────
  let toastTimer = 0;
  let toastMessage = "";
  let lastErrorActive = false;
  overlay.isVisible = false;

  const nearbyFeedback = () => {
    const setItems = arena.activeMission.setItems;
    if (arena.autoIndentActive) return { text: `자동 들여쓰기 · ${arena.autoIndentLevels}단계 적용`, color: COLORS.cyan, background: "#0B2630" };
    if (arena.status === "paused") return { text: "일시정지 · ESC로 계속", color: COLORS.cyan, background: "#0B2630" };
    if (setItems) return { text: `연속 세트 · ${practiceSetIndex + 1}/${setItems.length} 항목`, color: COLORS.lime, background: "#182A1A" };
    return { text: `정확도 ${arena.accuracy}% · 분당 타수 ${arena.cpm}`, color: COLORS.lime, background: "#182A1A" };
  };

  const announce = (message: string) => {
    const liveRegion = document.getElementById("arena-live");
    if (liveRegion) liveRegion.textContent = message;
  };

  const renderDashboard = () => {
    const sessions = [...progressStore.snapshot.sessions].reverse().slice(-12);
    const averageCpm = sessions.length ? Math.round(sessions.reduce((sum, session) => sum + session.cpm, 0) / sessions.length) : 0;
    bestCpmMetric.text = String(progressStore.snapshot.bestCpm);
    averageCpmMetric.text = String(averageCpm);
    countMetric.text = `${sessions.length}회`;
    chartBars.clearControls();
    if (sessions.length === 0) {
      const empty = text("chart-empty", "첫 연습을 완료하면 실제 분당 타수 추이가 여기에 쌓입니다.", 16, COLORS.muted);
      empty.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
      chartBars.addControl(empty);
      return;
    }
    const maxCpm = Math.max(1, ...sessions.map((session) => session.cpm));
    sessions.forEach((session, index) => {
      chartBars.addColumnDefinition(1, false);
      const barCell = new GUI.Rectangle(`chart-cell-${index}`);
      barCell.thickness = 0;
      const value = text(`chart-value-${index}`, String(session.cpm), 14, index === sessions.length - 1 ? COLORS.lime : COLORS.ink);
      value.height = "24px";
      value.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
      value.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
      const bar = new GUI.Rectangle(`chart-bar-${index}`);
      bar.width = "54%";
      bar.height = `${Math.max(10, (session.cpm / maxCpm) * 78)}%`;
      bar.background = index === sessions.length - 1 ? COLORS.lime : COLORS.cyan;
      bar.thickness = 0;
      bar.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
      bar.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
      const sessionLabel = text(`chart-session-${index}`, `${index + 1}`, 13, COLORS.muted);
      sessionLabel.height = "22px";
      sessionLabel.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
      sessionLabel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
      barCell.addControl(value);
      barCell.addControl(bar);
      barCell.addControl(sessionLabel);
      chartBars.addControl(barCell, 0, index);
    });
  };

  const refreshMissionDeck = () => {
    missionButtons.forEach((missionButton, slot) => {
      const missionIndex = (missionDeckPage * 3 + slot) % MISSIONS.length;
      const mission = MISSIONS[missionIndex];
      visibleMissionIndexes[slot] = missionIndex;
      missionButton.textBlock!.text = `${String(missionIndex + 1).padStart(2, "0")}  ${mission.title}`;
      const selected = missionIndex === selectedMissionIndex;
      missionButton.background = selected ? COLORS.lime : "#0E202A";
      missionButton.color = selected ? COLORS.base : COLORS.ink;
    });
  };

  const selectMission = (index: number) => {
    selectedMissionIndex = index;
    practiceSetIndex = 0;
    const mission = MISSIONS[index];
    arena.setMission({ ...mission, code: mission.setItems?.[0] ?? mission.code });
    sessionRecorded = false;
    missionButtons.forEach((missionButton, itemIndex) => {
      const selected = visibleMissionIndexes[itemIndex] === index;
      missionButton.background = selected ? COLORS.lime : "#0E202A";
      missionButton.color = selected ? COLORS.base : COLORS.ink;
    });
    functionEntry.background = index === 2 ? COLORS.lime : "#0E202A";
    functionEntry.color = index === 2 ? COLORS.base : COLORS.ink;
    programEntry.background = index === 3 ? COLORS.lime : "#0E202A";
    programEntry.color = index === 3 ? COLORS.base : COLORS.ink;
    overlay.isVisible = false;
    inputHint.text = `${MISSIONS[index].concept} 미션을 장전했습니다. 스프린트를 시작하세요.`;
    restart.textBlock!.text = "▶  연습 시작";
    announce(`${MISSIONS[index].title} 미션을 선택했습니다. ${MISSIONS[index].concept} 연습을 시작할 수 있습니다.`);
  };

  const startRound = () => {
    arena.start();
    overlay.isVisible = false;
    restart.textBlock!.text = "↻  처음부터 다시";
    nextMissionAction.isVisible = false;
    announce(`${arena.activeMission.title} 미션을 시작했습니다.`);
  };

  const showResult = () => {
    if (!sessionRecorded) {
      latestEarnedXp = progressStore.recordSession({
        missionId: arena.activeMission.id,
        completed: arena.completed,
        accuracy: arena.accuracy,
        cpm: arena.cpm,
        combo: arena.combo,
        baseXp: arena.resultXp,
        mistakeMap: arena.errorsByCharacter,
      });
      sessionRecorded = true;
    }
    const weakCharacters = progressStore.weakCharacters();
    const setItems = arena.activeMission.setItems;
    if (setItems && practiceSetIndex < setItems.length - 1) {
      practiceSetIndex += 1;
      const baseMission = MISSIONS[selectedMissionIndex];
      arena.setMission({ ...baseMission, code: setItems[practiceSetIndex] });
      sessionRecorded = false;
      startRound();
      inputHint.text = `${practiceSetIndex + 1}/${setItems.length} 항목으로 바로 이어갑니다.`;
      announce(`${arena.activeMission.title} 세트의 ${practiceSetIndex + 1}번째 항목을 시작합니다.`);
      return;
    }
    const recommendedIndex = MISSIONS.findIndex((mission) => !progressStore.snapshot.completedMissionIds.includes(mission.id) && mission.id !== arena.activeMission.id);
    const safeRecommendedIndex = recommendedIndex >= 0 ? recommendedIndex : (selectedMissionIndex + 1) % MISSIONS.length;
    const recommendedMission = MISSIONS[safeRecommendedIndex];
    overlay.isVisible = true;
    overlayKicker.text = arena.timeRemaining <= 0 && arena.progress < 1 ? "TIME OUT  /  SIGNAL SAVED" : setItems ? "WARMUP SET COMPLETE  /  XP ADDED" : "SEQUENCE COMPLETE  /  XP ADDED";
    overlayTitle.text = arena.timeRemaining <= 0 && arena.progress < 1 ? "한 번 더,\n더 정확하게." : setItems ? `${setItems.length}개 항목을\n완주했습니다.` : "흐름을\n완성했습니다.";
    overlayDesc.text = `분당 타수 ${arena.cpm}  ·  정확도 ${arena.accuracy}%  ·  +${latestEarnedXp} XP\nLV. ${progressStore.level}  ·  ${weakCharacters.length ? `복습 신호: ${weakCharacters.join(" · ")}` : "완벽한 흐름입니다."}`;
    primaryAction.textBlock!.text = setItems ? "↻  같은 세트 다시" : "↻  같은 미션 다시 도전";
    nextMissionAction.textBlock!.text = `→  추천: ${recommendedMission.title}`;
    nextMissionAction.metadata = safeRecommendedIndex;
    nextMissionAction.isVisible = false;
    announce(`결과: 분당 타수 ${arena.cpm}, 정확도 ${arena.accuracy}퍼센트, ${latestEarnedXp} XP를 획득했습니다.`);
  };

  const renderCode = () => {
    codeContainer.clearControls();
    const target = arena.target;
    const lines = target.split("\n");
    const compactCode = engine.getRenderWidth() < 800;
    const codeSize = compactCode ? 18 : 24;
    const lineOffsets: number[] = [];
    let cursor = 0;
    lines.forEach((line) => {
      lineOffsets.push(cursor);
      cursor += line.length + 1;
    });
    const activeLine = Math.max(0, lines.findIndex((line, index) => arena.index <= lineOffsets[index] + line.length));
    const visibleLineCount = compactCode ? 4 : 6;
    const centralRow = Math.floor(visibleLineCount / 2);
    const firstVisibleLine = Math.max(0, activeLine - centralRow);
    const lastVisibleLine = firstVisibleLine + visibleLineCount;

    for (let lineIndex = firstVisibleLine; lineIndex < lastVisibleLine; lineIndex += 1) {
      const line = lines[lineIndex] ?? "";
      const lineStart = lineOffsets[lineIndex] ?? target.length;
      const isPlaceholder = lineIndex >= lines.length;
      const isActiveLine = lineIndex === activeLine;
      const isPrevLine = lineIndex === activeLine - 1;
      const row = new GUI.Rectangle(`code-row-${lineIndex}`);
      row.height = "52px";
      row.width = "100%";
      row.thickness = 0;
      row.background = "#00000000";
      const feedbackColumnWidth = compactCode ? 0 : 196;
      const lineNumberWidth = compactCode ? 34 : 46;
      const numberWidth = feedbackColumnWidth + lineNumberWidth;
      const characterWidth = codeSize * 0.6;
      const number = text(`line-${lineIndex + 1}`, isPlaceholder ? "" : String(lineIndex + 1).padStart(2, "0"), 15, "#7E9A9E");
      number.width = `${lineNumberWidth}px`;
      number.height = "46px";
      number.resizeToFit = false;
      number.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
      number.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
      number.left = `${feedbackColumnWidth}px`;
      row.addControl(number);
      const typedLength = Math.max(0, Math.min(line.length, arena.index - lineStart));
      const activeInLine = arena.index >= lineStart && arena.index < lineStart + line.length;

      line.split("").forEach((character, characterIndex) => {
        const characterCell = text(`cell-${lineIndex}-${characterIndex}`, character, codeSize, characterIndex < typedLength ? COLORS.lime : "#6E8487");
        characterCell.width = `${characterWidth}px`;
        characterCell.height = "46px";
        characterCell.resizeToFit = false;
        characterCell.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        characterCell.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        characterCell.left = `${numberWidth + characterIndex * characterWidth}px`;
        row.addControl(characterCell);
      });

      const markerIndex = activeInLine ? typedLength : arena.index === lineStart + line.length ? line.length : -1;
      if (markerIndex >= 0) {
        const marker = new GUI.Rectangle(`caret-marker-${lineIndex}`);
        marker.width = `${Math.max(6, characterWidth * 0.72)}px`;
        marker.height = "3px";
        marker.thickness = 0;
        marker.background = arena.errorActive ? COLORS.coral : COLORS.lime;
        marker.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        marker.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        marker.left = `${numberWidth + markerIndex * characterWidth}px`;
        marker.top = "-1px";
        row.addControl(marker);
      }
      // ── 왼쪽 상태 버블 (현재 줄, 오타 제외) ──────────────────────
      if (isActiveLine && !compactCode) {
        const feedback = nearbyFeedback();
        const feedbackBubble = new GUI.Rectangle(`feedback-bubble-${lineIndex}`);
        feedbackBubble.width = "188px";
        feedbackBubble.height = "34px";
        feedbackBubble.cornerRadius = 5;
        feedbackBubble.thickness = 1;
        feedbackBubble.color = feedback.color;
        feedbackBubble.background = feedback.background;
        feedbackBubble.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        feedbackBubble.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        feedbackBubble.top = "6px";
        feedbackBubble.left = "4px";
        feedbackBubble.zIndex = 5;
        const feedbackText = text(`feedback-text-${lineIndex}`, feedback.text, 14, feedback.color);
        feedbackText.resizeToFit = false;
        feedbackText.width = "180px";
        feedbackText.height = "34px";
        feedbackText.paddingLeft = "12px";
        feedbackText.paddingRight = "12px";
        feedbackText.textWrapping = GUI.TextWrapping.Clip;
        feedbackBubble.addControl(feedbackText);
        row.addControl(feedbackBubble);
      }
      // ── 오타 토스트 버블 (현재 줄 1줄 위에 표시) ─────────────────
      if (isPrevLine && toastTimer > 0 && !compactCode) {
        const toastBubble = new GUI.Rectangle(`toast-bubble-${lineIndex}`);
        toastBubble.width = "240px";
        toastBubble.height = "32px";
        toastBubble.cornerRadius = 5;
        toastBubble.thickness = 1;
        toastBubble.color = COLORS.coral;
        toastBubble.background = "#3A141B";
        toastBubble.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        toastBubble.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        toastBubble.top = "-2px";
        toastBubble.left = `${numberWidth}px`;
        toastBubble.zIndex = 10;
        toastBubble.alpha = Math.min(1, toastTimer / 400);
        const toastText = text(`toast-text-${lineIndex}`, toastMessage, 13, COLORS.coral);
        toastText.resizeToFit = false;
        toastText.width = "232px";
        toastText.height = "32px";
        toastText.paddingLeft = "10px";
        toastText.paddingRight = "10px";
        toastText.textWrapping = GUI.TextWrapping.Clip;
        toastBubble.addControl(toastText);
        row.addControl(toastBubble);
      }
      // ── 오타 토스트 버블 (첫 줄 오타 시 현재 줄 아래) ────────────
      if (isActiveLine && activeLine === 0 && toastTimer > 0 && !compactCode) {
        const toastBubble2 = new GUI.Rectangle(`toast-bubble-active-${lineIndex}`);
        toastBubble2.width = "240px";
        toastBubble2.height = "32px";
        toastBubble2.cornerRadius = 5;
        toastBubble2.thickness = 1;
        toastBubble2.color = COLORS.coral;
        toastBubble2.background = "#3A141B";
        toastBubble2.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        toastBubble2.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        toastBubble2.top = "2px";
        toastBubble2.left = `${numberWidth}px`;
        toastBubble2.zIndex = 10;
        toastBubble2.alpha = Math.min(1, toastTimer / 400);
        const toastText2 = text(`toast-text-active-${lineIndex}`, toastMessage, 13, COLORS.coral);
        toastText2.resizeToFit = false;
        toastText2.width = "232px";
        toastText2.height = "32px";
        toastText2.paddingLeft = "10px";
        toastText2.paddingRight = "10px";
        toastText2.textWrapping = GUI.TextWrapping.Clip;
        toastBubble2.addControl(toastText2);
        row.addControl(toastBubble2);
      }
      codeContainer.addControl(row);
    }
  };

  const updateHud = () => {
    const mission: Mission = arena.activeMission;
    const setItems = mission.setItems;
    conceptText.text = `${mission.concept}  /  ${mission.difficulty.toUpperCase()}${setItems ? `  ·  ${practiceSetIndex + 1}/${setItems.length}` : ""}`;
    language.text = `${mission.title.toUpperCase()}  ·  PYTHON 3.13`;
    characterCount.text = setItems ? `${practiceSetIndex + 1}/${setItems.length} · ${arena.index}/${arena.target.length}` : `${arena.index} / ${arena.target.length}`;
    progressFill.width = `${arena.progress * 100}%`;
    accuracyText.text = `${arena.accuracy}%`;
    accuracyDial.color = arena.accuracy < 90 ? COLORS.coral : COLORS.lime;
    cpmNumber.text = String(arena.cpm);
    comboNumber.text = String(arena.combo);
    const remainingSeconds = Math.ceil(arena.timeRemaining);
    timerValue.text = `${String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:${String(remainingSeconds % 60).padStart(2, "0")}`;
    xpLabel.text = `LV. ${String(progressStore.level).padStart(2, "0")}  /  ${progressStore.levelProgress} XP`;
    xpFill.width = `${Math.max(4, (progressStore.levelProgress / 500) * 100)}%`;
    streakCaption.text = progressStore.snapshot.dailyStreak > 0 ? `${progressStore.snapshot.dailyStreak}일 연속 학습 중` : "첫 리듬을 시작하세요.";
    const compactView = engine.getRenderWidth() < 800;
    inputHint.text = arena.status === "paused" ? (compactView ? "일시정지 · ESC로 계속" : "일시정지됨 · ESC로 계속하기") : arena.errorActive ? (compactView ? "오타 · 현재 문자를 다시 입력" : "오타입니다. 현재 문자를 다시 입력하세요.") : arena.status === "playing" ? (compactView ? "입력 흐름 유지 중" : "지금 흐름이 좋습니다. 정확도를 지키세요.") : (compactView ? "아무 키를 누르면 시작" : "키보드를 누르면 즉시 시작됩니다.");
    inputHint.color = arena.errorActive ? COLORS.coral : COLORS.muted;
    const feedbackKey = `${arena.status}-${arena.errorActive}-${arena.autoIndentActive}-${practiceSetIndex}-${arena.accuracy}-${arena.cpm}-${Math.floor(toastTimer / 100)}`;
    // ── 오타 토스트 타이머 갱신 ──────────────────────────────────────
    const dt = engine.getDeltaTime();
    if (arena.errorActive && !lastErrorActive) {
      toastMessage = "⚠ 오타 · 현재 문자를 다시 입력하세요";
      toastTimer = 1500;
    } else if (toastTimer > 0) {
      toastTimer = Math.max(0, toastTimer - dt);
    }
    lastErrorActive = arena.errorActive;
    if (arena.index !== lastIndex || mission.id !== lastMissionId || feedbackKey !== lastFeedbackKey) {
      renderCode();
      lastIndex = arena.index;
      lastMissionId = mission.id;
      lastFeedbackKey = feedbackKey;
    }
  };

  const keyHandler = (event: KeyboardEvent) => {
    if (event.altKey && event.key.toLowerCase() === "f") {
      focusMode = !focusMode;
      focusToggle.textBlock!.text = focusMode ? "EXIT FOCUS" : "FOCUS";
      event.preventDefault();
      return;
    }
    if (event.altKey && event.key.toLowerCase() === "s") {
      soundToggle.textBlock!.text = soundEngine.toggle() ? "SFX  ON" : "SFX  OFF";
      event.preventDefault();
      return;
    }
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key === "Escape") {
      arena.togglePause();
      announce(arena.status === "paused" ? "미션을 일시정지했습니다." : "미션을 다시 시작했습니다.");
      event.preventDefault();
      return;
    }
    if (event.key === "Shift" || event.key === "CapsLock") return;
    if (["Backspace", "Enter", " ", "Tab"].includes(event.key) || event.key.length === 1) event.preventDefault();
    const outcome = arena.handleKey(event.key);
    if (outcome === "correct") soundEngine.play("correct");
    if (outcome === "mistake") soundEngine.play("mistake");
    if (outcome === "complete") soundEngine.play("complete");
    if (arena.status === "complete") showResult();
  };
  window.addEventListener("keydown", keyHandler);

  primaryAction.onPointerUpObservable.add(() => {
    if (arena.status === "complete") {
      const mission = MISSIONS[selectedMissionIndex];
      practiceSetIndex = 0;
      arena.setMission({ ...mission, code: mission.setItems?.[0] ?? mission.code });
      sessionRecorded = false;
    }
    startRound();
  });
  restart.onPointerUpObservable.add(() => {
    arena.reset();
    sessionRecorded = false;
    startRound();
  });
  pause.onPointerUpObservable.add(() => arena.togglePause());
  soundToggle.onPointerUpObservable.add(() => {
    soundToggle.textBlock!.text = soundEngine.toggle() ? "SFX  ON" : "SFX  OFF";
  });
  focusToggle.onPointerUpObservable.add(() => {
    focusMode = !focusMode;
    focusToggle.textBlock!.text = focusMode ? "EXIT FOCUS" : "FOCUS";
  });
  dashboardToggle.onPointerUpObservable.add(() => {
    renderDashboard();
    dashboardOverlay.isVisible = true;
  });
  dashboardClose.onPointerUpObservable.add(() => {
    dashboardOverlay.isVisible = false;
  });
  missionButtons.forEach((missionButton, index) => missionButton.onPointerUpObservable.add(() => selectMission(visibleMissionIndexes[index])));
  deckButton.onPointerUpObservable.add(() => {
    missionDeckPage = (missionDeckPage + 1) % Math.ceil(MISSIONS.length / 3);
    refreshMissionDeck();
  });
  functionEntry.onPointerUpObservable.add(() => selectMission(2));
  programEntry.onPointerUpObservable.add(() => selectMission(3));
  nextMissionAction.onPointerUpObservable.add(() => {
    const targetIndex = Number(nextMissionAction.metadata ?? 0);
    missionDeckPage = Math.floor(targetIndex / 3);
    refreshMissionDeck();
    selectMission(targetIndex);
    startRound();
  });

  scene.onBeforeRenderObservable.add(() => {
    arena.tick();
    if (demoMode) {
      demoDelay -= engine.getDeltaTime();
      if (demoDelay <= 0 && arena.status === "idle") startRound();
      if (arena.status === "playing") {
        demoAccumulator += engine.getDeltaTime();
        if (demoAccumulator > 35) {
          const next = arena.target[arena.index];
          const atIndentationStart = next === " " && (arena.index === 0 || arena.target[arena.index - 1] === "\n");
          if (next) arena.handleKey(next === "\n" ? "Enter" : atIndentationStart ? "Tab" : next);
          demoAccumulator = 0;
        }
      }
    }
    if (arena.status === "complete" && !overlay.isVisible) showResult();
    updateHud();

    const compact = engine.getRenderWidth() < 800;
    const condensed = compact || focusMode;
    if (condensed !== lastCompact) {
      lastCompact = condensed;
      missionRail.isVisible = !condensed;
      telemetry.isVisible = !condensed;
      footer.isVisible = !condensed;
      identity.isVisible = !compact;
      soundToggle.isVisible = !compact;
      focusToggle.isVisible = !compact;
      arenaGrid.setColumnDefinition(0, condensed ? 0 : 238, true);
      arenaGrid.setColumnDefinition(1, 1, false);
      arenaGrid.setColumnDefinition(2, condensed ? 0 : 248, true);
      headerGrid.setColumnDefinition(0, compact ? 0 : 1, false);
      headerGrid.setColumnDefinition(1, 1, false);
      headerGrid.setColumnDefinition(2, compact ? 0 : 92, true);
      headerGrid.setColumnDefinition(3, compact ? 0 : 104, true);
      statusStrip.setColumnDefinition(1, compact ? 72 : 112, true);
      xpStack.width = compact ? "172px" : "230px";
      terminal.paddingLeft = condensed ? "12px" : "22px";
      terminal.paddingRight = condensed ? "12px" : "22px";
      conceptText.fontSize = compact ? 13 : 16;
      inputHint.fontSize = compact ? 13 : 14;
      characterCount.fontSize = compact ? 13 : 14;
      codeContainer.height = compact ? "280px" : "360px";
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
