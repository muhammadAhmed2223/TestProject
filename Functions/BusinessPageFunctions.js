const pageData = require("../DataAccess/BusinessPage.json");
const {enterTextField, selectDropdownFromText} = require("./BaseFunctions");

var BusinessPageFunctions = function () {
    
    const locators = pageData["locators"];

    const gridContainer = element(by.id(locators.gridContainer));
    const btn_AddBusiness = element(by.name(locators.addBusinessButton));
    const btn_AddSubproduct = element(by.id(locators.addSubProductsButton));
    const btn_EventAnalysis = element(by.id(locators.eventAnalysisButton));
    const select_SystemList = element(by.id(locators.systemListSelect));
    const text_BusinessSearch = element(by.id(locators.businessSearchField));
    const select_CSCList = element(by.id(locators.cscListSelect));
    const modal_AddEditBusiness = element(by.id(locators.BusinessModal.addEditBusinessModal));
    const text_BusinessName = element(by.id(locators.BusinessModal.BusinessField));
    const text_BusinessCode = element(by.id(locators.BusinessModal.BusinessCodeField));
    const text_OfficePhone = element(by.id(locators.BusinessModal.OfficePhoneField));
    const text_Email = element(by.id(locators.BusinessModal.EmailField));
    const select_Country = element(by.id(locators.BusinessModal.CountryField));
    const text_Address = element(by.id(locators.BusinessModal.Address1Field));
    const text_Address2 = element(by.id(locators.BusinessModal.Address2Field));
    const text_City = element(by.id(locators.BusinessModal.CityField));
    const select_State = element(by.id(locators.BusinessModal.StateSelect));
    const text_Zip = element(by.id(locators.BusinessModal.ZipField));
    const select_CSC = element(by.id(locators.BusinessModal.CSCField));
    const select_BusinessSystemList = element(by.id(locators.BusinessModal.BusinessSystemSelect));
    const text_FreeAnalysis = element(by.id(locators.BusinessModal.FreeAnalysisField));
    const text_NoOfSensors = element(by.id(locators.BusinessModal.NoOfSensors));
    const check_UserRestriction = element(by.id(locators.BusinessModal.UserRestrictionCheck));
    const text_AdditionalRate = element(by.id(locators.BusinessModal.AdditionalRateField));
    const btn_UploadLogo = element(by.id(locators.BusinessModal.UploadButton));
    const file_BGImage = element(by.id(locators.BusinessModal.BGImageFile));
    const btn_SubmitBusiness = element(by.xpath(locators.BusinessModal.SubmitBusinessButton));
    const btn_CancelAddBusiness = element(by.xpath(locators.BusinessModal.CancelAddBusinessButton));
    const heading_BranchPage = element(by.xpath(locators.branchPageHeading));

    const cancelBusinessModal = async () => {
        const check = await modal_AddEditBusiness.isDisplayed();
        if (check) {
            await btn_CancelAddBusiness.click();
        }
    }

    const checkMandatoryField = (className, field) => {
        field.getAttribute('class').then((val) => {
            if (val.includes(className)) {
                //For logging
            }
        })
    }

    this.performSearchBusiness = async function (searchInput) {
        await cancelBusinessModal();
        await text_BusinessSearch.clear();
        await text_BusinessSearch.sendKeys(searchInput);
        await text_BusinessSearch.sendKeys(protractor.Key.ENTER);
    }

    this.businessSearchPositive = async (searchField) => {
        await this.performSearchBusiness(searchField);
        await browser.sleep(700);
        var check = await this.isBusinessInGrid(searchField);
        expect(check).toBe(true);
    }

    this.businessSearchNegative = async (searchField) => {
        await this.performSearchBusiness(searchField);
        await browser.sleep(700);
        var check = await this.isBusinessInGrid(searchField);
        expect(check).toBe(false);
    }
    
    this.businessAddPositive = async (businessName, businessCode, officePhone, email, country, address1, address2, city, state, zip, CSC, vstSystem, freeAnalysis, noOfSensors,  userRestriction, additionalRate) => {
        await this.performAddBusiness(businessName, businessCode, officePhone, email, country, address1, address2, city, state, zip, CSC, vstSystem, freeAnalysis, noOfSensors,  userRestriction, additionalRate);
        await browser.sleep(1000);
        check = await this.isBusinessAdded(businessName);
        expect(check).toBe(true);
    }
    this.businessAddNegative = async (businessName, businessCode, officePhone, email, country, address1, address2, city, state, zip, CSC, vstSystem, freeAnalysis, noOfSensors,  userRestriction, additionalRate) => {
        await this.performAddBusiness(businessName, businessCode, officePhone, email, country, address1, address2, city, state, zip, CSC, vstSystem, freeAnalysis, noOfSensors,  userRestriction, additionalRate);
        await browser.sleep(1000);
        check = await this.isBusinessAdded(businessName);
        expect(check).toBe(false);
    }

    this.isBusinessInGrid = async function (searchInput) {
        await cancelBusinessModal();
        const gridItems = await gridContainer.all(by.tagName("h2"));

        for (const gridItem of gridItems) {
            const title = await gridItem.getText();
            var check = title.toLowerCase().includes(searchInput.toLowerCase());
            if (check) {
                return true;
            }
        }

        return false;
    }

    this.isBusinessAdded = async function (businessName) {
        let success = true;
        const isDisplayed = await modal_AddEditBusiness.isDisplayed();
        
        if (isDisplayed) {
            const requiredFieldError = element(by.xpath("//*[@id=\"add-edit-business-form\"]/p"));
            const text = await requiredFieldError.getText();
            
            if (text === "Please fill the required fields") {
                const invalidClassName = "invalid-field";
                success = false;
    
                await checkMandatoryField(invalidClassName, text_BusinessName);
                await checkMandatoryField(invalidClassName, text_BusinessCode);
                await checkMandatoryField(invalidClassName, text_OfficePhone);
                await checkMandatoryField(invalidClassName, text_Email);
                await checkMandatoryField(invalidClassName, select_Country);
                await checkMandatoryField(invalidClassName, text_Address);
                await checkMandatoryField(invalidClassName, text_Address2);
                await checkMandatoryField(invalidClassName, text_City);
                await checkMandatoryField(invalidClassName, select_State);
                await checkMandatoryField(invalidClassName, text_Zip);
                await checkMandatoryField(invalidClassName, select_CSC);
                await checkMandatoryField(invalidClassName, select_SystemList);
                await checkMandatoryField(invalidClassName, text_FreeAnalysis);
                await checkMandatoryField(invalidClassName, text_NoOfSensors);
                await checkMandatoryField(invalidClassName, text_AdditionalRate);
            }

            const invalidLabels = await element.all(by.xpath(locators.BusinessModal.invalidLabels));
            for (const label of invalidLabels) {
                const labelText = await label.getText();
                if (labelText || labelText.trim().length !== 0) {
                    //For Test Logging
                    success = false;
                }
            }
        }
        else {
            await this.performSearchBusiness(businessName);
            await browser.sleep(500);
            success = await this.isBusinessInGrid(businessName);
        }
    
        return success;
    }
    

    this.performAddBusiness = async function (businessName, businessCode, officePhone, email, country, address1, address2, city, state, zip, CSC, vstSystem, freeAnalysis, noOfSensors,  userRestriction, additionalRate) {
        await cancelBusinessModal();
        btn_AddBusiness.click();
        
        await browser.sleep(1000);

        enterTextField(text_BusinessName, businessName);
        enterTextField(text_BusinessCode, businessCode);
        enterTextField(text_OfficePhone, officePhone);
        enterTextField(text_Email, email);
        await selectDropdownFromText(select_Country, country);
        enterTextField(text_Address, address1);
        enterTextField(text_Address2, address2);
        enterTextField(text_City, city);
        await selectDropdownFromText(select_State, state);
        enterTextField(text_Zip, zip);
        await selectDropdownFromText(select_CSC, CSC);
        await selectDropdownFromText(select_BusinessSystemList, vstSystem);
        enterTextField(text_FreeAnalysis, freeAnalysis);
        enterTextField(text_NoOfSensors, noOfSensors);
        if (userRestriction) {
            check_UserRestriction.click();
        }
        enterTextField(text_AdditionalRate, additionalRate);
        await btn_SubmitBusiness.click();
    }
    
    this.goToBusiness = async function(businessName) {
        await cancelBusinessModal();
        await this.performSearchBusiness(businessName);
        await browser.sleep(500);
        const searchSuccess = await this.isBusinessInGrid(businessName);

        if (searchSuccess) {
            const gridItems = await gridContainer.all(by.tagName("h2"));

            for (const gridItem of gridItems) {
                const title = await gridItem.getText();
                var check = title.toLowerCase().includes(businessName.toLowerCase());
                if (check) {
                    await gridItem.click();
                    await browser.sleep(8000);
                    return true;
                }
            }
        }
        else {
            return false;
        }
    }
}

module.exports = new BusinessPageFunctions();