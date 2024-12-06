import React, { Component } from "react";
import { CLOUD_NAME, UPLOAD_PRESET } from "../../helpers/AdminHelper";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

export let IMAGE_URL = ''

class CloudinaryUploadWidget extends Component {
    componentDidMount() {
        const cloudName = CLOUD_NAME; // replace with your own cloud name
        const uploadPreset = UPLOAD_PRESET; // replace with your own upload preset

        IMAGE_URL = ''

        var myWidget = window.cloudinary.createUploadWidget(
            {
                cloudName: cloudName,
                uploadPreset: uploadPreset,
                // cropping: true, //add a cropping step
                // showAdvancedOptions: true,  //add advanced options (public_id and tag)
                sources: [ "local", "url"], // restrict the upload sources to URL and local files
                multiple: false,  //restrict upload to a single file
                // folder: "user_images", //upload files to the specified folder
                // tags: ["users", "profile"], //add the given tags to the uploaded files
                // context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
                // clientAllowedFormats: ["images"], //restrict uploading to image files only
                // maxImageFileSize: 2000000,  //restrict file size to less than 2MB
                // maxImageWidth: 2000, //Scales the image down to a width of 2000 pixels before uploading
                //theme: "purple", //change to a purple theme
            },
            (error, result) => {
                if (!error && result && result.event === "success") {
                    IMAGE_URL = result.info.secure_url
                }
            }
        );
        document.getElementById("upload_widget").addEventListener(
            "click",
            function () {
                myWidget.open();
            },
            false
        );
    }

    render() {
        return (
            <button id="upload_widget" className="cloudinary-button- bg-penn-blue px-6 py-2 rounded-lg text-white hover:bg-blue-800">
                <span><AddPhotoAlternateIcon className='mr-2 align-text-top' fontSize='small' /> Subir foto </span>
            </button>
        );
    }
}

export default CloudinaryUploadWidget;