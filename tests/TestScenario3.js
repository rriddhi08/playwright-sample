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
      'build': 'Playwright Scenario 3',
      'name': 'Playwright Sc 3',
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
   await page.waitForSelector("//a[text()='Input Form Submit']", {timeout:60000});

 //Click “Input Form Submit"
  await page.locator("//a[text()='Input Form Submit']").click();
  // await page.waitForSelector("//button[@type='submit' and text()='Submit']",{timeout:60000});

//Click on Submit without filling any information in the form
  //await page.locator("//button[@type='submit' and text()='Submit']").click();

  // 2. Fill in the form fields
  await page.waitForTimeout(3000);
  await page.fill("//input[@id='name']", 'John Doe');
  await page.fill("//input[@id='inputEmail4']", 'john.doe@example.com');
  await page.fill("//input[@id='inputPassword4']", 'securePassword123');
  await page.fill("//input[@id='company']", 'Example Company');
  await page.fill("//input[@id='websitename']", 'https://www.example.com');
  await page.selectOption("//select[@name='country']", 'US'); // Assuming 'US' is a value in the dropdown
  await page.fill("//input[@id='inputCity']", 'New York');
  await page.fill("//input[@id='inputAddress1']", '123 Main St');
  await page.fill("//input[@id='inputAddress2']", 'Apt 4B');
  await page.fill("//input[@id='inputState']", 'NY');
  await page.fill("//input[@id='inputZip']", '10001');

  
  //Submit the form, Once submitted, validate the success message “Thanks for contacting us, we will get back to you shortly.” on the screen.
    var message = "Thanks for contacting us, we will get back to you shortly."
    await page.locator("//button[@type='submit' and text()='Submit']").click();
    await page.evaluate(() => {
        window.scrollTo(0, 0); // Scrolls to the top (x=0, y=0)
      });
    await page.waitForTimeout(3000);
    var expectedMessage=await page.locator("//p[text()='Thanks for contacting us, we will get back to you shortly.']").innerText();
    expect(message).toBe(expectedMessage); 
})()

async function teardown(page, browser) {
  await page.close();
  await browser.close();
}