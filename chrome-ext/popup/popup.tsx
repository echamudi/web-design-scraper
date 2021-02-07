import React from 'react';
import ReactDOM from 'react-dom';
import { AppState, Phase1Result, Phase2Result } from 'Core/types/types';

import {
  DefaultButton, PrimaryButton, Stack, IStackTokens,
} from 'office-ui-fabric-react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { executePhase2 } from 'Executor/phases';

type ContentRes = {
  phase1Result: Phase1Result
};

// Returns tabId number
async function init(): Promise<number> {
  return new Promise((resolve) => {
    let tabId: number | undefined;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      if (tabId === undefined) throw new Error('Tab id is undefined');

      chrome.tabs.executeScript(tabId, { file: 'content.js' }, () => {
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
          <Analyzer />
        </Stack>
      </div>
    );
  }
}

class Analyzer extends React.Component {
  public state: AppState = {
    analyzingStatus: '',
    result: null,
  };

  constructor(props: any) {
    super(props);
    this.analyzeHandler = this.analyzeHandler.bind(this);
    this.openQuickReport = this.openQuickReport.bind(this);
  }

  async analyzeHandler() {
    try {
      const tabId = await init();
      this.setState(() => ({ analyzingStatus: 'processing', lastReceiptId: undefined }));

      // Get screenshots
      const [
        screenshot,
        contentRes,
      ] = await Promise.allSettled([
        new Promise<string>((resolve, reject) => {
          chrome.tabs.captureVisibleTab({}, async (image) => {
            resolve(image);
          });
        }),
        new Promise<ContentRes>((resolve, reject) => {
          chrome.tabs.sendMessage(tabId, { message: 'extract-features' }, (response: ContentRes) => {
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
        screenshot.value,
      );

      console.log(phase2Result);

      const result: Phase2Result = phase2Result;

      this.setState(() => {
        const x: Partial<AppState> = {
          analyzingStatus: 'Done!',
          result,
        };
        return x;
      }, () => {
        this.openQuickReport();
      });
    } catch (e) {
      console.error(e);
      this.setState(() => {
        const x: Partial<AppState> = {
          analyzingStatus: 'Error!'
        };
        return x;
      });
    }
  }

  async openQuickReport() {
    const phase2Data = this.state.result;

    if (phase2Data === null) {
      console.log('somehow phase2Data is null, please try again');
      return;
    }

    await new Promise((resolve) => {
      chrome.storage.local.set({ webPageData: phase2Data }, () => {
        resolve(true);
      });
    });

    chrome.windows.create({
      url: '/report.html#overview',
      type: 'normal',
    }, () => {
    });
  }

  render() {
    return (
      <div>
        <Stack tokens={{ childrenGap: 10 }}>
          <a
            href="https://github.com/echamudi/web-design-scraper"
            rel="noopener noreferrer"
            target="_blank">
            <img src="./assets/logo.svg" style={{ width: '100%' }}/>
          </a>

          <p className="standard-text">
            Web Design Scraper is a tool to extract web design metrics from a web page.
            {' '}
            <a
                href="https://github.com/echamudi/web-design-scraper"
                rel="noopener noreferrer"
                target="_blank">
                Learn more
            </a>
          </p>
          <PrimaryButton text="Analyze Current Page" onClick={this.analyzeHandler} />
          {
            this.state.analyzingStatus === 'Error!'
            && (
              <div className="message">
                <div className="standard-text">
                  An error has occured. 😢
                  <br/>
                  Please check the consoles of the web page and this pop-up.
                </div>
              </div>
            )
          }
          {
            this.state.analyzingStatus === 'Done!'
            &&
            <>
              <DefaultButton text="Open Report" onClick={this.openQuickReport} />
              <div className="standard-text">Success! 💪</div>
            </>
          }
        </Stack>
        {
          this.state.analyzingStatus === 'processing'
          && (
            <div className="loader-hider">
              <Spinner label="" labelPosition="bottom" size={SpinnerSize.large} />
              <p className="standard-text">
                Please keep this popup open.<br />
                This process might take up to one minute.<br />
              </p>
            </div>
          )
        }
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
