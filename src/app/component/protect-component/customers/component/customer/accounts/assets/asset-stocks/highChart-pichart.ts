import * as Highcharts from 'highcharts';

export const pieChart = () => {
    Highcharts.chart('piechartStock', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
        title: {
            text: '',
            align: 'center',
            verticalAlign: 'middle',
            y: 60
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    style: {
                        fontWeight: 'bold',
                        color: 'white'
                    }
                },
                startAngle: 0,
                endAngle: 360,
                center: ['52%', '55%'],
                size: '120%'
            }
        },
        series: [{
            type: 'pie',
            name: 'Browser share',
            innerSize: '60%',
            data: [
                {
                    name: 'Banking',
                    y: 23,
                    color: '#008FFF',
                    dataLabels: {
                        enabled: false
                    }
                }, {
                    name: 'Information technology',
                    y: 13,
                    color: '#5DC644',
                    dataLabels: {
                        enabled: false
                    }
                }, {
                    name: 'FMCG',
                    y: 25.42,
                    color: '#FFC100',
                    dataLabels: {
                        enabled: false
                    }
                }, {
                    name: 'Other',
                    y: 12.61,
                    color: '#A0AEB4',
                    dataLabels: {
                        enabled: false
                    }
                }, {
                    name: 'Auto ancillaries',
                    y: 23.42,
                    color: '#FF7272',
                    dataLabels: {
                        enabled: false
                    }
                }
            ]
        }]
    });
}