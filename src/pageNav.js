const { By, until } = require('selenium-webdriver');
const { prevMonth, nextMonth } = require('./calendarUtil');
const { waitForSec } = require('./utils');

async function login(driver, email, password) {
    const userInput = await driver.findElement(By.id('login-email'));
    const pwInput = await driver.findElement(By.id('login-password'));
    const submitButton = await driver.findElement(By.css('button[type="submit"]'));

    await userInput.sendKeys(email).then(() => {
      console.log('Entered username.')
    });
      
    await pwInput.sendKeys(password).then(() => {
      console.log('Entered password.')
    });

    await submitButton.click().then(() => {
      console.log('Clicked submit.')
    });
}


async function fillApplicationForm(driver) {
    // Fill in Applicant's Data
    const passportNumField = await driver.findElement(By.id('DatiAddizionaliPrenotante_0___testo'));
    await passportNumField.sendKeys('EC4377908').then(() => {
      console.log('Entered passport number.')
    });

    const citizenshipField = await driver.findElement(By.id('DatiAddizionaliPrenotante_1___testo'));
    await citizenshipField.sendKeys('China').then(() => {
      console.log('Entered citizenship.')
    });

    const reasonSelect = await driver.findElement(By.id('ddls_2')).sendKeys('Tourism');

    const dateInput = await driver.findElement(By.id('DatiAddizionaliPrenotante_3___data'));
    const dateValue = '2028-05-28';
    await driver.executeScript(`arguments[0].value = '${dateValue}';`, dateInput).then(() => {
      console.log('Entered Passport expiry date.')
    });

    const addressField = await driver.findElement(By.id('DatiAddizionaliPrenotante_4___testo'));
    await addressField.sendKeys('770 Salisbury St, Apt 202, Worcester, MA, 01609').then(() => {
      console.log('Entered address.')
    });

    const policyCheckField = await driver.findElement(By.id('PrivacyCheck'));
    await policyCheckField.click().then(() => {
      console.log('Checked privacy policy.')
    });

    const submitButton = await driver.findElement(By.id('btnAvanti'));
    await submitButton.click().then(() => {
      console.log('Clicked forward.')
    });

    await driver.wait(until.alertIsPresent());
    const alert = await driver.switchTo().alert();
    await alert.accept();
}

async function checkAvailability(driver) {
    // Find all <td> elements with the class "availableDay"
    console.log("Querying for available dates..");
    const availableDayElements = await driver.findElements(By.css('td.availableDay'));

    // Iterate over each <td> element to inspect its "data-day" attribute
    for (const element of availableDayElements) {
      const dataDay = await element.getAttribute('data-day');
      console.log('Available Day:', dataDay);
      return dataDay;
    }
}

async function crawlMonths(driver) {
    let date;
    date = await checkAvailability(driver);
    if (date) return date;

    nextMonth(driver);
    await waitForSec(5);

    date = await checkAvailability(driver);
    if (date) return date;
    
    prevMonth(driver);
    await waitForSec(10);

    date = await checkAvailability(driver);
    return date;
}
  
module.exports = {
    login,
    fillApplicationForm,
    crawlMonths
};