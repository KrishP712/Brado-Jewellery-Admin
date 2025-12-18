// components/charts/LineChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProfessionalLineChart = ({ data, title }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" />
          <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 12 }} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#111827', borderRadius: 6 }}
            labelStyle={{ color: '#f59e0b' }}
            itemStyle={{ color: '#f3f4f6' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#f59e0b"
            strokeWidth={3}
            dot={{ r: 5, fill: '#f59e0b' }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProfessionalLineChart;
