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

    // 2. Wykres kołowy z napisami w segementach
    const ctx = document.getElementById('goldChart').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.map(d => d.country),
        datasets: [{
          data: data.map(d => d.percent),
          backgroundColor: ['#FF6A00'],
          borderColor: '#000000',
          borderWidth: 1
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

    // 3. Dane obok wykresu (top 3)
    const dataList = document.getElementById('dataList');
    data.slice(0, 3).forEach(item => {
      dataList.innerHTML += `<p>${item.country} – ${item.tonnes.toLocaleString()}T / ${item.percent}%</p>`;
    });
  });

// Animacja przejścia (jeśli jesteśmy na START)
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-transition');
});