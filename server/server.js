const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const port = 8000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }), bodyParser.json());



//Firebase Initialization
const firebaseConfig = require("./config/firebaseConfig.json");
var admin = require("firebase-admin");

var serviceAccount = require("./config/shopify-backend-firebase-adminsdk.json");

var firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: firebaseConfig.databaseURL,
    storageBucket: firebaseConfig.storageBucket
});

//Firebase Firestore object
const db = firebaseApp.firestore();
const storage = firebaseApp.storage().bucket();

var usersRef = db.collection('users');


function addImages(images, uid){
    return new Promise((resolve, reject) =>{
        try{
            usersRef.doc(uid).get().then(docs=>{
                //Check if valid uid
                console.log(docs.data());
                if(docs.data()){
                    let updatedInfo = images.map(image => {
                        //Create new image reference in the user's collection
                        const newImgRef = usersRef.doc(uid).collection("allImages").doc();
                        usersRef.doc(uid).collection("allImages").doc(newImgRef.id).set({
                            id: newImgRef.id,
                            name: image.name,
                            type: image.type,
                            tags: [],
                            isPublic: image.isPublic
                        });
                        if(image.isPublic){
                            usersRef.doc(uid).update({
                                publicImageIds: admin.firestore.FieldValue.arrayUnion(newImgRef.id)
                            })
                        }
                        return {name: image.name, id: newImgRef.id};
                    });
                    resolve(updatedInfo);
                }
                //Invalid uid
                else{
                    resolve("Invalid User");
                }
            });
        } 
        catch(err){
            reject(err);
        }
    });
}

function createUser(userInfo){
    return new Promise((resolve, reject) =>{
        try {
            usersRef.where("uid", "==", userInfo.uid).onSnapshot( querySnapshot =>{
                console.log(querySnapshot.docs);
                if(querySnapshot.docs.length){
                    resolve("User exists!")
                }
                else{
                    usersRef.doc(userInfo.uid).set({
                        uid: userInfo.uid,
                        publicImageIds: []
                    });
                    usersRef.doc(userInfo.uid).collection("allImages");
                    resolve("Successfully added user!");
                }
            });     
        } catch (error) {
            reject(error);
        }
    });
}

function deleteImage(uid, imageID, isPublic){
    return new Promise((resolve, reject) => {
        let path = isPublic ? `publicImages/${uid}/${imageID}` : `privateImages/${uid}/${imageID}`;
        try{
            storage.file(path).delete().then(data=>{
                return data;
            }).then(()=>{
                usersRef.doc(uid).collection("allImages").doc(imageID).delete().then( data => {
                    resolve("Deleted Image", imageID);
                });
            });
        }
        catch(err){
            reject("Error Deleting Image");
        }
    });
}

function getPublicImages(){
    return new Promise((resolve, reject)=>{
        try {
            storage.getFiles({directory: 'publicImages/'}).then(data=>{
                return(data[0]);
            }).then(images=>{
                let urls = images.map(image => {
                    
                    if(image.metadata['contentType'].includes("image")){
                        console.log(image.name);
                        return image.getSignedUrl({action: 'read', expires: '03-09-2491'}).then(url =>{
                            return url;
                        });
                    }
                });
                let obj = {};
                let name = images[0].name;
                let user = name.substring(name.indexOf("/")+1, name.lastIndexOf("/"));
                
                return Promise.all(urls);
            }).then(data =>{
                let result = [];
                data.forEach(img=>{
                    if(img){
                        result.push(img[0]);
                    }  
                });
                resolve(result);
            });
        } catch (error) {
            reject(error);
        }
    });
}

function updateVisibility(uid, imageID, isPublic){
    return new Promise((resolve, reject) =>{
        try{
            const curpath = isPublic ? `publicImages/${uid}/${imageID}` : `privateImages/${uid}/${imageID}`;
            const newPath = isPublic ? `privateImages/${uid}/${imageID}` : `publicImages/${uid}/${imageID}` ;
            const file = storage.file(curpath);
            file.move(newPath).then(()=>{
                usersRef.doc(uid).collection("allImages").doc(imageID).get().then(docs=>{
                    if(docs.data()){
                        usersRef.doc(uid).collection("allImages").doc(imageID).update({
                            isPublic: !isPublic
                        });
                        resolve("Updated Image Visibility to ", isPublic);
                    }
                    else{
                        throw "UNABLE TO UPDATE VISIBILITY";
                    } 
                });
            });         
         
        }
        catch(err){
            reject("UNABLE TO UPDATE VISIBILITY");
        }

    });
}


//************ ENDPOINTS *****************/
app.get('/', (req, res) => {
  res.send('Image API Server')
});

app.get('/getUserInfo', (req, res) =>{

});


//Updates the Visibility of an image for the specified user. 
app.post('/updateVisibility', (req, res) =>{
    updateVisibility(req.body.uid, req.body.imageID, req.body.isPublic).then( result =>{
        res.send(JSON.stringify(result));
    });
});

app.post('/deleteImage', (req, res)=>{
    deleteImage(req.body.uid, req.body.imageID, req.body.isPublic).then(result =>{
        res.send(JSON.stringify("Deleted image"));
    });
});

app.post('/createUser', (req, res)=>{
    createUser(req.body).then((result)=>{
        res.send(result);
    });
});

app.post('/addImages', (req, res) => {
    addImages(req.body.images, req.body.uid).then(result =>{
        res.send(JSON.stringify(result));
    });
});

app.get('/getImages', (req, res) => {
    getPublicImages().then(images =>{
        res.send(JSON.stringify(images));
    });
});

app.listen(port, () => {
  console.log(`Image Server listening at http://localhost:${port}`)
});


