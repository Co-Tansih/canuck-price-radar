
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface PriceTrendChartProps {
  data: Array<{
    date: string;
    price: number;
    store: string;
  }>;
}

const PriceTrendChart = ({ data }: PriceTrendChartProps) => {
  // Group data by store
  const storeData = data.reduce((acc, item) => {
    if (!acc[item.store]) {
      acc[item.store] = [];
    }
    acc[item.store].push(item);
    return acc;
  }, {} as Record<string, typeof data>);

  // Create combined data for the chart
  const chartData = data.reduce((acc, item) => {
    const existingPoint = acc.find(point => point.date === item.date);
    if (existingPoint) {
      existingPoint[item.store] = item.price;
    } else {
      acc.push({
        date: item.date,
        [item.store]: item.price
      });
    }
    return acc;
  }, [] as any[]);

  // Sort by date
  chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const stores = Object.keys(storeData);
  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];

  // Calculate average price for reference line
  const allPrices = data.map(item => item.price);
  const averagePrice = allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: ${entry.value?.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <div className="flex flex-wrap gap-4">
          {stores.map((store, index) => (
            <div key={store} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-sm text-gray-600">{store}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              tickFormatter={(date) => new Date(date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine 
              y={averagePrice} 
              stroke="#9ca3af" 
              strokeDasharray="5 5" 
              label={{ value: `Avg: $${averagePrice.toFixed(2)}`, position: 'top' }}
            />
            {stores.map((store, index) => (
              <Line
                key={store}
                type="monotone"
                dataKey={store}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Price Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Lowest Price:</span>
            <span className="ml-2 font-medium text-green-600">
              ${Math.min(...allPrices).toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Highest Price:</span>
            <span className="ml-2 font-medium text-red-600">
              ${Math.max(...allPrices).toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Average Price:</span>
            <span className="ml-2 font-medium text-gray-900">
              ${averagePrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceTrendChart;
