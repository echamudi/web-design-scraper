// @ts-check

const { Image, ImageData } = require('canvas');

const JSDOMEnvironment = require('jest-environment-jsdom');
const Worker = require('web-worker');

class CustomEnvironment extends JSDOMEnvironment {
  constructor(config, context) {
    super(config, context);
    this.testPath = context.testPath;
    this.temp = {};
  }

  async setup() {
    await super.setup();
    this.global.Image = Image;
    this.global.ImageData = ImageData;
    this.global.Worker = Worker;
  }

  async teardown() {
    await super.teardown();
  }
  /**
   * @type {JSDOMEnvironment['runScript']}
   */
  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = CustomEnvironment;
