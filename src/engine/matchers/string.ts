export default (actual: string, expected: string): boolean => {
    if (actual === expected) {
        return true;
    }

    const regex = new RegExp(expected);
    return !!JSON.stringify(actual).match(regex);
};
