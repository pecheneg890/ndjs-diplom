db.createUser(
    {
        user: "example_user",
        pwd: "example_password",
        roles: [
            {
                role: "readWrite",
                db: "ndjs-diplom"
            }
        ]
    }
);