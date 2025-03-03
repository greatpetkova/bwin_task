import {expect, test} from '../../fixtures/baseFixtures';
import {getSportsListMobile, searchForValidPickInAllSports} from "../utils/sportPicks";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
test('Adding pick to Betslip mobile', async ({page, homePage}) => {
    const sportsList = await getSportsListMobile(page);
    expect(await sportsList.count()).toBeGreaterThan(0); // ensure there are sports available

    const validPick = await searchForValidPickInAllSports(page, sportsList, ".grid-event-detail", false, true);

    expect(validPick).not.toBeNull();

    let pickText = await validPick.locator('.name').textContent();
    pickText = pickText.trim()

    // add the pick to the bet slip
    await validPick.click();
    await expect(validPick).toHaveClass(/selected/);

    // go to bet slip
    await page.waitForSelector('.quick-bet-container');
    await page.getByText('Go to betslip').click();

    const betSlipPickList = page.locator('.betslip-pick-list').first();
    await expect(betSlipPickList).toBeVisible();

    // get first item in bet slip
    const firstPick = betSlipPickList.locator('.betslip-single-bet-pick').first();
    let firstPickText = await firstPick.locator(".betslip-digital-pick__line-0 .betslip-digital-pick__line-0-container .ng-star-inserted").first().textContent();

    firstPickText = firstPickText.trim(); //in current version trim is not needed, but might be in the future
    expect(firstPickText).not.toBe("");

    // assert that the pick name in the bet slip matches the selected pick
    expect(firstPickText).toBe(pickText);
});


