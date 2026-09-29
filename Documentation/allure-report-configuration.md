1. Visit this site, for downloading and setting up allure reporting with playwright  https://www.npmjs.com/package/allure-playwright
=> navigate to "Versions" tab, and select the stable version to install.

2. Before installing, finalize the most stable version
Few points to find most stable version;
a. See the high number or large number of downloads in last 7 days
b. 

3. Now, Run the install command shown on website, with version name 
For example;
npm i allure-playwright@2.15.1

npm i allure-playwright@3.12.2
npm i -D allure-playwright@3.12.2

Navigate to Vs code and run the command.

4. Now, in "package.json", see under dependecies section
"allure-playwright" is installed.

To install it as devDependencies, command;
npm i -D allure-playwright@3.12.2


=> Usually, packages inside the dependencies will be used in production enviornment
But packages inside the devDependencies, will be used for the development and not for the production

5. Now, we need to generate Allure results file;
to generate;
npx playwright test --reporter=allure-playwright

To generete the Allure results file in a specific folder;
=> 1st we need to set directory;

Generate result files in specified folder -
CMD or command prompt (for Windows) -
(To set directory: ) => set ALLURE_RESULTS_DIR=ResultFolderName

npx playwright test --reporter=allure-playwright

=>Powershell Terminal (for Windows) -
$env:ALLURE_RESULTS_DIR=”ResultFolderName”; npx playwright test   --reporter=allure-playwright

=> Bash Terminal (for Mac/Linux) -
ALLURE_RESULTS_DIR=ResultFolderName npx playwright test  --reporter=allure-playwright

Sample example;
set ALLURE_RESULTS_DIR=GoogleAllureResults
In the above, "GoogleAllureResults" is the folder name
When the test-case will be run using below command, then results will be generted in the "GoogleAllureResults" folder
then;
npx playwright test --reporter=allure-playwright

Prefer the below approach to generate the Allure Result files;
=> Generate Allure Result files through Playwright.config.ts file -

Generate result files in default allure-results folder -
reporter:”allure-playwright”

=> Generate result files in specified folder -
Reporter: [[”allure-playwright”, {outputFolder : ResultFolderName}]]

### To generate reports
allure generate folder_name_where_allure_results_are_present

Now, To open the report;
allure open folder_name_where_allure_reports_are_present

For example;
allure open allure-report

=> Generate Allure Report files and Open Report in single command (combine 2 steps in one command)
allure serve ResultFolderName

Note:- To Overwrite the old report files it’s better to add --clean at the end, when you are generating report files from results files.

allure generate allure-results -o allure-reports --clean

To open and view traces;
navigate to; trace.playwright.dev

And by uploading trace files, we can get the trace details in the browser.

To generate multiple reports at once separte the report name by comma;
npx playwright test --reporter=allure-playwright,html

Working set-up tested;
Step 1: install dependecies
npm install -D allure-playwright@3.12.2
npm install -D allure

Now check in "package.json" something like this should show:

"devDependencies": {
  "@playwright/test": "...",
  "allure": "...",
  "allure-playwright": "3.12.2"
}

Step 2: 
Configure playwright.config.ts

reporter: [
  ["list"],
  ["html", { open: "never" }],
  ["allure-playwright", {
    resultsDir: "allure-results"
  }]
  // or the above line can be written as,   ['allure-playwright', { outputFolder: "allure-results" }]
],

3. In package.json scripts

"scripts": {
  "allure:generate": "npx allure generate allure-results --clean",
  "allure:open": "npx allure open allure-report",
  "allure:serve": "npx allure serve allure-results --clean"
}

4. Now Run your test

5. Generate report
npm run allure:generate

Generate the report
npm run allure:generate

Open the report
npm run allure:open

or Generate and Open the report in one command;
npm run allure:serve

Verify your allure installation:
npx allure --version

############################################ For future enhancements ############################################

### One thing I'd recommend for your framework

Since you're building this as a fairly mature Playwright + TypeScript enterprise framework, I'd keep your current configuration rather than adding unnecessary options:

reporter: [
  ['list'],
  ['allure-playwright', { outputFolder: 'allure-results' }]
],

You can then build on top of this with:

environment information — QA/UAT/PROD
browser information
test categories
screenshots
videos
traces
attachments
severity
feature/story information
GitHub Actions integration
historical Allure reports

############################################ For future enhancements ############################################


