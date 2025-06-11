console.log("navigationOff");
chrome.storage.local.get(function (d) {
  var b = mpaasConstants.chromeSendMessage;
  var c = mpaasConstants.chromeStorage;
  var a = mpaasConstants.loginState;
  if (!d.navigationControl && d.state === a.STUDENT_LOGIN_SUCCESS) {
    let startTest = localStorage.getItem("startExam");
    if (startTest === "start") {
      setTimeout(function () {
        chrome.storage.local.set({ state: a.LOGOUT });
        localStorage.clear();
        chrome.storage.local.set({ exam: c.STOP });
        // setInterval(function () {
        chrome.runtime.sendMessage({
          type: "action",
          action: b.STOP_PROCTORING,
        });
        chrome.runtime.sendMessage({ type: "action", action: b.CLOSE_WINDOW });
        // }, 700);
      }, 500);
    }
  }
});
