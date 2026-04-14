window.HELP_IMPROVE_VIDEOJS = false;

function setInterpolationLabel(value) {
  var wrapper = document.getElementById("interpolation-image-wrapper");
  if (!wrapper) {
    return;
  }

  wrapper.innerHTML =
    '<div class="interpolation-placeholder">Interactive Comparison Placeholder<br>Step ' +
    value +
    "</div>";
}

function initializeVideoCategoryTabs() {
  var tabs = Array.prototype.slice.call(
    document.querySelectorAll(".video-category-tab")
  );
  var panels = Array.prototype.slice.call(
    document.querySelectorAll(".video-category-panel")
  );

  if (!tabs.length || !panels.length) {
    return;
  }

  function activateTab(targetId, options) {
    var shouldFocus = options && options.focus === true;
    var activeTab = null;

    tabs.forEach(function(tab, index) {
      var isActive = tab.getAttribute("data-video-target") === targetId;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
      tab.setAttribute("tabindex", isActive ? "0" : "-1");

      if (!tab.id) {
        tab.id = "video-tab-" + String(index + 1).padStart(2, "0");
      }

      if (isActive) {
        activeTab = tab;
      }
    });

    panels.forEach(function(panel) {
      var isActive = panel.id === targetId;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;

      if (isActive && activeTab) {
        panel.setAttribute("aria-labelledby", activeTab.id);
      }
    });

    if (activeTab && shouldFocus) {
      activeTab.focus();
    }
  }

  tabs.forEach(function(tab, index) {
    var targetId = tab.getAttribute("data-video-target");
    var panel = document.getElementById(targetId);

    if (!targetId || !panel) {
      return;
    }

    if (!tab.id) {
      tab.id = "video-tab-" + String(index + 1).padStart(2, "0");
    }

    tab.addEventListener("click", function() {
      activateTab(targetId);
    });

    tab.addEventListener("keydown", function(event) {
      var currentIndex = tabs.indexOf(tab);
      var nextIndex = currentIndex;

      if (event.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % tabs.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = tabs.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      activateTab(
        tabs[nextIndex].getAttribute("data-video-target"),
        { focus: true }
      );
    });
  });

  var defaultTab =
    document.querySelector('.video-category-tab.is-active[data-video-target]') ||
    tabs[0];

  activateTab(defaultTab.getAttribute("data-video-target"));
}

$(document).ready(function() {
  $(".navbar-burger").click(function() {
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });

  initializeVideoCategoryTabs();

  if (typeof bulmaCarousel !== "undefined") {
    bulmaCarousel.attach(".carousel", {
      slidesToScroll: 1,
      slidesToShow: 3,
      loop: true,
      infinite: true,
      autoplay: false
    });
  }

  if (typeof bulmaSlider !== "undefined") {
    bulmaSlider.attach();
  }

  $("#interpolation-slider").on("input", function() {
    setInterpolationLabel(this.value);
  });

  setInterpolationLabel(0);
});
