import React from 'react';
import {evaluate} from 'mathjs';

const BUTTONS = [
    {
        id: "divide",
        button: "/"
    },
    {
        id: "one",
        button: "1"
    },
    {
        id: "two",
        button: "2"
    },
    {
        id: "three",
        button: "3"
    },
    {
        id: "multiply",
        button: "*"
    },
    {
        id: "four",
        button: "4"
    },
    {
        id: "five",
        button: "5"
    },
    {
        id: "six",
        button: "6"
    },
    {
        id: "add",
        button: "+"
    },
    {
        id: "seven",
        button: "7"
    },
    {
        id: "eight",
        button: "8"
    },
    {
        id: "nine",
        button: "9"
    },
    {
        id: "subtract",
        button: "-"
    },
    {
        id: "decimal",
        button: "."
    },
    {
        id: "zero",
        button: "0"
    },
]

class Calculator extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            buttons: BUTTONS,
            display : "0",
            previousOperand : "0",
            isCurrentOperandDecimal: false,
            isCurrentOperandMinus: false,
            firstInput : true,
            firstOperatorInput :true
        };
        this.clear = this.clear.bind(this);
        this.compute = this.compute.bind(this);
        this.buttonClick = this.buttonClick.bind(this);
        this.isOperator = this.isOperator.bind(this);
        this.isDecimal = this.isDecimal.bind(this);
        this.isMinus = this.isMinus.bind(this);
        this.isNotAllowedTwice = this.isNotAllowedTwice.bind(this);
    }

    clear() {
        this.setState({
            display : "0",
            firstInput : true,
            isCurrentOperandDecimal: false,
            isCurrentOperandMinus : false,
            firstOperatorInput :true,
            previousOperand : "0",
        })
    }

    buttonClick(e) {
        let button = e.target.dataset.button;

        if(button === this.state.previousOperand) {
            if(this.state.firstInput && button === "0") return;
            if(this.isNotAllowedTwice(button)) return;
        }

        if(this.isOperator(button) && !this.state.firstInput) {
            
            let appendDisplay

            this.setState({
                isCurrentOperandDecimal: false,
            });

            if (this.isMinus(this.state.previousOperand) && this.isMinus(button)) {
                appendDisplay = this.state.display + button;
            } else {
                if (this.isOperator(this.state.previousOperand) && this.isMinus(button)) {
                    appendDisplay = this.state.display + button;
                } else if (this.isOperator(this.state.previousOperand)) {
                    let text = this.state.display;
                    let previousOperator =  text.substr(-2, 1);

                    appendDisplay = text.slice(0, -1) + button;

                    this.setState({
                        previousOperand: previousOperator
                    })

                    if (this.isOperator(previousOperator)) {
                        appendDisplay = text.slice(0, -2) + button
                    }
                } else {
                    appendDisplay = this.state.display + button;
                }
            }

            this.setState({
                display: appendDisplay,
                previousOperand: button
            });
        } else {
            if(this.isOperator(button) && !this.isMinus(button)) return;
            if(this.state.firstInput && !this.isDecimal(button)) {                
                return this.setState({
                    previousOperand: button,
                    display: button,
                    firstInput : false
                })
            }

            let appendDisplay = this.state.display + button;

            if(this.isMinus(button)) {
                this.setState({
                    isCurrentOperandMinus: true,
                })
            }

            if(this.isDecimal(button)) {
                this.setState({
                    isCurrentOperandDecimal: true,
                });

                if(this.state.firstInput) {
                    this.setState({
                        previousOperand: button,
                        display: appendDisplay,
                        firstInput : false
                    });
                }

                if(this.state.isCurrentOperandDecimal) return;
            }

            this.setState({
                display: appendDisplay,
                previousOperand: button
            })
        }
    }

    isDecimal(item) {
        return item === ".";
    }

    isMinus(item) {
        return item === "-";
    }

    isOperator(item) {
        let operator = ['+', '-', '/', '*'];

        return operator.includes(item);
    }

    isNotAllowedTwice(item) {
        let array = ['+', '.', '*', "/"];

        return array.includes(item);
    }

    compute() {
        let expression = evaluate(this.state.display);

        this.setState({
            display: expression,
        })
    }

    render() {
        return (
            <div className="calculator-grid">
                <div className="output">
                    <div className="previous-operand"></div>
                    <div id="display" className="current-operand">{this.state.display}</div>
                </div>
                <button onClick={this.clear} id="clear" className="span-three">AC</button>
                {this.state.buttons.map((item) => [
                    <button onClick={this.buttonClick} id={item.id} data-button={item.button} key={item.button}>
                        {item.button}
                    </button>
                ])}
                <button id="equals" className="span-two" onClick={this.compute}>=</button>
            </div>
        )
    }
}

export default Calculator;