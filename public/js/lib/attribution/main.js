var attribution = function() {
    var overviewData,
        series,
        dd;

    var getOverviewData = function() {
        $.get('/attribution_data', {
                type: 0
            }, function(data) {
                overviewData = data;
                info = data.data;
                series = [];
                dd = [];
                var series_insert = [{
                        name: "Clicks",
                        type: 'column',
                        data: []
                    }, {
                        name: 'CTR',
                        type: 'column',
                        data: [],
                        tooltip: {
                            valueSuffix: ' %'
                        }

                    }, {
                        name: 'Impressions',
                        data: [],
                        type: 'column'

                    }, {
                        name: 'Conversions',
                        data: [],
                        type: 'column',
                    }
                    //  {
                    //     name: 'Revenue',
                    //     data: [],
                    //     visible: true
                    // }

                ]
                for (i in info) {
                    if (i != '---') {
                        //day level
                        var day = info[i]

                        var total = day.reduce(function(prev, curr) {
                            for (j in curr) {
                                if (!isNaN(curr[j]) && i.toLowerCase().indexOf('id') < 0) {
                                    prev[j] = Number(prev[j]) + Number(curr[j]) || Number(curr[j])

                                }
                            }
                            return prev
                        }, {})

                        var daily = day.map(function(obj) {
                            return [obj.Placement, Number(obj.Impressions)]
                        })

                        total.name = total.drilldown = i
                        dd.push({
                            name: i,
                            id: i,
                            data: daily
                        })
                        series.push(total)
                    }
                }
                var y = []
                for (i in info) {
                    var day = info[i]

                    var d = day.reduce(function(b, c) {
                        b.push([c.Placement, Number(c['Impressions'])])
                        return b
                    }, [])
                    var a = {
                        id: i,
                        name: i,
                        data: d
                    }
                    y.push(a);
                }
                console.log(y)
                var categories = []
                for (i in series) {

                    series_insert[0].data.push({
                            name: 'Date:' + series[i].name,
                            drilldown: series[i].name,
                            y: series[i]['Clicks']
                        })
                        //series_insert[1].data.push(Math.round((series[i]['Clicks'] / series[i]['Impressions']) * 100))
                    series_insert[1].data.push({
                        name: 'Date:' + series[i].name,
                        drilldown: series[i].name,
                        y: Math.floor(((series[i]['Clicks'] / series[i]['Impressions']) * 10000)) / 100
                    })
                    series_insert[2].data.push({
                        name: 'Date:' + series[i].name,
                        drilldown: series[i].name,
                        y: series[i]['Impressions']
                    })
                    series_insert[3].data.push({
                            name: 'Date:' + series[i].name,
                            drilldown: series[i].name,
                            y: series[i]['Total Conversions']
                        })
                        // series_insert[4].data.push(series[i]['Total Revenue'])
                    categories.push(series[i]['name'])
                }
                $.each(series_insert, function(i, dataset) {
                    console.log(dataset)
                    $('<div class="row col-md-12">')
                        .appendTo('#syncCharts').highcharts({
                            chart: {
                                marginLeft: 40, // Keep all charts left aligned
                                spacingTop: 20,
                                spacingBottom: 20,
                                zoomType: 'x',
                                height: ($(window).height() - 120) / 4
                            },
                            credits: {
                                enabled: false
                            },
                            title: {
                                text: dataset.name
                            },
                            subtitle: {
                                text: null
                            },
                            xAxis: {
                                //type: "category",
                                crosshair: true,
                                events: {
                                    // setExtremes: syncExtremes
                                }
                            },
                            yAxis: {
                                title: {

                                }

                            },
                            legend: {
                                enabled: false
                            },
                            plotOptions: {
                                series: {
                                    borderWidth: 0,
                                    dataLabels: {
                                        enabled: false,
                                        //format: '{point.y:.0f}'
                                    }
                                }
                            },

                            tooltip: {
                                positioner: function() {
                                    return {
                                        x: 0, // right aligned
                                        y: -1 // align to title
                                    };
                                },

                                borderWidth: 0,
                                backgroundColor: 'none',
                                pointFormat: '{point.y} {series.name}',
                                shadow: false,
                                style: {
                                    fontSize: '12px'
                                },

                            },

                            series: [dataset],
                            drilldown: {
                                series: function() {
                                    var y = []
                                    for (i in info) {
                                        var day = info[i]

                                        var d = day.reduce(function(b, c) {
                                            b.push([c.Placement, Number(c['Impressions'])])
                                            return b
                                        }, [])
                                        var a = {
                                            id: i,
                                            name: i,
                                            data: d
                                        }
                                        y.push(a);
                                    }
                                    return y
                                }
                            }

                        })
                });
                console.log(Highcharts)
                overviewCtrlBtnsInit();
                // $('#syncCharts').bind('mousemove touchmove', function(e) {
                //     var chart,
                //         point,
                //         i;

                //     for (i = 0; i < Highcharts.charts.length; i = i + 1) {
                //         chart = Highcharts.charts[i];
                //         e = chart.pointer.normalize(e); // Find coordinates within the chart
                //         point = chart.series[0].searchPoint(e, true); // Get the hovered point
                //         if (point) {
                //             point.onMouseOver(); // Show the hover marker
                //             chart.tooltip.refresh(point); // Show the tooltip
                //             chart.xAxis[0].drawCrosshair(e, point); // Show the crosshair
                //         }
                //     }
                // });

            },
            'json')
    }

    var overviewCtrlBtnsInit = function() {
        $('.overviewCtrlBtns').click(function() {
            $this = $(this)
            $id = $this.attr('id')
            $this.toggleClass('active')
            $chart = $('#overview').highcharts()
            $ovbtngrp = $('.overviewCtrlBtns')
            $ovbtngrp.each(function(o) {

                if ($(this).hasClass('active'))
                    $chart.series[$(this).attr('id')].show()
                else
                    $chart.series[$(this).attr('id')].hide()
            })

        })
    }
    var syncExtremes = function(e) {
        var thisChart = this.chart;

        if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
            Highcharts.each(Highcharts.charts, function(chart) {
                if (chart !== thisChart) {
                    if (chart.xAxis[0].setExtremes) { // It is null while updating
                        chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, {
                            trigger: 'syncExtremes'
                        });
                    }
                }
            });
        }
    }

    return {
        init: function() {
            getOverviewData()
        }
    }
}()
Highcharts.setOptions({
    lang: {
        thousandsSep: ' '
    },
    chart: {
        style: {
            fontFamily: 'Open Sans'
        }
    }
});
$(document).ready(function() {
    attribution.init()
})
