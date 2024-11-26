import { useState, useCallback } from 'react';

export const useAsyncError = () => {
    const [, setError] = useState();

    return useCallback((error: unknown) => {
        setError(() => {
            throw error;
        });
    }, []);
};
