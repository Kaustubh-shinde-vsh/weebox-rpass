$(document).ready(function () {
  console.log("aaaaaaaaaaaaaaaaaaaa");
  if (
    $(".tool_content_wrapper")
      .find("#tool_form")
      .attr("action")
      .includes("moodleverify.obj")
  ) {
    $("#tool_content").hide();
    $("#content").prepend(canvasTemplate.pluginFound());
  } else {
    $("#tool_content").show();
  }
});
