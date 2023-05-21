import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import Data from './Food_Logic_Vitality.csv';
import MAPData from './MB_food.csv';
import M1 from './M1.js';
import M2 from './M2.js';
import M3 from './M3.js';
import M4 from './M4.js';
import M5 from './M5.js';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [MAPdata, setMAPdata] = useState([]);
  const [lwscore, setLwscore] = useState(0);
  const [twscore, setTwscore] = useState("0");
  const [fwscore, setFwscore] = useState("0");
  const [questions, setQuestions] = useState(true);
  const [recommendedFoodItems, setRecommendedFoodItems] = useState([]);
  const [showQuestion, setShowQuestion] = useState(1);

  //personal info
  const current = new Date().toISOString().split("T")[0];
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [diabetes, setDiabetes] = useState(0);
  const [hbp, setHbp] = useState(0);
  const [hbc, setHbc] = useState(0);
  const [nut_allerrgy, setNutAllergy] = useState(false);
  const [obese, setObese] = useState(false);
  

  //family history
  const [cd_history_checked, setcdChecked] = useState(false);
  const [cc_history_checked, setccChecked] = useState(false);
  const [gerd_history_checked, setgerdChecked] = useState(false);
  const [ibd_history_checked, setibdChecked] = useState(false);
  const [nash_history_checked, setnashChecked] = useState(false);
  const [t2dm_history_checked, sett2dmChecked] = useState(false);

  //stomach history
  const [acid_reflux, setAcidReflux] = useState(0);
  const [bloating, setBloating] = useState(0);
  const [early_satiety, setEarlySatiety] = useState(0);
  const [gastric_pain, setGastricPain] = useState(0);
  const [regurgitation, setRegurgitation] = useState(0);
  const [pass_stool, setPassStool] = useState(0);

  //diet
  const [fruit, setFruit] = useState(0);
  const [green_veg, setGreenVeg] = useState(0);
  const [alcohol, setAlcohol] = useState(0);
  const [fish, setFish] = useState(0);
  const [nut_legumes, setNutLegumes] = useState(0);
  const [red_meat, setRedMeat] = useState(0);
  const [whole_grains, setWholeGrains] = useState(0);

  //mood
  const [remembering, setRemembering] = useState(0);
  const [down, setDown] = useState(0);
  const [anxious, setAnxious] = useState(0);
  const [minThirty, setMinThirty] = useState(0);
  const [heartbeat, setHeartbeat] = useState(0);
  const [muscle_pain, setMusclePain] = useState(0);
  const [shortness, setShortness] = useState(0);
  const [lethargic, setLethargic] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(Data);
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder("utf-8");
      const csvData = decoder.decode(result.value);
      const parsedData = Papa.parse(csvData, {
        header: true, 
        skipEmptyLines: true,
      }).data;
      setData(parsedData)
    }
    fetchData();
    const fetchMAPData = async () => {
      const response1 = await fetch(MAPData);
      const reader1 = response1.body.getReader();
      const result1 = await reader1.read();
      const decoder1 = new TextDecoder("utf-8");
      const csvData1 = decoder1.decode(result1.value);
      const parsedDataMAP = Papa.parse(csvData1, {
        header: true, 
        skipEmptyLines: true,
      }).data;
      setMAPdata(parsedDataMAP)
      const filteredFoodItems = parsedDataMAP
        .filter(item => item.Formulation === 2)
        .map(item => item.Recommended_food_items);
      
        setRecommendedFoodItems(filteredFoodItems);
    }
    fetchMAPData();
  }, []);

  const handleChange = () => {
    calcLw();
    calcFw();
    calcTw();
    setQuestions(false);

  };


  const calcLw = () => {
    const bmi = weight / ((height /100)* (height/100));
    if (bmi >= 25.0) {
      setLwscore(lwscore => lwscore + 2);
      setObese(true);
    }
    if (cd_history_checked || cc_history_checked || gerd_history_checked || ibd_history_checked || nash_history_checked || t2dm_history_checked) {
      setLwscore(lwscore => lwscore + 2);
    }
    if (acid_reflux === 2) {
      setLwscore(lwscore => lwscore + 1);
    } else if (acid_reflux > 3) {
      setLwscore(lwscore => lwscore + 2);
    }
    if (bloating === 2) {
      setLwscore(lwscore => lwscore + 1);
    } else if (bloating > 3) {
      setLwscore(lwscore => lwscore + 2);
    }
    if (early_satiety === 2) {
      setLwscore(lwscore => lwscore + 1);
    } else if (early_satiety > 3) {
      setLwscore(lwscore => lwscore + 2);
    }
    if (gastric_pain === 2) {
      setLwscore(lwscore => lwscore + 1);
    } else if (gastric_pain > 3) {
      setLwscore(lwscore => lwscore + 2);
    }
    if (regurgitation === 2) {
      setLwscore(lwscore => lwscore + 1);
    } else if (regurgitation > 3) {
      setLwscore(lwscore => lwscore + 2);
    }
    if (pass_stool === 2) {
      setLwscore(lwscore => lwscore + 1);
    } else if (pass_stool > 3) {
      setLwscore(lwscore => lwscore + 2);
    }
    if (red_meat === 2) {
      setLwscore(lwscore => lwscore + 1);
    } else if (red_meat > 3) {
      setLwscore(lwscore => lwscore + 2);
    }
  };

  const calcFw = () => {
    if (fruit === 0) {
      setFwscore(fwscore => (parseFloat(fwscore) + 4).toFixed(2));
    } else if (fruit === 1) {
      setFwscore(fwscore => (parseFloat(fwscore) + 2).toFixed(2));
    } else if (fruit === 5) {
      setFwscore(fwscore => (parseFloat(fwscore) + 1).toFixed(2));
    }
    if (green_veg === 0) {
      setFwscore(fwscore => (parseFloat(fwscore) + 4).toFixed(2));
    } else if (green_veg === 1) {
      setFwscore(fwscore => (parseFloat(fwscore) + 2).toFixed(2));
    } else if (green_veg === 5) {
      setFwscore(fwscore => (parseFloat(fwscore) + 1).toFixed(2));
    }
    if (minThirty === 0) {
      setFwscore(fwscore => (parseFloat(fwscore) + 2).toFixed(2));
    } else if (minThirty > 0 && minThirty < 2) {
      setFwscore(fwscore => (parseFloat(fwscore) + 1.5).toFixed(2));
    } else if (minThirty > 1 && minThirty < 4) {
      setFwscore(fwscore => (parseFloat(fwscore) + 1).toFixed(2));
    } else if (minThirty > 3 && minThirty < 5) {
      setFwscore(fwscore => (parseFloat(fwscore) + 0.5).toFixed(2));
    }
    if (heartbeat > 4) {
      setFwscore(fwscore => (parseFloat(fwscore) + 2).toFixed(2));
    }
    if (muscle_pain > 4) {
      setFwscore(fwscore => (parseFloat(fwscore) + 2).toFixed(2));
    }
    if (shortness > 0 & shortness < 2) {
      setFwscore(fwscore => (parseFloat(fwscore) + 0.5).toFixed(2));
    } else if (shortness > 1 & shortness < 4) {
      setFwscore(fwscore => (parseFloat(fwscore) + 1).toFixed(2));
    } else if (shortness > 3 & shortness < 5) {
      setFwscore(fwscore => (parseFloat(fwscore) + 1.5).toFixed(2));
    } else if (shortness > 4) {
      setFwscore(fwscore => (parseFloat(fwscore) + 2).toFixed(2));
    }
    if (lethargic > 0 & lethargic < 2) {
      setFwscore(fwscore => (parseFloat(fwscore) + 0.5).toFixed(2));
    } else if (lethargic > 1 & lethargic < 4) {
      setFwscore(fwscore => (parseFloat(fwscore) + 1).toFixed(2));
    } else if (lethargic > 3 & lethargic < 5) {
      setFwscore(fwscore => (parseFloat(fwscore) + 1.5).toFixed(2));
    } else if (lethargic > 4) {
      setFwscore(fwscore => (parseFloat(fwscore) + 2).toFixed(2));
    }
  };

  const calcTw = () => {
    if (alcohol > 3) {
      setTwscore(twscore => (parseFloat(twscore) + 3).toFixed(2));
    } else if (alcohol > 1) {
      setTwscore(twscore => (parseFloat(twscore) + 2).toFixed(2));
    } else if (alcohol > 0) {
      setTwscore(twscore => (parseFloat(twscore) + 1).toFixed(2));
    }
    if (fish > 3 & fish < 5) {
      setTwscore(twscore => (parseFloat(twscore) + 1).toFixed(2));
    } else if (fish > 1) {
      setTwscore(twscore => (parseFloat(twscore) + 2).toFixed(2));
    } else if (fish >= 0) {
      setTwscore(twscore => (parseFloat(twscore) + 3).toFixed(2));
    }
    if (nut_legumes > 3 & nut_legumes < 5) {
      setTwscore(twscore => (parseFloat(twscore) + 1).toFixed(2));
    } else if (nut_legumes > 1) {
      setTwscore(twscore => (parseFloat(twscore) + 2).toFixed(2));
    } else if (nut_legumes >= 0) {
      setTwscore(twscore => (parseFloat(twscore) + 3).toFixed(2));
    }
    if (whole_grains > 3 & whole_grains < 5) {
      setTwscore(twscore => (parseFloat(twscore) + 1).toFixed(2));
    } else if (whole_grains > 1) {
      setTwscore(twscore => (parseFloat(twscore) + 2).toFixed(2));
    } else if (whole_grains >= 0) {
      setTwscore(twscore => (parseFloat(twscore) + 3).toFixed(2));
    }
    if (remembering > 0 & remembering < 2) {
      setTwscore(twscore => (parseFloat(twscore) + 0.5).toFixed(2));
    } else if (remembering > 1 & remembering < 4) {
      setTwscore(twscore => (parseFloat(twscore) + 1).toFixed(2));
    } else if (remembering > 3 & remembering < 5) {
      setTwscore(twscore => (parseFloat(twscore) + 1.5).toFixed(2));
    } else if (remembering > 4) {
      setTwscore(twscore => (parseFloat(twscore) + 2).toFixed(2));
    }
    if (down > 0 & down < 2) {
      setTwscore(twscore => (parseFloat(twscore) + 0.5).toFixed(2));
    } else if (down > 1 & down < 4) {
      setTwscore(twscore => (parseFloat(twscore) + 1).toFixed(2));
    } else if (down > 3 & down < 5) {
      setTwscore(twscore => (parseFloat(twscore) + 1.5).toFixed(2));
    } else if (down > 4) {
      setTwscore(twscore => (parseFloat(twscore) + 2).toFixed(2));
    }
    if (anxious > 0 & anxious < 2) {
      setTwscore(twscore => (parseFloat(twscore) + 0.5).toFixed(2));
    } else if (anxious > 1 & anxious < 4) {
      setTwscore(twscore => (parseFloat(twscore) + 1).toFixed(2));
    } else if (anxious > 3 & anxious < 5) {
      setTwscore(twscore => (parseFloat(twscore) + 1.5).toFixed(2));
    } else if (anxious > 4) {
      setTwscore(twscore => (parseFloat(twscore) + 2).toFixed(2));
    }
  }

  return (
    <div className='App'>
      {questions ? (
      <div className='Survey'>
        { 
          showQuestion === 1 ? (
            <div className='question-card'>
        <h3>First, help us get to know you better. Providing demographic information helps us give more targeted recommendations based on your answers.</h3>
        <div className='Enter_Name'>
          <label>
            Please enter your name:
          <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
          </label>
        </div>
        <div className='Gender'>
          <label>What is your gender?</label>
          <form>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </form>
        </div>
        <button onClick={() => setShowQuestion(2)}>Next</button>
        </div>
          )
           : null
        }
        {showQuestion === 2 ? (
          <div className='question-card'>
            <div className='DOB'>
              <label>What is your date of birth?</label>
              <p><input type='date' max={current} /></p>
            </div>
            <div className='Ethnicity'>
              <label>What is your ethnicity?</label>
              <form>
                <select value={ethnicity} onChange={(e) => setEthnicity(e.target.value)}>
                  <option value="Chinese">Chinese</option>
                  <option value="Indian">Indian</option>
                  <option value="Malay">Malay</option>
                  <option value="Others">Others</option>
                </select>
              </form>
              {ethnicity==="Others" ? (
              <div>
                <label>Please enter your ethnicity: </label>
                <input type='text' onChange={(e) => setEthnicity(e.target.value)}/>
              </div> ) : null}
            </div>
            <div className='buttons'>
              <button onClick={() => setShowQuestion(1)}>Previous</button>
              <button onClick={() => setShowQuestion(3)}>Next</button>
            </div>
          </div>
          ) : null
        }

        {showQuestion === 3 ? (
          <div className='question-card'>
            <div className="height">
              <label>Please enter your height in centimeters (cm), to the nearest whole number. (eg. 165)</label>
              <p><input type='number' value={height} onChange={(e) => setHeight(e.target.value)}/></p>
            </div>
            <div className="weight">
              <label>Please enter your weight in kilograms (kg), to the nearest whole number. (eg. 65)</label>
              <p><input type='number' value={weight} onChange={(e) => setWeight(e.target.value)}/></p>
            </div>
            <div className='buttons'>
              <button onClick={() => setShowQuestion(2)}>Previous</button>
              <button onClick={() => setShowQuestion(4)}>Next</button>
            </div>
          </div>
        ) : null
        }

        {showQuestion === 4 ? (
          <div className='question-card'>
            <div className="family_history">
              <h3>This section helps us understand your medical history and gut-related issues. Understanding this allows us to determine the help you need most!</h3>
              <label>Have <b>you or any of your immediate family members</b> (parents, siblings, or children) recorded the following medical conditions?</label>
              <p><input type="checkbox" checked={cd_history_checked} onChange={() => setcdChecked(!cd_history_checked)} />Cardiovascular Diseases</p>
              <p><input type="checkbox" checked={cc_history_checked} onChange={() => setccChecked(!cc_history_checked)} />Colon Cancer / Colorectal cancer</p>
              <p><input type="checkbox" checked={gerd_history_checked} onChange={() => setgerdChecked(!gerd_history_checked)} />Gastroesophageal Reflux Disease (GERD)</p>
              <p><input type="checkbox" checked={ibd_history_checked} onChange={() => setibdChecked(!ibd_history_checked)} />Inflammatory Bowel Disease (IBD)</p>
              <p><input type="checkbox" checked={nash_history_checked} onChange={() => setnashChecked(!nash_history_checked)} />Nonalcoholic Steatohepatitis (NASH)</p>
              <p><input type="checkbox" checked={t2dm_history_checked} onChange={() => sett2dmChecked(!t2dm_history_checked)} />Type 2 Diabetes Mellitus (T2DM)</p>
            </div>
            <div className='buttons'>
              <button onClick={() => setShowQuestion(3)}>Previous</button>
              <button onClick={() => setShowQuestion(5)}>Next</button>
            </div>
          </div>
          ) : null
        }

        {showQuestion === 5 ? (
          <div className='question-card'>
            <div className="chronic_diseases">
              <label>Have <b>you</b> recorded the following medical conditions?</label>
              <p><input type="checkbox" checked={diabetes} onChange={() => setDiabetes(!diabetes)} />Diabetes</p>
              <p><input type="checkbox" checked={hbp} onChange={() => setHbp(!hbp)} />High Blood Pressure</p>
              <p><input type="checkbox" checked={hbc} onChange={() => setHbc(!hbc)} />High Blood Cholesterol</p>
            </div>
            <div className='buttons'>
              <button onClick={() => setShowQuestion(4)}>Previous</button>
              <button onClick={() => setShowQuestion(6)}>Next</button>
            </div>
          </div>
          ) : null
        }

        {showQuestion === 6 ? (
          <div className='question-card'>
            <div className="allergies">
              <label>Do you suffer from any of the following allergies?</label>
              <p><input type="checkbox" checked={nut_allerrgy} onChange={() => setNutAllergy(!nut_allerrgy)} />Nuts</p>
            </div>
            <div className='buttons'>
              <button onClick={() => setShowQuestion(5)}>Previous</button>
              <button onClick={() => setShowQuestion(7)}>Next</button>
            </div>
          </div>
          ) : null
        }
        
        {showQuestion === 7 ? (
          <div className='question-card'>
            <div className="stomach_history">
              <h4>In the past one week, how often did you experience the following?</h4>
              <label>Acid Reflux (when some of the acidic stomach contents go back up into the back of your throat)</label>
              <form>
                <select value={acid_reflux} onChange={(e) => setAcidReflux(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label>Bloating (Abdominal Distension)</label>
              <form>
                <select value={bloating} onChange={(e) => setBloating(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label>Early satiety (when you feel full after a few bites of food or before you finish a normal-sized meal)</label>
              <form>
                <select value={early_satiety} onChange={(e) => setEarlySatiety(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label>Gastric pain (pain in the upper part of your abdomen, below your rib cage)</label>
              <form>
                <select value={gastric_pain} onChange={(e) => setGastricPain(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label>Regurgitation (when food, liquid, or stomach acid flows back up from the stomach and into the mouth)</label>
              <form>
                <select value={regurgitation} onChange={(e) => setRegurgitation(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label>Urge to pass stool immediately after eating</label>
              <form>
                <select value={pass_stool} onChange={(e) => setPassStool(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
            </div>  
            <div className='buttons'>
              <button onClick={() => setShowQuestion(6)}>Previous</button>
              <button onClick={() => setShowQuestion(8)}>Next</button>
            </div>
          </div>
          ) : null
        }

        {showQuestion === 8 ? (
          <div className='question-card'>
            <div className='diet'>
              <h3>This section gives us a snapshot of your diet and helps us assess the links between your lifestyle and your gut health. This then improves our food recommendations for you.</h3>
              <h4>In the past week, how many servings of the following did you consume? (1 serving is roughly the size of your closed fist)</h4>
              <label>Fruits</label>
              <form>
                <select value={fruit} onChange={(e) => setFruit(e.target.value)}>
                  <option value="0">0 servings</option>
                  <option value="1">1 - 4 servings</option>
                  <option value="5">5 - 13 servings</option>
                  <option value="14">14 or more servings</option>
                </select>
              </form>
              <label>Green leafy vegetables (e.g. spinach)</label>
              <form>
                <select value={green_veg} onChange={(e) => setGreenVeg(e.target.value)}>
                  <option value="0">0 servings</option>
                  <option value="1">1 - 4 servings</option>
                  <option value="5">5 - 13 servings</option>
                  <option value="14">14 or more servings</option>
                </select>
              </form>
            </div>
            <div className='buttons'>
              <button onClick={() => setShowQuestion(7)}>Previous</button>
              <button onClick={() => setShowQuestion(9)}>Next</button>
            </div>
          </div>
          ) : null
        }

        {showQuestion === 9 ? (
          <div className='question-card'>
            <div className='diet-2'>
              <h4>In the past week, how often did you consume of the following?</h4>
              <label>Alcoholic drinks</label>
              <form>
                <select value={alcohol} onChange={(e) => setAlcohol(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label>Fatty fish (e.g. salmon, mackerel)</label>
              <form>
                <select value={fish} onChange={(e) => setFish(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label>Nut and legumes</label>
              <form>
                <select value={nut_legumes} onChange={(e) => setNutLegumes(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label>Red meat</label>
              <form>
                <select value={red_meat} onChange={(e) => setRedMeat(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label>Whole grains (e.g. brown rice, whole wheat)</label>
              <form>
                <select value={whole_grains} onChange={(e) => setWholeGrains(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
            </div>
            <div className='buttons'>
            <button onClick={() => setShowQuestion(8)}>Previous</button>
            <button onClick={() => setShowQuestion(10)}>Next</button>
            </div>
          </div>
        ) : null}

        {showQuestion === 10 ? (
          <div className='question-card'>
            <div className='mental'>
              <h3>Almost there! This last section helps us understand your general well-being. Here, we aim to draw more linkages to your gut microbiome and your mental and physical health.</h3>
              <h4>In the past one week, how often did you experience the following?</h4>
              <label>Difficulty remembering / recalling things</label>
              <form>
                <select value={remembering} onChange={(e) => setRemembering(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label>Feeling down or depressed</label>
              <form>
                <select value={down} onChange={(e) => setDown(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label>Feeling anxious or stressed</label>
              <form>
                <select value={anxious} onChange={(e) => setAnxious(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
            </div>
            <div className='buttons'>
            <button onClick={() => setShowQuestion(9)}>Previous</button>
            <button onClick={() => setShowQuestion(11)}>Next</button>
            </div>
          </div>
          ) : null
        }
        
        {showQuestion === 11 ? (
          <div className='question-card'>
            <div className='activity'>
              <h4>In the past one week, how often did you</h4>
              <label>Exercise for a minimum of 30 minutes</label>
              <form>
                <select value={minThirty} onChange={(e) => setMinThirty(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label>Experience fast or pounding heartbeat during mild physical activity (e.g. walking)</label>
              <form>
                <select value={heartbeat} onChange={(e) => setHeartbeat(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label>Experience muscle pain or cramps during mild physical activity (e.g. walking)</label>
              <form>
                <select value={muscle_pain} onChange={(e) => setMusclePain(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label>Experience shortness of breath with mild physical exercise (e.g. walking)</label>
              <form>
                <select value={shortness} onChange={(e) => setShortness(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label>Feeling lethargic without physical activity</label>
              <form>
                <select value={lethargic} onChange={(e) => setLethargic(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
            </div>
            <div className='buttons'>
            <button onClick={() => setShowQuestion(10)}>Previous</button>
            <button onClick={() => handleChange()}>Submit Survey</button>
            </div>
          </div>
          ) : null
        }
        </div>
        ) : null}


      {data.length && !questions ? (
        <table className='table'>
          <thead>
            <tr>
              <th>Recommended Food Items</th>
              <th>Recommended Food Ingredients</th>
            </tr>
          </thead>
          <tbody>
            {parseFloat(twscore) > 12 && lwscore>12 && parseFloat(fwscore)>12? <M2 /> : 
            (parseFloat(twscore) <= 12 && lwscore <= 12 && parseFloat(fwscore) <= 12 ? <M1 diabetes={diabetes} hbp={hbp} hbc={hbc} obese={obese} /> : 
            (parseFloat(twscore) <= 12 ? (parseFloat(fwscore)>12 ? <M5 /> : <M4 />) :
            <M3 />))}
          {recommendedFoodItems.map((item) => (
            <tr key={item}>
              <td>{item}</td>
            </tr>
          ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
}
export default App;