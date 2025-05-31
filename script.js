const allQuestions = [
      {
        text: "What comes next in the pattern? 2, 4, 8, 16, ?",
        options: ["18", "24", "32", "64"],
        correct: "32"
      },
      {
        text: "What animal is shown below?",
        image: "lion-pic.jpg",
        options: ["Tiger", "Lion", "Leopard", "Panther"],
        correct: "Lion"
      },
      {
        text: "How many triangles are there in the below picture?",
        image: "triangle.jpg",
        options: ["9", "13", "12", "10"],
        correct: "12"
      },
      {
        text: "What color do you get by mixing blue and yellow?",
        options: ["Green", "Purple", "Orange", "Pink"],
        correct: "Green"
      },
      {
        text: "What is the capital of Japan?",
        options: ["Tokyo", "Beijing", "Seoul", "Bangkok"],
        correct: "Tokyo"
      },
      {
        text: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: "Mars"
      },
      {
        text: "What is 15 × 4?",
        options: ["45", "60", "55", "50"],
        correct: "60"
      },
      {
        text: "Which ocean is the largest?",
        options: ["Atlantic", "Indian", "Arctic", "Pacific"],
        correct: "Pacific"
      },
      {
        text: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correct: "Au"
      },
      {
        text: "How many sides does a pentagon have?",
        options: ["4", "5", "6", "7"],
        correct: "5"
      },
      {
        text: "What is the largest mammal in the world?",
        options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        correct: "Blue Whale"
      },
      {
        text: "Which country is famous for the Eiffel Tower?",
        options: ["Italy", "Spain", "France", "Germany"],
        correct: "France"
      },
      {
        text: "What is 144 ÷ 12?",
        options: ["11", "12", "13", "14"],
        correct: "12"
      },
      {
        text: "Which gas do plants absorb from the atmosphere?",
        options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
        correct: "Carbon Dioxide"
      },
      {
        text: "What is the smallest prime number?",
        options: ["0", "1", "2", "3"],
        correct: "2"
      }
    ];

let currentQuestions = [];

let audioContext;
let thunderSounds=[];

function initAudio() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    createThunderSounds();
  } catch (error) {
    console.log('Web Audio API not supported');
  }
}

function createThunderSounds() {
  if (!audioContext) return;

  for (let i = 0; i < 3; i++) {
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let j = 0; j < data.length; j++) {
      const decay = Math.exp(-j / (audioContext.sampleRate * 0.5));
      const noise = (Math.random() * 2 - 1) * decay;
      const rumble = Math.sin(j * 0.01) * decay * 0.3;
      data[j] = (noise + rumble) * 0.5; 
    }
    
    thunderSounds.push(buffer);
  }
}

function playThunder() {
  if (!audioContext || thunderSounds.length === 0) return;

  try {
    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();
    
    source.buffer = thunderSounds[Math.floor(Math.random() * thunderSounds.length)];
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    gainNode.gain.value = 0.1 + Math.random() * 0.2;
    
    source.start();
  } catch (error) {
    console.log('Error playing thunder sound');
  }
}

function triggerThunder() {
  const flash = document.getElementById('thunderFlash');
  const indicator = document.getElementById('thunderIndicator');
  flash.classList.add('active');
  indicator.classList.add('show');
  setTimeout(() => {
    playThunder();
  }, 200 + Math.random() * 800);
  setTimeout(() => {
    flash.classList.remove('active');
  }, 200);
  setTimeout(() => {
    indicator.classList.remove('show');
  }, 2000);
}
function scheduleThunder() {
  const interval = 15000 + Math.random() * 30000;
  
  setTimeout(() => {
    if (Math.random() < 0.7) {
      triggerThunder();
    }
    scheduleThunder();
  }, interval);
}

function createRainDrop() {
  const drop = document.createElement('div');
  drop.className = 'rain-drop';
  drop.style.left = Math.random() * 100 + '%';
  drop.style.animationDuration = (Math.random() * 3 + 2) + 's';
  drop.style.opacity = Math.random() * 0.5 + 0.2;
  document.getElementById('rainFallback').appendChild(drop);
  
  setTimeout(() => {
    drop.remove();
  }, 5000);
}

setInterval(createRainDrop, 100);

function shuffleArray(array){
  const shuffled = [...array];
  for(let i=shuffled.length-1; i>0; i--){
    const j= Math.floor(Math.random()*(i+1));
    [shuffled[i],shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getRandomQuestions(count = 5) {
  const shuffled = shuffleArray(allQuestions);
  return shuffled.slice(0, count);
}

function loadQuiz() {
  currentQuestions = getRandomQuestions(5);
  const quizContainer = document.getElementById("quizContainer");
  quizContainer.innerHTML = '';

  currentQuestions.forEach((q, index) => {
    const div = document.createElement('div');
    div.className = "question";
    div.style.animationDelay = `${index * 0.1}s`;

    const shuffledOptions = shuffleArray(q.options);

    div.innerHTML = `
      <div class="question-text">${index + 1}. ${q.text}</div>
      ${q.image ? `<img src="${q.image}" alt="Question Image" loading="lazy">` : ''}
      <div class="options-container">
        ${shuffledOptions.map(opt => `
          <label class="option-label">
            <input type="radio" name="q${index}" value="${opt}"> ${opt}
          </label>
        `).join('')}
      </div>
    `;

    quizContainer.appendChild(div);
  });
}

function loadNewQuiz() {
  document.getElementById("quizResult").className = "result";
  document.getElementById("quizResult").textContent = "";
  loadQuiz();
}

function submitQuiz() {
  let score = 0;
  let totalQuestions = currentQuestions.length;
      
  currentQuestions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (selected && selected.value === q.correct) {
      score++;
    }
  });
      
  const percentage = Math.round((score / totalQuestions) * 100);
  const resultElement = document.getElementById("quizResult");
      
  let resultClass = "fair";
  let emoji = "🤔";
  let message = "Keep practicing!";
      
  if (percentage >= 80) {
    resultClass = "excellent";
    emoji = "🎉";
    message = "Outstanding!";
  } 
  else if (percentage >= 60) {
    resultClass = "good";
    emoji = "👏";
    message = "Well done!";
  }
  resultElement.className = `result ${resultClass} show`;
  resultElement.innerHTML = `
    <div style="font-size: 3rem; margin-bottom: 10px;">${emoji}</div>
    <div>You scored ${score} out of ${totalQuestions} (${percentage}%)</div>
    <div style="font-size: 1rem; margin-top: 10px; opacity: 0.8;">${message}</div>
  `;
  
  setTimeout(() => {
    resultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 300);
}


function fetchWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const apiKey = "1d9653482c04f3763e7b09e799e528e9";
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);            
        if (!res.ok) {
          throw new Error('Weather data not available');
        }    
        const data = await res.json();
        const temp = Math.round(data.main.temp);
        const feelsLike = Math.round(data.main.feels_like);
        const description = data.weather[0].description;
        const icon = getWeatherIcon(data.weather[0].main);
        const humidity = data.main.humidity;
        const windSpeed = Math.round(data.wind.speed * 3.6);

        document.getElementById("weatherInfo").innerHTML = `
          <div style="font-size: 4rem; margin-bottom: 15px;">${icon}</div>
          <div style="font-size: 2.2rem; font-weight: bold; margin-bottom: 10px;">${temp}°C</div>
          <div style="font-size: 1.1rem; margin-bottom: 5px;">Feels like ${feelsLike}°C</div>
          <div style="font-size: 1rem; opacity: 0.9; text-transform: capitalize; margin-bottom: 10px;">${description}</div>
          <div style="display: flex; justify-content: center; gap: 20px; margin: 15px 0; flex-wrap: wrap;">
            <div style="font-size: 0.9rem;">💧 ${humidity}%</div>
            <div style="font-size: 0.9rem;">💨 ${windSpeed} km/h</div>
          </div>
          <div style="font-size: 0.9rem; margin-top: 15px; opacity: 0.8;">📍 ${data.name}, ${data.sys.country}</div>
        `;
      } 
      catch (error) {
        document.getElementById("weatherInfo").innerHTML = `
          <div style="font-size: 4rem; margin-bottom: 15px;">🌧️</div>
          <div style="font-size: 2.2rem; font-weight: bold; margin-bottom: 10px;">Perfect Quiz Weather!</div>
          <div style="font-size: 1rem; opacity: 0.9; margin-bottom: 10px;">Enjoy the rain while learning</div>
          <div style="font-size: 0.9rem; opacity: 0.8; margin-top: 10px;">🌍 Weather service temporarily unavailable</div>
        `;
      }
    }, () => {
      document.getElementById("weatherInfo").innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 15px;">🌧️</div>
        <div style="font-size: 1.8rem; font-weight: bold; margin-bottom: 10px;">Rainy Day Quiz</div>
        <div style="font-size: 1rem; opacity: 0.9;">Perfect weather for learning!</div>
        <div style="font-size: 0.9rem; opacity: 0.8; margin-top: 10px;">📍 Enable location for local weather</div>
      `;
    });
  } 
  else {
    document.getElementById("weatherInfo").innerHTML = `
      <div style="font-size: 4rem; margin-bottom: 15px;">🌧️</div>
      <div style="font-size: 1.8rem; font-weight: bold; margin-bottom: 10px;">Quiz Time!</div>
      <div style="font-size: 1rem; opacity: 0.9;">Enjoy the virtual rain</div>
      <div style="font-size: 0.9rem; opacity: 0.8; margin-top: 10px;">🚫 Geolocation not supported</div>
    `;
  }
}

function getWeatherIcon(weatherMain) {
  const icons = {
    'Clear': '☀',
    'Clouds': '☁',
    'Rain': '🌧',
    'Drizzle': '🌦',
    'Thunderstorm': '⛈',
    'Snow': '❄',
    'Mist': '🌫',
    'Fog': '🌫',
    'Haze': '🌫'
  };
  return icons[weatherMain] || '🌤';
}

document.addEventListener('DOMContentLoaded', function() {
  loadQuiz();
  fetchWeather();
  
  document.addEventListener('click', () => {
    if (!audioContext) {
      initAudio();
      scheduleThunder();
    }
  }, { once: true });
  scheduleThunder();

  const video = document.querySelector('video');
  if (video) {
    video.addEventListener('error', () => {
      document.querySelector('.video-background').style.display = 'none';
    });
  }
});