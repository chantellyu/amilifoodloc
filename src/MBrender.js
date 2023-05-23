import React, { useEffect, useState, useLayoutEffect } from 'react';
import Papa from 'papaparse';
import Data from './Food_Logic_Vitality.csv';
import MAPData from './MB_food.csv';
import './M1.css';

function MBrender({type}) {
    const [mbdata, setMbdata] = useState([]);
    const [mbfood, setMbfood] = useState([]);
    const [filtered, setFiltered] = useState([]);


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
          const getMb = async () => {
            const tempmbf = await mbdata.filter(item => item && String(item.Type).includes(type));
            setMbfood(tempmbf);
          }
          getMb();
          //setMbfood(mbdata.filter(item => item && String(item.Type).includes(type)));
          //setFiltered(mbfood.map(item => (item.Recommended_food_items.split("\n"))));
    }, []);

    return (
        <div>
            {(mbfood.map((row, index) => (
               <div><p>{row.Recommended_food_items}</p></div>
             
            )))}
        </div>
        
    )
}

export default MBrender;
