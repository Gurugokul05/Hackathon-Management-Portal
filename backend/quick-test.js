const http = require("http");

function makeRequest(path, method = "GET", data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 5000,
      path: path,
      method: method,
      headers: { "Content-Type": "application/json" },
    };
    if (token) options.headers.Authorization = `Bearer ${token}`;

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on("error", reject);
    req.setTimeout(3000, () => {
      req.abort();
      reject(new Error("Timeout"));
    });

    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function test() {
  try {


    // 1. Admin login

    const loginRes = await makeRequest("/api/auth/login-admin", "POST", {
      username: "admin",
      password: "admin123",
    });
    if (loginRes.status !== 200)
      throw new Error(`Login failed: ${loginRes.status}`);
    const token = loginRes.body.token;


    // 2. Get current locks

    const getRes = await makeRequest(
      "/api/teams/attendance/lock",
      "GET",
      null,
      token,
    );


    if (getRes.status === 200) {

    } else {

    }

    // 3. Update lock (open round 2)

    const putRes = await makeRequest(
      "/api/teams/attendance/lock",
      "PUT",
      {
        round: "round2",
        open: true,
      },
      token,
    );


    if (putRes.status === 200) {

    } else {

    }

    // 4. Verify lock was updated

    const verifyRes = await makeRequest(
      "/api/teams/attendance/lock",
      "GET",
      null,
      token,
    );

    if (verifyRes.body.locks && verifyRes.body.locks.round2 === true) {


    } else {


    }
  } catch (err) {

    process.exit(1);
  }
}

test();
