// Define all routes here
function createRoutes(app, db) {
    app.get("/api/all", (req, res) => {
        db.all("SELECT * FROM todos", function(err, rows){
            if(err) {
                res.sendStatus(501);
                return;
            }
            res.json(rows);
        });
    });

    app.post("/api/create", (req, res) => {
        console.log(req);
    });

}


// Export modules
module.exports = {
    createRoutes
};