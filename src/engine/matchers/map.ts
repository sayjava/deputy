import stringMatcher from './string';

export const matchKeys = (expected: { [key: string]: any }, actual: { [key: string]: any }) => {
    const actualKeys = Object.keys(actual);
    const expectedKeys = Object.keys(expected);
    const nonMatchingKey = expectedKeys.some((key) => !actualKeys.includes(key));
    if (nonMatchingKey) {
        return false;
    }

    return true;
};

export default (expected: { [key: string]: any }, actual: { [key: string]: any }): boolean => {
    if (Object.keys(expected).length === 0) {
        return true;
    }

    try {
        // check matching keys
        if (Array.isArray(actual)) {
            return stringMatcher(JSON.stringify(actual), JSON.stringify(expected));
        } else {
            // Match keys
            if (!matchKeys(expected, actual)) {
                return false;
            }

            // Match Values
            const nonMatchingValue = Object.entries(expected).some(([key, expValue]) => {
                return !stringMatcher(actual[key], expValue);
            });

            return !nonMatchingValue;
        }

        return true;
    } catch (e) {
        return e;
    }
};
