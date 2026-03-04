import mysql from "mysql2/promise";

const config = {
    host: "mainline.proxy.rlwy.net",
    port: 40313,
    user: "root",
    password: "apPiWJMNoHriTUjvKEEoFoCIyfyJkOvg",
    database: "railway"
};

async function test(name, options) {
    console.log(`\n--- Testing: ${name} ---`);
    try {
        const connection = await mysql.createConnection({
            ...config,
            ...options,
            connectTimeout: 10000 // 10 seconds
        });
        console.log(`✅ ${name}: SUCCESS!`);
        await connection.end();
        return true;
    } catch (err) {
        console.error(`❌ ${name}: FAILED`);
        console.error(`   Error Code: ${err.code}`);
        console.error(`   Message: ${err.message}`);
        return false;
    }
}

async function runTests() {
    console.log("Starting Advanced Diagnostics for Railway MySQL...");

    // Test 1: Standard Connection (No SSL)
    await test("Standard (No SSL, Individual Fields)", {});

    // Test 2: Standard Connection with SSL (Simplified)
    await test("SSL Enabled (Individual Fields)", { ssl: { rejectUnauthorized: false } });

    // Test 3: URI Format (No SSL)
    await test("URI Format (No SSL)", { uri: `mysql://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}` });

    console.log("\nDiagnostics Complete.");
}

runTests();
