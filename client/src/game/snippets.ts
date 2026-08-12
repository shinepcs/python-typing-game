export type Difficulty = "워밍업" | "기초" | "실전";
export type PracticeKind = "word" | "function" | "program";

export type Mission = {
  id: string;
  difficulty: Difficulty;
  kind: PracticeKind;
  title: string;
  concept: string;
  focus: string;
  code: string;
  timeLimit: number;
  reward: number;
  setItems?: string[];
};

// ── 단어 풀 (120개) ────────────────────────────────────────────────────
export const WORD_POOL: string[] = [
  // 키워드
  "async", "await", "yield", "match", "pass", "break", "continue",
  "return", "raise", "import", "from", "class", "def", "lambda",
  "global", "nonlocal", "assert", "del", "with", "as", "try",
  "except", "finally", "elif", "else", "while", "for", "in",
  "not", "and", "or", "is", "if",
  // 내장 함수
  "print()", "input()", "range()", "len()", "sum()", "min()", "max()",
  "abs()", "round()", "sorted()", "reversed()", "enumerate()",
  "zip()", "map()", "filter()", "any()", "all()", "open()",
  "int()", "str()", "float()", "bool()", "list()", "dict()",
  "set()", "tuple()", "type()", "isinstance()", "hasattr()",
  "getattr()", "setattr()", "vars()", "dir()", "repr()",
  "hash()", "id()", "iter()", "next()", "chr()", "ord()",
  // 자료형 메서드
  "split()", "strip()", "lower()", "upper()", "replace()",
  "startswith()", "endswith()", "join()", "format()", "count()",
  "find()", "index()", "append()", "extend()", "insert()",
  "remove()", "pop()", "clear()", "copy()", "update()",
  "keys()", "values()", "items()", "get()", "setdefault()",
  "add()", "discard()", "union()", "intersection()", "difference()",
  // 상수·리터럴
  "True", "False", "None", "Ellipsis", "NotImplemented",
  // 예외
  "ValueError", "TypeError", "KeyError", "IndexError",
  "AttributeError", "NameError", "RuntimeError", "StopIteration",
  "FileNotFoundError", "PermissionError", "OSError",
  // 타입 힌트
  "int", "str", "float", "bool", "list", "dict", "set", "tuple",
  "Optional", "Union", "Any", "Callable", "Iterator", "Generator",
  // 데코레이터·특수
  "@property", "@staticmethod", "@classmethod", "@dataclass",
  "__init__", "__str__", "__repr__", "__len__", "__iter__",
];

/** 배열을 제자리 셔플(Fisher-Yates) */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 단어 풀에서 n개를 랜덤 선택 */
export function pickWords(n = 20): string[] {
  return shuffle(WORD_POOL).slice(0, n);
}

// ── 함수 코드 풀 (난이도별) ───────────────────────────────────────────
export const FUNCTION_POOL: { difficulty: "기초" | "실전"; code: string }[] = [
  // ── 기초 ──
  { difficulty: "기초", code: "# Convert raw scores into an average report.\ndef build_score_report(raw_scores: list[str]) -> dict[str, float]:\n    scores = [int(v) for v in raw_scores if v.isdigit()]\n    if not scores:\n        return {\"count\": 0, \"average\": 0.0}\n    return {\"count\": len(scores), \"average\": round(sum(scores) / len(scores), 1)}\n\nprint(build_score_report([\"88\", \"91\", \"skip\", \"76\"]))" },
  { difficulty: "기초", code: "# Count word frequencies in a sentence.\ndef word_count(sentence: str) -> dict[str, int]:\n    counts: dict[str, int] = {}\n    for word in sentence.lower().split():\n        counts[word] = counts.get(word, 0) + 1\n    return counts\n\nprint(word_count(\"the cat sat on the mat\"))" },
  { difficulty: "기초", code: "# Check if a string is a palindrome.\ndef is_palindrome(text: str) -> bool:\n    cleaned = \"\".join(ch.lower() for ch in text if ch.isalnum())\n    return cleaned == cleaned[::-1]\n\nprint(is_palindrome(\"A man a plan a canal Panama\"))" },
  { difficulty: "기초", code: "# Return the n-th Fibonacci number.\ndef fibonacci(n: int) -> int:\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n\nprint([fibonacci(i) for i in range(10)])" },
  { difficulty: "기초", code: "# Flatten a nested list one level deep.\ndef flatten(nested: list[list]) -> list:\n    return [item for sublist in nested for item in sublist]\n\nprint(flatten([[1, 2], [3, 4], [5]]))" },
  { difficulty: "기초", code: "# Remove duplicates while preserving order.\ndef unique(items: list) -> list:\n    seen: set = set()\n    result = []\n    for item in items:\n        if item not in seen:\n            seen.add(item)\n            result.append(item)\n    return result\n\nprint(unique([3, 1, 4, 1, 5, 9, 2, 6, 5]))" },
  { difficulty: "기초", code: "# Convert Celsius to Fahrenheit.\ndef celsius_to_fahrenheit(c: float) -> float:\n    return round(c * 9 / 5 + 32, 2)\n\nfor temp in [0, 20, 37, 100]:\n    print(f\"{temp}°C = {celsius_to_fahrenheit(temp)}°F\")" },
  { difficulty: "기초", code: "# Check if a number is prime.\ndef is_prime(n: int) -> bool:\n    if n < 2:\n        return False\n    for i in range(2, int(n ** 0.5) + 1):\n        if n % i == 0:\n            return False\n    return True\n\nprimes = [n for n in range(2, 30) if is_prime(n)]\nprint(primes)" },
  { difficulty: "기초", code: "# Group items by a key function.\ndef group_by(items: list, key) -> dict:\n    groups: dict = {}\n    for item in items:\n        k = key(item)\n        groups.setdefault(k, []).append(item)\n    return groups\n\nwords = [\"apple\", \"banana\", \"avocado\", \"blueberry\", \"cherry\"]\nprint(group_by(words, lambda w: w[0]))" },
  { difficulty: "기초", code: "# Compute the greatest common divisor.\ndef gcd(a: int, b: int) -> int:\n    while b:\n        a, b = b, a % b\n    return a\n\nprint(gcd(48, 18))\nprint(gcd(100, 75))" },
  { difficulty: "기초", code: "# Chunk a list into fixed-size pieces.\ndef chunk(lst: list, size: int) -> list[list]:\n    return [lst[i:i + size] for i in range(0, len(lst), size)]\n\nprint(chunk(list(range(10)), 3))" },
  { difficulty: "기초", code: "# Clamp a value between min and max.\ndef clamp(value: float, lo: float, hi: float) -> float:\n    return max(lo, min(hi, value))\n\nfor v in [-5, 0, 50, 105]:\n    print(f\"clamp({v}, 0, 100) = {clamp(v, 0, 100)}\")" },
  { difficulty: "기초", code: "# Count vowels in a string.\ndef count_vowels(text: str) -> int:\n    return sum(1 for ch in text.lower() if ch in \"aeiou\")\n\nprint(count_vowels(\"Hello, World!\"))\nprint(count_vowels(\"Python programming\"))" },
  { difficulty: "기초", code: "# Reverse words in a sentence.\ndef reverse_words(sentence: str) -> str:\n    return \" \".join(sentence.split()[::-1])\n\nprint(reverse_words(\"Hello World from Python\"))" },
  { difficulty: "기초", code: "# Find the two largest numbers.\ndef two_largest(nums: list[int]) -> tuple[int, int]:\n    first, second = sorted(set(nums), reverse=True)[:2]\n    return first, second\n\nprint(two_largest([3, 1, 4, 1, 5, 9, 2, 6]))" },
  // ── 실전 ──
  { difficulty: "실전", code: "# Binary search on a sorted list.\ndef binary_search(arr: list[int], target: int) -> int:\n    lo, hi = 0, len(arr) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1\n\ndata = list(range(0, 100, 2))\nprint(binary_search(data, 42))" },
  { difficulty: "실전", code: "# Merge two sorted lists into one.\ndef merge_sorted(a: list[int], b: list[int]) -> list[int]:\n    result, i, j = [], 0, 0\n    while i < len(a) and j < len(b):\n        if a[i] <= b[j]:\n            result.append(a[i]); i += 1\n        else:\n            result.append(b[j]); j += 1\n    return result + a[i:] + b[j:]\n\nprint(merge_sorted([1, 3, 5], [2, 4, 6]))" },
  { difficulty: "실전", code: "# Memoized recursive Fibonacci.\nfrom functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib(n: int) -> int:\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\nprint([fib(i) for i in range(15)])" },
  { difficulty: "실전", code: "# Deep flatten a nested list of any depth.\ndef deep_flatten(nested) -> list:\n    result = []\n    for item in nested:\n        if isinstance(item, list):\n            result.extend(deep_flatten(item))\n        else:\n            result.append(item)\n    return result\n\nprint(deep_flatten([1, [2, [3, [4]], 5]]))" },
  { difficulty: "실전", code: "# Run-length encode a string.\ndef rle_encode(s: str) -> str:\n    if not s:\n        return \"\"\n    result, count, prev = [], 1, s[0]\n    for ch in s[1:]:\n        if ch == prev:\n            count += 1\n        else:\n            result.append(f\"{count}{prev}\" if count > 1 else prev)\n            prev, count = ch, 1\n    result.append(f\"{count}{prev}\" if count > 1 else prev)\n    return \"\".join(result)\n\nprint(rle_encode(\"aaabbbccddddee\"))" },
  { difficulty: "실전", code: "# Rotate a matrix 90 degrees clockwise.\ndef rotate_90(matrix: list[list[int]]) -> list[list[int]]:\n    return [list(row) for row in zip(*matrix[::-1])]\n\nm = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\nfor row in rotate_90(m):\n    print(row)" },
  { difficulty: "실전", code: "# Topological sort using DFS.\ndef topo_sort(graph: dict[str, list[str]]) -> list[str]:\n    visited: set[str] = set()\n    order: list[str] = []\n    def dfs(node: str) -> None:\n        if node in visited:\n            return\n        visited.add(node)\n        for neighbor in graph.get(node, []):\n            dfs(neighbor)\n        order.append(node)\n    for node in graph:\n        dfs(node)\n    return order[::-1]\n\ng = {\"a\": [\"b\", \"c\"], \"b\": [\"d\"], \"c\": [\"d\"], \"d\": []}\nprint(topo_sort(g))" },
  { difficulty: "실전", code: "# LRU cache implementation using OrderedDict.\nfrom collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity: int) -> None:\n        self.cap = capacity\n        self.cache: OrderedDict = OrderedDict()\n\n    def get(self, key: int) -> int:\n        if key not in self.cache:\n            return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n\n    def put(self, key: int, value: int) -> None:\n        self.cache[key] = value\n        self.cache.move_to_end(key)\n        if len(self.cache) > self.cap:\n            self.cache.popitem(last=False)\n\ncache = LRUCache(2)\ncache.put(1, 10)\ncache.put(2, 20)\nprint(cache.get(1))" },
  { difficulty: "실전", code: "# Parse a simple CSV line respecting quoted fields.\ndef parse_csv_line(line: str) -> list[str]:\n    fields, current, in_quotes = [], [], False\n    for ch in line:\n        if ch == '\"':\n            in_quotes = not in_quotes\n        elif ch == ',' and not in_quotes:\n            fields.append(\"\".join(current))\n            current = []\n        else:\n            current.append(ch)\n    fields.append(\"\".join(current))\n    return fields\n\nprint(parse_csv_line('Alice,\"New York, NY\",30'))" },
  { difficulty: "실전", code: "# Sliding window maximum.\nfrom collections import deque\n\ndef sliding_max(nums: list[int], k: int) -> list[int]:\n    dq: deque[int] = deque()\n    result: list[int] = []\n    for i, n in enumerate(nums):\n        while dq and nums[dq[-1]] <= n:\n            dq.pop()\n        dq.append(i)\n        if dq[0] == i - k:\n            dq.popleft()\n        if i >= k - 1:\n            result.append(nums[dq[0]])\n    return result\n\nprint(sliding_max([1, 3, -1, -3, 5, 3, 6, 7], 3))" },
  { difficulty: "실전", code: "# Validate balanced parentheses.\ndef is_balanced(s: str) -> bool:\n    stack: list[str] = []\n    pairs = {')': '(', ']': '[', '}': '{'}\n    for ch in s:\n        if ch in '([{':\n            stack.append(ch)\n        elif ch in ')]}':\n            if not stack or stack[-1] != pairs[ch]:\n                return False\n            stack.pop()\n    return not stack\n\nfor expr in [\"({[]})\", \"([)]\", \"{{}}\"]:\n    print(f\"{expr}: {is_balanced(expr)}\")" },
  { difficulty: "실전", code: "# Quicksort implementation.\ndef quicksort(arr: list[int]) -> list[int]:\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)\n\nimport random\ndata = random.sample(range(50), 10)\nprint(\"before:\", data)\nprint(\"after: \", quicksort(data))" },
  { difficulty: "실전", code: "# Dijkstra shortest path.\nimport heapq\n\ndef dijkstra(graph: dict, start: str) -> dict[str, float]:\n    dist = {node: float('inf') for node in graph}\n    dist[start] = 0\n    heap = [(0, start)]\n    while heap:\n        d, u = heapq.heappop(heap)\n        if d > dist[u]:\n            continue\n        for v, w in graph[u]:\n            if dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n                heapq.heappush(heap, (dist[v], v))\n    return dist\n\ng = {\"A\": [(\"B\", 1), (\"C\", 4)], \"B\": [(\"C\", 2), (\"D\", 5)], \"C\": [(\"D\", 1)], \"D\": []}\nprint(dijkstra(g, \"A\"))" },
];

// ── 프로그램 코드 풀 ──────────────────────────────────────────────────
export const PROGRAM_POOL: { difficulty: "기초" | "실전"; code: string }[] = [
  { difficulty: "기초", code: "# Save completed tasks and show a concise terminal summary.\nfrom dataclasses import dataclass\n\n@dataclass\nclass Task:\n    title: str\n    done: bool = False\n\ndef summarize(tasks: list[Task]) -> str:\n    completed = sum(task.done for task in tasks)\n    return f\"{completed}/{len(tasks)} tasks complete\"\n\ndef main() -> None:\n    tasks = [Task(\"read docs\", True), Task(\"write tests\")]\n    print(summarize(tasks))\n\nif __name__ == \"__main__\":\n    main()" },
  { difficulty: "기초", code: "# Simple grade calculator from a list of scores.\ndef letter_grade(score: int) -> str:\n    if score >= 90: return \"A\"\n    if score >= 80: return \"B\"\n    if score >= 70: return \"C\"\n    if score >= 60: return \"D\"\n    return \"F\"\n\ndef main() -> None:\n    scores = [95, 82, 67, 55, 78]\n    for i, s in enumerate(scores, 1):\n        print(f\"Student {i}: {s} -> {letter_grade(s)}\")\n\nif __name__ == \"__main__\":\n    main()" },
  { difficulty: "기초", code: "# Word frequency counter for a text file simulation.\ndef top_words(text: str, n: int = 5) -> list[tuple[str, int]]:\n    counts: dict[str, int] = {}\n    for word in text.lower().split():\n        word = word.strip(\".,!?\")\n        counts[word] = counts.get(word, 0) + 1\n    return sorted(counts.items(), key=lambda x: x[1], reverse=True)[:n]\n\ndef main() -> None:\n    sample = \"the quick brown fox jumps over the lazy dog the fox\"\n    for word, count in top_words(sample):\n        print(f\"{word}: {count}\")\n\nif __name__ == \"__main__\":\n    main()" },
  { difficulty: "기초", code: "# Simple number guessing game logic.\nimport random\n\ndef play_game(secret: int, guesses: list[int]) -> str:\n    for attempt, guess in enumerate(guesses, 1):\n        if guess == secret:\n            return f\"Correct in {attempt} attempt(s)!\"\n        hint = \"too high\" if guess > secret else \"too low\"\n        print(f\"Guess {attempt}: {guess} is {hint}\")\n    return f\"Failed. The number was {secret}.\"\n\ndef main() -> None:\n    secret = random.randint(1, 20)\n    print(play_game(secret, [10, 15, secret]))\n\nif __name__ == \"__main__\":\n    main()" },
  { difficulty: "기초", code: "# Contact book with add, search, and list.\nclass ContactBook:\n    def __init__(self) -> None:\n        self._contacts: dict[str, str] = {}\n\n    def add(self, name: str, phone: str) -> None:\n        self._contacts[name] = phone\n\n    def search(self, name: str) -> str:\n        return self._contacts.get(name, \"Not found\")\n\n    def list_all(self) -> list[str]:\n        return [f\"{n}: {p}\" for n, p in sorted(self._contacts.items())]\n\ndef main() -> None:\n    book = ContactBook()\n    book.add(\"Alice\", \"010-1234\")\n    book.add(\"Bob\", \"010-5678\")\n    print(book.search(\"Alice\"))\n    print(*book.list_all(), sep=\"\\n\")\n\nif __name__ == \"__main__\":\n    main()" },
  { difficulty: "기초", code: "# Simple bank account simulation.\nclass BankAccount:\n    def __init__(self, owner: str, balance: float = 0.0) -> None:\n        self.owner = owner\n        self._balance = balance\n\n    def deposit(self, amount: float) -> None:\n        self._balance += amount\n\n    def withdraw(self, amount: float) -> bool:\n        if amount > self._balance:\n            return False\n        self._balance -= amount\n        return True\n\n    def __str__(self) -> str:\n        return f\"{self.owner}: ${self._balance:.2f}\"\n\ndef main() -> None:\n    acc = BankAccount(\"Alice\", 1000)\n    acc.deposit(500)\n    print(acc.withdraw(200), acc)\n\nif __name__ == \"__main__\":\n    main()" },
  { difficulty: "기초", code: "# Temperature log analyzer.\ndef analyze_temps(readings: list[float]) -> dict:\n    return {\n        \"min\": min(readings),\n        \"max\": max(readings),\n        \"avg\": round(sum(readings) / len(readings), 1),\n        \"range\": round(max(readings) - min(readings), 1),\n    }\n\ndef main() -> None:\n    temps = [22.1, 25.3, 19.8, 28.0, 21.5, 24.7]\n    stats = analyze_temps(temps)\n    for key, val in stats.items():\n        print(f\"{key}: {val}\")\n\nif __name__ == \"__main__\":\n    main()" },
  { difficulty: "기초", code: "# Simple stack implementation.\nclass Stack:\n    def __init__(self) -> None:\n        self._data: list = []\n\n    def push(self, item) -> None:\n        self._data.append(item)\n\n    def pop(self):\n        if self.is_empty():\n            raise IndexError(\"Stack is empty\")\n        return self._data.pop()\n\n    def peek(self):\n        return self._data[-1] if self._data else None\n\n    def is_empty(self) -> bool:\n        return len(self._data) == 0\n\ndef main() -> None:\n    s = Stack()\n    for i in [1, 2, 3]:\n        s.push(i)\n    print(s.pop(), s.peek())\n\nif __name__ == \"__main__\":\n    main()" },
  { difficulty: "실전", code: "# CSV parser and aggregator.\nimport csv\nimport io\n\ndef parse_and_sum(csv_text: str, col: str) -> float:\n    reader = csv.DictReader(io.StringIO(csv_text))\n    return sum(float(row[col]) for row in reader)\n\ndef main() -> None:\n    data = \"name,score\\nAlice,88\\nBob,92\\nCarol,76\"\n    total = parse_and_sum(data, \"score\")\n    print(f\"Total score: {total}\")\n    print(f\"Average: {total / 3:.1f}\")\n\nif __name__ == \"__main__\":\n    main()" },
  { difficulty: "실전", code: "# Event system with subscribe and publish.\nfrom collections import defaultdict\nfrom typing import Callable\n\nclass EventBus:\n    def __init__(self) -> None:\n        self._handlers: dict[str, list[Callable]] = defaultdict(list)\n\n    def subscribe(self, event: str, handler: Callable) -> None:\n        self._handlers[event].append(handler)\n\n    def publish(self, event: str, **data) -> None:\n        for handler in self._handlers[event]:\n            handler(**data)\n\ndef main() -> None:\n    bus = EventBus()\n    bus.subscribe(\"login\", lambda user: print(f\"{user} logged in\"))\n    bus.publish(\"login\", user=\"Alice\")\n\nif __name__ == \"__main__\":\n    main()" },
  { difficulty: "실전", code: "# Retry decorator with exponential backoff.\nimport time\nimport functools\n\ndef retry(max_attempts: int = 3, delay: float = 0.1):\n    def decorator(func):\n        @functools.wraps(func)\n        def wrapper(*args, **kwargs):\n            for attempt in range(1, max_attempts + 1):\n                try:\n                    return func(*args, **kwargs)\n                except Exception as e:\n                    if attempt == max_attempts:\n                        raise\n                    time.sleep(delay * 2 ** attempt)\n        return wrapper\n    return decorator\n\n@retry(max_attempts=3)\ndef unstable() -> str:\n    return \"ok\"\n\ndef main() -> None:\n    print(unstable())\n\nif __name__ == \"__main__\":\n    main()" },
  { difficulty: "실전", code: "# Pipeline pattern for data transformation.\nfrom typing import Callable, TypeVar\n\nT = TypeVar(\"T\")\n\nclass Pipeline:\n    def __init__(self, value) -> None:\n        self._value = value\n\n    def pipe(self, func: Callable) -> \"Pipeline\":\n        self._value = func(self._value)\n        return self\n\n    def result(self):\n        return self._value\n\ndef main() -> None:\n    result = (\n        Pipeline(\"  Hello, World!  \")\n        .pipe(str.strip)\n        .pipe(str.lower)\n        .pipe(lambda s: s.replace(\",\", \"\"))\n        .result()\n    )\n    print(result)\n\nif __name__ == \"__main__\":\n    main()" },
  { difficulty: "실전", code: "# Observer pattern implementation.\nfrom abc import ABC, abstractmethod\n\nclass Observer(ABC):\n    @abstractmethod\n    def update(self, value: int) -> None: ...\n\nclass Subject:\n    def __init__(self) -> None:\n        self._observers: list[Observer] = []\n        self._state = 0\n\n    def attach(self, obs: Observer) -> None:\n        self._observers.append(obs)\n\n    def set_state(self, value: int) -> None:\n        self._state = value\n        for obs in self._observers:\n            obs.update(value)\n\nclass Logger(Observer):\n    def update(self, value: int) -> None:\n        print(f\"State changed to {value}\")\n\ndef main() -> None:\n    s = Subject()\n    s.attach(Logger())\n    s.set_state(42)\n\nif __name__ == \"__main__\":\n    main()" },
  { difficulty: "실전", code: "# Simple dependency injection container.\nfrom typing import Type, TypeVar\n\nT = TypeVar(\"T\")\n\nclass Container:\n    def __init__(self) -> None:\n        self._registry: dict = {}\n\n    def register(self, interface, implementation) -> None:\n        self._registry[interface] = implementation\n\n    def resolve(self, interface: Type[T]) -> T:\n        impl = self._registry.get(interface)\n        if impl is None:\n            raise KeyError(f\"{interface} not registered\")\n        return impl()\n\nclass Greeter:\n    def greet(self) -> str:\n        return \"Hello!\"\n\ndef main() -> None:\n    c = Container()\n    c.register(Greeter, Greeter)\n    print(c.resolve(Greeter).greet())\n\nif __name__ == \"__main__\":\n    main()" },
  { difficulty: "실전", code: "# Async-style task queue simulation.\nfrom collections import deque\nfrom typing import Callable\n\nclass TaskQueue:\n    def __init__(self) -> None:\n        self._queue: deque[Callable] = deque()\n\n    def enqueue(self, task: Callable) -> None:\n        self._queue.append(task)\n\n    def run_all(self) -> None:\n        while self._queue:\n            task = self._queue.popleft()\n            result = task()\n            print(f\"Task done: {result}\")\n\ndef main() -> None:\n    q = TaskQueue()\n    q.enqueue(lambda: \"fetch data\")\n    q.enqueue(lambda: \"process data\")\n    q.enqueue(lambda: \"save results\")\n    q.run_all()\n\nif __name__ == \"__main__\":\n    main()" },
];

/** 함수 코드 풀에서 레벨에 따라 랜덤 선택 */
export function pickFunction(level: number): string {
  const hard = level >= 5;
  const pool = hard
    ? FUNCTION_POOL.filter((f) => f.difficulty === "실전")
    : FUNCTION_POOL.filter((f) => f.difficulty === "기초");
  const fallback = hard ? FUNCTION_POOL : FUNCTION_POOL;
  const candidates = pool.length > 0 ? pool : fallback;
  return candidates[Math.floor(Math.random() * candidates.length)].code;
}

/** 프로그램 코드 풀에서 레벨에 따라 랜덤 선택 */
export function pickProgram(level: number): string {
  const hard = level >= 7;
  const pool = hard
    ? PROGRAM_POOL.filter((p) => p.difficulty === "실전")
    : PROGRAM_POOL.filter((p) => p.difficulty === "기초");
  const fallback = hard ? PROGRAM_POOL : PROGRAM_POOL;
  const candidates = pool.length > 0 ? pool : fallback;
  return candidates[Math.floor(Math.random() * candidates.length)].code;
}

export const MISSIONS: Mission[] = [
  {
    id: "word-practice",
    difficulty: "워밍업",
    kind: "word",
    title: "단어 연습",
    concept: "파이썬 키워드 · 단어 20개",
    focus: "단어 리듬",
    code: "async",
    timeLimit: 90,
    reward: 30,
    setItems: [
      "async", "await", "yield", "match", "print",
      "input", "range", "split", "strip", "lower",
      "upper", "items", "keys()", "sum()", "len()",
      "list()", "dict()", "True", "None", "pass",
    ],
  },
  {
    id: "score-report-function",
    difficulty: "기초",
    kind: "function",
    title: "점수 리포트 함수",
    concept: "function · list · dict",
    focus: "함수 단위 완주",
    code: "# Convert raw scores into an average report.\ndef build_score_report(raw_scores: list[str]) -> dict[str, float]:\n    scores = [int(value) for value in raw_scores if value.isdigit()]\n    if not scores:\n        return {\"count\": 0, \"average\": 0.0}\n\n    average = sum(scores) / len(scores)\n    return {\"count\": len(scores), \"average\": round(average, 1)}\n\nprint(build_score_report([\"88\", \"91\", \"skip\", \"76\"]))",
    timeLimit: 190,
    reward: 420,
  },
  {
    id: "task-summary-program",
    difficulty: "실전",
    kind: "program",
    title: "작업 요약 프로그램",
    concept: "dataclass · main · f-string",
    focus: "프로그램 단위 완주",
    code: "# Save completed tasks and show a concise terminal summary.\nfrom dataclasses import dataclass\n\n@dataclass\nclass Task:\n    title: str\n    done: bool = False\n\ndef summarize(tasks: list[Task]) -> str:\n    completed = sum(task.done for task in tasks)\n    return f\"{completed}/{len(tasks)} tasks complete\"\n\ndef main() -> None:\n    tasks = [Task(\"read docs\", True), Task(\"write tests\")]\n    print(summarize(tasks))\n\nif __name__ == \"__main__\":\n    main()",
    timeLimit: 300,
    reward: 700,
  },
];
