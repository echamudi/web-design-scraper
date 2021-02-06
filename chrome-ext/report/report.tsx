// import { WebPageData } from "Core/types/types";
import * as React from 'react';
import { render } from 'react-dom';
import { initializeIcons, Spinner, SpinnerSize } from 'office-ui-fabric-react';
import { Nav } from 'office-ui-fabric-react/lib/Nav';
import * as moment from 'moment';
import { Phase2Result } from 'Core/types/types';
import { Phase3 } from 'Executor/phases';
import { copyCanvasContent } from 'Core/utils/canvas';
import { navLinkGroups } from './nav-link-groups';
import { OverviewReport } from './sections/overview';
import { SymmetryPixelReport } from './sections/symmetry-pixel';
import { DominantColorsReport } from './sections/dominant-colors';
import { TextSizeReport } from './sections/text-size';
import { DensityPixelReport } from './sections/density-pixel';
import { ConsistencyScoreReport } from './sections/consistency-score';
import { DensityMajorDomReport } from './sections/density-major-dom';
import { ComplexityTextDomReport } from './sections/complexity-text-dom';
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
  graphicPicturesViz?: React.RefObject<HTMLCanvasElement>,
  phase3?: Phase3
}

class App extends React.Component {
  public state: ReportState = {
    currentPage: 'overview',
    webPageData: null,
  };

  constructor(props: any) {
    super(props);

    navLinkGroups.forEach((group) => {
      group.links.forEach((link) => {
        link.forceAnchor = true;
        link.onClick = () => {
          this.setState((prevStates: Readonly<ReportState>): ReportState => ({
            ...prevStates,
            currentPage: link.key ?? '',
          }));
        };
      });
    });

    chrome.storage.local.get(['webPageData'], (items) => {
      this.setState((prevStates: Readonly<ReportState>): ReportState => {
        const { webPageData } = items;
        const phase3 = new Phase3(document, webPageData);

        return {
          ...prevStates,
          webPageData,
          complexityTextDomViz: React.createRef(),
          densityMajorDomViz: React.createRef(),
          simplicityHorizontalViz: React.createRef(),
          simplicityVerticalViz: React.createRef(),
          graphicPicturesViz: React.createRef(),
          phase3,
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
      reportData__url: this.state.webPageData?.browserInfo.url,
    }));
  }

  downloadJSON(rs: ReportState) {
    if (rs.webPageData === null) return;

    const data = {
      phase2: rs.webPageData,
      phase3: rs.phase3?.getAllScores(),
    };

    const text = JSON.stringify(data, undefined, 2);
    const fileType = 'text/json';
    const time = moment.unix(rs.webPageData.timestamp / 1000).format('YYYY-MM-DD HH-MM');
    const fileName = `Web Design Scraping ${time}.json`;

    const blob = new Blob([text], { type: 'text/json' });
    
    const a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
  }

  render() {
    if (this.state.webPageData === null || this.state.phase3 === undefined) {
      return (
        <div style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        >
          <Spinner label="Loading Result..." labelPosition="right" size={SpinnerSize.large} />
        </div>
      );
    }

    const { phase3, webPageData } = this.state;

    const miniVw = webPageData.browserInfo.viewportWidth / 2;
    const miniVh = webPageData.browserInfo.viewportHeight / 2;

    return (
      <div className="report">
        <div className="report-navbar">
          <img src="./assets/logo-small.svg" height="40"/>
          <div className="report-navbar-title" style={{margin: '0 10px'}}>
            Web Design Scraper
          </div>
        </div>
        <div className="report-content">
          <div className="report-sidebar">
            <Nav styles={{ root: { width: 300 } }} groups={navLinkGroups} />
          </div>
          <div className="report-details">
            {this.state.currentPage === 'meta-overview'
              && (
                <OverviewReport 
                  reportState={this.state}
                  downloadJSON={() => {this.downloadJSON(this.state)}}
                />
              )}
            {this.state.currentPage === 'symmetry-pixel'
              && (
                <SymmetryPixelReport
                  browserInfo={this.state.webPageData.browserInfo}
                  colorSymmetry={this.state.webPageData.colorSymmetry}
                />
              )}
            {
              this.state.currentPage === 'complexity-text-dom'
              && (
                <ComplexityTextDomReport
                  complexityTextDomViz={this.state.complexityTextDomViz}
                  miniVw={miniVw}
                  phase3={phase3}
                />
              )
            }
            {
              this.state.currentPage === 'density-pixel'
              && (
                <DensityPixelReport
                  browserInfo={this.state.webPageData.browserInfo}
                  colorCount={this.state.webPageData.colorCount}
                  colorDistribution={this.state.webPageData.colorDistribution}
                />
              )
            }
            {
              this.state.currentPage === 'density-major-dom'
              && (
                <DensityMajorDomReport
                  densityMajorDomViz={this.state.densityMajorDomViz}
                  miniVw={miniVw}
                  phase3={phase3}
                />
              )
            }
            {
              this.state.currentPage === 'cohesion-image-dom'
              && (
                <ConsistencyScoreReport
                  consistencyResult={phase3.cohesionImageDom}
                  title="Cohesion (Image DOM)"
                  description={<p>
                    The cohesion algorithm checks the consistency of image aspect ratio.
                    The aspect ratio is width divided by height.
                  </p>}
                  visualizationDescription={<></>}
                />
              )
            }
            {
              this.state.currentPage === 'economy-image-dom'
              && (
                <ConsistencyScoreReport
                  consistencyResult={phase3.economyImageDom}
                  title="Economy (Image DOM)"
                  description={<p>
                    The economy-images algorithm checks the consistency of image elements area.
                    The areas are rounded to the multiplication of 100x100 sizes.
                  </p>}
                  visualizationDescription={<>
                    <p>
                      0 means area between 0 and 10000 pxsq,<br/>
                      1 means area between 10,000 and 20,000 pxsq,<br/>
                      2 means area between 20,000 and 30,000 pxsq, etc.
                    </p>
                  </>}
                />
              )
            }
            {
              this.state.currentPage === 'economy-text-dom'
              && (
                <ConsistencyScoreReport
                  consistencyResult={phase3.economyTextDom}
                  title="Economy (Text)"
                  description={<p>
                    The economy-text algorithm checks the consistency of text elements area.
                    The areas are rounded to the multiplication of 100x100 sizes.
                  </p>}
                  visualizationDescription={<>
                    <p>
                      0 means area between 0 and 10000 pxsq,<br/>
                      1 means area between 10,000 and 20,000 pxsq,<br/>
                      2 means area between 20,000 and 30,000 pxsq, etc.
                    </p>
                  </>}
                />
              )
            }
            {
              this.state.currentPage === 'simplicity-horizontal'
              && (
                <div className="report-details-container">
                  <h1>
                    Simplicity (Horizontal)
                  </h1>
                  <hr />

                  <p>
                    The simplicity-horizontal algorithm checks total number of alignment points of elements in x-axis.
                    Only elements larger than the threshold size are included in the calculation.
                  </p>
                  <p>
                    <b>Detection Scope : </b>
                    {' '}
                    Visible Viewport Area
                  </p>
                  <hr />

                  <h2>
                    Design Scraping Result
                  </h2>
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: 200 }}>Metric</th>
                        <th style={{ width: 50 }}>Scale</th>
                        <th style={{ width: 300 }}>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Total Alignment Points</td>
                        <td>[0, 1]</td>
                        <td>{phase3.simplicityHorizontal?.data.totalSignificantAPs}</td>
                      </tr>
                      <tr>
                        <td>Score</td>
                        <td>[0, 1]</td>
                        <td>{phase3.simplicityHorizontal?.score}</td>
                      </tr>
                    </tbody>
                  </table>
                  <hr />
                  <h2>Visualization</h2>
                  <canvas ref={this.state.simplicityHorizontalViz} style={{ width: miniVw, border: 'red solid 2px' }} />
                </div>
              )
            }
            {
              this.state.currentPage === 'simplicity-vertical'
              && (
                <div className="report-details-container">
                  <h1>
                    Simplicity (Vertical)
                  </h1>
                  <hr />

                  <p>
                    The simplicity-vertical algorithm checks total number of alignment points of elements in y-axis.
                    Only elements larger than the threshold size are included in the calculation.
                  </p>
                  <p>
                    <b>Detection Scope : </b>
                    {' '}
                    Visible Viewport Area
                  </p>
                  <hr />

                  <h2>
                    Design Scraping Result
                  </h2>
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: 200 }}>Metric</th>
                        <th style={{ width: 50 }}>Scale</th>
                        <th style={{ width: 300 }}>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Total Alignment Points</td>
                        <td>[0, 1]</td>
                        <td>{phase3.simplicityVertical?.data.totalSignificantAPs}</td>
                      </tr>
                      <tr>
                        <td>Score</td>
                        <td>[0, 1]</td>
                        <td>{phase3.simplicityVertical?.score}</td>
                      </tr>
                    </tbody>
                  </table>
                  <hr />
                  <h2>Visualization</h2>
                  <canvas ref={this.state.simplicityVerticalViz} style={{ width: miniVw, border: 'red solid 2px' }} />
                </div>
              )
            }
            {
              this.state.currentPage === 'dominant-colors'
              && <DominantColorsReport reportState={this.state} />
            }
            {
              this.state.currentPage === 'graphic-pictures'
              && (
                <div className="report-details-container">
                  <h1>
                    Use of Pictures
                  </h1>
                  <hr />

                  <p>
                    This factor item checks the area of the page that is covered by pictures.
                  </p>
                  <p>
                    <b>Detection Scope : </b>
                    {' '}
                    Entire Page
                  </p>
                  <hr />

                  <h2>
                    Design Scraping Result
                  </h2>
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: 200 }}>Metric</th>
                        <th style={{ width: 50 }}>Scale</th>
                        <th style={{ width: 300 }}>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Total Image Area</td>
                        <td>[0, Inf]</td>
                        <td>{this.state.phase3.graphicPictures?.imageArea}</td>
                      </tr>
                      <tr>
                        <td>Image Area Percentage</td>
                        <td>[0, 1]</td>
                        <td>{this.state.phase3.graphicPictures?.imagePercentage}</td>
                      </tr>
                    </tbody>
                  </table>
                  <hr />
                  <h2>Visualization</h2>
                  <canvas ref={this.state.graphicPicturesViz} style={{ width: miniVw, border: 'red solid 2px' }} />
                </div>
              )
            }
            {
              this.state.currentPage === 'text-size'
              && <TextSizeReport textSize={webPageData.textSize} />
            }
            {
              this.state.currentPage === 'text-font-type'
              && (
                <div className="report-details-container">
                  <h1>
                    Font Type
                  </h1>
                  <hr />

                  <p>
                    This factor item extracts all used font stacks in the page.
                  </p>
                  <p>
                    <b>Detection Scope : </b>
                    {' '}
                    Entire Page
                  </p>
                  <hr />

                  <h2>
                    Design Scraping Result
                  </h2>
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: 350 }}>Font Stack</th>
                        <th style={{ width: 100 }}>Number of characters</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        Object
                          .keys(phase3.textFontType?.fontStacks ?? {})
                          .map((fontStack, index) => (
                            <tr key={fontStack}>
                              <td>{fontStack}</td>
                              <td>{phase3.textFontType?.fontStacks[fontStack]}</td>
                            </tr>
                          ))
                      }
                      <tr>
                        <td />
                        <td />
                      </tr>
                    </tbody>
                  </table>
                </div>
              )
            }
          </div>
        </div>
      </div>
    );
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
      );
    }

    if (this.state.simplicityHorizontalViz?.current && this.state.phase3?.simplicityHorizontalViz) {
      copyCanvasContent(
        this.state.phase3.simplicityHorizontalViz,
        this.state.simplicityHorizontalViz.current,
      );
    }

    if (this.state.simplicityVerticalViz?.current && this.state.phase3?.simplicityVerticalViz) {
      copyCanvasContent(
        this.state.phase3.simplicityVerticalViz,
        this.state.simplicityVerticalViz.current,
      );
    }

    if (this.state.graphicPicturesViz?.current && this.state.phase3?.graphicPicturesViz) {
      copyCanvasContent(
        this.state.phase3.graphicPicturesViz,
        this.state.graphicPicturesViz.current,
      );
    }
  }
}

const rootElement = document.getElementById('root');
render(<App />, rootElement);
