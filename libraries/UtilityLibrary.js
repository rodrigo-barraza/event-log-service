'use strict';
const StyleCollection = require.main.require('./collections/StyleCollection');
const UtilityLibrary = {
    generatePrompts(prompt, negativePrompt, style) {
        let generatedPrompt = prompt;
        let generatedNegativePrompt;
        const stylePrompt = style ? StyleCollection.find(collectionStyle => collectionStyle.value === style) : '';
        if (stylePrompt.prompt) {
            generatedPrompt = ` ${stylePrompt.prompt}, ${prompt}`;
        }
        if (stylePrompt.negativePrompt) {
            generatedNegativePrompt = `${stylePrompt.negativePrompt}, ${negativePrompt}`;
        }
        return {generatedPrompt, generatedNegativePrompt};
    },
    generateDimensions(aspectRatio) {
        let width = 768;
        let height = 768;
        if (aspectRatio === 'portrait') {
            width = 768;
            height = 960;
        } else if (aspectRatio === 'landscape') {
            width = 960;
            height = 768;
        }
        return {width, height};
    }
};

module.exports = UtilityLibrary;
