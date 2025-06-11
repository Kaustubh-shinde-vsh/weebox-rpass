function init() {
  $(".ic-Layout-columns").append(sharedTemplate.chatView());
  $(".form-actions").find("#submit_quiz_button").hide();
  $("#times_up_dialog").find("button").hide();
  takeQuizService.getStoredMessages();
  takeQuizService.startProctor();
  takeQuizService.getProctorMessages();
  takeQuizService.disableKeys();
  takeQuizService.fullScreenCheck();
  quizTimeOut();
  bindEvents();
}
function quizTimeOut() {
  setInterval(function () {
    if ($(".countdown_seconds").html() === "0") {
      takeQuizService.submitQuizAttempt();
      takeQuizService.stopProctoring();
    }
    if ($(".countdown_seconds").html() > "10") {
      $(document).keydown(function (a) {
        if (a.keyCode == 27) {
          $("#submitQuiz").click();
        }
      });
    }
  }, 500);
}
function bindEvents() {
  takeQuizService.allClickEvents();
  let submitQuizBtnTmpl =
    "<input type='button' id='submitQuiz' class='btn' value='Submit Quiz'>";
  let fineBtnTmpl =
    "<input type='button' id='fineBtn' class='btn' value='Ok Fine'>";
  $(".form-actions").append(submitQuizBtnTmpl);
  $("#times_up_dialog").append(fineBtnTmpl);
  $("#submitQuiz")
    .add("#fineBtn")
    .on("click", function () {
      chrome.storage.local.get(["navigationControl"], function (a) {
        if (a.navigationControl) {
          takeQuizService.unbindblur();
        }
      });
      $(".quiz_submit").click();
    });
  $("#submit_quiz_form").submit(function (event) {
    console.log("Tried submitting form");
    if (event.result == undefined) {
      takeQuizService.submitQuizAttempt();
      console.log("event.result success");
    }
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
    }
  }
});
