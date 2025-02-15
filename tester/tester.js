const axios = require('axios');
const fs = require('fs');
const readline = require('readline');

// Base URL of the API
const BASE_URL = "http://localhost:5000/api";

// Get filename from user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter filename to save output: ", (filename) => {
    const output = fs.createWriteStream(filename, { flags: 'w' });
    const log = (message) => {
        console.log(message);
        output.write(message + "\n");
    };

    const separator = "__________________________________\n";

    (async () => {
        try {
            log(separator);

            // ------------------------------
            // 🟢 Test /api/about
            // ------------------------------
            log("\nTesting GET /api/about\n-------------------------");
            try {
                const url = `${BASE_URL}/about`;
                const response = await axios.get(url);
                log(`url=${url}`);
                log(`data.status_code=${response.status}`);
                log(JSON.stringify(response.data, null, 2));
            } catch (error) {
                log("Problem occurred in /api/about");
                log(error.message);
            }

            // ------------------------------
            // 🟢 Test /api/report (Before Adding Cost)
            // ------------------------------
            log("\nTesting GET /api/report - Before Adding Cost\n--------------------------------------------");
            try {
                const user_id = 123123;
                const year = 2025;
                const month = 2;
                const url = `${BASE_URL}/report?id=${user_id}&year=${year}&month=${month}`;
                const response = await axios.get(url);
                log(`url=${url}`);
                log(`data.status_code=${response.status}`);
                log(JSON.stringify(response.data, null, 2));
            } catch (error) {
                log("Problem occurred in /api/report (Before Adding Cost)");
                log(error.message);
            }

            // ------------------------------
            // 🟢 Test /api/add (Adding a Cost)
            // ------------------------------
            log("\nTesting POST /api/add\n----------------------------------");
            try {
                const url = `${BASE_URL}/add`;
                const payload = {
                    "userid": 1001,
                    "description": "milk 9",
                    "category": "food",
                    "sum": 8
                };
                const response = await axios.post(url, payload);
                log(`url=${url}`);
                log(`data.status_code=${response.status}`);
                log(JSON.stringify(response.data, null, 2));
            } catch (error) {
                log("Problem occurred in /api/add");
                log(error.message);
            }

            // ------------------------------
            // 🟢 Test /api/report (After Adding Cost)
            // ------------------------------
            log("\nTesting GET /api/report - After Adding Cost\n-------------------------------------------");
            try {
                const url = `${BASE_URL}/report?id=123123&year=2025&month=2`;
                const response = await axios.get(url);
                log(`url=${url}`);
                log(`data.status_code=${response.status}`);
                log(JSON.stringify(response.data, null, 2));
            } catch (error) {
                log("Problem occurred in /api/report (After Adding Cost)");
                log(error.message);
            }

            // ------------------------------
            // 🟢 Test /api/users/:id
            // ------------------------------
            log("\nTesting GET /api/users/:id\n----------------------------------");
            try {
                const url = `${BASE_URL}/users/123123`;
                const response = await axios.get(url);
                log(`url=${url}`);
                log(`data.status_code=${response.status}`);
                log(JSON.stringify(response.data, null, 2));
            } catch (error) {
                log("Problem occurred in /api/users/:id");
                log(error.message);
            }

            // Close file and readline interface
            output.end();
            rl.close();
        } catch (error) {
            log("Unexpected error occurred during testing.");
            log(error.message);
            output.end();
            rl.close();
        }
    })();
});
