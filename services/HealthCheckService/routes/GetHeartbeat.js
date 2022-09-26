'use strict';
const ResponseClass = require.main.require('./classes/ResponseClass');

const GetHeartbeat = () => {
    return (req, res) => {
        const response = new ResponseClass(res);
        
        return response.sendSuccessMessage('');
    }
};

module.exports = GetHeartbeat;