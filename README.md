# Web Design Scraper

<img src="./assets/logo.svg" alt="Web Design Scraper Logo" height="127"/>

Web Design Scraper is a tool to extract web design metrics from a web page. This repo contains the early implementation of the web design scraping concept that we coined in [our research paper](https://ieeexplore.ieee.org/abstract/document/9271770).

<!-- This tool can run in the following environments:
- Web browser (Google Chrome extension)
- CLI (using puppeteer) -->

## Project Goal

The extracted web design metrics from this tool can be used for:
- Auditing web designs through objective measurements
- Understanding and comparing web design patterns between different websites

The JSON output can also be used as machine learning inputs for:
- Predicting the usability of websites
- Classifying website based on certain design measurements
- Scoring website quality and design aesthetic

## Extracted Design Information

Currently this tool can extract the following design information:
- Symmetry
- Complexity
- Density
- Cohesion
- Economy
- Simplicty
- Font size families
- Text size distribution
- Color count rank
- Vibrant colors

There are [more measurements](./web-design-factors.md) planned to be included in this tool.

## Running this Project

This tool can runs as a chrome extension.
Please use the lastest Google Chrome browser to use the extension.

## Building

<!-- ### Chrome Extension -->

You need node.js installed in your machine to build the chrome extension.

```
npm install
npm run build
```

The commands above will produce a chrome extension inside `./chrome-ext-dist` folder.
Then, you can run it by [sideloading](https://developer.chrome.com/docs/extensions/mv2/getstarted/#unpacked) the folder to Google Chrome.

<!-- ### Puppeteer

*to be added soon* -->

## Tools and Libraries

This tool is built by using TypeScript, React, Webpack, SCSS, Farbic UI, Vibrant, Jest, and [other libraries](./package.json).

## Research Paper

- A. Namoun, A. Alshanqiti, E. Chamudi and M. A. Rahmon, "Web Design Scraping: Enabling Factors, Opportunities and Research Directions," 2020 12th International Conference on Information Technology and Electrical Engineering (ICITEE), Yogyakarta, 2020, pp. 104-109, doi: [10.1109/ICITEE49829.2020.9271770.](https://ieeexplore.ieee.org/abstract/document/9271770)

## License

Copyright © 2020 Ezzat Chamudi & Web Design Scraper Team

Web Design Scraper code is licensed under MPL-2.0. Images, logos, docs, and articles in this project are released under CC-BY-SA-4.0.

Libraries, dependencies, and tools used in this project are tied with their licenses.
