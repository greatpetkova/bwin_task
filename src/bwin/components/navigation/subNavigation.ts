import { Page, Locator } from 'playwright';

export class SubNavigation {
    private readonly page: Page;
    private readonly eventViewTab: Locator;
    private readonly tableTennisTab: Locator;

    constructor(page: Page) {
        this.page = page;
        this.eventViewTab = this.page.locator('text=Event View'); // Locator for the 'Event View' button
        this.tableTennisTab = this.page.locator('.ds-tab-header-item >> text=Table Tennis'); // Locator for the Table Tennis tab

    }

    // Reusable method to click on the Event View button
    async clickOnEventViewTab(): Promise<void> {
        await this.eventViewTab.waitFor({ state: 'visible' });
        await this.eventViewTab.click();
    }

    async clickOnTableTennisTab(): Promise<void> {
        await this.tableTennisTab.waitFor({ state: 'visible' });
        await this.tableTennisTab.click();
    }
}