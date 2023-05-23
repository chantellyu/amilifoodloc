import React, { useEffect, useState, useLayoutEffect } from 'react';
import Papa from 'papaparse';
import Data from './Food_Logic_Vitality.csv';
import MAPData from './MB_food.csv';
import './M1.css';

function MBrender({type, allergies}) {
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
          const getMb = async () => {
            const tempmbf = await mbdata.filter(item => item && String(item.Type).includes(type));
            setMbfood(tempmbf);
          }
          getMb();
    }, []);

    return (
        <div>
            {(mbdata.filter(item => item && String(item.Type).includes(type) 
                && (!allergies.nut || !String(item.Allergens).includes("Nuts")) 
                && (!allergies.shellfish || !String(item.Allergens).includes("Shellfish")) 
                && (!allergies.egg || !String(item.Allergens).includes("Egg"))
                && (!allergies.grain || !String(item.Allergens).includes("Grain"))  
                && (!allergies.soy || !String(item.Allergens).includes("Soy")) 
                && (!allergies.fish || !String(item.Allergens).includes("Fish")) 
                ).map((row) => (
               <p>{row.Recommended_food_items}</p>
             
            )))}
        </div>
        
    )
}

export default MBrender;
