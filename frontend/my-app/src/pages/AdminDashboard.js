import { useEffect, useState } from 'react';
import api from '../api';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchReports = async () => {
        try {
            const res = await api.get('/admin/reports');
            setReports(res.data);
        } catch (err) {
            console.error("Failed to fetch reports", err);
            alert('Could not fetch reports.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleBlockUser = async (reportedUserId, reason) => {
        if (!window.confirm(`Are you sure you want to block this user for: "${reason}"?`)) {
            return;
        }
        try {
            await api.post(`/admin/users/${reportedUserId}/block`, { reason });
            alert('User blocked successfully.');
            // We could optionally remove the report from the view or change its status here
        } catch (err) {
            console.error('Failed to block user', err);
            alert('Could not block user.');
        }
    };

    if (isLoading) {
        return <div>Loading reports...</div>;
    }

    return (
        <div className={styles.container}>
            <h1>Admin Dashboard</h1>
            <h2>User Reports</h2>
            <div className={styles.tableContainer}>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Reporter</th>
                            <th>Reported User</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.length > 0 ? reports.map(report => (
                            <tr key={report.id}>
                                <td>{new Date(report.created_at).toLocaleDateString()}</td>
                                <td>{report.reporter_username}</td>
                                <td>{report.reported_username}</td>
                                <td>{report.reason}</td>
                                <td><span className={`${styles.status} ${styles[report.status]}`}>{report.status}</span></td>
                                <td>
                                    <button 
                                        className={styles.actionButton}
                                        onClick={() => handleBlockUser(report.reported_id, report.reason)}
                                    >
                                        Block User
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6">No reports found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;