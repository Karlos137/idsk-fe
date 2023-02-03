import React, { useEffect } from "react";
import IdskApi from "../../api/IdskApi";

const TestApi = () => {
    const [apiKeys, setApiKeys] = React.useState([]);
    
    useEffect(() => {
        async function fetchData() {
            const apiKeys = await IdskApi.getApiKeys();
            setApiKeys(apiKeys);
        }
        fetchData();
}, [])
    return <div>{apiKeys}</div>;
};

export default TestApi;