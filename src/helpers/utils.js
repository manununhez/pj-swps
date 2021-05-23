import Parser from 'ua-parser-js';


export const NOT_AVAILABLE = 'N/A';

const _returnInfo = (infoglass) => {
    const os = (infoglass.os) ? infoglass.os : NOT_AVAILABLE;
    const vendor = (infoglass.device.vendor) ? infoglass.device.vendor : NOT_AVAILABLE;
    const model = (infoglass.device.model) ? infoglass.device.model : NOT_AVAILABLE;
    const type = (infoglass.device.type) ? infoglass.device.type : NOT_AVAILABLE;
    const device = { vendor: vendor, model: model, type: type };
    const browserName = (infoglass.browser.name) ? infoglass.browser.name : NOT_AVAILABLE;
    const browserVersion = (infoglass.browser.version) ? infoglass.browser.version : NOT_AVAILABLE;
    const browserMajor = (infoglass.browser.major) ? infoglass.browser.major : NOT_AVAILABLE;
    const browser = { name: browserName, version: browserVersion, major: browserMajor, language: window.navigator.language };
    const engineName = (infoglass.engine.name) ? infoglass.engine.name : NOT_AVAILABLE;
    const engineVersion = (infoglass.engine.version) ? infoglass.engine.version : NOT_AVAILABLE;
    const engine = { name: engineName, version: engineVersion };
    const screen = { width: window.screen.width, height: window.screen.height };

    return { os, device, browser, engine, screen };
};
export const USER_INFO = _returnInfo(Parser(window.navigator.userAgent));


/**
 * Function to generate random number - inclusive range
 * Source: https://www.geeksforgeeks.org/how-to-generate-random-number-in-given-range-using-javascript/
 * @param {*} min 
 * @param {*} max 
 */
export function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 * If collections isEmpty
 * @param {*} obj 
 */
export function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}