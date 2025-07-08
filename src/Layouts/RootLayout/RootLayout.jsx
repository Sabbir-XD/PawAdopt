import React from 'react';
import Navbar from '../../Shared/Navbar/Navbar';

const RootLayout = () => {
    return (
        <div>
            <Navbar/>
            <h1 className='text-3xl font-bold text-red-500'>Root Layout</h1>
        </div>
    );
};

export default RootLayout;
