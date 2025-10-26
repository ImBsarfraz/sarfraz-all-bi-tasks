// Task - 4 Dynamic React Flow Node Creation

import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import ReactFlow, {
    addEdge,
    Background,
    Controls,
    MiniMap,
    useEdgesState,
    useNodesState
} from 'reactflow';
import "reactflow/dist/style.css";
import { v4 as uuidv4 } from "uuid";

const DynamicReactFlow = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [apiPosts, setApiPosts] = useState([]); // from Task 1 api
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 10;

    // Fetch data from Task 1 Api
    const fetchPosts = async () => {
        try {
            setLoading(true);
            const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
            setApiPosts(res.data);
        } catch (error) {
            console.error("Failed to fetch posts: ", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    // Add a new node dynamically
    const addNewNode = useCallback(() => {
        const id = uuidv4();
        const randomX = Math.random() * 400;
        const randomY = Math.random() * 400;

        // Bonus: Using API post titles dynamically for node labels
        const randomPost = apiPosts.length
            ? apiPosts[Math.floor(Math.random() * apiPosts.length)]
            : { title: "Untitled Node" };

        const newNode = {
            id,
            position: { x: randomX, y: randomY },
            data: { label: randomPost.title.slice(0, 25) + "..." },
            type: "default",
        };

        setNodes((nds) => nds.concat(newNode));

    }, [apiPosts]);

    // handle connecting nodes with the edges
    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    return (
        <>
            <div className="container m-4 text-center">
                <h2>Dynamic React Flow Node Creation</h2>

                <div className='d-flex justify-content-between align-items-center mb-3'>
                    <button
                        className='btn btn-primary'
                        onClick={addNewNode}
                        disabled={loading}
                    >
                        + Add Node
                    </button>

                    <span className='text-muted'>
                        {
                            loading
                                ? "Fetching API data..."
                                : `${apiPosts.length} posts loaded`
                        }
                    </span>
                </div>

                {/* React Flow Canvas */}
                <div
                    style={{
                        height: "600px",
                        border: "2px solid #ddd",
                        borderRadius: "10px",
                    }}
                >
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        fitView
                    >
                        <MiniMap />
                        <Controls />
                        <Background variant='dots' gap={12} size={1} />
                    </ReactFlow>
                </div>
            </div>
        </>
    )
}

export default DynamicReactFlow