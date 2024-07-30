const pageData = require("../DataAccess/BranchPage.json");
const BranchPageFunctions = require("../Functions/BranchPageFunctions");

describe("Branch Page Tests", () => {
    const data = pageData.data;

    fit("Go To Branch Test", async () => {
        const correctData = data.good;

        for (const dataElement of correctData) {
            await BranchPageFunctions.goToBranch(dataElement.openBranch);
        }
    });
});