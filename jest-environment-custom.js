// @ts-check

const { Image } = require('canvas');

const JSDOMEnvironment = require('jest-environment-jsdom');

class CustomEnvironment extends JSDOMEnvironment {
  constructor(config, context) {
    super(config, context);
    this.testPath = context.testPath;
    this.temp = {};
  }

  async setup() {
    await super.setup();
    this.temp.Image = this.global.Image;
    this.global.Image = Image;
  }

  async teardown() {
    this.global.Image = this.temp.Image;
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
