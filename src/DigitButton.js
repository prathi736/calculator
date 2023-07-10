import { ACTIONS } from "./App"

// Custom Components
export default function DigitButton({ dispatch, digit /*Prompts*/}) {
    return <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}>{digit}</button>
}