function createDatabase(sqlite) {
    const db = new sqlite.Database("./todos.db", sqlite.OPEN_READWRITE, (err) =>{
        if(err) console.log("Database error: " + err);
    });
    db.run("CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(100), description VARCHAR(100), created_at DATETIME default current_timestamp);");
    return db;
}

module.exports = {
    createDatabase
};