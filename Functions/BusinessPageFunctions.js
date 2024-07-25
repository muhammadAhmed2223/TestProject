const pageData = require("../DataAccess/BusinessPage.json");

var BusinessPageFunctions = function () {
    
    const locators = pageData["locators"];

    const gridContainer = element(by.id(locators.gridContainer));
    const btn_AddBusiness = element(by.id(locators.addBusinessButton));
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

    const enterTextField = (field, text) => {
        field.clear();
        field.sendKeys(text);
    }

    const cancelBusinessModal = () => {
        if (modal_AddEditBusiness.isDisplayed) {
            btn_CancelAddBusiness.click();
        }
    }

    const checkMandatoryField = (className, field) => {
        field.getAttribute('class').then((val) => {
            if (val.includes(className)) {
                //For logging
            }
        })
    }

    this.performSearchBusiness = function (searchInput) {
        cancelBusinessModal();
        text_BusinessSearch.clear();
        text_BusinessSearch.sendKeys(searchInput);
        text_BusinessSearch.sendKeys(Key.ENTER);
    }

    this.isBusinessInGrid = async function (searchInput) {
        cancelBusinessModal();
        const gridItems = await gridContainer.all(by.tagName("h2"));

        gridItems.forEach((gridItem) => {
            gridItem.getText().then((title) => {
                if (title.toLowerCase().includes(searchInput.toLowerCase())) {
                    return true;
                }
            });
        });

        return false;
    }

    async function selectDropdownFromText(select, text) {
        const option = select.element(by.xpath(`//option[text()=${text}]`));
        await option.click();
    }

    this.isBusinessAdded() = function () {
        success = true;

        if (modal_AddEditBusiness.isDisplayed()) {
            const requiredFieldError = element(by.xpath("//*[@id=\"add-edit-business-form\"]/p"));
            requiredFieldError.getText().then((text) => {
                if (text === "Please fill the required fields") {
                    const invalidClassName = "invalid-field";
                    success = false;

                    checkMandatoryField(invalidClassName, text_BusinessName);
                    checkMandatoryField(invalidClassName, text_BusinessCode);
                    checkMandatoryField(invalidClassName, text_OfficePhone);
                    checkMandatoryField(invalidClassName, text_Email);
                    checkMandatoryField(invalidClassName, select_Country);
                    checkMandatoryField(invalidClassName, text_Address);
                    checkMandatoryField(invalidClassName, text_Address2);
                    checkMandatoryField(invalidClassName, text_City);
                    checkMandatoryField(invalidClassName, select_State);
                    checkMandatoryField(invalidClassName, text_Zip);
                    checkMandatoryField(invalidClassName, select_CSC);
                    checkMandatoryField(invalidClassName, select_SystemList);
                    checkMandatoryField(invalidClassName, text_FreeAnalysis);
                    checkMandatoryField(invalidClassName, text_NoOfSensors);
                    checkMandatoryField(invalidClassName, text_AdditionalRate);

                }
            });
        }

        return success;
    }

    this.performAddBusiness = async function (businessName, businessCode, officePhone, email, country, address1, address2, city, state, zip, CSC, vstSystem, freeAnalysis, noOfSensors,  userRestriction, additionalRate) {
        cancelBusinessModal();
        btn_AddBusiness.click();
        
        browser.sleep(1000);

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
        await selectDropdownFromText(select_SystemList, vstSystem);
        enterTextField(text_FreeAnalysis, freeAnalysis);
        enterTextField(text_NoOfSensors, noOfSensors);
        if (userRestriction) {
            check_UserRestriction.click();
        }
        enterTextField(text_AdditionalRate, additionalRate);
        await btn_SubmitBusiness.click();
    }
    
    this.goToBusiness = function(businessName) {
        cancelBusinessModal();
        this.performSearchBusiness(businessName);
        browser.sleep(500);
        searchSuccess = this.isBusinessInGrid(businessName);

        if (searchInput) {
            
        }
    }
}

module.exports = new BusinessPageFunctions();