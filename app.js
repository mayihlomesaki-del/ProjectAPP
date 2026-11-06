const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");
const toast = document.querySelector("#toast");
let toastTimeout;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 3600);
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  primaryNav.classList.toggle("is-open", !isOpen);
});

primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    primaryNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  });
});

document.querySelectorAll(".event-join").forEach((button) => {
  button.addEventListener("click", () => {
    const joining = button.getAttribute("aria-pressed") !== "true";
    button.setAttribute("aria-pressed", String(joining));
    button.firstChild.textContent = joining ? "YOU'RE IN " : "I'M IN ";
    showToast(joining ? "You're on the list. See you at the arena!" : "You're off the list. Maybe next time!");
  });
});

const nextFriday = new Date();
nextFriday.setHours(0, 0, 0, 0);
nextFriday.setDate(nextFriday.getDate() + ((5 - nextFriday.getDay() + 7) % 7 || 7));
document.querySelectorAll(".event-date").forEach((element, index) => {
  const date = new Date(nextFriday);
  date.setDate(date.getDate() + index);
  const dateParts = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
  }).formatToParts(date);
  const weekday = dateParts.find((part) => part.type === "weekday").value;
  const month = dateParts.find((part) => part.type === "month").value;
  element.querySelector("span").textContent = weekday.toUpperCase();
  element.querySelector("strong").textContent = String(date.getDate()).padStart(2, "0");
  element.querySelector("small").textContent = month.toUpperCase();
  element.dateTime = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
});

const bookingDate = document.querySelector("#booking-date");
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
bookingDate.min = localToday;
bookingDate.value = localToday;

document.querySelector("#booking-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const date = new Date(`${formData.get("date")}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  showToast(`${formData.get("setup")} selected for ${date} at ${formData.get("time")}. Visit or call the arena to confirm availability.`);
});

document.querySelector("#current-year").textContent = String(new Date().getFullYear());
