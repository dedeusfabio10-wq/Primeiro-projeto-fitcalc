import React from 'react';

// This file is part of a client-side route structure.
// It must export a valid React component to prevent build errors.
// The server-side logic was correctly moved to /api/create-payment.ts.
const HarmlessComponent: React.FC = () => {
    // This component renders nothing and is intended to resolve a build issue
    // caused by this file's existence in the 'pages' directory.
    return null;
};

export default HarmlessComponent;
