export const mock = () => {
    return {
        load: async () => {
            const res = await fetch(`/api/mocks`);

            if (res.ok) {
                const mocks = await res.json();
                return mocks;
            }

            throw new Error(`Error - ${res.statusText}`);
        },
        create: async (mocks: string) => {
            const res = await fetch('/api/mocks', {
                method: 'POST',
                body: mocks,
                headers: {
                    'content-type': 'application/json',
                },
            });

            if (res.ok) {
                return true;
            }

            const result = await res.json();
            throw new Error(JSON.stringify(result));
        },
        delete: async (behavior: string) => {
            const res = await fetch('/api/mocks', {
                method: 'DELETE',
                body: behavior,
                headers: {
                    'content-type': 'application/json',
                },
            });

            if (res.ok) {
                return true;
            }

            const result = await res.json();
            throw new Error(JSON.stringify(result));
        },
        update: async (behavior: string) => {
            const res = await fetch('/api/mocks', {
                method: 'PUT',
                body: behavior,
                headers: {
                    'content-type': 'application/json',
                },
            });

            if (res.ok) {
                return true;
            }

            const result = await res.json();
            throw new Error(JSON.stringify(result));
        },
        reset: async () => {
            const res = await fetch('/api/reset', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
            });

            if (res.ok) {
                return true;
            }

            const result = await res.json();
            throw new Error(JSON.stringify(result));
        },
        clear: async () => {
            const res = await fetch('/api/clear', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
            });

            if (res.ok) {
                return true;
            }

            const result = await res.json();
            throw new Error(JSON.stringify(result));
        },
    };
};
