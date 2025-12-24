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

    // 2. Wykres kołowy
    const ctx = document.getElementById('goldChart').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.map(d => d.country),
        datasets: [{
          data: data.map(d => d.percent),
          backgroundColor: ['#FF6A00'],
          borderColor: '#000000',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        elements: {
          arc: {
            borderWidth: 0
          }
        }
      }
    });

    // 3. Dane obok wykresu
    const dataList = document.getElementById('dataList');
    data.slice(0, 3).forEach(item => {  // tylko top 3
      dataList.innerHTML += `<p>${item.country} – ${item.tonnes.toLocaleString()}T / ${item.percent}%</p>`;
    });
  });

  paths.forEach(path => {
  path.addEventListener('mouseenter', () => {
    path.style.fill = '#FFDEA8'; // jasny pomarańcz
  });
  path.addEventListener('mouseleave', () => {
    path.style.fill = '#FF6A00'; // normalny pomarańcz
  });
});

// Zmień kolory mapy po załadowaniu
document.addEventListener('DOMContentLoaded', () => {
  const svg = document.querySelector('.map-container svg');
  if (svg) {
    const paths = svg.querySelectorAll('path');
    paths.forEach(path => {
      path.style.fill = '#FF6A00';
      path.style.stroke = '#000000';
      path.style.strokeWidth = '0.5';
    });
  }
});