import {getRandomInRange, toSportSlug} from "../../utils/utilities";
import {expect, test} from '../../fixtures/baseFixtures';
import {Locator} from "playwright";

test('Check Sport Sorting', async ({page, homePage}) => {
    const tabList = homePage.getTabListLocator();
    await homePage.clickAZSportsTab();

    // wait for the sports list to be visible
    await homePage.waitForSelectorByLocator('.live-sport-list');
    const sportsCount = await homePage.sportsListItem.count();

    // assert that there is at least one sport available
    expect(sportsCount).toBeGreaterThan(0);

    let maxTries = 10 //max tries to pick random sport (different from esports)
    let sportName: string;
    let selectedSport: Locator;
    do {
        maxTries--
        // generate a random integer to pick a sport, starts from 1 to skip live-streaming
        let randomInt = getRandomInRange(1, sportsCount);

        selectedSport = homePage.sportsListItem.nth(randomInt);
        await selectedSport.locator('.title').waitFor({state: 'attached'});

        sportName = await selectedSport.locator('.title').textContent();
        sportName = sportName.trim();

        expect(sportName).not.toBe(""); //fail in case of empty sport name
    } while (maxTries > 0 && sportName == "Esports");

    //if equal to Esports means that we reached max tries
    expect(sportName).not.toBe("Esports");

    const selectedSportUrl = await selectedSport.locator('a').getAttribute("href");
    const sportID = selectedSportUrl.match(/\d+/)[0];

    // click on the selected sport and wait for the event details
    await selectedSport.click();

    // add a second attribute (aria-label equals to sportID) to avoid confusion between similar names like "Tennis" and "Table Tennis"
    const tabWithText = tabList.locator(`li[role="tab"][aria-label="${sportID}"]:has-text("${sportName.trim()}")`);

    // assert that the selected tab is active
    await expect(tabWithText).toHaveClass(/ds-tab-selected/);

    const url = page.url();

    const sportSlug = await toSportSlug(sportName, sportID);

    const lastUrlSegment = url.split('/').pop().toLowerCase();

    // assert that the last part of the URL contains the sport slug
    expect(lastUrlSegment).toEqual(sportSlug);
});
