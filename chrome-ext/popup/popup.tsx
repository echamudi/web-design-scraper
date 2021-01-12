import React, { SyntheticEvent } from 'react';
import ReactDOM from 'react-dom';
import { AppState, WebPageData } from 'Core/types/types';
import { FeatureExtractorResultPhase1, FeatureExtractorResultPhase2 } from 'Core/types/feature-extractor';
import { FinalScore } from 'Core/evaluator/score-calculator/final';
import { vibrantColorsExtract } from 'Core/evaluator/feature-extractor/vibrant-colors';
import { ColorCountExtractResult } from 'Core/types/factors';
// import { dominantColorsExtract } from '../evaluator-legacy/dominant-colors';
import { colorCountExtract } from '../../core/evaluator/image-feature-extractor/color-count';
import { DefaultButton, PrimaryButton, Stack, IStackTokens } from 'office-ui-fabric-react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Label } from 'office-ui-fabric-react/lib/Label';

type ContentRes = {
  featureExtractorResultPhase1: FeatureExtractorResultPhase1
};

// Returns tabId number
async function init(): Promise<number> {
  return new Promise((resolve) => {
    let tabId: number | undefined;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tabId = tabs[0].id;
      if (tabId === undefined) throw new Error('Tab id is undefined');

      chrome.tabs.executeScript(tabId, { file: 'content.js' }, function () {
        resolve(tabId);
      });
    });
  });
}

// chrome.tabs.captureVisibleTab({}, function (image) {
//   console.log(image);
// });

class App extends React.Component {
  public state = {};

  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <Stack tokens={{ childrenGap: 10 }}>
          <div className="ms-fontSize-32">Smart Web Design Scraper</div>
          <Analyzer />
        </Stack>
      </div>
    )
  }
}

class Analyzer extends React.Component {
  public state: AppState = {
    analyzingStatus: '',
    result: null,
    screenshot: null
  };

  constructor(props: any) {
    super(props);
    this.analyzeHandler = this.analyzeHandler.bind(this);
    this.openQuickReport = this.openQuickReport.bind(this);
  }

  async analyzeHandler() {
    const tabId = await init();
    this.setState(() => ({ analyzingStatus: 'processing', lastReceiptId: undefined }));

    // Get screenshots
    const screenshot: string = await new Promise<string>((resolve, reject) => {
      chrome.tabs.captureVisibleTab({}, async (image) => {
        resolve(image);
      });
    });

    // Calculate all async values
    const [
      contentRes,
      vibrantColorsExtractSettledResult
    ] = await Promise.allSettled([
      new Promise<ContentRes>((resolve, reject) => {
        chrome.tabs.sendMessage(tabId, { message: "extract-features" }, (response: ContentRes) => {
          console.log(response);
          resolve(response);
        });
      }),
      vibrantColorsExtract(screenshot)
    ]);

    if (contentRes.status === 'rejected') {
      console.log('failed to do content script');
      this.setState(() => ({ analyzingStatus: 'Done!' }));
      return;
    }

    if (vibrantColorsExtractSettledResult.status === 'rejected') {
      console.log('failed to do vibrantColorsExtract');
      this.setState(() => ({ analyzingStatus: 'Done!' }));
      return;
    }

    const phase1FeatureExtractorResult = contentRes.value.featureExtractorResultPhase1;
    const vibrantColorsExtractResult = vibrantColorsExtractSettledResult.value;


    // Calculate all async values
    let [colorCountResult] = await Promise.allSettled([
      new Promise<ColorCountExtractResult>(async (resolve, reject) => {
        const result = await colorCountExtract(screenshot);
        resolve(result);
      }),
    ]);

    if (colorCountResult.status === 'rejected') {
      console.log('failed to do colorCountExtract');
      this.setState(() => ({ analyzingStatus: 'Done!' }));
      return;
    }


    // Combine contentside result with extension side result
    const featureExtractorResult: FeatureExtractorResultPhase2 = {
      ...phase1FeatureExtractorResult,
      vibrantColors: vibrantColorsExtractResult,
      colorCount: colorCountResult.value
    }

    console.log('phase2FeatureExtractorResult', featureExtractorResult);

    const result: WebPageData = {
      screenshot,
      timestamp: Date.now(),
      featureExtractorResult
    };

    this.setState(() => {
      const x: Partial<AppState> = { 
        analyzingStatus: 'Done!',
        result,
        screenshot
      };
      return x;
    });
  };


  async openQuickReport() {
    console.log('Quick Report Clicked');

    const webPageData = this.state.result;

    if (webPageData === null) {
      console.log('somehow webPageData is null, please try again');
      return;
    }

    await new Promise(resolve => {
      chrome.storage.local.set({ webPageData }, function() {
        resolve(true);
      });
    });

    chrome.windows.create({
      url: '/report.html',
      type: 'popup'
    }, function () {
    });
  }

  render() {
    return (
      <Stack tokens={{ childrenGap: 20 }}>
        <PrimaryButton text="Analyze" onClick={this.analyzeHandler}/>
        {
          this.state.analyzingStatus === 'processing' &&
          <div>
            <Spinner label="Analyzing Page..." labelPosition="right" size={SpinnerSize.large}/>
          </div>
        }
        {
          this.state.analyzingStatus === 'Done!' &&
          <DefaultButton text="Open Report" onClick={this.openQuickReport}/>
        }
      </Stack>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
