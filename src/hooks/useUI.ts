import { useEffect, useState } from "react";
import axios from "../api/axios";
import { AccessObject } from "../interfaces/api";

export const useUI = () => {
    const [accessObjects, setAccessObjects] = useState<AccessObject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAccessObjects = async () => {
            try {
                const response = await axios.get("/ui/access-objects/");
                setAccessObjects(response.data);
            } catch (error) {
                console.error("Erro ao buscar access-objects", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAccessObjects();
    }, []);

    return { accessObjects, loading };
};