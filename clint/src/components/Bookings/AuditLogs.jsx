import { useEffect, useState } from "react";
import api from "../utils/api";

export default function AuditLogList() {
    const [logs, setLogs] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem('token');
        api.get('/users/me/audit-logs', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setLogs(res.data));
    }, []);

    return (
        <div className="max-w-2xl mx-auto py-10">
            <h2 className="text-xl font-bold mb-4">
                Booking History
            </h2>
            <ul>
                {logs.map(log => (
                    <li key={log.id} className="mb-2">
                        <span>{log.action}</span> — <span>{log.details}</span> <span
                            className="text-gray-500">
                            {new Date(log.created_at).toLocaleString()}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}