const { chromium } = require('playwright')
const {expect} = require("expect");
const cp = require('child_process');
const playwrightClientVersion = cp.execSync('npx playwright --version').toString().trim().split(' ')[1];

(async () => {
  const capabilities = {
    'browserName': 'Chrome', // Browsers allowed: `Chrome`, `MicrosoftEdge`, `pw-chromium`, `pw-firefox` and `pw-webkit`
    'browserVersion': 'latest',
    'LT:Options': {
      'platform': 'Windows 10',
      'build': 'Playwright LamdaTest 1',
      'name': 'Playwright LambdaTest Scenario 1',
      'user': 'rriddhi08',
      'accessKey':'LT_hv5lIVGA0AnNovpbOHkW2snhhWxP5Uat7hvTRCrel9l60Dn',
      'network': true,
      'video': true,
      'console': true,
      'tunnel': false, // Add tunnel configuration if testing locally hosted webpage
      'tunnelName': '', // Optional
      'geoLocation': '', // country code can be fetched from https://www.lambdatest.com/capabilities-generator/
      'playwrightClientVersion': playwrightClientVersion
    }
  }

  const browser = await chromium.connect({
    wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`
  })

  const page = await browser.newPage()

  await page.goto("https://www.lambdatest.com/selenium-playground/");
   //Validate that the URL contains “simple-form-demo
     await page.waitForSelector("//a[text()='Simple Form Demo']", {timeout:60000});
     var URLAddress =await page.locator("//a[text()='Simple Form Demo']").getAttribute('href');
     await console.log(URLAddress);
     await expect (URLAddress).toContain('simple-form-demo')
  
  //Click “Simple Form Demo”
     await page.locator("//a[text()='Simple Form Demo']").click();
     await page.waitForSelector("//input[@id='user-message']",{timeout:60000});
  
  //Create a variable for a string value e.g.: “Welcome to LambdaTest”
     var inputMessage = "Welcome to LambdaTest";
  
  //Use this variable to enter values in the “Enter Message” text box
     await page.fill("//input[@id='user-message']", inputMessage);
     await page.waitForTimeout(3000);
  
  //Click “Get Checked Value”
    await page.locator("//button[@id='showInput']").click();
    await page.waitForTimeout(3000);
  
  //Validate whether the same text message is displayed in the right-hand
     //panel under the “Your Message:” section.
  var rightHandSideMessage = await page.locator("//*[contains(text(),'Your Message:')]/following-sibling::p").innerText();
  await console.log("Right Hand Side Message is : ", rightHandSideMessage);
  await expect(inputMessage).toEqual(rightHandSideMessage);

  })()

async function teardown(page, browser) {
  await page.close();
  await browser.close();
}