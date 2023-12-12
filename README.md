# CS5200.Project3.CATabaseMongoRedis
A Node.js + EJS database containing Cats, Shelters, and Users and an activity log implemented using Redis List.

How to run the Catabase App with Redis:

1. Use MongoDB Compass or on the mongosh shell. Make sure the port is localhost:27017
2. Create a database named "catabase" in MongoDB Compass or mongosh with following collections: "cats" from CatsDoc.json, "shelters" from SheltersDoc.json, "users" from UsersDoc.json
3. Open a different terminal and start Redis Server
4. Run "npm start" or "nodemon" and access localhost:3000 on a browser to interact with the app
5. Interact with the app and check the "Activity Log with Redis" tab to see, edit, and delete the logged actions. For certain actions, an activity is logged onto the list.
6. Use MongoDB Compass or mongosh to check query results.

Note: Users cannot create or delete Cats, but can perform full CRUD operations on Shelters and Users, and Activity Log
