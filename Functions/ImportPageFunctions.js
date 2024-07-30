const pageData = require("../DataAccess/ImportPage.json");
const {enterTextField, selectDropdownFromText, checkVisibilityOfElements, selectDivDropdownOption} = require("./BaseFunctions");

var ImportPageFunctions = function () {

    const locators = pageData.locators;

    const addLightBtn = element(by.xpath(locators.BluetoothLight.AddBtn));

    this.addLightPositive = async (lightID, branchName, unitName) => {
        await this.addLight(lightID, branchName, unitName);
        browser.sleep(3000);

        const isSuccess = await element(by.xpath(locators.SuccessModal.Modal)).isPresent();

        if (isSuccess) {
            await element(by.xpath(locators.SuccessModal.Close_Btn)).click();
            await browser.sleep(5000);
        }

        const isFailed = await element(by.xpath(locators.ErrorModal.Modal)).isPresent();

        if (isFailed) {
            await element(by.xpath(locators.ErrorModal.Close_Btn)).click();
            browser.sleep(2000);
            await element(by.xpath(locators.BluetoothLight.AddModal.Cancel_Btn)).click();
            browser.sleep(2000);
        }

        const check = await this.lightModalError();
        
        expect(check).toBe(false, "Invalid Entry Error");

        if (check || isFailed) {
            return;
        }

        browser.sleep(2000);

        const isAdded = await this.lightPagesSearch(lightID);

        expect(isAdded).toBe(true, "Light not found");
    };

    this.cancelAddLight = async () => {
        const modalAddLight = await element(by.xpath(locators.BluetoothLight.AddModal.Modal));
        const visible  = await modalAddLight.isPresent();
        if (visible) {
            await element(by.xpath(locators.BluetoothLight.AddModal.CloseIcon_Btn)).click();
        }
        await browser.sleep(1000);
    }

    this.lightModalError = async () => {
        const isModalDisplayed = await element(by.xpath(locators.BluetoothLight.AddModal.Modal)).isPresent();
        if (!isModalDisplayed) {
            return false;
        }

        const invalidText = await element(by.xpath(locators.BluetoothLight.AddModal.BTID_Invalid)).getText();

        if (invalidText === "Light ID must be 6 alphanumeric characters") {
            return true;
        }

        return false;
    }

    this.lightPagesSearch = async (lightID) => {
        await this.cancelAddLight();
        // const firstPageClickable = await element(by.xpath(locators.BluetoothLight.PageFirst)).isEnabled();
        // if (firstPageClickable) {
        //     await element(by.xpath(locators.BluetoothLight.PageFirst)).click();
        //     await browser.sleep(2000);
        // }
        const lastBtn = await element(by.xpath(locators.BluetoothLight.PageLast));
        var enabled = await lastBtn.isEnabled();
        while (enabled) {
            const check = await this.doesLightExistOnPage(lightID);
            if (check) {
                return true;
            }
            await element(by.xpath(locators.BluetoothLight.PageNext)).click();
            await browser.sleep(2000);
            enabled = await lastBtn.isEnabled();
        }

        return false;
    }

    //Only first pagination of Light Table. Need to implement logic for all page search
    this.doesLightExistOnPage = async (lightID) => {
        const lightRows = await element.all(by.xpath(locators.BluetoothLight.LightsRows + "//label"));

        for (const light of lightRows) {
            const lightName = await light.getText();

            if (lightName === lightID) {
                return true;
            }
        }

        return false;
    }

    this.addLight = async (lightID, branchName, unitName) => {
        await addLightBtn.click();
        
        await browser.sleep(1000);

        const modalHeading = await element(by.xpath(locators.BluetoothLight.AddModal.Heading));
        const BTIDLabel = await element(by.xpath(locators.BluetoothLight.AddModal.BTID_Label));
        const BTIDInput = await element(by.xpath(locators.BluetoothLight.AddModal.BTID_Input));
        const BranchLabel = await element(by.xpath(locators.BluetoothLight.AddModal.Branch_Label));
        const branchDropdown = await element(by.xpath(locators.BluetoothLight.AddModal.Branch_Dropdown));
        const UnitLabel = await element(by.xpath(locators.BluetoothLight.AddModal.Unit_Label));
        const unitDropdown = await element(by.xpath(locators.BluetoothLight.AddModal.Unit_Dropdown));
        const cancelBtn = await element(by.xpath(locators.BluetoothLight.AddModal.Cancel_Btn));
        const addBtn = await element(by.xpath(locators.BluetoothLight.AddModal.AddLight_Btn));
        const closeBtn = await element(by.xpath(locators.BluetoothLight.AddModal.CloseIcon_Btn));

        const elementsToCheck = [modalHeading, BTIDLabel, BTIDInput, BranchLabel, branchDropdown, UnitLabel, unitDropdown, cancelBtn, addBtn, closeBtn];

        const visible = await checkVisibilityOfElements(elementsToCheck);

        expect(visible).toBe(true, "Elements not visible");

        await enterTextField(element(by.xpath(locators.BluetoothLight.AddModal.BTID_Input)), lightID);

        const branchDropdownOptions = await element.all(by.xpath(locators.BluetoothLight.AddModal.Branch_DropdownOptions));

        await selectDivDropdownOption(branchDropdown, branchDropdownOptions, branchName);

        const unitDropdownOptions = await element.all(by.xpath(locators.BluetoothLight.AddModal.Unit_DropdownOptions));

        await selectDivDropdownOption(unitDropdown, unitDropdownOptions, unitName);

        await addBtn.click();
    }
}

module.exports = new ImportPageFunctions();
