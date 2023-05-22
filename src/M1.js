import React, { useEffect, useState, useLayoutEffect } from 'react';
import Papa from 'papaparse';
import Data from './Food_Logic_Vitality.csv';
import Datao from './open_s.csv';
import MBrender from './MBrender.js';
import './M1.css';

function M1({type, name, lwscore, twscore, fwscore, diabetes, hbp, hbc, obese, ibs, allergies}) {
    const [filteredfood, setFdata] = useState([]);
    const [data, setData] = useState([]);
    const [finaldata, setFinalData] = useState([]);
    const [starte, setStarte] = useState(false);
    const [opens, setOpens] = useState([]);
    const [showRes, setShowRes] = useState(1);
    

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
      var graincount = 0;
      var fruitcount = 0;
      var vegcount = 0;
      var protcount = 0;
      const rendFruit1 = (item) => {
        if ((parseInt(item.Type) < 1) && graincount < 1) {
                graincount += 1;
                return (true);               
        } else if (parseInt(item.Type) === 1 && fruitcount < 3) {

                fruitcount += 1;
                return (true);
        } else if (parseInt(item.Type) === 2 && vegcount < 3) {
                vegcount += 1;
                return (true);
        } else if (parseInt(item.Type) === 3 && protcount < 3) {
                protcount += 1;
                return (true);
        } else { return false;}
  
      }

      setFdata(data.filter(item => item && (!diabetes || (item.Diabetes_Score > 4)) 
        && (!hbp || (item.Hypertension_Score > 4)) && (!hbc || (item.Hyperlipidimia_Score > 4))
        && (!obese || (item.Obesity_Score.includes("Y"))) 
        && (!ibs || item.Irritable_Bowel_Syndrome_Score > 4) && rendFruit1(item)));
      //setFinalData(filteredfood.filter(item => rendFruit1(item)));
      const onPageLoad = () => {
        setStarte(true);
      }
      if (document.readyState === 'complete') {
        onPageLoad();
      } else {
        window.addEventListener('load', onPageLoad);
        // Remove the event listener when component unmounts
        return () => window.removeEventListener('load', onPageLoad);
        
      }
    }, [])
    return (
        <div className='M1d'>
            {
                showRes === 1 ? (
                    <div className='results-card'>
                        <h2>{name},</h2>
                        <h3>Welcome to your results!</h3>
                        <p>According to the survey, your scores are as follows, where a lower score is preferred:</p>
                        <p>Live Well Score: {lwscore}</p>
                        <p>Think Well Score: {twscore}</p>
                        <p>Feel Well Score: {fwscore}</p>

                        <h4>We recommend the following foods according to your microbiome type:</h4>
                        <MBrender type={type} />
                        <button onClick={() => setShowRes(2)}>Next</button>
                    
                    </div> 
                ) : null
            }

            {
                starte && showRes === 2 ? (
                    <div className='results-card'>
                        <h2>{name},</h2>
                        <h3>Welcome to your results!</h3>
                        <p>In accordance with the medical conditions indicated in your survey response, we would like to recommend the following foods: </p>
                        {opens.filter(item => (item.Disease_group.includes("General") || ((diabetes && item.Disease_group.includes("Diabetes")) ||
                        (hbp && item.Disease_group.includes("Hypertension")) || 
                        (hbc && item.Disease_group.includes("Dyslipidemia")) ||
                        (ibs && item.Disease_group.includes("IBS"))))).map((row, index) => (
                        <p>{row.Statements}</p>         
                    ))}
                      {(filteredfood.map((row, index) => (
                        <div>
                        <p><b>{row.Food_Name}:  </b>{row.Think_Well_Reason}</p>
                        </div>
                        )))}
                    
                        <button onClick={() => setShowRes(1)}>Previous</button>
                    
                    </div> 
                ) : null
            }

            
             

        </div>
    )
        
}

export default M1;
