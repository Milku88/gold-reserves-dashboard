// Pobierz dane
fetch('/api/gold-reserves')
  .then(res => res.json())
  .then(data => {
    // 1. Wypełnij tabelę
    const tbody = document.getElementById('tableBody');
    data.forEach(item => {
      const row = `<tr>
        <td>${item.country}</td>
        <td>${item.tonnes.toLocaleString()}</td>
        <td>${item.percent}%</td>
      </tr>`;
      tbody.innerHTML += row;
    });

    // 2. Wykres kołowy – top 8 + Other
    const top8Data = data.slice(0, 8); // top 8
    const otherData = data.slice(8);   // pozostali

    // Generuj kolory – odcienie pomarańczowego
    const orangeShades = [
      '#FF6A00', '#FF7D00', '#FF9000', '#FFA300',
      '#FFB600', '#FFC900', '#FFDC00', '#FFE900'
    ];

    // Dla "Other" użyj szarego
    const colors = [...orangeShades, '#CCCCCC'];

    // Dane do wykresu
    const chartData = {
      labels: [...top8Data.map(d => d.country), 'Other'],
      datasets: [{
        data: [...top8Data.map(d => d.percent), otherData.reduce((sum, d) => sum + d.percent, 0)],
        backgroundColor: colors,
        borderColor: '#000000',
        borderWidth: 1,
        hoverOffset: 10 // ✅ Powiększenie przy najechaniu
      }]
    };

    const ctx = document.getElementById('goldChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'pie',
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: false // wyłączamy domyślne tooltipy
          }
        },
        elements: {
          arc: {
            borderWidth: 0
          }
        }
      },
      plugins: [{
        afterDraw: function(chart) {
          const ctx = chart.ctx;
          chart.data.datasets[0].data.forEach((datapoint, index) => {
            const meta = chart.getDatasetMeta(0);
            const arc = meta.data[index];
            const startAngle = arc.startAngle;
            const endAngle = arc.endAngle;
            const midAngle = startAngle + (endAngle - startAngle) / 2;

            const x = arc.x + Math.cos(midAngle) * (arc.outerRadius / 2);
            const y = arc.y + Math.sin(midAngle) * (arc.outerRadius / 2);

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(midAngle);
            ctx.textAlign = 'center';
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 10px Bebas Neue';

            // Pokazuj nazwę tylko dla top 8
            if (index < 8) {
              ctx.fillText(`${chart.data.labels[index]}`, 0, 0);
              ctx.fillText(`${chart.data.datasets[0].data[index]}%`, 0, 15);
            }

            ctx.restore();
          });
        }
      }]
    });

    // 3. Animacja przy najechaniu – pokazuj info
    chart.canvas.addEventListener('mousemove', (e) => {
      const activePoints = chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
      if (activePoints.length > 0) {
        const index = activePoints[0].index;
        const country = chart.data.labels[index];
        const percent = chart.data.datasets[0].data[index];

        // Pokazuj info w tooltipie (np. w dolnej części ekranu)
        const tooltip = document.createElement('div');
        tooltip.style.position = 'absolute';
        tooltip.style.top = `${e.clientY + 10}px`;
        tooltip.style.left = `${e.clientX + 10}px`;
        tooltip.style.background = 'rgba(0,0,0,0.8)';
        tooltip.style.color = '#FFFFFF';
        tooltip.style.padding = '5px 10px';
        tooltip.style.borderLeft = '3px solid #FF6A00';
        tooltip.style.fontSize = '0.9rem';
        tooltip.textContent = `${country} – ${percent.toFixed(1)}%`;

        document.body.appendChild(tooltip);

        // Usuń po opuszczeniu myszy
        chart.canvas.addEventListener('mouseout', () => {
          tooltip.remove();
        }, { once: true });
      }
    });
  });

// Animacja przejścia
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-transition');
});