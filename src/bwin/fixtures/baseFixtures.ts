import { HomePage } from '../pages/HomePage';
import { test as baseTest } from '@playwright/test';

type pages = {
    homePage: HomePage;
};

export const openPageAcceptCookies = baseTest.extend<pages>({
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await homePage.openHomePage();
        await homePage.acceptCookies();
        await use(homePage);
    },

});

export const test = openPageAcceptCookies;
export { expect } from '@playwright/test';
