console.log("commonService");
var dataStorageService = new (function () {
  var d;
  function b(e) {
    if (!e) {
      console.log("login Failed...");
      return;
    }
    let token = $(e).find("#token").html();
    let mpaasUrl = $(e).find("#rpaasUrl").html();
    let ltiUrl = $(e).find("#ltiUrl").html();
    let diagCheckUrl = $(e).find("#diagCheckUrl").html();
    console.log("Dynamic mpaasUrl- ", mpaasUrl);
    console.log("Dynamic dataStorageService ltiUrl- ", ltiUrl);
    let user = JSON.parse($(e).find("#userInfo").html());
    let isCiOn = $(e).find("#ci").html().trim();
    let coursenameValue = $(e).find("#courseName").text();
    localStorage.setItem("loginUser", user.userid);
    localStorage.setItem("diagCheckUrl", diagCheckUrl);
    localStorage.setItem("loginToken", token);
    localStorage.setItem("loginmpassUrl", mpaasUrl);
    localStorage.setItem("loginltiUrl", ltiUrl);
    localStorage.setItem("isCiOn", isCiOn);
    localStorage.setItem("courseName", coursenameValue);
  }
  function c(e) {
    if (!e) {
      toast.error("course not found");
      return;
    }
    d = e;
  }
  function a() {
    return decodeURIComponent(d);
  }
  return { storeLoginData: b, setCourseName: c, getCourseName: a };
})();
var teacherViewService = new (function () {
  let quizData = {};
  let quizIdArr = [];
  let userIdArr = [];
  let quizIds = {};
  let pIds = {};
  let pageInfo;
  let nextPageIndex = "";
  let prevPageIndex = "";
  let nextTilesIndex = "";
  let prevTilesIndex = "";
  let pagination;
  let search;
  let startIndex = 0,
    pageSize = 100,
    tiles = 10,
    page = "NEXT",
    suggestionPageSize = 10;
  let isQuizState = false;
  let quizName = "";
  let oldSearchString;
  let timer;
  let doneTypingVal = 1000;
  let isQuizSearch = false;
  let isUserSearch = false;
  let rows = "";
  let pageNumberForSearch = "";
  let searchText = "";
  let selectedFilters = [];
  let sortingCriteria = [];
  let _isCi = false;
  let ciError = false;
  let isFiltersApplied = false;
  function T(V, Z) {
    $(".main-section").html("");

    let tableLayout =
      '<div class="table-report-data"><table id="records-link" class="table table-bordered text-left"><thead><tr><th>User Id</th><th>Activity time</th><th>Actions</th></tr></thead> <tbody id="linkdata"></tbody></table><div id="myReportModal" class="report-modal"><div class="report-modal-content"><span class="report-close">&times;</span><div id="reportframecontainer"></div></div></div></div>';

    $(".main-section").append(tableLayout);

    for (var W = 0; W < V.length; W++) {
      // Use data attribute instead of inline onclick
      var X =
        "<tr><td><span>" +
        V[W].userid +
        "</span></td><td>" +
        V[W].createdDate +
        "</td><td><a href='#' class='report-link' data-report-url='" +
        V[W].sharedReportUrl +
        "'><span class='eye'></span></a></td></tr>";

      $("#linkdata").append(X);
    }

    // Set up event delegation for report links
    $(document)
      .off("click.reportModal")
      .on("click.reportModal", ".report-link", function (e) {
        e.preventDefault();
        var reportUrl = $(this).data("report-url");
        openReportModal(reportUrl);
      });

    // Set up close functionality
    $(document)
      .off("click.reportClose")
      .on("click.reportClose", ".report-close", function () {
        $("#myReportModal").hide();
        $("#reportframecontainer").html("");
      });

    $(".pagination-page").find("a").removeClass("active");
    if (Z === 0) {
      $(".pagination-page:first").find("a").addClass("active");
    } else {
      $(".pagination-page")
        .find('a[data-quiz-id="' + Z + '"]')
        .addClass("active");
    }
  }
  function openReportModal(URL) {
    var reportframecontainer = document.getElementById("reportframecontainer");
    // Clear existing content
    reportframecontainer.innerHTML = "";

    var reportframe = document.createElement("IFRAME");
    reportframe.setAttribute("style", "width:100%;  border:none;");
    reportframe.setAttribute("id", "cameraframe");
    reportframe.setAttribute("src", URL);
    reportframe.seamless = true;

    reportframecontainer.appendChild(reportframe);
    $("#myReportModal").show();
  }

  function m(V, W, X) {
    if (!V || !W) {
      console.log("Invalid Response");
      return;
    }
    $("#back").show();
    $(".selected-quiz").remove();
    $("#course-subtext").html("Below is the list of users who take the quiz.");
    let quizview =
      '<div class="selected-quiz">You are Viewing <b>' +
      W +
      "</b> Quiz Reports</div>";
    $(".clearfixs").append(quizview);
    let reports = V;
    $(".quiz-report-data").remove();
    if (X != 0) {
      pageInfo.hasPrevious = true;
      $(".pagination-prev").show();
      $(".pagination-prev")
        .off("click")
        .on("click", function () {
          r("PREVIOUS", isQuizState);
        });
    }
    if (userIdArr.indexOf(X) === 0) {
      pageInfo.hasPrevious = false;
      $(".pagination-prev").hide();
    }
    if (Object.keys(reports).length === 0) {
      $(".selected-quiz").remove();
      $("#course-subtext").html("No Record found for this course");
      let noData =
        '<div class="warning-section"><span class="warning-icon">!</span></div><div class="no-record text-bold">No Record Found</div>';
      $(".main-section").html(noData);
    } else {
      T(reports, X);
    }
  }
  function k(V) {
    return (
      '<div class="search"><div class="pull-left position-relative"><input type="text" id="search" class="search pull-left" placeholder="' +
      V +
      '" autocomplete="off" /><span class="search-icon"><img src="' +
      chrome.runtime.getURL("assets/Search.svg") +
      '" alt="Search"/></span><div class="autocompleteDiv hide"><select id="select" name="searchText" multiple></select><div class="no-data-found text-center hide">No Data found.</div><span>To refine your Search, Please use specific Keywords.</span></div></div></div>'
    );
  }
  function J() {
    return '<div class="pagination pull-right"><div class="pagination-pages"><ul><li class="pagination-prev" title="Previous page"><a>&laquo;</a></li><li class="pagination-next" title="Next page"><a>&raquo;</a></li></ul></div></div>';
  }
  function M() {
    $("#main-section").html("");
    let tableLayout =
      '<div class="quiz-report-data"><table id="quiz-records" class="table table-bordered text-left"><thead><tr><th>Quiz Name</th><th>Candidate Count</th></tr></thead> <tbody id="quizdata"></tbody></table></div>';
    $("#main-section").append(tableLayout);
    for (var W = 0; W < quizData.length; W++) {
      var V =
        '<tr><td><span id="quizName" class="quiz-name c-pointer text-bold"><b class="' +
        decodeURIComponent(quizData[W].quizName) +
        '" id="quiz">' +
        quizData[W].quizName +
        "</b></span></td><td>" +
        quizData[W].userCount +
        "</td></tr>";
      $("#quizdata").append(V);
    }
    $(".pagination-page").find("a").removeClass("active");
    if (startIndex === 0) {
      $(".pagination-page:first").find("a").addClass("active");
    } else {
      $(".pagination-page")
        .find('a[data-quiz-id="' + startIndex + '"]')
        .addClass("active");
    }
    $(".quiz-name").on("click", function () {
      if (navigator.onLine) {
        let $row = $(this).closest("tr");
        quizName = $row.find(".quiz-name").find("b").attr("class");
        $(".quiz-name").off();
        startIndex = 0;
        pageSize = 100;
        tiles = 10;
        isQuizSearch = false;
        x(quizName, startIndex, pageSize, tiles, page, function () {
          c(quizName, startIndex);
        });
      } else {
        let urlMatch = window.location.href.includes("contentWrapper.jsp");
        let d2lUrl = window.location.href.includes("d2l");
        if (urlMatch || d2lUrl) {
          alert(
            "Internet connection lost or Timeout. Please reconnect and refresh the browser."
          );
        } else {
          toast.error(
            "Internet connection lost or Timeout. Please reconnect and refresh the browser."
          );
        }
      }
    });
  }
  function r(V, W) {
    if (V == "NEXT") {
      if (typeof nextPageIndex != "undefined") {
        if (W) {
          F(nextPageIndex);
        } else {
          if (isFiltersApplied) {
            v(nextPageIndex);
          } else {
            c(quizName, nextPageIndex);
          }
        }
      } else {
        if (W) {
          if (isQuizSearch) {
            startIndex = rows + pageSize;
            o(oldSearchString, startIndex);
          } else {
            D(nextTilesIndex, pageSize, tiles, V, function () {
              F(nextPageIndex);
            });
          }
        } else {
          if (isFiltersApplied) {
            startIndex = rows + pageSize;
            L(startIndex);
          } else {
            if (isUserSearch) {
              startIndex = rows + pageSize;
              g(oldSearchString, startIndex);
            } else {
              x(quizName, nextTilesIndex, pageSize, tiles, V, function () {
                c(quizName, nextPageIndex);
              });
            }
          }
        }
      }
    } else {
      if (typeof prevPageIndex != "undefined") {
        if (W) {
          F(prevPageIndex);
        } else {
          if (isFiltersApplied) {
            fetchFilteredUsersForNa(prevPageIndex);
          } else {
            c(quizName, prevPageIndex);
          }
        }
      } else {
        if (W) {
          if (isQuizSearch) {
            startIndex = rows - pageSize;
            o(oldSearchString, startIndex);
          } else {
            D(prevTilesIndex, pageSize, tiles, V, function () {
              F(prevPageIndex);
            });
          }
        } else {
          if (isFiltersApplied) {
            startIndex = rows - pageSize;
            L(startIndex);
          } else {
            if (isUserSearch) {
              startIndex = rows - pageSize;
              g(oldSearchString, startIndex);
            } else {
              x(quizName, prevTilesIndex, pageSize, tiles, V, function () {
                c(quizName, prevPageIndex);
              });
            }
          }
        }
      }
    }
  }
  function c(V, W) {
    let userToken = localStorage.getItem("loginToken");
    let userRestURL = localStorage.getItem("loginltiUrl");
    let courseName = dataStorageService.getCourseName();
    if (W) {
      W = W;
    }
    _isCi = JSON.parse(localStorage.getItem("isCiOn"));
    if (_isCi) {
      e();
    }
    apiService
      .getUser(
        encodeURIComponent(V),
        encodeURIComponent(courseName),
        W,
        pageSize,
        _isCi,
        W == 0,
        userToken,
        userRestURL
      )
      .then(
        function (X) {
          chrome.storage.local.get(["state"], function (Y) {
            if (Y.state === loginState.LOGOUT) {
              let urlMatch =
                window.location.href.includes("contentWrapper.jsp");
              let d2lUrl = window.location.href.includes("d2l");
              if (urlMatch || d2lUrl) {
                alert("You are not logged in RPaaS Chrome Extension.");
              } else {
                toast.error("You are not logged in RPaaS Chrome Extension.");
              }
            } else {
              m(X.userInfoList, V, W);
              if (typeof pIds != "undefined") {
                nextPageIndex = W == 0 ? pIds[1] : pIds[pIds.indexOf(W) + 1];
                prevPageIndex = W == 0 ? undefined : pIds[pIds.indexOf(W) - 1];
              }
              ciError = X.ciErr;
              if (!ciError) {
                $(".error-filter").hide();
              }
            }
          });
        },
        function (X) {
          let urlMatch = window.location.href.includes("contentWrapper.jsp");
          let d2lUrl = window.location.href.includes("d2l");
          if (urlMatch || d2lUrl) {
            alert(X);
          } else {
            toast.error(X);
          }
        }
      );
  }
  function x(X, Z, V, W, Y, aa) {
    let userToken = localStorage.getItem("loginToken");
    let userRestURL = localStorage.getItem("loginltiUrl");
    let courseName = dataStorageService.getCourseName();
    apiService
      .getUserIndexes(
        encodeURIComponent(courseName),
        encodeURIComponent(X),
        Z,
        V,
        W,
        Y,
        userToken,
        userRestURL
      )
      .then(
        function (ab) {
          A(ab, Z);
          if (typeof aa != "undefined" && typeof aa === "function") {
            aa();
          }
        },
        function (ab) {
          let urlMatch = window.location.href.includes("contentWrapper.jsp");
          let d2lUrl = window.location.href.includes("d2l");
          if (urlMatch || d2lUrl) {
            alert(ab);
          } else {
            toast.error(ab);
          }
        }
      );
  }
  function A(V, W) {
    if (!V) {
      console.log("Invalid Response");
      return;
    }
    pIds = V.pids;
    pageInfo = V.pageInfo;
    $("#main-search").html("");
    $("#main-pagination").html("");
    isQuizState = false;
    j(V.pids, W, userIdArr);
    pagination = J();
    search = k("User Search");
    $("#main-search").append(search);
    $("#search")
      .off("keyup")
      .on("keyup", function (X) {
        y($(this).val(), X);
      });
    $("#search")
      .off("keydown")
      .on("keydown", function (X) {
        H(X);
      });
    $(".search-icon")
      .off("click")
      .on("click", function (X) {
        y($("#search").val(), X);
      });
    $("#main-pagination").append(pagination);
    i(pageInfo, isQuizState, pIds, userIdArr);
    $(".quiz").click(function () {
      var X = $(this).data("quiz-id");
      c(quizName, X);
    });
  }
  function i(aa, ab, Z, V) {
    if (!isQuizSearch && !isUserSearch && !isFiltersApplied) {
      for (var X = 0; X < Z.length; X++) {
        var W = V.indexOf(Z[X]) + 1;
        var Y =
          "<li class='pagination-page'><a class='quiz' data-quiz-id='" +
          Z[X] +
          "'>" +
          W +
          "</a></li>";
        if ($(".pagination-page").length) {
          $(".pagination-page:last").after(Y);
        } else {
          if ($(".pagination-prev").length) {
            $(".pagination-prev").after(Y);
          } else {
            $(".pagination-pages ul").prepend(Y);
          }
        }
      }
    } else {
      var Y =
        "<li class='pagination-page'><a>" + pageNumberForSearch + "</a></li>";
      $(".pagination-prev").after(Y);
    }
    if (aa.hasNext) {
      $(".pagination-next").show();
      $(".pagination-next")
        .off("click")
        .on("click", function () {
          r("NEXT", ab);
        });
    } else {
      $(".pagination-next").hide();
    }
    if (aa.hasPrevious) {
      $(".pagination-prev").show();
      $(".pagination-prev")
        .off("click")
        .on("click", function () {
          r("PREVIOUS", ab);
        });
    } else {
      $(".pagination-prev").hide();
    }
  }
  function d(Y) {
    var V = Y.concat();
    for (var X = 0; X < V.length; ++X) {
      for (var W = X + 1; W < V.length; ++W) {
        if (V[X] === V[W]) {
          V.splice(W--, 1);
        }
      }
    }
    return V;
  }
  function j(X, W, V) {
    nextTilesIndex = X.slice(-1)[0];
    prevTilesIndex = X[0];
    if (typeof V !== "undefined") {
      userIdArr = d(userIdArr.concat(X));
    } else {
      quizIdArr = d(quizIdArr.concat(X));
    }
    if (W == 0) {
      nextPageIndex = X[1];
      prevPageIndex = undefined;
    } else {
      if (X.indexOf(W) == -1) {
        nextPageIndex = X[0];
        prevPageIndex = nextTilesIndex;
      } else {
        nextPageIndex = X[X.indexOf(W) + 1];
        prevPageIndex = X[X.indexOf(W) - 1];
      }
    }
  }
  function h() {
    if (!quizData || Object.keys(quizData).length === 0) {
      let noData =
        '<div class="warning-section"><span class="warning-icon">!</span></div><div class="no-record text-bold">No Record Found</div>';
      $("#main-section").html(noData);
      $(".warning-section").show();
      $(".no-record").show();
      $(".header-section").hide();
      return;
    } else {
      M();
    }
  }
  function u() {
    $("#back")
      .off("click")
      .on("click", function () {
        if (navigator.onLine) {
          chrome.storage.local.get(["state"], function (V) {
            if (V.state === loginState.PROFESSOR_LOGIN_SUCCESS) {
              $("#back").hide();
              $(".filter-sort-div").hide();
              $(".warning-section").hide();
              $(".no-record").hide();
              $(".table-report-data").remove();
              $(".selected-quiz").remove();
              $("#course-subtext").html(
                "Below is the list of Quizzes mapped to this course."
              );
              startIndex = 0;
              userIdArr = [];
              selectedFilters = [];
              sortingCriteria = [];
              isFiltersApplied = false;
              F();
              D(startIndex, 100, 10, "NEXT");
            } else {
              let urlMatch =
                window.location.href.includes("contentWrapper.jsp");
              let d2lUrl = window.location.href.includes("d2l");
              if (urlMatch || d2lUrl) {
                alert("You are not logged in RPaaS Chrome Extension.");
              } else {
                toast.error("You are not logged in RPaaS Chrome Extension.");
              }
            }
          });
        } else {
          let urlMatch = window.location.href.includes("contentWrapper.jsp");
          let d2lUrl = window.location.href.includes("d2l");
          if (urlMatch || d2lUrl) {
            alert(
              "Internet connection lost or Timeout. Please reconnect and refresh the browser."
            );
          } else {
            toast.error(
              "Internet connection lost or Timeout. Please reconnect and refresh the browser."
            );
          }
        }
      });
  }
  function s(V, W) {
    if (!V) {
      console.log("Invalid Response");
      return;
    }
    quizData = V.quizUsers;
    if (W != 0) {
      pageInfo.hasPrevious = true;
      $(".pagination-prev").show();
      $(".pagination-prev")
        .off("click")
        .on("click", function () {
          r("PREVIOUS", isQuizState);
        });
    }
    if (quizIdArr.indexOf(W) === 0) {
      pageInfo.hasPrevious = false;
      $(".pagination-prev").hide();
    }
    h();
    u();
  }
  function F(V) {
    let selectedCourse = dataStorageService.getCourseName();
    $(".course-title").html(selectedCourse);
    let userToken = localStorage.getItem("loginToken");
    let userRestURL = localStorage.getItem("loginltiUrl");
    if (V) {
      startIndex = V;
    }
    apiService
      .getAllQuizzes(
        encodeURIComponent(selectedCourse),
        startIndex,
        pageSize,
        userToken,
        userRestURL
      )
      .then(
        function (W) {
          s(W, startIndex);
          if (typeof quizIds != "undefined") {
            nextPageIndex =
              startIndex == 0
                ? quizIds[1]
                : quizIds[quizIds.indexOf(startIndex) + 1];
            prevPageIndex =
              startIndex == 0
                ? undefined
                : quizIds[quizIds.indexOf(startIndex) - 1];
          }
        },
        function (W) {
          let urlMatch = window.location.href.includes("contentWrapper.jsp");
          let d2lUrl = window.location.href.includes("d2l");
          if (urlMatch || d2lUrl) {
            alert(W);
          } else {
            toast.error(W);
          }
        }
      );
  }
  function D(Y, V, W, X, Z) {
    let selectedCourse = dataStorageService.getCourseName();
    $(".course-title").html(selectedCourse);
    let userToken = localStorage.getItem("loginToken");
    let userRestURL = localStorage.getItem("loginltiUrl");
    apiService
      .getQuizIndexs(
        encodeURIComponent(selectedCourse),
        Y,
        V,
        W,
        X,
        userToken,
        userRestURL
      )
      .then(
        function (aa) {
          b(aa, Y);
          if (typeof Z != "undefined" && typeof Z === "function") {
            Z();
          }
        },
        function (aa) {
          let urlMatch = window.location.href.includes("contentWrapper.jsp");
          let d2lUrl = window.location.href.includes("d2l");
          if (urlMatch || d2lUrl) {
            alert(aa);
          } else {
            toast.error(aa);
          }
        }
      );
  }
  function b(V, W) {
    if (!V) {
      console.log("Invalid Response");
      return;
    }
    quizIds = V.quizIds;
    pageInfo = V.pageInfo;
    $("#main-pagination").html("");
    $("#main-search").html("");
    j(V.quizIds, W);
    isQuizState = true;
    pagination = J();
    search = k("Quiz Search");
    $("#main-search").append(search);
    $("#search")
      .off("keyup")
      .on("keyup", function (X) {
        y($(this).val(), X);
      });
    $("#search")
      .off("keydown")
      .on("keydown", function (X) {
        H(X);
      });
    $(".search-icon")
      .off("click")
      .on("click", function (X) {
        y($("#search").val(), X);
      });
    $("#main-pagination").append(pagination);
    i(pageInfo, isQuizState, quizIds, quizIdArr);
    $(".quiz").click(function () {
      var X = $(this).data("quiz-id");
      F(X);
    });
  }
  function y(V, W) {
    startIndex = 0;
    if (oldSearchString == V && W.which !== 13 && W.which !== 1) {
      return;
    }
    oldSearchString = V;
    if (V.length < 2) {
      l(false);
      $(".autocompleteDiv").addClass("hide").removeClass("show");
      return;
    } else {
      $(".autocompleteDiv").addClass("show").removeClass("hide");
      timer = setTimeout(function () {
        U(V, W);
        clearTimeout(timer);
      }, doneTypingVal);
    }
  }
  function U(V, W) {
    if (W.which === 13 || W.which === 1) {
      nextPageIndex = undefined;
      prevPageIndex = undefined;
      if (!isQuizState) {
        isUserSearch = true;
        isFiltersApplied = false;
        f(isUserSearch);
        g(V, startIndex);
      } else {
        isQuizSearch = true;
        o(V, startIndex);
      }
      $(".autocompleteDiv").removeClass("show").addClass("hide");
    } else {
      if (!isQuizState) {
        p(V);
      } else {
        w(V);
      }
    }
  }
  function w(V) {
    // console.log("from V- ", V);
    let selectedCourse = dataStorageService.getCourseName();
    let userToken = localStorage.getItem("loginToken");
    let userRestURL = localStorage.getItem("loginltiUrl");
    apiService
      .getQuizSuggestion(
        encodeURIComponent(selectedCourse),
        suggestionPageSize,
        encodeURIComponent(V),
        userToken,
        userRestURL
      )
      .then(
        function (W) {
          if (!W) {
            console.log("Invalid Response");
            return;
          }
          t(W.quizNames);
        },
        function (W) {
          let urlMatch = window.location.href.includes("contentWrapper.jsp");
          let d2lUrl = window.location.href.includes("d2l");
          if (urlMatch || d2lUrl) {
            alert(W);
          } else {
            toast.error(W);
          }
        }
      );
  }
  function o(V, W) {
    let selectedCourse = dataStorageService.getCourseName();
    let userToken = localStorage.getItem("loginToken");
    let userRestURL = localStorage.getItem("loginltiUrl");
    rows = W;
    apiService
      .getQuizSearchResult(
        encodeURIComponent(selectedCourse),
        rows,
        pageSize,
        encodeURIComponent(V),
        userToken,
        userRestURL
      )
      .then(
        function (X) {
          if (!X) {
            console.log("Invalid Response");
            return;
          }
          s(X, rows);
          $("#main-pagination").html("");
          pagination = J();
          $("#main-pagination").html(pagination);
          pageInfo = { hasNext: X.hasNextPage, hasPrevious: X.hasPreviousPage };
          pageNumberForSearch = W / pageSize + 1;
          i(pageInfo, isQuizState);
        },
        function (X) {
          let urlMatch = window.location.href.includes("contentWrapper.jsp");
          let d2lUrl = window.location.href.includes("d2l");
          if (urlMatch || d2lUrl) {
            alert(X);
          } else {
            toast.error(X);
          }
        }
      );
  }
  function p(V) {
    let selectedCourse = dataStorageService.getCourseName();
    let userToken = localStorage.getItem("loginToken");
    let userRestURL = localStorage.getItem("loginltiUrl");
    rows = startIndex;
    apiService
      .getUserSuggestion(
        encodeURIComponent(selectedCourse),
        encodeURIComponent(quizName),
        suggestionPageSize,
        encodeURIComponent(V),
        userToken,
        userRestURL
      )
      .then(
        function (W) {
          if (!W) {
            console.log("Invalid Response");
            return;
          }
          let uniqueIdList = [];
          let reportLinkList = [];
          for (var X = 0; X < W.userUniqueIdList.length; X++) {
            uniqueIdList.push(W.userUniqueIdList[X].uniqueId);
            reportLinkList.push(W.userUniqueIdList[X].reportLink);
          }
          t(uniqueIdList, reportLinkList);
        },
        function (W) {
          toast.error(W);
        }
      );
  }
  function g(V, W) {
    let selectedCourse = dataStorageService.getCourseName();
    let userToken = localStorage.getItem("loginToken");
    let userRestURL = localStorage.getItem("loginltiUrl");
    rows = W;
    apiService
      .getUserSearchResult(
        encodeURIComponent(selectedCourse),
        encodeURIComponent(quizName),
        rows,
        pageSize,
        _isCi,
        encodeURIComponent(V),
        userToken,
        userRestURL
      )
      .then(
        function (X) {
          if (!X) {
            console.log("Invalid Response");
            return;
          }
          m(X.userInfoList, quizName, rows);
          $("#main-pagination").html("");
          pagination = J();
          $("#main-pagination").html(pagination);
          pageInfo = { hasNext: X.hasNextPage, hasPrevious: X.hasPreviousPage };
          pageNumberForSearch = W / pageSize + 1;
          i(pageInfo, isQuizState);
          setTimeout(function () {
            selectedFilters = [];
            sortingCriteria = [];
            l(true);
          });
        },
        function (X) {
          let urlMatch = window.location.href.includes("contentWrapper.jsp");
          let d2lUrl = window.location.href.includes("d2l");
          if (urlMatch || d2lUrl) {
            alert(X);
          } else {
            toast.error(X);
          }
        }
      );
  }
  function t(Y, W) {
    if (Y.length > 0) {
      $(".autocompleteDiv").removeClass("hide").addClass("show");
      $("#select").html("");
      for (var X = 0; X < Y.length; X++) {
        var V;
        if (typeof W !== "undefined") {
          V = "<option data-src='" + W[X] + "'>" + Y[X] + "</option>";
        } else {
          V = "<option>" + Y[X] + "</option>";
        }
        $("#select").append(V);
      }
      $("#select")
        .off("keydown")
        .on("keydown", function (Z) {
          H(Z);
        });
      $("#select")
        .off("click keypress")
        .on("click keypress", function (Z) {
          S(Z, Y, W);
        });
      $("#select")
        .off("change")
        .on("change", function () {
          I($(this).val());
        });
      $(".no-data-found").addClass("hide").removeClass("show");
    } else {
      Y = [];
      $("#select").html("");
      $(".no-data-found").removeClass("hide").addClass("show");
    }
  }
  function H(V) {
    clearTimeout(timer);
    if (V.keyCode == 40) {
      document.getElementById("select").focus();
      if (document.getElementById("select").selectedIndex > 0) {
      } else {
        document.getElementById("select").selectedIndex = 0;
      }
    }
    if (V.keyCode == 38) {
      if (document.getElementById("select").selectedIndex == 0) {
        document.getElementById("search").focus();
      }
    }
  }
  function S(X, V, W) {
    startIndex = 0;
    if (typeof W === "undefined") {
      quizName = searchText ? searchText : V[0];
    }
    if (X.keycode == 38) {
      console.log("upper arrow");
    } else {
      if (X.keycode == 40) {
        console.log("bottom arrow");
      } else {
        if (X.keyCode == 13) {
          if (!isQuizState) {
            window.open(
              X.currentTarget.selectedOptions[0].getAttribute("data-src")
                ? X.currentTarget.selectedOptions[0].getAttribute("data-src")
                : W[0],
              "_blank"
            );
          } else {
            c(searchText ? searchText : V[0], startIndex);
            x(
              searchText ? searchText : V[0],
              startIndex,
              pageSize,
              tiles,
              page
            );
          }
        } else {
          if (!isQuizState) {
            window.open(
              X.currentTarget.selectedOptions[0].getAttribute("data-src"),
              "_blank"
            );
          } else {
            c(searchText, startIndex);
            x(searchText, startIndex, pageSize, tiles, page);
            document.getElementById("search").focus();
          }
        }
      }
    }
    $(".autocompleteDiv").addClass("hide").removeClass("show");
  }
  function I(V) {
    searchText = V.slice(-1)[0];
  }
  function a() {
    return '<div class="filter-div"><span>Filter By</span><div class="multi-select-container"><span class="multi-select-button" role="button" aria-haspopup="true" tabindex="0" aria-label="Select :">Credibility Index</span><div class="multi-select-menu" role="menu" style="width: auto;"><div class="multi-select-menuitems"><label class="multi-select-menuitem range-filter" for="LOW" role="menuitem"><input class="filter-checkbox" type="checkbox" id="LOW" value="LOW">Low</label><label class="multi-select-menuitem range-filter" for="MEDIUM" role="menuitem"><input class="filter-checkbox" type="checkbox" id="MEDIUM" value="MEDIUM">Medium</label><label class="multi-select-menuitem range-filter" for="HIGH" role="menuitem"><input class="filter-checkbox" type="checkbox" id="HIGH" value="HIGH">High</label><label class="multi-select-menuitem not-range-filter na-filter" for="na" role="menuitem"><input class="filter-checkbox" type="checkbox" id="na" value="NA">NA</label><label class="multi-select-menuitem not-range-filter error-filter" for="error" role="menuitem"><input class="filter-checkbox" type="checkbox" id="error" value="Error">Error</label></div></div></div></div>';
  }
  function E() {
    return '<div class="sort-div"><span>Sort By</span><select data-type="index"><option value="">Credibility Index</option><option value="DESC">High to Low</option><option value="ASC">Low to High</option></select><select data-type="score"><option value="">Credibility Score</option><option value="DESC">High to Low</option><option value="ASC">Low to High</option></select></div>';
  }
  function R() {
    return '<div class="filter-buttons"><button class="btn btn-primary apply-btn" disabled>Apply</button><button class="btn btn-default reset-btn" disabled>Reset</button></div>';
  }
  function e() {
    let filterView = a();
    let sortingView = E();
    let filteringButtonView = R();
    $(".filter-sort-div")
      .show()
      .html(filterView + sortingView + filteringButtonView);
    $(".multi-select-button").off("click").on("click", P);
    $(".apply-btn").off("click").on("click", n);
    $(".reset-btn")
      .off("click")
      .on("click", function () {
        f();
      });
    $(".filter-checkbox")
      .off("change")
      .on("change", function () {
        B($(this));
      });
    $(".sort-div")
      .find("select")
      .off("change")
      .on("change", function () {
        Q($(this));
      });
  }
  function P() {
    var V = $(".multi-select-menu");
    if (V.hasClass("multi-select-container--open")) {
      V.removeClass("multi-select-container--open");
      $(window).off("click");
    } else {
      V.addClass("multi-select-container--open");
      $(window)
        .off("click")
        .on("click", function (W) {
          z(W, function () {
            P();
          });
        });
    }
  }
  function z(Y, Z) {
    var W = Y.target;
    if (!W) {
      return;
    }
    var V = W.classList;
    var X =
      V.contains("multi-select-button") ||
      V.contains("multi-select-menuitems") ||
      V.contains("multi-select-menuitem") ||
      (W.parentElement !== null &&
        W.parentElement.classList.contains("multi-select-menuitem"));
    if (!X) {
      Z();
      return;
    }
  }
  function B(W) {
    if (W) {
      if (W.prop("checked")) {
        if (W.val() == "NA" || W.val() == "Error") {
          $(".range-filter").find(".filter-checkbox").attr("disabled", true);
          if ($(".error-filter") && W.val() == "NA") {
            $("#error").attr("disabled", true);
          }
          if ($(".na-filter") && W.val() == "Error") {
            $("#na").attr("disabled", true);
          }
          $(".sort-div").find("select").attr("disabled", true);
        } else {
          $(".not-range-filter")
            .find(".filter-checkbox")
            .attr("disabled", true);
        }
        selectedFilters.push(W.val());
        $(".multi-select-button").html("Selected: " + selectedFilters);
      } else {
        var V = selectedFilters.indexOf(W.val());
        selectedFilters.splice(V, 1);
        if (W.val() == "NA" || W.val() == "Error") {
          $(".range-filter")
            .find(".filter-checkbox")
            .removeAttr("disabled", true);
          if ($(".error-filter") && W.val() == "NA") {
            $("#error").removeAttr("disabled", true);
          }
          if ($(".na-filter") && W.val() == "Error") {
            $("#na").removeAttr("disabled", true);
          }
          $(".sort-div").find("select").removeAttr("disabled");
        } else {
          if (!selectedFilters.length) {
            $(".not-range-filter")
              .find(".filter-checkbox")
              .removeAttr("disabled", true);
          }
        }
        if (!selectedFilters.length) {
          $(".multi-select-button").html("Credibility Index");
        } else {
          $(".multi-select-button").html("Selected: " + selectedFilters);
        }
      }
      l(false);
    }
  }
  function Q(X) {
    var Y = {};
    var V = {};
    K(X.data("type"));
    if (X.data("type") == "index") {
      if (X.val()) {
        Y.sortBy = "INDEX";
        Y.order = X.val();
      }
    } else {
      if (X.val()) {
        V.sortBy = "SCORE";
        V.order = X.val();
      }
    }
    if (Object.keys(Y).length) {
      sortingCriteria.push(Y);
    }
    if (Object.keys(V).length) {
      sortingCriteria.push(V);
    }
    if (sortingCriteria.length > 1) {
      if (sortingCriteria[0].sortBy == "SCORE") {
        var W = sortingCriteria[0];
        sortingCriteria.splice(0, 1);
        sortingCriteria.push(W);
      }
    }
    l(false);
  }
  function l(V) {
    if (selectedFilters.length || sortingCriteria.length) {
      $(".apply-btn").removeAttr("disabled");
      $(".reset-btn").removeAttr("disabled");
    } else {
      $(".apply-btn").attr("disabled", true);
      $(".reset-btn").attr("disabled", true);
      if (V) {
        $(".filter-checkbox").attr("disabled", true);
        $(".sort-div").find("select").attr("disabled", true);
      } else {
        $(".filter-checkbox").removeAttr("disabled", true);
        $(".sort-div").find("select").removeAttr("disabled", true);
      }
    }
  }
  function K(W) {
    for (var V = 0; V < sortingCriteria.length; V++) {
      if (sortingCriteria[V].sortBy == W) {
        sortingCriteria.splice(sortingCriteria.indexOf(sortingCriteria[V]), 1);
      }
    }
  }
  function q(W) {
    var X = "";
    var V = "";
    if (W.ciStatus == "NOT_APPLICABLE" || W.ciStatus == "N/A") {
      V = "N/A";
      X = "N/A";
    } else {
      if (W.ciStatus == "IN_PROCESS") {
        V = "In Process";
        X = "N/A";
      } else {
        if (W.ciStatus == "FAILED" || W.ciStatus == "Failed") {
          V = "ERROR";
          X = "N/A";
        } else {
          V = W.ciStatus;
          X = W.ciScore;
        }
      }
    }
    return { status: V, score: X };
  }
  function n() {
    $("#search").attr("disabled", true);
    startIndex = 0;
    isFiltersApplied = true;
    if (selectedFilters.indexOf("NA") != "-1") {
      v(startIndex);
    } else {
      if (selectedFilters.indexOf("Error") != "-1") {
        C(startIndex);
      } else {
        L(startIndex);
      }
    }
  }
  function f(V) {
    if (selectedFilters.length) {
      selectedFilters = [];
      $(".multi-select-button").html("Credibility Index");
      $(".filter-checkbox").prop("checked", false).removeAttr("disabled", true);
    }
    if (sortingCriteria.length) {
      sortingCriteria = [];
      $("select").val("");
    }
    $(".apply-btn").attr("disabled", true);
    $(".reset-btn").attr("disabled", true);
    $("#search").removeAttr("disabled");
    isFiltersApplied = false;
    startIndex = 0;
    if (!V) {
      x(quizName, startIndex, pageSize, tiles, page, function () {
        c(quizName, startIndex);
      });
    }
  }
  function G(V) {
    rows = V;
    return {
      course: encodeURIComponent(dataStorageService.getCourseName()),
      token: localStorage.getItem("loginToken"),
      url: localStorage.getItem("loginltiUrl"),
      quiz: encodeURIComponent(quizName),
      filteredPostData: {
        indexCriteria: selectedFilters,
        sortingCriteria: sortingCriteria,
        startIndex: rows,
        pageSize: pageSize,
      },
    };
  }
  function L(V) {
    nextPageIndex = undefined;
    prevPageIndex = undefined;
    var W = G(V);
    apiService.getFilteredUsers(W).then(
      function (X) {
        if (!X) {
          console.log("no data in filtered users result", X);
          return;
        } else {
          $("#main-pagination").html("");
          pagination = J();
          $("#main-pagination").html(pagination);
          pageInfo = { hasNext: X.hasNext };
          if (startIndex > 0) {
            pageInfo.hasPrevious = true;
          }
          pageNumberForSearch = startIndex / pageSize + 1;
          i(pageInfo, false);
          m(X.usersInfo, quizName, V);
        }
      },
      function (X) {
        console.log(X);
      }
    );
  }
  function v(V) {
    let selectedCourse = dataStorageService.getCourseName();
    let userToken = localStorage.getItem("loginToken");
    let userRestURL = localStorage.getItem("loginltiUrl");
    apiService
      .getNotApplicableUsers(
        encodeURIComponent(selectedCourse),
        encodeURIComponent(quizName),
        V,
        pageSize,
        userToken,
        userRestURL
      )
      .then(
        function (W) {
          if (!W) {
            console.log("no data in filtered users result", W);
            return;
          } else {
            $("#main-pagination").html("");
            pagination = J();
            $("#main-pagination").html(pagination);
            pageInfo = { hasNext: W.hasNext };
            if (startIndex > 0) {
              pageInfo.hasPrevious = true;
            }
            pageNumberForSearch = startIndex / pageSize + 1;
            i(pageInfo, false);
            m(W.usersInfo, quizName, V);
          }
        },
        function (W) {
          console.log(W);
        }
      );
  }
  function C(V) {
    let selectedCourse = dataStorageService.getCourseName();
    let userToken = localStorage.getItem("loginToken");
    let userRestURL = localStorage.getItem("loginltiUrl");
    apiService
      .getFailedUsers(
        encodeURIComponent(selectedCourse),
        encodeURIComponent(quizName),
        V,
        pageSize,
        userToken,
        userRestURL
      )
      .then(
        function (W) {
          if (!W) {
            console.log("no data in filtered users result", W);
            return;
          } else {
            $("#main-pagination").html("");
            pagination = J();
            $("#main-pagination").html(pagination);
            pageInfo = { hasNext: W.hasNext };
            if (startIndex > 0) {
              pageInfo.hasPrevious = true;
            }
            pageNumberForSearch = startIndex / pageSize + 1;
            i(pageInfo, false);
            m(W.usersInfo, quizName, V);
          }
        },
        function (W) {
          console.log(W);
        }
      );
  }
  function N(V) {
    if (!V) {
      toast.error("Unable to bind Values");
      return;
    }
    V.authorization
      ? $("#auth").prop("checked", true)
      : $("#auth").prop("checked", false);
    V.navigationControl
      ? $("#navigation").prop("checked", true)
      : $("#navigation").prop("checked", false);
    V.screenCapture
      ? $("#screenCapture").prop("checked", true)
      : $("#screenCapture").prop("checked", false);
    V.hardMapping
      ? $("#hardMapping").prop("checked", true)
      : $("#hardMapping").prop("checked", false);
    V.recording
      ? $("#record").prop("checked", true)
      : $("#record").prop("checked", false);
    V.fullScreen
      ? $("#fullScreen").prop("checked", true)
      : $("#fullScreen").prop("checked", false);
    V.restrictPlugin
      ? $("#plugin").prop("checked", true)
      : $("#plugin").prop("checked", false);
    V.signlePageQuiz
      ? $("#signlepagequiz").prop("checked", true)
      : $("#signlepagequiz").prop("checked", false);
    V.displayWarning
      ? $("#displaywarning").prop("checked", true)
      : $("#displaywarning").prop("checked", false);
    V.navigationControl
      ? $("#id_lostfocusallowed").show()
      : $("#id_lostfocusallowed").hide();
    $("#lostfocusallowed").val(V.lostfocusallowed ? V.lostfocusallowed : 20);
  }
  function O() {
    return {
      recording: $("#record").is(":checked"),
      screenCapture: $("#screenCapture").is(":checked"),
      hardMapping: $("#hardMapping").is(":checked"),
      authorization: $("#auth").is(":checked"),
      navigationControl: $("#navigation").is(":checked"),
      fullScreen: $("#fullScreen").is(":checked"),
      restrictPlugin: $("#plugin").is(":checked"),
      signlePageQuiz: $("#signlepagequiz").is(":checked"),
      displayWarning: $("#displaywarning").is(":checked"),
      lostfocusallowed: $("#lostfocusallowed").val(),
    };
  }
  return {
    getQuizzes: F,
    bindMpassValues: N,
    getQuizIndex: D,
    proctoringSettings: O,
  };
})();
var studentViewService = new (function () {
  var c = mpaasConstants.localStorageValues;
  var o = mpaasConstants.chromeSendMessage;
  var k = true;
  function h(n) {
    if (!n) {
      console.log("Enable to open proctoring window.");
      return;
    }
    console.log("starting proctoring window.");
    localStorage.removeItem("DWindow");
    localStorage.removeItem("messageStart");
    localStorage.removeItem("messages");
    sessionStorage.setItem("proctor", c.ACTIVE);
    $("#myModal").show();
    $("#continue").on("click", function () {
      chrome.runtime.sendMessage({ type: "action", action: o.SET_TESTTAB });
      console.log("continue click n- ", n);
      console.log("continue navigator- ", navigator);
      if (navigator.onLine) {
        let mpassUrl = n.mpaasUrl;
        let token = n.token;
        // access = JSON.parse(n.accessCode);
        access = n;
        chrome.storage.local.set({ navigationTimeout: 30000 });
        chrome.storage.local.set({ proctoringTimeout: 30000 });
        if (n.proctoringSettings && typeof n.proctoringSettings == "object") {
          chrome.storage.local.set({
            navigationControl: n.proctoringSettings.navigationControl,
          });
          if (
            n.proctoringSettings.navigationControl &&
            n.proctoringSettings.lostfocusallowed == undefined
          ) {
            n.proctoringSettings.lostfocusallowed = 20;
          }
          chrome.storage.local.set({
            lostfocusallowed: n.proctoringSettings.lostfocusallowed,
          });
          chrome.storage.local.set({ lostfocuscounter: 0 });
          chrome.storage.local.set({ lostfocus: 0 });
          // chrome.storage.local.set({ fullScreen: n.proctoringSettings.fullScreen });
          // chrome.storage.local.set({ navigationControl: false });
          chrome.storage.local.set({ fullScreen: false });
          chrome.storage.local.set({
            restrictPlugin: n.proctoringSettings.restrictPlugin,
          });
        } else {
          chrome.storage.local.set({ navigationControl: false });
          chrome.storage.local.set({ fullScreen: false });
          chrome.storage.local.set({ restrictPlugin: true });
          chrome.storage.local.set({ lostfocuscounter: 0 });
          chrome.storage.local.set({ lostfocus: 0 });
        }
        chrome.storage.local.set({ n: n });
        // alert("starting launch");
        MP.launch(token, mpassUrl, b, a);
      } else {
        toast.error(
          "Internet Connection not available. Please reconnect the internet and relaunch your browser and resume the test."
        );
      }
    });
  }
  function b(n) {
    // console.log("Before START_PROCTORING",n);
    chrome.runtime.sendMessage({ type: "action", action: o.ACTIVATE_TESTTAB });
    $("#myModal").hide();
    $("#testModal").show();
  }
  function a(n) {
    // console.log("n- ", n);
    // toast.error(n.data + "  " + n.type);
  }
  function m() {
    chrome.storage.local.get(["restrictPlugin"], function (n) {
      if (n.restrictPlugin) {
        $("#testModal").hide();
        $("#pluginLoader").show();
        console.log("Plugins check On");
        f();
      } else {
        j();
      }
    });
  }
  function f() {
    if (k) {
      let type = "disablePlugins";
      g(type);
      k = false;
    } else {
      e();
    }
  }
  function e() {
    $("#otherPluginsPopup").hide();
    $("#pluginLoader").show();
    let type = "retry";
    g(type);
  }
  function g(n) {
    if (!n) {
      toast.error("Something went wrong.Please try again");
    }
    apiService.diablePlugin(n).then(
      function (o) {
        console.log("apiService.diablePlugin success:- ", o);
        let PluginData = o;
        if (o.length == 1) {
          j();
        } else {
          let otherPlugin = [];
          for (q = 0; q < PluginData.length; q++) {
            if (PluginData[q].name === "Wheebox RPaaS") {
              console.log("Wheebox RPaaS");
            } else {
              otherPlugin.push(PluginData[q]);
            }
          }
          console.log(otherPlugin);
          if (otherPlugin.length == 0) {
            $("#pluginLoader").hide();
            $("#otherPluginsPopup").show();
            $(".plugindata-section").hide();
          } else {
            $(".plugindata-section").html("");
            let ulLayout = '<ul class="plugin-data"></ul>';
            $(".plugindata-section").append(ulLayout);
            for (var q = 0; q < otherPlugin.length; q++) {
              var p = '<li class="text-bold">' + otherPlugin[q].name + "</li>";
              $(".plugin-data").append(p);
            }
            $("#pluginLoader").hide();
            $("#otherPluginsPopup").show();
            $(".duplicatedata-section").hide();
          }
        }
      },
      function (o) {
        console.log("apiService.diablePlugin error:- ", o);
      }
    );
  }
  function l() {
    console.log("NO parameter function");
    apiService.checkDiagonostic().then(
      function (n) {
        console.log(n);
        if (n.tabLength == 2) {
          d();
        } else {
          $("#pluginLoader").hide();
          $("#testModal").show();
          alert("Please close Unpinned Tabs");
        }
      },
      function (n) {
        console.log(n);
        $("#testModal").show();
        toast.error(
          "Something went wrong. Please refresh and start the quiz again."
        );
      }
    );
  }
  function j() {
    chrome.storage.local.get(["navigationControl"], function (n) {
      if (n.navigationControl) {
        chrome.runtime.sendMessage({
          type: "action",
          action: chromeMessage.CLOSE_OTHER_TABS,
        });
        setTimeout(function () {
          l();
        }, 1000);
      } else {
        d();
      }
    });
  }
  function d() {
    chrome.storage.local.get(function (n) {
      // console.log("checking staten", n)
      if (n.state === "STUDENT_LOGIN_SUCCESS") {
        i();
      } else {
        toast.error(
          "Something went wrong. Please refresh and start the quiz again.."
        );
      }
    });
  }
  function i() {
    chrome.storage.local.get(["lmsApp"], function (n) {
      switch (n.lmsApp) {
        case "moodle":
          $("#pluginLoader").hide();
          $("#testModal").hide();
          $("#id_quizpassword")
            .hide()
            .attr("type", "text")
            .val(decodeURIComponent(access.accessCode));
          $("#id_submitbutton").click();
          break;
        case "canvas":
          $("#pluginLoader").hide();
          $("#testModal").hide();
          $("input#quiz_access_code").val(
            decodeURIComponent(access.accessCode)
          );
          $(".access_code_form")
            .find("button")
            .prop("id", "quiz-submit")
            .click();
          break;
        case "blackboard":
          $("#pluginLoader").hide();
          $("#testModal").hide();
          $(".field").find("input").val(decodeURIComponent(access.accessCode));
          $("#bottom_Submit").click();
          break;
        case "d2l":
          $("#pluginLoader").hide();
          $("#testModal").hide();
          $("input[name=password]").val(decodeURIComponent(access.accessCode));
          $("d2l-floating-buttons").find("button").click();
          break;
        default:
          toast.error(
            "Something went wrong. Please refresh and start the quiz again..."
          );
          console.log("Invalid lms app");
      }
    });
  }
  return { openProctoringWindow: h, checkPluginsOn: m, retrying: e };
})();
var takeQuizService = new (function () {
  var f = [];
  var l = "Right clicks are not allowed.";
  var n;
  var e = false;
  var checktimeout = false;
  var checktimeoutroom = false;
  var checktimeoutnoise = false;
  var pe = "";
  var pp = "";
  var audioplayed = new Array();
  var t;
  var b;
  var b1;
  var c = mpaasConstants.loginState;
  var o = mpaasConstants.chromeSendMessage;
  var q = mpaasConstants.localStorageValues;
  var y = mpaasConstants.chromeStorage;
  function s() {
    $(".open-chat").hide();
    $(".chat-block").hide();
    let messageChat = localStorage.getItem("messageStart");
    if (messageChat == "yes") {
      $(".open-chat").show();
      let allchats = localStorage.getItem("messages");
      f.push(allchats.split(",").join(""));
      $(".chat-body").append(allchats);
    }
  }
  function u() {
    chrome.storage.local.get(["navigationTimeout"], function (A) {
      t = A.navigationTimeout * 1000;
    });
    chrome.storage.local.get(["navigationControl"], function (B) {
      if (B.navigationControl) {
        // console.log("Navigation Control On");
        chrome.storage.local.get(function (C) {
          if (C.lmsApp === "d2l") {
            window.onblur = w;
          } else {
            window.onblur = h;
          }
        });
        chrome.runtime.sendMessage({
          type: "action",
          action: o.START_PROCTORING,
        });
        var A = mpaasConstants.chromeStorage;
        chrome.storage.local.set({ exam: A.START });
        chrome.extension.onMessage.addListener(function (C) {
          if (C.content == "blur") {
            p();
          }
        });
      } else {
        console.log("Navigation Control Off");
      }
    });
    localStorage.setItem("startExam", "start");
    proctoringSession.startWindow();
    setTimeout(function () {
      let dwindow = localStorage.getItem("DWindow");
      if (dwindow === "start") {
        proctoringSession.startPingPong();
      } else {
        proctoringSession.start();
        localStorage.setItem("DWindow", q.START);
      }
    }, 500);
  }
  function g() {
    proctoringSession.setMessageListener(A);
    function A(D) {
      if (!D && !D.data) {
        return;
      }
      $(".chat-block").show();
      localStorage.setItem("messageStart", q.YES);
      var B = D.data;
      var C =
        '<div class="chat-msg text-left"><div class="receive-arrow"></div><span class="receive text-black inline-block">' +
        B +
        "</span></div>";
      f.push(C);
      localStorage.setItem("messages", f);
      $(".chat-body").append(C);
      $(".chat-body").animate({ scrollTop: 1000000 }, 300);
      document.getElementById("myAudio").play();
    }
  }
  function a() {
    if (document.all) {
      toast.error(l);
      return false;
    }
  }
  function v(A) {
    if (document.layers || (document.getElementById && !document.all)) {
      if (A.which == 2 || A.which == 3) {
        toast.error(l);
        return false;
      }
    }
  }
  function i() {
    chrome.storage.local.get(["navigationControl"], function (B) {
      if (B.navigationControl) {
        console.log("Key's Disabled");
        $(document).bind("cut copy paste", function (C) {
          C.preventDefault();
        });
        if (document.layers) {
          document.captureEvents(Event.MOUSEDOWN);
          document.onmousedown = v;
        } else {
          document.onmouseup = v;
          document.oncontextmenu = a;
        }
        document.oncontextmenu = new Function("return false");
        document.onkeydown = function (C) {
          return C.ctrlKey &&
            (C.keyCode === 67 ||
              C.keyCode === 86 ||
              C.keyCode === 85 ||
              C.keyCode === 117)
            ? false
            : true;
        };
        $(document).keypress("u", function (C) {
          return C.ctrlKey ? false : true;
        });
        const A = function () {
          var C = "keys disabled";
          navigator.clipboard.writeText(C);
        };
        $(window)
          .add($("iframe").contents().find("body"))
          .keyup(function (C) {
            if (C.keyCode == 44) {
              setTimeout(A(), 1000);
            }
          });
        document.body.addEventListener("keydown", function (C) {
          if (
            (C.ctrlKey || C.metaKey) &&
            "dcvxspwuazonkfg".indexOf(C.key) !== -1
          ) {
            C.preventDefault();
          }
        });
        setTimeout(function () {
          var E = $("iframe");
          var D = E.contents();
          var C = D.find("body").attr("oncontextmenu", "return false");
          $("iframe")
            .contents()
            .find("body")
            .on("keydown", function (F) {
              if (
                (F.ctrlKey || F.metaKey) &&
                "dcvxspwuaonkfg".indexOf(F.key) !== -1
              ) {
                F.preventDefault();
              }
            });
          $(window)
            .add($("iframe").contents().find("body"))
            .keyup(function (F) {
              if (F.keyCode == 44) {
                setTimeout(A(), 1000);
              }
            });
        }, 5000);
      } else {
        console.log("key's Enabled");
      }
    });
  }
  function k() {
    var A = $("#sendMessage");
    $("#hideChat").on("click", function () {
      $(".open-chat").show();
      $(".chat-block").hide();
    });
    $(".open-chat").on("click", function () {
      $(".open-chat").hide();
      $(".chat-block").show();
    });
    A.on("click", function () {
      let A = $("#chatMsg").val();
      if (A != null && $.trim(A) != "") {
        var B =
          '<div class="chat-msg text-right"><div class="send-arrow"></div><span class="send text-white inline-block">' +
          A +
          "</span></div>";
        f.push(B);
        localStorage.setItem("messages", f);
        $(".chat-body").append(B);
        $(".chat-body").animate({ scrollTop: 1000000 }, 300);
        $("#chatMsg").val("");
        proctoringSession.sendMessage(A);
      } else {
        $("#chatMsg").val("");
      }
    });
  }
  function j() {
    b1 = setInterval(function () {
      if (chrome && chrome.runtime) {
        // chrome.runtime.sendMessage({ action: o.TWOTABS });
        chrome.runtime.sendMessage({ type: "action", action: o.CHECKEXAMTABS });
      }
    }, 500);
    chrome.storage.local.get(["fullScreen"], function (A) {
      if (A.fullScreen) {
        console.log("Full Screen Mode On");
        b = setInterval(function () {
          if (!document.fullscreen) {
            chrome.runtime.sendMessage({
              type: "action",
              action: o.FULL_SCREEN,
            });
          }
        }, 500);
      } else {
        console.log("Full Screen Mode Off");
      }
    });
  }
  function z() {
    window.onblur = null;
    clearInterval(b);
    clearInterval(b1);
    chrome.storage.local.set({ exam: y.STOP });
    proctoringSession.stop();
    localStorage.removeItem("DWindow");
    localStorage.removeItem("startExam");
    sessionStorage.removeItem("proctor");
    chrome.runtime.sendMessage({ type: "action", action: o.STOP_PROCTORING });
    chrome.runtime.sendMessage({
      type: "action",
      action: o.DIAGONOSTIC_TAB_CLOSE,
    });
    // chrome.storage.local.set({ state: c.LOGOUT });
    localStorage.removeItem("messageStart");
    localStorage.removeItem("messages");
  }
  function submitQuizAttempt() {
    chrome.storage.local.get(["attemptData", "n"], function (A) {
      console.log("submitQuizAttempt attemptData- ", A);
      let userToken = localStorage.getItem("loginToken");
      let userRestURL = localStorage.getItem("loginltiUrl");
      if (A.attemptData) {
        let callData = {
          token: userToken,
          ltiurl: A.n.url,
          payloadData: {
            attemptid: A.attemptData.attemptid,
            email_id: A.attemptData.student_unique_id,
            quiz_id: A.attemptData.quiz_id,
          },
        };
        console.log(callData);
        apiService.saveQuizResult(callData).then(
          function (n) {
            console.log("submitQuizAttempt- 1- ", n);
          },
          function (n) {
            console.log("submitQuizAttempt- 2- ", n);
            toast.error(
              "Something went wrong. Please refresh and start the quiz again."
            );
          }
        );
      }
    });
  }
  function x() {
    $("#testNavigateAwayPopup").show();
    var B = JSON.parse(localStorage.getItem("i18Texts"));
    window.LanguageMap = B;
    for (var A in B) {
      window[A] = B[A];
    }
    var C = $("body").find("._i18");
    C.each(function () {
      var E = $(this);
      var D = E.attr("data-i18");
      E.html(window.LanguageMap[D]);
    });
    $("#closeNavigateAwayPopup").on("click", function () {
      d();
      e = false;
      $("#testNavigateAwayPopup").remove();
    });
  }
  function m() {
    console.log("takeQuizService - m()");
    return;
    chrome.storage.local.get(["lmsApp"], function (A) {
      switch (A.lmsApp) {
        case "moodle":
          $("#page-content").prepend(sharedTemplate.testNavigateAwayPopup());
          x();
          break;
        case "canvas":
          $("#content-wrapper").prepend(sharedTemplate.testNavigateAwayPopup());
          x();
          break;
        case "blackboard":
          $(".locationPane").prepend(sharedTemplate.testNavigateAwayPopup());
          x();
          break;
        case "d2l":
          $(".d2l-page-main").prepend(sharedTemplate.testNavigateAwayPopup());
          x();
          break;
        default:
          console.log("Invalid lms app");
      }
    });
  }
  function px(closable) {
    $("#RPaaSProctorErrorPopup" + pe).show();
    if (closable) {
      $(".errorpopup .continue-btn").on("click", function () {
        $(".errorpopup").remove();
        pe = "";
      });
      $("#closeProctorErrorPopup").click(function () {
        $(this).closest(".errorpopup").remove();
      });
    }
  }
  function pm(icon, heading, body, closable = false) {
    if (
      $("#RPaaSProctorErrorPopup" + icon).length > 0 ||
      $("#RPaaSProctorPausePopup").length > 0
    ) {
      return;
    }
    // return;
    chrome.storage.local.get(["lmsApp"], function (A) {
      switch (A.lmsApp) {
        case "moodle":
          $("#page-content").prepend(
            sharedTemplate.simpleWarning(icon, heading, body, closable)
          );
          px(closable);
          break;
        case "canvas":
          $("#content-wrapper").prepend(
            sharedTemplate.simpleWarning(icon, heading, body, closable)
          );
          px(closable);
          break;
        case "blackboard":
          $(".locationPane").prepend(
            sharedTemplate.simpleWarning(icon, heading, body, closable)
          );
          px(closable);
          break;
        case "d2l":
          $(".d2l-page-main").prepend(
            sharedTemplate.simpleWarning(icon, heading, body, closable)
          );
          px(closable);
          break;
        default:
          console.log("Invalid lms app");
      }
    });
  }
  function pauseQuiz(message) {
    if ($("#RPaaSProctorPausePopup").length > 0) {
      if (pp == "forcesubmit") {
        $("#RPaaSProctorPausePopup h2").text(message);
      }
      return;
    }
    chrome.storage.local.get(["lmsApp"], function (A) {
      switch (A.lmsApp) {
        case "moodle":
          $("#page-content").prepend(sharedTemplate.pauseQuiz(message));
          break;
        case "canvas":
          $("#content-wrapper").prepend(sharedTemplate.pauseQuiz(message));
          break;
        case "blackboard":
          $(".locationPane").prepend(sharedTemplate.pauseQuiz(message));
          break;
        case "d2l":
          $(".d2l-page-main").prepend(sharedTemplate.pauseQuiz(message));
          break;
        default:
          console.log("Invalid lms app");
      }
      $("#RPaaSProctorPausePopup").show();
    });
  }
  function w() {
    chrome.runtime.sendMessage({ type: "action", action: o.BLUR });
  }
  function h() {
    chrome.runtime.sendMessage({ type: "action", action: o.BLUR });
    if (e) {
      return;
    }
    console.log("Candidate blur out.");
    n = new Date().getTime();
    proctoringSession.candidateBlurOut();
    // e = true;
    m();
  }
  function p() {
    chrome.runtime.sendMessage({ type: "action", action: o.BLUR });
    if (e) {
      return;
    }
    console.log("Candidate blur out..");
    n = new Date().getTime();
    proctoringSession.candidateBlurOut();
    // e = true;
    m();
  }
  function d() {
    console.log("Candidate blur in.");
    var A = new Date().getTime();
    var B = A - n;
    proctoringSession.candidateBlurIn();
    if (B > t) {
      proctoringSession.logNavigateAwayEvent(B);
    }
  }
  function r() {
    window.onblur = null;
    setTimeout(function () {
      console.log("console.log(window.onblur)");
      window.onblur = h;
    }, 2500);
  }
  function closeCheckTimeout() {
    setTimeout(function () {
      checktimeout = false;
    }, 15000);
  }
  function closeCheckTimeoutroom() {
    setTimeout(function () {
      checktimeoutroom = false;
    }, 15000);
  }
  function closeCheckTimeoutnoise() {
    setTimeout(function () {
      checktimeoutnoise = false;
    }, 15000);
  }
  function closeTimeouton(ele, time) {
    let elem = ele;
    setTimeout(function () {
      $("#RPaaSProctorErrorPopup" + elem).remove();
    }, time);
  }
  function resetAudioBeepFor(x) {
    for (var i = 0; i < audioplayed.length; i++) {
      if (audioplayed[i] === x) {
        audioplayed.splice(i, 1);
      }
    }
  }
  function proctorStatusCheck(message) {
    // return;
    if (message.data == null) {
      if (chrome && chrome.runtime) {
        // chrome.runtime.sendMessage({ action: o.STOP_PROCTORING });
      }
      return;
    }
    if (typeof message.data == "string") {
      message.data = JSON.parse(message.data);
    }
    if (message.warning) {
      if (message.data.chatMsgStatus) {
        // pe = "chatMsgStatus";
        // pm(pe, "", "Message from Proctor. Switch Tab to Chat with Proctor.", true)
        // closeTimeouton(pe, 2000);
        if (!checktimeout) {
          toast.error("Message from Proctor. Switch Tab to Chat with Proctor.");
          checktimeout = true;
          closeCheckTimeout();
          if (!audioplayed.includes("chatMsgStatus")) {
            document.getElementById("RPaaSMessagebeep").play();
            audioplayed.push("chatMsgStatus");
          }
        }
      }
      if (message.data.roomscanMsgStatus) {
        // pe = "roomscanMsgStatus";
        // pm(pe, "", "Room Scan Initiated from Proctor. Switch Tab to  show around your test environment.", true)
        // closeTimeouton(pe, 2000);
        if (!checktimeoutroom) {
          toast.error(
            "Room Scan Initiated from Proctor. Switch Tab to  show around your test environment."
          );
          checktimeoutroom = true;
          closeCheckTimeoutroom();
          if (!audioplayed.includes("roomscanMsgStatus")) {
            document.getElementById("RPaaSMessagebeep").play();
            audioplayed.push("roomscanMsgStatus");
          }
        }
      }
      if (!message.data.internetstatus) {
        // toast.error("Please check your internet connection");
        // checktimeout = true;
        // closeCheckTimeout();
      }
      if (!message.data.facecheck) {
        // toast.error("Your face is not matching with registered candidate");
        // checktimeout = true;
        // closeCheckTimeout();
      }
      if (!message.data.noicedetect) {
        if (!checktimeoutnoise) {
          toast.error(
            "There is external noise detected in the test window. Kindly sit in a proper soundproof area to take test"
          );
          checktimeoutnoise = true;
          closeCheckTimeoutnoise();
          if (!audioplayed.includes("noicedetect")) {
            document.getElementById("RPaaSMessagebeep").play();
            audioplayed.push("noicedetect");
          }
        }
        // pm(pe, "External Noise Detected", "There is external noise detected in the test window. Kindly sit in a proper soundproof area to take test", message.data.pausestatus)
        // toast.error("Seems like you are talking to someone");
      }
      if (message.data.pausestatus) {
        pe = "pausestatus";
        pm(pe, "Exam Paused ", "Your exam is paused by Proctor.", false);
        if (!audioplayed.includes("pausestatus")) {
          document.getElementById("RPaaSMessagebeep").play();
          audioplayed.push("pausestatus");
        }
      } else if (!message.data.imgStatus) {
        pe = "imgStatus";
        pm(
          pe,
          "Exam Paused ",
          "Kindly Allow  Camera to Continue with  your Exam.",
          false
        );
        if (!audioplayed.includes("imgStatus")) {
          document.getElementById("RPaaSMessagebeep").play();
          audioplayed.push("imgStatus");
        }
      } else if (!message.data.mtoff) {
        pe = "mtoff";
        pm(
          pe,
          "Multiple Face Detected ",
          "Someone else is present with you right now. Please ask the other person(s) to go away and focus on your test or your test may be forcefully submitted.",
          false
        );
        if (!audioplayed.includes("mtoff")) {
          document.getElementById("RPaaSMessagebeep").play();
          audioplayed.push("mtoff");
        }
      } else if (!message.data.noface) {
        pe = "noface";
        pm(
          pe,
          "No front Face Detected",
          "Please sit straight with your hands on keyboard and make sure your face is clearly visible in the camera frame. If you think you are getting this warning incorrectly, try shifting to a place with plain background and ample lighting on your face.",
          false
        );
        if (!audioplayed.includes("noface")) {
          document.getElementById("RPaaSMessagebeep").play();
          audioplayed.push("noface");
        }
      }
    }
    if (!message.data.chatMsgStatus) {
      checktimeout = false;
      resetAudioBeepFor("chatMsgStatus");
    }
    if (!message.data.roomscanMsgStatus) {
      checktimeoutroom = false;
      resetAudioBeepFor("roomscanMsgStatus");
    }
    if (message.data.mtoff) {
      resetAudioBeepFor("mtoff");
      $("#RPaaSProctorErrorPopupmtoff").remove();
    }
    if (message.data.noface) {
      resetAudioBeepFor("noface");
      $("#RPaaSProctorErrorPopupnoface").remove();
    }
    if (message.data.noicedetect) {
      checktimeoutnoise = false;
      resetAudioBeepFor("noicedetect");
      $("#RPaaSProctorErrorPopupnoicedetect").remove();
    }
    if (!message.data.pausestatus) {
      resetAudioBeepFor("pausestatus");
      $("#RPaaSProctorErrorPopuppausestatus").remove();
    }
    if (message.data.imgStatus) {
      resetAudioBeepFor("imgStatus");
      $("#RPaaSProctorErrorPopupimgStatus").remove();
    }
    // if(message.data.screenSharing){
    //     resetAudioBeepFor("imgStatus");
    //     $("#RPaaSProctorErrorPopupscreenSharing").remove();
    // }
    // if(!message.data.screenSharing){
    //     pe = "screenSharing";
    //     pm(pe, "Exam Paused ", "Kindly Enable Screen Sharing to Continue with  your Exam.", false)
    //     if(!audioplayed.includes("screenSharing")){
    //         document.getElementById("RPaaSMessagebeep").play();
    //         audioplayed.push("screenSharing");
    //     }
    // }
    if (message.data.forcesubmit || !message.data.screenSharing) {
      pe = "forcesubmit";
      if (!message.data.screenSharing) {
        pm(
          pe,
          "Test Terminated",
          "Your test has been terminated because your screensharing is stoped",
          message.data.pausestatus
        );
      } else {
        pm(
          pe,
          "Test Terminated",
          "Your test has been terminated remotely by proctor",
          message.data.pausestatus
        );
      }
      // pp = "forcesubmit";
      // console.log("forcesubmit");
      // toast.error("Your Quiz is Terminated by Proctor");
      // pauseQuiz("Your Quiz is Terminated by Proctor");
      let submitQuizform = $("form[action*='processattempt.php']");
      let submitBtn =
        "<input type='submit' id='forcesubmitBtn' class='btn btn-info text-white' style='display:none;' value='Submit all and Finish'><input type='hidden' name='finishattempt' value='1'></input>";
      submitQuizform.prepend(submitBtn);
      setTimeout(() => {
        submitQuizAttempt();
        z();
        submitQuizform.submit();
        console.log("submitted");
      }, 500);
    }
    /* if(message.data.pausestatus){
            pp = "pausestatus";
            pauseQuiz("Your exam is paused by Proctor");
        } else if(!message.data.pausestatus){
            if(pp == "pausestatus"){
                $("#RPaaSProctorPausePopup").remove();
            }
        } */
  }
  function proctorBackgroundCheck() {
    chrome.storage.local.get(function (local) {
      if (local.exam == "start" && local.navigationControl) {
        if (local.lostfocusallowed == undefined) {
          chrome.storage.local.set({ lostfocusallowed: 10 });
          local.lostfocusallowed = 10;
        }
        console.log("local.lostfocusallowed:- ", local.lostfocusallowed);
        console.log("local.lostfocuscounter:- ", local.lostfocuscounter);

        if (local.lostfocus > 0) {
          if (local.lostfocus != local.lostfocuscounter) {
            let remainslostfocus = local.lostfocusallowed - local.lostfocus;
            console.log("remainslostfocus:- ", remainslostfocus);
            MP.sendPostMessage({
              type: "lostfocuscounter",
              lostfocus: local.lostfocus,
              lostfocusallowed: local.lostfocusallowed,
            });
            if (remainslostfocus >= 0) {
              pe = "lostfocus";
              let alertmsg =
                "You have navigated away from exam " +
                local.lostfocus +
                " times, Your Exam will be submitted after " +
                local.lostfocusallowed +
                " times.";
              pm(pe, "Navigated away from Exam", alertmsg, true);
              console.log("Display alertmsg: ", alertmsg);
              document.getElementById("RPaaSMessagebeep").play();
              chrome.storage.local.set({ lostfocuscounter: local.lostfocus });
              document.getElementById("RPaaSMessagebeep").play();
            } else {
              document.getElementById("RPaaSMessagebeep").play();
              console.log("Submitting Quiz");
              let submitQuizform = $("form[action*='processattempt.php']");
              let submitBtn =
                "<input type='submit' id='forcesubmitBtn' class='btn btn-info text-white' style='display:none;' value='Submit all and Finish'><input type='hidden' name='finishattempt' value='1'></input>";
              submitQuizform.prepend(submitBtn);
              setTimeout(() => {
                submitQuizAttempt();
                z();
                submitQuizform.submit();
                console.log("submitted");
              }, 500);
            }
          }
        }
      }
    });
  }
  return {
    getStoredMessages: s,
    startProctor: u,
    getProctorMessages: g,
    disableKeys: i,
    allClickEvents: k,
    stopProctoring: z,
    submitQuizAttempt: submitQuizAttempt,
    fullScreenCheck: j,
    unbindblur: r,
    proctorStatusCheck: proctorStatusCheck,
    proctorBackgroundCheck: proctorBackgroundCheck,
  };
})();
var toast = new (function () {
  function a(c) {
    return $.toast({
      heading: c,
      icon: "success",
      showHideTransition: "slide",
      allowToastClose: true,
      hideAfter: 10000,
      position: "top-center",
      textAlign: "left",
    });
  }
  function b(c) {
    return $.toast({
      heading: c,
      icon: "error",
      showHideTransition: "slide",
      allowToastClose: true,
      hideAfter: 10000,
      position: "top-center",
      textAlign: "left",
    });
  }
  return { success: a, error: b };
})();
