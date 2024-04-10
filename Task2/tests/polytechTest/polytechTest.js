const { before, after, afterEach } = require('mocha')
const { assert, expect, should} = require('chai')
const page = require('../../pages/polytech/polytechPage')

function getNowDateAndTime() {
    let date = new Date()
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds()

    return `${year}-${month}-${day}_${hours}:${minutes}:${seconds}`
}

describe('Тест расписания политеха', async function() {
    before(async function() {
        await page.open()
    })

    it('Нажимает на кнопку расписаний', async function() {
        await page.sleep(1000)
        await page.click(page.redirectButtonLocator)
        await page.sleep(1000)
    })

    it('Переходит на сайт расписаний', async function() {
        await page.click(page.scheduleSiteLocator)
    })

    it('Вводит номер группы в поле', async function() {
        await page.SwitchToNextTab()
        await page.sleep(1000)
        await page.enterText(page.scheduleSearchLocator, "221-321")
        await page.sleep(3000)
    })

    it('Нажимает на ссылку группы 221-321', async function() {
        page.click(page.groupLinkLocator)
        await page.sleep(3000)
    })

    afterEach(async function() {
        if (this.currentTest.state == 'failed') {
            let dateTime = getNowDateAndTime()
            let imageFileName = `(${this.test.title})_${dateTime}.jpg`
            await page.saveScreenshot(imageFileName)
        }
    })

    after(async function() {
        await page.closeBrowser()
    })
})