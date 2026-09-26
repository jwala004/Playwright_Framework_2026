
1. Run the test in debug mode on chrome
npm run test:dev -- --project=chromium-debug

2. See all available projects
npx playwright test --list

3. Run the test on chrome
npm run test:dev -- --project=chromium

npm run test:dev:headed -- --project=chromium 

This is an important command.
# It means:TEST_ENV=dev + Project = chromium
# So: DEV + Chromium only.

4. Running a single test-case file from powershell;
$env:TEST_ENV="uat"; npx playwright test tests/loginreaddatafromjson.spec.ts --headed --project=chromium

$env:TEST_ENV="uat"; npx playwright test tests/loginreaddatafromjson.spec.ts --headed --project=edge

$env:TEST_ENV="uat"; npx playwright test tests/logout.spec.ts --headed --project=edge

5. 

