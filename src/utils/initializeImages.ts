import ImageKit from 'imagekit'

let imagesClient: ImageKit;

export const startImagesClient = () => {
    imagesClient =  new ImageKit({
        publicKey: "public_w10vAzt/XWRMDXbFUTzXVLidMKQ=",
        privateKey: "private_J7dNftvEQkoTIoOiXhIqJk1huoA=",
        urlEndpoint: "https://ik.imagekit.io/fsfsb1a9k",
    })
}



export const uploadImage = (imageData: any, imageName: any) => {
    return new Promise((resolve, reject) => {
        imagesClient.upload({
            file: imageData,
            fileName: imageName
        }, (error, result) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                resolve(result?.url);
            }
        });
    });
}