const pageData = require("../DataAccess/ImportPage.json");
const {enterTextField, selectDropdownFromText, checkVisibilityOfElements, selectDivDropdownOption} = require("./BaseFunctions");

var ImportPageFunctions = function () {

    const locators = pageData.locators;

    const addLightBtn = element(by.xpath(locators.BluetoothLight.AddBtn));

    this.verifyAddLightModal = async() => {

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

        expect(BTIDInput.getAttribute('placeholder')).toContain('Notification Light ID', "Notification Light Input Placeholder not correct");
        expect(branchDropdown.getText()).toContain('Select a Branch', "Branch Dropdown Placeholder nor correct");

        expect(BTIDLabel.getText()).toContain('*', "Bluetooth Light ID Label does not contain *");
        expect(BranchLabel.getText()).toContain('*', "Branch Label does not contain *");
        expect(UnitLabel.getText()).toContain('*', "Unit Label does not contain *");

        const elementsToCheck = [modalHeading, BTIDLabel, BTIDInput, BranchLabel, branchDropdown, UnitLabel, unitDropdown, cancelBtn, addBtn, closeBtn];

        const visible = await checkVisibilityOfElements(elementsToCheck);

        expect(visible).toBe(true, "Elements not visible");

        await element(by.xpath(locators.BluetoothLight.AddModal.CloseIcon_Btn)).click();
        browser.sleep(2000);
    }

    this.addLightPositive = async (lightID, branchName, unitName) => {
        const message = await this.addLight(lightID, branchName, unitName);
        await browser.sleep(3000);

        if (message !== "") {
            expect(message).toEqual("", "Error: " + message);
            return;
        }

        const isSuccess = await element(by.xpath(locators.SuccessModal.Modal)).isPresent();

        expect(isSuccess).toBe(true, "Success Modal not shown");

        if (isSuccess) {
            await element(by.xpath(locators.SuccessModal.Close_Btn)).click();
            await browser.sleep(5000);
        }

        const isFailed = await element(by.xpath(locators.ErrorModal.Modal)).isPresent();

        if (isFailed) {
            const failMessage = await element(by.xpath(locators.ErrorModal.Desc)).getText();
            expect(isFailed).toBe(false, "An Error has occurred: " + failMessage);

            await element(by.xpath(locators.ErrorModal.Close_Btn)).click();
            await browser.sleep(2000);
            await element(by.xpath(locators.BluetoothLight.AddModal.Cancel_Btn)).click();
            await browser.sleep(2000);
        }

        const check = await this.lightModalError();
        
        expect(check).toBe(false, "Invalid Entry Error");

        if (check || isFailed) {
            return;
        }

        await browser.sleep(2000);

        const isAdded = await this.lightPagesSearch(lightID);

        expect(isAdded).toBe(true, "Light not found");
    };

    this.addLightNegative = async (lightID, branchName, unitName, dataCat) => {
        const message = await this.addLight(lightID, branchName, unitName);
        await browser.sleep(3000);

        if (lightID === "" || branchName === "" || unitName === "") {
            if (message === "Button Disabled") {
                expect(message).not.toEqual("", dataCat + ": Empty Fields should not be allowed");
                return;
            }
        }

        const isSuccess = await element(by.xpath(locators.SuccessModal.Modal)).isPresent();

        expect(isSuccess).toBe(false, dataCat + ": Success Modal shown");

        if (isSuccess) {
            await element(by.xpath(locators.SuccessModal.Close_Btn)).click();
            await browser.sleep(5000);
        }

        const isFailed = await element(by.xpath(locators.ErrorModal.Modal)).isPresent();

        expect(isFailed).toBe(true, dataCat + ": Fail Modal not shown");

        if (isFailed) {
            await element(by.xpath(locators.ErrorModal.Close_Btn)).click();
            await browser.sleep(2000);
            await element(by.xpath(locators.BluetoothLight.AddModal.Cancel_Btn)).click();
            await browser.sleep(2000);
        }

        const check = await this.lightModalError();
        
        expect(check).toBe(true, dataCat + ": Invalid entry considered valid");

        if (check || isFailed) {
            return;
        }

        await browser.sleep(2000);

        const isAdded = await this.lightPagesSearch(lightID);

        expect(isAdded).toBe(false, dataCat + ": Light found");
    }

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
        const firstBtn = await element(by.xpath(locators.BluetoothLight.PageFirst));
        const firstPageClickable = await firstBtn.isEnabled();
        if (firstPageClickable) {
            await element(by.xpath(locators.BluetoothLight.PageFirst)).click();
            await browser.sleep(2000);
        }
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

    //Only first pagination of Light Table
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

        await enterTextField(element(by.xpath(locators.BluetoothLight.AddModal.BTID_Input)), lightID);

        const branchDropdown = await element(by.xpath(locators.BluetoothLight.AddModal.Branch_Dropdown));
        const branchDropdownOptions = await element.all(by.xpath(locators.BluetoothLight.AddModal.Branch_DropdownOptions));

        if (branchName !== "") {
            await selectDivDropdownOption(branchDropdown, branchDropdownOptions, branchName);
        }

        const unitDropdown = await element(by.xpath(locators.BluetoothLight.AddModal.Unit_Dropdown));
        const unitDropdownOptions = await element.all(by.xpath(locators.BluetoothLight.AddModal.Unit_DropdownOptions));

        const unitEnabled = await unitDropdown.isEnabled();

        if (unitEnabled) {
            if (unitName !== "") {
                await selectDivDropdownOption(unitDropdown, unitDropdownOptions, unitName);
            }
        }
        else {
            return "Dropdown Disabled";
        }

        const addBtn = await element(by.xpath(locators.BluetoothLight.AddModal.AddLight_Btn));
        const btnEnabled = await addBtn.isEnabled();
        if (btnEnabled) {
            await addBtn.click();
        }
        else {
            await this.cancelAddLight();
            return "Button Disabled";
        }

        return "";
    }
}

module.exports = new ImportPageFunctions();
