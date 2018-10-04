// ============================================================================================
// SVG literals
// ============================================================================================

/**
 * Wraps image literal itnto CSS Data-URL syntax
 * @export
 * @param {*} data Image literal
 * @returns
 */
export function cssUrl (data) {
  return `data:image/svg+xml;base64,${ data }`;
}

/**
 * Generates a Tag SVG icon literal
 * @export
 * @param {*} color Icon color
 * @param {*} width Icon width
 * @param {*} height Icon height
 */
export function Tag ({ color = '#ccc', width = 14, height = 16 } = {}) {
  return btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${ width }" height="${ height }">
      <path fill="${ color }" d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 0 0 0-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"></path>
    </svg>
  `);
};

/**
 * Generates a Note SVG icon literal
 * @export
 * @param {*} color Icon color
 * @param {*} width Icon width
 * @param {*} height Icon height
 */
export function Note ({ color = '#ccc', width = 6, height = 12 } = {}) {
  return btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${ width }" height="${ height }">
      <path fill="${ color }" d="M2.81 5h1.98L3 14H1l1.81-9zm.36-2.7c0-.7.58-1.3 1.33-1.3.56 0 1.13.38 1.13 1.03 0 .75-.59 1.3-1.33 1.3-.58 0-1.13-.38-1.13-1.03z"></path>
    </svg>
  `);
};
