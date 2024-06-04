// Define all routes here

function createRoutes(app, db) {
    app.get("/api/all", (req, res) => {
        db.all("SELECT * FROM todos", function (err, rows) {
            if (err) {
                console.log("Database error while getting all todos. Error: " + err);
                res.sendStatus(500);
                return;
            }
            res.json(rows);
        });
    });

    app.post("/api/create", function (req, res) {
        console.log(req.body);

        const title = req.body.title;
        const description = req.body.description;
        const done = req.body.done === "Ja";
        const deadline = req.body.deadline;

        if(!title || !description || !deadline) {
            const response = '{ "Status": "Failure", "Message": "Informationen fehlen." }';
            res.status(406).json(JSON.parse(response));
            return;
        }

        db.run("INSERT INTO todos (title, description, done, deadline) VALUES ('" + title + "', '" + description + "', " + done + ", '" + deadline + "')", function (err, rows) {
            if(err) {
                console.log("Database error while creating new todo. Error: " + err);
                res.sendStatus(500);
                return;
            }
            res.sendStatus(200);
        });
    });

    app.post("/api/delete", function (req, res) {
        const id = req.body.id;

        if(!id) {
            res.status(406).json(JSON.parse('{ "status":"failure", "message":"ID nicht angegeben." }'));
            return;
        }

        db.run("DELETE FROM todos WHERE id is " + id, function (err, rows) {
            if(err) {
                console.log("Database error while deleting todo no. " + id + ". Error: " + err);
                res.sendStatus(500);
                return;
            }
            res.sendStatus(200);
        });
    });

    app.post("/api/update", function (req, res) {
        const id = req.body.id;
        const title = req.body.title;
        const description = req.body.description;
        const done = req.body.done === "Ja";
        const deadline = req.body.deadline;

        if(!id||!title||!description||!deadline){
            const response = '{ "Status": "Failure", "Message": "Informationen fehlen." }';
            res.status(406).json(JSON.parse(response));
            return;
        }

        db.run("UPDATE todos SET title='" + title + "', description='" + description + "', done=" + done + ", deadline='" + deadline + "' WHERE id = " + id, function (err, rows) {
            if(err) {
                console.log("Database error while updating todo. Error: " + err);
                res.sendStatus(406);
                return;
            }
            res.sendStatus(200);
        });
    });

    app.post("/api/get", function (req, res) {
        const id = req.body.id;
        if(!id){
            const response = '{ "Status": "Failure", "Message": "id fehlt" }';
            res.status(406).json(JSON.parse(response));
            return;
        }
        db.all("SELECT * FROM todos WHERE id = " + id, function(err, rows) {
            if(err) {
                console.log("Database error while getting todo no. " + id + ". Error: " + err);
                res.sendStatus(500);
                return;
            }
            res.json(rows);
        });
    });

}

// Export modules
module.exports = {
    createRoutes
};
