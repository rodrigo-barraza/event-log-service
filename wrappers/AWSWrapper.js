'use strict';
const AWS = require('aws-sdk');
const crypto = require('crypto');
// import AWS from 'aws-sdk'

// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
// })

// // URL
// const imageURL = 'https://url-to-image.jpg'
// const res = await fetch(imageURL)
// const blob = await res.buffer()
// // Upload
// const imagePath = req.files[0].path
// const blob = fs.readFileSync(imagePath)


// const uploadedImage = await s3.upload({
//     Bucket: process.env.AWS_S3_BUCKET_NAME,
//     Key: req.files[0].originalFilename,
//     Body: blob,
//   }).promise()

// console.log(uploadedImage.Location)

const AWSWrapper = {
    imageUploadBase64: async (base64) => {
        const { AWS_S3_ACCESS_KEY_ID, AWS_S3_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET } = process.env;
      
        AWS.config.setPromisesDependency(require('bluebird'));
        AWS.config.update({ accessKeyId: AWS_S3_ACCESS_KEY_ID, secretAccessKey: AWS_S3_SECRET_ACCESS_KEY, region: AWS_REGION });
      
        const s3 = new AWS.S3();
      
        // const base64Data = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        // const type = base64.split(';')[0].split('/')[1];

        const base64Data = new Buffer.from(base64, 'base64');
        const type = 'jpg';

        const uuid = crypto.randomUUID();
      
        const params = {
          Bucket: AWS_S3_BUCKET,
          Key: `${uuid}.${type}`, // type is not required
          Body: base64Data,
          ACL: 'public-read',
          ContentEncoding: 'base64', // required
          ContentType: `image/${type}` // required. Notice the back ticks
        }
      
        let location = '';
        let key = '';
        try {
          const { Location, Key } = await s3.upload(params).promise();
          location = Location;
          key = Key;
        } catch (error) {
            console.log(2, error)
        }
      
        return location;
    }
};

module.exports = AWSWrapper;