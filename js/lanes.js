(function () {
  const lanes = (window.PAK_TRANSPORTATION && window.PAK_TRANSPORTATION.lanes) || [];
  const data = {
    search: "",
    state: "all",
    pickupDate: "",
    sort: "featured",
  };

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

  const miles = new Intl.NumberFormat("en-US");

  function formatDate(value) {
    return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
    });
  }

  function toIsoDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function laneMatches(lane) {
    const search = data.search.trim().toLowerCase();
    const laneText = [
      lane.laneNumber,
      lane.originCity,
      lane.originState,
      lane.destinationCity,
      lane.destinationState,
    ]
      .join(" ")
      .toLowerCase();

    const stateMatch =
      data.state === "all" ||
      lane.originState === data.state ||
      lane.destinationState === data.state;

    const dateMatch = !data.pickupDate || lane.pickup === data.pickupDate;

    return (!search || laneText.includes(search)) && stateMatch && dateMatch;
  }

  function sortLanes(list) {
    const sorted = [...list];
    switch (data.sort) {
      case "rate-asc":
        sorted.sort((a, b) => a.rate - b.rate);
        break;
      case "rate-desc":
        sorted.sort((a, b) => b.rate - a.rate);
        break;
      case "miles-asc":
        sorted.sort((a, b) => a.miles - b.miles);
        break;
      case "miles-desc":
        sorted.sort((a, b) => b.miles - a.miles);
        break;
      default:
        sorted.sort((a, b) => a.laneNumber.localeCompare(b.laneNumber));
        break;
    }
    return sorted;
  }

  function renderLaneCard(lane) {
    return `
      <article class="lane-card" data-reveal>
        <div class="lane-card__top">
          <span class="lane-card__badge">${lane.laneNumber}</span>
          <span class="lane-card__rate">${currency.format(lane.rate)}</span>
        </div>
        <h3 class="lane-card__route">${lane.originCity}, ${lane.originState} <span>→</span> ${lane.destinationCity}, ${lane.destinationState}</h3>
        <div class="lane-card__meta">
          <div><span>Miles</span><strong>${miles.format(lane.miles)}</strong></div>
          <div><span>Pickup</span><strong>${formatDate(lane.pickup)}</strong></div>
          <div><span>Delivery</span><strong>${formatDate(lane.delivery)}</strong></div>
        </div>
        <button class="button button--accent lane-card__button" type="button" data-book-lane="${lane.laneNumber}">
          Book This Lane
        </button>
      </article>
    `;
  }

  function updateSummary(list) {
    const summary = document.querySelector("[data-lane-summary]");
    if (summary) {
      summary.textContent = `${list.length} lane${list.length === 1 ? "" : "s"} available`;
    }

    const sectionSummary = document.querySelector("[data-lane-section-summary]");
    if (sectionSummary) {
      sectionSummary.textContent = list.length
        ? `Showing ${list.length} lane${list.length === 1 ? "" : "s"} based on your current filters.`
        : "No lanes match your filters. Clear them to see all available freight.";
    }
  }

  function attachBookButtons() {
    document.querySelectorAll("[data-book-lane]").forEach((button) => {
      button.addEventListener("click", () => {
        const laneNumber = button.getAttribute("data-book-lane");
        if (!laneNumber) {
          return;
        }
        sessionStorage.setItem("selectedLaneNumber", laneNumber);
        window.location.href = `book-lane.html?lane=${encodeURIComponent(laneNumber)}`;
      });
    });
  }

  function render() {
    const grid = document.querySelector("[data-lane-grid]");
    if (!grid) {
      return;
    }

    const list = sortLanes(lanes.filter(laneMatches));
    grid.innerHTML = list.length
      ? list.map(renderLaneCard).join("")
      : `
        <div class="lane-empty" data-reveal>
          <h3>No lanes found</h3>
          <p>Try clearing the search or filter controls to view the full lane board.</p>
          <button class="button button--secondary" type="button" data-reset-filters>Clear Filters</button>
        </div>
      `;

    grid.querySelectorAll("[data-reveal]").forEach((element) => {
      element.classList.add("is-visible");
    });

    updateSummary(list);
    attachBookButtons();
  }

  function populateStateFilter() {
    const select = document.querySelector("[data-state-filter]");
    if (!select) {
      return;
    }

    const states = Array.from(
      new Set(
        lanes.flatMap((lane) => [lane.originState, lane.destinationState])
      )
    ).sort();

    select.innerHTML = `
      <option value="all">All States</option>
      ${states.map((state) => `<option value="${state}">${state}</option>`).join("")}
    `;
  }

  function bindFilters() {
    const search = document.querySelector("[data-search-filter]");
    const state = document.querySelector("[data-state-filter]");
    const pickupDate = document.querySelector("[data-date-filter]");
    const sort = document.querySelector("[data-sort-filter]");
    const sectionSummary = document.querySelector("[data-lane-section-summary]");
    const todayPlus2 = new Date();
    todayPlus2.setDate(todayPlus2.getDate() + 2);
    const defaultPickup = toIsoDate(todayPlus2);

    if (pickupDate && !pickupDate.value) {
      pickupDate.value = defaultPickup;
      data.pickupDate = defaultPickup;
    }

    search?.addEventListener("input", (event) => {
      data.search = event.target.value;
      render();
    });

    state?.addEventListener("change", (event) => {
      data.state = event.target.value;
      render();
    });

    pickupDate?.addEventListener("change", (event) => {
      data.pickupDate = event.target.value;
      render();
    });

    sort?.addEventListener("change", (event) => {
      data.sort = event.target.value;
      render();
    });

    document.addEventListener("click", (event) => {
      const resetButton = event.target.closest("[data-reset-filters]");
      if (!resetButton) {
        return;
      }

      data.search = "";
      data.state = "all";
      data.pickupDate = "";
      data.sort = "featured";
      if (search) search.value = "";
      if (state) state.value = "all";
      if (pickupDate) pickupDate.value = "";
      if (sort) sort.value = "featured";
      render();
    });

    if (sectionSummary) {
      sectionSummary.textContent = "Use the filters above to narrow the load board.";
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const lanePage = document.querySelector("[data-lane-page]");
    if (!lanePage) {
      return;
    }

    populateStateFilter();
    bindFilters();
    render();
  });
})();
