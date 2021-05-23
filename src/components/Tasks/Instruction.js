import React from "react";

import { Container, Row } from "reactstrap";

import "./style.css";

import * as constant from '../../helpers/constants';

class Instruction extends React.Component {
    render() {
        return (
            <Container fluid="md">
                <Row className="justify-content-md-center">
                    <HtmlFormattedText text={this.props.text} screen={this.props.name} />
                </Row>
            </Container>
        )
    };
}

/**
 * Map the current screen with the correspondent text instruction to display
 * @param {*} inputTextInstructions 
 * @param {*} screen 
 */
const HtmlFormattedText = ({ text, screen }) => {
    let children = text
        .filter((instruction) => instruction.screen === screen)//Map the current screen with the correspondent text instruction to display
        .map((instruction, index) => {
            let txtFormatted = instruction.text.split('\\n').map(function (item, key) { //replace \n with margin bottom to emulate break line
                return (<div className="instr" key={key}>{item}</div>)
            })
            let key = "KEY_" + txtFormatted.length + "_" + index

            return <HtmlTextFontSize text={txtFormatted} fontSize={instruction.size} key={key} />
        });

    return children;
};

/**
 * Map the correspondent font size for the text instruction
 * @param {Map the correspondent font size for the text instruction} param0 
 */
const HtmlTextFontSize = ({ text, fontSize, key }) => {
    switch (fontSize) {
        case constant.FONT_SIZE_HEADING1:
            return (<div className="instr-h1" key={key}>{text}</div>)
        case constant.FONT_SIZE_HEADING2:
            return (<div className="instr-h2" key={key}>{text}</div>)
        case constant.FONT_SIZE_HEADING3:
            return (<div className="instr-h3" key={key}>{text}</div>)
        case constant.FONT_SIZE_HEADING4:
            return (<div className="instr-h4" key={key}>{text}</div>)
        case constant.FONT_SIZE_HEADING5:
            return (<div className="instr-h5" key={key}>{text}</div>)
        case constant.FONT_SIZE_HEADING6:
            return (<div className="instr-h6" key={key}>{text}</div>)
        default:
            return (<div className="instr-h3" key={key}>{text}</div>)
    }
};

export default Instruction;