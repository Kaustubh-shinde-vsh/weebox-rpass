console.log("checkNavigatedPage");
$(document).ready(function () {
  var b;
  var c = mpaasConstants.chromeSendMessage;
  var a = mpaasConstants.loginState;
  var d = mpaasConstants.chromeStorage;
  chrome.storage.local.get(["proctoringTimeout"], function (e) {
    b = e.proctoringTimeout * 1000;
  });
  chrome.storage.local.get(["exam"], function (e) {
    console.log("check navigatioedPage exam:- ", e);
    if (e.exam === d.START) {
      localStorage.clear();
      chrome.storage.local.set({ exam: d.STOP });
      setTimeout(function () {
        setInterval(function () {
          // chrome.runtime.sendMessage({ action: c.CLOSE_WINDOW });
        }, 500);
      }, b);
    }
  });
});
