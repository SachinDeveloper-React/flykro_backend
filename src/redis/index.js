const { createClient } = require("redis");

const redis = async () => {
  try {
    const client = createClient({
      password: "G9TJ5pwwRgo6tCTPSegGM2rjOj1b109G",
      socket: {
        host: "redis-13878.c212.ap-south-1-1.ec2.redns.redis-cloud.com",
        port: 13878,
      },
    });

    client.on("error", (err) => console.log("Redis Client Error", err));

    await client.connect();

    console.log("Connection is established with Redis");

    return client; // Return the Redis client object
  } catch (error) {
    console.log("DEBUG: Redis connection error", error);
    throw error;
  }
};

module.exports = redis;
