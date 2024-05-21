function createDatabase(sqlite) {
    const db = new sqlite.Database("./todos.db", sqlite.OPEN_READWRITE, (err) =>{
        if(err) console.log("Database error: " + err);
    });

    db.run("CREATE TABLE IF NOT EXISTS todos (id INT, title VARCHAR(100), description VARCHAR(100), primary key(id))");
    return db;
}

module.exports = {
    createDatabase
};