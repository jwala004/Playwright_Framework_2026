import { test, expect } from '../fixtures/testFixture'


   test("TC_001 - Verify login success - test data supplied via fixture", async ({landingPage ,loginPage, page , userData }) => {
      await landingPage.navigate()
      await landingPage.navigateToLoginPopUp()
      await loginPage.login(userData.username, userData .password)
      await expect(page.getByRole('heading', { name: 'Our Top Courses' })).toBeVisible()
      console.log('Heading text: ' + await page.getByRole('heading', { name: 'Our Top Courses' }).textContent())
    })
