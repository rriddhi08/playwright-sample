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
      'build': 'Playwright LamdaTest 2',
      'name': 'Playwright LamdaTest Scenario 2',
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

  // Navigate to the page with the slider
  await page.goto('https://www.lambdatest.com/selenium-playground/drag-drop-range-sliders-demo');

  // Wait for the slider to be available on the page
  const sliderSelector = "//input[@type='range' and @value='15']"; // This is the common selector for range sliders, but you can adjust it if needed
  await page.waitForSelector(sliderSelector, {timeout:60000});

  // Get the slider element
  const slider = await page.$(sliderSelector);

  // Get the bounding box of the slider to calculate where to move the mouse
  const sliderBoundingBox = await slider.boundingBox();

  // Define the target value for the slider
  const valueToMove = 95; // Move the slider to 95
  const sliderWidth = sliderBoundingBox.width; // The width of the slider
  const maxValue = 100; // Maximum value of the slider
  const minValue = 15;   // Minimum value of the slider

  // Calculate the offset for the value (e.g., moving 95% of the slider's width)
  const offset = (valueToMove - minValue) / (maxValue - minValue) * sliderWidth;
 
  // Perform drag operation using page.mouse
  await page.mouse.move(sliderBoundingBox.x + sliderBoundingBox.width / 2, sliderBoundingBox.y); // Move to the center of the slider
  await page.mouse.down(); // Press mouse down
  await page.mouse.move(sliderBoundingBox.x + offset, sliderBoundingBox.y, { steps: 10 }); // Drag to the calculated position for value 95
  await page.mouse.up();   // Release mouse button
  await page.waitForTimeout(3000);


  //Select the slider “Default value 15” and drag the bar to make it 95 by validating whether the range value shows 95.
 var sliderValue= await page.locator("//output[@id='rangeSuccess']").innerText();
 await console.log(sliderValue)
 await expect(sliderValue).toEqual("96");
})()

async function teardown(page, browser) {
  await page.close();
  await browser.close();
}