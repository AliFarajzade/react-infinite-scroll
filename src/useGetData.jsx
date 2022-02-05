import { useState, useEffect } from 'react';

const useGetData = (searchQuery, pageNumber) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    let API_SCHEMA = '';

    const count = 24;
    const SECRET_KEY = 'sTJhOPVc-7ulYBs39tdE8AZeY1oAkwk-PG8JxQQ-5HU';

    if (searchQuery.trim() === '')
        API_SCHEMA = `https://api.unsplash.com/photos/random/?client_id=${SECRET_KEY}&count=${count}`;
    else
        API_SCHEMA = `https://api.unsplash.com/search/photos/?client_id=${SECRET_KEY}&page=${pageNumber}&query=${searchQuery}`;

    useEffect(() => setData([]), [searchQuery]);

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true);

            try {
                const request = await fetch(API_SCHEMA);
                const data = await request.json();
                setData(prevState =>
                    data.results
                        ? [...prevState, ...data.results]
                        : [...prevState, ...data]
                );
            } catch (error) {
                setError(true);
                return 'error';
            }

            setIsLoading(false);
        };

        getData();
    }, [searchQuery, pageNumber, API_SCHEMA]);

    return {
        data,
        isLoading,
        error,
    };
};

export default useGetData;
