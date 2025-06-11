(function (a) {
  a.fn.simplePagination = function (b) {
    var d = {
      perPage: 5,
      containerClass: "",
      previousButtonClass: "",
      nextButtonClass: "",
      previousButtonText: "<<",
      nextButtonText: ">>",
      currentPage: 1,
    };
    var c = a.extend({}, d, b);
    return this.each(function () {
      var g = a("tbody tr", this);
      var e = Math.ceil(g.length / c.perPage);
      var f = document.createElement("div");
      var h = document.createElement("button");
      var i = document.createElement("button");
      var j = document.createElement("span");
      h.innerHTML = c.previousButtonText;
      i.innerHTML = c.nextButtonText;
      f.className = c.containerClass;
      h.className = c.previousButtonClass;
      i.className = c.nextButtonClass;
      h.style.marginRight = "8px";
      i.style.marginLeft = "8px";
      f.style.textAlign = "center";
      f.style.marginBottom = "20px";
      f.appendChild(h);
      f.appendChild(j);
      f.appendChild(i);
      a(this).after(f);
      k();
      a(i).click(function () {
        if (c.currentPage + 1 > e) {
          c.currentPage = e;
        } else {
          c.currentPage++;
        }
        k();
      });
      a(h).click(function () {
        if (c.currentPage - 1 < 1) {
          c.currentPage = 1;
        } else {
          c.currentPage--;
        }
        k();
      });
      function k() {
        var m = (c.currentPage - 1) * c.perPage + 1;
        var l = m + c.perPage - 1;
        if (l > g.length) {
          l = g.length;
        }
        g.hide();
        g.slice(m - 1, l).show();
        j.innerHTML = m + " to " + l + " of " + g.length + " entries";
        if (g.length <= c.perPage) {
          a(f).hide();
        } else {
          a(f).show();
        }
      }
    });
  };
})(jQuery);
