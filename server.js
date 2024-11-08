// server.js
import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// POST endpoint to write data to a JSON file
app.post("/write", (req, res) => {
	const data = req.body;

	// Define the path to the JSON file
	const filePath = path.join(process.cwd(), "data.json");

	// Write the data to the JSON file
	fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
		if (err) {
			console.error("Error writing to file", err);
			return res.status(500).send("Internal Server Error");
		}
		res.send("Data written to file successfully");
	});
});

app.post("/user", (req, res) => {
	const userData = req.body;

	if (!userData.email) {
		return res.status(400).send("Email is required");
	}

	// Define the path to the JSON file
	const filePath = path.join(process.cwd(), "user.json");

	// Read existing users or create empty array if file doesn't exist
	fs.readFile(filePath, (err, data) => {
		let users = [];
		if (!err) {
			try {
				users = JSON.parse(data);
			} catch (parseErr) {
				console.error("Error parsing users file", parseErr);
				return res.status(500).send("Internal Server Error");
			}
		}

		// Check if user with email already exists
		const existingUser = users.find((user) => user.email === userData.email);
		if (existingUser) {
			return res.status(409).send("User already exists. Please login instead.");
		}

		// Add new user with unique ID
		const newUser = {
			...userData,
			uid: Date.now().toString(), // Simple UID generation
		};
		users.push(newUser);

		// Write updated users array back to file
		fs.writeFile(filePath, JSON.stringify(users, null, 2), (writeErr) => {
			if (writeErr) {
				console.error("Error writing to file", writeErr);
				return res.status(500).send("Internal Server Error");
			}
			res.status(201).send({
				message: "User created successfully",
				user: newUser,
			});
		});
	});
});
app.post("/order", (req, res) => {
	const userData = req.body;

	if (!userData.email) {
		return res.status(400).send("Email is required");
	}
	if (!userData.order) {
		return res.status(400).send("Order is required");
	}

	// Define the path to the JSON file
	const filePath = path.join(process.cwd(), "user.json");

	// Read existing users or create empty array if file doesn't exist
	fs.readFile(filePath, (err, data) => {
		let users = [];
		if (!err) {
			try {
				users = JSON.parse(data);
			} catch (parseErr) {
				console.error("Error parsing users file", parseErr);
				return res.status(500).send("Internal Server Error");
			}
		}

		// Check if user with email already exists
		const existingUser = users.find((user) => user.email === userData.email);
		if (!existingUser) {
			return res.status(409).send("User not found.");
		}

		// Add new order with unique ID
		const newOrder = {
			...userData.order,
			orderId: Date.now().toString(), // Simple order ID generation
		};

		// Initialize orders array if it doesn't exist
		if (!existingUser.orders) {
			existingUser.orders = [];
		}
		existingUser.orders.push(newOrder);

		// Write updated users array back to file
		fs.writeFile(filePath, JSON.stringify(users, null, 2), (writeErr) => {
			if (writeErr) {
				console.error("Error writing to file", writeErr);
				return res.status(500).send("Internal Server Error");
			}
			res.status(201).send({
				message: "User created successfully",
				user: newOrder,
			});
		});
	});
});

app.get("/order", (req, res) => {
	const userData = req.body;

	if (!userData.email) {
		return res.status(400).send("Email is required");
	}

	// Define the path to the JSON file
	const filePath = path.join(process.cwd(), "user.json");

	// Read existing users or create empty array if file doesn't exist
	fs.readFile(filePath, (err, data) => {
		let users = [];
		if (!err) {
			try {
				users = JSON.parse(data);
			} catch (parseErr) {
				console.error("Error parsing users file", parseErr);
				return res.status(500).send("Internal Server Error");
			}
		}

		// Check if user with email exists
		const existingUser = users.find((user) => user.email === userData.email);
		if (!existingUser) {
			return res.status(404).send("User not found");
		}

		// Return user's orders or empty array if no orders exist
		res.status(200).send({
			orders: existingUser.orders || [],
		});
	});
});

// GET endpoint to read data from a JSON file
app.get("/user", (req, res) => {
	const userData = req.body;

	// Define the path to the JSON file
	const filePath = path.join(process.cwd(), "user.json");

	// Read existing users or create empty array if file doesn't exist
	fs.readFile(filePath, (err, data) => {
		let users = [];
		if (!err) {
			try {
				users = JSON.parse(data);
			} catch (parseErr) {
				console.error("Error parsing users file", parseErr);
				return res.status(500).send("Internal Server Error");
			}
		}

		// Check if user with email already exists
		const existingUser = users.find((user) => user.email === userData.email);
		if (existingUser) {
			return res.status(200).send(existingUser);
		} else return res.status(200).send(users);
	});
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
