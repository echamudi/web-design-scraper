import * as React from 'react';
import { Phase3 } from 'Executor/phases';

export function DensityMajorDomReport(props: {
  phase3: Phase3,
  miniVw: number,
  densityMajorDomViz?: React.RefObject<HTMLCanvasElement>,
}) {
  return (
    <div className="report-details-container">
      <h1>
        Density (DOM)
      </h1>
      <hr />

      <p>
        In DOM-based density, we compare the major elements area towards empty area.
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
            <td>Maximum Grid Density</td>
            <td>[0, 1]</td>
            <td>{props.phase3.densityMajorDom?.data.maxDensity}</td>
          </tr>
          <tr>
            <td>Minimum Grid Density</td>
            <td>[0, 1]</td>
            <td>{props.phase3.densityMajorDom?.data.minDensity}</td>
          </tr>
          <tr>
            <td>Average Density</td>
            <td>[0, 1]</td>
            <td>{props.phase3.densityMajorDom?.data.average}</td>
          </tr>
          <tr>
            <td>Score</td>
            <td>[0, 1]</td>
            <td>{props.phase3.densityMajorDom?.score}</td>
          </tr>
        </tbody>
      </table>
      <hr />
      <h2>Visualization</h2>
      <p>The blue area is text DOM, and the orange area is image based DOM.</p>
      <canvas ref={props.densityMajorDomViz} style={{ width: props.miniVw, border: 'red solid 2px' }} />
    </div>
  );
}
