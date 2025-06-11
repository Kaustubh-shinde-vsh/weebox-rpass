console.log("moodle/takeQuiz");
function init() {
  takeQuizService.getStoredMessages();
  takeQuizService.startProctor();
  takeQuizService.getProctorMessages();
  takeQuizService.disableKeys();
  takeQuizService.fullScreenCheck();
  quizTimeOut();
  bindEvents();
}
function quizTimeOut() {
  setTimeout(function () {
    if ($("#quiz-timer").find("span").html().length > 1) {
      setInterval(function () {
        if ($("#quiz-timer").find("span").html() === "0:00:00") {
          takeQuizService.submitQuizAttempt();
          takeQuizService.stopProctoring();
        }
      }, 500);
    } else {
      console.log("No time set for this quiz");
    }
  }, 3000);
}
function bindEvents() {
  takeQuizService.allClickEvents();
  let submitQuiz = $("form[action*='processattempt.php']").find(
    "[type|='submit']"
  );
  $(submitQuiz).click(function () {
    setTimeout(function () {
      let submitBtn =
        "<input type='button' id='submitBtn' class='btn btn-info text-white' value='Submit all and Finish'>";
      $(".confirmation-buttons").prepend(submitBtn);
      $(".confirmation-buttons").find(".btn-primary").hide();
      $("#submitBtn").on("click", function () {
        takeQuizService.submitQuizAttempt();
        takeQuizService.stopProctoring();
        $(".confirmation-buttons").find(".btn-primary").click();
      });
    }, 500);
  });
}
chrome.storage.local.get(["state"], function (b) {
  var a = mpaasConstants.loginState;
  if (b.state === a.STUDENT_LOGIN_SUCCESS) {
    let ProctorActive = sessionStorage.getItem("proctor");
    if (ProctorActive === "Active") {
      init();
    }
  }
});
