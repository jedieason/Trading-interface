(async () => {
        const sheetDataUrl = 'https://script.google.com/macros/s/AKfycbxyc9TWyEcuIotd9QTYTIHdZUrqRRDO21SQsZdTIhTPbEbcKhJZh2e3H-UKGEDaMuU/exec'; // 替換成你的 Google Apps Script 網頁應用程式 URL
        const data = await fetch(sheetDataUrl).then(response => response.json());
      
        console.log(data); // 確認資料是否正確載入
      
        // Create the chart
        Highcharts.stockChart('chart-container', {
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
      })();
      
