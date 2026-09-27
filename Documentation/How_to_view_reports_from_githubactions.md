1. To view Html reports
pre-requisite:
=> playwright must be installed gloablly
to install: 
npm install -g playwright

=> After installing, check playwright version
playwright --version

-> Download the reports from github actions artifacts
-> Extract the zip file
-> Then after downloading and extracting the GitHub Actions artifact:

playwright show-report "path_of_report"
Like exmpale below;

playwright show-report "C:\Users\Jwala\Downloads\playwright-report"

It will launch the report in chrome browser.
