import {Page} from "@playwright/test";
import {Locator} from "playwright";

// search for valid picks in sports. shared for mobile & desktop
export async function searchForValidPickInAllSports(page: Page, sports :Locator, eventsSelector: string, clickOnSport: boolean = false, goBackIfNoPicks: boolean = true) {
    const sportsCount = await sports.count();

    for (let i = 0; i < sportsCount; i++) {
        const sport = sports.nth(i);

        // do not click on first one as it is expanded (desktop)
        if (clickOnSport && i > 0) {
            await sport.click();
        }

        const sportEvents = sport.locator(eventsSelector);
        const sportEventsCount = await sportEvents.count();
        if (sportEventsCount === 0) {
            //if there is no events go to next sport
            continue;
        }

        for (let j = 0; j < sportEventsCount; j++) {
            const sportEvent = sportEvents.nth(j);

            await sportEvent.click();

            // Find valid picks
            const eventValidPicks = page.locator('.event-detail-wrapper .option-indicator:not(.offline)');
            const eventValidPicksCount = await eventValidPicks.count();
            if (eventValidPicksCount === 0) {
                //if no picks go to next event
                if (goBackIfNoPicks) {
                    await page.goBack()
                }

                continue;
            }

            // return the first valid pick
            return eventValidPicks.first();
        }
    }

    return null; // return null if no valid pick is found
}

export async function getSportsListDesktop(page: Page) {
    return page.locator('.event-details-left-menu .sport');
}

export async function getSportsListMobile(page: Page) {
    return page.locator('.live-overview .grid.grid-group-x1');
}
