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

$(document).ready(function() {
  $(".navbar-burger").click(function() {
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });

  $(".video-category-tab").on("click", function() {
    var targetId = $(this).data("video-target");

    $(".video-category-tab")
      .removeClass("is-active")
      .attr("aria-selected", "false");
    $(this)
      .addClass("is-active")
      .attr("aria-selected", "true");

    $(".video-category-panel")
      .removeClass("is-active")
      .attr("hidden", true);
    $("#" + targetId)
      .addClass("is-active")
      .removeAttr("hidden");
  });

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
