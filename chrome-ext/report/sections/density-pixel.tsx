import * as React from 'react';
import { BrowserInfoExtractResult, ColorDistributionExtractResult, ColorSymmetryExtractResult } from 'Core/types/feature-extractor';
import { ColorCountExtractResult } from 'Core/types/factors';
import { rgbToHex } from 'Core/utils/color';

interface Props {
  colorCount: ColorCountExtractResult,
  colorDistribution: ColorDistributionExtractResult,
  browserInfo: BrowserInfoExtractResult,
}

export class DensityPixelReport extends React.Component<Props> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const topColor = this.props.colorCount.rank[0]?.color ?? { r: 255, g: 255, b: 255 };
    const topColorHex = `#${rgbToHex(topColor)}`;

    return (
      <div className="report-details-container">
        <h1>
          Density (Pixel)
        </h1>
        <hr />

        <p>
          In pixel-based density, the algorithm checks the most used color and compare the number with total pixels.
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
              <td>Most Used Color</td>
              <td />
              <td>
                <span style={{
                  display: 'inline-block', width: 50, height: 20, backgroundColor: topColorHex,
                }}
                />
                {' '}
                {topColorHex}
              </td>
            </tr>
            <tr>
              <td>Most Used Color Percentage</td>
              <td>[0, 1]</td>
              <td>{this.props.colorDistribution.colorTop1.percentage}</td>
            </tr>
          </tbody>
        </table>
        <hr />

        <h2>Visualization</h2>
        <p>
          The blue area is the part of the screenshot that uses the most used color (
          {topColorHex}
          ).
        </p>
        <img style={{ width: this.props.browserInfo.viewportWidth / 2 }} src={this.props.colorDistribution.colorTop1.visualization} alt="" />
      </div>
    );
  }
}
