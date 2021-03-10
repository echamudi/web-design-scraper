import * as React from 'react';
import { Phase3 } from 'Executor/phases';

export function ComplexityTextDomReport(props: {
  phase3: Phase3,
  miniVw: number,
  complexityTextDomViz?: React.RefObject<HTMLCanvasElement>,
}) {
  return (
    <div className="report-details-container">
      <h1>
        Complexity (Text DOM)
      </h1>
      <hr />

      <p>
        Complexity is defined by the amount of information in each section of the web page.
        We calculate the complexity by checking the percentage of text area for each grid.
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
            <td>Maximum Grid Complexity</td>
            <td>[0, 1]</td>
            <td>{props.phase3?.complexityTextDom?.data.maxDensity}</td>
          </tr>
          <tr>
            <td>Minimum Grid Complexity Score</td>
            <td>[0, 1]</td>
            <td>{props.phase3?.complexityTextDom?.data.minDensity}</td>
          </tr>
          <tr>
            <td>Average</td>
            <td>[0, 1]</td>
            <td>{props.phase3?.complexityTextDom?.data.average}</td>
          </tr>
          <tr>
            <td>Score</td>
            <td>[0, 1]</td>
            <td>{props.phase3?.complexityTextDom?.score}</td>
          </tr>
        </tbody>
      </table>
      <hr />
      <h2>Visualization</h2>
      <canvas ref={props.complexityTextDomViz} style={{ width: props.miniVw, border: 'red solid 2px' }} />
    </div>
  );
}
