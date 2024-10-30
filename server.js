require("dotenv").config({ path: "./.env" });
require("@aikidosec/firewall");

const express = require('express');
const os = require('os');
const app = express();
const PORT = process.env.PORT || 4000;
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Ensure the environment variables are defined
if (!process.env.API_USER || !process.env.API_PASS) {
  console.error('Error: API_USER or API_PASS environment variables are not set.');
  process.exit(1); // Exit the process with an error
}

app.use(express.json())

const options = require('./swagger');

// API Enpoints
app.use("/", require("./routes/index"));
app.use("/v1", require("./routes/users"));
app.use("/auth", require("./routes/auth"));

//Addig API Docs
const specs = swaggerJsdoc(options);


app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
)

// Handles when a user request a non existent page the server responded with stack traces like filesystem paths
app.use((req, res, next) => {
  res.status(404).json({ PathException: "Endpoint Not Found" });
});

app.listen(PORT, () => {
  const interfaces = os.networkInterfaces();
  console.log(`API running on the following interfaces:`);

  Object.keys(interfaces).forEach((interfaceName) => {
    interfaces[interfaceName].forEach((iface) => {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`- http://${iface.address}:${PORT}`);
      }
    });
  });

  console.log(`Also available at http://localhost:${PORT}`);
});