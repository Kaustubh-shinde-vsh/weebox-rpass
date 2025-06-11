console.log("moodle/checkTool");
$(document).ready(function () {
  console.log("checkToot loaded ");
  var a = mpaasConstants.loginState;
  var c = mpaasConstants.chromeSendMessage;
  var d = mpaasConstants.chromeStorage;
  let ltiUrl = $("#page-wrapper")
    .find("a[href*='/mod/lti/view.php']")
    .attr("href");
  console.log("ltiUrl tag- ", ltiUrl);
  if (!ltiUrl) {
    console.log("lti Url not found");
  } else {
    let newUrl = ltiUrl.replace("view", "launch");
    if (newUrl) {
      localStorage.setItem("ltiUrl", newUrl);
    }
  }
  let reviewUrl = window.location.href;
  let checkReview = reviewUrl.includes("review");
  if (checkReview) {
    // b();
  }
  if ($("table.summary").length === 1) {
    b();
  }
  function b() {
    localStorage.removeItem("DWindow");
    localStorage.removeItem("startExam");
    sessionStorage.removeItem("proctor");
    chrome.storage.local.set({ exam: d.STOP });
    chrome.runtime.sendMessage({ type: "action", action: c.STOP_PROCTORING });
    // chrome.storage.local.set({ state: a.LOGOUT });
    localStorage.removeItem("messageStart");
    localStorage.removeItem("messages");
  }
});
