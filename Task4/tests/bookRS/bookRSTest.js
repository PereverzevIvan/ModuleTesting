const { before, after, afterEach } = require('mocha')
const { assert, expect, should} = require('chai')
const getNowDateAndTime = require('../../../helpers/currentDateTime')
const page = require('../../pages/bookRSPage')

describe('Тест сайта рекомендательной системы книг', async function() {
    before(async function() {
        // Открывает главную страницу сайта
        await page.open()
        await page.sleep(2000)
    })
    
    it("Проверяет связь книги с ее автором", async () => {
        // Переходит на страницу со всеми книгами
        await page.waitElementLocated(page.BooksLinkLocator)
        await page.click(page.BooksLinkLocator)
        await page.sleep(2000)

        // Ждет до момента, когда в списке появится первая книга 
        // После чего вводит в поисковое поле текст
        await page.waitElementLocated(page.FirstCardLocator)
        await page.enterText(page.SearchInputLocator, "Ночной")
        await page.sleep(2000)

        // Нажимает на кнопку поиска
        await page.click(page.SearchButtonLocator)
        await page.sleep(2000)

        // Ждет до момента, когда в списке появится первая книга
        await page.waitElementLocated(page.FirstCardLocator)
        
        // Получает инфомрацию о первой в выдаче
        let book1 = await page.getBookInfoFromCardByID(1)
        
        // Переходит на страницу всех авторов
        await page.waitElementLocated(page.AuthorsLinkLocator)
        await page.click(page.AuthorsLinkLocator)
        await page.sleep(2000)

        // Вводит фамилию автора выбранной книги в поисковое поле
        await page.waitElementLocated(page.FirstCardLocator)
        await page.enterText(page.SearchInputLocator, book1.author)
        await page.sleep(2000)

        // Нажимает на кнопку поиска
        await page.click(page.SearchButtonLocator)
        await page.sleep(2000)

        // Выбирает карточку нужного автора и переходит в его профиль
        let authorCardLink = await page.getAuthorCardLinkLocatorByLastName(book1.author)
        await page.click(authorCardLink)
        await page.sleep(2000)

        // Переходит на страницу всех книг данного автора
        await page.waitElementLocated(page.AllBooksOfAuthorLinkLocator)
        await page.click(page.AllBooksOfAuthorLinkLocator)
        await page.sleep(2000)

        // Ждет до момента, когда в списке появится первая книга
        await page.waitElementLocated(page.FirstCardLocator)
        await page.sleep(2000)

        // Получает текущее значение индикатора пагинации
        let painationIndicator = await page.getActualPaginationIndicator()

        // Проверяет, есть ли наша книга в выведенном списке
        let needBookLocator = await page.getBookCardInfoLocatorByTitle(book1.title)
        needBookIsStillThere = await page.isDisplayed(needBookLocator)

        // До тех пор, пока мы не дойдем до последней страницы и нужная книга не найдена
        while ((painationIndicator.current != painationIndicator.count) && (!needBookIsStillThere)) {
            // Нажимает на кнопку для перехода на новую страницу
            await page.click(page.PaginationNextPageButtonLocator)

            // Ждем, пока прогрузятся книги
            await page.waitElementLocated(page.FirstCardLocator)
            await page.sleep(2000)

            // Обновляем значения индикатора пагинации и присутствия нужной книги
            painationIndicator = await page.getActualPaginationIndicator()
            needBookIsStillThere = await page.isDisplayed(needBookLocator)
        }

        // Проверяет, что книга была найдена на страницах
        expect(needBookIsStillThere).to.equal(true)
    })

    it("Проверяет возможность оставлять комментарии к книгам", async () => {
        // Переходит на страницу со всеми книгами
        await page.waitElementLocated(page.BooksLinkLocator)
        await page.click(page.BooksLinkLocator)
        await page.sleep(2000)

        // Ждет до момента, когда в списке появится первая книга 
        // После чего вводит в поисковое поле текст
        await page.waitElementLocated(page.FirstCardLocator)
        await page.enterText(page.SearchInputLocator, "Ночной")
        await page.sleep(2000)

        // Нажимает на кнопку поиска
        await page.click(page.SearchButtonLocator)
        await page.sleep(2000)

        // Ждет до момента, когда в списке появится первая книга
        await page.waitElementLocated(page.FirstCardLocator)
        await page.sleep(2000)

        // Нажимает на карточку найденной книги
        await page.click(await page.getBookCardLinkByID(1))
        await page.sleep(2000)
        
        // Проверяет, что кнопка для показа формы добавления комментария скрыта
        let showFormButtonIsDisplayed = await page.isDisplayed(page.ShowCommentFormButtonLocator)
        expect(showFormButtonIsDisplayed).to.equal(false)

        // Переходит на страницу авторизации
        await page.click(page.AuthorizationLinkLocator)
        await page.sleep(3000)

        // Проходит авторизацию
        await page.setTextToFormForAuthorization({
            "username": "TestUser1",
            "password": "megaman1523"
        })
        await page.sleep(2000)

        // Переходит на страницу со всеми книгами
        await page.waitElementLocated(page.BooksLinkLocator)
        await page.click(page.BooksLinkLocator)
        await page.sleep(2000)

        // Ждет до момента, когда в списке появится первая книга 
        // После чего вводит в поисковое поле текст
        await page.waitElementLocated(page.FirstCardLocator)
        await page.enterText(page.SearchInputLocator, "Ночной")
        await page.sleep(2000)

        // Нажимает на кнопку поиска
        await page.click(page.SearchButtonLocator)
        await page.sleep(2000)

        // Ждет до момента, когда в списке появится первая книга
        await page.waitElementLocated(page.FirstCardLocator)
        await page.sleep(2000)

        // Нажимает на карточку найденной книги
        await page.click(await page.getBookCardLinkByID(1))
        await page.sleep(10000)
        
        // Проверяет, что кнопка для показа формы добавления комментария отображена
        showFormButtonIsDisplayed = await page.isDisplayed(page.ShowCommentFormButtonLocator)
        expect(showFormButtonIsDisplayed).to.equal(true)

        // Нажимаю кнопку для отображения формы добавления нового коммента
        await page.click(page.ShowCommentFormButtonLocator)

        // Добавляем новый комментарий
        await page.setTextToFormForAddNewComment({
            "text": "Это тестовый комментарий №2"
        })
        await page.sleep(15000)

        let newCommentLocator = await page.getCommentLocatorByAuthorAndText(
            "TestUser1",
            "Это тестовый комментарий №2"
        )

        // Проверяет, что комментарий действительно добавился
        let newCommentIsDisplayed = await page.isDisplayed(newCommentLocator)
        expect(newCommentIsDisplayed).to.equal(true)
    })

    afterEach(async function() {
        if (this.currentTest.state == 'failed') {
            let dateTime = getNowDateAndTime()
            let imageFileName = `${this.currentTest.title}_${dateTime}.jpg`
            await page.saveScreenshot(imageFileName)
        }
    })

    after(async function() {
        await page.closeBrowser()
    })
})