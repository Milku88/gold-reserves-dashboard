// Dane współrzędnych krajów (uproszczone)
const COUNTRY_COORDS = {
  "United States": [38, -97],
  "Germany": [51, 9],
  "Italy": [42, 12],
  "France": [46, 2],
  "Russia": [60, 100],
  "China": [35, 105],
  "Switzerland": [47, 8],
  "Japan": [36, 138],
  "India": [20, 78],
  "Netherlands": [52, 5],
  "Turkey": [39, 35],
  "Taiwan": [24, 121]
};

// Pobierz dane
Promise.all([
  fetch('/api/gold-reserves').then(res => res.json()),
  fetch('/api/gold-price').then(res => res.json())
]).then(([reservesData, priceData]) => {
  // 1. Wyświetl cenę złota
  document.getElementById('goldPrice').textContent = `💰 Current Gold Price: $${priceData.price}/oz`;

  // 2. Wykres kołowy
  const ctx = document.getElementById('goldChart').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: reservesData.map(d => d.country),
      datasets: [{
        data: reservesData.map(d => d.percent),
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

  // 3. Tabela
  const tbody = document.getElementById('tableBody');
  reservesData.forEach(item => {
    const row = `<tr>
      <td>${item.country}</td>
      <td>${item.tonnes.toLocaleString()}</td>
      <td>${item.percent}%</td>
    </tr>`;
    tbody.innerHTML += row;
  });

  // 4. Mapa
  const map = L.map('map').setView([20, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Dodaj markery
  reservesData.forEach(country => {
    if (country.country !== "Other" && COUNTRY_COORDS[country.country]) {
      const [lat, lng] = COUNTRY_COORDS[country.country];
      const radius = Math.max(5, Math.log(country.tonnes) * 3); // rozmiar proporcjonalny do log(rezerw)
      L.circleMarker([lat, lng], {
        radius: radius,
        color: '#b8860b',
        fillColor: '#FFD700',
        fillOpacity: 0.8,
        weight: 1
      }).addTo(map)
        .bindPopup(`<b>${country.country}</b><br/>${country.tonnes.toLocaleString()} tonnes`)
        .openPopup();
    }
  });
});