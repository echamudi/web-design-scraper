const path = require('path');

// For jest
module.exports = {
    presets: [
        [
            '@babel/preset-env', {
                targets: {
                    node: 'current'
                }
            }
        ],
        '@babel/preset-typescript'
    ],
    plugins: [
        ["module-resolver", {
            root: ["./"],
            alias: {
                "Core": './core',
                "ChromeExt": './chrome-ext'
            }
        }]
    ],
    parserOpts: {
        strictMode: true
    }
};
