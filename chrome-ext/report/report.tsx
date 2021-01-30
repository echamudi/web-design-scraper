// import { WebPageData } from "Core/types/types";
import * as React from 'react';
import { render } from "react-dom";
import { initializeIcons, Spinner, SpinnerSize } from 'office-ui-fabric-react';
import { Nav } from 'office-ui-fabric-react/lib/Nav';
import * as moment from 'moment';
import { navLinkGroups } from './nav-link-groups';
import { Phase2Result } from 'Core/types/types';
import { Phase3 } from 'Executor/phases';
import { copyCanvasContent } from 'Core/utils/canvas';
import { OverviewReport } from './sections/overview';
import { SymmetryPixelReport } from './sections/symmetry-pixel';
// import { PartialDeep } from 'type-fest';

initializeIcons();

export interface ReportState {
  currentPage: string,
  webPageData: Phase2Result | null,
  reportData__timestamp?: string,
  reportData__url?: string,
  complexityTextDomViz?: React.RefObject<HTMLCanvasElement>,
  densityMajorDomViz?: React.RefObject<HTMLCanvasElement>,
  simplicityHorizontalViz?: React.RefObject<HTMLCanvasElement>,
  simplicityVerticalViz?: React.RefObject<HTMLCanvasElement>,
  phase3?: Phase3
}

class App extends React.Component {
  public state: ReportState = {
    currentPage: 'overview',
    webPageData: null
  };

  constructor(props: any) {
    super(props);

    navLinkGroups.forEach(group => {
      group.links.forEach(link => {
        link.forceAnchor = true;
        link.onClick = () => {
          this.setState((prevStates: Readonly<ReportState>): ReportState => ({
            ...prevStates,
            currentPage: link.key ?? '',
          }));
        }
      })
    });

    chrome.storage.local.get(['webPageData'], (items) => {
      this.setState((prevStates: Readonly<ReportState>): ReportState => {
        const webPageData: Phase2Result = items['webPageData'];
        const phase3 = new Phase3(document, webPageData);

        return {
          ...prevStates,
          webPageData,
          complexityTextDomViz: React.createRef(),
          densityMajorDomViz: React.createRef(),
          simplicityHorizontalViz: React.createRef(),
          simplicityVerticalViz: React.createRef(),
          phase3
        };
      }, () => {
        this.prepareReport();
      });
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
        <div style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Spinner label="Loading Result..." labelPosition="right" size={SpinnerSize.large} />
        </div>
      )
    }

    const miniVw = this.state.webPageData.browserInfo.viewportWidth / 2;
    const miniVh = this.state.webPageData.browserInfo.viewportHeight / 2;

    return (
      <div className="report">
        <div className="report-navbar">
          <div className="report-navbar-title">
            Web Design Scraper
          </div>
        </div>
        <div className="report-content">
          <div className="report-sidebar">
            <Nav styles={{ root: { width: 300 } }} groups={navLinkGroups} />
          </div>
          <div className="report-details">
            {this.state.currentPage === 'meta-overview' &&
              <OverviewReport reportState={this.state}/>
            }
            {this.state.currentPage === 'symmetry-pixel' &&
              <SymmetryPixelReport
                browserInfo={this.state.webPageData.browserInfo}
                colorSymmetry={this.state.webPageData.colorSymmetry}
                />
            }
            {
              this.state.currentPage === 'complexity-text-dom' &&
              <div className="report-details-container">
                <h1>
                  Complexity (Text DOM)
                </h1>
                <hr />
                <canvas ref={this.state.complexityTextDomViz} style={{ width: miniVw, border: 'red solid 2px' }}/>
              </div>
            }
            {
              this.state.currentPage === 'density-pixel' &&
              <div className="report-details-container">
                <h1>
                  Density (Pixel)
                </h1>
                <hr />
                <p><b>Most used color area</b></p>
                <img style={{ width: this.state.webPageData.browserInfo.viewportWidth / 2 }} src={this.state.webPageData.colorDistribution.colorTop1.visualization} alt="" />
              </div>
            }
            {
              this.state.currentPage === 'density-major-dom' &&
              <div className="report-details-container">
                <h1>
                  Density (DOM)
                </h1>
                <hr />
                <canvas ref={this.state.densityMajorDomViz} style={{ width: miniVw, border: 'red solid 2px' }}/>
              </div>
            }
            {
              this.state.currentPage === 'simplicity-horizontal' &&
              <div className="report-details-container">
                <h1>
                  Simplicity (Horizontal)
                </h1>
                <hr />
                <canvas ref={this.state.simplicityHorizontalViz} style={{ width: miniVw, border: 'red solid 2px' }}/>
              </div>
            }
            {
              this.state.currentPage === 'simplicity-vertical' &&
              <div className="report-details-container">
                <h1>
                  Simplicity (Vertical)
                </h1>
                <hr />
                <canvas ref={this.state.simplicityVerticalViz} style={{ width: miniVw, border: 'red solid 2px' }}/>
              </div>
            }
          </div>
        </div>
        <>
          {}
        </>
      </div>
    )
  }

  componentDidUpdate() {
    // Update canvas visualization
    if (this.state.complexityTextDomViz?.current && this.state.phase3?.complexityTextDomViz) {
      copyCanvasContent(
        this.state.phase3.complexityTextDomViz,
        this.state.complexityTextDomViz.current,
      );
    }

    if (this.state.densityMajorDomViz?.current && this.state.phase3?.densityMajorDomViz) {
      copyCanvasContent(
        this.state.phase3.densityMajorDomViz,
        this.state.densityMajorDomViz.current,
      )
    }

    if (this.state.simplicityHorizontalViz?.current && this.state.phase3?.simplicityHorizontalViz) {
      copyCanvasContent(
        this.state.phase3.simplicityHorizontalViz,
        this.state.simplicityHorizontalViz.current,
      )
    }

    if (this.state.simplicityVerticalViz?.current && this.state.phase3?.simplicityVerticalViz) {
      copyCanvasContent(
        this.state.phase3.simplicityVerticalViz,
        this.state.simplicityVerticalViz.current,
      )
    }
  }
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
