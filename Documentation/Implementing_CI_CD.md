The key architectural principle should be:

Environment determines configuration; GitHub Secrets/local .env files provide credentials.
Target architecture
                    TEST_ENV
                 qa / uat / prod
                        │
                        ▼
                env.config.ts
                        │
          ┌─────────────┴─────────────┐
          │                           │
       LOCAL                    GITHUB ACTIONS
          │                           │
   .env.qa/.env.uat/.env.prod    GitHub Secrets
          │                           │
          └─────────────┬─────────────┘
                        ▼
                  process.env
                        │
                        ▼
              Playwright Test Suite

And importantly, your test code doesn't know whether it is running locally or in GitHub Actions.

Recommended architecture

I'd structure it this way:
                         GitHub Actions
                              │
                 ┌────────────┴────────────┐
                 │                         │
             Schedule                  Manual Run
                 │                         │
                 │                  Select Environment
                 │                    QA / UAT / PROD
                 │                         │
                 ▼                         ▼
               PROD                Selected Environment
                 │                         │
                 └────────────┬────────────┘
                              ▼
                         TEST_ENV
                              │
                              ▼
                       env.config.ts
                              │
                 ┌────────────┴────────────┐
                 │                         │
             Environment              Credentials
              Config                  GitHub Secrets
                 │                         │
                 └────────────┬────────────┘
                              ▼
                       Playwright Tests


Let's visualize what happens
Scenario A — Daily schedule

At your scheduled time:

GitHub Scheduler
       ↓
workflow event = schedule
       ↓
TEST_ENV = prod
       ↓
PROD_USERNAME
PROD_PASSWORD
       ↓
env.config.ts
       ↓
.env.prod attempted
       ↓
GitHub environment variables already exist
       ↓
GitHub values win
       ↓
Playwright
       ↓
PROD

No user interaction.

Scenario B — User selects QA

User goes:

GitHub → Actions → Playwright Tests → Run workflow

Selects:

Environment
    ↓
   QA

GitHub executes:

workflow_dispatch
       ↓
inputs.environment = qa
       ↓
TEST_ENV = qa
       ↓
QA_USERNAME
QA_PASSWORD
       ↓
Playwright
       ↓
QA



