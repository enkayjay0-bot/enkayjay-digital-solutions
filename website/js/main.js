/* Enkayjay Digital Solutions — interaction and enquiry preparation */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -----------------------------------------------------------------------
     Mobile navigation
     ----------------------------------------------------------------------- */
  var navToggle = doc.querySelector(".nav-toggle");
  var mobileMenu = doc.getElementById("mobile-menu");
  var header = doc.querySelector(".site-header");

  function setMenu(open, returnFocus) {
    if (!navToggle || !mobileMenu) return;

    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    navToggle.classList.toggle("is-open", open);
    mobileMenu.hidden = !open;
    doc.body.classList.toggle("menu-open", open);

    if (!open && returnFocus) navToggle.focus();
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", function () {
      setMenu(navToggle.getAttribute("aria-expanded") !== "true", false);
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false, false);
      });
    });

    doc.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
        setMenu(false, true);
      }
    });

    doc.addEventListener("click", function (event) {
      if (
        navToggle.getAttribute("aria-expanded") === "true" &&
        header &&
        !header.contains(event.target)
      ) {
        setMenu(false, false);
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 960 && navToggle.getAttribute("aria-expanded") === "true") {
        setMenu(false, false);
      }
    });
  }

  /* -----------------------------------------------------------------------
     Reveal effects — progressive enhancement only
     ----------------------------------------------------------------------- */
  var revealItems = Array.prototype.slice.call(doc.querySelectorAll("[data-reveal]"));

  if (!reducedMotion && "IntersectionObserver" in window && revealItems.length) {
    root.classList.add("reveal-ready");
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  /* Current section indicator for the desktop navigation */
  if ("IntersectionObserver" in window) {
    var navLinks = Array.prototype.slice.call(doc.querySelectorAll('.site-nav a[href^="#"]'));
    var observedSections = navLinks
      .map(function (link) {
        return doc.querySelector(link.getAttribute("href"));
      })
      .filter(Boolean);

    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            var isCurrent = link.getAttribute("href") === "#" + entry.target.id;
            if (isCurrent) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 }
    );

    observedSections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* -----------------------------------------------------------------------
     Confirmed contact configuration
     ----------------------------------------------------------------------- */
  var config = window.ENKAYJAY_CONFIG || {};
  var rawWhatsappNumber = String(config.whatsappNumber || "").trim();
  var whatsappNumber = rawWhatsappNumber.replace(/\D/g, "");
  var whatsappDisplay = String(config.whatsappDisplay || "").trim();
  var emailAddress = String(config.email || "").trim();
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var placeholderMarkers = ["PLACEHOLDER", "233000000000"];

  /* Preserve the original project's explicit placeholder safeguard. */
  function isPlaceholder(value) {
    var text = String(value || "").trim();
    if (!text) return true;
    return placeholderMarkers.some(function (marker) {
      return text.toUpperCase().indexOf(marker) !== -1;
    });
  }

  var hasWhatsapp = !isPlaceholder(rawWhatsappNumber) && /^[1-9]\d{7,14}$/.test(whatsappNumber);
  var hasEmail = !isPlaceholder(emailAddress) && emailPattern.test(emailAddress);
  var genericMessage = "Hello Enkayjay Digital Solutions, I would like to discuss a project. Please let me know the next steps.";

  function setAnchorState(anchor, href, openInNewTab) {
    if (!anchor) return;

    if (href) {
      anchor.setAttribute("href", href);
      anchor.classList.remove("is-disabled");
      anchor.removeAttribute("aria-disabled");
      anchor.removeAttribute("tabindex");
      if (openInNewTab) {
        anchor.setAttribute("target", "_blank");
        anchor.setAttribute("rel", "noopener noreferrer");
      } else {
        anchor.removeAttribute("target");
        anchor.removeAttribute("rel");
      }
    } else {
      anchor.removeAttribute("href");
      anchor.classList.add("is-disabled");
      anchor.setAttribute("aria-disabled", "true");
      anchor.setAttribute("tabindex", "-1");
      anchor.removeAttribute("target");
      anchor.removeAttribute("rel");
    }
  }

  doc.querySelectorAll("a.is-disabled").forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      if (anchor.getAttribute("aria-disabled") === "true") event.preventDefault();
    });
  });

  function whatsappUrl(message) {
    return "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(message);
  }

  function emailUrl(subject, message) {
    return (
      "mailto:" +
      emailAddress +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(message)
    );
  }

  var directWhatsapp = doc.getElementById("whatsapp-enquiry");
  var directEmail = doc.getElementById("email-enquiry");
  var whatsappNumberText = doc.getElementById("whatsapp-number");
  var emailAddressText = doc.getElementById("email-address");
  var setupNote = doc.getElementById("contact-setup-note");

  setAnchorState(
    directWhatsapp,
    hasWhatsapp ? whatsappUrl(genericMessage) : "",
    hasWhatsapp
  );
  setAnchorState(
    directEmail,
    hasEmail ? emailUrl("Project enquiry", genericMessage) : "",
    false
  );

  if (hasWhatsapp && whatsappNumberText) {
    whatsappNumberText.textContent = !isPlaceholder(whatsappDisplay) ? whatsappDisplay : "+" + whatsappNumber;
    whatsappNumberText.classList.remove("placeholder-text");
  }

  if (hasEmail && emailAddressText) {
    emailAddressText.textContent = emailAddress;
    emailAddressText.classList.remove("placeholder-text");
  }

  if (setupNote) {
    if (hasWhatsapp && hasEmail) {
      setupNote.hidden = true;
    } else {
      var missing = [];
      if (!hasWhatsapp) missing.push("WhatsApp number");
      if (!hasEmail) missing.push("email address");
      setupNote.textContent =
        "Setup required: add the confirmed " +
        missing.join(" and ") +
        " in js/config.js to activate every direct contact option. Copy enquiry remains available.";
      setupNote.hidden = false;
    }
  }

  /* -----------------------------------------------------------------------
     Project enquiry — validation and user-controlled handoff
     ----------------------------------------------------------------------- */
  var form = doc.getElementById("enquiry-form");
  var formSuccess = doc.getElementById("form-success");
  var successSummary = doc.getElementById("form-success-summary");
  var successWarning = doc.getElementById("form-success-warning");
  var openWhatsapp = doc.getElementById("open-whatsapp");
  var openEmail = doc.getElementById("open-email");
  var copyEnquiry = doc.getElementById("copy-enquiry");
  var preparedEnquiry = "";
  var hasAttemptedSubmit = false;
  var toastTimer;

  function field(id) {
    return doc.getElementById(id);
  }

  function showToast(message) {
    var toast = doc.getElementById("toast");
    if (!toast) return;

    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = window.setTimeout(function () {
      toast.hidden = true;
    }, 4500);
  }

  function setError(input, errorId, message) {
    var error = doc.getElementById(errorId);
    if (error) error.textContent = message;
    if (input) {
      if (message) input.setAttribute("aria-invalid", "true");
      else input.removeAttribute("aria-invalid");
    }
  }

  function clearPreparedEnquiry() {
    preparedEnquiry = "";
    if (formSuccess) formSuccess.hidden = true;
    setAnchorState(openWhatsapp, "", false);
    setAnchorState(openEmail, "", false);
  }

  function validateForm() {
    if (!form) return false;

    var name = field("name");
    var projectType = field("project-type");
    var email = field("email");
    var phone = field("phone");
    var message = field("message");
    var nameValue = name.value.trim();
    var emailValue = email.value.trim();
    var phoneValue = phone.value.trim();
    var messageValue = message.value.trim();
    var phoneDigits = phoneValue.replace(/\D/g, "");

    form.querySelectorAll(".field-error").forEach(function (error) {
      error.textContent = "";
    });
    form.querySelectorAll("[aria-invalid]").forEach(function (input) {
      input.removeAttribute("aria-invalid");
    });

    if (nameValue.length < 2) {
      setError(name, "name-error", "Please enter your name (at least 2 characters).");
    }

    if (!projectType.value) {
      setError(projectType, "project-type-error", "Please select the service you are interested in.");
    }

    if (emailValue && !emailPattern.test(emailValue)) {
      setError(email, "email-error", "Enter a valid email address, such as name@business.com.");
    }

    if (
      phoneValue &&
      (!/^[+()\d\s.-]+$/.test(phoneValue) || phoneDigits.length < 7 || phoneDigits.length > 15)
    ) {
      setError(phone, "phone-error", "Enter a valid phone or WhatsApp number (7–15 digits).");
    }

    if (!emailValue && !phoneValue) {
      setError(email, "contact-error", "Add your email or WhatsApp / phone number so we can reply.");
      email.setAttribute("aria-invalid", "true");
      phone.setAttribute("aria-invalid", "true");
    }

    if (messageValue.length < 20) {
      setError(message, "message-error", "Please add at least 20 characters about your project.");
    }

    return !form.querySelector('[aria-invalid="true"]');
  }

  function buildEnquiry() {
    var lines = [
      "Hello Enkayjay Digital Solutions,",
      "",
      "I would like to make a project enquiry.",
      "",
      "Name: " + field("name").value.trim(),
      "Business: " + (field("business").value.trim() || "Not provided"),
      "Service: " + field("project-type").value,
      "Email: " + (field("email").value.trim() || "Not provided"),
      "WhatsApp / phone: " + (field("phone").value.trim() || "Not provided"),
      "Preferred start: " + (field("timeline").value || "Not specified"),
      "",
      "Project details:",
      field("message").value.trim(),
      "",
      "Please let me know the next steps."
    ];

    return lines.join("\n");
  }

  function updatePreparedLinks() {
    var projectType = field("project-type").value;
    setAnchorState(
      openWhatsapp,
      hasWhatsapp ? whatsappUrl(preparedEnquiry) : "",
      hasWhatsapp
    );
    setAnchorState(
      openEmail,
      hasEmail ? emailUrl(
        "Project enquiry — " + projectType + " — " + field("name").value.trim(),
        preparedEnquiry
      ) : "",
      false
    );

    if (successWarning) {
      var unavailable = [];
      if (!hasWhatsapp) unavailable.push("WhatsApp");
      if (!hasEmail) unavailable.push("email");

      if (unavailable.length) {
        successWarning.textContent =
          unavailable.join(" and ") +
          " sending is not configured yet. Use Copy enquiry now; the other option" +
          (unavailable.length > 1 ? "s" : "") +
          " will activate after confirmed contact details are added.";
        successWarning.hidden = false;
      } else {
        successWarning.hidden = true;
        successWarning.textContent = "";
      }
    }
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      hasAttemptedSubmit = true;

      if (!validateForm()) {
        clearPreparedEnquiry();
        var firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        showToast("Please check the highlighted fields. Your enquiry has not been sent.");
        return;
      }

      preparedEnquiry = buildEnquiry();
      updatePreparedLinks();

      if (successSummary) {
        successSummary.textContent =
          "Thank you, " +
          field("name").value.trim() +
          ". Your " +
          field("project-type").value.toLowerCase() +
          " enquiry has been prepared for you to review and send.";
      }

      if (formSuccess) {
        formSuccess.hidden = false;
        formSuccess.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest" });
        var readyTitle = doc.getElementById("enquiry-ready-title");
        if (readyTitle) readyTitle.focus({ preventScroll: true });
      }
    });

    function handleFormEdit() {
      if (preparedEnquiry) clearPreparedEnquiry();
      if (hasAttemptedSubmit) validateForm();
    }

    form.addEventListener("input", handleFormEdit);
    form.addEventListener("change", handleFormEdit);
  }

  function fallbackCopy(text) {
    var temporary = doc.createElement("textarea");
    temporary.value = text;
    temporary.setAttribute("readonly", "");
    temporary.style.position = "fixed";
    temporary.style.left = "-9999px";
    temporary.style.opacity = "0";
    doc.body.appendChild(temporary);
    temporary.select();
    temporary.setSelectionRange(0, temporary.value.length);

    var copied = false;
    try {
      copied = doc.execCommand("copy");
    } catch (error) {
      copied = false;
    }

    doc.body.removeChild(temporary);
    return copied;
  }

  if (copyEnquiry) {
    copyEnquiry.addEventListener("click", function () {
      if (!preparedEnquiry) {
        showToast("Prepare your enquiry first. Nothing has been sent.");
        return;
      }

      var copyPromise;
      if (navigator.clipboard && window.isSecureContext) {
        copyPromise = navigator.clipboard.writeText(preparedEnquiry).then(function () {
          return true;
        }).catch(function () {
          return fallbackCopy(preparedEnquiry);
        });
      } else {
        copyPromise = Promise.resolve(fallbackCopy(preparedEnquiry));
      }

      copyPromise.then(function (copied) {
        if (copied) {
          var originalText = copyEnquiry.textContent;
          copyEnquiry.textContent = "Copied ✓";
          showToast("Enquiry copied. Paste it into WhatsApp or email and send it yourself.");
          window.setTimeout(function () {
            copyEnquiry.textContent = originalText;
          }, 2200);
        } else {
          showToast("Clipboard access was unavailable. Please try a send option or copy again.");
        }
      });
    });
  }

  /* Preselect the relevant service when a visitor uses a service CTA. */
  doc.querySelectorAll("[data-service]").forEach(function (link) {
    link.addEventListener("click", function () {
      var projectType = field("project-type");
      if (!projectType) return;
      projectType.value = link.getAttribute("data-service") || "";
      if (hasAttemptedSubmit) validateForm();
      if (preparedEnquiry) clearPreparedEnquiry();
    });
  });

  var currentYear = doc.getElementById("current-year");
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());
})();
