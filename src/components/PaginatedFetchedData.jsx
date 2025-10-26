// Task 1 - API Data Fetching and Display (Pagination)

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaginatedFetchedData = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10); // 10 items per page
    const [loading, setLoading] = useState(false);

    const fetchPosts = async () => {
        try {
            setLoading(true); // start spinner
            const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
            setPosts(res.data);
        } catch (error) {
            alert("Failed to fetch posts: " + error);
        } finally {
            setLoading(false); // stop spinner
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // pagination logic
    const totalPages = Math.ceil(posts.length / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const currentPosts = posts.slice(startIndex, endIndex);

    const handlePrev = () => page > 1 && setPage(page - 1);
    const handleNext = () => page < totalPages && setPage(page + 1);

    return (
        <div className="container p-5">
            <h2 className="text-center mb-4">Posts List (Page {page})</h2>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                    <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                    </div>
                </div>
            ) : (
                <table className="table table-striped table-bordered table-hover table-sm">
                    <thead className="table-dark">
                        <tr>
                            <th>SN</th>
                            <th>UId</th>
                            <th>Post Title</th>
                            <th>Post Body</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPosts.map((post, index) => (
                            <tr key={post.id}>
                                <td>{startIndex + index + 1}</td>
                                <td>{post.userId}</td>
                                <td>{post.title}</td>
                                <td>{post.body}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Pagination Controllers */}
            <div className="d-flex justify-content-center align-items-center mt-4">
                <button
                    className="btn btn-primary me-3"
                    onClick={handlePrev}
                    disabled={page === 1 || loading}
                >
                    Previous
                </button>

                <span className="fw-bold">
                    Page {page} of {totalPages}
                </span>

                <button
                    className="btn btn-primary ms-3"
                    onClick={handleNext}
                    disabled={page === totalPages || loading}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PaginatedFetchedData;