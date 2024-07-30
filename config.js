exports.config = {
    directConnect: true,
    capabilities: {
        browserName: 'chrome'
    },
    framework: 'jasmine',
    specs: ['TestCases/LoginTest.js', 'TestCases/BusinessTest.js', 'TestCases/BranchTest.js', 'TestCases/ImportsPageTest.js'],
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
