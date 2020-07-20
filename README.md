[![npm version](https://badge.fury.io/js/yet-another-abortcontroller-polyfill.svg)](https://badge.fury.io/js/yet-another-abortcontroller-polyfill)

# abort-controller-polyfill

A simple polyfill for abort controller with proper event handling.

This was created because other polyfills had event handling that was so far off that fixing them would have contituted just rewriting them completely.

Polyfills the following:

- [AbortController]()
- [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)

## Development

Be sure to install dependencies. This depends on a lightweight [EventTarget polyfill](https://github.com/benlesh/event-target-polyfill), but nothing else.

To run tests, just run `npm test`.
