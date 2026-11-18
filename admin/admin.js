const menuItems = [
  {
    id: 1,
    name: "Truffle Pasta",
    price: 680,
    category: "signature",
    tag: "Chef Selection",
    description: "Creamy truffle pasta with parmesan and fresh herbs.",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 2,
    name: "Classic Burger",
    price: 520,
    category: "main",
    tag: "Popular",
    description: "Juicy grilled burger with cheese and crispy fries.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 3,
    name: "Margherita Pizza",
    price: 590,
    category: "main",
    tag: "Italian",
    description: "Wood-fired pizza with tomato, mozzarella and basil.",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 4,
    name: "Tiramisu",
    price: 390,
    category: "dessert",
    tag: "Dessert",
    description: "Classic Italian tiramisu with coffee and mascarpone.",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 5,
    name: "Chocolate Dessert",
    price: 420,
    category: "dessert",
    tag: "Sweet",
    description: "Rich chocolate dessert finished with delicate cream.",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 6,
    name: "Fresh Mojito",
    price: 280,
    category: "drink",
    tag: "Refreshing",
    description: "Fresh mint, lime and soda served chilled.",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 7,
    name: "Creamy Pasta",
    price: 620,
    category: "signature",
    tag: "Signature",
    description: "Silky cream sauce with herbs and parmesan.",
    image: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 8,
    name: "Fine Dining Salad",
    price: 360,
    category: "main",
    tag: "Fresh",
    description: "Fresh seasonal greens with elegant house dressing.",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80"
  }
];

let reservations = [
  {
    id: 1,
    guest: "Rahul Mehta",
    date: "2026-11-18",
    time: "19:30",
    guests: 4,
    table: "T-04",
    status: "confirmed"
  },
  {
    id: 2,
    guest: "Sarah Patel",
    date: "2026-11-18",
    time: "20:00",
    guests: 2,
    table: "T-08",
    status: "seated"
  },
  {
    id: 3,
    guest: "Arjun Shah",
    date: "2026-11-18",
    time: "20:30",
    guests: 6,
    table: "T-12",
    status: "pending"
  }
];

const tables = [
  { number: "T-01", seats: 2, status: "available" },
  { number: "T-02", seats: 2, status: "occupied" },
  { number: "T-03", seats: 4, status: "occupied" },
  { number: "T-04", seats: 4, status: "occupied" },
  { number: "T-05", seats: 2, status: "available" },
  { number: "T-06", seats: 6, status: "occupied" },
  { number: "T-07", seats: 4, status: "available" },
  { number: "T-08", seats: 2, status: "occupied" },
  { number: "T-09", seats: 4, status: "available" },
  { number: "T-10", seats: 6, status: "occupied" },
  { number: "T-11", seats: 2, status: "available" },
  { number: "T-12", seats: 6, status: "occupied" }
];

const pageTitles = {
  dashboard: "Dashboard",
  menu: "Menu",
  service: "Today's Service",
  guests: "Guest Insights",
  reservations: "Reservations",
  settings: "Settings"
};

const pageKickers = {
  dashboard: "OPERATIONS",
  menu: "MENU MANAGEMENT",
  service: "DINING ROOM",
  guests: "CRM · ANALYTICS",
  reservations: "GUEST BOOKING",
  settings: "ADMINISTRATION"
};

document.addEventListener("DOMContentLoaded", () => {

  initializeNavigation();
  initializeMenu();
  initializeReservations();
  initializeService();
  initializeModals();
  initializeSettings();

  renderMenuItems("all");
  renderReservations();
  renderRecentReservations();
  renderTables();
  renderServiceList();
  renderGuestChart();
  updateDate();

});

function initializeNavigation() {

  document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", () => {
      showView(button.dataset.view);
      closeSidebar();
    });
  });

  document.querySelectorAll("[data-view-link]").forEach(button => {
    button.addEventListener("click", () => {
      showView(button.dataset.viewLink);
    });
  });

  const openSidebarButton = document.getElementById("openSidebar");
  const closeSidebarButton = document.getElementById("closeSidebar");

  if (openSidebarButton) {
    openSidebarButton.addEventListener("click", openSidebar);
  }

  if (closeSidebarButton) {
    closeSidebarButton.addEventListener("click", closeSidebar);
  }

  const overlay = document.getElementById("mobileOverlay");

  if (overlay) {
    overlay.addEventListener("click", closeSidebar);
  }

  document.getElementById("logoutButton")?.addEventListener("click", () => {
    showToast("Logged out successfully");
  });
}

function showView(view) {

  document.querySelectorAll(".page-view").forEach(section => {
    section.classList.remove("active");
  });

  const target = document.getElementById(`${view}View`);

  if (target) {
    target.classList.add("active");
  }

  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.view === view
    );
  });

  const pageTitle = document.getElementById("pageTitle");
  const pageKicker = document.getElementById("pageKicker");

  if (pageTitle) {
    pageTitle.textContent = pageTitles[view] || view;
  }

  if (pageKicker) {
    pageKicker.textContent = pageKickers[view] || "LUMIÈRE";
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function openSidebar() {
  document.getElementById("sidebar")?.classList.add("open");
  document.getElementById("mobileOverlay")?.classList.add("show");
}

function closeSidebar() {
  document.getElementById("sidebar")?.classList.remove("open");
  document.getElementById("mobileOverlay")?.classList.remove("show");
}

function initializeMenu() {

  document.querySelectorAll(".filter").forEach(button => {

    button.addEventListener("click", () => {

      document.querySelectorAll(".filter").forEach(item => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      renderMenuItems(button.dataset.filter);
    });

  });

  document.getElementById("addMenuButton")?.addEventListener("click", () => {

    document.getElementById("dishModalTitle").textContent = "Add Dish";

    document.getElementById("dishForm").reset();

    document.getElementById("dishId").value = "";

    openModal("dishModal");

  });

  document.getElementById("dishForm")?.addEventListener("submit", saveDish);
}

function renderMenuItems(filter = "all") {

  const grid = document.getElementById("menuAdminGrid");

  if (!grid) return;

  const filteredItems =
    filter === "all"
      ? menuItems
      : menuItems.filter(item => item.category === filter);

  if (filteredItems.length === 0) {

    grid.innerHTML = `
            <div class="empty-menu">
                <h3>No dishes found</h3>
                <p>No dishes are available in this category.</p>
            </div>
        `;

    return;
  }

  grid.innerHTML = filteredItems.map(item => `

        <article class="menu-admin-card">

            <div class="menu-image">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                    loading="lazy"
                    onerror="this.src='https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80'"
                >

                <span class="menu-category">
                    ${formatCategory(item.category)}
                </span>

            </div>

            <div class="menu-card-content">

                <div class="menu-card-top">

                    <div>
                        <span class="menu-tag">
                            ${item.tag}
                        </span>

                        <h3>
                            ${item.name}
                        </h3>
                    </div>

                    <strong>
                        ₹${Number(item.price).toLocaleString("en-IN")}
                    </strong>

                </div>

                <p>
                    ${item.description}
                </p>

                <div class="menu-card-actions">

                    <button
                        class="outline-button"
                        onclick="editMenuItem(${item.id})">
                        EDIT
                    </button>

                    <button
                        class="delete-button"
                        onclick="deleteMenuItem(${item.id})">
                        DELETE
                    </button>

                </div>

            </div>

        </article>

    `).join("");
}

function formatCategory(category) {

  const categories = {
    signature: "Signature",
    main: "Main Course",
    dessert: "Dessert",
    drink: "Drinks"
  };

  return categories[category] || category;
}

function editMenuItem(id) {

  const item = menuItems.find(dish => dish.id === id);

  if (!item) return;

  document.getElementById("dishModalTitle").textContent = "Edit Dish";

  document.getElementById("dishId").value = item.id;
  document.getElementById("dishName").value = item.name;
  document.getElementById("dishPrice").value = item.price;
  document.getElementById("dishCategory").value = item.category;
  document.getElementById("dishTag").value = item.tag;
  document.getElementById("dishDescription").value = item.description;
  document.getElementById("dishImage").value = item.image;

  openModal("dishModal");
}

function deleteMenuItem(id) {

  const index = menuItems.findIndex(item => item.id === id);

  if (index === -1) return;

  const itemName = menuItems[index].name;

  if (confirm(`Delete "${itemName}" from the menu?`)) {

    menuItems.splice(index, 1);

    renderMenuItems(
      document.querySelector(".filter.active")?.dataset.filter || "all"
    );

    showToast(`${itemName} deleted`);

  }
}

function saveDish(event) {

  event.preventDefault();

  const id = document.getElementById("dishId").value;

  const dish = {
    id: id ? Number(id) : Date.now(),
    name: document.getElementById("dishName").value,
    price: Number(document.getElementById("dishPrice").value),
    category: document.getElementById("dishCategory").value,
    tag: document.getElementById("dishTag").value || "Chef Selection",
    description: document.getElementById("dishDescription").value,
    image: document.getElementById("dishImage").value
  };

  if (id) {

    const index = menuItems.findIndex(item => item.id === Number(id));

    if (index !== -1) {
      menuItems[index] = dish;
    }

    showToast("Dish updated successfully");

  } else {

    menuItems.push(dish);

    showToast("New dish added successfully");

  }

  closeModal("dishModal");

  renderMenuItems(
    document.querySelector(".filter.active")?.dataset.filter || "all"
  );
}

function initializeReservations() {

  document.getElementById("addReservationButton")?.addEventListener("click", () => {

    document.getElementById("reservationForm").reset();

    openModal("reservationModal");

  });

  document.getElementById("reservationForm")?.addEventListener(
    "submit",
    saveReservation
  );

  document.getElementById("reservationSearch")?.addEventListener(
    "input",
    renderReservations
  );

  document.getElementById("reservationFilter")?.addEventListener(
    "change",
    renderReservations
  );
}

function saveReservation(event) {

  event.preventDefault();

  const reservation = {

    id: Date.now(),

    guest: document.getElementById("guestName").value,

    date: document.getElementById("guestDate").value,

    time: document.getElementById("guestTime").value,

    guests: Number(document.getElementById("guestCount").value),

    table: document.getElementById("guestTable").value,

    status: document.getElementById("guestStatus").value

  };

  reservations.push(reservation);

  closeModal("reservationModal");

  renderReservations();
  renderRecentReservations();

  const metric = document.getElementById("reservationMetric");

  if (metric) {
    metric.textContent = reservations.length;
  }

  showToast("Reservation created successfully");
}

function renderReservations() {

  const tbody = document.getElementById("reservationTable");

  if (!tbody) return;

  const search =
    document.getElementById("reservationSearch")?.value
      .toLowerCase()
      .trim() || "";

  const filter =
    document.getElementById("reservationFilter")?.value || "all";

  const filtered = reservations.filter(item => {

    const matchesSearch =
      item.guest.toLowerCase().includes(search);

    const matchesFilter =
      filter === "all" || item.status === filter;

    return matchesSearch && matchesFilter;

  });

  tbody.innerHTML = filtered.map(item => `

        <tr>

            <td>
                <strong>${item.guest}</strong>
            </td>

            <td>
                ${formatDate(item.date)}
            </td>

            <td>
                ${formatTime(item.time)}
            </td>

            <td>
                ${item.guests}
            </td>

            <td>
                ${item.table}
            </td>

            <td>
                <span class="status ${item.status}">
                    ${item.status}
                </span>
            </td>

            <td>
                <button
                    class="table-action"
                    onclick="deleteReservation(${item.id})">
                    DELETE
                </button>
            </td>

        </tr>

    `).join("");

  if (filtered.length === 0) {

    tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-table">
                    No reservations found.
                </td>
            </tr>
        `;

  }
}

function renderRecentReservations() {

  const tbody = document.getElementById("recentReservations");

  if (!tbody) return;

  const recent = [...reservations]
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 5);

  tbody.innerHTML = recent.map(item => `

        <tr>

            <td>
                <strong>${item.guest}</strong>
            </td>

            <td>
                ${formatTime(item.time)}
            </td>

            <td>
                ${item.guests}
            </td>

            <td>
                ${item.table}
            </td>

            <td>
                <span class="status ${item.status}">
                    ${item.status}
                </span>
            </td>

        </tr>

    `).join("");
}

function deleteReservation(id) {

  const reservation = reservations.find(item => item.id === id);

  if (!reservation) return;

  if (confirm(`Delete reservation for ${reservation.guest}?`)) {

    reservations = reservations.filter(item => item.id !== id);

    renderReservations();
    renderRecentReservations();

    const metric = document.getElementById("reservationMetric");

    if (metric) {
      metric.textContent = reservations.length;
    }

    showToast("Reservation deleted");
  }
}

function initializeService() {

  document
    .getElementById("toggleServiceButton")
    ?.addEventListener("click", toggleService);

}

let serviceOpen = true;

function toggleService() {

  serviceOpen = !serviceOpen;

  const button = document.getElementById("toggleServiceButton");
  const state = document.getElementById("serviceState");

  if (serviceOpen) {

    button.textContent = "PAUSE SERVICE";

    state.textContent = "OPEN";

    showToast("Service is now open");

  } else {

    button.textContent = "RESUME SERVICE";

    state.textContent = "PAUSED";

    showToast("Service has been paused");

  }
}

function renderTables() {

  const grid = document.getElementById("tablesGrid");

  if (!grid) return;

  grid.innerHTML = tables.map(table => `

        <div class="table-card ${table.status}">

            <span class="table-number">
                ${table.number}
            </span>

            <strong>
                ${table.seats}
            </strong>

            <small>
                ${table.status}
            </small>

        </div>

    `).join("");
}

function renderServiceList() {

  const list = document.getElementById("serviceList");

  if (!list) return;

  const upcoming = [...reservations]
    .sort((a, b) => a.time.localeCompare(b.time));

  list.innerHTML = upcoming.map(item => `

        <div class="service-item">

            <div>

                <strong>
                    ${item.guest}
                </strong>

                <small>
                    ${formatTime(item.time)}
                    · ${item.guests} guests
                    · ${item.table}
                </small>

            </div>

            <span class="status ${item.status}">
                ${item.status}
            </span>

        </div>

    `).join("");
}

function renderGuestChart() {

  const chart = document.getElementById("guestChart");

  if (!chart) return;

  const values = [82, 86, 84, 89, 91, 94, 96];

  chart.innerHTML = values.map((value, index) => `

        <div class="chart-column">

            <div
                class="chart-bar"
                style="height:${value}%">
            </div>

            <small>
                ${["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"][index]}
            </small>

        </div>

    `).join("");
}

function initializeModals() {

  document.querySelectorAll("[data-close-modal]").forEach(button => {

    button.addEventListener("click", () => {
      closeModal(button.dataset.closeModal);
    });

  });

  document.querySelectorAll(".modal").forEach(modal => {

    modal.addEventListener("click", event => {

      if (event.target === modal) {
        closeModal(modal.id);
      }

    });

  });

}

function openModal(id) {

  const modal = document.getElementById(id);

  if (modal) {
    modal.classList.add("show");
  }

}

function closeModal(id) {

  const modal = document.getElementById(id);

  if (modal) {
    modal.classList.remove("show");
  }

}

function initializeSettings() {

  document
    .getElementById("saveSettings")
    ?.addEventListener("click", () => {

      const message = document.getElementById("settingsSaved");

      if (message) {

        message.textContent = "Settings saved successfully.";

        setTimeout(() => {
          message.textContent = "";
        }, 3000);

      }

      showToast("Settings saved");

    });

}

function updateDate() {

  const element = document.getElementById("todayDate");

  if (!element) return;

  const today = new Date();

  element.textContent = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

}

function formatDate(date) {

  if (!date) return "";

  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );

}

function formatTime(time) {

  if (!time) return "";

  const [hours, minutes] = time.split(":");

  const date = new Date();

  date.setHours(hours, minutes);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit"
  });

}

function showToast(message) {

  const toast = document.getElementById("toast");

  if (!toast) return;

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);

}