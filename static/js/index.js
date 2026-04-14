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

  function buildVideoUrl(baseUrl, options) {
    var url = new URL(baseUrl);

    url.searchParams.set("rel", "0");
    url.searchParams.set("playsinline", "1");

    if (options && options.autoplay) {
      url.searchParams.set("autoplay", "1");
      url.searchParams.set("mute", "1");
    } else {
      url.searchParams.delete("autoplay");
      url.searchParams.delete("mute");
    }

    return url.toString();
  }

  function updatePanelPlayback(panel, options) {
    var shouldAutoplay = options && options.autoplay === true;
    var iframes = Array.prototype.slice.call(panel.querySelectorAll("iframe"));

    iframes.forEach(function(iframe) {
      var baseSrc = iframe.getAttribute("data-base-src") || iframe.src;
      iframe.setAttribute("data-base-src", baseSrc);

      var nextSrc = buildVideoUrl(baseSrc, { autoplay: shouldAutoplay });
      if (iframe.src !== nextSrc) {
        iframe.src = nextSrc;
      }
    });
  }

  function activateTab(targetId, options) {
    var shouldFocus = options && options.focus === true;
    var shouldAutoplay = options && options.autoplay === true;
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
      updatePanelPlayback(panel, { autoplay: isActive && shouldAutoplay });

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
      activateTab(targetId, { autoplay: true });
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
        { focus: true, autoplay: true }
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
