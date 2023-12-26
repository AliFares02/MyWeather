import { useEffect, useState } from 'react';
import { TiWeatherPartlySunny, TiWeatherShower, TiWeatherWindy,TiWeatherSnow, TiWeatherSunny } from "react-icons/ti";
import { WiHumidity } from "react-icons/wi";
import { MdMyLocation } from "react-icons/md";
import { PiThermometerHotBold } from "react-icons/pi";


export default function Card() {
const [temperature, setTemperature] = useState(0);
const [low, setLow] = useState(0);
const [high, setHigh] = useState(0);
const [windSpeed, setWindSpeed] = useState(0);
const [humidity, setHumidity] = useState(0);
const [feelsLike, setFeelsLike] = useState(0);
const [city, setCity] = useState('');
const [lat, setLat] = useState(0);
const [lon, setLon] = useState(0);
const [cityDisplay, setCityDisplay] = useState('');
const [weatherIcon, setWeatherIcon] = useState('');
const [displaySideCards, setDisplaySideCards] = useState(false);

  const skies = ['Clouds', 'Clear', 'Rain', 'Snow'];
  const skiesIcons = [TiWeatherPartlySunny, TiWeatherSunny, TiWeatherShower, TiWeatherSnow];
  const activities = [
    {
      outfit1: 'You should grab a coat',
      outfit2: 'You should grab a hoodie or a shirt',
      activity1: 'Head to the beach',
      activity2: 'Head to the park',
      activity3: 'Go play sports',
      activity4: 'Have a barbecue',
      activity5: 'Go for a jog'
    }, 
    {
     outfit: 'You should grab a coat, rain boots, and an umbrella',
     activity1: 'Visit a museum or art gallery',
     activity2: 'Go to the movie theater',
     activity3: 'Stay home and get some work done'
    },
    {
      outfit: 'You should grab a coat and snow boots',
      activity1: 'Go ice skating',
      activity2: 'Invite family/friends over',
      activity3: 'Sightsee in the city side'  
    }
  ];
  const questions = ['What does it mean when someone is "under the weather"?', 'In the movie "Frozen," what is Elsa\'s magical power related to?', 'Which weather condition is often associated with a rainbow appearing in the sky?', 'Which famous painting by Vincent van Gogh depicts a swirling night sky with stars?', 'What is earth\'s main source of energy?'];

  const answers = [
    {
      choices: [
        'They\'re excited', 'They\'re sick or not feeling well', 'They\'re enjoying good weather', 'They\'re distracted'
      ],
      correct: 'They\'re sick or not feeling well'
    }, 
    {
      choices: [
        'Fire', 'Wind', 'Ice and Snow', 'Lightning'
      ],
      correct: 'Ice and Snow'
    }, 
    {
      choices: [
        'Hailstorm', 'Thunderstorm', 'Drizzle', 'Rain shower'
      ],
      correct: 'Rain shower'
    }, 
    {
      choices: [
        'Sunflowers', 'Starry Night', 'The Persistence of Memory', 'The Scream'
      ],
      correct: 'Starry Night'
    }, 
    {
      choices: [
        'The Ocean', 'Wind', 'The Sun', 'Gravity'
      ],
      correct: 'The Sun'
    }];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [numberCorrect, setNumberCorrect] = useState(0);

  const handleNextQuestion = (e) => {
    e.preventDefault();
    
    const choice = document.querySelector('input[name="choice"]:checked');
    const selectedValue = choice ? choice.value : null;
    if (selectedValue === answers[currentQuestionIndex].correct && currentQuestionIndex < questions.length) {
      setNumberCorrect(numberCorrect + 1);
    }

    if (currentQuestionIndex < questions.length && selectedOption !== null) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    }
  }

 const handleSideCardsDisplay = (isValidCity) => {
  setDisplaySideCards(isValidCity);
 }

  const handleUserLocation = async () => {
  try {
    navigator.geolocation.getCurrentPosition(
    (position) => {
      setLat(position.coords.latitude);
      setLon(position.coords.longitude);
      handleSideCardsDisplay(true);
    },
    (error) => {
      console.log(error.message);
    }
  );
  } catch (error) {
    console.log(error);
  }
  }

  const handleFormSubmit = async (e) => {
  e.preventDefault();
  try {
    let [cityName, stateOrCountryCode] = city.split(',').map(part => part.trim());

    console.log(cityName, stateOrCountryCode,);
    
    const data = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateOrCountryCode}&appid=a0799494c95f26029e2b276334814c8b`);
    const res = await data.json();
    if (res && res.length > 0) {
    setLat(res[0].lat);
    setLon(res[0].lon);
    handleSideCardsDisplay(true);
  } else {
    console.log('Invalid city or empty response');
  }
  
  } catch (error) {
    console.log(error);
  }
  }

const handleTemp = async () => {
  try {
    if (lat !== 0 && lon !== 0) {
      const data = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=a0799494c95f26029e2b276334814c8b&units=imperial`);
      const res = await data.json();
    
    setTemperature(Math.round(res.list[0].main.temp));
    setLow(Math.round(res.list[0].main.temp_min));
    setHigh(Math.round(res.list[0].main.temp_max));
    setWindSpeed(Math.round(res.list[0].wind.speed));
    setHumidity(Math.round(res.list[0].main.humidity));
    setFeelsLike(Math.round(res.list[0].main.feels_like));
    setWeatherIcon(res.list[0].weather[0].main);
    }
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  const fetchData = async () => {
    try {
       const data = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat},${lon}&key=70df105488f345788f1dcb3c62dfdf0e`);
      const res = await data.json();
      if (res.results && res.results.length > 0) {
        setCityDisplay(res.results[0].components.city);
      } else {
        console.log('City not found in results.');
      }
    } catch (error) {
      console.log(error);
    }
  }
  if (lat !== 0 && lon !== 0) {
    fetchData();
  }
}, [lat, lon])

 useEffect(() => {
  handleTemp();
 }, [lat, lon]);


  return (
    <main className='main'>
      <div className='weather-card'>  
          <form onSubmit={handleFormSubmit}>
            <div className='search-div'>
              <input type="text" id='city' value={city} onChange={(e) => setCity(e.target.value.toUpperCase())} placeholder='Enter: "city, state/country". e.x "tokyo, japan"'/>
              <button style={{fontFamily:'Montserrat', fontWeight:'600'}}>Search</button>
            </div>
          </form>

        <div style={{display:'flex', alignItems:'center'}}>
          <p style={{fontSize:'11px', marginLeft:'-155px'}}>Click to use my location &#8594;</p>
          <MdMyLocation onClick={() => handleUserLocation()} style={{cursor:'pointer', marginLeft:'10px'}}/>
          
        </div>
        
        <div className='weather-icon'>
          {skies.map((sky, index) => {
            if (sky === weatherIcon) {
              const IconComponent = skiesIcons[index];
              return <IconComponent key={index} size={'40px'} />;
            }
            return null;
          })} 
        </div>
        <p style={{color:'white', fontWeight:'600', fontSize:'35px', fontFamily:'Montserrat', marginBottom:'-22px', marginTop:'-20px'}}>{cityDisplay}</p>
        <p style={{color:'white', fontWeight:'600', fontSize:'50px', fontFamily:'Montserrat', marginBottom:'25px'}}>{temperature}&#xb0;</p>

        <div style={{display:'flex', gap:'87px', marginTop:'-10px'}}>
          <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <p style={{fontWeight:'400', fontSize:'22px', marginBottom:'-5px'}}>Low</p>
            <p style={{fontWeight:'400', fontSize:'22px'}}>{low}&#xb0;</p>
          </div>
          <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <p style={{fontWeight:'400', fontSize:'22px', marginBottom:'-5px'}}>High</p>
            <p style={{fontWeight:'400', fontSize:'22px'}}>{high}&#xb0;</p>
          </div>
        </div>

        <div className='extra-info'>
          <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <p><PiThermometerHotBold size={'35px'} style={{marginBottom:'-16px'}}/></p>
            <p>{feelsLike}&#xb0;</p>
          </div>
          <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <p><TiWeatherWindy size={'40px'} style={{marginBottom:'-20px'}}/></p>
            <p>{windSpeed} mph</p>
          </div>
          <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <p><WiHumidity size={'40px'} style={{marginBottom:'-20px'}}/></p>
            <p>{humidity}&#x25;</p>
          </div>
        </div>
      </div>

          {displaySideCards && (
            <div className='right-card'>
              <div className='recommended-card'>
                <div style={{background:'linear-gradient(to right, #2e5e52, #058c9e)',       borderRadius:'5px', padding:'2px', margin:'6px'}}>
                  <p style={{fontSize:'12.5px', paddingLeft:'8px', marginTop:'5px', marginBottom:'5px', fontWeight:'600'}}>
                    Recommended apparel/outdoor activities
                  </p>
                </div>
                <div>
                  {temperature <= 60 && (weatherIcon === 'Clouds' || weatherIcon === 'Clear') && (
                    <div style={{background:'linear-gradient(to right, #2e5e52, #058c9e)',borderRadius:'5px', height:'208px', width:'188px',margin:'5.5px'}}>
                      <ul style={{marginLeft:'-14.5px', marginTop:'-13px'}}>
                        <li><p style={{fontSize:'12px'}}>{activities[0].outfit1}</p></li>
                        <li><p style={{fontSize:'12px'}}>{activities[0].activity2}</p></li>
                        <li><p style={{fontSize:'12px'}}>{activities[0].activity4}</p></li>
                      </ul>
                    </div>
                  )}
                  {temperature > 60 && (weatherIcon === 'Clouds' || weatherIcon === 'Clear') && (
                    <div style={{background:'linear-gradient(to right, #2e5e52, #058c9e)',borderRadius:'5px', height:'208px', width:'188px',margin:'5.5px'}}>
                      <ul style={{marginLeft:'-14.5px', marginTop:'-13px'}}>
                        <li><p style={{fontSize:'12px'}}>{activities[0].outfit2}</p></li>
                        <li><p style={{fontSize:'12px'}}>{activities[0].activity1}</p></li>
                        <li><p style={{fontSize:'12px'}}>{activities[0].activity2}</p></li>
                        <li><p style={{fontSize:'12px'}}>{activities[0].activity3}</p></li>
                        <li><p style={{fontSize:'12px'}}>{activities[0].activity4}</p></li>
                        <li><p style={{fontSize:'12px'}}>{activities[0].activity5}</p></li>
                      </ul>
                    </div>
                  )}
                  {weatherIcon === 'Rain' && (
                    <div style={{background:'linear-gradient(to right, #2e5e52, #058c9e)',borderRadius:'5px', height:'208px', width:'188px',margin:'5.5px'}}>
                      <ul style={{marginLeft:'-14.5px', marginTop:'-13px'}}>
                        <li><p style={{fontSize:'12px'}}>{activities[1].outfit}</p></li>
                        <li><p style={{fontSize:'12px'}}>{activities[1].activity1}</p></li>
                        <li><p style={{fontSize:'12px'}}>{activities[1].activity2}</p></li>
                        <li><p style={{fontSize:'12px'}}>{activities[1].activity3}</p></li>
                      </ul>
                    </div>
                  )}
                  {weatherIcon === 'Snow' && (
                    <div style={{background:'linear-gradient(to right, #2e5e52, #058c9e)',borderRadius:'5px', height:'208px', width:'188px',margin:'5.5px'}}>
                      <ul style={{marginLeft:'-14.5px', marginTop:'-13px'}}>
                        <li><p style={{fontSize:'12px'}}>{activities[2].outfit}</p></li>
                        <li><p style={{fontSize:'12px'}}>{activities[2].activity1}</p></li>
                        <li><p style={{fontSize:'12px'}}>{activities[2].activity2}</p></li>
                        <li><p style={{fontSize:'12px'}}>{activities[2].activity3}</p></li>
                      </ul>
                    </div>
                  )}
                  
                </div>                
              </div>

              <div className='quiz-card'>
                <div style={{background:'linear-gradient(to right, #2e5e52, #058c9e)', borderRadius:'5px', padding:'2px', margin:'5.5px'}}>
                  <p style={{fontSize:'12px',paddingLeft:'8px', marginTop:'5px', marginBottom:'5px', marginRight:'2px', fontWeight:'600'}}>
                    Take a fun weather-related trivia!
                  </p>
                </div>
                
                  <div style={{background:'linear-gradient(to right, #2e5e52, #058c9e)',borderRadius:'5px', height:'208px', width:'188px',margin:'5.5px'}}>
                    <div>
                      <form style={{display:'flex', flexDirection:'column'}}>
                      {currentQuestionIndex < questions.length && (
                        <div>
                          <p style={{fontSize:'11.5px', marginLeft:'9px', marginTop:'7px',marginBottom:'8px'}}>
                          {questions[currentQuestionIndex]}
                          </p>
                          <div style={{marginLeft:'5px', display:'flex', flexDirection:'column', gap:'10px'}}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <input type="radio" name="choice" value={answers[currentQuestionIndex].choices[0]} onChange={() => setSelectedOption(answers[currentQuestionIndex].choices[0])} checked={selectedOption === answers[currentQuestionIndex].choices[0]}/>
                              <label style={{ marginLeft: '5px', fontSize:'11.5px'}}>{answers[currentQuestionIndex].choices[0]}</label>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <input type="radio" name="choice" value={answers[currentQuestionIndex].choices[1]} onChange={() => setSelectedOption(answers[currentQuestionIndex].choices[1])} checked={selectedOption === answers[currentQuestionIndex].choices[1]}/>
                              <label style={{ marginLeft: '5px', fontSize:'11.5px'}}>{answers[currentQuestionIndex].choices[1]}</label>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <input type="radio" name="choice" value={answers[currentQuestionIndex].choices[2]} onChange={() => setSelectedOption(answers[currentQuestionIndex].choices[2])} checked={selectedOption === answers[currentQuestionIndex].choices[2]}/>
                              <label style={{ marginLeft: '5px', fontSize:'11.5px'}}>{answers[currentQuestionIndex].choices[2]}</label>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center'}}>
                              <input type="radio" name="choice" value={answers[currentQuestionIndex].choices[3]} onChange={() => setSelectedOption(answers[currentQuestionIndex].choices[3])} checked={selectedOption === answers[currentQuestionIndex].choices[3]}/>
                              <label style={{ marginLeft: '5px', fontSize:'11.5px'}}>{answers[currentQuestionIndex].choices[3]}</label>
                            </div>                     
                          </div>
                        </div>
                      )}
                      </form>
                    </div>
                    <div style={{position:'fixed', bottom:'220px'}}>
                      <div style={{marginLeft:'9px', display:'flex', alignItems:'center', gap:'2px', marginBottom:'-5px'}}>
                        <p style={{fontSize:'12px'}}>&#x23;{currentQuestionIndex + '/5'}</p>
                        <p>&#124;</p>
                        <p style={{fontSize:'12px'}}>{numberCorrect} correct</p>
                      </div>
                      <div style={{position:'fixed', bottom:'233px'}}>
                      <button style={{width:'50px', marginLeft:'132px', marginTop:'8px', cursor:'pointer', color:'white', fontFamily:'Montserrat', borderRadius:'3px', border:'none', background:'linear-gradient(to right, #189b7a, #06c8e2)', fontWeight:'600'}} onClick={handleNextQuestion} disabled={selectedOption === null}>Next</button>
                    </div>
                    </div>
                    
                      
                  </div>  
              </div>
            </div>
          )}
      
      
    </main>
  )
}
