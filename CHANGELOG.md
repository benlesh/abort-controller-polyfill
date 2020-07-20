## [0.0.3](https://github.com/benlesh/abort-controller-polyfill/compare/0.0.2...0.0.3) (2020-07-20)


### Code Refactoring

* Remove EventTarget polyfilling ([f170f0e](https://github.com/benlesh/abort-controller-polyfill/commit/f170f0eed79eb86b5a0050b8e218396b1ebaac54))


### BREAKING CHANGES

* This module now only polyfills AbortController and AbortSignal, if you are in a version of node that requires EventTarget, you will need to polyfill that also. Recommended to use [event-target-polyfill](https://www.npmjs.com/package/event-target-polyfill) if that is necessary.



