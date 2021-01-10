import React, { SyntheticEvent } from 'react';
import ReactDOM from 'react-dom';
import { AppState } from 'Core/types/types';
import { FeatureExtractorResultPhase1, FeatureExtractorResultPhase2 } from 'Core/types/feature-extractor';
import { FinalScore } from 'Core/evaluator/score-calculator/final';
import { vibrantColorsExtract } from 'Core/evaluator/feature-extractor/vibrant-colors';
import { ColorCountExtractResult } from 'Core/types/factors';
// import { dominantColorsExtract } from '../evaluator-legacy/dominant-colors';
import { colorCountExtract } from '../evaluator-legacy/color-count';

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

// chrome.windows.create({
//   url: '/report.html',
//   type: 'popup'
// }, function (window) { });

class App extends React.Component {
  public state = {};

  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <Analyzer />
      </div>
    )
  }
}

class Analyzer extends React.Component {
  public state: AppState = {
    analyzingStatus: '',
    result: {},
    snapshot: null
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
    const image: string = await new Promise<string>((resolve, reject) => {
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
      vibrantColorsExtract(image)
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
        const result = await colorCountExtract(image);
        resolve(result);
      }),
    ]);

    if (colorCountResult.status === 'rejected') {
      console.log('failed to do colorCountExtract');
      this.setState(() => ({ analyzingStatus: 'Done!' }));
      return;
    }


    // Combine contentside result with extension side result
    const phase2FeatureExtractorResult: FeatureExtractorResultPhase2 = {
      ...phase1FeatureExtractorResult,
      vibrantColors: vibrantColorsExtractResult,
      colorCount: colorCountResult.value
    }

    console.log('phase1FeatureExtractorResult', phase1FeatureExtractorResult);
    console.log('phase2FeatureExtractorResult', phase2FeatureExtractorResult);

    const finalScore = new FinalScore(document, phase2FeatureExtractorResult);

    console.log('finalScore', finalScore.getAllScores());

    this.setState(() => {
      const x: Partial<AppState> = { 
        analyzingStatus: 'Done!',
        result: phase2FeatureExtractorResult,
        snapshot: image };
      return x;
    });
  };


  openQuickReport() {
    console.log('Quick Report Clicked');
  }

  render() {
    return ( 
      <div>
        <div className="card">
          <div className="card-header">
            Analyze
          </div>
          <div className="card-body">
            <button type="button" className="btn btn-primary" onClick={this.analyzeHandler}>Analyze</button>
          </div>
        </div>

        <div className="card" style={{marginTop: '20px'}}>
          <div className="card-body">
            {
              this.state.analyzingStatus === 'processing' &&
              <div className="spinner-border text-primary" role="status">
              </div>
            }
            {
              this.state.analyzingStatus === 'Done!' &&
              <button type="button" className="btn btn-primary" onClick={this.openQuickReport}>Open Report</button>
            }
          </div>
          </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
