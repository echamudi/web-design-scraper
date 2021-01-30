import * as React from 'react';
import { BrowserInfoExtractResult, ColorSymmetryExtractResult } from 'Core/types/feature-extractor';

interface Props {
  colorSymmetry: ColorSymmetryExtractResult,
  browserInfo: BrowserInfoExtractResult
}

export class SymmetryPixelReport extends React.Component<Props> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className="report-details-container">
        <h1>
          Symmetry (Pixel)
        </h1>
        <hr />

        <p>
          This factor item tells the symmetry of the viewport snapshot through a horizontal line and vertical line.
          The algorithm checks the ciede2000 difference of each pixel from each side.
        </p>
        <p><b>Detection Scope : </b> Viewport</p>
        <hr />

        <h2>
          Design Scraping Result
        </h2>
        <table>
          <thead>
            <tr>
              <th style={{ width: 200 }}>Metric</th>
              <th style={{ width: 300 }}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Horizontal Ciede Average</td>
              <td>{this.props.colorSymmetry.horizontal.ciede2000average}</td>
            </tr>
            <tr>
              <td>Vertical Ciede Average</td>
              <td>{this.props.colorSymmetry.vertical.ciede2000average}</td>
            </tr>
          </tbody>
        </table>
        <hr />
        <h2>
          Visualization
        </h2>
        <p>In the following visualization, the red parts are the Asymmetrical parts,
        while the white parts are the symmetrical parts.
        </p>
        <p><b>Asymmetrical portion (horizontal line)</b></p>
        <img style={{ width: this.props.browserInfo.viewportWidth / 2 }} src={this.props.colorSymmetry.horizontal.visualization} alt="" />
        <p><b>Asymmetrical portion (vertical line)</b></p>
        <img style={{ height: this.props.browserInfo.viewportHeight / 2 }} src={this.props.colorSymmetry.vertical.visualization} alt="" />
      </div>
    );
  }
}
