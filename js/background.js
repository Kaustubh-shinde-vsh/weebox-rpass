import mpaasConstants from "../constants/rpaasPluginConstantsModule.js";
import { customAjax } from "../services/ajaxService.js"; // Adjust path if different
console.log("background");
function init() {
  registerEventListeners();
  allowScripts();
}
function registerEventListeners() {
  chrome.runtime.onMessage.addListener(handleOnMessage);
  chrome.runtime.onMessage.addListener(handleOnRequest);
}
function deRegisterEventListeners() {
  chrome.runtime.onMessage.removeListener();
  // chrome.extension.onRequest.removeListener();
}
function onLogOut() {
  deRegisterEventListeners();
}
function allowScripts() {
  chrome.contentSettings.javascript.set({
    primaryPattern: "<all_urls>",
    setting: "allow",
  });
}
var $tab = new (function () {
  function j(m) {
    console.log("called removinf m- ", m);
    if (m) {
      chrome.tabs.remove(m, function (n) {
        console.log("successfully closed tab", n);
      });
    }
  }
  function closeOtherTabs() {
    chrome.tabs.query({}, function (n) {
      for (var m = 0; m < n.length; m++) {
        if (n[m].active == true || n[m].title == "Wheebox - Environment Test") {
          k(n[m].id);
        } else {
          j(n[m].id);
        }
      }
    });
    chrome.windows.getAll({ populate: true }, function (n) {
      if (n.length > 1) {
        for (var m = 0; m < n.length; m++) {
          if (!n[m].focused) {
            chrome.windows.remove(n[m].id, function (o) {
              console.log("window removed", o);
            });
          }
        }
      }
    });
  }
  function checkCheckExamTabs() {
    chrome.storage.local.get(function (a) {
      if (a.currentWindow && a.tabid && a.exam == "start") {
        chrome.tabs.query({}, function (n) {
          let tabcount = 0;
          for (var m = 0; m < n.length; m++) {
            if (
              n[m].id == a.tabid ||
              n[m].title == "Wheebox - Environment Test"
            ) {
              tabcount++;
            } else if (a.navigationControl) {
              j(n[m].id);
            }
          }
          if (tabcount != 2) {
            console.log("tabcount- ", tabcount);
            e();
            chrome.storage.local.set({ exam: "stop" });
            for (var m = 0; m < n.length; m++) {
              if (
                n[m].id == a.tabid ||
                n[m].title == "Wheebox - Environment Test"
              ) {
                console.log("Tab removed", n[m].id);
                j(n[m].id);
              }
            }
          }
        });
      }
    });
  }
  function closeDiagonosticTab() {
    console.log(
      "CLOSING DIAGNOSE TAB-----------------------------------------"
    );
    chrome.tabs.query({}, function (n) {
      for (var m = 0; m < n.length; m++) {
        if (n[m].title == "Wheebox - Environment Test") {
          j(n[m].id);
        } else {
          g(n[m].id);
        }
      }
    });
  }
  function b() {
    chrome.tabs.query({}, function (n) {
      for (var m = 0; m < n.length; m++) {
        j(n[m].id);
      }
    });
  }
  function checkTwoTabs() {
    chrome.tabs.query({}, function (n) {
      if (n.length <= 1) {
        h();
      }
      // for (var m = 0; m < n.length; m++) {
      // }
    });
  }
  function closeErrorTab() {
    console.log("h()");
    shutDownCandidateProctoring();
    b();
    e();
    var n = mpaasConstants.chromeStorage;
    var m = mpaasConstants.loginState;
    chrome.storage.local.set({ exam: n.STOP });
    // chrome.storage.local.set({ state: m.LOGOUT });
    // if (navigator.userAgent.indexOf("Win") != -1) {
    //     alert("Connection with RPaaS lost. Please relaunch your browser and resume your test");
    // } else {
    //     alert("Connection with RPaaS lost. Please Quit your browser, relaunch it and resume the test. If you dont, Quit the browser, your test taking experience might get hampered.");
    // }
    deRegisterChromeApis();
  }
  function onOpenNewTab(n, m, o) {
    chrome.storage.local.get(function (a) {
      if (a.currentWindow && a.tabid && a.exam == "start") {
        if (
          o.status == "loading" &&
          !(o.od != a.tabid || o.title == "Wheebox - Environment Test")
        ) {
          j(n);
        }
      }
    });
  }
  function k(m) {
    // chrome.tabs.update(m, { pinned: true }, function (n) {
    // chrome.tabs.update(m, { pinned: false }, function (n) {
    //     n.active = true;
    // });
  }
  function g(m) {
    // chrome.tabs.update(m, { pinned: false }, function (n) {
    //     n.active = true;
    // });
  }
  function closeWindow() {
    b();
    e();
    chrome.windows.getCurrent({ populate: true }, function (m) {
      chrome.windows.remove(m.id, function (n) {
        console.log("window removed", n);
      });
    });
  }
  function e() {
    var m = 1000 * 60 * 60 * 24;
    var n = new Date().getTime() - m;
    chrome.browsingData.remove(
      {
        since: n,
        originTypes: {
          protectedWeb: true,
          unprotectedWeb: true,
          extension: true,
        },
      },
      {
        appcache: true,
        cache: true,
        cookies: true,
        downloads: true,
        fileSystems: true,
        formData: true,
        indexedDB: true,
        pluginData: true,
        passwords: true,
        webSQL: true,
      },
      function () {
        console.log("All data is Deleted...");
      }
    );
  }
  return {
    closeOtherTabs,
    checkCheckExamTabs,
    onOpenNewTab,
    closeDiagonosticTab,
    closeWindow,
    closeErrorTab,
    checkTwoTabs,
  };
})();
var $window = new (function () {
  function maximizeWindow() {
    return;
    chrome.windows.getLastFocused({ populate: true }, function (d) {
      chrome.storage.local.get(function (e) {
        if (e.lmsApp === "d2l") {
          if (!d.focused) {
            chrome.windows.update(
              d.id,
              { state: "maximized", focused: true },
              function (f) {
                console.log("window maximized", f);
                chrome.tabs.query({ active: true }, function (g) {
                  chrome.tabs.sendMessage(g[0].id, { content: "blur" });
                });
              }
            );
          } else {
            chrome.windows.update(
              d.id,
              { state: "maximized", focused: true },
              function (f) {
                console.log("window maximized", f);
              }
            );
          }
        } else {
          chrome.windows.update(
            d.id,
            { state: "maximized", focused: true },
            function (f) {
              console.log("window maximized", f);
            }
          );
        }
      });
    });
  }
  function maximizedCurrentWindow() {
    return;
    chrome.windows.getLastFocused({ populate: true }, function (d) {
      chrome.storage.local.get(["navigationControl"], function (e) {
        var f;
        if (e.navigationControl) {
          f = { state: "fullscreen", focused: true };
        } else {
          f = { state: "fullscreen" };
        }
        chrome.storage.local.get(function (g) {
          if (g.lmsApp === "d2l") {
            if (!d.focused) {
              chrome.windows.update(d.id, f, function (h) {
                console.log("window updated", h);
                chrome.tabs.query({ active: true }, function (j) {
                  chrome.tabs.sendMessage(j[0].id, { content: "blur" });
                });
              });
            } else {
              chrome.windows.update(d.id, f, function (h) {
                console.log("window updated", h);
              });
            }
          } else {
            chrome.windows.update(d.id, f, function (h) {
              console.log("window updated", h);
            });
          }
        });
      });
    });
  }
  function fullScreenWindow(d) {
    return;
    if (d === -1) {
      chrome.storage.local.get(function (e) {
        if (e.navigationControl && e.fullScreen) {
          a();
        } else {
          b();
        }
      });
    } else {
      chrome.windows.get(d, function (e) {
        if (e.state === "minimized") {
          chrome.storage.local.get(function (f) {
            if (f.navigationControl && f.fullScreen) {
              a();
            } else {
              b();
            }
          });
        }
      });
    }
  }
  return { maximizeWindow, maximizedCurrentWindow, fullScreenWindow };
})();
function blurMaximize() {
  chrome.windows.onFocusChanged.addListener($window.maximizedCurrentWindow);
  chrome.storage.local.get(function (a) {
    if (a.navigationControl && a.fullScreen) {
      $window.fullScreenWindow();
    } else {
      $window.maximizeWindow();
    }
  });
}
function registerChromeApis() {
  activateTestTab();
  chrome.tabs.onUpdated.addListener($tab.onOpenNewTab);
  chrome.windows.onFocusChanged.addListener($window.maximizedCurrentWindow);
}
function activeTestTab() {
  // chrome.tabs.query({}, function (b) {
  //     for (var a = 0; a < b.length; a++) {
  //         if (b[a].title == "Wheebox - Environment Test" && b[a].active) {
  //             // chrome.tabs.update(b[0].id, { pinned: true, active: true }, function (c) {
  //             chrome.tabs.update(b[0].id, { pinned: false, active: true }, function (c) {
  //                 // c.active = true;
  //             });
  //         }
  //     }
  // });
}
function activateTestTab() {
  console.log("switched from extension called");
  chrome.storage.local.get(["currentWindow", "tabid"], function (a) {
    console.log("switched from extension = ", a);
    chrome.tabs.query({ windowId: a.currentWindow }, function (b) {
      for (var c = 0; c < b.length; c++) {
        if (b[c].id == a.tabid) {
          // chrome.tabs.update(b[c].id, { pinned: true, active: true });
          chrome.tabs.update(b[c].id, { pinned: false, active: true });
        }
      }
    });
  });
}
function setTestTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (b) {
    chrome.storage.local.set({ currentWindow: b[0].windowId, tabid: b[0].id });
  });
}
function deRegisterChromeApis() {
  deRegisterEventListeners();
  chrome.tabs.onUpdated.removeListener($tab.onOpenNewTab);
  chrome.windows.onFocusChanged.removeListener($window.maximizedCurrentWindow);
}
function startCandidateProctoring() {
  registerChromeApis();
}
function shutDownCandidateProctoring() {
  console.log("stop proctoring called");
  enableChromePlugins();
  deRegisterChromeApis();
  $tab.closeDiagonosticTab();
  $window.maximizeWindow();
}
function getHeader(a) {
  if (!a) {
    return;
  }
  return { Authorization: a, "Content-Type": "application/json" };
}
function makeErrorMsg(a, c = null) {
  return { isError: true, errorCode: a.status, error: a, request: c };
}
var $http = new (function () {
  function a(c) {
    // console.log("$http GET URL:- ", c.url)
    // console.log("$http GET token:- ", c.token)
    customAjax({
      method: "GET",
      headers: getHeader(c.token),
      url: c.url,
      success: function (d) {
        console.log("d:", d);
        c.callBack(d);
      },
      error: function (d) {
        console.log("GET error d:", d);
        let errMsg = makeErrorMsg(d);
        console.log("errMsg:", errMsg);
        c.callBack(errMsg);
      },
    });
  }
  function b(c) {
    // console.log("$http POST URL:- ", c.url)
    // console.log("$http POST token:- ", c.token)
    // console.log("$http POST data:- ", c.data)
    customAjax({
      method: "POST",
      headers: getHeader(c.token),
      url: c.url,
      data: c.data,
      success: function (d) {
        console.log("$http POST done:- ", d);
        // console.log("d:",d);
        c.callBack(d);
      },
      error: function (d) {
        console.log("$http POST URL:- ", c.url);
        console.log("$http POST token:- ", c.token);
        console.log("$http POST data:- ", c.data);
        console.log("$http POST fail:- ", d);
        let errMsg = makeErrorMsg(d, c);
        console.log("errMsg:", errMsg);
        c.callBack(errMsg);
      },
    });
  }
  return { Get: a, Post: b };
})();
function checkDiagonostic(c, a) {
  var b;
  chrome.windows.getAll({ populate: true }, function (g) {
    if (g.length > 1) {
      for (var f = 0; f < g[f].tabs.length; f++) {
        if (!g[f].focused) {
          b = { window: "not opened", tabLength: 1 };
          a(b);
        } else {
          for (var e = 0; e < g[f].tabs.length; e++) {
            if (g[f].tabs[e].title == "Wheebox - Environment Test") {
              b = { window: "opened", tabLength: g[f].tabs.length };
              a(b);
              break;
            }
            if (e == g[f].tabs.length - 1) {
              b = { window: "not opened", tabLength: g[f].tabs.length };
              a(b);
              break;
            }
          }
        }
      }
    } else {
      d();
    }
  });
  function d() {
    chrome.tabs.query({}, function (f) {
      for (var e = 0; e < f.length; e++) {
        if (f[e].title == "Wheebox - Environment Test") {
          b = { window: "opened", tabLength: f.length };
          a(b);
          break;
        }
        if (e == f.length - 1) {
          b = { window: "not opened", tabLength: f.length };
          a(b);
        }
      }
    });
  }
}
function disablePluginList(b, a) {
  chrome.management.getAll(function (c) {
    if (b.type === "disablePlugins") {
      chrome.storage.local.set({ pluginList: c });
      checkMettlPlugins(c);
    } else {
      checkMettlPlugins(c);
    }
    getEnabledList(a);
  });
}
function getEnabledList(a) {
  chrome.management.getAll(function (b) {
    console.log("b-", b);
    let pluginFound = [];
    for (i = 0; i < b.length; i++) {
      if (b[i].enabled) {
        pluginFound.push(b[i]);
      }
    }
    a(pluginFound);
  });
}
function checkMettlPlugins(a) {
  for (var b = 0; b < a.length; b++) {
    if (a[b].name === "Wheebox RPaaS" || a[b].name === "Wheebox RPaaS v3") {
      chrome.management.setEnabled(a[b].id, true);
      console.log("Wheebox plugin found");
    } else {
      chrome.management.setEnabled(a[b].id, false);
    }
  }
}
function enableChromePlugins() {
  chrome.storage.local.get(["restrictPlugin"], function (a) {
    if (a.restrictPlugin) {
      chrome.storage.local.get(function (c) {
        let pluginData = c.pluginList;
        if (pluginData) {
          for (var b = 0; b < pluginData.length; b++) {
            if (pluginData[b].enabled) {
              chrome.management.setEnabled(pluginData[b].id, true);
            } else {
              console.log("Plugin enabled");
            }
          }
        }
      });
    }
  });
}
function fetchReports(b, a) {
  let createQuizendPoint = "/getQuizUsers";
  let createQuizbaseUrl = b.url;
  let quizUrl = createQuizbaseUrl + createQuizendPoint;
  $http.Post({
    token: b.token,
    url: quizUrl,
    data: JSON.stringify(b.formdata),
    callBack: a,
  });
}
function userIndex(b, a) {
  let createQuizendPoint = "/getQuizUsers";
  let createQuizbaseUrl = b.url;
  let quizUrl = createQuizbaseUrl + createQuizendPoint;
  $http.Post({
    token: b.token,
    url: quizUrl,
    data: JSON.stringify(b.formdata),
    callBack: a,
  });
}
function ltiLogin(b, a) {
  console.log("loginlti function");
  let loginURL = b.url;
  $http.Post({ url: loginURL, data: b.formdata, callBack: a });
}

function createQuiz(b, a) {
  let createQuizendPoint = "/saveQuizSetting";
  let createQuizbaseUrl = b.url;
  let quizUrl = createQuizbaseUrl + createQuizendPoint;
  console.log("createQuiz b- ", b);
  console.log("createQuiz formdata- ", b.formdata);
  $http.Post({
    token: b.token,
    url: quizUrl,
    data: JSON.stringify(b.formdata),
    callBack: a,
  });
}
function continueQuiz(b, a) {
  let continueQuizendPoint = "/startQuiz";
  let continueQuizbaseUrl = b.url;
  let continueQuizUrl = continueQuizbaseUrl + continueQuizendPoint;
  $http.Post({
    token: b.token,
    url: continueQuizUrl,
    data: JSON.stringify(b.formdata),
    callBack: a,
  });
}
function saveQuizResult(b, a) {
  console.log(
    "saveQuizResult called-----------------------------------------------"
  );
  let saveQuizResultPoint = "/saveQuizResult";
  let saveQuizResultbaseUrl = b.url;
  let saveQuizResultUrl = saveQuizResultbaseUrl + saveQuizResultPoint;
  $http.Post({
    token: b.token,
    url: saveQuizResultUrl,
    data: JSON.stringify(b.formdata),
    callBack: a,
  });
}
function getRegistration(b, a) {
  let continueQuizendPoint = "/getRegistration";
  let continueQuizbaseUrl = b.url;
  let continueQuizUrl = continueQuizbaseUrl + continueQuizendPoint;
  $http.Post({
    token: b.token,
    url: continueQuizUrl,
    data: JSON.stringify(b.formdata),
    callBack: a,
  });
}
function getProctoringUrl(b, a) {
  let continueQuizendPoint = "/generatepageURL";
  let continueQuizbaseUrl = b.url;
  let continueQuizUrl = continueQuizbaseUrl + continueQuizendPoint;
  $http.Post({
    token: b.token,
    url: continueQuizUrl,
    data: JSON.stringify(b.formdata),
    callBack: a,
  });
}
function editQuiz(b, a) {
  let continueQuizendPoint = "/getQuizSetting";
  let continueQuizbaseUrl = b.url;
  let continueQuizUrl = continueQuizbaseUrl + continueQuizendPoint;
  $http.Post({
    token: b.token,
    url: continueQuizUrl,
    data: JSON.stringify(b.formdata),
    callBack: a,
  });
}
function quizVsuser(b, a) {
  let userEndPoint = "/getQuizList";
  let userBaseUrl = b.url;
  let userQuizUrl = userBaseUrl + userEndPoint;
  let searchdata = {
    course: b.course,
    startIndex: b.startIndex,
    pageSize: b.pageSize,
  };
  $http.Post({
    token: b.token,
    url: userQuizUrl,
    data: JSON.stringify(searchdata),
    callBack: a,
  });
}
function quizIndex(b, a) {
  let userEndPoint =
    "/v2/lti/course/quizIndexes?course=" +
    b.course +
    "&startIndex=" +
    b.startIndex +
    "&pageSize=" +
    b.pageSize +
    "&tiles=" +
    b.tiles +
    "&page=" +
    b.page;
  let userBaseUrl = b.url;
  let quizIndexUrl = userBaseUrl + userEndPoint;
  $http.Get({ token: b.token, url: quizIndexUrl, callBack: a });
}
function quizSuggestion(b, a) {
  let userEndPoint =
    "/v2/lti/course/quizSuggestion?course=" +
    b.course +
    "&pageSize=" +
    b.pageSize +
    "&partialQuizName=" +
    b.partialQuizName;
  let userBaseUrl = b.url;
  let quizSuggestionUrl = userBaseUrl + userEndPoint;
  $http.Get({ token: b.token, url: quizSuggestionUrl, callBack: a });
}
function quizSearchResult(b, a) {
  let userEndPoint = "/getQuizList";
  let userBaseUrl = b.url;
  let userQuizUrl = userBaseUrl + userEndPoint;
  let searchdata = {
    course: b.course,
    startIndex: b.startIndex,
    pageSize: b.pageSize,
    searchQuiz: b.partialQuizName,
  };
  $http.Post({
    token: b.token,
    url: userQuizUrl,
    data: JSON.stringify(searchdata),
    callBack: a,
  });
}
function userSuggestion(b, a) {
  let userEndPoint =
    "/v2/lti/course/quiz/userSuggestion?course=" +
    b.course +
    "&quiz=" +
    b.quiz +
    "&pageSize=" +
    b.pageSize +
    "&partialUserId=" +
    b.partialUserId;
  let userBaseUrl = b.url;
  let userSuggestionUrl = userBaseUrl + userEndPoint;
  $http.Get({ token: b.token, url: userSuggestionUrl, callBack: a });
}
function userSearchResult(b, a) {
  let userEndPoint =
    "/v2/lti/course/quiz/reportByPartialUserId?course=" +
    b.course +
    "&quiz=" +
    b.quiz +
    "&startIndex=" +
    b.startIndex +
    "&pageSize=" +
    b.pageSize +
    "&partialUserId=" +
    b.partialUserId +
    "&cifetch=" +
    b.ciFetch;
  let userBaseUrl = b.url;
  let userSearchResultUrl = userBaseUrl + userEndPoint;
  $http.Get({ token: b.token, url: userSearchResultUrl, callBack: a });
}
function fetchFilteredUsers(b, a) {
  let userEndPoint = "/v2/lti/cifilter?course=" + b.course + "&quiz=" + b.quiz;
  let userBaseUrl = b.url;
  let fetchFilteredUsersUrl = userBaseUrl + userEndPoint;
  $http.Post({
    token: b.token,
    url: fetchFilteredUsersUrl,
    data: b.formData,
    callBack: a,
  });
}
function fetchFailedUsers(b, a) {
  let userEndPoint =
    "/v2/lti/cifilter/failed?course=" +
    b.course +
    "&quiz=" +
    b.quiz +
    "&startIndex=" +
    b.startIndex +
    "&pageSize=" +
    b.pageSize;
  let userBaseUrl = b.url;
  let fetchFailedUsersUrl = userBaseUrl + userEndPoint;
  $http.Get({ token: b.token, url: fetchFailedUsersUrl, callBack: a });
}
function fetchNotApplicableUsers(b, a) {
  let userEndPoint =
    "/v2/lti/cifilter/notapplicable?course=" +
    b.course +
    "&quiz=" +
    b.quiz +
    "&nextPid=" +
    b.startIndex +
    "&pageSize=" +
    b.pageSize;
  let userBaseUrl = b.url;
  let fetchNotApplicableUsersUrl = userBaseUrl + userEndPoint;
  $http.Post({ token: b.token, url: fetchNotApplicableUsersUrl, callBack: a });
}
function handleOnMessage(d, c, a) {
  var b = mpaasConstants.chromeSendMessage;
  if (d.type == "action") {
    switch (d.action) {
      case b.ACTIVATE_TESTTAB:
        activateTestTab();
        break;
      case b.SET_TESTTAB:
        setTestTab();
        break;
      case b.START_PROCTORING:
        startCandidateProctoring();
        break;
      case b.STOP_PROCTORING:
        shutDownCandidateProctoring();
        break;
      case b.CLOSE_WINDOW:
        $tab.closeErrorTab();
        break;
      case b.BLUR:
        chrome.storage.local.get(function (local) {
          if (local.lostfocus == undefined) {
            chrome.storage.local.set({ lostfocus: 0 });
            local.lostfocus = 0;
          }
          chrome.windows.get(local.currentWindow, function (d) {
            let lostcounter = 0;
            chrome.tabs.query({}, function (tabs) {
              for (var m = 0; m < tabs.length; m++) {
                if (!d.focused) {
                  lostcounter = 5;
                  break;
                } else if (
                  tabs[m].active == false &&
                  (tabs[m].id == local.tabid ||
                    tabs[m].title == "Wheebox - Environment Test")
                ) {
                  lostcounter++;
                }
              }
              if (lostcounter >= 2) {
                local.lostfocus++;
                console.log("Total Lost Focus: ", local.lostfocus);
                chrome.storage.local.set({ lostfocus: local.lostfocus });
              }
            });
          });
        });
        blurMaximize();
        break;
      case b.FULL_SCREEN:
        $window.fullScreenWindow();
        break;
      case b.NC:
        $window.maximizeWindow();
        break;
      case b.TWOTABS:
        $tab.checkTwoTabs();
        break;
      case b.CHECKEXAMTABS:
        $tab.checkCheckExamTabs();
        break;
      case b.DIAGONOSTIC_ERROR_TAB:
        $tab.closeErrorTab();
        break;
      case b.DIAGONOSTIC_TAB_CLOSE:
        $tab.closeDiagonosticTab();
        break;
      case b.CLOSE_OTHER_TABS:
        $tab.closeOtherTabs();
        break;
    }
  } else {
    console.log("handleOnMessage:", d);
  }
}
function handleOnRequest(c, a, b) {
  if (c.type == "request") {
    switch (c.title) {
      case "showReports":
        fetchReports(c, b);
        return true;
      case "loginlti":
        ltiLogin(c, b);
        return true;
      case "checkDiagonostic":
        checkDiagonostic(c, b);
        return true;
      case "createQuiz":
        createQuiz(c, b);
        return true;
      case "continueQuiz":
        continueQuiz(c, b);
        return true;
      case "saveQuizResult":
        saveQuizResult(c, b);
        return true;
      case "getRegistration":
        getRegistration(c, b);
        return true;
      case "getProctoringUrl":
        getProctoringUrl(c, b);
        return true;
      case "editQuiz":
        editQuiz(c, b);
        return true;
      case "quizVsuser":
        quizVsuser(c, b);
        return true;
      case "quizIndex":
        quizIndex(c, b);
        return true;
      case "userIndex":
        userIndex(c, b);
        return true;
      case "quizSuggestion":
        quizSuggestion(c, b);
        return true;
      case "quizSearchResult":
        quizSearchResult(c, b);
        return true;
      case "userSuggestion":
        userSuggestion(c, b);
        return true;
      case "userSearchResult":
        userSearchResult(c, b);
        return true;
      case "fetchFilteredUsers":
        fetchFilteredUsers(c, b);
        return true;
      case "fetchFailedUsers":
        fetchFailedUsers(c, b);
        return true;
      case "fetchNotApplicableUsers":
        fetchNotApplicableUsers(c, b);
        return true;
      case "disablePlugins":
        disablePluginList(c, b);
        return true;
      default:
        console.log("Invalid message type.");
    }
  } else {
    console.log("handleOnRequest:", c);
  }
}
init();
