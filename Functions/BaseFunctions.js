const EC = protractor.ExpectedConditions;

async function waitForLoading(loader, waitTime) {
    waitTime = waitTime || 10000;

    try {
        await browser.wait(EC.presenceOf(loader), waitTime, 'Loader not present');

        await browser.wait(EC.stalenessOf(loader), waitTime, 'Loader did not disappear in time');
    } catch (error) {
        console.error(`Error waiting for loader: ${error.message}`);
    }
}

function enterTextField(field, text) {
    if (text || text.trim().length !== 0){
        field.clear();
        field.sendKeys(text);
    }
}

async function selectDropdownFromText(select, text) {
    const option = await select.element(by.xpath(`.//option[text()='${text}']`));
    await option.click();
}

async function checkVisibilityOfElements(elementsList) {
    for (const currElement of elementsList) {
        const check = await currElement.isDisplayed();
        if (!check) {
            return false;
        }
    }

    return true;
}

async function selectDivDropdownOption(dropdown, options, text) {
    await dropdown.click();
    await browser.sleep(200);
    for (const option of options) {
        const optionText = await option.getText();
        if (optionText.toLowerCase().includes(text.toLowerCase())) {
            await option.click();
            break;
        }
    }
}

module.exports = {
    enterTextField,
    selectDropdownFromText,
    checkVisibilityOfElements,
    selectDivDropdownOption
}