const pageData = require("../DataAccess/LoginPage.json");
const LoginPageFunctions = require("../Functions/LoginPageFunctions.js");
const {loadCredentials, loadToken, authorize, listMessages} = require('../GmailReader/code.js');

describe("Login Tests", () => {
    const data = pageData["data"];
    let auth;

    beforeAll(async () => {
        try {
          const credentials = await loadCredentials();
          const token = await loadToken();
          auth = await authorize(credentials, token);
          browser.get("/");
        } catch (error) {
          console.log(error);
          throw new Error('Authorization failed.');
        }
    });

    it("Login Test (Negative)", async () => {
        const incorrectData = data.bad;
        for (const dataElement of incorrectData) {
            LoginPageFunctions.performLogin(dataElement.email, dataElement.password);
            await browser.sleep(1000);
            LoginPageFunctions.checkNegative();
        }
    });

    it("Login Test (Positive)", async () => {
        const correctData = data.good;
        for (const dataElement of correctData) {
            await LoginPageFunctions.performLogin(dataElement.email, dataElement.password);
            await browser.sleep(3000);
            await LoginPageFunctions.checkPositive();
            await LoginPageFunctions.isOTPPagePresent(listMessages, auth);
            await browser.sleep(5000);
        }
    });
});
