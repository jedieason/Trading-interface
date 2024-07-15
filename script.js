const myModule = (async () => {
    let chart;
    let sheetDataUrl = "https://script.google.com/macros/s/AKfycbxYnx52JChtOhzVSpLyaOXEV9HhXxCCAnZlJFHkPHJBIBldtsG1ZIgtNrAwxFb0zIk/exec";

    // 更新 price input 和預估金額函數，只在首次載入時運行
    const updatePriceAndEstimatedAmount = (data) => {
        if (data && data.length > 0) {
            latestPrice = data[data.length - 1][1]; // 獲取最新價格
            const priceInput = document.getElementById('price-input');
            priceInput.value = latestPrice.toFixed(2);
            updateEstimatedAmount();
        }
    };

    // 初始化圖表
    const initializeChart = async () => {
        const data = await fetch(sheetDataUrl + '?action=all').then(response => response.json());
        console.log(data); // 確認資料是否正確載入

        chart = Highcharts.stockChart('chart-container', {
            rangeSelector: {
                selected: 1
            },
            title: {
                text: '臺大醫學概念股'
            },
            series: [{
                name: '臺大醫學概念股',
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

    // 更新圖表數據和餘額
    const updateChartData = async () => {
        const newData = await fetch(sheetDataUrl + '?action=latest').then(response => response.json());
        console.log(newData); // 確認新資料是否正確載入

        const series = chart.series[0];
        const currentData = series.options.data;

        // 假設新數據的時間戳總是大於現有數據的時間戳
        const lastPoint = currentData[currentData.length - 1];
        if (newData.time > lastPoint[0]) { // 檢查新數據點是否比最後一個數據點更新
            series.addPoint([newData.time, newData.price], true, false);
            latestPrice = newData.price; // 更新最後價格
        }

        // 獲取新的餘額
        if (username) { // 如果用戶已登入
            balance = await getBalance(user);
        }

        // 呼叫 updateBalance 函數
        updateBalance();
    };

    // 初始化圖表
    await initializeChart();

    // 每10秒更新一次數據和餘額
    setInterval(updateChartData, 10000);

    // 返回需要在外部調用的變數和函數
    return {
        initializeChart,
        setSheetDataUrl: (url) => { sheetDataUrl = url; }
    };
})();

async function getBalance(userName) {
    const url = `https://script.google.com/macros/s/AKfycbxPoiqIEsIRR4rnsrjKzULK3Pm7GevufMIlqQ2rsuORIFBNx7KK_gAWIWELIUL3QolK/exec?action=queryBalance&username=${encodeURIComponent(userName)}`;
    const response = await fetch(url);
    const result = await response.json();
    return result.success ? result.balance : 0;
}
