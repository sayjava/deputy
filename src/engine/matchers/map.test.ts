import matcher from './map';

test('return true if expected keys are empty', () => {
    const result = matcher({}, { name: 'apple client' });

    expect(result).toMatchInlineSnapshot(`true`);
});

test("don't match missing keys", () => {
    const result = matcher({ job: 'manager' }, { name: 'apple client' });

    expect(result).toBeFalsy();
});

test('match values', () => {
    const result = matcher({ job: 'manager' }, { name: 'apple client', job: 'manager' });

    expect(result).toMatchInlineSnapshot(`true`);
});

test("don't match unequal values", () => {
    const result = matcher(
        { job: 'manager', role: 'mentor', id: 2 },
        { name: 'apple client', job: 'manager', role: 'mentor', id: 1 },
    );

    expect(result).toMatchInlineSnapshot(`false`);
});

test('match regex values', () => {
    const result = matcher(
        { job: 'manager', role: 'mentor', id: '[0-9]' },
        { name: 'apple client', job: 'manager', role: 'mentor', id: 1 },
    );

    expect(result).toMatchInlineSnapshot(`true`);
});

test("don't match regex values", () => {
    const result = matcher(
        { job: 'manager', role: 'mentor', id: '[a-z]' },
        { name: 'apple client', job: 'manager', role: 'mentor', id: 1 },
    );

    expect(result).toMatchInlineSnapshot(`false`);
});
