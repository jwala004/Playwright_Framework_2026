import {test, expect} from '@playwright/test'

test(`Frame Handling`, async ({page}) => {

    test.skip(true, 'Skip')

    await page.goto('/')
    // 
    // Filter the flex container divs to find the one containing your text
    await page.locator('div.flex.items-center').filter({ hasText: 'Alerts & Windows' }).click()
    // 
    // await page.locator('a').filter({ hasText: 'Frames' }).click()
    // await page.getByRole('link', { name: 'Frames' }).click()
    // Target directly by the href attribute
    await page.locator('a[href="/frames"]').click();

    await page.click('a[href="/frames"]');

    // Alerts & Windows
    await expect(page.getByRole('heading', { name: 'Frames' })).toHaveText('Frames')

    const largeFrame = page.frameLocator('iframe[name=largeFrame]')
    // largeFrame.locator(page.getByRole('button', {name: '+ Increment'})).dblclick() // thos line of code is written in quite simiplified manner below;
    largeFrame.getByRole('button', {name: '+ Increment'}).dblclick()

    // This will automatically wait until the counter element has text
    await largeFrame.locator('#c').waitFor({ state: 'visible' });
    await largeFrame.locator('.counter-num').waitFor({ state: 'visible' });

    const incrementedText = await largeFrame.locator('.counter-num').innerText()

    const incrementedText2 = await largeFrame.locator('.counter-num').textContent()

    const incrementedText3 = await largeFrame.locator('.counter-num').innerHTML()

    const incrementedText11 = await largeFrame.locator("#c").innerText()

    const incrementedText22 = await largeFrame.locator("#c").textContent()

    const incrementedText33 = await largeFrame.locator("#c").innerHTML()

    console.log("incrementedText : " + incrementedText)
    console.log("incrementedText2 : " + incrementedText2)
    console.log("incrementedText3 : " + incrementedText3)
    console.log("incrementedText11 : " + incrementedText11)

    console.log("incrementedText22 : " + incrementedText22)
    console.log("incrementedText33 : " + incrementedText33)

    expect(largeFrame.locator("#c")).toHaveText('2')

    // expect(Number(incrementedText22)).toBe(2) // this is making test as flaky
    // expect(Number(incrementedText33)).toBe(2) // this is making test as flaky

    await page.pause()
})