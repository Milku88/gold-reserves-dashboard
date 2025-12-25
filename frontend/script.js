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

    // 2. Wykres kołowy z napisami i animacją
    const ctx = document.getElementById('goldChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.map(d => d.country),
        datasets: [{
          data: data.map(d => d.percent),
          backgroundColor: ['#FF6A00'],
          borderColor: '#000000',
          borderWidth: 1,
          hoverOffset: 10 // ✅ Segment się powiększa przy najechaniu
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false } // wyłączamy tooltip
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
            ctx.fillText(`${chart.data.labels[index]}`, 0, 0);
            ctx.fillText(`${chart.data.datasets[0].data[index]}%`, 0, 15);
            ctx.restore();
          });
        }
      }]
    });

    // 3. Dane obok wykresu – WSZYSTKIE kraje
    const dataList = document.getElementById('dataList');
    data.forEach(item => {
      dataList.innerHTML += `<p>${item.country} – ${item.tonnes.toLocaleString()}T / ${item.percent}%</p>`;
    });

    // 4. Animacja przy najechaniu – segment się powiększa + nazwa kraju
    chart.options.plugins.tooltip = {
      enabled: true,
      callbacks: {
        label: function(context) {
          return `${context.label}: ${context.raw}%`;
        }
      }
    };

    // Dodaj event listener do wykresu
    chart.canvas.addEventListener('mousemove', (e) => {
      const activePoints = chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
      if (activePoints.length > 0) {
        const index = activePoints[0].index;
        const country = chart.data.labels[index];
        const percent = chart.data.datasets[0].data[index];
        // Możesz tu dodać dodatkową animację lub logikę
      }
    });
  });

// Animacja przejścia
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-transition');
});