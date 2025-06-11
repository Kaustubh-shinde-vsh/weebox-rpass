function init() {
  if ($(".placeholder").find("span").text().trim("").includes("Enter")) {
    return;
  }
  $(".locationPane").append(sharedTemplate.chatView());
  takeQuizService.getStoredMessages();
  takeQuizService.startProctor();
  takeQuizService.getProctorMessages();
  takeQuizService.disableKeys();
  takeQuizService.fullScreenCheck();
  bindEvents();
}
function bindEvents() {
  takeQuizService.allClickEvents();
  $(".submit.button-1")
    .add(".button-4")
    .add(".submit")
    .add(".answerSavedButton")
    .add(".browse")
    .add(".genericButton")
    .add("img")
    .add("#bottom_saveAllAnswersButton")
    .on("click", function () {
      takeQuizService.submitQuizAttempt();
      takeQuizService.stopProctoring();
      chrome.storage.local.get(["navigationControl"], function (a) {
        if (a.navigationControl) {
          takeQuizService.unbindblur();
        }
      });
    });
}
chrome.storage.local.get(["state"], function (b) {
  var a = mpaasConstants.loginState;
  if (b.state === a.STUDENT_LOGIN_SUCCESS) {
    let ProctorActive = sessionStorage.getItem("proctor");
    if (ProctorActive === "Active") {
      chrome.storage.local.get(["navigationControl"], function (c) {
        if (c.navigationControl) {
          $(window).blur(function () {
            if ($("iframe").is(":focus")) {
              takeQuizService.unbindblur();
              console.log("focus fire");
            }
          });
        }
      });
      init();
      $(document).keydown(function (c) {
        if (c.keyCode == 13) {
          return false;
        }
      });
    }
  }
});
