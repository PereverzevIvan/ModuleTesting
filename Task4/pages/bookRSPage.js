const {By, Key, until} = require('selenium-webdriver')
const BasePage = require('../basePage')
const { interfaces } = require('mocha')

class BooRSPage extends BasePage {
    async open() {
        await this.goToUrl("http://localhost:8000/")
    }

    get BooksLinkLocator() {
        return By.xpath('//header//nav/ul/li/a[text() = "Книги"]')
    }

    get RegisterLinkLocator() {
        return By.xpath('//header//nav//li/a[contains(text(), "Регистрация")]')
    }

    get AuthorizationLinkLocator() {
        return By.xpath('//header//nav//li/a[contains(text(), "Вход")]')
    }

    get AuthorsLinkLocator() {
        return By.xpath('//header//nav//li/a[text() = "Авторы"]')
    }

    get SearchInputLocator() {
        return By.xpath('//div[@class = "infoblock"]/form/input')
    }
    
    get SearchButtonLocator() {
        return By.xpath('//div[@class = "infoblock"]/form/button')
    }

    get FirstCardLocator() {
        let basePath = `//ul[@class = "list"]/li[@class = "card" and position() = 1]`
        return By.xpath(basePath)
    }

    get ShowCommentFormButtonLocator() {
        return By.xpath('//div[contains(@class, "comment-container")]//button[@id = "open-form"]')
    }

    get AllBooksOfAuthorLinkLocator() {
        return By.xpath('//a[@class = "btn" and contains(text(), "Посмотреть все работы автора")]')
    }

    get PaginationIndicatorLocator() {
        return By.xpath('//div[contains(@class, "pagination")]/p')
    }

    get PaginationNextPageButtonLocator() {
        return By.xpath('//div[contains(@class, "pagination")]/a[contains(text(), "Вперед")]')
    }

    async getActualPaginationIndicator() {
        let indicator = await this.getTextOfElement(this.PaginationIndicatorLocator)
        return {"current": indicator.split(" / ")[0], "count": indicator.split(" / ")[1]}
    }

    async getBookInfoFromCardByID(id) {
        let basePath = `//ul[@class = "list"]/li[@class = "card" and position() = ${id}]/a/div[@class = "card__description"]`
        let authorPath = basePath + '/p[position() = 1]'
        let titlePath = basePath + '/p[position() = 2]'
        let ratingPath = basePath + '/p[position() = 3]'

        let author = await this.getTextOfElement(By.xpath(authorPath))
        let title = await this.getTextOfElement(By.xpath(titlePath))
        let rating = await this.getTextOfElement(By.xpath(ratingPath))
        
        return {
            "author": author.split(" ")[1],
            "title": title,
            "rating": rating
        };
    }

    async getBookCardLinkByID(id) {
        let basePath = `//ul[@class = "list"]/li[@class = "card" and position() = ${id}]//a`
        return By.xpath(basePath)
    }

    async getBookCardInfoLocatorByTitle(title) {
        return By.xpath(`//ul[@class = "list"]/li[@class = "card"]/a/div[@class = "card__description"]/p[position() = 2 and contains(text(), "${title}")]`)
    }

    async getAuthorCardLinkLocatorByLastName(lastName) {
        let basePath = `//ul[@class = "list"]/li[@class = "card"]//a`
        return By.xpath(basePath)
    }

    async getCommentLocatorByAuthorAndText(author, text) {
        let basePath = `//div[@class = "comment wrapper"]/p[contains(@class, "comment__author") and text() = "${author}"]/following-sibling::p[contains(@class, "comment__text") and text() = "${text}"]`

        return By.xpath(basePath)
    }

    async waitElementLocated(locator) {
        await this.waitUntil(until.elementLocated(locator))
    }

    async setTextToFormForAuthorization(data) {
        let basePath = '//form'
        let usernameInputLocator = By.xpath(basePath + '//input[@id = "id_username"]')
        let password1Locator = By.xpath(basePath +  '//input[@id = "id_password1"]')
        let password2Locator = By.xpath(basePath +  '//input[@id = "id_password2"]')
        let submitButtonLocator = By.xpath(basePath +  '//button[@type = "submit"]')

        await this.enterText(usernameInputLocator, data.username)
        await this.sleep(1000)
        await this.enterText(password1Locator, data.password1)
        await this.sleep(1000)
        await this.enterText(password2Locator, data.password2)
        await this.sleep(1000)
        await this.click(submitButtonLocator)
    }

    async setTextToFormForAuthorization(data) {
        let basePath = '//form'
        let usernameInputLocator = By.xpath(basePath + '//input[@id = "id_username"]')
        let passwordLocator = By.xpath(basePath +  '//input[@id = "id_password"]')
        let submitButtonLocator = By.xpath(basePath +  '//button[@type = "submit"]')

        await this.enterText(usernameInputLocator, data.username)
        await this.sleep(1000)
        await this.enterText(passwordLocator, data.password)
        await this.sleep(1000)
        await this.click(submitButtonLocator)
    }

    async setTextToFormForAddNewComment(data) {
        let basePath = '//div[contains(@class, "comment-container")]//form'
        let commentTextLocator = By.xpath(basePath + '//textarea[@id = "comment-text"]')
        let submitButtonLocator = By.xpath(basePath +  '//button[@type = "submit"]')

        await this.enterText(commentTextLocator, data.text)
        await this.sleep(1000)
        await this.click(submitButtonLocator)
    }
}

module.exports = new BooRSPage()