// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
const coverageFolder = "coverage";
const path = require("path");

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage"),
      require("@angular-devkit/build-angular/plugins/karma"),
      require("karma-junit-reporter"),
      require("karma-coverage-istanbul-reporter"),
    ],
    files: [
      {
        pattern: "src/**/*.ts",
        type: "js", // to silence the warning. Means load with <script> tag
      },
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
        random: false
      },
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true, // removes the duplicated traces
    },

    coverageReporter: {
      type: "lcov",
      dir: ".",
      subdir: "coverage",
      file: "coverage.xml",
    },
    coverageIstanbulReporter: {
      reports: ["html", "lcovonly", "text-summary", "cobertura"],
      dir: path.join(__dirname, coverageFolder),
      "report-config": {
        html: {
          subdir: "html-report",
        },
      },
      combineBrowserReports: true,
      fixWebpackSourcePaths: true,
      verbose: false,
    },
    junitReporter: {
      outputDir: "testresults/junit",
      outputFile: "unit-test-result.xml",
      useBrowserName: false,
    },
    reporters: ["progress", "kjhtml", "coverage", "junit", "coverage-istanbul"],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true,
  });
};
