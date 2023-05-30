'use strict';
const AWS = require('aws-sdk');
const { nanoid } = require('nanoid');
const crypto = require('crypto');
const SharpWrapper = require('./SharpWrapper');
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
    uploadImage: async (base64) => {
        const { AWS_S3_ACCESS_KEY_ID, AWS_S3_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET } = process.env;
        const id = nanoid(11);
      
        AWS.config.setPromisesDependency(require('bluebird'));
        AWS.config.update({ accessKeyId: AWS_S3_ACCESS_KEY_ID, secretAccessKey: AWS_S3_SECRET_ACCESS_KEY, region: AWS_REGION });
        const s3 = new AWS.S3();

        const base64Data = new Buffer.from(base64, 'base64');
        const type = 'png';
      
        const params = {
          Bucket: AWS_S3_BUCKET,
          Key: `${id}.${type}`, // type is not required
          Body: base64Data,
          ACL: 'public-read',
          ContentType: `image/${type}` // required. Notice the back ticks
        }
      
        let image = '';
        let key = '';
        try {
          const { Location, Key } = await s3.upload(params).promise();
          image = Location.replace('s3.us-west-2.amazonaws.com/', '').replace('generations.rod.dev', 'renders.rod.dev');
          key = Key;
        } catch (error) {
            console.log(error)
        }
        
      
        const params2 = {
          Bucket: AWS_S3_BUCKET,
          Key: `thumbnails/${id}.${type}`, // type is not required
          Body: await SharpWrapper.resizeAndCompress(base64Data),
          ACL: 'public-read',
          ContentType: `image/${type}` // required. Notice the back ticks
        }
      
        let thumbnail = '';
        let key2 = '';

        try {
          const { Location, Key } = await s3.upload(params2).promise();
          thumbnail = Location.replace('s3.us-west-2.amazonaws.com/', '').replace('generations.rod.dev', 'renders.rod.dev');
          key2 = Key;
        } catch (error) {
            console.log(error)
        }
      
        return { image, thumbnail };
    },
    uploadImageThumbnail: async (base64, imageName) => {
      const { AWS_S3_ACCESS_KEY_ID, AWS_S3_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET } = process.env;
      AWS.config.setPromisesDependency(require('bluebird'));
      AWS.config.update({ accessKeyId: AWS_S3_ACCESS_KEY_ID, secretAccessKey: AWS_S3_SECRET_ACCESS_KEY, region: AWS_REGION });
    
      const s3 = new AWS.S3();
      const base64Data = new Buffer.from(base64, 'base64');
      const processedImage = await SharpWrapper.resizeAndCompress(base64Data);
      const type = 'jpg';

      const params2 = {
        Bucket: AWS_S3_BUCKET,
        Key: `thumbnails/${imageName}.${type}`,
        Body: processedImage,
        ACL: 'public-read',
        ContentType: `image/${type}`
      }
    
      let thumbnail = '';

      try {
        const { Location, Key } = await s3.upload(params2).promise();
        thumbnail = Location.replace('s3.us-west-2.amazonaws.com/', '').replace('generations.rod.dev', 'renders.rod.dev');
      } catch (error) {
          console.log(error)
      }
    
      return { id, image, thumbnail };
    }
};

module.exports = AWSWrapper;