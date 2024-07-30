const pageData = require("../DataAccess/ImportPage.json");
const MainNavFunctions = require("../Functions/MainNavFunctions");

const ImportPageFunctions = require("../Functions/ImportPageFunctions");

describe("Imports Page Functions", () => {

    fit("Open Imports Page Test", async () => {
        await MainNavFunctions.goToImportsPage();
        await browser.sleep(8000);
    });

    fit("Verify Add Light Modal Elements", async () => {
        await ImportPageFunctions.verifyAddLightModal();
    });

    fit("Add Light Test Positive", async () => {
        const correctData = pageData.data.good;
        for (const dataElement of correctData) {
            await ImportPageFunctions.addLightPositive(dataElement.BluetoothLight.LightID, dataElement.BluetoothLight.BranchID, dataElement.BluetoothLight.Unit);
        }
    });

});