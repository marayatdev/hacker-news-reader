'use client';

import { useEffect } from 'react';

export default function StoryError({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Something went wrong!</h2>
            <p className="mb-6">Failed to load story. Please try again.</p>
            <button
                onClick={() => reset()}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Try Again
            </button>
        </div>
    );
}
