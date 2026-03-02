const { v4: uuidv4 } = require("uuid");
const pool = require("../config/postgres");

const createSandbox = async (assignment, userId) => {
  const schemaName = `sandbox_${userId}_${Date.now()}`;

  const client = await pool.connect();

  try {
    // 1️⃣ Create Schema
    await client.query(`CREATE SCHEMA ${schemaName}`);

    // 2️⃣ Create Tables
    for (const table of assignment.sampleTables) {
      const columnsSQL = table.columns
        .map(col => `${col.columnName} ${col.dataType}`)
        .join(", ");

      await client.query(
        `CREATE TABLE ${schemaName}.${table.tableName} (${columnsSQL})`
      );

      // 3️⃣ Insert Rows
      for (const row of table.rows) {
        const keys = Object.keys(row).join(", ");
        const values = Object.values(row);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

        await client.query(
          `INSERT INTO ${schemaName}.${table.tableName} (${keys}) VALUES (${placeholders})`,
          values
        );
      }
    }

    return schemaName;

  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

const executeQuery = async (schemaName, userQuery) => {

    const forbiddenKeywords = [
  "DROP",
  "ALTER",
  "TRUNCATE",
  "CREATE SCHEMA",
  "GRANT",
  "REVOKE"
];

const upperQuery = userQuery.toUpperCase();

for (let keyword of forbiddenKeywords) {
  if (upperQuery.includes(keyword)) {
    return {
      success: false,
      error: "Forbidden SQL operation detected."
    };
  }
}

  const client = await pool.connect();

  try {
    // Start transaction
    await client.query("BEGIN");

    // Set schema only for this transaction
    await client.query(`SET LOCAL search_path TO "${schemaName}"`);

    // Execute user query
    const result = await client.query(userQuery);

    // Commit transaction
    await client.query("COMMIT");

    return {
      success: true,
      rows: result.rows
    };

  } catch (error) {
    await client.query("ROLLBACK");

    return {
      success: false,
      error: error.message
    };

  } finally {
    client.release();
  }

  
};

module.exports = { createSandbox, executeQuery };