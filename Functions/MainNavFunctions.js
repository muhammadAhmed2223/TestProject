const pageData = require("../DataAccess/MainNav.json");

var MainNavFunctions = function () {

    const locators = pageData.locators;

    this.goToImportsPage = async () => {
        await element(by.id(locators.Imports)).click();
    }

}

module.exports = new MainNavFunctions();