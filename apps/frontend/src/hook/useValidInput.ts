import { useState } from 'react';

const useValidState = <T>(
    initialState: T,
    validator: (state: T) => string | void,
): [T, string, (state: T) => void, boolean] => {
    const msg = validator(initialState) ?? '';

    const [state, setState] = useState(initialState);
    const [isInvalid, setIsInvalid] = useState(msg.length !== 0);
    const [InvalidMessage, setInvalidMessage] = useState(msg);

    const setValidateValue = (newState: T) => {
        const message = validator(newState);

        setState(newState);

        if (!message) {
            setInvalidMessage('');
            setIsInvalid(false);
        } else {
            setInvalidMessage(message);
            setIsInvalid(true);
        }
    };

    return [state, InvalidMessage, setValidateValue, isInvalid];
};

export default useValidState;
