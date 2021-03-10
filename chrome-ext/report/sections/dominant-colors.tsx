import * as React from 'react';
import { BrowserInfoExtractResult, ColorSymmetryExtractResult } from 'Core/types/feature-extractor';
import { ReportState } from '../report';

export class DominantColorsReport extends React.Component<{ reportState: ReportState }> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const rs = this.props.reportState;
    if (rs.webPageData === null) return <div />;

    return (
      <div className="report-details-container">
        <h1>
          Dominant Colors
        </h1>
        <hr />

        <p>
          Extracted dominant colors by using
          {' '}
          <a href="https://github.com/Vibrant-Colors/node-vibrant" rel="noopener">Vibrant</a>
          {' '}
          library.
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
        <img src={rs.webPageData.viewportScreenshot.image} style={{ width: 800 }} />

        <table className="dsr-table">
          <thead>
            <tr>
              <th style={{ width: 200 }}>Metric</th>
              <th style={{ width: 50 }}>Scale</th>
              <th style={{ width: 300 }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {/* Vibrant */}
            <tr>
              <td>Vibrant Hex</td>
              <td>-</td>
              <td>
                <span style={{
                  display: 'inline-block', width: 50, height: 20, backgroundColor: rs.webPageData.vibrantColors.vibrantHex,
                }}
                />
                &nbsp;
                {rs.webPageData.vibrantColors.vibrantHex}
              </td>
            </tr>
            <tr>
              <td>Vibrant Area Percentage</td>
              <td>[0, 1]</td>
              <td>{rs.webPageData.vibrantColors.vibrantPixelPercentage}</td>
            </tr>
            {/* Muted */}
            <tr>
              <td>Muted Hex</td>
              <td>-</td>
              <td>
                <span style={{
                  display: 'inline-block', width: 50, height: 20, backgroundColor: rs.webPageData.vibrantColors.mutedHex,
                }}
                />
                &nbsp;
                {rs.webPageData.vibrantColors.mutedHex}
              </td>
            </tr>
            <tr>
              <td>Muted Area Percentage</td>
              <td>[0, 1]</td>
              <td>{rs.webPageData.vibrantColors.mutedPixelPercentage}</td>
            </tr>
            {/* Dark Vibrant */}
            <tr>
              <td>Dark Vibrant Hex</td>
              <td>-</td>
              <td>
                <span style={{
                  display: 'inline-block', width: 50, height: 20, backgroundColor: rs.webPageData.vibrantColors.darkVibrantHex,
                }}
                />
                &nbsp;
                {rs.webPageData.vibrantColors.darkVibrantHex}
              </td>
            </tr>
            <tr>
              <td>Dark Vibrant Area Percentage</td>
              <td>[0, 1]</td>
              <td>{rs.webPageData.vibrantColors.darkVibrantPixelPercentage}</td>
            </tr>
            {/* Dark Muted */}
            <tr>
              <td>Dark Muted Hex</td>
              <td>-</td>
              <td>
                <span style={{
                  display: 'inline-block', width: 50, height: 20, backgroundColor: rs.webPageData.vibrantColors.darkMutedHex,
                }}
                />
                &nbsp;
                {rs.webPageData.vibrantColors.darkMutedHex}
              </td>
            </tr>
            <tr>
              <td>Dark Muted Area Percentage</td>
              <td>[0, 1]</td>
              <td>{rs.webPageData.vibrantColors.darkMutedPixelPercentage}</td>
            </tr>
            {/* Light Vibrant */}
            <tr>
              <td>Light Vibrant Hex</td>
              <td>-</td>
              <td>
                <span style={{
                  display: 'inline-block', width: 50, height: 20, backgroundColor: rs.webPageData.vibrantColors.lightVibrantHex,
                }}
                />
                &nbsp;
                {rs.webPageData.vibrantColors.lightVibrantHex}
              </td>
            </tr>
            <tr>
              <td>Light Vibrant Area Percentage</td>
              <td>[0, 1]</td>
              <td>{rs.webPageData.vibrantColors.lightVibrantPixelPercentage}</td>
            </tr>
            {/* Light Muted */}
            <tr>
              <td>Light Muted Hex</td>
              <td>-</td>
              <td>
                <span style={{
                  display: 'inline-block', width: 50, height: 20, backgroundColor: rs.webPageData.vibrantColors.lightMutedHex,
                }}
                />
                &nbsp;
                {rs.webPageData.vibrantColors.lightMutedHex}
              </td>
            </tr>
            <tr>
              <td>Light Muted Area Percentage</td>
              <td>[0, 1]</td>
              <td>{rs.webPageData.vibrantColors.lightMutedPixelPercentage}</td>
            </tr>
          </tbody>
        </table>
        <hr />
      </div>
    );
  }
}
