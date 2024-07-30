const pageData = require("../DataAccess/BranchPage.json");
const {enterTextField, selectDropdownFromText} = require("./BaseFunctions");

var BranchPageFunctions = function () {
    const locators = pageData.locators;

    const branchSearchBar = element(by.id(locators.branchSearchBar));
    const branchGrid = element(by.xpath(locators.branchGrid));

    const cancelBranchModal = () => {
        //Implementation remains
    }

    this.performSearchBranch = async (searchInput) => {
        await branchSearchBar.sendKeys(searchInput);
        await branchSearchBar.sendKeys(protractor.Key.ENTER);
    }

    this.isBranchInGrid = async (branchName) => {
        await cancelBranchModal();
        const gridItems = await branchGrid.all(by.tagName("h2"));

        for (const gridItem of gridItems) {
            const title = await gridItem.getText();
            var check = title.toLowerCase().includes(branchName.toLowerCase());
            if (check) {
                return true;
            }
        }

        return false;
    }

    this.goToBranch = async (branchName) => {
        await cancelBranchModal();
        await this.performSearchBranch(branchName);
        await browser.sleep(500);
        const searchSuccess = await this.isBranchInGrid(branchName);

        if (searchSuccess) {
            const gridItems = await branchGrid.all(by.tagName("h2"));

            for (const gridItem of gridItems) {
                const title = await gridItem.getText();
                var check = title.toLowerCase().includes(branchName.toLowerCase());
                if (check) {
                    await gridItem.click();
                    await browser.sleep(5000);
                    return true;
                }
            }
        }
        else {
            return false;
        }
    }
}

module.exports = new BranchPageFunctions();