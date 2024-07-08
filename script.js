(async () => {
        const sheetDataUrl = 'https://script.google.com/macros/s/AKfycbxyc9TWyEcuIotd9QTYTIHdZUrqRRDO21SQsZdTIhTPbEbcKhJZh2e3H-UKGEDaMuU/exec'; // 替換成你的 Google Apps Script 網頁應用程式 URL
        let chart;
        let lastPrice = null; // 新增變數來儲存最後的價格
    
        // 更新 price input 和預估金額函數
        const updatePriceAndEstimatedAmount = (data) => {
            if (data && data.length > 0) {
                const latestPrice = data[data.length - 1][1]; // 獲取最新價格
                if (lastPrice !== latestPrice) { // 只在新價格與最後價格不同時更新
                    lastPrice = latestPrice; // 更新最後價格
                    const priceInput = document.getElementById('price-input');
                    priceInput.value = latestPrice.toFixed(2);
                    updateEstimatedAmount();
                }
            }
        };
    
        // 初始化圖表
        const initializeChart = async () => {
            const data = await fetch(sheetDataUrl).then(response => response.json());
            console.log(data); // 確認資料是否正確載入
    
            chart = Highcharts.stockChart('chart-container', {
                rangeSelector: {
                    selected: 1
                },
                title: {
                    text: '台積電'
                },
                series: [{
                    name: '台積電',
                    data: data,
                    type: 'areaspline',
                    threshold: null,
                    tooltip: {
                        valueDecimals: 2
                    },
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [
                                1,
                                Highcharts.color(
                                    Highcharts.getOptions().colors[0]
                                ).setOpacity(0).get('rgba')
                            ]
                        ]
                    }
                }]
            });
    
            // 更新 price input 和預估金額
            updatePriceAndEstimatedAmount(data);
        };
    
        // 更新圖表數據
        const updateChartData = async () => {
            const newData = await fetch(sheetDataUrl).then(response => response.json());
            console.log(newData); // 確認新資料是否正確載入
    
            const series = chart.series[0];
            const currentData = series.options.data;
            let dataUpdated = false; // 新增變數來追踪數據是否更新
    
            // 假設新數據的時間戳總是大於現有數據的時間戳
            newData.forEach(point => {
                const lastPoint = currentData[currentData.length - 1];
                if (point[0] > lastPoint[0]) { // 檢查新數據點是否比最後一個數據點更新
                    series.addPoint(point, true, false);
                    dataUpdated = true; // 若有新數據則更新變數
                }
            });
    
            // 更新 price input 和預估金額
            if (dataUpdated) {
                updatePriceAndEstimatedAmount(newData);
            }
        };
    
        // 初始化圖表
        await initializeChart();
    
        // 每10秒更新一次數據
        setInterval(updateChartData, 10000);
    
    })();
