import matcher from './map';

test('return true if expected keys are empty', () => {
    const result = matcher({}, { name: 'apple client' });

    expect(result).toBe(true);
});

test("don't match missing keys", () => {
    const result = matcher({ job: 'manager' }, { name: 'apple client' });

    expect(result).toBe(false);
});

test('match values', () => {
    const result = matcher({ job: 'manager' }, { name: 'apple client', job: 'manager' });

    expect(result).toBe(true);
});

test("don't match unequal values", () => {
    const result = matcher(
        { job: 'manager', role: 'mentor', id: 2 },
        { name: 'apple client', job: 'manager', role: 'mentor', id: 1 },
    );

    expect(result).toBe(false);
});

test('match regex values', () => {
    const result = matcher(
        { job: 'manager', role: 'mentor', id: '[0-9]' },
        { name: 'apple client', job: 'manager', role: 'mentor', id: 1 },
    );

    expect(result).toBe(true);
});

test("don't match regex values", () => {
    const result = matcher(
        { job: 'manager', role: 'mentor', id: '[a-z]' },
        { name: 'apple client', job: 'manager', role: 'mentor', id: 1 },
    );

    expect(result).toBe(false);
});

describe('Nested data', () => {
    type AnyObject = { [key: string]: any };
    type TestCase = [testName: string, expected: AnyObject, actual: AnyObject, expectedResult: boolean];
    const testCases: TestCase[] = [
        [
            'match nested arrays',
            { jobs: ['manager', 'salesperson', 'dogcatcher'] },
            { jobs: ['manager', 'salesperson', 'dogcatcher'], name: 'Roni' },
            true,
        ],
        [
            "don't match nested arrays",
            { jobs: ['manager', 'salesperson', 'dogcatcher'] },
            { jobs: ['manager', 'salesperson'], name: 'Roni' },
            false,
        ],
        ["don't match nested arrays to strings", { jobs: 'manager' }, { jobs: ['manager'], name: 'Roni' }, false],
        ["don't match string to nested arrays", { jobs: ['manager'] }, { jobs: 'manager', name: 'Roni' }, false],
    ];

    test.each(testCases)('%s', (_: string, expected, actual, expectedResult) => {
        const result = matcher(expected, actual);
        expect(result).toEqual(expectedResult);
    });
});
