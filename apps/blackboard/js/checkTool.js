$(document).ready(function () {
  var c = mpaasConstants.chromeSendMessage;
  var a = mpaasConstants.loginState;
  let ltiUrl = decodeURIComponent(
    $("a[href*='contentWrapper.jsp']").attr("href")
  );
  if (!ltiUrl) {
    console.log("lti Url not found");
  } else {
    let endUrl = ltiUrl.substr(ltiUrl.lastIndexOf("/") + 1);
    let baseUrl = "/webapps/blackboard/execute/blti/";
    localStorage.setItem("BBltiUrl", baseUrl + endUrl);
  }
  let reviewUrl = window.location.href;
  let checkReview = reviewUrl.includes("submitted");
  if (checkReview) {
    b();
  }

  function b() {
    let ProctorActive = sessionStorage.getItem("proctor");
    if (ProctorActive === "Active") {
      proctoringSession.startWindow();
      localStorage.removeItem("DWindow");
      localStorage.removeItem("messageStart");
      localStorage.removeItem("messages");
      sessionStorage.clear();
      takeQuizService.stopProctoring();
      setInterval(function () {
        chrome.runtime.sendMessage({
          type: "action",
          action: c.STOP_PROCTORING,
        });
      }, 500);
      chrome.storage.local.set({
        state: a.LOGOUT,
      });
    }
  }
});
