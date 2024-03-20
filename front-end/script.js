const BASE_API_URL = "http://localhost:3333";

document.addEventListener("DOMContentLoaded", () => {
  fetchReservations();
  document
    .getElementById("reservation-form")
    .addEventListener("submit", addReservation);
});

// Fetch and display reservations
function fetchReservations() {
  fetch(`${BASE_API_URL}/reservations`)
    .then((response) => response.json())
    .then((data) => {
      const list = document.getElementById("reservation-list");
      list.innerHTML = ""; // Clear current list
      data.forEach((reservation) => {
        const item = document.createElement("div");
        item.className = "reservation-item";
        item.innerHTML = `
                    ${reservation.userName} - ${reservation.locationName}
                    <div class="button-group">
                      <button class="details-button">Details</button>
                      <button class="remove-button" onclick="deleteReservation('${reservation.id}')">Delete</button>
                    </div>
                `;
        list.appendChild(item);

        // Find the details button we just added and attach an event listener
        const detailsButton = item.querySelector(".details-button");
        detailsButton.addEventListener("click", () => openModal(reservation));
      });
    });
}

// Add a new reservation
function addReservation(event) {
  event.preventDefault();
  const reservation = {
    userName: document.getElementById("userName").value,
    locationAddress: document.getElementById("locationAddress").value,
    locationName: document.getElementById("locationName").value,
    floorName: document.getElementById("floorName").value,
    seatName: document.getElementById("seatName").value,
    start: document.getElementById("start").value,
    end: document.getElementById("end").value,
    isPresent: document.getElementById("isPresent").checked,
    isPrivate: document.getElementById("isPrivate").checked,
  };

  fetch(`${BASE_API_URL}/reservations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reservation),
  })
    .then((response) => response.json())
    .then(() => {
      fetchReservations(); // Refresh the list
      document.getElementById("reservation-form").reset(); // Reset the form
    });
}

// Delete a reservation
function deleteReservation(id) {
  fetch(`${BASE_API_URL}/reservations/${id}`, {
    method: "DELETE",
  }).then(() => {
    fetchReservations(); // Refresh the list
  });
}

// Function to open the modal and display reservation details
function openModal(reservation) {
  const modal = document.getElementById("reservation-modal");
  const modalBody = document.getElementById("modal-body");
  modal.style.display = "flex"; // Adjust to flex to work with our new CSS
  modalBody.innerHTML = `
      <div class="modal-details">
          <div class="modal-detail"><strong>User Name:</strong> ${
            reservation.userName
          }</div>
          <div class="modal-detail"><strong>Location:</strong> ${
            reservation.locationName
          }</div>
          <div class="modal-detail"><strong>Floor Name:</strong> ${
            reservation.floorName
          }</div>
          <div class="modal-detail"><strong>Seat Name:</strong> ${
            reservation.seatName
          }</div>
          <div class="modal-detail"><strong>Start:</strong> ${new Date(
            reservation.start
          ).toLocaleString()}</div>
          <div class="modal-detail"><strong>End:</strong> ${new Date(
            reservation.end
          ).toLocaleString()}</div>
          <div class="modal-detail"><strong>Is Present:</strong> ${
            reservation.isPresent ? "Yes" : "No"
          }</div>
          <div class="modal-detail"><strong>Is Private:</strong> ${
            reservation.isPrivate ? "Yes" : "No"
          }</div>
      </div>
  `;
}

// Function to close the modal
document.querySelector(".close-button").addEventListener("click", () => {
  document.getElementById("reservation-modal").style.display = "none";
});
