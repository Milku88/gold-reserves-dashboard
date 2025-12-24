// Pobierz dane
fetch('/api/gold-reserves')
  .then(res => res.json())
  .then(data => {
    // Wykres kołowy
    const ctx = document.getElementById('goldChart').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.map(d => d.country),
        datasets: [{
          data: data.map(d => d.percent),
          backgroundColor: [
            '#FFD700', '#C0C0C0', '#CD7F32', '#D4AF37', '#B8860B',
            '#FFA500', '#8B4513', '#A9A9A9', '#DEB887', '#D2691E',
            '#8B0000', '#FF8C00', '#696969'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' }
        }
      }
    });

    // Tabela
    const tbody = document.getElementById('tableBody');
    data.forEach(item => {
      const row = `<tr>
        <td>${item.country}</td>
        <td>${item.tonnes.toLocaleString()}</td>
        <td>${item.percent}%</td>
      </tr>`;
      tbody.innerHTML += row;
    });
  });