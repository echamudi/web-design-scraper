import React, { SyntheticEvent } from 'react';
import ReactDOM from 'react-dom';
import { AppState } from 'Core/types/types';
import { Phase1Result, Phase2Result } from 'Core/types/types';
import { FinalScore } from 'Core/evaluator/score-calculator/final';
import { vibrantColorsExtract } from 'Core/evaluator/web-feature-extractor/vibrant-colors';
import { ColorCountExtractResult } from 'Core/types/factors';
// import { dominantColorsExtract } from '../evaluator-legacy/dominant-colors';
import { colorCountExtract } from '../../core/evaluator/image-feature-extractor/color-count';
import { DefaultButton, PrimaryButton, Stack, IStackTokens } from 'office-ui-fabric-react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { colorSymmetryExtract } from 'Core/evaluator/image-feature-extractor/color-symmetry';
import { imageToImageData } from 'Core/utils/image-canvas';
import { executePhase2 } from 'Executor/phases';

type ContentRes = {
  phase1Result: Phase1Result
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
    result: null
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
    const [
      screenshot,
      contentRes
    ] = await Promise.allSettled([
      new Promise<string>((resolve, reject) => {
        chrome.tabs.captureVisibleTab({}, async (image) => {
          resolve(image);
        });
      }),
      new Promise<ContentRes>((resolve, reject) => {
        chrome.tabs.sendMessage(tabId, { message: "extract-features" }, (response: ContentRes) => {
          console.log(response);
          resolve(response);
        });
      }),
    ]);

    if (screenshot.status === 'rejected') {
      console.log('screenshot.status rejected');
      return;
    }

    if (contentRes.status === 'rejected') {
      console.log('contentRes.status rejected');
      return;
    }

    const phase2Result = await executePhase2(
      contentRes.value.phase1Result,
      screenshot.value
    );

    const result: Phase2Result = phase2Result;

    this.setState(() => {
      const x: Partial<AppState> = {
        analyzingStatus: 'Done!',
        result
      };
      return x;
    });
  };


  async openQuickReport() {
    console.log('Quick Report Clicked');

    const phase2Data = this.state.result;

    if (phase2Data === null) {
      console.log('somehow phase2Data is null, please try again');
      return;
    }

    await new Promise(resolve => {
      chrome.storage.local.set({ webPageData: phase2Data }, function () {
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
        <PrimaryButton text="Analyze" onClick={this.analyzeHandler} />
        {
          this.state.analyzingStatus === 'processing' &&
          <div>
            <Spinner label="Analyzing Page..." labelPosition="right" size={SpinnerSize.large} />
          </div>
        }
        {
          this.state.analyzingStatus === 'Done!' &&
          <DefaultButton text="Open Report" onClick={this.openQuickReport} />
        }
      </Stack>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
