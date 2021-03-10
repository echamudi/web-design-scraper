import * as React from 'react';
import ReactDOM from 'react-dom';
import { BrowserInfoExtractResult, ColorSymmetryExtractResult } from 'Core/types/feature-extractor';
import { TextSizeExtractResult } from 'Core/types/factors';
import { Chart } from 'react-charts';
import { ConsistencyScoreCalculateResult } from 'Core/evaluator/score-calculator/consistency';
import { utilArrayToChartData } from 'Core/utils/math';
import { ReportState } from '../report';

interface Props {
  consistencyResult: ConsistencyScoreCalculateResult | undefined,
  title: string,
  description: JSX.Element,
  visualizationDescription: JSX.Element
}

export class ConsistencyScoreReport extends React.Component<Props> {
  constructor(props: any) {
    super(props);
  }

  render() {
    if (this.props.consistencyResult === undefined) return <div />;

    const series = {
      type: 'bar',
    };

    const axes = [
      { primary: true, type: 'ordinal', position: 'left' },
      {
        position: 'bottom', type: 'linear', stacked: false, base: 0,
      },
    ];

    const textSizes = utilArrayToChartData(this.props.consistencyResult.data.transformedMembers ?? []);

    const chartData = [
      {
        label: 'Total Elements',
        data: textSizes,
      },
    ];

    return (
      <div className="report-details-container">
        <h1>
          {this.props.title}
        </h1>
        <hr />

        {this.props.description}
        <p>
          <b>Detection Scope : </b>
          {' '}
          Entire Page
        </p>
        <hr />

        <h2>
          Design Scraping Result
        </h2>
        <table className="dsr-table">
          <thead>
            <tr>
              <th style={{ width: 200 }}>Metric</th>
              <th style={{ width: 50 }}>Scale</th>
              <th style={{ width: 300 }}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Score</td>
              <td>[0, 1]</td>
              <td>{this.props.consistencyResult.score ?? 'N/A'}</td>
            </tr>
          </tbody>
        </table>
        <hr />
        <h2>Visualization</h2>
        {this.props.visualizationDescription}
        <div style={{ height: 500, width: 800 }}>
          <Chart data={chartData} series={series} axes={axes} tooltip />
        </div>
      </div>
    );
  }
}
