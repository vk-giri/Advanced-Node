// an idea of how event loop works internally

// node myFile.js

const pendingTimers = [];
const pendingOSTasks = [];
const pendingOperations = [];

// new timers, tasks, operations are recorded from myFile running
myFile.runContents();

// entering the event loop

function shouldContinue() {
  // check one: any pending setTimeout, setInterval, setImmediate?
  // Check two: any pending OS tasks? (like server listening to port)
  // Check three: any pending long running operations? (like fs module)

  // if any of these returns true the event loop will continue
  return pendingTimers.length || pendingOSTasks.length || pendingOperations.length;
}

// entire body executes in one "tick"
while (shouldContinue) {
  // 1. node looks at pendingTimers and sees if any functions are ready to be called. setTimeout, setIntervals
  // 2. node looks at pendingOsTasks and pendingOperations and calls relevant callbacks

  // 3. Puase executions. continue when....
  // - a new pendingOSTask is done
  // - a new pendingOperation is done
  // - a timer is about to complete

  // 4. Look at pendingTimers. Call any setImmediate

  // 5. handle any 'close' events

}

// exit back to terminal
