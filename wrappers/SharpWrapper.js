'use strict';
const sharp = require('sharp');

const SharpWrapper = {
    resizeAndCompress: async (inputBuffer) => {
        const { width, height } = await sharp(inputBuffer).metadata();
        const newImageBuffer = await sharp(inputBuffer).resize(width/2, height/2).jpeg({ quality: 60, mozjpeg: true }).toBuffer();
        return newImageBuffer;
    }
};

module.exports = SharpWrapper;