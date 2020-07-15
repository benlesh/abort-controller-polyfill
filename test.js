require("./index.js");

{
  // It should polyfill AbortController et al
  assertDefined(AbortController, "AbortController was not defined");
  assertDefined(AbortSignal, "AbortSignal was not defined");

  const ac = new AbortController();
  assertInstanceOf(
    ac.signal,
    AbortSignal,
    "abortController.signal was not instanceof AbortSignal"
  );
  assertInstanceOf(
    ac.signal,
    EventTarget,
    "AbortSignal was not instanceof EventTarget"
  );
}

{
  const ac = new AbortController();
  assert(ac.signal.aborted === false, "signal.aborted should be false");
  ac.abort();
  assert(ac.signal.aborted === true, "signal.aborted should be true");
}

{
  // Basic onabort functionality
  const ac = new AbortController();

  const signal = ac.signal;

  let onabortCalled = 0;

  signal.onabort = (e) => {
    assertInstanceOf(e, Event, "onabort should get an Event");
    assert(
      e.type === "abort",
      'onabort should get an event with the type "abort"'
    );
    onabortCalled++;
  };

  ac.abort();
  ac.abort();

  assert(signal.aborted === true, "Signal should be flagged as aborted.");
  assert(
    onabortCalled === 1,
    `onabort should be called once. It was called ${onabortCalled} times.`
  );
}

{
  // onabort should be fired when event is dispatched directly
  const ac = new AbortController();

  const signal = ac.signal;

  let onabortCalled = 0;

  signal.onabort = (e) => {
    onabortCalled++;
  };

  signal.dispatchEvent(new Event("abort"));
  signal.dispatchEvent(new Event("abort"));

  assert(
    signal.aborted === false,
    "Manual event dispatch should not flag signal as aborted"
  );
  assert(
    onabortCalled === 2,
    `onabort should be called twice. It was called ${onabortCalled} times.`
  );
}

{
  // addEventListener functionality
  const ac = new AbortController();

  const signal = ac.signal;

  let handlerCalled = 0;

  const handler = () => {
    handlerCalled++;
  };

  signal.addEventListener("abort", handler);

  ac.abort();
  ac.abort();

  assert(signal.aborted === true, "Signal should be flagged as aborted.");
  assert(
    handlerCalled === 1,
    `handler should be called once. It was called ${handlerCalled} times.`
  );
}

{
  // add/remove event listener functionality
  const ac = new AbortController();

  const signal = ac.signal;

  let handlerCalled = 0;

  const handler = () => {
    handlerCalled++;
  };

  signal.addEventListener("abort", handler);
  signal.removeEventListener("abort", handler);

  ac.abort();
  ac.abort();

  assert(signal.aborted === true, "Signal should be flagged as aborted.");
  assert(
    handlerCalled === 0,
    `Removed handler should not be called. It was called ${handlerCalled} times.`
  );
}

{
  // adding the same event handler more than once should not make a difference.
  const ac = new AbortController();

  const signal = ac.signal;

  let handlerCalled = 0;

  const handler = () => {
    handlerCalled++;
  };

  signal.addEventListener("abort", handler);
  signal.addEventListener("abort", handler);
  signal.addEventListener("abort", handler);
  signal.addEventListener("abort", handler);
  signal.addEventListener("abort", handler);

  ac.abort();
  ac.abort();

  assert(signal.aborted === true, "Signal should be flagged as aborted.");
  assert(
    handlerCalled === 1,
    `handler should be called once. It was called ${handlerCalled} times.`
  );
}

{
  // Event Listener object test
  const ac = new AbortController();

  const signal = ac.signal;

  const listener = {
    handleEvent: function (e) {
      assertInstanceOf(e, Event, "handleEvent should be called with an Event");
      assert(
        e.type === "abort",
        'The type of event passed to handleEvent should be "abort"'
      );
      assert(
        this === listener,
        "The context of the handleEvent call should not change"
      );
      this.calls++;
    },
    calls: 0,
  };

  signal.addEventListener("abort", listener);
  signal.addEventListener("abort", listener);
  signal.addEventListener("abort", listener);
  signal.addEventListener("abort", listener);
  signal.addEventListener("abort", listener);

  ac.abort();
  ac.abort();

  assert(signal.aborted === true, "Signal should be flagged as aborted.");
  assert(
    listener.calls === 1,
    `handler should be called once. It was called ${listener.calls} times.`
  );
}

{
  // The order in which addEventListener or onabort are altered matters! (Weird, but true)
  let ac1 = new AbortController();
  const order1 = [];
  ac1.signal.onabort = () => order1.push("onabort");
  ac1.signal.addEventListener("abort", () => order1.push("addEventListener"));

  ac1.abort();
  assert(
    order1.join(",") === ["onabort", "addEventListener"].join(","),
    "In this case, onabort should fire before the addEventListener abort"
  );

  let ac2 = new AbortController();
  const order2 = [];
  ac2.signal.addEventListener("abort", () => order2.push("addEventListener"));
  ac2.signal.onabort = () => order2.push("onabort");

  ac2.abort();
  assert(
    order2.join(",") === ["addEventListener", "onabort"].join(","),
    "In this case, addEventListener abort should fire before the onabort"
  );
}

{
  // Ensure an error is thrown if AbortSignal is constructed directly
  let error = undefined;
  try {
    new AbortSignal();
  } catch (err) {
    error = err;
  }

  assertInstanceOf(error, TypeError);
  assert(error.message, "Illegal constructor.");
}

function assert(condition, msg) {
  if (!condition) {
    fail(msg);
  }
}

function assertDefined(x, msg) {
  if (typeof x === "undefined") {
    fail(msg);
  }
}

function assertInstanceOf(x, ctor, msg) {
  if (!(x instanceof ctor)) {
    fail(msg);
  }
}

function fail(message) {
  throw new Error(message);
}

console.log("All tests passed");
