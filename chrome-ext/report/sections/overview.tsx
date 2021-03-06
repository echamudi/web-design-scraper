import * as React from 'react';
import { PrimaryButton } from 'office-ui-fabric-react';
import { ReportState } from '../report';

export class OverviewReport extends React.Component<{
  reportState: ReportState,
  downloadJSON(): void,
}> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const rs = this.props.reportState;
    if (rs.webPageData === null) return <div />;

    return (
      <div className="report-details-container">
        <h1>
          Overview
        </h1>
        <hr />
        <p>
          <b>URL: </b>
          {' '}
          <a href={rs.reportData__url} target="_blank" rel="noopener noreferrer">{rs.reportData__url}</a>
          <br />
          <b>Date: </b>
          {' '}
          {rs.reportData__timestamp}
          <br />
        </p>
        <img src={rs.webPageData.viewportScreenshot.image} style={{ width: 800 }} />
        <hr />
        <p>
          This report is the result of web design scraping of the link above.
          You can browse the results from the left sidebar,
          or you can download the raw result in JSON format from the link below:
        </p>
        <PrimaryButton text="Download JSON" onClick={this.props.downloadJSON} />
        <hr />
        <table className="dsr-table">
          <thead>
            <tr>
              <th style={{ width: 200 }}>Property</th>
              <th style={{ width: 300 }}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Viewport Height</td>
              <td>{rs.webPageData.browserInfo.viewportHeight}</td>
            </tr>
            <tr>
              <td>Viewport Width</td>
              <td>{rs.webPageData.browserInfo.viewportWidth}</td>
            </tr>
            <tr>
              <td>Page Height</td>
              <td>{rs.webPageData.browserInfo.pageHeight}</td>
            </tr>
            <tr>
              <td>Page Width</td>
              <td>{rs.webPageData.browserInfo.pageWidth}</td>
            </tr>
            <tr>
              <td>Device Pixel Ratio</td>
              <td>{rs.webPageData.browserInfo.devicePixelRatio}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
