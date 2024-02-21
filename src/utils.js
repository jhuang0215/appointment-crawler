const util = require('util');

// Promisify the sleep function to use async/await with it
const sleep = util.promisify(setTimeout);

async function waitForSec(seconds) {
    await sleep(seconds * 1000 );
}

async function printUrl(driver) {
    await driver.getCurrentUrl().then(url => {
      console.log('Current URL:', url);
    });
  }
  
  async function printSource(driver) {
    // Get the HTML source code of the current page
    const htmlSource = await driver.getPageSource();
  
    // Print the HTML source code to the console
    console.log(htmlSource);
  }
  
  async function displayPageElements(driver) {
    // Find the <main> element using its tag name
    const mainElement = await driver.findElement(By.tagName('main'));
  
    // Display the child tree of the <main> element
    await displayChildTree(mainElement, 0);
  }
  
  async function displayChildTree(element, level) {
    // Get the tag name and attributes of the current element
    const tagName = await element.getTagName();
    const attributes = await element.getAttribute('outerHTML');
  
    // Print the current element with appropriate indentation
    console.log(' '.repeat(level * 2) + tagName + ': ' + attributes);
  
    // Get the child elements of the current element
    const childElements = await element.findElements(By.xpath('./*'));
  
    // Recursively display the child tree for each child element
    for (const childElement of childElements) {
      await displayChildTree(childElement, level + 1);
    }
  }


module.exports = {
    waitForSec,
    printUrl
};