require("dotenv").config();

const mqtt = require("mqtt");

const mqttOptions = {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  clientId: "mqtt_client_" + Math.random().toString(16).substr(2, 8),
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 5000,
};

const brokerUrl =
  "wss://3107ee96d14c4007908cdd3e772e6600.s1.eu.hivemq.cloud:8884/mqtt"; //wss://3107ee96d14c4007908cdd3e772e6600.s1.eu.hivemq.cloud:8884/mqtt
const mqttClient = mqtt.connect(brokerUrl, mqttOptions);

console.log("MQTT_USERNAME:", process.env.MQTT_USERNAME);
console.log("MQTT_PASSWORD:", process.env.MQTT_PASSWORD);

// Handle MQTT connection
mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");

  mqttClient.subscribe("RPM/output/#", (err) => {
    if (err) {
      console.error("Subscribe error:", err);
    } else {
      console.log("Subscribed to RPM/output/#");
    }
  });
});

// Handle MQTT errors (prevent exit)
mqttClient.on("error", (err) => {
  console.error("MQTT error:", err.message || err);
  // Do not exit the app, just log the error and try reconnect
});

// Additional MQTT event handlers
mqttClient.on("offline", () => console.error("MQTT client offline"));
mqttClient.on("close", () => console.log("MQTT connection closed"));

// Export the client for use in other modules
module.exports = mqttClient;
