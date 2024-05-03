const {By, Key, until} = require('selenium-webdriver')
const BasePage = require('../basePage')

class YandexMarketPage extends BasePage {
    async open() {
        await this.goToUrl("https://market.yandex.ru")
    }

    get CatalogLocator() {
        return By.xpath(`//button/span[text()="Каталог"]`)
    }

    get ElectricalEngineeringLocator() {
        return By.xpath(`//a[@class="_3yHCR"]/span[text()="Электроника"]`)
    }
    
    get TabletLinkLocator() {
        return By.xpath(`//a[text()="Планшеты"]`)
    }
}