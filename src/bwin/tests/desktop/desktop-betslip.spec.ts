import {expect, test} from '../../fixtures/baseFixtures';
import {getSportsListDesktop, searchForValidPickInAllSports} from "../utils/sportPicks";

test('Adding pick to Bet Slip', async ({page, homePage}) => {
    await homePage.clickOnEventViewTab();
    await homePage.waitForSelectorByLocator('.event-details-left-menu');

    const sportsList = await getSportsListDesktop(page);
    expect(await sportsList.count()).toBeGreaterThan(0); // ensure there are sports available

    const validPick = await searchForValidPickInAllSports(page, sportsList, ".event-item", true);

    expect(validPick).not.toBeNull();

    // add the pick to the bet slip
    await validPick.click();
    await expect(validPick).toHaveClass(/selected/);

    let pickText = await validPick.locator('.name').textContent();
    pickText = pickText.trim()

    await page.waitForSelector('.betslip-pick-list');
    const betSlipPickList = page.locator('.betslip-pick-list').first();
    await expect(betSlipPickList).toBeVisible();

    // get first item in bet slip
    const firstPick = betSlipPickList.locator('.betslip-single-bet-pick').first();
    let firstPickText = await firstPick.locator('.betslip-digital-pick__line-0 .ng-star-inserted').first().textContent();

    firstPickText = firstPickText.trim(); //in current version trim is not needed, but might be in the future
    expect(firstPickText).not.toBe("");

    // assert that the pick name in the bet slip matches the selected pick
    expect(firstPickText).toBe(pickText);
});
