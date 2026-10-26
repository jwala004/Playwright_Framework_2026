# Senior SDET Interview Guide: Tests Pass Locally but Fail in CI

A practical debugging reference for Playwright + TypeScript automation
frameworks running in GitHub Actions, Jenkins, or other CI environments.

## Table of Contents

1.  [File system, test data and
    configuration](#1-file-system-test-data-and-configuration)
2.  [Browser, timing and test
    execution](#2-browser-timing-and-test-execution)
3.  [Application, API, network and
    infrastructure](#3-application-api-network-and-infrastructure)
4.  [Dependencies, CI pipeline, reporting and
    diagnostics](#4-dependencies-ci-pipeline-reporting-and-diagnostics)
5.  [Interview debugging approach](#5-interview-debugging-approach)

------------------------------------------------------------------------

## 1. File system, test data and configuration

  --------------------------------------------------------------------------
  Failure category  Typical cause /   How I would         Fixes
                    root cause        investigate         
  ----------------- ----------------- ------------------- ------------------
  File paths        Relative paths    Log                 Define a
                    resolve against   `process.cwd()`,    consistent path
                    an unexpected     the supplied path   convention and
                    working directory and the resolved    resolve paths
                                      absolute path;      centrally using
                                      check               `path.resolve()`
                                      `fs.existsSync()`   

  Case sensitivity  Windows accepts   Compare the exact   Correct filename
                    filename casing   filename and        casing and
                    that Linux        repository path     imports; verify
                    rejects                               the committed
                                                          filename

  Missing test-data Files are ignored Check repository    Commit required
  files             by Git or not     tracking and the CI files; correct
                    checked out       workspace           `.gitignore` rules
                                                          and checkout
                                                          configuration

  Incorrect path    Base directory    Trace the path from Centralize path
  construction      appended twice,   the test through    resolution; define
                    or filename       the factory to the  whether callers
                    passed where a    reader              supply filenames,
                    full path is                          project-relative
                    expected                              paths or absolute
                                                          paths

  Excel data types  Numeric, string,  Inspect parsed      Format string
                    date and          values and their    fields as Text in
                    formatted cells   JavaScript types    Excel; normalize
                    are interpreted                       values
                    differently                           appropriately in
                                                          the reader

  Leading zeros and Excel stores an   Compare the         Store identifiers
  special           identifier as a   original cell       and string values
  characters        number or         contents with       as Text; verify
                    transforms its    parsed output       leading zeros and
                    representation                        special characters
                                                          are preserved

  Schema validation Actual data       Inspect validation  Correct the input
                    doesn't match the errors, record      data or schema;
                    Zod schema        numbers, field      normalize data
                                      paths and messages  before validation
                                                          where appropriate

  Environment       Variables are     Check required      Configure the
  variables         missing, empty or variable names and  required variables
                    named             presence without    in the CI
                    inconsistently    printing secrets    environment;
                                                          validate them
                                                          before test
                                                          execution

  Environment       Wrong base URL,   Log the selected    Centralize
  configuration     environment file  environment and     configuration and
                    or environment    sanitized           validate required
                    selection         configuration       settings at
                                                          startup

  Secrets and       Missing, expired  Inspect             Configure secrets
  credentials       or incorrectly    authentication      securely; verify
                    scoped            responses and       permissions, token
                    credentials       secret              lifetime and
                                      configuration       credential
                                                          validity
  --------------------------------------------------------------------------

## 2. Browser, timing and test execution

  -----------------------------------------------------------------------
  Failure category  Typical cause /   How I would       Fixes
                    root cause        investigate       
  ----------------- ----------------- ----------------- -----------------
  Browser           Browser binaries  Inspect           Install the
  dependencies      or Linux system   Playwright        required
                    libraries are     installation logs Playwright
                    missing           and runner        browsers and
                                      dependencies      system
                                                        dependencies

  Browser version   Local and CI      Compare           Pin compatible
  mismatch          browser versions  Playwright        dependencies and
                    differ            versions and      install browsers
                                      installed browser using the
                                      revisions         project's
                                                        Playwright
                                                        version

  Timing issues     Slower runners    Inspect traces,   Use locator
                    expose race       screenshots and   auto-waiting and
                    conditions        action logs       condition-based
                                                        waits instead of
                                                        arbitrary sleeps

  Flaky selectors   Dynamic DOM,      Inspect the DOM   Prefer accessible
                    duplicate         and trace at      role, label and
                    elements or       failure time      stable test-ID
                    unstable CSS                        locators
                    selectors                           

  Animations and    Animations,       Inspect           Wait for the
  overlays          dialogs or        screenshots and   relevant state;
                    loading masks     actionability     handle overlays
                    block             errors            and dialogs
                    interactions                        explicitly

  Test isolation    Tests depend on   Run the failing   Make setup and
                    shared state or   test alone and    teardown
                    execution order   then in different independent;
                                      orders            isolate test data

  Parallel          Concurrent tests  Compare failures  Allocate unique
  execution         modify the same   with worker count test data and
                    user, record,     and parallel      isolate shared
                    file or resource  execution         resources

  Shared browser    Cookies, sessions Inspect           Use appropriate
  state             or local storage  BrowserContext    isolated contexts
                    leak between      lifecycle and     and avoid
                    tests             fixture scope     unintended shared
                                                        state

  Retries hide      Intermittent      Inspect the       Fix the
  failures          defects disappear first-attempt     underlying race
                    on a retry        trace and failure condition; use
                                      history           retries for
                                                        diagnostics, not
                                                        as the primary
                                                        fix

  Test-order        One test creates  Run tests         Make each test
  dependency        state required by independently and self-contained
                    another           inspect setup     and create its
                                      dependencies      own prerequisite
                                                        data

  Async handling    Missing `await`   Review            Await all
                    or operations     asynchronous      relevant
                    continue after    calls and         operations and
                    assertions        execution traces  synchronize on
                                                        observable
                                                        conditions

  Timezone and      Date parsing or   Compare locale,   Configure
  locale            formatting        timezone and      locale/timezone
                    differs across    expected date     explicitly and
                    environments      representations   use unambiguous
                                                        date handling
  -----------------------------------------------------------------------

## 3. Application, API, network and infrastructure

  -----------------------------------------------------------------------
  Failure category  Typical cause /   How I would       Fixes
                    root cause        investigate       
  ----------------- ----------------- ----------------- -----------------
  Application not   Tests start       Inspect startup   Add health checks
  ready             before the        logs and          and wait for
                    application       readiness checks  application
                    finishes                            readiness
                    initializing                        

  Network           CI runner cannot  Inspect DNS,      Correct network
  connectivity      reach an          connection errors access, DNS,
                    application or    and network       firewall or
                    service           policies          routing
                                                        configuration

  API               Tokens expire or  Inspect status    Configure valid
  authentication    CI credentials    codes and         credentials and
                    differ from local authentication    handle token
                    credentials       setup             acquisition and
                                                        renewal

  API response      Test data,        Compare sanitized Align
  differences       feature flags or  request and       environments and
                    service versions  response details  assert against
                    differ                              the correct
                                                        contract and test
                                                        data

  Rate limiting     Parallel tests    Inspect `429`     Control
                    exceed API quotas responses and     concurrency,
                                      request volume    respect quotas
                                                        and use suitable
                                                        test accounts

  Backend           Database, queue   Inspect health    Ensure
  dependencies      or dependent      checks and        dependencies are
                    service is        service logs      ready before
                    unavailable                         tests execute

  Database state    Stale or shared   Inspect test      Use isolated
                    records produce   setup, cleanup    records,
                    unexpected        and database      deterministic
                    results           state             setup and
                                                        reliable cleanup

  TLS and           Certificate trust Inspect           Configure valid
  certificates      differs on the CI certificate and   certificates and
                    runner            TLS errors        trusted
                                                        certificate
                                                        authorities

  Container startup Services start in Review container  Use health checks
                    the wrong order   logs and health   and
                                      status            readiness-based
                                                        dependency
                                                        coordination

  Resource          Runner runs out   Inspect runner    Tune parallelism,
  exhaustion        of memory, CPU,   metrics and       increase
                    disk or process   system logs       resources or
                    capacity                            reduce
                                                        unnecessary
                                                        workload

  Permissions       CI user cannot    Inspect file      Correct file
                    read, write or    permissions and   permissions and
                    execute a file    the runner's user configure
                                      context           least-privilege
                                                        access

  External service  Third-party       Correlate         Use controlled
  instability       services are      failures with     test dependencies
                    intermittently    response codes    where
                    unavailable       and service       appropriate;
                                      status            handle transient
                                                        failures without
                                                        masking defects
  -----------------------------------------------------------------------

## 4. Dependencies, CI pipeline, reporting and diagnostics

  ----------------------------------------------------------------------------------
  Failure category  Typical cause /   How I would investigate  Fixes
                    root cause                                 
  ----------------- ----------------- ------------------------ ---------------------
  Node.js version   Local and CI      Compare `node --version` Align runtime
  mismatch          runtime versions                           versions with the
                    differ                                     framework's supported
                                                               version

  Dependency drift  Different package Compare package versions Commit the lockfile
                    versions are      and installation logs    and use deterministic
                    installed                                  installation such as
                                                               `npm ci`

  Missing packages  CI installation   Inspect installation     Declare required
                    omits a required  logs and `package.json`  dependencies
                    dependency                                 correctly and install
                                                               them in CI

  Working directory Pipeline executes Inspect `pwd`,           Set the correct
                    commands from the `process.cwd()` and      `working-directory`
                    wrong directory   workflow configuration   and standardize
                                                               command execution

  Build or          TypeScript        Run the same build and   Fix type errors,
  compilation       compilation or    type-check commands in   module configuration
  differences       module resolution CI                       and
                    differs                                    platform-dependent
                                                               imports

  Pipeline          Wrong command,    Inspect workflow YAML or Correct pipeline
  configuration     environment       Jenkinsfile and          steps, parameters and
                    selection or job  effective command        conditional execution
                    condition         arguments                

  Shell differences Bash and          Inspect runner OS and    Use compatible
                    PowerShell        shell                    commands or
                    interpret                                  explicitly configure
                    commands                                   the shell
                    differently                                

  Caching issues    Stale             Inspect cache keys and   Use appropriate cache
                    dependencies or   restore logs             keys and invalidate
                    browser binaries                           incompatible caches
                    are restored                               

  Test discovery    Playwright        Inspect                  Correct `testDir`,
                    excludes tests or `playwright.config.ts`   `testMatch`, project
                    projects          and test listing         filters and
                    unexpectedly                               command-line options

  Concurrency and   Jobs overlap, get Inspect concurrency      Configure suitable
  timeouts          cancelled or      groups, job timeouts and timeouts and
                    exceed limits     cancellation logs        concurrency controls

  Report generation Reporter fails or Inspect reporter         Configure report
                    output paths      configuration and        output paths and
                    differ            generated directories    ensure required
                                                               directories are
                                                               created

  Reports lost      Artifact steps    Review pipeline step     Publish reports and
  after failures    are skipped when  conditions               artifacts with
                    tests fail                                 failure-tolerant
                                                               conditions, such as
                                                               `if: always()` where
                                                               appropriate

  Missing           Traces,           Inspect Playwright trace Enable suitable trace
  diagnostics       screenshots and   settings and uploaded    capture and upload
                    logs are not      artifacts                diagnostic artifacts
                    retained                                   

  Incorrect         Pipeline masks    Inspect command exit     Ensure failed tests
  exit-code         test failures or  codes and job results    propagate to the
  handling          later steps                                overall pipeline
                    override status                            status
  ----------------------------------------------------------------------------------

## 5. Interview debugging approach

When asked, **"Your tests pass locally but fail in CI. How would you
debug the issue?"**, explain the sequence rather than reciting every
table.

1.  **Identify the failure.** Read the first meaningful exception and
    inspect the stack trace.
2.  **Compare environments.** Check paths, configuration, dependencies,
    runtime versions and browser versions.
3.  **Isolate the failure.** Determine whether it belongs to the test,
    framework, application or infrastructure.
4.  **Fix the root cause.** Avoid hiding the failure with retries or
    arbitrary waits.
5.  **Verify in CI.** Rerun the affected test and relevant suite, and
    preserve useful diagnostic artifacts.

### Strong examples to discuss

Your test-data path-resolution failure and Excel data-type inconsistency
are especially useful interview examples because they demonstrate: -
Real framework engineering rather than only test-case authoring. -
Cross-platform debugging between Windows and Linux. - Root-cause
analysis of shared components. - Practical improvements to data
normalization and test reliability.

**Core principle:** Compare environments, follow the evidence, isolate
the shared failure point, fix the underlying cause, and verify the
result in CI.
