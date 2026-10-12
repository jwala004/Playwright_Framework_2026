import { test, expect } from '@playwright/test'
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

test('File Handling @automationpracticesite', async ({ page }) => {
    test.skip(true, 'Temporarily disabled for maintenance');

    await page.goto('/')

    // Upload Single file
    await page.getByRole('link', { name: 'Upload & Download' }).click()

    await expect(page.getByRole('heading', { name: 'Upload and Download' })).toHaveText('Upload and Download');

    await page.getByText('Drag & Drop file here or Browse fileSupports single TXT, PNG, JPG, PDF files').setInputFiles('test-data/logindata.json')

    // Get File name
    const fileName: string = await page.locator("//h4[@class='text-xs font-bold text-slate-800']").innerText()

    const fileName2: string = (await page.locator("//h4[@class='text-xs font-bold text-slate-800']").textContent())!

    console.log(fileName)
    console.log(fileName2)

    // Get File upload success message from pop-up
    const successmessageinpopup: string = await page.locator("//span[@class='flex-1']").innerText()
    console.log("successmessageinpopup : " + successmessageinpopup)

    // Validate Uploaded File name
    await expect(page.locator("//h4[@class='text-xs font-bold text-slate-800']")).toHaveText(fileName)

    // Validate File upload success message in pop-up
    const expectedsuccessmessageinpopup: string = `Uploaded single file: `.replace(/"/g, '') +`"${fileName}"`
    console.log("expectedsuccessmessageinpopup : " + expectedsuccessmessageinpopup);

    await expect(page.locator("//span[@class='flex-1']")).toHaveText(expectedsuccessmessageinpopup)

    // await page.pause()
})

test('Multiple File Handling @automationpracticesite', async ({ page }) => {
    test.skip(true, 'Temporarily disabled for maintenance');
    
    await page.goto('/')

    // Upload Multiple files
    await page.getByRole('link', { name: 'Upload & Download' }).click()

    await expect(page.getByRole('heading', { name: 'Upload and Download' })).toHaveText('Upload and Download')

    await page.getByText('Drag & Drop files here or Browse files').
    setInputFiles([
        'Notes/GitHub_Actions_Playwright_Final_Updated.md',
        'Notes/MCP.md',
        'Notes/TypescriptNotes_InDepth.md',
        'Notes/TypescriptNotes.md'])

    // Get File names
    const fileNames = await page.locator("//h4[@class='text-xs font-bold text-slate-800']").allTextContents()
    console.log(fileNames)

    // Get File upload success message from pop-up
    const successmessageinpopup: string = await page.locator("//span[@class='flex-1']").innerText()
    console.log("successmessageinpopup : " + successmessageinpopup)

    //h4[@class='text-xs font-bold text-slate-800']

    // Validate Uploaded File names
    await expect(page.locator("//h4[@class='text-xs font-bold text-slate-800']")).toHaveText(fileNames)

    // Validate File upload success message in pop-up
    const expectedsuccessmessageinpopup: string = `Uploaded 4 file(s) successfully!`.replace(/"/g, '')
    console.log("expectedsuccessmessageinpopup : " + expectedsuccessmessageinpopup);

    await expect(page.locator("//span[@class='flex-1']")).toHaveText(expectedsuccessmessageinpopup)

    // Print the Uploaded File count
    console.log("Uploaded Files count" + (await page.locator("//h4[@class='text-xs font-bold text-slate-800']").allTextContents()).length)

    // Validate the count of files uploaded
    await expect(page.locator("//h4[@class='text-xs font-bold text-slate-800']")).toHaveCount(4)

    await page.pause()
})

test('File Downloading @automationpracticesite @filedownload', async ({ page }) => {
   
    await page.goto('/')

    // Download file
    await page.getByRole('link', { name: 'Upload & Download' }).click()

    await expect(page.getByRole('heading', { name: 'Upload and Download' })).toHaveText('Upload and Download');

    await expect(page.getByRole('button', { name: ' Download Sample Text File' })).toBeVisible()

    // Validate File download event
    const [download] = await Promise.all([page.waitForEvent('download'), 
        page.getByRole('button', {name : ' Download Sample Text File'}).click()])
    
    // Validate File download success message
    await expect(page.getByText('File download initiated!')).toHaveText('File download initiated!');

    // Validate filename
    expect(download.suggestedFilename()).toBe('sampleFile.txt'); 
    console.log('download.suggestedFilename(): '+ download.suggestedFilename())   

    // 2. Save downloaded file
    const filePath = path.resolve('downloads', download.suggestedFilename());
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // Save the actual downloaded file
    await download.saveAs(filePath);

    // 3. Read file contents
    const content = await fs.readFile(filePath, 'utf-8');

    // 4. Validate file contents
    expect(content).toContain('Sample downloaded file');
    expect(content.length).toBeGreaterThan(0);

    // await page.pause()

/* 
Why const [download]?
- Promise.all() returns an array of results.
- waitForEvent('download') returns the Download object.
- .click() returns a promise that resolves when the click action completes.
- Destructuring [download] extracts the first result.
*/
})
