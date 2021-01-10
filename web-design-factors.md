# Web Design Factors

List of web design factors from past research results.

| Factor | Item | Description | Measurable? | Sub-item | Detection Area | Unique ID |
| - | - | - | - | - | - | - | - |
| Distribution of Components | Symmetry | Overall symmetrical appearance towards vertical, horizontal, and diagonal | Yes | Pixel color left-right symmetry | Viewport | symmetry-pixel-l-r |
|  |  |  |  | Pixel color top-bottom symmetry | Viewport | symmetry-pixel-t-b |
|  | Balance | Difference of components weight between two sides divided by horizontal axis and vertical axis. | Yes |  |  | balance-lr |
|  | Equilibrium | Difference of components center of mass toward screen center | Yes |  |  | equilibrium |
|  | Homogeneity | Distributions of components in different quadrants. | Yes |  |  | homogenity |
|  | Complexity | Amount of information per area in the screen | Yes | Text DOM element complexity | Entire Page | complexity-text-dom |
|  | Density | Percentage of area that contains components toward the total screen area. | Yes | Pixel color based density | Viewport | density-pixel |
|  |  |  |  | Major DOM element based density | Entire Page | density-major-dom |
| Appearance of Components | Cohesion | Consistency of component shape ratio. | Yes | Consistency of image element shape ratio | Entire Page | cohesion-image-dom |
|  | Proportion | Shape of components are consistent and following a certain proportional shape. | Yes |  |  | proportion |
|  | Economy | Consistency of component size (area). | Yes | Consistency of image DOM element areas | Entire Page | economy-image-dom |
|  |  |  |  | Consistency of text DOM element areas | Entire Page | economy-text-dom |
|  | Emphasis | Important element is styled slightly differently | Out of Scope |  |  | emphasis |
|  | Unity | Perception that components in one group belong together | Out of Scope |  |  | unity |
| Alignment of Components | Simplicity | Total number of alignment points | Yes | Total alignment point in x-axis (horizontal) | Viewport | simplicity-horizontal |
|  |  |  |  | Total alignment point in y-axis (vertical) | Viewport | simplicity-vertical |
|  | Regularity | Spacing between alignment points | Yes |  |  | regularity |
|  | Alignment | Components positioning consistency toward alignment lines. | Yes |  |  | alignments |
|  | Number of Groups | Total number of component groups | Yes |  |  | total-groups |
| Order of Components | Sequence | Order of components based on shape and information sequence. | Out of Scope |  |  | sequence |
|  | Rhythm | Order of components based on component appearance | Yes |  |  | rhythm |
| Color Usage | Color Harmony | Color selections belong together in certain harmony pattern | Yes |  |  | color-harmony |
|  | Dominant Colors | Dominant and Accent colors | Yes |  | Viewport | dominant-colors |
|  | Hue | Color selection for the primary color | Yes |  |  | hue |
|  | Brightness | Overall brightness of the colors measured by the quantity of emitted light in the color | Yes |  |  | brightness |
|  | Saturation | Overall saturation of the colors measured by the chromatic intensity | Yes |  |  | saturation |
| Graphics | Use of Pictures | Existence of ample graphics | Yes |  | Entire Page | pictures |
|  | Use of Videos | Existence of ample videos | Yes |  | Entire Page | videos |
| Performance | Speed | The loading speed of the webpage | Out of Scope |  |  | speed |
| Typography | Text Contrast Ratio (Legibility) | The color difference between the text and the foreground color | Yes |  |  | text-contrast-ratio |
|  | Text Size | Dimension of characters in term of readability | Yes |  | Entire Page | text-size |
|  | Total Unique Fonts | The amount of different font styles used in the website | Yes |  | Entire Page | text-total-fonts |
|  | Type of Font | The used font type (serif, sans-serif, TNR, courier, etc) | Yes |  | Entire Page | text-font-type |
| Buttons | Size | Minimum button hit size | Yes |  |  | button-size |
|  | Location | Button positioning relative to the viewport | Yes |  |  | button-location |
| Organizational Structure | Content Quality | The degree of the provided information whether it is sufficient and complete or not. | Out of Scope |  |  | content-quality |
|  | Interactivity | How information is displayed to enhance consistent user interaction. | Out of Scope |  |  | interactivity |
|  | Navigation (Complexity) | The degree of the navigations that guide the user to enter other sections in the website. | Yes |  |  | navigation |
|  | Use of Negative Space | The ratio between content and the empty space | Yes | Text based negative space | Entire Page | negative-space-text |

<!-- 
Find:
^(.*?)\t(.*?)\t(.*?)\t(.*?)\t(.*?)\t(.*?)\t(.*?)\t(.*?)\t(.*?)\n 
Replace:
| $1 | $2 | $3 | $5 | $6 | $7 | $8 |\n
-->