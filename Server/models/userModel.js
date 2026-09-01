const db = require("../config/db");

// Find user by email
const findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users WHERE email = ?";

        db.query(sql, [email], (err, results) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(results[0]);
        });
    });
};


// Find user by ID
const findUserById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT id, name, email, role, created_at
            FROM users
            WHERE id = ?
        `;

        db.query(sql, [id], (err, results) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(results[0]);
        });
    });
};


// Create user
const createUser = (name, email, password, role = "staff") => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO users (name, email, password, role)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            sql,
            [name, email, password, role],
            (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(result.insertId);
            }
        );
    });
};


module.exports = {
    findUserByEmail,
    findUserById,
    createUser
};