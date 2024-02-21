const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const { waitForSec, printUrl } = require('./src/utils');
const PageNav = require('./src/pageNav');
const CalendarUtil = require('./src/calendarUtil');
const sendEmailNotification = require('./src/emailUtil');

const triggerInterval = 90 * 1000;
const apiDelayInterval = 120 * 1000;

let dateFound = false;

async function initDriver() {
  try {
    // Set up Chrome options
    const options = new chrome.Options();
    options.addArguments('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36');

    // Initialize Chrome driver
    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    
    return driver;
  } catch (error) {
    console.error('Error initializing the driver:', error);
    throw error;
  }
}

async function scheduledTask(driver) {
  console.log('Crawler task initiated..');
  const availableDay = await PageNav.crawlMonths(driver);

  if (availableDay) {
    console.log('Available date found!!');
    
    // Sent email notification
    sendEmailNotification('example1@xyz.com', 
    'VISA Appointment Date Found!',
    'There is an appointment available on ' + availableDay )

    sendEmailNotification('example2@xyz.com', 
    'VISA Appointment Date Found!',
    'There is an appointment available on ' + availableDay )

    dateFound = true;
  } else {
    console.log('Crawler task finished with no date found..');
  }
}

async function runCrawler() {
  let driver = await initDriver();
  let count = 0;

  try {
    await navigateToBookingPage(driver);

    // The real Crawler starts!
    while (!dateFound) {
      scheduledTask(driver);
      await new Promise((resolve) => setTimeout(resolve, triggerInterval));

      if (++count == 10 && driver) {
        // Rest for a while
        await new Promise((resolve) => setTimeout(resolve, apiDelayInterval));
        count = 0;

        console.log("Restarting driver..")
        await driver.quit();
        driver = await initDriver();
        await navigateToBookingPage(driver);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the browser after the crawling is done
    await driver.quit();
  }
}

async function navigateToBookingPage(driver) {
  // Navigate to the website you want to crawl
  await driver.get('https://prenotami.esteri.it');
  await printUrl(driver);

  // Login
  PageNav.login(driver, 'example@xyz.com', 'testpassworwd');
  
  // Wait for the page to fully load or handle AJAX/redirects
  await driver.wait(until.elementLocated(By.id('advanced')), 10000);

  await driver.get('https://prenotami.esteri.it/Services/Booking/541');

  await driver.wait(until.elementLocated(By.id('typeofbookingddl')), 10000);

  // Fill & submit form
  PageNav.fillApplicationForm(driver);

  await driver.wait(until.elementLocated(By.className('datepicker')), 20000);
}

// Run the crawler function
runCrawler();
