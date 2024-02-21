const { By, until } = require('selenium-webdriver');

async function prevMonth(driver) {
    const parentElement = await driver.findElement(By.className('datepicker'));
    const prevBtn = await parentElement.findElement(By.className('dtpicker-prev'));
    await prevBtn.click();
    
    // const spinnerElement = await driver.findElement(By.id('loader-facility'));
    // await driver.wait(until.stalenessOf(spinnerElement));

}

async function nextMonth(driver) {
    const parentElement = await driver.findElement(By.className('datepicker'));
    const prevBtn = await parentElement.findElement(By.className('dtpicker-next'));
    await prevBtn.click();
    
    // const spinnerElement = await driver.findElement(By.id('loader-facility'));
    // await driver.wait(until.stalenessOf(spinnerElement));
}

module.exports = {
    prevMonth,
    nextMonth
};