import { WebPageData } from "Core/types/types";
import * as React from 'react';
import { render } from "react-dom";
import { DefaultButton, PrimaryButton, Stack, IStackTokens, initializeIcons } from 'office-ui-fabric-react';
import { Nav, INavStyles, INavLinkGroup } from 'office-ui-fabric-react/lib/Nav';
import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import * as moment from 'moment';
import { navLinkGroups } from './nav-link-groups';

initializeIcons();

interface ReportState {
  currentPage: string,
  webPageData: WebPageData | null,
  reportData__timestamp?: string,
  reportData__url?: string
}

class App extends React.Component {
  public state: ReportState = {
    currentPage: 'overview',
    webPageData: null
  };

  constructor(props: any) {
    super(props);

    navLinkGroups.forEach(group=> {
      group.links.forEach(link => {
        link.forceAnchor = true;
        link.onClick = () => {
          this.setState((prevStates) => ({
            ...prevStates,
            currentPage: link.key ?? ''
          }));
        }
      })
    });

    chrome.storage.local.get(['webPageData'], (items) => {
      this.setState((prevStates: Readonly<ReportState>): ReportState => ({
        ...prevStates,
        webPageData: items['webPageData']
      }));

      this.prepareReport();
    });
  }

  prepareReport() {
    if (this.state.webPageData === null) return;

    const timestamp = moment.unix(this.state.webPageData.timestamp / 1000).format('LLLL');

    this.setState((prevStates: Readonly<ReportState>): ReportState => ({
      ...prevStates,
      reportData__timestamp: timestamp,
      reportData__url: this.state.webPageData?.featureExtractorResult.browserInfo.url
    }));
  }

  render() {
    if (this.state.webPageData === null) {
      return (
        <div></div>
      )
    }

    return (
      <div className="report">
        <div className="report-navbar">
          <div className="report-navbar-title">
            Smart Web Design Scraper
          </div>
        </div>
        <div className="report-content">
          <div className="report-sidebar">
            <Nav styles={{ root: { width: 300 } }} groups={navLinkGroups} />
          </div>
          <div className="report-details">
            {this.state.currentPage === 'meta-overview' &&
              <div className="report-details-container">
                <h1>
                  Overview
                </h1>
                <hr/>
                <p>
                  <b>URL: </b> <a href={this.state.reportData__url} target="_blank" rel="noopener noreferrer">{this.state.reportData__url}</a><br/>
                  <b>Date: </b> {this.state.reportData__timestamp}<br/>
                </p>
                <img src={this.state.webPageData.screenshot} style={{width: 800}}/>
                <table>
                  <tr>
                    <th style={{width: 200}}>Property</th>
                    <th style={{width: 300}}>Value</th>
                  </tr>
                  <tr>
                    <td>Viewport Height</td>
                    <td>{this.state.webPageData.featureExtractorResult.browserInfo.viewportHeight}</td>
                  </tr>
                  <tr>
                    <td>Viewport Width</td>
                    <td>{this.state.webPageData.featureExtractorResult.browserInfo.viewportWidth}</td>
                  </tr>
                </table>
              </div>
            }
            {this.state.currentPage === 'meta-element-count' &&
              <div>
                Element Count
              </div>
            }
            {this.state.currentPage === 'meta-detection-visualization' &&
              <div>
                Detection Visualization
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
