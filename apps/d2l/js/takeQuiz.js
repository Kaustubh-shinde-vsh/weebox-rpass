function init() {
  $(".d2l-page-main").append(sharedTemplate.chatView());
  takeQuizService.getStoredMessages();
  takeQuizService.startProctor();
  takeQuizService.getProctorMessages();
  takeQuizService.disableKeys();
  takeQuizService.fullScreenCheck();
  takeQuizService.allClickEvents();
}
chrome.storage.local.get(["state"], function (b) {
  var a = mpaasConstants.loginState;
  if (b.state === a.STUDENT_LOGIN_SUCCESS) {
    let ProctorActive = sessionStorage.getItem("proctor");
    if (ProctorActive === "Active") {
      chrome.storage.local.get(function (d) {
        if (d.fullScreen == false) {
          if (d.navigationControl == true) {
            var c = mpaasConstants.chromeSendMessage;
            setInterval(function () {
              chrome.runtime.sendMessage({ type: "action", action: c.NC });
            }, 500);
          }
        }
      });
      setTimeout(function () {
        init();
      }, 2500);
    }
  }
});
