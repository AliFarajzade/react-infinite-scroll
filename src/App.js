import React, { useState, useRef, useCallback } from 'react';

import useGetData from './useGetData';

import Header from './Header';

import Loader from './Loader';

import './App.css';

export default function App() {
    const [searchQuery, setSearchQuery] = useState('');
    const [pageNumber, setPageNumber] = useState(1);

    const { isLoading, error, data } = useGetData(searchQuery, pageNumber);

    const searchInput = useRef(null);

    const handleSearch = e => {
        e.preventDefault();
        setSearchQuery(searchInput.current.value);
    };

    const observer = useRef(null);

    const lastImageRef = useCallback(
        node => {
            if (isLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting)
                    setPageNumber(prevState => prevState + 1);
            });

            if (node) observer.current.observe(node);
        },
        [isLoading]
    );

    return (
        <div className="app">
            <Header />
            <h1>Unsplash Image Gallery!</h1>

            <form onSubmit={handleSearch}>
                <input
                    ref={searchInput}
                    type="text"
                    placeholder="Search Unsplash..."
                />
                <button type="submit">Search</button>
            </form>

            <div className="image-grid">
                {data &&
                    data.map((imageObject, index) => {
                        if (index + 1 === data.length)
                            return (
                                <a
                                    href={imageObject.links.html}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="image"
                                    key={imageObject.id}
                                    ref={lastImageRef}
                                >
                                    <img
                                        src={imageObject.urls.small}
                                        alt={imageObject.description}
                                    />
                                </a>
                            );
                        else
                            return (
                                <a
                                    href={imageObject.links.html}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="image"
                                    key={imageObject.id}
                                >
                                    <img
                                        src={imageObject.urls.small}
                                        alt={imageObject.description}
                                    />
                                </a>
                            );
                    })}

                {isLoading && <Loader />}
            </div>

            {error && (
                <div className="error">
                    Error While Fetching Data. <a href="/">Try Again...</a>
                </div>
            )}
        </div>
    );
}
