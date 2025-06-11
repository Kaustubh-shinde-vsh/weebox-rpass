$(document).ready(function () {
  var c = mpaasConstants.chromeSendMessage;
  var a = mpaasConstants.loginState;
  let reviewUrl = window.location.href;
  let checkReview = reviewUrl.includes("quiz_submissions");
  if (checkReview) {
    b();
  }
  if ($("table.summary").length === 1) {
    b();
  }
  function b() {
    let ProctorActive = sessionStorage.getItem("proctor");
    if (ProctorActive === "Active") {
      proctoringSession.startWindow();
      takeQuizService.submitQuizAttempt();
      console.log("submitQuizAttempt1- ");
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
      chrome.storage.local.set({ state: a.LOGOUT });
      setTimeout(function () {
        window.location.reload();
      }, 2000);
    }
  }
});
