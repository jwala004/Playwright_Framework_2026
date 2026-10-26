# Top 15 must-practice puzzles:

1. Three switches and one bulb
Three switches are outside a closed room; one controls a bulb inside. You can enter the room only once. Identify the correct switch.
Tests: hypothesis formation, observation, and reasoning under constraints.


2. Find the heavier ball
Eight identical-looking balls, one heavier. Find it using only two weighings on a balance scale.
Tests: decision trees and minimizing test steps.


3. Measure 45 minutes using two ropes
Each rope takes exactly 60 minutes to burn but burns unevenly. Measure 45 minutes.
Tests: constraint-based reasoning and timing logic.


4. Three incorrectly labeled boxes
Boxes contain apples, oranges, or a mixture. Every label is wrong. Identify all contents by drawing one fruit from one box.
Tests: inference, elimination, and choosing the most informative test.


5. Bridge and torch puzzle
Four people take 1, 2, 7, and 10 minutes to cross. Only two can cross together, and they need one torch. Minimize total time.
Tests: optimization, trade-offs, and sequencing.


6. Measure exactly 4 litres
Using a 3-litre jug and a 5-litre jug, measure exactly 4 litres without measurement markings.
Tests: state transitions and boundary conditions.


7. Two eggs and 100 floors
Find the highest floor from which an egg can be dropped without breaking, using at most two eggs. Minimize the worst-case number of drops.
Tests: worst-case optimization, adaptive testing, and risk reduction.


8. Find one poisoned bottle
One of 1,000 bottles is poisoned. You have 10 binary-result testing strips and only one testing round. Identify the bottle.
Tests: binary encoding, parallel experiments, and test coverage.


9. The Monty Hall problem
You choose one of three doors. The host opens a losing door and offers you a switch. Should you switch?
Tests: probability, assumptions, and validating intuition.


10. Find the missing number
Example: 2, 6, 12, 20, 30, ?
Tests: pattern recognition and explaining why a rule fits.


11. Find two numbers that sum to a target
Given an array and a target, return the indices of two numbers whose sum equals the target.
Tests: arrays, hash maps, duplicate handling, and \(O(n)\) optimization.


12. Find the first non-repeating character
Input: "swiss" → Output: "w".
Tests: strings, maps, ordering, and empty-input handling.


13. Merge overlapping intervals
Input: [[1,3],[2,6],[8,10],[9,12]]
Output: [[1,6],[8,12]]
Tests: sorting, algorithm design, and boundary handling.


14. Detect a cycle in a linked list
Determine whether a linked list loops back to a previous node without using extra storage.
Tests: pointers, termination, and space complexity.


15. Design a reliable parallel test execution strategy
A suite passes locally but fails intermittently in CI when 20 workers run tests simultaneously. Find the likely causes and design a robust solution.
Senior SDET
Tests: race conditions, test isolation, shared data, retries, observability, and CI debugging.

16. A woman lives on the 30th floor of a building. Every morning, she takes the elevator down to the ground floor and leaves for work. When she returns, she takes the elevator only up to the 20th floor and walks the remaining 10 floors up to her apartment. However, on rainy days, she takes the elevator directly to the 30th floor. Why?

The answer is that the woman is short! 😄
She lives on the 30th floor, but when she returns home, she can only reach the button for the 20th floor because she cannot reach the 30th-floor button.
- On normal days: She presses the 20th-floor button and walks the remaining 10 floors up the stairs.
- On rainy days: She carries an umbrella and uses it to press the 30th-floor button, allowing her to reach her apartment directly.
Interview takeaway: This puzzle tests lateral thinking. The key is to question the assumption that she can physically reach every button in the elevator.





# 2. Senior SDET-specific puzzles and scenarios

| Interview Problem | What the Interviewer Evaluates |
|---|---|
| Tests pass locally but fail in GitHub Actions | Environment differences, file paths, configuration, environment variables, timing issues, and CI debugging |
| Tests fail only during parallel execution | Shared state, worker isolation, race conditions, concurrent execution, and test independence |
| API returns 10,000 records; how would you validate them efficiently? | Pagination, batching, schema validation, data integrity, response time, and performance optimization |
| Retry mechanism hides intermittent failures | Flaky-test analysis, retry policies, root-cause investigation, failure classification, and reporting |
| Test execution takes 90 minutes; how would you reduce it? | Parallelization, bottleneck analysis, test selection, execution profiling, and CI optimization |
| A UI test passes despite an incorrect backend response | Independent assertions, API validation, UI-to-backend consistency, and end-to-end test validity |
| Test data gets corrupted across workers | Test data factories, unique test data, worker isolation, cleanup strategies, and concurrency control |
| An API intermittently returns HTTP 429 or 503 | Rate limiting, exponential backoff, retry policies, idempotency, service resilience, and error handling |
| A locator matches multiple elements | Locator uniqueness, semantic selectors, strict-mode handling, DOM analysis, and robust locator design |
| An AI agent produces inconsistent results | Nondeterminism, evaluation datasets, response quality thresholds, tool-call validation, trace analysis, and reproducibility |
| A test suite has a 99% pass rate but still misses production bugs | Coverage quality, risk-based testing, assertion effectiveness, mutation testing, and production defect analysis |
| Design a test framework for multiple environments | Framework architecture, fixtures, configuration management, environment isolation, maintainability, and scalability |


# 3. Coding puzzles to master in TypeScript and Java
Prioritize these in this order.

# Level 1 — Must solve independently
Frequency map, character count, reverse string, palindrome, duplicates in arrays, missing number, second-largest element, anagrams.


# Level 2 — Strong SDET
Two Sum, sliding window, binary search, merge intervals, stack-based problems, sorting, recursion, time complexity.


# Level 3 — Senior SDET
Concurrency, thread-safe test data, producer-consumer patterns, rate limiting, retries with backoff, API response validation, test scheduling, distributed failure diagnosis.
