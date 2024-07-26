exports.config = {
    directConnect: true,
    capabilities: {
        browserName: 'chrome'
    },
    framework: 'jasmine',
    specs: ['TestCases/LoginTest.js'],
    baseUrl: 'https://test-portal.vstalert.com/',
    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000,
        showColors: true
    },
    onPrepare: function () {
        browser.driver.manage().window().maximize();
        browser.waitForAngularEnabled(false);
    }
};
