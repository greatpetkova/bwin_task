import {expect, test} from '../../fixtures/baseFixtures';
import {generalTimeout} from "../../utils/constants";

test('Validate Live Odds Updates - Table Tennis', async ({page, homePage}) => {
    test.setTimeout(generalTimeout)

    await homePage.clickOnTableTennisTab();
    await homePage.waitForSelectorByLocator('.grid-event-wrapper');

    let retries = 3 //max tries to execute the test logic
    let testExecuted = false;

    do {
        retries -= 1;

        //get all events (in this case those are all table tennis events)
        const allEvents = page.locator('.grid-event-wrapper');

        const eventsCount = await allEvents.count();

        if (eventsCount == 0) {
            await page.reload()

            continue
        }

        //loop over events to find live and not finised event
        for (let i = 0; i < eventsCount; i++) {
            const currentEvent = allEvents.nth(i);

            //only live events
            const live = currentEvent.locator('.live-icon');
            if (await live.count() == 0) {
                continue;
            }

            //only not finished events
            const textContent = await currentEvent.textContent();
            if (textContent.includes('Finished')) {
                continue
            }

            await currentEvent.click()

            //get all non-offline ods per event (can be clicked)
            const validOdds = page.locator('.event-detail-wrapper .option-indicator:not(.offline)');
            if (await validOdds.count() === 0) {
                await page.goBack()

                continue;
            }

            const odd = validOdds.first();
            await expect(odd).toBeVisible();

            const oddContainer = odd.locator('..')
            const oddInitialValue = await odd.locator(".option-value").innerText()

            const oddContainerDataTestID = await oddContainer.getAttribute('data-test-option-id')
            const querySelectorForOddContainer = `[data-test-option-id="${oddContainerDataTestID}"]`

            //exit wait function if:
            // 1. odd disabled or offline
            // 2. odd value changed
            const status = await page.waitForFunction(
                ({selector, oddInitialValue}) => {
                    const element = document.querySelector(selector + ' .option-value');
                    if (!element || !element.checkVisibility()) return null;

                    const optionIndicator = document.querySelector(selector + ' .option-indicator');

                    if (!optionIndicator || optionIndicator.classList.contains('offline')) return null

                    return element.textContent !== oddInitialValue;
                },
                {selector: querySelectorForOddContainer, oddInitialValue}
            );

            //if null(odd was disabled or event ended) try to find odd in another event
            if (status === null) {
                await page.goBack()

                continue
            }

            const optionIndicator = oddContainer.locator(".option-indicator").first()
            const oddCurrentValue = await odd.locator(".option-value").innerText()

            //cast to float for proper comparison
            const oddCurrentFloat = parseFloat(oddCurrentValue);
            const oddInitialFloat = parseFloat(oddInitialValue);

            //odd value increased
            if (oddCurrentFloat > oddInitialFloat) {
                await expect(optionIndicator).toHaveClass(/increased/)
                await expect(optionIndicator).not.toHaveClass(/decreased/)
            } else { //odd value decreased
                await expect(optionIndicator).toHaveClass(/decreased/)
                await expect(optionIndicator).not.toHaveClass(/increased/)
            }

            //mark test as executed and exit the loop
            testExecuted = true

            //exit the loop
            break
        }
    } while (!testExecuted && retries > 0)

    //check if test was executed
    expect(testExecuted).toBe(true);
});