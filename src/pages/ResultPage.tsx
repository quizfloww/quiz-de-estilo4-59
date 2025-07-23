import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { StyleResult } from '@/types/quiz'; // Assuming this path is correct for StyleResult type

interface StylePercentageChartProps {
  primaryStyle: StyleResult;
  secondaryStyles: StyleResult[];
}

const COLORS = ['#aa6b5d', '#B89B7A', '#E0C9B6', '#F3E8E6', '#D4B8A2']; // Paleta de cores elegante

const StylePercentageChart: React.FC<StylePercentageChartProps> = ({ primaryStyle, secondaryStyles }) => {
  // Combine primary and secondary styles for the chart data
  const chartData = [
    { name: primaryStyle.category, value: primaryStyle.percentage },
    ...secondaryStyles.map(style => ({ name: style.category, value: style.percentage }))
  ];

  // Custom tooltip content to display percentage clearly
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white border border-gray-300 rounded-md shadow-md">
          <p className="font-semibold text-[#432818]">{`${payload[0].name}`}</p>
          <p className="text-[#aa6b5d]">{`${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80 bg-white rounded-lg shadow-sm border border-[#B89B7A]/10 p-4 flex flex-col items-center justify-center">
      <h3 className="text-xl font-semibold text-[#432818] mb-4">Análise de Estilo por Porcentagem</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StylePercentageChart;
