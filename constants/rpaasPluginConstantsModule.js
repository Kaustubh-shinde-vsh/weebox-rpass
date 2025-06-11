console.log("loginService");
// constants/rpaasPluginConstants.js (or whatever path you prefer, matches manifest)

const loginType = Object.freeze({
  MOODLE_PROFESSOR_VIEW: "MOODLE_PROFESSOR_VIEW",
  MOODLE_STUDENT_VIEW: "MOODLE_STUDENT_VIEW",
  CANVAS_PROFESSOR_VIEW: "CANVAS_PROFESSOR_VIEW",
  CANVAS_STUDENT_VIEW: "CANVAS_STUDENT_VIEW",
  BLACKBOARD_PROFESSOR_VIEW: "BLACKBOARD_PROFESSOR_VIEW",
  BLACKBOARD_STUDENT_VIEW: "BLACKBOARD_STUDENT_VIEW",
});

const lmsType = Object.freeze({
  MOODLE: "moodle",
  CANVAS: "canvas",
  BLACKBOARD: "blackboard",
  D2L: "d2l",
});

const loginState = Object.freeze({
  PROFESSOR_LOGIN_SUCCESS: "PROFESSOR_LOGIN_SUCCESS",
  LOGOUT: "LOGOUT",
  LOADING: "LOADING",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  LTI_CHECK_FAILED: "LTI_CHECK_FAILED",
  STUDENT_LOGIN_SUCCESS: "STUDENT_LOGIN_SUCCESS",
  LOGIN_FAIL: "LOGIN_FAIL",
});

const chromeSendMessage = Object.freeze({
  SET_TESTTAB: "SET_TESTTAB",
  ACTIVATE_TESTTAB: "ACTIVATE_TESTTAB",
  START_PROCTORING: "START_PROCTORING",
  STOP_PROCTORING: "STOP_PROCTORING",
  DIAGONOSTIC_TAB_CLOSE: "DIAGONOSTIC_TAB_CLOSE",
  BLUR: "BLUR",
  CLOSE_WINDOW: "CLOSE_WINDOW",
  FULL_SCREEN: "FULL_SCREEN",
  DIAGONOSTIC_ERROR_TAB: "DIAGONOSTIC_ERROR_TAB",
  TWOTABS: "TWOTABS",
  CHECKEXAMTABS: "CHECKEXAMTABS",
  CLOSE_OTHER_TABS: "CLOSE_OTHER_TABS",
  NC: "NC",
  BACKGROUND_BLUR: "BACKGROUND_BLUR",
});

const localStorageValues = Object.freeze({
  ACTIVE: "Active",
  START: "start",
  YES: "yes",
});

const chromeStorage = Object.freeze({
  START: "start",
  STOP: "stop",
});

const checkStatus = Object.freeze({
  ERROR: "error",
});

export default {
  loginType,
  lmsType,
  loginState,
  chromeSendMessage,
  localStorageValues,
  chromeStorage,
  checkStatus,
};
