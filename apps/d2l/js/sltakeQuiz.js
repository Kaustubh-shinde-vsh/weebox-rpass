var d2lSquenceTestView = new (function () {
  function c() {
    let d2lHeader = document
      .querySelector("d2l-sequence-viewer")
      .shadowRoot.querySelector("d2l-sequence-viewer-header");
    $(d2lHeader).hide();
    $("body").append(sharedTemplate.chatView());
    $(".hide-chatwindow").css("width", "60px");
    takeQuizService.getStoredMessages();
    takeQuizService.startProctor();
    takeQuizService.getProctorMessages();
    takeQuizService.disableKeys();
    takeQuizService.fullScreenCheck();
    takeQuizService.allClickEvents();
    a();
  }
  function b() {
    chrome.storage.local.get(["state"], function (e) {
      var d = mpaasConstants.loginState;
      setTimeout(function () {
        var f = document
          .querySelector("d2l-sequence-viewer")
          .shadowRoot.querySelector("#view-container")
          .querySelector("#viewframe")
          .querySelector("d2l-sequences-content-router")
          .shadowRoot.querySelector("d2l-sequences-content-link")
          .shadowRoot.querySelector(".d2l-sequences-scroll-container")
          .querySelector("iframe");
        if ($(f).contents().find("body").find(".dlay_l").length == 1) {
          toast.error("Incorrect password");
        } else {
          if (e.state === d.STUDENT_LOGIN_SUCCESS) {
            let ProctorActive = sessionStorage.getItem("proctor");
            if (ProctorActive === "Active") {
              chrome.storage.local.get(function (h) {
                if (h.fullScreen == false && h.navigationControl == true) {
                  var g = mpaasConstants.chromeSendMessage;
                  setInterval(function () {
                    chrome.runtime.sendMessage({
                      type: "action",
                      action: g.NC,
                    });
                  }, 500);
                }
              });
              c();
            }
          }
        }
      }, 3500);
    });
  }
  function a() {
    setInterval(function () {
      var e = document
        .querySelector("d2l-sequence-viewer")
        .shadowRoot.querySelector("#view-container")
        .querySelector("#viewframe")
        .querySelector("d2l-sequences-content-router")
        .shadowRoot.querySelector("d2l-sequences-content-link")
        .shadowRoot.querySelector(".d2l-sequences-scroll-container")
        .querySelector("iframe");
      if (
        !$(e)
          .contents()
          .find("body")
          .find("iframe")
          .contents()
          .find("body")
          .find("form")
          .attr("action")
          .includes("quiz_submissions.d2l")
      ) {
        return;
      }
      if (
        $(e)
          .contents()
          .find("body")
          .find("iframe")
          .contents()
          .find("body")
          .find("form")
          .attr("action")
          .includes("quiz_submissions.d2l")
      ) {
        let ProctorActive = sessionStorage.getItem("proctor");
        if (ProctorActive === "Active") {
          var d = mpaasConstants.lmsType;
          chrome.storage.local.set({ lmsApp: d.D2L });
          window.onblur = null;
          chrome.storage.local.set({ state: loginState.LOGOUT });
          $("#testNavigateAwayPopup").remove();
          sessionStorage.clear();
          setInterval(function () {
            // takeQuizService.submitQuizAttempt();
            // console.log("submitQuizAttempt3- ");
            chrome.runtime.sendMessage({
              type: "action",
              action: chromeMessage.STOP_PROCTORING,
            });
          }, 500);
          setTimeout(function () {
            takeQuizService.d2lstopProctoring();
          }, 1500);
        }
      }
    }, 1000);
  }
  return { d2lSquenceView: b };
})();
