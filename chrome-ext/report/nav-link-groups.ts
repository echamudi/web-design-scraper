import { INavLinkGroup } from 'office-ui-fabric-react';

const navLinkGroups: INavLinkGroup[] = [
    {
        name: 'Overview',
        links: [
            {
                name: 'Overview',
                key: 'meta-overview',
                url: '',
            },
            // {
            //     name: 'Detection Visualization',
            //     key: 'meta-detection-visualization',
            //     url: ''
            // },
        ],
    },
    {
        name: 'Distribution of Components',
        links: [
            {
                name: 'Symmetry (Pixel)',
                key: 'symmetry-pixel',
                url: '',
            },
            {
                name: 'Complexity (Text DOM)',
                key: 'complexity-text-dom',
                url: '',
            },
            {
                name: 'Density (Pixel)',
                key: 'density-pixel',
                url: '',
            },
            {
                name: 'Density (DOM)',
                key: 'density-major-dom',
                url: '',
            },
        ],
    },
    {
        name: 'Appearance of Components',
        links: [
            {
                name: 'Cohesion (Image DOM)',
                key: 'cohesion-image-dom',
                url: '',
            },
            {
                name: 'Economy (Image DOM)',
                key: 'economy-image-dom',
                url: '',
            },
            {
                name: 'Economy (Text DOM)',
                key: 'economy-text-dom',
                url: '',
            },
        ],
    },
    {
        name: 'Alignment of Components',
        links: [
            {
                name: 'Simplicity (Horizontal)',
                key: 'simplicity-horizontal',
                url: '',
            },
            {
                name: 'Simplicity (Vertical)',
                key: 'simplicity-vertical',
                url: '',
            },
        ],
    },
    {
        name: 'Color Usage',
        links: [
            {
                name: 'Dominant Colors',
                key: 'dominant-colors',
                url: '',
            },
        ],
    },
    {
        name: 'Graphics',
        links: [
            {
                name: 'Use of Pictures',
                key: 'graphic-pictures',
                url: '',
            },
            {
                name: 'Use of Videos',
                key: 'graphic-videos',
                url: '',
            },
        ],
    },
    {
        name: 'Typography',
        links: [
            {
                name: 'Text Size',
                key: 'text-size',
                url: '',
            },
            {
                name: 'Type of Font',
                key: 'text-total-fonts',
                url: '',
            },
        ],
    },
    // {
    //     name: 'Structure',
    //     links: [
    //         {
    //             name: 'Negative Space (Text)',
    //             key: 'negative-space-text',
    //             url: '',
    //         },
    //     ],
    // },
];

export { navLinkGroups };
