const cryptoSelect = document.getElementById('crypto');
const priceDisplay = document.getElementById('price-display');
const ctx = document.getElementById('priceChart').getContext('2d');
const rangeSelect = document.getElementById('range');
let chart;
let currentPrice = 0;
let darkMode = true;

async function fetchTopCoins() {
  const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1');
  const data = await res.json();
  cryptoSelect.innerHTML = '';
  data.forEach(coin => {
    const option = document.createElement('option');
    option.value = coin.id;
    option.text = `${coin.name} (${coin.symbol.toUpperCase()})`;
    cryptoSelect.appendChild(option);
  });
  await fetchPrice();
  drawChart();
}

async function fetchPrice() {
  const coinId = cryptoSelect.value;
  const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
  const data = await res.json();
  currentPrice = data[coinId]?.usd || 0;
  priceDisplay.textContent = `Live Price: $${currentPrice.toFixed(2)}`;
}

function calculateReturn() {
  const quantity = parseFloat(document.getElementById('quantity').value);
  const years = parseInt(document.getElementById('years').value);
  const sellPrice = parseFloat(document.getElementById('sell-price').value);

  if (isNaN(quantity) || isNaN(sellPrice)) {
    document.getElementById('result').textContent = 'Please enter valid values.';
    return;
  }

  const futureValue = quantity * sellPrice;
  const initialInvestment = quantity * currentPrice;
  const profit = futureValue - initialInvestment;

  document.getElementById('result').innerHTML = 
    `Initial Investment: $${initialInvestment.toFixed(2)}<br>` +
    `Future Value: $${futureValue.toFixed(2)}<br>` +
    `Estimated Profit: $${profit.toFixed(2)}`;
}

async function drawChart() {
