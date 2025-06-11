console.log("popup");
chrome.storage.local.get(["state"], function (b) {
  var a = mpaasConstants.loginState;
  console.log("login state", b.state);
  switch (b.state) {
    case a.LOADING:
      loading();
      break;
    case a.PROFESSOR_LOGIN_SUCCESS:
      professorLogin();
      break;
    case a.STUDENT_LOGIN_SUCCESS:
      studentLogin();
      break;
    case a.LOGOUT:
      signOut();
      break;
    case a.LTI_CHECK_FAILED:
      ltiCheck();
      break;
    case a.LOGIN_FAIL:
      LoginFail();
      break;
    case a.TOKEN_EXPIRED:
      tokenCheck();
      break;
  }
});
$("#logout").click(function () {
  let loginState = mpaasConstants.loginState;
  chrome.storage.local.set({ state: loginState.LOGOUT });
  window.location.reload();
});
function loading() {
  console.log("popup loading");
  $("#login").addClass("d-none");
  $("#loading").removeClass("d-none");
}
function LoginFail() {
  console.log("popup LoginFail");
  $("#login").addClass("d-none");
  $("#LoginFail").removeClass("d-none");
}
function studentLogin() {
  console.log("popup studentLogin");
  $("#loading").addClass("d-none");
  $("#login").addClass("d-none");
  $("#success").addClass("d-none");
  $("#studentSuccess").removeClass("d-none");
}
function professorLogin() {
  console.log("popup professorLogin");
  $("#loading").addClass("d-none");
  $("#login").addClass("d-none");
  $("#success").removeClass("d-none");
}
function ltiCheck() {
  $("#lti-check").removeClass("d-none");
  console.log("popup ltiCheck");
  $("#login").addClass("d-none");
  $("#success").addClass("d-none");
  $("#loading").addClass("d-none");
}
function tokenCheck() {
  $("#token-check").removeClass("d-none");
  $("#lti-check").addClass("d-none");
  console.log("popup tokenCheck");
  $("#login").addClass("d-none");
  $("#success").addClass("d-none");
  $("#loading").addClass("d-none");
}
function signOut() {
  console.log("popup signOut");
  $("#login").removeClass("d-none");
  $("#success").addClass("d-none");
  $("#loading").addClass("d-none");
}
