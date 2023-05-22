import React, { useEffect, useState, useLayoutEffect } from 'react';
import Papa from 'papaparse';
import Data from './Food_Logic_Vitality.csv';
import MAPData from './MB_food.csv';
import './M1.css';

function Food1({diabetes, hbp, hbc, obese, allergies}) {
    const [mbdata, setMbdata] = useState([]);
    const [filteredfood, setFdata] = useState([]);
    const [data, setData] = useState([]);
    const [finaldata, setFinalData] = useState([]);
    const [starte, setStarte] = useState(false);
    const [mbfood, setMbfood] = useState([]);


    

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
        && (!obese || (item.Obesity_Score > 4)) && rendFruit1(item)));
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
            {starte ? (filteredfood.map((row, index) => (
               <tr key={index}>
               <td>{row.Food_Name}</td>
               <td>{row.Diabetes_Score}</td>
               <td>{row.Hypertension_Score}</td>
               <td>{row.Hyperlipidimia_Score}</td>
               
             </tr> 
            ))) : null}

            

            

        </div>
    )
        
}

export default Food1;
