import { executePhase2 } from "Executor/phases";

// chrome.runtime.onInstalled.addListener(function () {
//   chrome.storage.sync.set({ data: 'Hello' }, function () {
//     console.log('Data is set.');
//   });
//   chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
//     chrome.declarativeContent.onPageChanged.addRules([{
//       conditions: [new chrome.declarativeContent.PageStateMatcher({
//         pageUrl: {},
//       })
//       ],
//       actions: [new chrome.declarativeContent.ShowPageAction()]
//     }]);
//   });
// });

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {

    if (request.message == "executePhase2") {
        executePhase2(request.phase1Result, request.screenshot).then((phase2Result) => {
            sendResponse({
                phase2Result
            });
        }).catch((err) => {
            sendResponse({err});
        })

        return true;
    }
  }
);
