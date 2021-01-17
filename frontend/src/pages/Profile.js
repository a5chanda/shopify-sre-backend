import React from 'react';
import {Button} from "react-bootstrap";
import {storage, db} from "../config/firebase";

import {ProfileImages} from "../components/ProfileImages";
import {LoadingComponent} from "../components/LoadingComponent";

const DEV_URL="http://localhost:8000";



export class Profile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            user: this.props.user,
            images: [],
            imagesProperties: {},
            files:{},
            isLoading: false,
            publicUserImages: [],
            privateUserImages: []
        };
        this.uploadImage = this.uploadImage.bind(this);
        this.addImages = this.addImages.bind(this);
        this.imagesList = this.imagesList.bind(this);
        this.setPublic = this.setPublic.bind(this);
        this.removeImage = this.removeImage.bind(this);
        this.getUserImages = this.getUserImages.bind(this);
        this.getPrivateImages = this.getPrivateImages.bind(this);
        this.setPublicPrivate = this.setPublicPrivate.bind(this);
        this.deleteImg = this.deleteImg.bind(this);
    }


    addImages(e){
        if(e.target.files[0]){
            let stateArr = this.state.images;
            let tempProperties = this.state.imagesProperties;
            let tempFiles = this.state.files;
            Array.from(e.target.files).forEach(image => {
                stateArr.push(image);    
                tempProperties[image.name] = true; //Sets all image to private by default 
                tempFiles[image.name] = image;
            });   
            this.setState({images: stateArr, files: tempFiles});
            console.log(this.state);

        }
    }

    uploadImage(){
        
        if(this.state.images){
            console.log(this.state.images);
            this.setState({isLoading: true});
            let imagesInfo = this.state.images.map(img => {
                return {
                    name: img.name,
                    type: img.type,
                    uploadedTime: Date(),
                    isPublic: this.state.imagesProperties[img.name]
                };
            });
            console.log(imagesInfo);
            
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid: this.state.user.uid, images: imagesInfo})
            };

            fetch(DEV_URL + "/addImages", requestOptions)
            .then(response =>{
                return response.json()
            }).then(data =>{
                data.forEach(image =>{
                    console.log(image);

                    let uploadRoute = this.state.imagesProperties[image.name] ? "publicImages/" : "privateImages/";
                    const uploadTask = storage.ref(`${uploadRoute}${this.state.user.uid}/${image.id}`).put(this.state.files[image.name]);

                    uploadTask.on("state_changed", snapshot => {}, error =>{
                        console.log(error);
                    },
                    ()=>{
                        storage.ref(`${uploadRoute}${this.state.user.uid}/`).child(`${image.id}`)
                        .getDownloadURL()
                        .then(url => {
                            let tempUserImages = this.state.imagesProperties[image.name] ? this.state.publicUserImages : this.state.privateUserImages;
                            let obj = {};
                            obj[image.id] = url;
                            tempUserImages.push(obj);
                            if(this.state.imagesProperties[image.name]){
                                this.setState({publicUserImages: tempUserImages});
                            }
                            else{
                                this.setState({privateUserImages: tempUserImages});
                            }
                            
                            console.log(this.state);
                        });
                    });  
                });
                return true;


            
            }).then(data=>{
                //Clear images state once upload is finished
                this.setState({files: {}, images: [], imagesProperties: {}, isLoading: false});
            });
        }
    }

    setPublic(img){  
        let temp = this.state.imagesProperties;
        temp[img] = !temp[img];
        this.setState({imagesProperties: temp});
        console.log(this.state);
    }

    removeImage(img){
        let tempProperties = this.state.imagesProperties;
        let tempFiles = this.state.files;
        delete tempProperties[img];
        delete tempFiles[img];
        

        let index = -1;
        for(let i = 0; i < this.state.images.length; i++){
            //console.log("deleting", this.state.images[i]);
            if(this.state.images[i].name === img){
                index = i;
                break;
            }
        }
        this.state.images.splice(index,1); 
        this.setState({imagesProperties: tempProperties, files: tempFiles});
    }

    imagesList(){
        let imageNames = this.state.images.map( img =>{
            return (
                <li className="row d-flex justify-content-center"key={img.name} style={{marginBottom:"2%"}}>
                    {img.name} 
                    {/* <span style={{justifyContent: "right"}}> */}
                        <Button variant={this.state.imagesProperties[img.name] ? "warning" : "success"} 
                                value={img.name} 
                                style={{marginLeft: "15%"}}
                                onClick= {()=>{this.setPublic(img.name);}}> 
                                { this.state.imagesProperties[img.name] ?  <>Set Private</> : <> Set Public </>}
                        </Button>
                        <Button variant="danger" 
                                value={img.name} 
                                style={{marginLeft: "2%"}}
                                onClick= {()=>{this.removeImage(img.name);}}> 
                                Delete
                        </Button>
                    {/* </span> */}
                </li>
            );
        })
        console.log(this.state.images);
        return (
             
            <ul style={{listStyleType: "none"}}>{imageNames}</ul>
        );
    }

    getUserImages(){
        let getTask= storage.ref(`publicImages/${this.state.user.uid}`);
        console.log("here");
        getTask.listAll().then(res=>{
            let tempImageUris = res.items.map(imgRef => {
                let obj = {};
                return imgRef.getDownloadURL().then(uri=>{
                    obj[imgRef.name] = uri;
                    return obj;
                });
            });
            return Promise.all(tempImageUris);
        }).then(images=>{
            this.setState({publicUserImages: images});
            console.log(this.state.publicUserImages);
        });
    }

    getPrivateImages(){
        let getPrivate = storage.ref(`privateImages/${this.state.user.uid}`);
        console.log("here");
        getPrivate.listAll().then(res=>{
            let tempImageUris = res.items.map(imgRef => {
                let obj = {};
                return imgRef.getDownloadURL().then(uri=>{
                    obj[imgRef.name] = uri;
                    return obj;
                });
            });
            return Promise.all(tempImageUris);
        }).then(images=>{
            this.setState({privateUserImages: images});
            console.log(this.state.privateUserImages);
        });
    }

    deleteImg(imgID, isPublic){
        console.log(imgID, isPublic);


        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                uid: this.state.user.uid, 
                imageID: imgID,
                isPublic: isPublic
            })
        };

        fetch(DEV_URL + "/deleteImage", requestOptions)
        .then(response =>{
            return response.json();
        });

        //Delete from public images
        if(isPublic){
            let arr = this.state.publicUserImages;
            for(let i = 0; i < arr.length; i++){
                if(Object.keys(arr[i])[0] == imgID){
                    arr.splice(i, 1);
                    break;
                }
            }
            this.setState({publicUserImages: arr});
        }
        //delete from private images
        else{
            let arr = this.state.privateUserImages;
            for(let i = 0; i < arr.length; i++){
                if(Object.keys(arr[i])[0] == imgID){
                    arr.splice(i, 1);
                    break;
                }
            }
            this.setState({privateUserImages: arr});
        }

    }

    setPublicPrivate(imgID, isPublic){
        let arr = [];
        let secondaryArr = [];
        console.log(imgID, isPublic);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                uid: this.state.user.uid, 
                imageID: imgID,
                isPublic: isPublic
            })
        };

        fetch(DEV_URL + "/updateVisibility", requestOptions)
        .then(response =>{
            return response.json();
        });



        arr = isPublic ? this.state.publicUserImages : this.state.privateUserImages;
        secondaryArr = isPublic ? this.state.privateUserImages : this.state.publicUserImages;


        for(let i = 0; i < arr.length; i++){
            if(Object.keys(arr[i])[0] === imgID){
                secondaryArr.push(arr[i]);
                arr.splice(i,1);
                if(isPublic){
                    this.setState({privateUserImages: secondaryArr, publicUserImages: arr});
                }
                else{
                    this.setState({publicUserImages: secondaryArr, privateUserImages: arr});
                }
                console.log(this.state);
                break;
            }
        }
       

    }


    componentDidMount(){
        console.log(this.props.user); 
        this.getUserImages();     
        this.getPrivateImages();
    }

    lineBr = () =>{
        return(
            <hr style={{ color: "white", marginTop:"5%", backgroundColor: "white", height: 0.5, opacity: "30%"}} />
        );
    }

    render() {
        return (
            <div className="Profile" style={{marginTop: "15%"}}>

                <h1 style={{marginBottom:"30px"}}> {this.state.user.displayName}'s Profile</h1>
                <hr style={{ color: "white",marginBottom:"5%", backgroundColor: "white",width:"50%",height: 5, opacity: "60%"}} />        

                <h2 style={{marginBottom: "3%"}}>Upload <LoadingComponent isLoading={this.state.isLoading} /></h2>
                
                
                <input type="file" style={{    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}} onChange={this.addImages} multiple />

                {
                    this.state.images.length ? 
                    <>
                        <Button onClick={this.uploadImage} style={{marginLeft: "20px"}}> Upload </Button>
                        <h4 style={{marginTop: "5%"}}>Images Being Uploaded</h4>
                        <div style={{marginTop: "5%"}}>{this.imagesList()}</div> 
                    </> 
                    : 
                    <>
                        <Button style={{marginLeft: "20px"}} onClick={this.uploadImage} disabled > Upload </Button>
                    </>
                }   
                

                <this.lineBr/>
               
                <h3 style={{textAlign:"left", marginTop: "5%", marginBottom:"5%"}}>Public Images</h3>
                {this.state.publicUserImages.length ? 
                    <ProfileImages  user={this.state.user} 
                                    images={(this.state.publicUserImages)}
                                    deleteImg={this.deleteImg} 
                                    isPublic={true}
                                    setPublicPrivate={this.setPublicPrivate}/>                
                    : 
                    <></>
                }


                <h3 style={{textAlign:"left", marginTop: "5%", marginBottom:"5%"}}>Private Images</h3>
                {this.state.privateUserImages.length  ? 
                    <ProfileImages  user={this.state.user} 
                                    images={this.state.privateUserImages}
                                    deleteImg={this.deleteImg}
                                    isPublic={false}
                                    setPublicPrivate={this.setPublicPrivate}/> 
                        :           
                        <></>
                }

            </div>
        );
    }
}

