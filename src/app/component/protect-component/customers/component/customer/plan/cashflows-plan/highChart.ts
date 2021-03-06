import * as Highcharts from 'highcharts';

export const chart = () => {
    new Highcharts.Chart('surplus', {
        chart: {
            type: 'bar'
        },
        // title: {
        //     text: 'Bar chart with negative values'
        // },
        xAxis: {
            categories: []
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            series: {
                stacking: 'normal',
            }
        },
        series: [{
            name: 'Income',
            data: [-1, -2, -2, -7, -2, -1, -1, -2, -3, -4, -5, -5, -6, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -1, -1, -1, -1, 2, 3],
            color: '#5DC644',
            pointWidth: 10
            // type: 'bar'

        } as Highcharts.SeriesBarOptions, {
            name: 'Expenses',
            data: [1, 2, 2, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            color: '#FFC100',
            pointWidth: 10
            // type: 'bar'

        } as Highcharts.SeriesBarOptions, {
            name: 'Liabilities',
            data: [1, 2, 3, 4, 2, -1, -1, -1, -1, -1, -1, -1, -1, 1, 0, 0, 0, 0, 0, 0, 0, 0, -1, -2, -3, -3, -4, -5],
            color: '#FF6823',
            pointWidth: 10
            // type: 'bar'

        } as Highcharts.SeriesBarOptions, {
            name: 'Insurance',
            data: [1, 2, 3, 3, 2, 1, 2, 3, 4, 5, 5, 6, 6, 0, 0, 0, -1, -2, -3, -4, -5, -6, -7],
            color: '#7B50FF',
            pointWidth: 10
            // type: 'bar'

        } as Highcharts.SeriesBarOptions, {
            name: 'Assets',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 3, 0, 7, 2],
            color: '#BCC6CA',
            pointWidth: 10
            // type: 'bar'

        } as Highcharts.SeriesBarOptions, {
            type: 'spline',
            name: 'Surplus',
            marker: {
                enabled: false
            },
            color: '#000000',
            pointWidth: 10,
            dashStyle: 'ShortDot',
            data: [1, 1, 1, 1., 1., 2, 1, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1],
        } as Highcharts.SeriesSplineOptions]
    });
}