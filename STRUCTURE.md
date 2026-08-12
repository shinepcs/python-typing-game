# PyType Arena 구조

## 레이어

| 레이어 | 책임 | 핵심 파일 |
| --- | --- | --- |
| React 프레임 | 캔버스 수명, 레이아웃, 반응형 프레임 | `client/src/App.tsx`, `components/GameCanvas.tsx` |
| 게임 세계 | 게임 장면·입력·HUD 렌더·정리 | `client/src/game/scene.ts`, `game/TypingArena.ts` |
| 데이터 | 난이도별 파이썬 스니펫 및 미션 정의 | `client/src/game/snippets.ts` |
| 시각 시스템 | 배경·그리드·코드·계기판의 Babylon GUI 표현 | `client/src/game/scene.ts` |

## 상태 모델

`TypingArena`는 `idle`, `playing`, `paused`, `complete` 상태를 가진다. 상태 객체는 선택 미션, 문자 인덱스, 총 키 입력, 오류 수, 정확 입력 수, 시작 시각, 일시정지 누적 시간, 타이머를 소유한다. 렌더러는 상태를 읽어 코드 색상·타이머·WPM·정확도·콤보를 갱신하며, 게임 규칙은 렌더 노드에 저장하지 않는다.

## 입력 의미론

`TypingArena.handleKey(key)`는 키보드 원시 이벤트를 예상 문자와 비교한다. `Backspace`는 마지막 성공 입력을 되돌리고, `Escape`는 일시정지 토글, `Enter`는 줄바꿈을 입력한다. 코드 문자열의 특수문자는 일반 문자처럼 평가한다.

## Asset Hints

| 자산 | 용도 | 화면 크기 |
| --- | --- | --- |
| command deck | 게임 배경의 터미널 질감 | 1920×1080, viewport cover |
| visual target | 미션 레일의 흐린 프리뷰 | 400×225 px |
| streak badge | 성과 카드의 시각적 보상 | 112×112 px |
| logo | 헤더와 시작 화면의 브랜드 기호 | 44×44 px |
