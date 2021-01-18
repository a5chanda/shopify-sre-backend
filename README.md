# Shopify SRE/Backend Challenge
Shopify's backend and SRE challenge 2021


### Try it out here: 
The server on heroku may take a few seconds to start up

https://shopify-image-repo-frontend.herokuapp.com/

## Features

The current platform has the following features:
- Secure log-in with Google
- Secure File Upload
- Batch Image Upload
- Access Control for public/private images 
- Secure deletion of images
- View everyone's public images


## Platform Overview

### Backend Implementation
The backend is developed with Express.js and Firebase. The server has several endpoints set up to facilitate the interactions between the front-end react application and Firebase.


- When a user searches by images, it returns the list of similar images, ordered by the closest match

## Next Steps
Currently the infrastructure is set up to incorporate search of tags and integration with Google Vision API to auto generate tags/descriptions. In addition, the repository can currently hold other file types such as pdfs


