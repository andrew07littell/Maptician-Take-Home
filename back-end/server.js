require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs").promises; // Import the promises interface of the fs module
const app = express();
const { v4: uuidv4 } = require("uuid");
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Helper function to read data from the JSON file
const readDataFromFile = async () => {
  try {
    const data = await fs.readFile("attendanceData.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading from file:", error);
    return []; // Return an empty array in case of error
  }
};

// Helper function to write data to the JSON file
const writeDataToFile = async (data) => {
  try {
    await fs.writeFile(
      "attendanceData.json",
      JSON.stringify(data, null, 2),
      "utf8"
    );
  } catch (error) {
    console.error("Error writing to file:", error);
  }
};

// Endpoints
app.get("/reservations", async (req, res) => {
  const reservations = await readDataFromFile();
  res.json(reservations);
});

app.post("/reservations", async (req, res) => {
  const newReservation = { id: uuidv4(), ...req.body };
  const reservations = await readDataFromFile();
  reservations.splice(0, 0, newReservation);
  await writeDataToFile(reservations);
  res.status(201).send(newReservation);
});

app.delete("/reservations/:id", async (req, res) => {
  const { id } = req.params;
  let reservations = await readDataFromFile();
  reservations = reservations.filter((reservation) => reservation.id !== id);
  await writeDataToFile(reservations);
  res.status(204).send();
});

app.listen(PORT, () =>
  console.log(`Server is conjuring spells on port ${PORT}!`)
);
