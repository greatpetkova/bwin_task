import type {Locator, Page} from 'playwright';
import {SubNavigation} from '../components/navigation/subNavigation'; // Import the reusable component

export class HomePage {
    readonly page: Page;
    readonly sportsListItem: Locator;
    readonly subNavigation: SubNavigation;


    readonly SELECTORS = {
        sportsListItem: '.live-sport-list .list-item',
    };

    constructor(page: Page) {
        this.page = page;
        this.sportsListItem = page.locator(this.SELECTORS.sportsListItem);
        this.subNavigation = new SubNavigation(page)
    }

    async openHomePage() {
        return this.page.goto(process.env.LIVE_URL, {timeout: 0});
    }

    async acceptCookies(): Promise<void> {
        const acceptCookiesButton = this.page.getByRole('button', {name: "Accept All Cookies"});
        await acceptCookiesButton.click();
    }

    async waitForSelectorByLocator(locator: string): Promise<void> {
        await this.page.waitForSelector(locator);
    }

    async clickAZSportsTab(): Promise<void> {
        const aToZTab = this.page.getByRole('tab', {name: '-1'}).locator('a');
        await aToZTab.click();
    }

    getTabListLocator(): Locator {
        return this.page.locator('.ds-tab-header [role="tablist"]');
    }

    async clickOnEventViewTab(): Promise<void> {
        await this.subNavigation.clickOnEventViewTab();
    }

    async clickOnTableTennisTab(): Promise<void> {
        await this.subNavigation.clickOnTableTennisTab();
    }
}


