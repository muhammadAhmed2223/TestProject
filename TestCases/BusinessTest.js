const pageData = require("../DataAccess/BusinessPage.json");
const BusinessPageFunctions = require("../Functions/BusinessPageFunctions");

describe("Business Tests", () => {
    const data = pageData["data"];

    it("Search Business Test", async () => {
        const correctData = data.good;

        for (const dataElement of correctData) {
            await BusinessPageFunctions.businessSearchPositive(dataElement.searchBusiness);
        }
    });

    it("Add Business Test (Positive)", async () => {
        const correctData = data.good;

        for (const dataElement of correctData) {
            await BusinessPageFunctions.businessAddPositive(dataElement.businessName, dataElement.businessCode,
                dataElement.officePhone, dataElement.email, dataElement.country, dataElement.address1, 
                dataElement.address2, dataElement.city, dataElement.state, dataElement.zip, dataElement.csc, 
                dataElement.vstSystem, dataElement.freeAnalysis, dataElement.noOfSensors, dataElement.userRestriction, 
                dataElement.additionalRate);
        }
    });

    it("Add Business Test (Negative)", async () => {
        const incorrectData = data.bad;

        for (const dataElement of incorrectData) {
            await BusinessPageFunctions.businessAddNegative(dataElement.businessName, dataElement.businessCode,
                dataElement.officePhone, dataElement.email, dataElement.country, dataElement.address1, 
                dataElement.address2, dataElement.city, dataElement.state, dataElement.zip, dataElement.csc, 
                dataElement.vstSystem, dataElement.freeAnalysis, dataElement.noOfSensors, dataElement.userRestriction, 
                dataElement.additionalRate);
        }
    });
});