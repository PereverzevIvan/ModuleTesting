const {Builder, Browser, until} = require('selenium-webdriver')

class BasePage {
    async goToUrl(url) {
        global.driver = new Builder().forBrowser(Browser.FIREFOX).build();
        driver.manage().setTimeouts({implicit: 5000}); // Если за 5 сек элемент не будет найден, то тест упадет
        await driver.get(url);
    }

    async enterText(locator, textToEnter) {
        await driver.findElement(locator).sendKeys(textToEnter);
    }

    async click(locator) {
        await driver.findElement(locator).click();
    }

    async closeBrowser() {
        await driver.sleep(1000);
        await driver.quit()
    }

    async getPageTitle() {
        return await driver.getTitle()
    }

    async waitUntil(condituion) {
        await driver.wait(condituion)
    }
}

module.exports = BasePage