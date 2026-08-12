# PyType Arena — 파이썬 타자 연습 게임

> 파이썬 코드를 직접 타이핑하며 문법 감각과 타자 속도를 함께 키우는 인터랙티브 학습 게임입니다.

## 🔗 바로 플레이하기

**[https://shinepcs.github.io/python-typing-game/](https://shinepcs.github.io/python-typing-game/)**

별도 설치 없이 브라우저에서 즉시 실행됩니다.

---

## 주요 기능

| 기능 | 설명 |
|---|---|
| **실용 코드 연습** | 실제 실행 가능한 함수·프로그램 단위 파이썬 코드(주석 포함) 타이핑 |
| **연속 워밍업 세트** | 5개·20개 항목을 한 번에 연속으로 연습 |
| **VS Code 스타일 자동 들여쓰기** | Enter 후 다음 줄 들여쓰기 자동 적용, Tab 한 번으로 처리 |
| **분당 타수(CPM) 계기판** | 정확도·분당 타수·콤보를 실시간 표시 |
| **성장 대시보드** | 최근 12개 세션의 분당 타수 추이·최고 기록·평균을 그래프로 확인 |
| **오타 피드백** | 오타 발생 시 해당 글자 셀이 빨간색으로 번쩍임 |
| **학습 기록 저장** | XP·레벨·연속 학습 일수·최고 기록을 브라우저에 자동 저장 |
| **집중 모드** | `Alt+F`로 사이드 패널 숨김, 코드에만 집중 |
| **사운드 피드백** | `Alt+S`로 타이핑 효과음 토글 |
| **반응형 지원** | 모바일·태블릿 화면 대응 |

---

## 키보드 단축키

| 키 | 동작 |
|---|---|
| `Tab` | 들여쓰기 (자동 적용된 경우 한 번에 소모) |
| `Enter` | 줄 바꿈 + 다음 줄 들여쓰기 자동 적용 |
| `Backspace` | 현재 줄 입력 수정 |
| `Esc` | 일시정지 / 재개 |
| `Alt+F` | 집중 모드 토글 |
| `Alt+S` | 사운드 토글 |

---

## 기술 스택

- **프레임워크**: React 19 + Vite + TypeScript
- **게임 렌더링**: Babylon.js 9 + @babylonjs/gui (전체화면 캔버스 UI)
- **스타일**: Tailwind CSS 4 + shadcn/ui
- **폰트**: IBM Plex Mono · Space Grotesk · Noto Sans KR
- **학습 기록**: 브라우저 localStorage (서버 불필요)
- **배포**: GitHub Pages (정적 빌드, 외부 서버 의존 없음)

---

## 로컬 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm dev

# GitHub Pages용 빌드
GITHUB_PAGES=true pnpm build

# 테스트
pnpm exec vitest run client/src/game/TypingArena.test.ts
```

---

## 라이선스

MIT
