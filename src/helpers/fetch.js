import axios from 'axios';
import * as constant from '../helpers/constants';

const _apiHost = 'https://api.swps-pjatk-experiment.co/v1/';
const fetch_versions_url = 'versions'
const fetch_apptext_url = 'apptext'
const fetch_inituserdata_url = 'inituserdata'
const save_visualpattern_url = 'visualpattern';
const save_userinfo_url = 'userinfo';
const save_userlogtime_url = 'userlogtime';
const save_usegeneraldata_url = 'usergeneraldata';
const get_results = 'memotask-result';

async function request(url, params, method = 'GET', responseType = '') {
    let options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }

    if (params) {
        if (method === 'GET') {
            url += '?' + objectToQueryString(params);
        } else {
            if (responseType !== '') {
                options.responseType = 'blob'
                options.data = params
            } else {
                options.data = JSON.stringify(params);
            }
        }
    }

    const response = await axios(url, options);

    if (response.status !== 200) {
        return generateErrorResponse('The server responded with an unexpected status.');
    }

    return response.data;
}

function objectToQueryString(obj) {
    return Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
}

function generateErrorResponse(message) {
    return {
        status: 'error',
        message
    };
}

export function get(url, params) {
    return request(_apiHost + url, params);
}

export function create(url, params) {
    return request(_apiHost + url, params, 'POST');
}

export function downloadFile(url, params) {
    return request(_apiHost + url, params, 'POST', 'blob');
}

function save(url, data, callback) {
    create(url, data)
        .then((response) => {
            callback({ response });
        }, function (reason) {
            callback(false, reason);
        });
}

function download(url, data, callback) {
    downloadFile(url, data)
        .then((response) => {
            callback({ response });
        }, function (reason) {
            callback(false, reason);
        });
}

export function fetchUserInitialData(typeTask, callback) {
    let url = fetch_inituserdata_url + '/' + typeTask

    get(url, {})
        .then((response) => {
            const indexFemale = 0
            const indexMale = 1
            const indexScenario1 = 2
            const indexScenario2 = 3

            let screens = [];
            for (let value of Object.values(response.screens)) {
                screens.push({
                    screen: value.screen_name,
                    type: value.screen_type
                });
            }

            let participants = Array(4);
            //TODO MEJORAR ESTO. SE DEBE BUSCAR EL VALOR EN EL ARRAY EN LUGAR DE TENER UN INDEX FIJO
            for (let value of Object.values(response.experimentCount)) {
                if (value.category === 'female') {
                    participants[indexFemale] = [value.group_1, value.group_2, value.group_3]
                } else if (value.category === 'male') {
                    participants[indexMale] = [value.group_1, value.group_2, value.group_3]
                } else if (value.category === 'scenario_1') {
                    participants[indexScenario1] = [value.group_1, value.group_2, value.group_3]
                } else if (value.category === 'scenario_2') {
                    participants[indexScenario2] = [value.group_1, value.group_2, value.group_3]
                }
            }

            callback({ screens, participants });
        }, (response) => {
            callback(false, response);
        });
}

// /**
//  * Load app versions from the spreadsheet
//  * @param {*} callback 
//  */
export function fetchVersions(callback) {
    let url = fetch_versions_url

    get(url, {})
        .then((response) => {
            let versions = [];

            for (let value of Object.values(response)) {
                versions.push({ version: value.name });
            }

            callback({ versions });
        }, (response) => {
            callback(false, response);
        });
}

/**
 * Load all the necessary Text structure for the app from the spreadsheet
 * @param {*} callback 
 */
export function fetchAppText(sex, callback) {
    let url = fetch_apptext_url + '/' + sex

    get(url, {})
        .then((response) => {
            let appText = [];

            for (let value of Object.values(response)) {
                appText.push({
                    screen: value.name,
                    size: value.font_size,
                    text: value.text,
                });
            }

            callback({ appText });
        }, (response) => {
            callback(false, response);
        });
}

/**
 * Write results to GSheets
 * @param {*} data 
 * @param {*} callback 
 */
export function saveGeneralData(data, ariadnaUserID, callback) {
    save(save_usegeneraldata_url, usergeneraldata(data, ariadnaUserID), callback)
}

/**
 * Write results to GSheets
 * @param {*} data 
 * @param {*} callback 
 */
export function saveUserInfo(data, callback) {
    save(save_userinfo_url, userinfo(data), callback)
}

/**
 * Write results to GSheets
 * @param {*} data 
 * @param {*} callback 
 */
export function saveUserLogTime(data, callback) {
    save(save_userlogtime_url, userlogtime(data), callback)
}

/**
 * Write results to GSheets
 * @param {*} data 
 * @param {*} callback 
 */
export function saveUserVisualPattern(data, callback) {
    save(save_visualpattern_url, uservisualpattern(data), callback)
}

export function downloadResults(data, callback) {
    download(get_results, results(data), callback)
}


/**
 * Helpers to format the data in the correct outputvalue
 * for a specific sheet
 */
const usergeneraldata = (data, ariadnaUserID) => {

    let result = []; //should have exactly 14 columns (Column A to N), thats why we fill empty indexes with ""
    for (let j = 0; j < data.length; j++) {
        let output = data[j];
        if (output.task === constant.USER_FORM_SCREEN) {
            result.push([
                output.userID,
                ariadnaUserID,
                output.task,
                output.data.numberOsoby,
                output.data.sex,
                output.data.age,
                output.data.profession,
                output.data.yearsEduc,
                output.data.levelEduc,
                constant.TEXT_EMPTY,
                constant.TEXT_EMPTY,
                constant.TEXT_EMPTY,
                constant.TEXT_EMPTY
            ]);
        } else if (output.task === constant.USER_INFO_SCREEN) {
            result.push([
                output.userID,
                ariadnaUserID,
                output.task,
                output.data[0],
                output.data[1],
                output.data[2],
                output.data[3],
                output.data[4],
                output.data[5],
                output.data[6],
                output.data[7],
                output.data[8],
                output.data[9]
            ]);
        } else if (output.task === constant.VISUAL_PATTERN_SCREEN || output.task === constant.VISUAL_PATTERN_DEMO_SCREEN) {
            let vp1 = output.data.map((item) => {
                return [
                    output.userID,
                    ariadnaUserID,
                    output.task,
                    (item.level + 1), //+1 to be more idiomatic: starts from level 1 insteado of level 0
                    item.dimention,
                    JSON.stringify(item.matrix),
                    JSON.stringify(item.matrixCheckResult),
                    item.matrixCheckResult.filter((element) => element === constant.TILE_SUCCESS).length, //we get the amount of success if any
                    item.matrixCheckResult.filter((element) => element === constant.TILE_ERROR).length, //we get the amount of errors if any
                    item.matrixCheckResult.filter((element) => element === constant.TILE_LEFT).length, //we get the amount of errors if any
                    item.retry,
                    item.timestamp,
                    constant.TEXT_EMPTY
                ]
            });
            result = result.concat(vp1);
        }
    }

    return result;
}

function userinfo(data) {

    const { userID, userInfo, outputFormData, typeTask, ariadnaUserID } = data;

    let result = { info: [], form: [] };

    result.info.push([
        userID,
        userInfo.os.name,
        userInfo.os.version,
        userInfo.browser.name,
        userInfo.browser.version,
        userInfo.browser.major,
        userInfo.browser.language,
        userInfo.engine.name,
        userInfo.engine.version,
        userInfo.screen.width,
        userInfo.screen.height
    ]);

    result.form.push([
        userID,
        ariadnaUserID,
        outputFormData.numberOsoby,
        outputFormData.sex,
        outputFormData.age,
        outputFormData.profession,
        outputFormData.yearsEduc,
        outputFormData.levelEduc,
        typeTask
    ]);


    return result;
}

function userlogtime(data) {
    // UserID	QuestionID	QuestionNumber	SelectedAnswer
    let result = [];

    const { logTimestamp, userID } = data;
    const { screen, timestamp } = logTimestamp;

    for (let i = 0; i < screen.length; i++) {
        result.push([
            userID,
            screen[i],
            timestamp[i],
            Math.floor((((i + 1) < screen.length) ? (timestamp[i + 1] - timestamp[i]) : 0) / 1000),
        ]);
    }

    return result;
}

function uservisualpattern(data) {
    const { userID, outputVisualPattern } = data;

    const totalLevels = 5
    const completeLevels = totalLevels - outputVisualPattern.task[outputVisualPattern.task.length - 1].level
    const correctTilesDemo1 = outputVisualPattern.demo[0].matrixCheckResult.filter((item) => item === constant.TILE_SUCCESS).length
    const correctTilesDemo2 = outputVisualPattern.demo[1].matrixCheckResult.filter((item) => item === constant.TILE_SUCCESS).length

    const tilesToSelectDemo1 = outputVisualPattern.demo[0].matrix.filter((item) => item === constant.TILE_SUCCESS).length
    const tilesToSelectDemo2 = outputVisualPattern.demo[1].matrix.filter((item) => item === constant.TILE_SUCCESS).length

    const accuracyDemo1 = correctTilesDemo1 === tilesToSelectDemo1 ? 1 : 0
    const accuracyDemo2 = correctTilesDemo2 === tilesToSelectDemo2 ? 1 : 0

    let results = []
    results.push(userID) //userID
    ////TASKS
    results.push(accuracyDemo1)//demo_patt1_mat(2 x 2)_CORRECT
    results.push(accuracyDemo2)//demo_patt2_mat(2 x 3)_CORRECT

    outputVisualPattern.task.forEach((output, i) => {
        const correctTiles = output.matrixCheckResult.filter((item) => item === constant.TILE_SUCCESS).length
        const tilesToSelect = output.matrix.filter((item) => item === constant.TILE_SUCCESS).length
        const accuracy = correctTiles === tilesToSelect ? 1 : 0

        results.push(accuracy)

        if (accuracy && output.retry === 0) { //si es retry 0 and accuracy 1, then retry 1 is empty
            results.push(null)
        }
    });

    for (var i = 1; i < completeLevels; i++) { //complete the levels with empty
        results.push(null)
        results.push(null)
    }

    ////TIMESTAMPS
    results.push(outputVisualPattern.demo[0].timestamp)//demo_patt1_mat(2 x 2)_TIME
    results.push(outputVisualPattern.demo[1].timestamp)//demo_patt2_mat(2 x 3)_TIME

    outputVisualPattern.task.forEach((output, i) => {
        const correctTiles = output.matrixCheckResult.filter((item) => item === constant.TILE_SUCCESS).length
        const tilesToSelect = output.matrix.filter((item) => item === constant.TILE_SUCCESS).length
        const accuracy = correctTiles === tilesToSelect ? 1 : 0

        results.push(output.timestamp)

        if (accuracy && output.retry === 0) { //si es retry 0 and accuracy 1, then retry 1 is empty
            results.push(null)
        }
    });

    for (var i = 1; i < completeLevels; i++) { //complete the levels with empty
        results.push(null)
        results.push(null)
    }

    return [results];
}

function results(data) {
    const { username, magic } = data;

    return { username: username, magic: magic }
}