import React, { useEffect, useState, useLayoutEffect } from 'react';
import Papa from 'papaparse';
import Data from './Food_Logic_Vitality.csv';
import MAPData from './MB_food.csv';

function MBrender({type}) {
    const [mbdata, setMbdata] = useState([]);
    const [mbfood, setMbfood] = useState([]);


    useEffect(() => {
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
          setMbfood(mbdata.filter(item => item && (parseInt(item.Type) === 1)));
    }, []);

    return (
        <div>
            <h2>no limiting</h2>
            {(mbdata.filter(item => item.Type.includes(type)).map((row, index) => (
               <tr key={index}>
               <td>{row.Recommended_food_items}</td>
               
             </tr> 
            )))}
        </div>
        
    )
}

export default MBrender;
