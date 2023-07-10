import { useReducer } from "react"
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"
import "./App.css"


// Global variable for different actions
export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      // Overwrites the current value but adding in the end of the current value
      // 362 NO, 36 del, 2
      if (state.overwrite) {
        return {
          // ...state is built-in React object which contains information about component
          ...state, // current state
          currentOperand: payload.digit,
          overwrite: false,
        }
      }

      // Ensuring not to repeat zeroes when output is blank
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }

      // Ensuring not to repeat '.'
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}` //String interpolation
      }

    case ACTIONS.CHOOSE_OPERATION:
      // If there is no state in the output
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }

      // Change(overwrite) the operations (34+,  *)
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      // Making current to previous
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }

      // Default action (2+2=4+......)
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }
    
    case ACTIONS.DELETE_DIGIT:
      //Checking overwrite state
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }
      // No current operand, can not delete anything
      if (state.currentOperand == null) return state
      //When only 1 digit is left
      if (state.currentOperand.length === 1) {
        return { // deleting last digit -> becomes null
          ...state,
          currentOperand: null,
        }
      }

      //default state, removing last digit
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
    
    //Returning empty state
    case ACTIONS.CLEAR:
      return {} 

    case ACTIONS.EVALUATE:
      // Do not have the current state
      if (state.operation == null || state.currentOperand == null || state.previousOperand == null) {
        return state
      }

      // Correct state (all things are correct)
      return {
        ...state,
        overwrite: true,// overwriting the current evaluated value
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      }

    default:
      //do nothing
  }
}

// Evaluate with operators
function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break
    default:
      //do nothing
  }
  return computation.toString()
}

// To provide commas for thousands(12,345)
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

// Do not formating zeroes(20.00006) 
function formatOperand(operand) {
  //do not do anything
  if (operand == null) return
  //Taking integer and decimal format
  const [integer, decimal] = operand.split('.')
  //Do not have any decimal
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}


function App() {

  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})

  return (
    <div className="calculator-grid">
      <div className="output">
        {/* formating previous and current operand */}
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}> =</button>
    </div>
  )
}

export default App