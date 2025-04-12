import {
	Area,
	AreaChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

const data = [
	{ date: '13.3', price: 5000 },
	{ date: '16.3', price: 5500 },
	{ date: '19.3', price: 6000 },
	{ date: '22.3', price: 6500 },
	{ date: '25.3', price: 7000 },
	{ date: '28.3', price: 7143 },
	{ date: '31.3', price: 6800 },
	{ date: '3.4', price: 6500 },
	{ date: '6.4', price: 6200 },
	{ date: '9.4', price: 6000 },
	{ date: '12.4', price: 5800 },
];

const PriceHistoryChart = () => (
	<div style={{ width: '100%', height: '200px' }}>
		<ResponsiveContainer>
			<AreaChart data={data}>
				<defs>
					<linearGradient id='gradient' x1='0' y1='0' x2='0' y2='1'>
						<stop offset='0%' stopColor='#4f46e5' stopOpacity={0.2} />
						<stop offset='100%' stopColor='#4f46e5' stopOpacity={0} />
					</linearGradient>
				</defs>
				<XAxis
					dataKey='date'
					axisLine={false}
					tickLine={false}
					tick={{ fill: '#6b7280', fontSize: 16 }}
				/>
				<YAxis
					domain={[4000, 8000]}
					axisLine={false}
					tickLine={false}
					tick={{ fill: '#6b7280', fontSize: 16 }}
					tickFormatter={value => `${value / 1000}k`}
				/>
				<Tooltip
					formatter={value => [`${value} ₽`, 'Цена']}
					labelFormatter={label => `Дата: ${label}`}
				/>
				<Area
					type='monotone'
					dataKey='price'
					stroke='#4f46e5'
					strokeWidth={2}
					fill='url(#gradient)'
				/>
			</AreaChart>
		</ResponsiveContainer>
	</div>
);

export default PriceHistoryChart;
