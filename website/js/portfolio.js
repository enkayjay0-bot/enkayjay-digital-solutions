/* Portfolio galleries and accessible screenshot lightbox — no dependencies */
(function () {
  "use strict";

  var dialog = document.getElementById("portfolio-lightbox");
  var galleryElements = document.querySelectorAll("[data-gallery]");
  if (!galleryElements.length) return;

  var lightboxImage = document.getElementById("lightbox-image");
  var lightboxTitle = document.getElementById("lightbox-title");
  var lightboxCaption = document.getElementById("lightbox-caption");
  var lightboxCounter = document.getElementById("lightbox-counter");
  var lightboxStage = document.querySelector("[data-lightbox-stage]");
  var closeButton = document.querySelector("[data-lightbox-close]");
  var previousButton = document.querySelector("[data-lightbox-prev]");
  var nextButton = document.querySelector("[data-lightbox-next]");
  var activeGallery = null;
  var lastFocused = null;
  var touchStartX = 0;
  var touchStartY = 0;

  function twoDigits(value) {
    return ("0" + value).slice(-2);
  }

  function counterText(index, total) {
    return twoDigits(index + 1) + " / " + twoDigits(total);
  }

  function supportsDialog() {
    return dialog && typeof dialog.showModal === "function";
  }

  function updateLightbox() {
    if (!activeGallery || !lightboxImage) return;

    var link = activeGallery.links[activeGallery.currentIndex];
    var caption = link.getAttribute("data-caption");
    lightboxImage.setAttribute("src", link.getAttribute("data-full"));
    lightboxImage.setAttribute("alt", link.getAttribute("data-alt"));
    lightboxImage.setAttribute("width", link.getAttribute("data-width"));
    lightboxImage.setAttribute("height", link.getAttribute("data-height"));
    lightboxTitle.textContent = activeGallery.name;
    lightboxCaption.textContent = caption;
    lightboxCounter.textContent = counterText(activeGallery.currentIndex, activeGallery.links.length);
  }

  function selectScreenshot(gallery, requestedIndex, keepLightboxSynced) {
    var total = gallery.links.length;
    var index = (requestedIndex + total) % total;
    var link = gallery.links[index];
    var stage = gallery.element.querySelector(".gallery-stage");
    var frame = gallery.element.querySelector("[data-gallery-frame]");
    var image = gallery.element.querySelector("[data-gallery-image]");
    var openLink = gallery.element.querySelector("[data-gallery-open]");
    var caption = gallery.element.querySelector("[data-gallery-caption]");
    var counter = gallery.element.querySelector("[data-gallery-counter]");
    var orientation = link.getAttribute("data-orientation");
    var captionText = link.getAttribute("data-caption");

    gallery.currentIndex = index;
    gallery.changeToken += 1;
    var changeToken = gallery.changeToken;

    gallery.links.forEach(function (item, itemIndex) {
      var isActive = itemIndex === index;
      item.classList.toggle("is-active", isActive);
      if (isActive) item.setAttribute("aria-current", "true");
      else item.removeAttribute("aria-current");
    });

    if (keepLightboxSynced && activeGallery === gallery && dialog && dialog.open) {
      updateLightbox();
    }

    stage.classList.add("is-switching");

    function applySelection() {
      if (gallery.changeToken !== changeToken) return;

      image.setAttribute("src", link.getAttribute("data-full"));
      image.setAttribute("alt", link.getAttribute("data-alt"));
      image.setAttribute("width", link.getAttribute("data-width"));
      image.setAttribute("height", link.getAttribute("data-height"));
      openLink.setAttribute("href", link.getAttribute("data-full"));
      openLink.setAttribute("aria-label", "Enlarge " + gallery.name + " screenshot: " + captionText);
      caption.textContent = captionText;
      counter.textContent = counterText(index, total);
      gallery.element.setAttribute("data-active-orientation", orientation);
      frame.classList.toggle("is-desktop", orientation === "desktop");
      frame.classList.toggle("is-mobile", orientation === "mobile");

      window.requestAnimationFrame(function () {
        stage.classList.remove("is-switching");
      });
    }

    var preloader = new Image();
    preloader.onload = applySelection;
    preloader.onerror = function () {
      if (gallery.changeToken === changeToken) stage.classList.remove("is-switching");
    };
    preloader.src = link.getAttribute("data-full");
  }

  function openLightbox(gallery) {
    if (!supportsDialog()) return;

    activeGallery = gallery;
    updateLightbox();

    if (dialog.open) return;
    lastFocused = document.activeElement;
    dialog.showModal();
    document.body.classList.add("lightbox-open");
    if (closeButton) closeButton.focus();
  }

  function navigateLightbox(direction) {
    if (!activeGallery || !dialog || !dialog.open) return;
    selectScreenshot(activeGallery, activeGallery.currentIndex + direction, true);
  }

  galleryElements.forEach(function (element) {
    var gallery = {
      element: element,
      name: element.getAttribute("data-project-name") || "Project",
      links: Array.prototype.slice.call(element.querySelectorAll("[data-gallery-thumb]")),
      currentIndex: 0,
      changeToken: 0
    };

    if (!gallery.links.length) return;

    gallery.links.forEach(function (link, index) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        selectScreenshot(gallery, index, false);
      });
    });

    var openLink = element.querySelector("[data-gallery-open]");
    if (openLink) {
      openLink.addEventListener("click", function (event) {
        if (!supportsDialog()) return;
        event.preventDefault();
        openLightbox(gallery);
      });
    }
  });

  if (closeButton) {
    closeButton.addEventListener("click", function () {
      if (dialog && dialog.open) dialog.close();
    });
  }

  if (previousButton) {
    previousButton.addEventListener("click", function () {
      navigateLightbox(-1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", function () {
      navigateLightbox(1);
    });
  }

  if (dialog) {
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });

    dialog.addEventListener("close", function () {
      document.body.classList.remove("lightbox-open");
      activeGallery = null;
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    });

    document.addEventListener("keydown", function (event) {
      if (!dialog.open) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        navigateLightbox(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        navigateLightbox(1);
      }
    });
  }

  if (lightboxStage) {
    lightboxStage.addEventListener("touchstart", function (event) {
      if (event.touches.length !== 1) return;
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    }, { passive: true });

    lightboxStage.addEventListener("touchend", function (event) {
      if (!event.changedTouches.length) return;
      var deltaX = event.changedTouches[0].clientX - touchStartX;
      var deltaY = event.changedTouches[0].clientY - touchStartY;
      if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
        navigateLightbox(deltaX > 0 ? -1 : 1);
      }
    }, { passive: true });
  }
})();
