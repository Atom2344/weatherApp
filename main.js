//html要素取得
const mainul = document.querySelector('#mainul');
const userInput = document.querySelector('#userInput');
const cityName = document.querySelector('#cityName');
const searchButton = document.querySelector('#searchButton');
const errorP = document.querySelector('#errorP');
const weather = document.querySelector('#weather');
const temp = document.querySelector('#temp');
const hum = document.querySelector('#hum');
const wind = document.querySelector('#wind');
const loadingtext = document.querySelector('#loadingtext');
const historyUl = document.querySelector('#historyUl');

const local = JSON.parse(localStorage.getItem('weatherLocal')) || [];

history();

async function getWeather(city, isfromHistory = false) {
  //loading表示とAPIKEY取得
  loadingtext.textContent = 'loading...';
  const API_KEY = 'd4243d2788a50185a8b45e4eae078478';

  try {
    //初期設定
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
    );
    const data = await response.json();

    if (data.cod !== 200) {
      loadingtext.textContent = '';
      errorP.textContent = '⚠️not found the city⚠️';
      return;
    }

    //表示
    errorP.innerHTML = '';
    userInput.value = '';
    renderDisplay(data);
    if (!isfromHistory) {
      //localstorage
      local.push(city);
      //保存
      save();
    }

    //履歴
    history();
    //エラー時
  } catch (error) {
    loadingtext.innerHTML = '';
    errorP.textContent = '⚠️not found the city⚠️';
  }
}

//検索ボタン
searchButton.addEventListener('click', () => {
  getWeather(userInput.value);
  userInput.value = '';
  history();
});

//表示
function renderDisplay(data) {
  loadingtext.textContent = '';
  cityName.textContent = `⛰️city: ${data.name}`;
  weather.textContent = `⭐️weather: ${data.weather[0].main}`;
  temp.textContent = `🌡️temperature: ${data.main.temp}°`;
  hum.textContent = `💦humidity: ${data.main.humidity}%`;
  wind.textContent = `🌪️wind: ${data.wind.speed}(m/s)`;
}

//保存
function save() {
  localStorage.setItem('weatherLocal', JSON.stringify(local));
}

//履歴
function history() {
  //histroryの表示
  historyUl.textContent = '';
  for (const item of local) {
    const li = document.createElement('li');
    const historybutton = document.createElement('button');
    historybutton.textContent = 'search';
    li.textContent = item;
    li.appendChild(historybutton);
    historyUl.appendChild(li);

    historybutton.addEventListener('click', () => {
      getWeather(item, true);
    });
  }
}

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    getWeather(userInput.value);
    history();
  }
});

getWeather('Tokyo', true);
