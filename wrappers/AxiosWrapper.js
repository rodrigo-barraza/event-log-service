'use strict';
const request = require('axios');

const AxiosWrapper = {
    post(url, data, headers, callback) {
        return axios({
            method: 'post',
            url: url,
            data: data,
            headers: headers,
            json: true,
        })
        .then(function (response) {
            console.log(response);
        });
    },
    get(url, body, headers, callback) {
        return request.get({
            url: url,
            body: body,
            headers: headers,
            json: true,
        }, (httpError, httpResponse, body) => {
            callback(httpError, body);
        });
    },
    put(url, headers, callback) {
        return request.put({
            url: url,
            headers: headers,
            json: true,
        }, (httpError, httpResponse, body) => {
            callback(body, httpError);
        });
    },
    delete(url, body, headers, callback) {
        return request.post({
            url: url,
            body: body,
            headers: headers,
            json: true,
        }, (httpError, httpResponse, body) => {
            callback(body, httpError);
        });
    },
    patch(url, body, headers, callback) {
        return request.patch({
            url: url,
            body: body,
            headers: headers,
            json: true,
        }, (httpError, httpResponse, body) => {
            callback(body, httpError);
        });
    },
    getForm(url, form, headers, callback) {
        return request.get({
            url: url,
            form: form,
            headers: headers,
            json: true,
        }, (httpError, httpResponse, body) => {
            callback(httpError, body);
        });
    },
    postForm(url, form, headers, callback) {
        return request.post({
            url: url,
            form: form,
            headers: headers,
            json: true,
        }, (httpError, httpResponse, responseBody) => {
            // console.log('form', form);
            // console.log('responseBody', responseBody);
            callback(httpError, responseBody);
        });
    },
};

module.exports = AxiosWrapper;