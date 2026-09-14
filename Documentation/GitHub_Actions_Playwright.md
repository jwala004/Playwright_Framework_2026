# GitHub Actions + Playwright: Multi-Environment CI/CD Architecture

Purpose: Configure a Playwright + TypeScript automation framework so that tests can run against multiple environments locally and through GitHub Actions, while keeping credentials secure and supporting both manual execution and scheduled execution.

1. Objective

The goal is to build a Playwright automation framework that supports:

Local execution
Multiple environments: QA, UAT, PROD
Environment-specific URLs
Environment-specific credentials
Secure credential management
GitHub Actions CI execution
Manual environment selection
Automatic daily PROD execution
Playwright HTML reports
GitHub Actions artifact storage

The desired execution model is:
                    Playwright Framework
                           │
             ┌─────────────┴─────────────┐
             │                           │
          LOCAL                      GITHUB ACTIONS
             │                           │
       .env.qa / uat / prod         GitHub Environments
             │                           │
             └─────────────┬─────────────┘
                           │
                           ▼
                     Playwright Tests
                           │
                           ▼
                    HTML Test Report

2. High-Level Architecture

The recommended architecture separates test code, environment configuration, and secrets.
┌────────────────────────────────────────────────────────────┐
│                    PLAYWRIGHT FRAMEWORK                    │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
                  Environment Selection
                            │
             ┌──────────────┼──────────────┐
             │              │              │
             ▼              ▼              ▼
            QA             UAT            PROD
             │              │              │
             ▼              ▼              ▼
        .env.qa        .env.uat       .env.prod
             │              │              │
             └──────────────┼──────────────┘
                            │
                            ▼
                     env.config.ts
                            │
                            ▼
                    process.env values
                            │
                            ▼
                    Playwright Config
                            │
                            ▼
                      Test Execution

In GitHub Actions, the configuration source changes:

LOCAL                              GITHUB ACTIONS
─────                              ───────────────

.env.qa                            QA Environment
.env.uat             ───────►      UAT Environment
.env.prod                           PROD Environment

dotenv                              vars + secrets

The test code remains unchanged.

This is one of the key architectural principles:

Environment configuration should be externalized from the test implementation.

3. Recommended Project Structure

A clean project structure can look like this:
Playwright_Framework_2026/
│
├── .github/
│   └── workflows/
│       └── playwright.yml
│
├── env-files/
│   ├── .env.qa
│   ├── .env.uat
│   └── .env.prod
│
├── config/
│   └── env.config.ts
│
├── tests/
│   ├── login.spec.ts
│   ├── dashboard.spec.ts
│   └── ...
│
├── pages/
│   ├── LoginPage.ts
│   └── DashboardPage.ts
│
├── fixtures/
│   └── ...
│
├── playwright.config.ts
├── package.json
├── package-lock.json
├── .gitignore
└── README.md

Important

The local .env files containing actual credentials should not be committed to GitHub.

For example:

.env.qa       ❌ Do not commit
.env.uat      ❌ Do not commit
.env.prod     ❌ Do not commit

Instead, use:

.env.example  ✅ Safe to commit

containing placeholders:

BASE_URL=
APP_USERNAME=
APP_PASSWORD=

4. Environment Configuration Strategy

Our framework supports:

qa
uat
prod

The environment is selected through:

TEST_ENV

For example:

TEST_ENV=qa

or:

TEST_ENV=uat

or:

TEST_ENV=prod

The framework then dynamically loads:

env-files/.env.qa
env-files/.env.uat
env-files/.env.prod
5. Type-Safe Environment Selection

The framework uses:

const allowedEnvironments = ['qa', 'uat', 'prod'] as const;

type Environment = typeof allowedEnvironments[number];

This gives us the TypeScript union:

type Environment = 'qa' | 'uat' | 'prod';

This is better than simply using:

let environment: string;

because TypeScript now understands that only these values are valid:

'qa'
'uat'
'prod'
Framework-level benefit

This provides:

Compile-time type safety
Restricted environment values
Better IDE autocomplete
Easier maintenance
Fewer accidental environment names
6. Dynamic .env Loading

The framework constructs the environment file dynamically:

const envFilePath = path.resolve(
    process.cwd(),
    `env-files/.env.${environment}`
);

Therefore:

TEST_ENV=qa
       ↓
.env.qa

TEST_ENV=uat
       ↓
.env.uat

TEST_ENV=prod
       ↓
.env.prod

Then:

dotenv.config({
    path: envFilePath
});

loads the selected environment.

7. Environment Validation

The framework validates the environment before execution:

if (!allowedEnvironments.includes(environment as Environment)) {
    throw new Error(
        `Invalid TEST_ENV: "${environment}". ` +
        `Allowed environments: ${allowedEnvironments.join(', ')}`
    );
}

This prevents accidental execution such as:

TEST_ENV=production

when only:

qa
uat
prod

are supported.

8. Required Environment Variables

The framework requires:

BASE_URL
APP_USERNAME
APP_PASSWORD

The helper method:

function getRequiredEnvVariable(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(
            `Missing required environment variable "${name}"`
        );
    }

    return value;
}

provides fail-fast validation.

Therefore, instead of tests failing later with something like:

Login failed

the framework immediately reports:

Missing required environment variable "APP_PASSWORD"

This is a good framework design practice.

9. Local Environment Configuration

For local execution:

env-files/
│
├── .env.qa
├── .env.uat
└── .env.prod

Example:

.env.qa
BASE_URL=https://qa.example.com
APP_USERNAME=qa_user
APP_PASSWORD=qa_password
.env.uat
BASE_URL=https://uat.example.com
APP_USERNAME=uat_user
APP_PASSWORD=uat_password
.env.prod
BASE_URL=https://prod.example.com
APP_USERNAME=prod_user
APP_PASSWORD=prod_password

These files remain local only when they contain real credentials.

10. Package.json Execution Strategy

Environment-specific scripts make local execution simple:

{
  "scripts": {
    "test:qa": "cross-env TEST_ENV=qa playwright test",
    "test:qa:headed": "cross-env TEST_ENV=qa playwright test --headed",

    "test:uat": "cross-env TEST_ENV=uat playwright test",
    "test:uat:headed": "cross-env TEST_ENV=uat playwright test --headed",

    "test:prod": "cross-env TEST_ENV=prod playwright test",
    "test:prod:headed": "cross-env TEST_ENV=prod playwright test --headed"
  }
}

Therefore:

npm run test:qa

means:

TEST_ENV=qa
     ↓
.env.qa
     ↓
QA
     ↓
Playwright

Similarly:

npm run test:uat

and:

npm run test:prod
11. Why GitHub Secrets Are Required

Local .env files are unsuitable for storing credentials in a public repository.

GitHub Actions provides:

Secrets

for sensitive values.

GitHub explicitly recommends using the secrets context for sensitive information. If a referenced secret doesn't exist, GitHub evaluates it as an empty string.

Therefore:

❌ Password in YAML
❌ Password in TypeScript
❌ Password in package.json
❌ Password committed to .env

Instead:

✅ GitHub Environment Secrets
12. GitHub Environment Architecture

Create three GitHub Environments:

Settings
   │
   ▼
Environments
   │
   ├── QA
   ├── UAT
   └── PROD

Each environment represents a different target system.

GitHub Environments can contain their own secrets and variables, and those values are only available to jobs that reference the corresponding environment.

13. Environment Variables vs Environment Secrets

This distinction is extremely important.

Non-sensitive configuration

Use:

Environment Variables

Example:

BASE_URL

GitHub accesses it using:

${{ vars.BASE_URL }}

GitHub describes configuration variables as appropriate for non-sensitive configuration data.

Sensitive configuration

Use:

Environment Secrets

Example:

APP_USERNAME
APP_PASSWORD

Access them using:

${{ secrets.APP_USERNAME }}
${{ secrets.APP_PASSWORD }}
14. Final GitHub Environment Structure
QA
QA
│
├── Environment Variables
│   └── BASE_URL
│
└── Environment Secrets
    ├── APP_USERNAME
    └── APP_PASSWORD
UAT
UAT
│
├── Environment Variables
│   └── BASE_URL
│
└── Environment Secrets
    ├── APP_USERNAME
    └── APP_PASSWORD
PROD
PROD
│
├── Environment Variables
│   └── BASE_URL
│
└── Environment Secrets
    ├── APP_USERNAME
    └── APP_PASSWORD

This is the cleanest model for the framework.

15. Important Lesson: Don't Combine Multiple Secrets

A common mistake is creating:

ENVIRONMENT_SECRETS

with a value such as:

APP_USERNAME:xxxxx
APP_PASSWORD:xxxxx

This does not create:

secrets.APP_USERNAME
secrets.APP_PASSWORD

GitHub treats it as one secret:

secrets.ENVIRONMENT_SECRETS

Therefore, create separate secrets:

APP_USERNAME
APP_PASSWORD

GitHub's secret documentation also recommends avoiding structured data as secret values where possible.

16. GitHub Actions Workflow

The workflow is stored at:

.github/workflows/playwright.yml

A conceptual workflow is:

Trigger
  │
  ├── Manual
  │
  └── Scheduled
        │
        ▼
Select Environment
        │
        ├── Manual → QA/UAT/PROD
        │
        └── Schedule → PROD
        │
        ▼
GitHub Environment
        │
        ├── BASE_URL
        ├── APP_USERNAME
        └── APP_PASSWORD
        │
        ▼
Checkout
        │
        ▼
Setup Node
        │
        ▼
npm ci
        │
        ▼
Install Playwright
        │
        ▼
Run Tests
        │
        ▼
Generate Report
        │
        ▼
Upload Artifact
17. Manual Execution with workflow_dispatch

The manual trigger is:

workflow_dispatch:

It allows users to start the workflow from:

GitHub
  ↓
Actions
  ↓
Playwright Tests
  ↓
Run workflow

We added an environment selector:

workflow_dispatch:
  inputs:
    environment:
      description: 'Select environment'
      required: true
      type: choice
      options:
        - QA
        - UAT
        - PROD

This gives the user a dropdown:

┌─────────────────────────────┐
│ Environment                 │
│                             │
│ ▼ QA                        │
│   UAT                       │
│   PROD                      │
└─────────────────────────────┘

GitHub supports choice inputs for workflow_dispatch.

18. Manual Execution Flow
User
 │
 ▼
Run workflow
 │
 ▼
Select Environment
 │
 ├─────────┬─────────┐
 ▼         ▼         ▼
QA        UAT       PROD
 │         │         │
 ▼         ▼         ▼
QA Env    UAT Env   PROD Env
 │         │         │
 └─────────┼─────────┘
           ▼
      Playwright
19. Scheduled Execution

For the daily PROD execution, use:

on:
  schedule:
    - cron: '0 0 * * *'
      timezone: 'Asia/Kolkata'

This means:

Every day
    ↓
00:00
    ↓
Asia/Kolkata
    ↓
12:00 AM IST

GitHub supports IANA timezone names for scheduled workflows. Scheduled workflows run using the latest commit on the repository's default branch.

20. Manual + Scheduled Execution Together

The final trigger architecture is:

on:

  schedule:
    - cron: '0 0 * * *'
      timezone: 'Asia/Kolkata'

  workflow_dispatch:
    inputs:
      environment:
        description: 'Select environment'
        required: true
        type: choice
        options:
          - QA
          - UAT
          - PROD

This provides two execution modes.

Mode 1 — Manual
User
 ↓
Run workflow
 ↓
QA / UAT / PROD
 ↓
Execute
Mode 2 — Scheduled
12:00 AM IST
 ↓
GitHub Scheduler
 ↓
PROD
 ↓
Execute
21. Automatically Select PROD for Scheduled Runs

This is one of the most important parts of the architecture.

We don't want a scheduled workflow to depend on:

inputs.environment

because scheduled workflows don't have the manual dropdown input.

Therefore:

environment:
  name: ${{ github.event_name == 'schedule' && 'PROD' || inputs.environment }}

means:

Is event = schedule?
        │
    ┌───┴───┐
   YES      NO
    │        │
    ▼        ▼
  PROD    User selection
22. Mapping GitHub Environment to Framework Environment

GitHub uses:

QA
UAT
PROD

while the framework expects:

qa
uat
prod

Therefore we map them.

Conceptually:

GitHub                    Framework

QA       ───────────────► qa
UAT      ───────────────► uat
PROD     ───────────────► prod

This keeps GitHub configuration readable while maintaining the TypeScript framework's expected values.

23. Secrets Flow

This is the most important security flow.

GitHub Environment
       │
       ├── vars.BASE_URL
       │
       ├── secrets.APP_USERNAME
       │
       └── secrets.APP_PASSWORD
       │
       ▼
GitHub Actions Job
       │
       ▼
Environment Variables
       │
       ├── BASE_URL
       ├── APP_USERNAME
       └── APP_PASSWORD
       │
       ▼
process.env
       │
       ▼
env.config.ts
       │
       ▼
config
       │
       ├── config.baseUrl
       ├── config.username
       └── config.password
       │
       ▼
Playwright

Environment secrets become available to a job when that job references the relevant environment.

24. Connecting GitHub Values to the Job

Example:

env:
  BASE_URL: ${{ vars.BASE_URL }}
  APP_USERNAME: ${{ secrets.APP_USERNAME }}
  APP_PASSWORD: ${{ secrets.APP_PASSWORD }}

This creates:

vars.BASE_URL
       ↓
BASE_URL

secrets.APP_USERNAME
       ↓
APP_USERNAME

secrets.APP_PASSWORD
       ↓
APP_PASSWORD

The Playwright framework doesn't need to know whether these values came from:

.env.qa

or:

GitHub Environment

It simply reads:

process.env.BASE_URL
process.env.APP_USERNAME
process.env.APP_PASSWORD

This is excellent separation of concerns.

25. Local vs GitHub Architecture

This is perhaps the most important diagram for teaching.

                    SAME TEST CODE
                         │
                         ▼
                  env.config.ts
                         │
             ┌───────────┴───────────┐
             │                       │
          LOCAL                    CI/CD
             │                       │
             ▼                       ▼
       dotenv files            GitHub Actions
             │                       │
       ┌─────┼─────┐          ┌──────┼──────┐
       ▼     ▼     ▼          ▼      ▼      ▼
      QA    UAT   PROD       QA     UAT    PROD
       │     │     │          │      │      │
       ▼     ▼     ▼          ▼      ▼      ▼
     .env   .env  .env      GitHub Environments
       │     │     │          │      │      │
       └─────┴─────┘          └──────┴──────┘
              │                       │
              └───────────┬───────────┘
                          ▼
                   Playwright Tests
26. Playwright Report

After test execution:

Playwright
    │
    ▼
playwright-report/
    │
    ├── index.html
    ├── data/
    ├── trace/
    └── ...

GitHub Actions can upload this directory as an artifact.

Example:

- name: Upload Playwright Report
  if: ${{ !cancelled() }}
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 30

GitHub Actions artifacts are designed to store files generated during workflow execution, such as test reports.

27. Why if: !cancelled() Is Useful

Consider:

if: ${{ !cancelled() }}

This means:

Upload the report unless the workflow was cancelled.

This is useful because you generally want the report even if tests fail.

For example:

Tests
 │
 ├── PASS
 │
 └── FAIL
       │
       ▼
 Playwright Report
       │
       ▼
 GitHub Artifact

A failed test run should not automatically mean that the diagnostic report disappears.

28. Recommended .gitignore

A suitable .gitignore should contain:

node_modules/

.env
.env.*
!.env.example

playwright-report/
test-results/

.DS_Store

If your actual environment files are:

env-files/.env.qa
env-files/.env.uat
env-files/.env.prod

then make sure they are ignored:

env-files/.env.*

while allowing:

env-files/.env.example

if desired.

29. .env.example

A safe template can be committed:

BASE_URL=
APP_USERNAME=
APP_PASSWORD=

This teaches other developers which variables are required without exposing credentials.

# 30. Security Rules
Never commit:
❌ passwords
❌ API tokens
❌ access tokens
❌ production credentials
❌ private keys
❌ database passwords
❌ real `.env` files
Use:
Local:
.env files

GitHub:
Environment Secrets

GitHub recommends using secrets for sensitive values and supports automatic redaction for many secret values in logs, although developers should not rely on masking as the sole security mechanism.

# 31. Environment Protection

GitHub Environments can additionally provide:

Required reviewers
Deployment branch restrictions
Wait timers
Custom protection rules

For example:

PROD
 │
 ▼
Required Reviewer
 │
 ▼
Approval
 │
 ▼
Playwright Execution

This is particularly useful when automated testing eventually evolves into automated deployment.

GitHub only allows environment secrets to be accessed by jobs referencing that environment, and protection rules can prevent the job from proceeding until requirements are satisfied.

# 32. Recommended PROD Protection

For a real enterprise framework, consider:

QA
 └── No approval

UAT
 └── Optional approval

PROD
 └── Required approval

However, for a read-only automated PROD test suite, approval may not be necessary.

For a future deployment workflow, it becomes much more important.

# 33. Complete Execution Architecture

Here is the complete architecture we've built:

                         GitHub Actions
                              │
             ┌────────────────┴────────────────┐
             │                                 │
        workflow_dispatch                  schedule
             │                                 │
             ▼                                 ▼
       User selects env                    Automatic
             │                                 │
       ┌─────┼─────┐                           ▼
       ▼     ▼     ▼                          PROD
      QA    UAT   PROD                         │
       │     │     │                           │
       └─────┼─────┘                           │
             │                                 │
             └────────────────┬────────────────┘
                              ▼
                     GitHub Environment
                              │
                 ┌────────────┼────────────┐
                 ▼            ▼            ▼
              BASE_URL     USERNAME      PASSWORD
                 │            │            │
                 └────────────┼────────────┘
                              ▼
                         GitHub Runner
                              │
                              ▼
                         Node.js Setup
                              │
                              ▼
                           npm ci
                              │
                              ▼
                   Install Playwright
                              │
                              ▼
                      Run Playwright
                              │
                              ▼
                    playwright-report/
                              │
                              ▼
                     Upload Artifact
# 34. End-to-End Arrow Diagram

For a course or blog, this is a particularly useful simplified diagram:

User / Scheduler
       ↓
GitHub Actions Trigger
       ↓
Environment Selection
       ↓
QA / UAT / PROD
       ↓
GitHub Environment
       ↓
Variables + Secrets
       ↓
Environment Variables
       ↓
env.config.ts
       ↓
Playwright Config
       ↓
Test Execution
       ↓
Test Results
       ↓
HTML Report
       ↓
GitHub Artifact
# 35. Three-Layer Configuration Model

A good way to explain this architecture during training is with three layers:

┌──────────────────────────────┐
│ Layer 1: Test Code           │
│                              │
│ Tests / POM / Fixtures       │
└───────────────┬──────────────┘
                │
                ▼
┌──────────────────────────────┐
│ Layer 2: Configuration       │
│                              │
│ env.config.ts                │
│ TEST_ENV                     │
│ BASE_URL                     │
└───────────────┬──────────────┘
                │
                ▼
┌──────────────────────────────┐
│ Layer 3: Environment Values  │
│                              │
│ QA / UAT / PROD              │
│ Credentials                  │
└──────────────────────────────┘

This makes the framework easier to maintain.

# 36. Why This Architecture Is Better

Without environment separation:

Login test
   ↓
Hardcoded QA URL
   ↓
Hardcoded QA credentials

Changing environments requires code changes.

With the new architecture:

Login test
   ↓
config.baseUrl
   ↓
Environment-specific value

Therefore:

Same tests
    +
Different configuration
    =
Different environment

This is a fundamental principle of scalable automation frameworks.

# 37. Common Mistakes
Mistake 1 — Committing .env
.env.prod

with:

APP_PASSWORD=RealPassword
Correct
.env.prod → local only
GitHub secret → CI/CD
Mistake 2 — Creating one combined secret
ENVIRONMENT_SECRETS

containing:

APP_USERNAME=...
APP_PASSWORD=...
Correct
APP_USERNAME
APP_PASSWORD

as separate secrets.

Mistake 3 — Using vars for passwords

Incorrect:

APP_PASSWORD: ${{ vars.APP_PASSWORD }}

Correct:

APP_PASSWORD: ${{ secrets.APP_PASSWORD }}
Mistake 4 — Forgetting the job environment

If you have:

secrets.APP_PASSWORD

but the job doesn't reference the appropriate GitHub Environment, the expected environment secret won't be available.

Correct:

jobs:
  test:
    environment:
      name: PROD

Environment variables and secrets are scoped to the environment referenced by the job.

Mistake 5 — Assuming workflow_dispatch means scheduled execution
workflow_dispatch:

means:

Manual execution

while:

schedule:

means:

Scheduled execution

They are separate triggers.

# 38. Troubleshooting Checklist

When GitHub Actions fails:

Check 1

Is the workflow file present?

.github/workflows/playwright.yml
Check 2

Is it on the default branch?

Scheduled workflows run from the default branch.

Check 3

Is the GitHub Environment name correct?

QA
UAT
PROD
Check 4

Does the environment contain:

BASE_URL
APP_USERNAME
APP_PASSWORD
Check 5

Are the references correct?

${{ vars.BASE_URL }}
${{ secrets.APP_USERNAME }}
${{ secrets.APP_PASSWORD }}
Check 6

Check the Actions log.

If:

BASE_URL:

is empty:

BASE_URL configuration problem

If:

APP_USERNAME:

is empty:

Secret configuration problem

If:

TEST_ENV:

is wrong:

Environment selection/mapping problem

# 39. Diagnostic Strategy

A very useful CI troubleshooting technique is to never print the secret itself.

Instead:

if [ -n "$APP_USERNAME" ]; then
  echo "APP_USERNAME: available"
else
  echo "APP_USERNAME: MISSING"
fi

This tells you whether the secret reached the runner without exposing it.

Never do:

echo "$APP_PASSWORD"

# 40. Interview Perspective

This architecture gives you several excellent Playwright/SDET interview discussion points.

Q: How do you handle multiple environments?

Answer:

I externalize environment-specific configuration using environment files locally and GitHub Environment variables/secrets in CI. A TEST_ENV variable determines the target environment, and a centralized TypeScript configuration module loads and validates the appropriate configuration.

Q: How do you manage credentials?

Answer:

Credentials are never hardcoded or committed to source control. Locally they are maintained in ignored .env files, while CI credentials are stored as GitHub Environment Secrets and injected into the workflow at runtime.

Q: How does your CI know which environment to execute?

Answer:

Manual executions use a GitHub Actions workflow_dispatch choice input for QA, UAT, or PROD. Scheduled executions automatically map to PROD.

Q: How do you prevent invalid environments?

Answer:

I maintain an allowedEnvironments constant using TypeScript as const, derive a union type from it, and validate TEST_ENV before loading configuration.

Q: How do you generate reports?

Answer:

Playwright generates its HTML report, and GitHub Actions uploads the report directory as a workflow artifact with a configured retention period.

41. Enterprise-Level Evolution

The current architecture can later evolve into:

                  GitHub Actions
                        │
           ┌────────────┼────────────┐
           │            │            │
         Manual       Schedule      PR
           │            │            │
           ▼            ▼            ▼
        QA/UAT/PROD     PROD       QA
           │            │            │
           └────────────┼────────────┘
                        ▼
                  Playwright
                        │
              ┌─────────┼─────────┐
              ▼         ▼         ▼
            Smoke     Regression  API
              │         │         │
              └─────────┼─────────┘
                        ▼
                     Reports
                        │
              ┌─────────┼─────────┐
              ▼         ▼         ▼
           Artifact   Email     Dashboard

Later, you can add:

Parallel execution
Playwright projects
Browser matrix
Test tagging
Smoke/regression pipelines
Slack notifications
Email notifications
Test history
Allure reporting
Docker
Self-hosted runners
Deployment gates
Required PROD approvals

# 42. Recommended Final Architecture

For your current framework, I would consider this the baseline architecture:

                 ┌───────────────────────┐
                 │   GitHub Repository   │
                 └───────────┬───────────┘
                             │
                             ▼
                    GitHub Actions
                             │
              ┌──────────────┴──────────────┐
              │                             │
        Manual Trigger                 Scheduled Trigger
              │                             │
       Select Environment                   │
              │                             │
       ┌──────┼──────┐                      │
       ▼      ▼      ▼                      ▼
      QA     UAT    PROD                   PROD
       │      │      │                      │
       └──────┼──────┴──────────────────────┘
              │
              ▼
       GitHub Environment
              │
       ┌──────┼──────┐
       ▼      ▼      ▼
    BASE_URL USERNAME PASSWORD
       │      │      │
       └──────┼──────┘
              ▼
        Playwright Runner
              │
              ▼
         Test Execution
              │
              ▼
      Playwright HTML Report
              │
              ▼
       GitHub Artifact

# 43. Key Takeaways

If you remember only these points, remember these:

1. Separate code from configuration
Test Code ≠ Environment Configuration
2. Never commit credentials
Local → .env
CI → GitHub Secrets
3. Separate variables and secrets
BASE_URL → vars
PASSWORD → secrets
4. Use GitHub Environments
QA
UAT
PROD
5. Use workflow_dispatch for manual execution
User → Select Environment → Execute
6. Use schedule for automation
Schedule → PROD → Execute
7. Keep environment selection centralized
TEST_ENV
   ↓
env.config.ts
   ↓
config
   ↓
Playwright
8. Upload reports as artifacts
Playwright
   ↓
playwright-report
   ↓
GitHub Artifact
9. Fail fast when configuration is missing
Missing credential
      ↓
Immediate error
10. The same test code should work everywhere
QA ─┐
UAT ─┼──► Same Test Suite
PROD ─┘

# 44. One-Line Architecture Summary

For your notes/course, I would summarize the entire design as:

A scalable Playwright CI architecture separates test implementation from environment configuration, uses local .env files for developer execution, GitHub Environments for CI configuration, GitHub Secrets for sensitive credentials, workflow_dispatch for on-demand environment selection, schedule for automated PROD execution, and GitHub Artifacts for persistent test reports.

That is the core concept behind what we have built.

Official references
GitHub Actions workflow syntax — triggers, workflow_dispatch, schedules, environments, expressions.
GitHub Actions Environments — environment variables, secrets and protection rules.
GitHub Actions Secrets — secret naming, scope and security behavior.
GitHub Actions Artifacts — storing Playwright reports and other workflow artifacts.

This is also a very good foundation for a dedicated “Playwright CI/CD with GitHub Actions” chapter in your course, because the architecture naturally progresses from local execution → environment management → secrets → manual CI → scheduled CI → reporting → enterprise CI/CD.