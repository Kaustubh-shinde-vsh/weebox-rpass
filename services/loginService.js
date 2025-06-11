console.log("loginService");
var loginService = new (function () {
  var d = mpaasConstants.loginType;
  var g = mpaasConstants.loginState;
  var c;
  var a;
  function i() {
    return new Promise(function (l, k) {
      chrome.storage.local.get(["loginType"], function (m) {
        console.log("loginService i() ", m);
        let ltiKey;
        switch (m.loginType) {
          case d.MOODLE_PROFESSOR_VIEW:
            ltiKey = $("#contentframe").attr("src");
            l(ltiKey);
            break;
          case d.MOODLE_STUDENT_VIEW:
            ltiKey = localStorage.getItem("ltiUrl");
            console.log("ltiKey11111-", ltiKey);
            l(ltiKey);
            break;
          case d.CANVAS_PROFESSOR_VIEW:
          case d.CANVAS_STUDENT_VIEW:
            ltiKey = $("#left-side").find("a:contains('Rpaas')").attr("href");
            console.log("d.CANVAS_PROFESSOR_VIEW ltiKey:- ", ltiKey);
            l(ltiKey);
            break;
          case d.BLACKBOARD_PROFESSOR_VIEW:
            ltiKey = $("#globalNavPageContentArea")
              .find("#contentFrame")
              .attr("src");
            l(ltiKey);
            break;
          case d.BLACKBOARD_STUDENT_VIEW:
            ltiKey = localStorage.getItem("BBltiUrl");
            l(ltiKey);
            break;
          default:
            k("Invalid login type for fetching lti url. Type:", m.loginType);
        }
      });
    });
  }
  function b(k) {
    return new Promise(function (m, l) {
      chrome.storage.local.get(["loginType"], function (n) {
        console.log("n.loginType- ", n.loginType);
        switch (n.loginType) {
          case d.MOODLE_PROFESSOR_VIEW:
          case d.MOODLE_STUDENT_VIEW:
            var o = {
              formData: $(k).serialize(),
              url: $(k).attr("action"),
            };
            m(o);
            break;
          case d.CANVAS_PROFESSOR_VIEW:
          case d.CANVAS_STUDENT_VIEW:
            var o = {
              formData: $(k).find("form").serialize(),
              url: $(k).find("#tool_form").attr("action"),
            };
            m(o);
            break;
          case d.BLACKBOARD_PROFESSOR_VIEW:
          case d.BLACKBOARD_STUDENT_VIEW:
            var o = {
              formData: $(k).find("form").serialize(),
              url: $(k).find("#bltiLaunchForm").attr("action"),
            };
            m(o);
            break;
          default:
            l(
              "Invalid login type for fetching params of lti login. Type:",
              n.loginType
            );
        }
      });
    });
  }
  function h(k) {
    console.log("loginservice h(k)- ", k);
    switch (k.errorCode) {
      case 404:
        chrome.storage.local.set({ state: g.LOGIN_FAIL });
        k.message = "404 Page Not Found";
        a(k.message);
        break;
      case 504:
        chrome.storage.local.set({ state: g.LOGIN_FAIL });
        k.message = "504 Gateway Time-out";
        a(k.message);
        break;
      case 502:
        chrome.storage.local.set({ state: g.LOGIN_FAIL });
        k.message = "502 Bad Gate Way";
        a(k.message);
        break;
      case 0:
        chrome.storage.local.set({ state: g.TOKEN_EXPIRED });
        let urlMatch = window.location.href.includes("contentWrapper.jsp");
        if (urlMatch) {
          alert(
            "Something went wrong, please refresh the browser and try again-1.1"
          );
        } else {
          toast.error(
            "Something went wrong, please refresh the browser and try again-2.1"
          );
        }
        k.message =
          "Something went wrong, please refresh the browser and try again-2.3";
        a(k.message);
        break;
      case "K000":
      case "E008":
      case "E009":
      case "E010":
      case "E013":
      case "E001":
      case "E007":
      case "E004":
      case "E016":
      case "E018":
        console.log("K- ", k);
        chrome.storage.local.set({ state: g.LOGOUT });
        a(k.message);
        break;
      case "E005":
      case "E006":
      case "E003":
      case "E019":
        chrome.storage.local.set({ state: g.TOKEN_EXPIRED });
        k.message =
          "Token Expired for RPaaS Chrome Extension, please login again.";
        a(k.message);
        break;
      case "E002":
      case "E011":
      case "E012":
      case "E014":
      case "E015":
      case "E017":
        chrome.storage.local.set({ state: g.LTI_CHECK_FAILED });
        a(k.message);
        break;
      default:
        chrome.storage.local.set({ GIN_FAIL });
        k.message = "Something went wrong";
        a(k.message);
        console.log("Invalid error message");
    }
  }
  function e(k) {
    if (!k) {
      console.log("Invalid lti keys page.");
      return;
    }
    console.log("e(K) called", k);
    b(k).then(
      function (l) {
        console.log("b(k).then called", l);
        let formData = l.formData;
        let url = l.url;
        chrome.storage.local.set({ state: g.LOADING });
        chrome.runtime.sendMessage(
          { type: "request", title: "loginlti", formdata: formData, url: url },
          function (m) {
            console.log("b(k).then loginlti response:- ", m);
            if (m.status === "ERROR" || m.isError) {
              h(m);
            } else {
              c(m);
            }
          }
        );
      },
      function (l) {
        console.log("b(k).then failed", l);
        console.log(l);
      }
    );
  }
  function f(k) {
    console.log("f(k) called and calling a(k)", k);
    a(k);
  }
  function j() {
    console.log("1");
    return new Promise(function (l, k) {
      c = l;
      a = k;

      i().then(
        function (m) {
          console.log("m-", m);
          if (!m) {
            console.log("Rpaas module not found.");
            return;
          }
          $.ajax({
            type: "GET",
            url: m,
            success: e,
            error: f,
          });
        },
        function (m) {
          console.log("loginService i rejected");
          console.log(m);
        }
      );
    });
  }
  return {
    login: j,
  };
})();
