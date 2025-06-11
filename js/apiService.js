console.log("apiService");
var apiService = new (function () {
  var c = mpaasConstants.loginState;
  var g;
  function o(w) {
    var u = [];
    for (var v = 0; v <= w.length; v++) {
      if (typeof w[v] !== "undefined" && w[v] !== null) {
        u.push(w[v]);
      }
    }
    return u;
  }
  function j(u, x, v, w, y) {
    return new Promise(function (A, z) {
      var B = o(arguments);
      g = z;
      if (B.length !== arguments.length) {
        z("Invalid arguments for fetching quiz data.");
        return;
      }
      chrome.runtime.sendMessage(
        {
          type: "request",
          title: "quizVsuser",
          startIndex: x,
          pageSize: v,
          token: w,
          course: u,
          url: y,
        },
        function (C) {
          if (C.status === "ERROR" || C.isError) {
            // n(C);
            return;
          }
          if (typeof C == "string") {
            C = JSON.parse(C);
          }
          A(C);
        }
      );
    });
  }
  function s(u, z, v, w, y, x, A) {
    return new Promise(function (C, B) {
      g = B;
      var D = o(arguments);
      if (D.length !== arguments.length) {
        B("Invalid arguments");
        return;
      }
      E = {
        status: "SUCCESS",
        quizIds: [2756],
        pageInfo: { hasNext: false, hasPrevious: false },
      };
      C(E);
      // chrome.runtime.sendMessage({ title: "quizIndex", token: x, course: u, startIndex: z, pageSize: v, tiles: w, page: y, url: A }, function (E) {
      //     if (E.status == "ERROR" || E.isError) {
      //         // n(E);
      //         return;
      //     }
      //     C(E);
      // });
    });
  }
  function e(u, v, w, x, y) {
    return new Promise(function (A, z) {
      g = z;
      var B = o(arguments);
      if (B.length !== arguments.length) {
        z("Invalid arguments");
        return;
      }
      chrome.runtime.sendMessage(
        {
          type: "request",
          title: "quizSuggestion",
          token: x,
          course: u,
          pageSize: v,
          partialQuizName: w,
          url: y,
        },
        function (C) {
          if (C.status == "ERROR" || C.isError) {
            n(C);
            return;
          }
          A(C);
        }
      );
    });
  }
  function a(u, y, v, w, x, z) {
    return new Promise(function (B, A) {
      g = A;
      var C = o(arguments);
      if (C.length !== arguments.length) {
        A("Invalid arguments");
        return;
      }
      chrome.runtime.sendMessage(
        {
          type: "request",
          title: "quizSearchResult",
          token: x,
          course: u,
          pageSize: v,
          startIndex: y,
          partialQuizName: w,
          url: z,
        },
        function (D) {
          if (D.status == "ERROR" || D.isError) {
            n(D);
            return;
          }
          B(D);
        }
      );
    });
  }
  function f(z, v, A, w, u, y, x, B) {
    return new Promise(function (D, C) {
      g = C;
      var E = o(arguments);
      if (E.length !== arguments.length) {
        C("Invalid arguments");
        return;
      }
      chrome.runtime.sendMessage(
        {
          type: "request",
          title: "showReports",
          formdata: { course: v, quiz: z, startIndex: A, pageSize: w },
          quiz: z,
          course: v,
          startIndex: A,
          pageSize: w,
          token: x,
          url: B,
          ciFetch: u,
          ciErr: y,
        },
        function (F) {
          if (typeof F == "string") {
            F = JSON.parse(F);
          }
          if (F.status === "ERROR" || F.isError) {
            n(F);
            return;
          }
          D(F);
        }
      );
    });
  }
  function t(u, y, A, v, w, z, x, B) {
    return new Promise(function (D, C) {
      g = C;
      var E = o(arguments);
      if (E.length !== arguments.length) {
        C("Invalid arguments");
        return;
      }
      chrome.runtime.sendMessage(
        {
          type: "request",
          title: "userIndex",
          formdata: { course: u, quiz: y, startIndex: A, pageSize: v },
          quiz: y,
          course: u,
          startIndex: A,
          pageSize: v,
          tiles: w,
          page: z,
          token: x,
          url: B,
        },
        function (F) {
          if (typeof F == "string") {
            F = JSON.parse(F);
          }
          F.pageInfo = {
            hasNext: F.hasNextPage,
            hasPrevious: F.hasPreviousPage,
          };
          F.pids = [];
          if (F.userInfoList.length > 0) {
            F.pids = [F.userInfoList[0].pid];
          }
          if (F.status === "ERROR" || F.isError) {
            n(F);
            return;
          }
          D(F);
        }
      );
    });
  }
  function r(v, y, w, u, x, z) {
    return new Promise(function (B, A) {
      g = A;
      var C = o(arguments);
      if (C.length !== arguments.length) {
        A("Invalid arguments");
        return;
      }
      chrome.runtime.sendMessage(
        {
          type: "request",
          title: "userSuggestion",
          token: x,
          course: v,
          quiz: y,
          pageSize: w,
          partialUserId: u,
          url: z,
        },
        function (D) {
          if (D.status == "ERROR" || D.isError) {
            n(D);
            return;
          }
          B(D);
        }
      );
    });
  }
  function d(w, z, A, x, v, u, y, B) {
    return new Promise(function (D, C) {
      g = C;
      var E = o(arguments);
      if (E.length !== arguments.length) {
        C("Invalid arguments");
        return;
      }
      chrome.runtime.sendMessage(
        {
          type: "request",
          title: "userSearchResult",
          token: y,
          course: w,
          quiz: z,
          pageSize: x,
          startIndex: A,
          partialUserId: u,
          url: B,
          ciFetch: v,
        },
        function (F) {
          if (F.status == "ERROR" || F.isError) {
            n(F);
            return;
          }
          D(F);
        }
      );
    });
  }
  function i(u) {
    return new Promise(function (w, v) {
      g = v;
      if (!u.course || !u.quiz || !u.token || !u.url) {
        v("Invalid values passing for Edit Quiz");
        return;
      }
      chrome.runtime.sendMessage(
        {
          type: "request",
          title: "editQuiz",
          formdata: { course: u.course, quiz: u.quiz },
          quiz: u.quiz,
          course: u.course,
          token: u.token,
          url: u.url,
        },
        function (x) {
          if (typeof x == "string") {
            x = JSON.parse(x);
          }
          if (x.status === "ERROR" || x.isError) {
            // n(x);
            return;
          }
          w(x);
        }
      );
    });
  }
  function k(u) {
    return new Promise(function (w, v) {
      g = v;
      if (!u.token || !u.url) {
        v("Invalid payload values passing for Create Quiz");
        return;
      }
      chrome.runtime.sendMessage(
        {
          type: "request",
          title: "createQuiz",
          formdata: u.mPassPayload,
          course: u.course,
          quiz: u.quiz,
          token: u.token,
          url: u.url,
        },
        function (x) {
          if (x.status === "ERROR" || x.isError) {
            // n(x);
            return;
          }
          w(x);
        }
      );
    });
  }
  function p(u) {
    return new Promise(function (w, v) {
      g = v;
      if (!u.token || !u.ltiurl || !u.startQuizPayload) {
        v("Invalid data passing for start quiz");
        console.log("Invalid data passing for start quiz");
        return;
      }
      chrome.runtime.sendMessage(
        {
          type: "request",
          title: "continueQuiz",
          formdata: u.startQuizPayload,
          token: u.token,
          url: u.ltiurl,
        },
        function (x) {
          if (typeof x == "string") {
            x = JSON.parse(x);
          }
          if (x.status === "ERROR" || x.isError) {
            console.log("continueQuiz error x- ", x);
            // n(x);
            return;
          }
          // "return_url": "https://portal.fivestudents.com/returnurl.php",
          let URLpayload = JSON.parse(x.generatepageURL);
          // let URLpayload =  {
          //     "student_unique_id": u.startQuizPayload.emailID,
          //     "custom_logo": "",
          //     "custom_title": "",
          //     "return_url": x.envURL,
          //     // "return_url": x.cameraURL,
          //     // "return_url": "https://portal.fivestudents.com/proctoring",
          //     "event_id": x.attemptid+"",
          //     "param": "extension",
          //     "pagetype": "env-approver",
          //     "autoapproval": x.proctoringSettings.authorization?"false":"true",
          //     "attemptnumber": "1",
          //     "captureimage": "true"
          // }
          console.log("URLpayload- ", URLpayload);
          chrome.runtime.sendMessage(
            {
              type: "request",
              title: "getProctoringUrl",
              formdata: URLpayload,
              token: u.token,
              url: u.ltiurl,
            },
            function (x1) {
              if (typeof x1 == "string") {
                x1 = JSON.parse(x1);
              }
              if (x1.status === "ERROR" || x1.isError || !x1.attemptUrl) {
                n(x);
                return;
              }
              x1.cameraURL = x.cameraURL;
              x1.student_unique_id = u.startQuizPayload.emailID;
              x1.quiz_id = x.quiz_id;
              x1.attemptid = x.attemptid;
              x1.proctoringSettings = x.proctoringSettings;
              chrome.storage.local.set({ attemptData: x1 });
              x.mpaasUrl = x1.attemptUrl;
              w(x);
            }
          );
        }
      );
    });
  }
  function n(u) {
    switch (u.errorCode) {
      case 404:
        chrome.storage.local.set({ state: c.LOGIN_FAIL });
        u.message = "404 Page Not Found";
        g(u.message);
        break;
      case 0:
        chrome.storage.local.set({ state: c.TOKEN_EXPIRED });
        let urlMatch = window.location.href.includes("contentWrapper.jsp");
        if (urlMatch) {
          alert(
            "Something went wrong, please refresh the browser and try again- 1"
          );
        } else {
          toast.error(
            "Something went wrong, please refresh the browser and try again-2"
          );
        }
        u.message =
          "Something went wrong, please refresh the browser and try again-3";
        g(u.message);
        break;
      case 504:
        chrome.storage.local.set({ state: c.LOGIN_FAIL });
        u.message = "504 Gateway Time-out";
        g(u.message);
        break;
      case 502:
        chrome.storage.local.set({ state: c.LOGIN_FAIL });
        u.message = "502 Bad Gate Way";
        g(u.message);
        break;
      case "K000":
      case "E008":
      case "E009":
      case "E010":
      case "E013":
      case "E001":
      case "E004":
      case "E007":
      case "E016":
      case "E018":
        console.log("API service { state: c.LOGOUT }");
        chrome.storage.local.set({ state: c.LOGOUT });
        g(u.message);
        break;
      case "E005":
      case "E006":
      case "E003":
      case "E019":
        chrome.storage.local.set({ state: c.TOKEN_EXPIRED });
        g(u.message);
        break;
      case "E002":
      case "E011":
      case "E012":
      case "E014":
      case "E015":
      case "E017":
        chrome.storage.local.set({ state: c.LTI_CHECK_FAILED });
        g(u.message);
        break;
      default:
        chrome.storage.local.set({ state: c.LOGIN_FAIL });
        u.message = "Something went wrong";
        g(u.message);
        console.log("Invalid error message");
    }
  }
  function l() {
    console.log("TEST ENV L ");
    return new Promise(function (v, u) {
      chrome.runtime.sendMessage(
        { type: "request", title: "checkDiagonostic" },
        function (w) {
          if (w.window === "opened") {
            v(w);
            return;
          }
          u(w);
        }
      );
    });
  }
  function q(u) {
    return new Promise(function (w, v) {
      g = v;
      var x = o(arguments);
      if (x.length !== arguments.length) {
        v("Invalid arguments");
        return;
      }
      // chrome.runtime.sendMessage({ title: "fetchFilteredUsers", token: u.token, course: u.course, quiz: u.quiz, url: u.url, formData: JSON.stringify(u.filteredPostData) }, function (y) {
      //     if (y.status == "ERROR" || y.isError) {
      //         n(y);
      //         return;
      //     }
      //     w(y);
      // });
    });
  }
  function h(u, x, y, v, w, z) {
    return new Promise(function (B, A) {
      g = A;
      var C = o(arguments);
      if (C.length !== arguments.length) {
        A("Invalid arguments");
        return;
      }
      chrome.runtime.sendMessage(
        {
          type: "request",
          title: "fetchFailedUsers",
          token: w,
          course: u,
          quiz: x,
          startIndex: y,
          pageSize: v,
          url: z,
        },
        function (D) {
          if (D.status == "ERROR" || D.isError) {
            n(D);
            return;
          }
          B(D);
        }
      );
    });
  }
  function m(u, x, y, v, w, z) {
    return new Promise(function (B, A) {
      g = A;
      var C = o(arguments);
      if (C.length !== arguments.length) {
        A("Invalid arguments");
        return;
      }
      chrome.runtime.sendMessage(
        {
          type: "request",
          title: "fetchNotApplicableUsers",
          token: w,
          course: u,
          quiz: x,
          startIndex: y,
          pageSize: v,
          url: z,
        },
        function (D) {
          if (D.status == "ERROR" || D.isError) {
            n(D);
            return;
          }
          B(D);
        }
      );
    });
  }
  function b(u) {
    return new Promise(function (w, v) {
      g = v;
      chrome.runtime.sendMessage(
        { type: "request", title: "disablePlugins", type: u },
        function (x) {
          if (x.status === "ERROR" || x.isError) {
            n(x);
            return;
          }
          w(x);
        }
      );
    });
  }
  function saveQuizResult(u) {
    return new Promise(function (w, v) {
      g = v;
      chrome.runtime.sendMessage(
        {
          type: "request",
          title: "saveQuizResult",
          formdata: u.payloadData,
          token: u.token,
          url: u.ltiurl,
        },
        function (x1) {
          if (typeof x1 == "string") {
            x1 = JSON.parse(x1);
          }
        }
      );
    });
  }
  return {
    getAllQuizzes: j,
    getQuizIndexs: s,
    getUser: f,
    bindMpassOptions: i,
    saveQuiz: k,
    openDiagonostic: p,
    getUserIndexes: t,
    getQuizSuggestion: e,
    getQuizSearchResult: a,
    getUserSuggestion: r,
    getUserSearchResult: d,
    checkDiagonostic: l,
    getFilteredUsers: q,
    getFailedUsers: h,
    getNotApplicableUsers: m,
    diablePlugin: b,
    saveQuizResult: saveQuizResult,
  };
})();
