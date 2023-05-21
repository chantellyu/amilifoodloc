import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import Data from './Food_Logic_Vitality.csv';
import MAPData from './MB_food.csv';

function M4() {
    const [mbdata, setMbdata] = useState([]);
    const [filteredfood, setFdata] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          const response = await fetch(MAPData);
          const reader = response.body.getReader();
          const result = await reader.read();
          const decoder = new TextDecoder("utf-8");
          const csvData = decoder.decode(result.value);
          const parsedData = Papa.parse(csvData, {
            header: true, 
            skipEmptyLines: true,
          }).data;
          setMbdata(parsedData);
        }
        fetchData();
        setFdata(mbdata.filter(item => item &&  item.Type_M.includes("Four")))
    }, [mbdata])
    return (
        <div>
            {mbdata.filter(item => item && item.Type_M.includes("Four")).map((row, index) => (
            <tr key={index}>
              <td>{row.Recommended_food_items}</td>
            </tr>
          ))}
        </div>
    )

}

export default M4;
