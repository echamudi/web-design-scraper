import { WebPageData } from "Core/types/types";
import * as React from 'react';
import { render } from "react-dom";
import { DefaultButton, PrimaryButton, Stack, IStackTokens, initializeIcons } from 'office-ui-fabric-react';
import { Nav, INavStyles, INavLinkGroup } from 'office-ui-fabric-react/lib/Nav';
import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';

initializeIcons();

const navStyles: Partial<INavStyles> = { root: { width: 300 } };

const navLinkGroups: INavLinkGroup[] = [
    {
        name: 'Overview',
        links: [
            {
                name: 'Overview',
                key: 'meta-overview',
                url: ''
            },
            {
                name: 'Element Count',
                key: 'meta-element-count',
                url: ''
            },
            {
                name: 'Detection Visualization',
                key: 'meta-detection-visualization',
                url: ''
            },
        ],
    },
    {
        name: 'Distribution of Components',
        links: [
            {
                name: 'Symmetry (Pixel LR)',
                key: 'symmetry-pixel-l-r',
                url: ''
            },
            {
                name: 'Symmetry (Pixel TB)',
                key: 'symmetry-pixel-t-b',
                url: ''
            },
            {
                name: 'Complexity (Text DOM)',
                key: 'complexity-text-dom',
                url: ''
            },
            {
                name: 'Density (Pixel)',
                key: 'density-pixel',
                url: ''
            },
            {
                name: 'Density (DOM)',
                key: 'density-major-dom',
                url: ''
            },
        ],
    },
    {
        name: 'Appearance of Components',
        links: [
            {
                name: 'Cohesion (Image DOM)',
                key: 'cohesion-image-dom',
                url: ''
            },
            {
                name: 'Economy (Image DOM)',
                key: 'economy-image-dom',
                url: ''
            },
            {
                name: 'Economy (Text DOM)',
                key: 'economy-text-dom',
                url: ''
            },
        ],
    },
    {
        name: 'Alignment of Components',
        links: [
            {
                name: 'Simplicity (Horizontal)',
                key: 'simplicity-horizontal',
                url: ''
            },
            {
                name: 'Simplicity (Vertical)',
                key: 'simplicity-vertical',
                url: ''
            },
        ],
    },
    {
        name: 'Color Usage',
        links: [
            {
                name: 'Dominant Colors',
                key: 'dominant-colors',
                url: ''
            },
        ],
    },
    {
        name: 'Graphics',
        links: [
            {
                name: 'Use of Pictures',
                key: 'graphic-pictures',
                url: ''
            },
            {
                name: 'Use of Videos',
                key: 'graphic-videos',
                url: ''
            },
        ],
    },
    {
        name: 'Typography',
        links: [
            {
                name: 'Text Size',
                key: 'text-size',
                url: ''
            },
            {
                name: 'Type of Font',
                key: 'text-total-fonts',
                url: ''
            },
            {
                name: 'Type of Font',
                key: 'text-font-type',
                url: ''
            },
        ],
    },
    {
        name: 'Structure',
        links: [
            {
                name: 'Negative Space (Text)',
                key: 'negative-space-text',
                url: ''
            },
        ],
    },
];

class App extends React.Component {
    public state = {
        currentPage: 'overview',
        webPageData: null,
    };

    constructor(props: any) {
        super(props);

        navLinkGroups.forEach(group=> {
            group.links.forEach(link => {
                link.forceAnchor = true;
                link.onClick = () => {
                    this.setState((prevStates) => ({
                        ...prevStates,
                        currentPage: link.key ?? ''
                    }));
                }
            })
        });

        chrome.storage.local.get(['webPageData'], (items) => {
            this.setState((prevStates) => ({
                ...prevStates,
                webPageData: items['webPageData']
            }));

            console.log(this.state.webPageData);
        });
    }

    render() {
        return (
            <Stack horizontal>
                <Stack.Item disableShrink>
                    <div style={{width: 300}}></div>
                    <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto} style={{width: 300}}>
                        <Nav styles={navStyles} groups={navLinkGroups} />
                    </ScrollablePane>
                </Stack.Item>
                <Stack.Item grow>
                    {this.state.currentPage === 'meta-overview' &&
                        <div>
                            Overview
                        </div>
                    }
                    {this.state.currentPage === 'meta-element-count' &&
                        <div>
                            Element Count
                        </div>
                    }
                    {this.state.currentPage === 'meta-detection-visualization' &&
                        <div>
                            Detection Visualization
                        </div>
                    }
                </Stack.Item>
            </Stack>
        )
    }
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
