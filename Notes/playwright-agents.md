# Playwright Agents EXPLAINED: 
# Master the 🧠 Planner Agent to Auto-Generate Test Plans
Playwright comes with three Playwright Agents out of the box: 
🎭 planner, 🎭 generator and 🎭 healer.
These agents can be used independently, sequentially, or as the chained calls in the agentic loop. Using them sequentially will produce test coverage for your product.

Command: - (To setup agents)
npx playwright init-agents --loop=vscode (we can aslo pass --loop=claude)

==> To be Noted, playwright mcp server will be installed along with these agents

# 🎭 Planner
Planner agent explores your app and produces a test plan for one or many scenarios and user flows.
Planner produces a Markdown test plan

Input:
- A clear request to the planner (e.g., “Generate a plan for Login functionality.”)
- A seed test that sets up the environment necessary to interact with your app
- (optional) A Product Requirement Document (PRD) for context

Output:
- A Markdown test plan saved as specs/basic-operations.md.
- The plan is human-readable but precise enough for test generation.

Prompt: -
Generate a Test plan for https://www.saucedemo.com/ login functionality use playwright agents planner.

# Playwright Test Agents  - Generator

🎭 Generator
Generator agent uses the Markdown plan to produce executable Playwright Tests. It verifies selectors and assertions live as it performs the scenarios.

Input:
Markdown plan
We can provide  markdown test plan in the context of the generator. This is how the generator knows where to get the test plan from. Alternatively, you can mention the file name in the prompt.

Output:
A test suite under tests/
Generated tests may include initial errors that can be healed automatically by the healer agent

Prompt: -
generate a playwright test script for scenarios -### 1. Standard User Login (Happy Path) &  ### 3. Locked Out User
/* comment start
-> markdown test plan is attached as context
### 1. Standard User Login (Happy Path) &  ### 3. Locked Out User (these 2 scenarios are available or present in the test plan)
comment ends */

