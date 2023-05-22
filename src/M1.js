import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import Data from './Food_Logic_Vitality.csv';
import MAPData from './MB_food.csv';
import './M1.css'

function M1({diabetes, hbp, hbc, obese}) {
    const [mbdata, setMbdata] = useState([]);
    const [filteredfood, setFdata] = useState([]);
    const [data, setData] = useState([]);

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
      const fetchmbData = async () => {
        const responsemb = await fetch(MAPData);
        const readermb = responsemb.body.getReader();
        const resultmb = await readermb.read();
        const decodermb = new TextDecoder("utf-8");
        const csvDatamb = decodermb.decode(resultmb.value);
        const parsedDatamb = Papa.parse(csvDatamb, {
          header: true, 
          skipEmptyLines: true,
        }).data;
        setMbdata(parsedDatamb);
      }
      fetchmbData();
      setFdata(data.filter(item => item && (!diabetes || (item.Diabetes_Score > 4)) 
        && (!hbp || (item.Hypertension_Score > 4)) && (!hbc || (item.Hyperlipidimia_Score > 4))
        && (!obese || (item.Obesity_Score > 3)) && false));
    }, [mbdata])
    console.log(mbdata);
    console.log(filteredfood);
    return (
        <div className='M1d'>
          {filteredfood.map((row, index) => (
            <tr key={index}>
              <td>{row.Food_Name}</td>
              <td>{row.Diabetes_Score}</td>
              <td>{row.Hypertension_Score}</td>
              <td>{row.Hyperlipidimia_Score}</td>
              
            </tr>
          ))}
        
        </div>
    )
        
}

export default M1;