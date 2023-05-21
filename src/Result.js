import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import Data from './Food_Logic_Vitality.csv';
import MAPData from './MB_food.csv';
import './M1.css'

function M1({diabetes, hbp, hbc}) {
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
      setFdata(mbdata.filter(item => item &&  item.Type_M.includes("One"))
        .map((row, index) => (row.Recommended_food_items.split('\n')
        )));
      setFdata(filteredfood => filteredfood.map(item => getorTrans(item)));
    }, [mbdata])
    const getorTrans = (item) => {
      data.map(x => x.Food_Name.includes(item) ? (parseInt(x.Diabetes_Score) > 3 ? item : x.Similar_Choices): "hi");
    }
    console.log(mbdata);
    console.log(filteredfood);
    return (
        <div className='M1d'>
          {mbdata.filter(item => item && item.Type_M.includes("One")).map((row, index) => (
            <tr key={index}>
              <td>{row.Recommended_food_items}</td>
              <td>{row.Recommended_food_ingredients}</td>
              
            </tr>
          ))}
          {filteredfood.map((item) => (
            <li>{item}</li>
          ))}
        
        </div>
    )
        
}

export default M1;
