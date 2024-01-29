'use client'

import React, { use, useEffect, useState} from "react";
import styles from "./pipeline.module.css";


export default function Pipeline () {

    const groupOneContent = [
        {value: "avg" , label: 'Average'},
        {value: "max" , label: 'Maximun'},
        {value: "mod" , label: 'Mode'},
        {value: "sum" , label: 'Sum'}
    ];

    const groupTwoContent = [
        {value: "med" , label: 'Median'},
        {value: "ran" , label: 'Range'},
        {value: "per" , label: 'Percentile'}
    ];

    const [data, setData] = useState('');
    const [groupId, setGroupId] = useState('');
    const [contentGroup, setContentGroup] = useState('');
    const [inputData, setInputData] = useState('');
    const [outputMessage, setOutputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);


    const MinCalculation = () => {
        
        let data = getDataInputs();
        
        //Assign the first value of the array as the Min value
        let minNumber = data[0];
    
        //Search throught all the values if there's another Minor value.
        for (let index = 1; index < data.length; index++) {
            if(data[index] < minNumber){
                //Change the Min value to the new one.
                minNumber = data[index];
            }
        }
        
        return minNumber;
    }
    
    const AverageCalculation = () => {
        
        let data = getDataInputs();
        let avg = 0;
        //Sum all the values of the array.
        for (let index = 0; index < data.length; index++) {
            avg += data[index];    
        }
        //Divide the sum / length of the current array.
        avg /= data.length; 
    
        // Use toFixed to format the result to 4 decimal places.
    
        avg = Number(avg.toFixed(4));
        return avg;
    }
    
    const MaxCalculation = () => {
        //Assign the first value of the array as the Max value
        let data = getDataInputs();
        let maxNumber = data[0];
    
        //Search throught all the values if there's another greater value.
        for (let index = 1; index < data.length; index++) {
            if(data[index] > maxNumber){
                //Change the Max value to the new one.
                maxNumber = data[index];
            }
        }
    
        return maxNumber;
        
    }
    
    const ModeCalculation = () => {
        let frequencyCounter = {};
        let data = getDataInputs();
        
        // Count the frequency of each number in the array
        for (let num of data) {
            frequencyCounter[num] = (frequencyCounter[num] || 0) + 1;
        }
        
        let modes = [];
        let maxFrequency = 0;
        
        // Find the numbers with the highest frequency (modes)
        for (let num in frequencyCounter) {
            if (frequencyCounter[num] > maxFrequency) {
                modes = [num];
                maxFrequency = frequencyCounter[num];
            } else if (frequencyCounter[num] === maxFrequency) {
                modes.push(num);
            }
        }
        
        // If all numbers have the same frequency, there is no mode
        if (modes.length === Object.keys(frequencyCounter).length) {
            return "No mode";
        }
        modes = modes.map((value) => Number(value));
    
        return modes;
    }
    
    const SumCalculation = () => {
        let sum = 0;
        let data = getDataInputs();
        //Sum all the values from the set of Numbers
        for (let index = 0; index < data.length; index++) {
            sum += data[index];    
        }
    
        return sum;
    }
    
    const MedianCalculation = () => {
            // Sort the set of Numbers in ascending order
            let data = getDataInputs();
            const sortedNumbers = data.slice().sort((a, b) => a - b);
    
            const length = sortedNumbers.length;
        
            // Calculate the median based on array length
            if (length % 2 === 1) {
                // Odd length: Return the middle value
                return sortedNumbers[Math.floor(length / 2)];
            } else {
                // Even length: Return the average of the two middle values
                const middle1 = sortedNumbers[length / 2 - 1];
                const middle2 = sortedNumbers[length / 2];
                return (middle1 + middle2) / 2;
            }
    }
    
    const RangeCalculation = () => {
    
        let maxNumber = MaxCalculation();
    
        let minNumber = MinCalculation();
    
        const range = maxNumber - minNumber;
    
        return range;
    
    }
    
    const PercentilCalculation = (percentile) => {
    
        // Sort the array in ascending order
        let data = getDataInputs();
        const sortedNumbers = data.slice().sort((a, b) => a - b);
    
        // Calculate the percentile rank
        const percentileRank = (percentile * (sortedNumbers.length + 1) - 0.5) / 100;
    
        // Find the value at the calculated rank
        const index = Math.floor(percentileRank);
    
        const fractionalPart = percentileRank - index;
    
        const value = sortedNumbers[index - 1] + fractionalPart * (sortedNumbers[index] - sortedNumbers[index - 1]);
    
        return value;
    }

    const getDataInputs = () => {
        let separators = [];
        let result = [inputData];
    
        for (let index = 0; index < inputData.length; index++) {
          let char = inputData.charAt(index);
    
          if (!char.match(/[0-9.]/)) {
            separators.push(char);
          }
        }
    
        if (separators.length === inputData.length) {
          return null;
        }
    
        separators.forEach((separator) => {
          result = result.flatMap((substring) => {
            return substring.split(separator);
          });
        });
    
        result = result.filter((value) => value !== '');
        result = result.map((value) => Number(value));
        return result;
      }

    useEffect(() => {
        setOutputMessage(`Here is the ${contentGroup} value of the group ${groupId} for the selected content: ${data}`);
      }, [data]);
    
      const handleOnSubmit = (event) => {        
        event.preventDefault();
        switch (groupId) {
          case '1':
            if (contentGroup === 'avg') setData(AverageCalculation());
            else if (contentGroup === 'max') setData(MaxCalculation());
            else if (contentGroup === 'mod') setData(ModeCalculation());
            else if (contentGroup === 'sum') setData(SumCalculation());
            else setData('Invalid Option');
            break;
          case '2':
            if (contentGroup === 'med') setData(MedianCalculation());
            else if (contentGroup === 'ran') setData(RangeCalculation());
            else if (contentGroup === 'per') setData(PercentilCalculation(50));
            else setData('Invalid Operation');
            break;
          default:
            break;
        }
        setIsLoading(false);
      };
    
      return (
        <div className={styles.container}>
          <form className={styles["pipeline-form"]} onSubmit={handleOnSubmit}>
            <label className={styles.label}>Select a Group</label>
            <div className={styles["select-container"]}>
              <select
                value={groupId}
                onChange={(value) => setGroupId(value.target.value)}
                id="groupId"
              >
                <option>-</option>
                <option value={1}>Group 1</option>
                <option value={2}>Group 2</option>
              </select>
            </div>
            {groupId == 1 ? (
              <div className={styles["select-container"]}>
                <select
                  value={contentGroup}
                  onChange={(value) => setContentGroup(value.target.value)}
                  id="group1Content"
                >
                  <option>-</option>
                  {groupOneContent.map(({ value, label }, index) => (
                    <option key={index} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className={styles["select-container"]}>
                <select
                  value={contentGroup}
                  onChange={(value) => setContentGroup(value.target.value)}
                  id="group2Content"
                >
                  <option>-</option>
                  {groupTwoContent.map(({ value, label }, index) => (
                    <option key={index} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className={styles.label}>Input your data</label>
              <input
                placeholder="1,0,5,3,4,4.2"
                value={inputData}
                onChange={(event) => setInputData(event.target.value)}
              />
            </div>
            <button type="submit">Submit</button>
            {!isLoading && (<p>{outputMessage}</p>)}
          </form>
        </div>
      );
}