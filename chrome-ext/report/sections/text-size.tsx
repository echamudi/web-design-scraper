import * as React from 'react';
import ReactDOM from 'react-dom';
import { BrowserInfoExtractResult, ColorSymmetryExtractResult } from 'Core/types/feature-extractor';
import { TextSizeExtractResult } from 'Core/types/factors';
import { Chart } from 'react-charts';
import { ReportState } from '../report';

export class TextSizeReport extends React.Component<{ textSize: TextSizeExtractResult }> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const series = {
      type: 'bar',
    };

    const axes = [
      { primary: true, type: 'ordinal', position: 'left' },
      { position: 'bottom', type: 'linear', stacked: false },
    ];

    const textSizes = Object.keys(this.props.textSize.textSizeMap);

    const chartData = [
      {
        label: 'Total Character',
        data: textSizes.map((textSize) => ({
          primary: `${textSize}px`,
          secondary: this.props.textSize.textSizeMap[Number(textSize)],
        })),
      },
    ];

    return (
      <div className="report-details-container">
        <h1>
          Text Size
        </h1>
        <hr />

        <p>
          In this text size detection, all text sizes in the page are checked, and we count how many characters for each text size.
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
              <th style={{ width: 200 }}>Text Size</th>
              <th style={{ width: 300 }}>Total Character</th>
            </tr>
          </thead>
          <tbody>
            {textSizes.map((textSize, index) => (
              <tr key={textSize}>
                <td>
                  {textSize}
                  px
                </td>
                <td>{this.props.textSize.textSizeMap[Number(textSize)]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr />
        <h2>Visualization</h2>
        <div style={{ height: 500, width: 800 }}>
          <Chart data={chartData} series={series} axes={axes} tooltip />
        </div>
      </div>
    );
  }
}
