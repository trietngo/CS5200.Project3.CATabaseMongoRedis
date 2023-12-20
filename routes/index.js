let express = require('express');
let router = express.Router();

// Import Redis

const { createClient } = require("redis");

let redisClient = createClient()
        .on("error", (err) => console.log("Redis Client connection error " + err))
        .connect();
console.log("Connected to Redis Client");

const {
  getAllCats,
  getCatById,
  updateCatById,

  getAllShelters,
  getShelterById,
  updateShelterById,
  deleteShelterById,
  createNewShelter,
  

  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  createNewUser
} = require("../controllers/controllers");

/* GET home page. */
router.get('/', async function(req, res, next) {

  //await (await redisClient).LPUSH('activities', "Home Accessed.");

  res.render('index', { title: 'CATabase - Now With MongoDB and Redis!' });
});

/* GET All Cats */
router.get('/cats', async function(req, res, next) {

  const cats = await getAllCats();

  console.log(cats);

  const activity = {
    _id: new Date().getTime(),
    message: "Cat Database Accessed."
  }

  console.log("Activity:", activity);

  await (await redisClient).LPUSH('activities', JSON.stringify(activity));

  res.render('cats', { title: 'All Available Cats', cats });

});

/* GET Individual Cats */
router.get('/cats/:catID', async function(req, res, next) {

  const catID = req.params.catID;

  //console.log("Route Cat ID:", catID);
  const catInd = await getCatById(parseInt(catID));

  // Get all shelters
  const shelters = await getAllShelters();

  const activity = {
    _id: new Date().getTime(),
    message: "Cat ID " + catID + " Accessed."
  }

  await (await redisClient).LPUSH('activities', JSON.stringify(activity));
  
  res.render('catInd', { title: 'Cat ID: ' + req.params.catID, catInd, shelters });
});

/* Update Individual Cats */
router.post('/cats/:catID', async function(req, res, next) {
  
  const catID = parseInt(req.body.catID);
  const catName = req.body.catName;
  const catWeightLbs = parseFloat(req.body.catWeightLbs);

  console.log("ID: ", catID);
  console.log("Name: ", catName);
  console.log("Weight: ", catWeightLbs);

  const updated = await updateCatById(catID, catName, catWeightLbs);

  const activity = {
    _id: new Date().getTime(),
    message: "Cat ID " + catID + " Updated."
  }

  await (await redisClient).LPUSH('activities', JSON.stringify(activity));

  res.redirect('/cats');
});

/* Create a new cat */
// router.get('/create', async function(req, res, next) {

//   const shelters = await getAllShelters();

//   res.render('catCreate', { title: 'Add a New Cat', shelters });
// });

// router.post('/create/new', async function(req, res, next) { 

  
  
//   const catName = req.body.catName;
//   const catBirthday = req.body.catBirthday;
//   const catBreed = req.body.catBreed;
//   const catPersonality = req.body.catPersonality;
//   const catWeightLbs = parseFloat(req.body.catWeightLbs);
//   const catShelter = await getShelterById(parseInt(req.body.catShelter));

//   console.log("Name: ", catName);
//   console.log("Birthday: ", catBirthday);
//   console.log("Breed: ", catBreed);
//   console.log("Personality: ", catPersonality);
//   console.log("Weight: ", catWeightLbs);
//   console.log("Shelter: ", catShelter[0]);


//   await insertCat(req.body);

//   res.redirect('/cats');
// });

/* GET All Shelters */
router.get('/shelters', async function(req, res, next) {

  const shelters = await getAllShelters();

  res.render('shelters', { title: 'All Available Shelters', shelters });

  const activity = {
    _id: new Date().getTime(),
    message: "Shelter Database Accessed."
  }

  await (await redisClient).LPUSH('activities', JSON.stringify(activity));

  //console.log(shelters);
});

/* GET Individual Shelters */
router.get('/shelters/:shelterID', async function(req, res, next) {

  const shelterID = req.params.shelterID;

  const shelterInd = await getShelterById(parseInt(shelterID));

  console.log(shelterInd);

  const activity = {
    _id: new Date().getTime(),
    message: "Shelter ID " + shelterID + " Accessed."
  }

  await (await redisClient).LPUSH('activities', JSON.stringify(activity));

  res.render('shelterInd', { title: 'Shelter ID: ' + req.params.shelterID, shelterInd });
});

/* Update Individual Shelters */
router.post('/shelters/:shelterId', async function(req, res, next) {
  
  console.log(req.body);
  
  const shelterId = parseInt(req.body.shelterID);
  const shelterName = req.body.shelterName;
  const shelterLocation = req.body.shelterLocation;
  const shelterEmail = req.body.shelterEmail;
  const shelterPhone = req.body.shelterPhone;

  console.log("ShelterId: ", shelterId);
  console.log("ShelterName: ", shelterName);
  console.log("ShelterLocation: ", shelterLocation);
  console.log("ShelterEmail: ", shelterEmail);
  console.log("ShelterPhone: ", shelterPhone);

  await updateShelterById(shelterId, shelterName, shelterLocation, shelterEmail, shelterPhone);

  const indShelter = await getShelterById(shelterId);

  const activity = {
    _id: new Date().getTime(),
    message: "Shelter ID " + shelterId + " Updated."
  }

  await (await redisClient).LPUSH('activities', JSON.stringify(activity));

  res.redirect('/shelters');
});

/* Create Shelter */
router.get('/shelterCreate', async function(req, res, next) {

  res.render('shelterCreate', { title: 'Add a New Shelter' });
});

router.post('/shelterCreate/new', async function(req, res, next) { 

  console.log(req.body);
  
  const shelterName = req.body.shelterName;
  const shelterLocation = req.body.shelterLocation;
  const shelterEmail = req.body.shelterEmail;
  const shelterPhone = req.body.shelterPhone;

  console.log("Shelter Name:", shelterName)
  console.log("Shelter Location:", shelterLocation)

  await createNewShelter(shelterName, shelterLocation, shelterEmail, shelterPhone);

  const activity = {
    _id: new Date().getTime(),
    message: "Shelter Name " + shelterName + " Added."
  }

  await (await redisClient).LPUSH('activities', JSON.stringify(activity));

  res.redirect('/shelters');
});

/* Delete Individual Shelter */
router.get('/shelters/:shelterId/delete', async function(req, res, next) {

  const shelterId = parseInt(req.params.shelterId);

  await deleteShelterById(shelterId);

  const activity = {
    _id: new Date().getTime(),
    message: "Shelter ID " + shelterId + " Deleted."
  }

  await (await redisClient).LPUSH('activities', JSON.stringify(activity));
  
  res.redirect('/shelters');
});

/* GET All Users */
router.get('/users', async function(req, res, next) {

  const users = await getAllUsers();

  const activity = {
    _id: new Date().getTime(),
    message: "User Database Accessed."
  }

  await (await redisClient).LPUSH('activities', JSON.stringify(activity));

  res.render('users', { title: 'All Available Users', users });

  //console.log(users);
});

/* GET Individual Users */
router.get('/users/:userId', async function(req, res, next) {

  const userId = req.params.userId;

  const userInd = await getUserById(parseInt(userId));

  const activity = {
    _id: new Date().getTime(),
    message: "User ID " + userId + " Accessed."
  }

  await (await redisClient).LPUSH('activities', JSON.stringify(activity));

  res.render('userInd', { title: 'User ID: ' + req.params.userId, userInd });
});

/* Update Individual Users */
router.post('/users/:userId', async function(req, res, next) {  
  
  console.log(req.body);
  
  const userId = parseInt(req.body.userId);
  const userFname = req.body.userFname;
  const userLname = req.body.userLname;
  const userAddress = req.body.userAddress;
  const userEmail = req.body.userEmail;
  const userPhone = req.body.userPhone;

  console.log("UserID:", userId);
  console.log("UserFName:", userFname);
  console.log("UserLName:", userLname);
  console.log("UserAddress:", userAddress);
  console.log("UserEmail:", userEmail);
  console.log("UserPhone:", userPhone);

  await updateUserById(userId, userFname, userLname, userAddress, userEmail, userPhone);

  const userInd = await getUserById(userId);

  const activity = {
    _id: new Date().getTime(),
    message: "User ID " + userId + " Updated."
  }

  await (await redisClient).LPUSH('activities', JSON.stringify(activity));

  res.redirect('/users');
});

/* Delete Individual User */
router.get('/users/:userID/delete', async function(req, res, next) {

  const userID = parseInt(req.params.userID);

  await deleteUserById(userID);

  const activity = {
    _id: new Date().getTime(),
    message: "User ID " + userID + " Deleted."
  }

  await (await redisClient).LPUSH('activities', JSON.stringify(activity));
  res.redirect('/users');
});

/* Create User */
router.get('/userCreate', async function(req, res, next) {

  res.render('userCreate', { title: 'Add a New User' });
});

router.post('/userCreate/new', async function(req, res, next) { 

  console.log(req.body);
  
  const userFname = req.body.userFname;
  const userLname = req.body.userLname;
  const userAddress = req.body.userAddress;
  const userEmail = req.body.userEmail;
  const userPhone = req.body.userPhone;

  await createNewUser(userFname, userLname, userAddress, userEmail, userPhone);

  const activity = {
    _id: new Date().getTime(),
    message: "User ID " + userFname + " " + userLname + " Created."
  }

  await (await redisClient).LPUSH('activities', JSON.stringify(activity));

  res.redirect('/users');
});

/* GET All Activities log */
router.get('/activities', async function(req, res, next) {

  const activities = await (await redisClient).LRANGE("activities", 0, -1);

  await (await redisClient).LTRIM("activities", 0, 9);

  console.log("Activities are:", activities);

  res.render('activities', { title: 'Activity Log', activities });

});

/* GET Individual Activity */
router.get('/activities/:_id', async function(req, res, next) {

  const _id = req.params._id;

  const activities = await (await redisClient).LRANGE("activities", 0, -1);

  for (let activity of activities) {
    if (_id == activity) {

      const activityInd = activity;

      res.render('activityInd', { title: 'Activity ID: ' + JSON.parse(activity)._id, activityInd });
    }
  }
});

/* Update Individual Activity */
router.post('/activities/:_id', async function(req, res, next) { 

  const _id = req.params._id;
  
  const actID = req.body.actID;
  const actMessage = req.body.actMessage;

  console.log(req.body);

  console.log(actID);
  console.log(actMessage);

  const activities = await (await redisClient).LRANGE("activities", 0, -1);

  // Find the index of the element that needs to be updated
  let index = 0;

  for (let activity of activities) {
    if (_id == activity) {

      let updatedActivity = '{"_id"' + ':' + actID + ',' + '"message":"' + actMessage + '"}';

      console.log("Updated activity is:", updatedActivity);

      // Update info
      
      await (await redisClient).LSET("activities", index, updatedActivity);
    }

    index = index + 1;
  }

  res.redirect('/activities');
});

/* Delete Individual Activity */
router.get('/activities/:_id/delete', async function(req, res, next) {

  const activity = req.params._id;

  console.log(activity);

  await (await redisClient).LREM('activities', 0, activity);
  res.redirect('/activities');
});

module.exports = router;
