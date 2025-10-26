// Task 2 - Implement Caching for API Requests
// Task 3 - Search & Filter With Cached Data

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

const fetchUsers = async () => {
    const res = await axios.get("https://jsonplaceholder.typicode.com/users");
    return res.data;
}

// Debounce hook (waits before applying the search term)

function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

const UsersWithSearch = () => {
    const {
        data: users,
        isLoading,
        isFetching,
        refetch,
    } = useQuery({
        queryKey: ["Users"],
        queryFn: fetchUsers,
        staleTime: 1000 * 60 * 5, // cache valid for 5 minutes
        cacheTime: 1000 * 60 * 10 // keep cache for 10 minutes
    });

    const [search, setSearch] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const debouncedSearch = useDebounce(search, 500); // apply debounce


    // filter cached data when debouncedSearch or users change
    useEffect(() => {
        if (users) {
            const lower = debouncedSearch.toLowerCase();
            const filtered = users.filter(
                (user) =>
                    user.name.toLowerCase().includes(lower) ||
                    user.email.toLowerCase().includes(lower)
            );
            setFilteredUsers(filtered)
        }
    }, [debouncedSearch, users]);

    return (
        <div className='conatiner mt-4 text-center p-5'>
            <h2>User List (Search + Cached Data)</h2>

            {/* search input */}
            <input
                type="text"
                placeholder='Search by name or email'
                className='form-control mb-3'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Rfresh button */}
            <button className='btn btn-primary mb-3' onClick={() => refetch()}>
                Refresh Data
            </button>

            {
                isLoading ? (
                    // Spinner while loading
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                        </div>
                    </div>
                ) : (
                    <>
                        {
                            isFetching && <p>Updating...</p>
                        }
                        <ul className='list-group'>
                           {
                            filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <li key={user.id} className='list-group-item'>
                                        <b>Name: </b>{user.name} | <b>Email: </b>{user.email}
                                    </li>
                                ))
                            ) : 
                            (
                                <li className='list-group-item text-muted'>
                                    No results found
                                </li>
                            )
                           }
                        </ul>
                    </>
                )
            }
        </div>
    )
}

const CahingForApiReq = () => {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <UsersWithSearch />
            </QueryClientProvider>
        </>
    )
}

export default CahingForApiReq