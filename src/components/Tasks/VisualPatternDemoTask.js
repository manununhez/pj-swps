import React from "react";

// reactstrap components
import {
    Container,
    Row,
    Col,
    Table,
    Card,
    CardBody
} from "reactstrap";

import {
    VISUAL_PATTERN_DEMO_DIMENTION,
    VISUAL_PATTERN_TIMESCREEN_SECS,
    VISUAL_PATTERN_DEMO_RETRY_ATTEMPTS,
    ONE_SECOND_MS,
    TILE_SUCCESS,
    TILE_EMPTY,
    TILE_ERROR,
    TILE_LEFT,
    SPACE_KEY_CODE,
    EVENT_KEY_DOWN,
    VISUAL_PATTERN_INSTRUCTION,
    VISUAL_PATTERN_TEXT_START_PRESS_SPACE,
    VISUAL_PATTERN_RESULTS_CORRECT,
    VISUAL_PATTERN_RESULTS_FAILED,
    VISUAL_PATTERN_RESULTS_PRESS_SPACE
} from '../../helpers/constants';

import { randomNumber } from '../../helpers/utils';

import './style.css'

const DEBUG = (process.env.REACT_APP_DEBUG_LOG === "true") ? true : false;

class VisualPatternDemoTask extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLevelFinished: false,
            level: 0,
            logtime: 0,
            matrixResult: [], //contains the piles selected by the user. Initially empty
            matrixCheckResult: [], //this is a mix of matrix and matrixResult, in order to have in one place the errors and the original solution. Use to show "Check results"
            outputData: [],
            retry: VISUAL_PATTERN_DEMO_RETRY_ATTEMPTS,
            seconds: VISUAL_PATTERN_TIMESCREEN_SECS,
            showCompletedTable: true,
            showResults: false,
            showInitMessage: true,
            visualTaskData: {
                row: 0,
                column: 0,
                blues: 0, //amount of blue tiles
                matrix: [] //contains the random generated pattern
            },
            resultsPressSpace: VISUAL_PATTERN_RESULTS_PRESS_SPACE,
            resultsFailed: VISUAL_PATTERN_RESULTS_FAILED,
            resultsCorrect: VISUAL_PATTERN_RESULTS_CORRECT,
            startPressSpace: VISUAL_PATTERN_TEXT_START_PRESS_SPACE,
            textInstruction: VISUAL_PATTERN_INSTRUCTION
        };

        this.handleClick = this._handleClick.bind(this);
        this.handleKeyDownEvent = this._handleKeyDownEvent.bind(this);

    }

    componentDidMount() {
        //for keyboard detection
        document.addEventListener(EVENT_KEY_DOWN, this.handleKeyDownEvent, false);

        // HTML prevent space bar from scrolling page
        window.addEventListener(EVENT_KEY_DOWN, function (e) {
            if (e.keyCode === SPACE_KEY_CODE && e.target === document.body) {
                e.preventDefault();
            }
        });
    }

    componentWillUnmount() {
        document.removeEventListener(EVENT_KEY_DOWN, this.handleKeyDownEvent, false);

        this._clearTimer()
    }

    _initConfig() {
        this._initMatrix();
        this._initTimer();
    }

    _initTimer() {
        this.myInterval = setInterval(() => {
            const { seconds } = this.state

            if (seconds > 0) {
                if ((seconds - 1) === 0) {
                    this.setState(({ seconds }) => ({
                        seconds: seconds - 1,
                        showCompletedTable: false,
                        logtime: Date.now()
                    }))
                } else {
                    this.setState(({ seconds }) => ({
                        seconds: seconds - 1
                    }))
                }
            } else if (seconds === 0) {
                clearInterval(this.myInterval)
            }
        }, ONE_SECOND_MS)
    }

    _clearTimer() {
        clearInterval(this.myInterval)
    }

    _initMatrix() {
        const { level } = this.state;

        const row = VISUAL_PATTERN_DEMO_DIMENTION[level][0];
        const column = VISUAL_PATTERN_DEMO_DIMENTION[level][1];
        const blues = VISUAL_PATTERN_DEMO_DIMENTION[level][2];
        let matrix = Array(row * column).fill(0);
        let matrixCheckResult = Array(row * column).fill(0);
        let matrixResult = Array(row * column).fill(0);

        let min = 0
        let max = row * column - 1
        for (let i = 0; i < blues;) {
            let number = randomNumber(min, max);
            if (DEBUG) console.log("Random number: " + number)
            if (matrix[number] === TILE_EMPTY) {
                matrix[number] = TILE_SUCCESS;
                matrixCheckResult[number] = TILE_SUCCESS;
                i++;
            }
        }

        this.setState({
            visualTaskData: {
                row: row,
                column: column,
                matrix: matrix,
                blues: blues
            },
            showCompletedTable: true,
            matrixResult: matrixResult,
            matrixCheckResult: matrixCheckResult
        });
    }

    _handleKeyDownEvent(event) {
        if (event.keyCode === SPACE_KEY_CODE) { //Transition between screens
            const { matrixResult, showInitMessage, isLevelFinished, showCompletedTable, showResults, seconds } = this.state
            const isResultsShown = !showCompletedTable && !showInitMessage && showResults && isLevelFinished

            if (isResultsShown) { //the user is checking results and press space to show the message to start the game
                this._saveResults()
            } else if (showInitMessage) { //the user press space to start the game. The game starts!
                this.setState(({ showInitMessage }) => ({
                    showInitMessage: !showInitMessage
                }), () => {
                    this._initConfig();
                })
            } else if (matrixResult.includes(TILE_SUCCESS) && seconds === 0) { //the level game finished, the user press space to check results. Seconds == 0 to avoid press space before toe counter finishes. matrixResult.includes(TILE_SUCCESS) means that at least one tile was selected
                // go to check Results
                this._checkResults()
            }
        }
    }

    _checkResults() {
        const { matrixResult, matrixCheckResult, visualTaskData } = this.state
        const { matrix } = visualTaskData

        matrix.forEach((value, i) => {
            let selectedValue = TILE_EMPTY
            if (value === matrixResult[i]) {
                selectedValue = value
            } else {
                if (matrixResult[i] === TILE_SUCCESS)
                    selectedValue = TILE_ERROR
                else
                    selectedValue = TILE_LEFT

            }
            matrixCheckResult[i] = selectedValue
        })

        this.setState({
            showResults: true,
            isLevelFinished: true,
            showCompletedTable: false,
            showInitMessage: false,
            matrixCheckResult: matrixCheckResult
        })
    }

    _finishAndSendResults() {
        const { outputData } = this.state;

        this.props.action(outputData)
    }


    _updateGameStatus() {
        const { level, retry } = this.state;
        const VISUAL_PATTERN_LEVELS = VISUAL_PATTERN_DEMO_DIMENTION.length

        if (retry > 1) { // 2 times -> 2, 1
            // decrease Retry
            if (DEBUG) console.log("Please, try again");
            this.setState(({ retry }) => ({
                retry: retry - 1,
                seconds: VISUAL_PATTERN_TIMESCREEN_SECS,
            }), () => {
                if (DEBUG) console.log(this.state)
            })
        } else {
            if ((level + 1) < VISUAL_PATTERN_LEVELS) { //go to next level
                // increase Level()
                if (DEBUG) console.log("Great, advance to the next level!");
                this.setState(({ level }) => ({
                    level: level + 1,
                    retry: VISUAL_PATTERN_DEMO_RETRY_ATTEMPTS,
                    seconds: VISUAL_PATTERN_TIMESCREEN_SECS,
                }), () => {
                    if (DEBUG) console.log(this.state)
                })
            } else { //game finishes after completed all levels
                if (DEBUG) console.log("Debug only: Game finished. Well done!")
                this._finishAndSendResults()
            }

        }

    }

    _saveResults() {
        const { retry, matrixResult, matrixCheckResult, logtime,
            level, visualTaskData, outputData } = this.state;
        const { matrix } = visualTaskData;

        outputData.push({
            matrix: matrix,
            matrixResult: matrixResult,
            matrixCheckResult: matrixCheckResult,
            dimention: `${VISUAL_PATTERN_DEMO_DIMENTION[level][0]} x ${VISUAL_PATTERN_DEMO_DIMENTION[level][1]}`,
            level: level,
            retry: VISUAL_PATTERN_DEMO_RETRY_ATTEMPTS - retry,
            timestamp: (Date.now() - logtime) / 1000 //spent time
        })

        this.setState({
            outputData: outputData,
            showInitMessage: true,
            isLevelFinished: false,
            showResults: false
        }, () => {
            this._updateGameStatus()
        })
    }


    _handleClick(index) {
        const { matrixResult, isLevelFinished } = this.state;

        if (!isLevelFinished) { //to avoid double click in a tile already selected

            matrixResult[index] = matrixResult[index] === TILE_SUCCESS ? TILE_EMPTY : TILE_SUCCESS;

            this.setState({
                matrixResult: matrixResult
            })
            if (DEBUG) console.log(matrixResult);
        }
    }

    render() {

        const { showInitMessage, resultsPressSpace, resultsFailed, resultsCorrect, startPressSpace, textInstruction } = this.state;

        return (
            <>
                {showInitMessage ?
                    <h2 className="pressSpace">{resultsPressSpace}</h2> :
                    displayTable(this.state, this.handleClick, resultsPressSpace,
                        resultsFailed, resultsCorrect,
                        startPressSpace, textInstruction)}
            </>
        );
    }
}

/**
 * 
 * @param {*} state 
 * @param {*} handleClick 
 */
function displayTable(state, handleClick, pressSpaceMessage, resultFailedMessage,
    resultSuccessMessage, startPressSpaceMessage, textMessage) {
    const { showCompletedTable, visualTaskData, matrixResult, matrixCheckResult, showResults } = state;
    const { row, column, matrix } = visualTaskData;

    return (
        <Container className="justify-content-md-center">
            {showCompletedTable ?
                getDemoTable(row, column, matrix) :
                getTable(row, column, matrix, matrixResult, matrixCheckResult, handleClick,
                    showResults, pressSpaceMessage, resultFailedMessage, resultSuccessMessage, startPressSpaceMessage, textMessage)}
        </Container>)
}

/**
 * 
 * @param {*} TRow 
 * @param {*} TColumn 
 * @param {*} matrix 
 * @param {*} matrixResult 
 * @param {*} matrixCheckResult 
 * @param {*} handleClick 
 * @param {*} showResults 
 */
function getTable(TRow, TColumn, matrix, matrixResult, matrixCheckResult, handleClick,
    showResults, pressSpaceMessage, resultFailedMessage, resultSuccessMessage, startPressSpaceMessage, textMessage) {
    if (showResults) {
        return getTableResults(TRow, TColumn, matrix, matrixResult, matrixCheckResult,
            pressSpaceMessage, resultFailedMessage, resultSuccessMessage)
    } else {
        return getTableTask(TRow, TColumn, matrixResult, handleClick, startPressSpaceMessage, textMessage)
    }
}

/**
 * 
 * @param {*} TRow 
 * @param {*} TColumn 
 * @param {*} matrix 
 * @param {*} matrixResult 
 * @param {*} matrixCheckResult 
 */
function getTableResults(TRow, TColumn, matrix, matrixResult, matrixCheckResult, pressSpaceMessage, resultFailedMessage, resultSuccessMessage) {
    let areErrorsInTable = matrixCheckResult.filter((item) => item === TILE_ERROR).length > 0;
    let areLeftTilesInTable = matrixCheckResult.filter((item) => item === TILE_LEFT).length > 0;

    if (areErrorsInTable || areLeftTilesInTable) { //WRONG
        return (
            <>
                <Row className="justify-content-center">
                    <h4 style={{ textAlign: "center" }}>{resultFailedMessage}</h4>
                </Row>
                <Row className="justify-content-center">
                    <Card body style={{ marginTop: "20px", marginBottom: "20px" }}>
                        <Col>
                            <Table responsive bordered size="sm" style={{ width: "100%", marginBottom: "0" }}>
                                <thead>
                                    <tr>
                                        <th className="align-middle" style={{ textAlign: 'center', padding: '7px' }}>Poprawny wzór</th>
                                        <th className="align-middle" style={{ textAlign: 'center', padding: '7px' }}>Twoje zaznaczenie</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ textAlign: '-webkit-center' }}>
                                        <td style={{ textAlign: "-moz-center" }}>
                                            {getTableResultsBody(TRow, TColumn, matrix)}
                                        </td>
                                        <td style={{ textAlign: "-moz-center" }}>
                                            {getTableResultsBody(TRow, TColumn, matrixResult)}
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Card>
                </Row>
                <Row className="justify-content-center">
                    <h4 style={{ textAlign: "center" }}>{pressSpaceMessage}</h4>
                </Row>
            </>);
    } else { //SUCESS
        return (
            <>
                <Row className="justify-content-center">
                    <h4 style={{ textAlign: "center" }}>{resultSuccessMessage}</h4>
                </Row>
                <Row className="justify-content-center">
                    <Card style={{ marginBottom: "20px" }}>
                        <CardBody>
                            <Table responsive bordered size="sm" style={{ width: "50%", marginBottom: "0" }}>
                                {getTableResultsBody(TRow, TColumn, matrixCheckResult)}
                            </Table>
                        </CardBody>
                    </Card>
                </Row>
                <Row className="justify-content-center">
                    <h4 style={{ textAlign: "center" }}>{pressSpaceMessage}</h4>
                </Row>
            </>);
    }
}

/**
 * 
 * @param {*} TRow 
 * @param {*} TColumn 
 * @param {*} matrixToDraw 
 */
function getTableResultsBody(TRow, TColumn, matrixToDraw) {
    let children = [];

    for (let i = 0; i < TRow; i++) {
        children.push(
            <tr key={"key_" + TRow + "_" + TColumn + "_" + i}>
                {getResultColumns(i, TRow, TColumn, matrixToDraw)}
            </tr>
        );
    }

    return (
        <Table responsive bordered size="sm" style={{ width: "auto", marginBottom: "0" }}>
            <tbody>
                {children}
            </tbody>
        </Table>);
}

/**
 * 
 * @param {*} row 
 * @param {*} TRow 
 * @param {*} TColumn 
 * @param {*} matrixToDraw 
 */
function getResultColumns(row, TRow, TColumn, matrixToDraw) {
    let children = [];

    let rows = (matrixToDraw.length / TRow) * (row + 1);

    for (let i = 0; i < TColumn; i++) {
        let currentDataIndex = (rows - (TColumn - (i + 1))) - 1;
        let backgroundColor = '';

        backgroundColor = (matrixToDraw[currentDataIndex] === TILE_SUCCESS ? 'blue' : 'white')

        children.push(
            <td className="align-middle" key={"key_td_" + TRow + "_" + TColumn + "_" + i}
                style={{
                    padding: '2.5rem', fontSize: '1.2em', backgroundColor: backgroundColor
                }} />
        );
    }

    return children;
}

/**
 * 
 * @param {*} TRow 
 * @param {*} TColumn 
 * @param {*} matrixToDraw 
 * @param {*} handleClick 
 */
function getTableTask(TRow, TColumn, matrixToDraw, handleClick, startPressSpaceMessage, textMessage) {
    let children = [];

    for (let i = 0; i < TRow; i++) {
        children.push(
            <tr key={"key_" + TRow + "_" + TColumn + "_" + i}>
                {getTaskColumns(i, TRow, TColumn, matrixToDraw, handleClick)}
            </tr>
        );
    }

    return (
        <>
            <Row className="justify-content-center">
                <h4 style={{ textAlign: "center" }}>{textMessage}</h4>
            </Row>
            <Row className="justify-content-center">
                <Card style={{ marginTop: "20px", marginBottom: "20px" }}>
                    <CardBody>
                        <Table responsive bordered size="sm" style={{ width: "50%", marginBottom: "0" }}>
                            <tbody>
                                {children}
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
            </Row>
            <Row className="justify-content-center">
                <h4 style={{ textAlign: "center" }}>{startPressSpaceMessage}</h4>
            </Row>
        </>);
}

/**
 * 
 * @param {*} row 
 * @param {*} TRow 
 * @param {*} TColumn 
 * @param {*} matrixToDraw 
 * @param {*} handleClick 
 */
function getTaskColumns(row, TRow, TColumn, matrixToDraw, handleClick) {
    let children = [];

    let rows = (matrixToDraw.length / TRow) * (row + 1);

    for (let i = 0; i < TColumn; i++) {
        let currentDataIndex = (rows - (TColumn - (i + 1))) - 1;
        let backgroundColor = '';

        backgroundColor = (matrixToDraw[currentDataIndex] === TILE_SUCCESS ? 'blue' : 'white')

        children.push(
            <td className="align-middle" key={"key_td_" + TRow + "_" + TColumn + "_" + i}
                onClick={handleClick.bind(this, currentDataIndex)}
                style={{
                    padding: '2.5rem', fontSize: '1.2em', backgroundColor: backgroundColor
                }} />
        );
    }
    return children;
}

/**
 * 
 * @param {*} TRow 
 * @param {*} TColumn 
 * @param {*} data 
 */
function getDemoTable(TRow, TColumn, data) {
    let children = [];

    for (let i = 0; i < TRow; i++) {
        children.push(
            <tr key={"key_tr_" + TRow + "_" + TColumn + "_" + i}>
                {getDemoColumns(i, TRow, TColumn, data)}
            </tr>
        );
    }

    return (<>
        <Row className="justify-content-center">
            <Card style={{ marginTop: "100px", marginBottom: "20px" }}>
                <CardBody>
                    <Table responsive bordered size="sm" style={{ width: "50%", marginBottom: "0" }}>
                        <tbody>
                            {children}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
        </Row>
    </>);
}

/**
 * 
 * @param {*} row 
 * @param {*} TRow 
 * @param {*} TColumn 
 * @param {*} data 
 */
function getDemoColumns(row, TRow, TColumn, data) {
    let children = [];

    let rows = (data.length / TRow) * (row + 1);

    for (let i = 0; i < TColumn; i++) {
        let currentDataIndex = (rows - (TColumn - (i + 1))) - 1;
        let backgroundColor = (data[currentDataIndex] ? 'blue' : 'white');
        children.push(
            <td className="align-middle" key={"key_td_" + TRow + "_" + TColumn + "_" + i}
                style={{ padding: '2.5rem', fontSize: '1.2em', backgroundColor: backgroundColor }} />
        );
    }
    return children;
}


export default VisualPatternDemoTask;