const pageData = require("../DataAccess/LoginPage.json");
const {enterTextField} = require("./BaseFunctions");

var LoginPageFunctions = function () {

    const locators = pageData["locators"];

    const emailField = element(by.id(locators.emailField));
    const passwordField = element(by.id(locators.passwordField));
    const loginButton = element(by.id(locators.loginButton));
    const forgotPasswordLink = element(by.xpath(locators.forgotPasswordLink));
    const invalidFieldLabel = element(by.xpath(locators.invalidFieldLabel));
    const loading = element(by.className(locators.loading));
    const loginCard = element(by.id(locators.loginCard));

    this.isPageLoaded = () => {
        return loginCard.isDisplayed();
    }

    this.performLogin = (email, password) => {
        enterTextField(emailField, email);
        enterTextField(passwordField, password);
        loginButton.click();
    }

    this.checkPositive = async () => {
        var check = this.isLoginFailed();
        expect(check).toBe(false);
    }

    this.checkNegative = async () => {
        var check = this.isLoginFailed();
        expect(check).toBe(true);
    }

    this.isLoginFailed = async () => {

        const incorrectMessages = ["Login data is incorrect", "Account has been blocked"];

        try {
            if (!loginCard.isPresent()) {
                return false;
            }
        } catch (error) {
            return true;
        }

        try {
            if (invalidFieldLabel.isPresent()) {
                text = await invalidFieldLabel.getText()
                if (text.toLowerCase().includes(incorrectMessages[0].toLowerCase()) || text.toLowerCase().includes(incorrectMessages[1].toLowerCase())) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    this.isOTPPagePresent = async (listMessages, auth) => {
        const otpInput = element(by.id(locators.OTP));
        const otpButton = element(by.id(locators.OTPButton));
        check = await otpInput.isPresent();
        if (check) {
            const code = await listMessages(auth);
            console.log("OTP recieved: ", code);
            otpInput.click();
            enterTextField(otpInput, code);
            otpButton.click();
        }
    }
}

module.exports = new LoginPageFunctions();