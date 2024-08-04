import { Doughnut } from 'react-chartjs-2';

const DoughnutChart = ({ data }) => {
    const chartData = {
        labels: [],
        datasets: [
            {
                data: [data.marks, data.maxMarks - data.marks],
                backgroundColor: ['#4caf50', '#f0f0f0'],
                hoverBackgroundColor: ['#388e3c', '#e0e0e0'],
                borderWidth: 0,
            },
        ],
    };

    const options = {
        circumference: 180,
        rotation: -90,
        cutout: '75%',
        plugins: {
            tooltip: {
                enabled: false,
            },
        },
    };

    return (
        <Doughnut
            data={chartData}
            options={options}
            width={150}
            height={150}
        />
    );
};

export default DoughnutChart;