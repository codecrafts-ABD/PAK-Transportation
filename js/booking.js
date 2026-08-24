(function () {
  const lanes = (window.PAK_TRANSPORTATION && window.PAK_TRANSPORTATION.lanes) || [];

  function setButtonState(button, isLoading) {
    if (!button) {
      return;
    }

    button.disabled = isLoading;
    button.dataset.originalLabel = button.dataset.originalLabel || button.textContent;
    button.textContent = isLoading ? "Submitting..." : button.dataset.originalLabel;
  }

  function showMessage(messageEl, text, type) {
    if (!messageEl) {
      return;
    }
    messageEl.textContent = text;
    messageEl.className = `form-message form-message--${type}`;
  }

  function populateLaneList() {
    const datalist = document.querySelector("[data-lane-datalist]");
    if (!datalist) {
      return;
    }

    datalist.innerHTML = lanes
      .map((lane) => `<option value="${lane.laneNumber}">${lane.originCity} to ${lane.destinationCity}</option>`)
      .join("");
  }

  function populateSelectedLane() {
    const input = document.querySelector("[data-lane-input]");
    const selectedLaneDisplay = document.querySelector("[data-selected-lane]");
    const routeDisplay = document.querySelector("[data-selected-route]");
    const query = new URLSearchParams(window.location.search);
    const selectedLane = query.get("lane") || sessionStorage.getItem("selectedLaneNumber") || "";

    if (input && selectedLane) {
      input.value = selectedLane;
    }

    if (!selectedLaneDisplay && !routeDisplay) {
      return;
    }

    const lane = lanes.find((entry) => entry.laneNumber === selectedLane);
    if (selectedLaneDisplay) {
      selectedLaneDisplay.textContent = selectedLane || "Enter a lane number";
    }
    if (routeDisplay) {
      routeDisplay.textContent = lane
        ? `${lane.originCity}, ${lane.originState} to ${lane.destinationCity}, ${lane.destinationState}`
        : "Use the field below to manually enter or edit the lane number.";
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("[data-booking-form]");
    if (!form) {
      populateLaneList();
      populateSelectedLane();
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const messageEl = form.querySelector("[data-form-message]");
    let isSubmitting = false;

    populateLaneList();
    populateSelectedLane();

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (isSubmitting) {
        return;
      }

      if (!form.checkValidity()) {
        form.reportValidity();
        showMessage(messageEl, "Please complete the booking details before submitting.", "error");
        return;
      }

      isSubmitting = true;
      setButtonState(submitButton, true);
      showMessage(messageEl, "Submitting your lane request...", "info");

      try {
        await window.sendLaneBookingEmail(form);
        const laneValue = new FormData(form).get("lane_number") || "";
        sessionStorage.setItem("selectedLaneNumber", String(laneValue));
        form.reset();
        if (laneValue) {
          const laneInput = form.querySelector("[data-lane-input]");
          if (laneInput) {
            laneInput.value = laneValue;
          }
        }
        showMessage(
          messageEl,
          "Your lane request has been received. Our team will contact you shortly to confirm availability and booking details.",
          "success"
        );
      } catch (error) {
        console.error("Lane booking failed:", error);
        showMessage(
          messageEl,
          window.getFriendlyEmailJSError
            ? window.getFriendlyEmailJSError(error)
            : "We could not submit the booking right now. Please try again in a moment.",
          "error"
        );
      } finally {
        isSubmitting = false;
        setButtonState(submitButton, false);
      }
    });
  });
})();
