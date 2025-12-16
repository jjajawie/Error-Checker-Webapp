// src/components/errorChart.js
import React, {useMemo} from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';
import './errorChart.css';

function ErrorChart({ errors, groupBy }) {
    const chartData = useMemo(() => {
        const counts = {};
        errors.forEach((err) => {
            const key = err[groupBy] || 'Unknown';
            counts[key] = (counts[key] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value}));
    }, [errors, groupBy]);

return (
    <div className="error-chart">
        <h3>Errors by {groupBy}</h3>
        <BarChart width={500} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
    </div>
);    
}

export default ErrorChart;