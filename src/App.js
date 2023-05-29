import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import Data from './Food_Logic_Vitality.csv';
import './App.css';
import MBrender from './MBrender';
import Datao from './open_s.csv';

function App() {
  const [data, setData] = useState([]);
  const [lwscore, setLwscore] = useState(0);
  const [twscore, setTwscore] = useState("0");
  const [fwscore, setFwscore] = useState("0");
  const [questions, setQuestions] = useState(true);
  const [showQuestion, setShowQuestion] = useState(1);
  const [showRes, setShowRes] = useState(1);
  const [filteredfood, setFdata] = useState([]);
  const [opens, setOpens] = useState([]);

  //personal info
  const current = new Date().toISOString().split("T")[0];
  const [name, setName] = useState("");
  const [gender, setGender] = useState("Female");
  const [ethnicity, setEthnicity] = useState("");
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [diabetes, setDiabetes] = useState(false);
  const [hbp, setHbp] = useState(false);
  const [hbc, setHbc] = useState(false);
  const [ibs, setIbs] = useState(false);
  const [nut_allergy, setNutAllergy] = useState(false);
  const [shellfish_allergy, setShellfishAllergy] = useState(false);
  const [egg_allergy, setEggAllergy] = useState(false);
  const [milk_allergy, setMilkAllergy] = useState(false);
  const [grain_allergy, setGrainAllergy] = useState(false);
  const [soy_allergy, setSoyAllergy] = useState(false);
  const [fish_allergy, setFishAllergy] = useState(false);

  const [obese, setObese] = useState(false);
  

  //family history
  const [cd_history_checked, setcdChecked] = useState(false);
  const [cc_history_checked, setccChecked] = useState(false);
  const [gerd_history_checked, setgerdChecked] = useState(false);
  const [ibd_history_checked, setibdChecked] = useState(false);
  const [nash_history_checked, setnashChecked] = useState(false);
  const [t2dm_history_checked, sett2dmChecked] = useState(false);
  const [nofam_checked, setnofamChecked] = useState(false);
  const [noself_checked, setnoselfChecked] = useState(false);
  const [noallergies_checked, setnoallergiesChecked] = useState(false);

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
  const [isVeg, setIsVeg] = useState(false);

  //mood
  const [remembering, setRemembering] = useState(0);
  const [down, setDown] = useState(0);
  const [anxious, setAnxious] = useState(0);
  const [minThirty, setMinThirty] = useState(0);
  const [heartbeat, setHeartbeat] = useState(0);
  const [muscle_pain, setMusclePain] = useState(0);
  const [shortness, setShortness] = useState(0);
  const [lethargic, setLethargic] = useState(0);

  const shuffleArray = (array) => {
    for (let i = 170; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

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
      shuffleArray(parsedData);
      setData(parsedData);
    }
    fetchData();
    const fetchoData = async () => {
      const responseo = await fetch(Datao);
      const readero = responseo.body.getReader();
      const resulto = await readero.read();
      const decodero = new TextDecoder("utf-8");
      const csvDatao = decodero.decode(resulto.value);
      const parsedDatao = Papa.parse(csvDatao, {
        header: true, 
        skipEmptyLines: true,
      }).data;
      setOpens(parsedDatao)
    }
    fetchoData();
    

    
    
  }, []);


  var graincount = 0;
    var fruitcount = 0;
    var vegcount = 0;
    var protcount = 0;
    const rendFruit1 = (item) => {
      if (!grain_allergy && (parseInt(item.Type) < 1) && graincount < 1) {
              graincount += 1;
              return (true);               
      } else if (parseInt(item.Type) === 1 && fruitcount < 3) {
              fruitcount += 1;
              return (true);
      } else if (parseInt(item.Type) === 2 && vegcount < 3) {
              vegcount += 1;
              return (true);
      } else if ((parseInt(item.Type) === 3) && protcount < (!grain_allergy ? 3 : 4) && !isVeg) {
              protcount += 1;
              return (true);
      } else if (parseInt(item.Type) === 4 && protcount < (!grain_allergy ? 3 : 4) && !isVeg) {
        protcount += 1;
        return (true);
      } else if (parseInt(item.Type) === 4 && protcount < (!grain_allergy ? 3 : 4) && isVeg) {
        protcount += 1;
        return (true);
      } else { return false;}

    }

  

  const handleChange = () => {
    setIsVeg(fish === 0 && red_meat === 0);
    const getFood = async () => {
      calcLw();
      calcFw();
      calcTw();
      if (bloating > 1 || pass_stool > 1 || ibs) {
        setIbs(true);
      }
      const tempfd = await data.filter(item => item && (item.Healthy > 3) && (!diabetes || (item.Diabetes_Score > 4)) 
      && (!hbp || (item.Hypertension_Score > 4)) && (!hbc || (item.Hyperlipidimia_Score > 4))
      && (!obese || (item.Obesity_Score.includes("Y"))) 
      && (!ibs || item.Irritable_Bowel_Syndrome_Score > 4) 
      && (!nut_allergy || !String(item.Allergens).includes("Nuts")) 
      && (!shellfish_allergy || !String(item.Allergens).includes("Shellfish")) 
      && (!egg_allergy || !String(item.Allergens).includes("Egg"))
      && (!milk_allergy || !String(item.Allergens).includes("Lactose"))  
      && (!grain_allergy || !String(item.Allergens).includes("Gluten")) 
      && (!soy_allergy || !String(item.Allergens).includes("Soy")) 
      && (!fish_allergy || !String(item.Allergens).includes("Fish")) 
      && rendFruit1(item));
      setFdata(tempfd);
    
    };
    getFood();
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
        {showQuestion === 1 ? (
        <div className='question-card'>
          <h2>Welcome to AMILI's food recommendation survey!</h2>
          <h3>Based off the information you provide here, we will recommend certain foods accordingly. We do not store or collect the information provided here.</h3>
          <h3>This survey consists of 13 questions targeting various aspects of your lifestyle.</h3>
          <h3>First, help us get to know you better. Providing demographic information helps us give more targeted recommendations based on your answers.</h3>
          <div className='Gender'>
            <label><b>Q1.</b>   What is your gender?</label>
            <form>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </form>
          </div>
          <div className='DOB'>
            <label><b>Q2.</b>   What is your date of birth?</label>
            <p><input type='date' max={current} /></p>
          </div>
          <div className='Ethnicity'>
            <label><b>Q3.</b>   What is your ethnicity?</label>
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
          <div className="height">
              <label><b>Q4.</b>   Please enter your height in centimeters (cm), to the nearest whole number. (eg. 165)</label>
              <p><input type='number' value={height} onChange={(e) => setHeight(e.target.value)}/></p>
            </div>
            <div className="weight">
              <label><b>Q5.</b>   Please enter your weight in kilograms (kg), to the nearest whole number. (eg. 65)</label>
              <p><input type='number' value={weight} onChange={(e) => setWeight(e.target.value)}/></p>
            </div>
          <div className="family_history">
              <h3>This section helps us understand your medical history and gut-related issues. Understanding this allows us to determine the help you need most!</h3>
              <label><b>Q6.</b>   Have <b>you or any of your immediate family members</b> (parents, siblings, or children) recorded the following medical conditions? (check all that apply)</label>
              <p><input type="checkbox" checked={cd_history_checked} onChange={() => setcdChecked(!cd_history_checked)} />Cardiovascular Diseases</p>
              <p><input type="checkbox" checked={cc_history_checked} onChange={() => setccChecked(!cc_history_checked)} />Colon Cancer / Colorectal cancer</p>
              <p><input type="checkbox" checked={gerd_history_checked} onChange={() => setgerdChecked(!gerd_history_checked)} />Gastroesophageal Reflux Disease (GERD)</p>
              <p><input type="checkbox" checked={ibd_history_checked} onChange={() => setibdChecked(!ibd_history_checked)} />Inflammatory Bowel Disease (IBD)</p>
              <p><input type="checkbox" checked={nash_history_checked} onChange={() => setnashChecked(!nash_history_checked)} />Nonalcoholic Steatohepatitis (NASH)</p>
              <p><input type="checkbox" checked={t2dm_history_checked} onChange={() => sett2dmChecked(!t2dm_history_checked)} />Type 2 Diabetes Mellitus (T2DM)</p>
              <p><input type="checkbox" checked={nofam_checked} onChange={() => setnofamChecked(!nofam_checked)} />None of these apply</p>
          </div>
          <div className="chronic_diseases">
              <label><b>Q7.</b>   Have <b>you</b> recorded the following medical conditions? (check all that apply)</label>
              <p><input type="checkbox" checked={diabetes} onChange={() => setDiabetes(!diabetes)} />Diabetes</p>
              <p><input type="checkbox" checked={hbp} onChange={() => setHbp(!hbp)} />High Blood Pressure</p>
              <p><input type="checkbox" checked={hbc} onChange={() => setHbc(!hbc)} />High Blood Cholesterol</p>
              <p><input type="checkbox" checked={ibs} onChange={() => setIbs(!ibs)}  />Irritable Bowel Syndrome</p>
              <p><input type="checkbox" checked={noself_checked} onChange={() => setnoselfChecked(!noself_checked)} />None of these apply</p>
          </div>
          <div className="allergies">
            <label><b>Q8.</b>   Are you allergic to any of the following foods? (check all that apply)</label>
            <p><input type="checkbox" checked={nut_allergy} onChange={() => setNutAllergy(!nut_allergy)} />Nuts</p>
            <p><input type="checkbox" checked={shellfish_allergy} onChange={() => setShellfishAllergy(!shellfish_allergy)} />Shellfish</p>
            <p><input type="checkbox" checked={egg_allergy} onChange={() => setEggAllergy(!egg_allergy)} />Eggs</p>
            <p><input type="checkbox" checked={milk_allergy} onChange={() => setMilkAllergy(!milk_allergy)} />Cow's milk</p>
            <p><input type="checkbox" checked={grain_allergy} onChange={() => setGrainAllergy(!grain_allergy)} />Grains (wheat, oat, barley etc)</p>
            <p><input type="checkbox" checked={soy_allergy} onChange={() => setSoyAllergy(!soy_allergy)} />Soy</p>
            <p><input type="checkbox" checked={fish_allergy} onChange={() => setFishAllergy(!fish_allergy)} />Fish</p>
            <p><input type="checkbox" checked={noallergies_checked} onChange={() => setnoallergiesChecked(!noallergies_checked)} />None of these apply</p>
          </div>
          <button class="button-1" role="button" onClick={() => setShowQuestion(2)}>Next</button>
        </div>
          )
           : null
        }
        {showQuestion === 2 ? (
          <div className='question-card'>
            <div className="stomach_history">
              <h4><b>Q9.</b>   In the past one week, how often did you experience the following?</h4>
              <label><b>a)</b>   Acid Reflux (when some of the acidic stomach contents go back up into the back of your throat)</label>
              <form>
                <select value={acid_reflux} onChange={(e) => setAcidReflux(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label><b>b)</b>   Recurrent Bloating (Abdominal Distension)</label>
              <form>
                <select value={bloating} onChange={(e) => setBloating(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label><b>c)</b>   Early satiety (when you feel full after a few bites of food or before you finish a normal-sized meal)</label>
              <form>
                <select value={early_satiety} onChange={(e) => setEarlySatiety(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label><b>d)</b>   Gastric pain (pain in the upper part of your abdomen, below your rib cage)</label>
              <form>
                <select value={gastric_pain} onChange={(e) => setGastricPain(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label><b>e)</b>   Regurgitation (when food, liquid, or stomach acid flows back up from the stomach and into the mouth)</label>
              <form>
                <select value={regurgitation} onChange={(e) => setRegurgitation(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label><b>f)</b>   Urge to pass stool immediately after eating</label>
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
            <div className='diet'>
              <h3>This section gives us a snapshot of your diet and helps us assess the links between your lifestyle and your gut health. This then improves our food recommendations for you.</h3>
              <h4><b>Q10.</b>   In the past week, how many servings of the following did you consume? (1 serving is roughly the size of your closed fist)</h4>
              <label><b>a)</b>   Fruits</label>
              <form>
                <select value={fruit} onChange={(e) => setFruit(e.target.value)}>
                  <option value="0">0 servings</option>
                  <option value="1">1 - 4 servings</option>
                  <option value="5">5 - 13 servings</option>
                  <option value="14">14 or more servings</option>
                </select>
              </form>
              <label><b>b)</b>   Green leafy vegetables (e.g. spinach)</label>
              <form>
                <select value={green_veg} onChange={(e) => setGreenVeg(e.target.value)}>
                  <option value="0">0 servings</option>
                  <option value="1">1 - 4 servings</option>
                  <option value="5">5 - 13 servings</option>
                  <option value="14">14 or more servings</option>
                </select>
              </form>
            </div>
            <div className='diet-2'>
              <h4><b>Q11.</b>   In the past week, how often did you consume of the following?</h4>
              <label><b>a)</b>   Alcoholic drinks</label>
              <form>
                <select value={alcohol} onChange={(e) => setAlcohol(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label><b>b)</b>   Fatty fish (e.g. salmon, mackerel)</label>
              <form>
                <select value={fish} onChange={(e) => setFish(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label><b>c)</b>   Nut and legumes</label>
              <form>
                <select value={nut_legumes} onChange={(e) => setNutLegumes(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label><b>d)</b>   Red meat</label>
              <form>
                <select value={red_meat} onChange={(e) => setRedMeat(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label><b>e)</b>   Whole grains (e.g. brown rice, whole wheat)</label>
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
              <button class="button-1" role="button" onClick={() => setShowQuestion(1)}>Previous</button>
              <button class="button-2" role="button" onClick={() => setShowQuestion(3)}>Next</button>
            </div>
          </div>
          ) : null
        }

        {showQuestion === 3 ? (
          <div className='question-card'>
            <div className='mental'>
              <h3>Almost there! This last section helps us understand your general well-being. Here, we aim to draw more linkages to your gut microbiome and your mental and physical health.</h3>
              <h4><b>Q12.</b>   In the past one week, how often did you experience the following?</h4>
              <label><b>a)</b>   Difficulty remembering / recalling things</label>
              <form>
                <select value={remembering} onChange={(e) => setRemembering(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label><b>b)</b>   Feeling down or depressed</label>
              <form>
                <select value={down} onChange={(e) => setDown(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label><b>c)</b>   Feeling anxious or stressed</label>
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
            <div className='activity'>
              <h4><b>Q13.</b>   In the past one week, how often did you</h4>
              <label><b>a)</b>   Exercise for a minimum of 30 minutes</label>
              <form>
                <select value={minThirty} onChange={(e) => setMinThirty(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label><b>b)</b>   Experience fast or pounding heartbeat during mild physical activity (e.g. walking)</label>
              <form>
                <select value={heartbeat} onChange={(e) => setHeartbeat(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label><b>c)</b>   Experience muscle pain or cramps during mild physical activity (e.g. walking)</label>
              <form>
                <select value={muscle_pain} onChange={(e) => setMusclePain(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label><b>d)</b>   Experience shortness of breath with mild physical exercise (e.g. walking)</label>
              <form>
                <select value={shortness} onChange={(e) => setShortness(e.target.value)}>
                  <option value="0">Never</option>
                  <option value="1">1 time</option>
                  <option value="2">2 - 3 times</option>
                  <option value="4">4 - 5 times</option>
                  <option value="5">More than 5 times</option>
                </select>
              </form>
              <label><b>e)</b>   Feeling lethargic without physical activity</label>
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
              <button class="button-1" role="button" onClick={() => setShowQuestion(2)}>Previous</button>
              <button class="button-2" role="button" onClick={() => handleChange()}>Submit Survey</button>
            </div>
          </div>
        ) : null
        }

        </div>
        ) : null}


      {data.length && !questions ? (
        <div className='report'>

            {showRes === 1 ? (
                    <div className='result-card'>
                        <h2>Overview</h2>
                        {opens.filter(item => (item.Disease_group.includes("General") || ((diabetes && item.Disease_group.includes("Diabetes")) ||
                        (hbp && item.Disease_group.includes("Hypertension")) || 
                        (hbc && item.Disease_group.includes("Dyslipidemia")) ||
                        (ibs && item.Disease_group.includes("IBS"))))).map((row, index) => (
                        <p>{row.Statements}</p>         
                    ))}
                        <p>From your answers to the survey, we have scored your microbiome as follows:</p>
                        <p>Live Well Score <i>(scores your neurotransmission pathways)</i>: {lwscore > 12 ? ("Poor") : (lwscore > 6 ? ("Good") : ("Great"))}</p>
                        <p>Think Well Score <i>(scores your gut, heart, and liver health)</i>: {twscore > 12 ? ("Poor") : (twscore > 6 ? ("Good") : ("Great"))}</p>
                        <p>Feel Well Score <i>(scores your gut’s energy harvesting pathways)</i>: {fwscore > 12 ? ("Poor") : (fwscore > 6 ? ("Good") : ("Great"))}</p>
                        <h2>Recommendations</h2>
                        <h4>From your survey response, we recommend the following foods:</h4>
                        <div className="row">
                        <div class="column">
                        <div className='food-listing'>
                        {parseFloat(twscore) > 12 && lwscore>12 && parseFloat(fwscore)>12? 
                          (<div><MBrender type={"2"} allergies={{nut: nut_allergy, shellfish: shellfish_allergy, egg: egg_allergy, 
                            milk: milk_allergy, grain: grain_allergy, soy: soy_allergy, fish: fish_allergy}} /></div>): 
                        (parseFloat(twscore) <= 12 && lwscore <= 12 && parseFloat(fwscore) <= 12 ? 
                          (<div><MBrender type={"1"} allergies={{nut: nut_allergy, shellfish: shellfish_allergy, egg: egg_allergy, 
                            milk: milk_allergy, grain: grain_allergy, soy: soy_allergy, fish: fish_allergy}} /></div>) : 
                        (parseFloat(twscore) <= 12 ? (parseFloat(fwscore)>12 ? 
                          (<div><MBrender type={"5"} allergies={{nut: nut_allergy, shellfish: shellfish_allergy, egg: egg_allergy, 
                            milk: milk_allergy, grain: grain_allergy, soy: soy_allergy, fish: fish_allergy}} /></div>) : 
                          (<div><MBrender type={"4"} allergies={{nut: nut_allergy, shellfish: shellfish_allergy, egg: egg_allergy, 
                            milk: milk_allergy, grain: grain_allergy, soy: soy_allergy, fish: fish_allergy}} /></div>)) :
                          (<div><MBrender type={"3"} allergies={{nut: nut_allergy, shellfish: shellfish_allergy, egg: egg_allergy, 
                            milk: milk_allergy, grain: grain_allergy, soy: soy_allergy, fish: fish_allergy}} /></div>)))}
                        </div>
                        </div>
                        <div class="column">

                      {(filteredfood.map((row, index) => (
                        <div>
                        <p>{row.Food_Name}</p>
                        </div>
                        )))}
                        
                        </div>
                        
                        </div>
                        <table>
                        <div>
                        <button class="button-3" role="button" onClick={() => window.location.reload(false)}>Restart Survey</button>
                        </div>
                        </table>
                    </div>
                ) : null
            }
        </div>
      ) : null}
    </div>
  );
}
export default App;