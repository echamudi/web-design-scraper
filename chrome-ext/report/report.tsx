// import { WebPageData } from "Core/types/types";
import * as React from 'react';
import { render } from "react-dom";
import { DefaultButton, PrimaryButton, Stack, IStackTokens, initializeIcons } from 'office-ui-fabric-react';
import { Nav, INavStyles, INavLinkGroup } from 'office-ui-fabric-react/lib/Nav';
import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import * as moment from 'moment';
import { navLinkGroups } from './nav-link-groups';
import { FeatureExtractorResultPhase2 } from 'Core/types/feature-extractor';

initializeIcons();

interface ReportState {
  currentPage: string,
  webPageData: FeatureExtractorResultPhase2 | null,
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
      reportData__url: this.state.webPageData?.browserInfo.url
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
                <img src={this.state.webPageData.viewportScreenshot.image} style={{width: 800}}/>
                <hr/>
                <table>
                  <tr>
                    <th style={{width: 200}}>Property</th>
                    <th style={{width: 300}}>Value</th>
                  </tr>
                  <tr>
                    <td>Viewport Height</td>
                    <td>{this.state.webPageData.browserInfo.viewportHeight}</td>
                  </tr>
                  <tr>
                    <td>Viewport Width</td>
                    <td>{this.state.webPageData.browserInfo.viewportWidth}</td>
                  </tr>
                  <tr>
                    <td>Page Height</td>
                    <td>{this.state.webPageData.browserInfo.pageHeight}</td>
                  </tr>
                  <tr>
                    <td>Page Width</td>
                    <td>{this.state.webPageData.browserInfo.pageWidth}</td>
                  </tr>
                  <tr>
                    <td>Device Pixel Ratio</td>
                    <td>{this.state.webPageData.browserInfo.devicePixelRatio}</td>
                  </tr>
                </table>
              </div>
            }
            {/* {this.state.currentPage === 'meta-detection-visualization' &&
              <div className="report-details-container">
                <h1>
                  Detection Visualization
                </h1>
                <hr/>
                <p>
                  Here are the detected el
                </p>
              </div>
            } */}
            {this.state.currentPage === 'symmetry-pixel' &&
              <div className="report-details-container">
                <h1>
                  Symmetry (Pixel)
                </h1>
                <hr/>
                <p>
                  This factor item tells the symmetry of the viewport snapshot through a vertical line.
                  The algorithm checks the ciede2000 difference of each pixel from each side.
                </p>
                
                <h2>
                  Visualization
                </h2>
                <p>Hover the cursor over the image to see the unsymmetrical pixel (marked with red colour)</p>
                <h2>
                  Design Scraping Result
                </h2>
                <table>
                  <tr>
                    <th style={{width: 200}}>Metric</th>
                    <th style={{width: 300}}>Value</th>
                  </tr>
                  <tr>
                    <td>Horizontal Ciede Average</td>
                    <td>{this.state.webPageData.colorSymmetry.horizontal.ciede2000average}</td>
                  </tr>
                  <tr>
                    <td>Vertical Ciede Average</td>
                    <td>{this.state.webPageData.colorSymmetry.vertical.ciede2000average}</td>
                  </tr>
                </table>
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
