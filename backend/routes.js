// Define all routes here

function createRoutes(app, db) {
    app.get("/api/all", (req, res) => {
        db.all("SELECT * FROM todos order by done ASC, deadline ASC", function (err, rows) {
            if (err) {
                console.log("{-} [GET /api/all] Database error while getting all todos. Error: " + err);
                res.sendStatus(500);
                return;
            }
            console.log("{+} [GET /api/all] Successful send response.");
            res.json(rows);
        });
    });

    app.post("/api/create", function (req, res) {
        const title = req.body.title;
        const description = req.body.description;
        const done = req.body.done === "Ja";
        const deadline = req.body.deadline;

        if(!title || !description || !deadline) {
            console.log("{-} [POST /api/create] Error. Some arguments seems to missing.");
            const response = '{ "status": "failure", "message": "Bitte fülle alle Felder aus." }';
            res.status(406).json(JSON.parse(response));
            return;
        }

        db.run("INSERT INTO todos (title, description, done, deadline) VALUES ('" + title + "', '" + description + "', " + done + ", '" + deadline + "')", function (err, rows) {
            if(err) {
                console.log("{-} [POST /api/create] Database error while creating new todo. Error: " + err);
                res.sendStatus(500);
                return;
            }
            console.log("{+} [POST /api/create] Successful send response.");
            res.sendStatus(200);
        });
    });

    app.post("/api/delete", function (req, res) {
        const id = req.body.id;

        if(!id) {
            console.log("{-} [POST /api/delete] Found no valid todo id.");
            res.status(406).json(JSON.parse('{ "status":"failure", "message":"Bitte gebe die TODO-ID an." }'));
            return;
        }

        db.run("DELETE FROM todos WHERE id is " + id, function (err, rows) {
            if(err) {
                console.log("{-} [POST /api/delete] Database error while deleting todo with no. " + id + ". Error: " + err);
                res.sendStatus(500);
                return;
            }
            console.log("{+} [POST /api/delete] Successful send response.");
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
            console.log("{-} [POST /api/update] Error. Some arguments seems to missing.");
            const response = '{ "status": "failure", "message": "Bitte fülle alle Felder aus." }';
            res.status(406).json(JSON.parse(response));
            return;
        }

        db.run("UPDATE todos SET title='" + title + "', description='" + description + "', done=" + done + ", deadline='" + deadline + "' WHERE id = " + id, function (err, rows) {
            if(err) {
                console.log("{-} [POST /api/update] Database error while updating todo with no. " + id + ". Error: " + err);
                res.sendStatus(406);
                return;
            }
            console.log("{+} [POST /api/update] Successful send response.");
            res.sendStatus(200);
        });
    });

    app.post("/api/get", function (req, res) {
        const id = req.body.id;
        if(!id){
            const response = '{ "status": "failure", "message": "Bitte gebe die TODO-ID an." }';
            res.status(406).json(JSON.parse(response));
            return;
        }
        db.all("SELECT * FROM todos WHERE id = " + id, function(err, rows) {
            if(err) {
                console.log("{-} [POST /api/get] Database error while getting todo with no. " + id + ". Error: " + err);
                res.sendStatus(500);
                return;
            }
            console.log("{+} [POST /api/get] Successful send response.");
            res.json(rows);
        });
    });

}

// Export modules
module.exports = {
    createRoutes
};
