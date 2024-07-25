const pageData = require("../DataAccess/LoginPage.json");
const LoginPageFunctions = require("../Functions/LoginPageFunctions.js");

describe("Login Tests", () => {
    const data = pageData["data"];

    beforeAll(() => {
        browser.get("/");
    });

    it("Login Test (Negative)", () => {
        const incorrectData = data.bad;
        incorrectData.forEach(dataElement => {
            LoginPageFunctions.performLogin(dataElement.email, dataElement.password);
            browser.sleep(1000);
            LoginPageFunctions.checkNegative();
        });
    });

    it("Login Test (Positive)", () => {
        const correctData = data.good;
        correctData.forEach(dataElement => {
            LoginPageFunctions.performLogin(dataElement.email, dataElement.password);
            browser.sleep(5000);
            LoginPageFunctions.checkPositive();
        })
    });
});
