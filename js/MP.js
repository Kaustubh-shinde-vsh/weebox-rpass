console.log("MP");
window.addEventListener("message", handleMessage, false);
var cameraframecontaineroffsettop;
window.addEventListener("scroll", (event) => {
  if ($("#cameraframecontainer").length) {
    if (!$("#cameraframecontainer").hasClass("sticky")) {
      cameraframecontaineroffsettop = $("#cameraframecontainer").offset().top;
    }
    var cameraframecontainerwidth = $("#cameraframecontainer").closest("div")[0]
      .clientWidth;
    var scroltop = $(window).scrollTop();
    if (cameraframecontaineroffsettop) {
      if (cameraframecontaineroffsettop > scroltop) {
        // console.log("remove Class");
        $("#cameraframecontainer").removeClass("sticky");
        $("#cameraframecontainer").removeAttr("style");
      } else {
        if ($("#cameraframecontainer").hasClass("sticky")) {
          // console.log("already have class");
        } else {
          // console.log("Add Again");
          $("#cameraframecontainer").attr(
            "style",
            "width:" + cameraframecontainerwidth + "px;"
          );
          $("#cameraframecontainer").addClass("sticky");
        }
        // $('#cameraframecontainer').addattr("style", "right:20px;");
      }
    }
  }
});
var EventType = Object.freeze({
  KEEP_ALIVE: "keep_alive",
  KEEP_ALIVE_ACK: "keep_alive_ack",
  START: "start",
  STOP: "stop",
  CHAT: "MESSAGE",
  DIAGONISTIC_SUCCESS: "diagonistic_success",
  DIAGONISTIC_FAILED: "diagonistic_failed",
  ANNOUNCEMENT: "ANNOUNCEMENT",
  CAMERA_UNAVAILABLE: "CAMERA_UNAVAILABLE",
  SCREEN_UNAVAILABLE: "SCREEN_UNAVAILABLE",
  WEB_SOCKET_DISCONNECTION: "WEB_SOCKET_DISCONNECTION",
  CANDIDATE_BLUR_OUT: "CANDIDATE_BLUR_OUT",
  CANDIDATE_BLUR_IN: "CANDIDATE_BLUR_IN",
  LOG_NAVIGATE_AWAY_EVENT: "LOG_NAVIGATE_AWAY_EVENT",
  CHECK_EXAM_STATUS: "inExamError",
  BACKGROUND_BLUR: "BACKGROUND_BLUR",
});

var MpaasConstants = Object.freeze({
  KEEP_ALIVE_INTERVAL: 5000,
  KEEP_ALIVE_ACK_CHECK_INTERVAL: 5000,
  KEEP_ALIVE_ACK_TIMEOUT: 10000,
});
// var loginState = mpaasConstants.loginState;
var TYPE = "type",
  DATA = "data",
  ID = "id",
  TIME = "time",
  ID = "id";
var launchSuccessCallback, launchErrorCallback;
var keepAliveId = 1;
var lastAckTime;
var pingIntervalId, pingAckIntervalId;
function handleMessage(b) {
  if (!b || !b.data) {
    return;
  }
  console.log("received mess " + JSON.stringify(b));
  var d = b.data;
  takeQuizService.proctorBackgroundCheck(d);
  switch (d.type) {
    case EventType.DIAGONISTIC_SUCCESS:
      if (launchSuccessCallback) {
        chrome.storage.local.set({ state: "STUDENT_LOGIN_SUCCESS" });
        launchSuccessCallback(proctoringSession);
      }
      break;
    case EventType.DIAGONISTIC_FAILED:
      if (launchErrorCallback) {
        // chrome.storage.local.set({ state: "LOGOUT" })
        // launchErrorCallback(d[DATA]);
      }
      break;
    case EventType.CHAT:
    case EventType.ANNOUNCEMENT:
      // console.log("received message " + JSON.stringify(b.data));
      if (typeof proctoringSession.getMessageListener() == "function") {
        proctoringSession.getMessageListener()(d);
      } else {
        console.log("Invalid argument for message listener.");
      }
      break;
    case EventType.KEEP_ALIVE_ACK:
      lastAckTime = Date.now();
      break;
    case EventType.CAMERA_UNAVAILABLE:
    case EventType.SCREEN_UNAVAILABLE:
    case EventType.WEB_SOCKET_DISCONNECTION:
      if (typeof proctoringSession.getErrorListener() == "function") {
        proctoringSession.getErrorListener()(d);
      } else {
        var a = mpaasConstants.chromeSendMessage;
        var c = mpaasConstants.chromeStorage;
        chrome.storage.local.set({ exam: c.STOP });
        var a = mpaasConstants.chromeSendMessage;
        setInterval(function () {
          console.log("TO be called DIAGONOSTIC_ERROR_TAB- ", {
            action: a.DIAGONOSTIC_ERROR_TAB,
          });
          // chrome.runtime.sendMessage({ action: a.DIAGONOSTIC_ERROR_TAB });
        }, 700);
        console.log("Invalid argument for error listener.");
      }
      break;
    case EventType.CHECK_EXAM_STATUS:
      takeQuizService.proctorStatusCheck(d);
      break;
    case EventType.BACKGROUND_BLUR:
      console.log("BACKGROUND_BLUR Received  event type", d);

      break;
    default:
      console.log("Received wrong event type", d);
  }
}
var proctoringSession = new (function () {
  var b, t, g;
  var r = false;
  var j = false;
  var checktimeout = false;
  function u() {
    MP.getWindow();
  }
  function e() {
    if (r) {
      return;
    }
    var x = new Object();
    x[TYPE] = EventType.START;
    MP.sendPostMessage(x);
    f();
    r = true;
  }
  function p() {
    if (j) {
      return;
    }
    var x = new Object();
    x[TYPE] = EventType.STOP;
    MP.sendPostMessage(x);
    k();
    j = true;
  }
  function h(x) {
    b = x;
  }
  function a() {
    return b;
  }
  function o(x) {
    t = x;
  }
  function d() {
    return t;
  }
  function w(x) {
    g = x;
  }
  function q() {
    return g;
  }
  function c(x) {
    var y = {};
    y[TYPE] = EventType.CHAT;
    y[DATA] = x;
    MP.sendPostMessage(y);
  }
  function i() {
    var x = {};
    x[TYPE] = EventType.CANDIDATE_BLUR_OUT;
    MP.sendPostMessage(x);
  }
  function v() {
    var x = {};
    x[TYPE] = EventType.CANDIDATE_BLUR_IN;
    MP.sendPostMessage(x);
  }
  function l(x) {
    console.log("MP l()");
    var y = {};
    y[TYPE] = EventType.LOG_NAVIGATE_AWAY_EVENT;
    y[TIME] = x;
    MP.sendPostMessage(y);
  }
  function f() {
    n();
    pingIntervalId = setInterval(n, MpaasConstants.KEEP_ALIVE_INTERVAL);
    pingAckIntervalId = setInterval(
      s,
      MpaasConstants.KEEP_ALIVE_ACK_CHECK_INTERVAL
    );
  }
  function k() {
    if (pingIntervalId) {
      clearInterval(pingIntervalId);
    }
    if (pingAckIntervalId) {
      clearInterval(pingAckIntervalId);
    }
  }
  function s() {
    var x = Date.now();
    lastAckTime = Date.now();
    // console.log("Connection lost", keepAliveId);
    var y = x - lastAckTime;
    if (isNaN(y) && keepAliveId > 50) {
      m();
    }
    // console.log("last message from Rpaas received  " + y + " ms ago");
    if (y > MpaasConstants.KEEP_ALIVE_ACK_TIMEOUT) {
      if (!j) {
        r = false;
        m();
      }
      k();
    } else {
      keepAliveId = 0;
    }
  }
  function m() {
    var y = mpaasConstants.chromeSendMessage;
    var x = mpaasConstants.loginState;
    var z = mpaasConstants.chromeStorage;
    localStorage.clear();
    chrome.runtime.sendMessage({ type: "action", action: y.STOP_PROCTORING });
    chrome.storage.local.set({ exam: z.STOP });
    chrome.storage.local.set({ state: x.LOGOUT });
    alert(
      "Connection with RPaaS lost. Please relaunch your browser and resume your test1111"
    );
    chrome.runtime.sendMessage({ type: "action", action: y.CLOSE_WINDOW });
  }
  function n() {
    var x = {};
    x[TYPE] = EventType.KEEP_ALIVE;
    x[TIME] = Date.now();
    x[ID] = keepAliveId;
    keepAliveId++;
    MP.sendPostMessage(x);
  }
  function closeCheckTimeout() {
    setTimeout(() => {
      checktimeout = false;
    }, 10500);
  }

  return {
    startWindow: u,
    start: e,
    stop: p,
    setEventListener: h,
    getEventListener: a,
    setMessageListener: o,
    getMessageListener: d,
    setErrorListener: w,
    getErrorListener: q,
    sendMessage: c,
    startPingPong: f,
    candidateBlurOut: i,
    candidateBlurIn: v,
    logNavigateAwayEvent: l,
  };
})();
var MP = new (function () {
  var b;
  function d(l, j, f, h) {
    var n = { token: l };
    var diagnosesuccessurl = localStorage.getItem("diagCheckUrl");
    console.log("diagnosesuccessurl- ", diagnosesuccessurl);
    localStorage.setItem("baseurl", j);
    var m = document.createElement("form");
    m.setAttribute("method", "post");
    m.setAttribute("action", j);
    m.setAttribute("target", "Rpass");
    for (var k in n) {
      if (n.hasOwnProperty(k)) {
        var g = document.createElement("input");
        g.type = "hidden";
        g.name = k;
        g.value = n[k];
        m.appendChild(g);
      }
    }
    document.body.appendChild(m);
    b = window.open(j, "Rpass");
    m.submit();
    document.body.removeChild(m);
    launchSuccessCallback = f;
    launchErrorCallback = h;
    var proctorstatus = document.createElement("IFRAME");
    proctorstatus.setAttribute("id", "proctorstatus");
    proctorstatus.setAttribute("style", "display:none;");
    proctorstatus.setAttribute("src", diagnosesuccessurl);
    proctorstatus.seamless = true;
    document.body.appendChild(proctorstatus);
    $(b).ready(function () {});
  }
  function a() {
    // console.log("on quiz page load call this API");
    chrome.storage.local.get(
      ["attemptData", "exam", "userfullname"],
      function (A) {
        let fullname = "new user";
        if (A.userfullname) {
          fullname = A.userfullname;
        }
        console.log("A- ", A);
        var mod_quiz_navblockcontainer =
          document.getElementById("mod_quiz_navblock");
        if (!mod_quiz_navblockcontainer) {
          mod_quiz_navblockcontainer = document.getElementById("right-side");
        }
        if (!mod_quiz_navblockcontainer) {
          mod_quiz_navblockcontainer = document.getElementById("d2l_form");
        }
        if (!mod_quiz_navblockcontainer) {
          mod_quiz_navblockcontainer = document.getElementById("menuWrap");
        }
        var navblockcontainer = document.createElement("div");
        navblockcontainer.setAttribute("id", "cameraframecontainer");
        mod_quiz_navblockcontainer.append(navblockcontainer);
        var mod_quiz_navblock = document.getElementById("cameraframecontainer");

        if (A.attemptData.cameraURL) {
          chrome.storage.local.set({ exam: "start" });
          cameraurl = A.attemptData.cameraURL;
          // console.log("cameraurl", cameraurl);
          // var mod_quiz_navblock = document.getElementById("page-wrapper");
          // var mod_quiz_navblock = document.getElementById("region-main");
          var cameraframe = document.createElement("IFRAME");
          if (A.attemptData.proctoringSettings.signlePageQuiz) {
            cameraframe.setAttribute("style", "min-height:450px; width:100%;");
          } else {
            cameraframe.setAttribute(
              "style",
              "min-height:0px; width:100%; display:none; opacity:0; visibility: hidden;"
            );
          }
          cameraframe.setAttribute("id", "cameraframe");
          cameraframe.setAttribute(
            "allow",
            "microphone ; camera ; geolocation ; midi ; encrypted-media ; autoplay "
          );
          cameraframe.setAttribute("src", cameraurl);
          cameraframe.seamless = true;
          mod_quiz_navblock.appendChild(cameraframe);
          $("#cameraframecontainer").append(
            '<audio id="RPaaSMessagebeep" class="hide"><source src=' +
              chrome.runtime.getURL("assets/message.mp3") +
              ' type="audio/mpeg"></audio>'
          );
          // console.log("A.attemptData.proctoringSettings- ", A.attemptData.proctoringSettings);
          if (A.attemptData.proctoringSettings.signlePageQuiz == false) {
            var cameravideo = document.createElement("VIDEO");
            cameravideo.setAttribute("autoplay", "true");
            cameravideo.setAttribute("id", "cameravideo");
            cameravideo.setAttribute("style", "max-width:100%;");
            if (navigator.mediaDevices.getUserMedia) {
              navigator.mediaDevices
                .getUserMedia({ video: true })
                .then(function (stream) {
                  // video.srcObject = stream;
                  cameravideo.srcObject = stream;
                  mod_quiz_navblock.append(cameravideo);
                })
                .catch(function (err0r) {
                  console.log("Something went wrong!");
                });
            }
          }
          $(window).on("beforeunload", function () {
            chrome.runtime.sendMessage({
              type: "action",
              action: "CHECKEXAMTABS",
            });
          });
        }

        // console.log("attemptData", A);
      }
    );
    b = window.open("", "Rpass");
  }
  function c(f) {
    if (!b) {
      return;
    }
    // console.log("sending message " + JSON.stringify(f));
    let baseUrl = localStorage.getItem("baseurl");
    b.postMessage(f, baseUrl);
  }
  function e() {
    // console.log("syncParent called of MP");
  }
  return { launch: d, sendPostMessage: c, syncParent: e, getWindow: a };
})();
