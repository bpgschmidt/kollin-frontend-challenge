"use client";

// fetch graphql query
import  { fetchGraphQL } from '../fetchGraphQL';
import { useEffect, useState } from 'react';
import Latex from 'react-latex-next';
// remove an error which renders latex twice
import 'katex/dist/katex.min.css';

//previous background color bg-[#202746]
export default function Home() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    //Hook for user's selected answer
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    //Hook to show results when answer is made
    const [showResult, setShowResult] = useState(false);
    //Hook to tell which question we are on
    const [currentIndex, setCurrentIndex] = useState(0);
    //state for determining if the message box should render
    const [isVisible, setIsVisible] = useState(false);

    const [points, setPoints] = useState(0);

    const [exercises, setExercises] = useState([]);
    let currentQuestion = exercises[currentIndex];

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch("exercises.json"); // Fetching the local JSON file
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();

        setExercises(result);
      } catch (err) {
        setError(err.message);
        <button onClick={() => handleNextQuestion()}>Prova nästa fråga</button>
      }
    };

    fetchExercises();
  }, []);

useEffect(() => {
    if (exercises.length === 0 || currentIndex >= exercises.length) return;
    const fetchData = async () => {
    try {
            const result = await fetchGraphQL(exercises[currentIndex]);
            setData(result);
            if (!result){
                handleNextQuestion();
            }
    } catch (err) {
            setError(err.message);
    }
    };

        fetchData();
        // send new index to model
}, [exercises, currentIndex]);

    function handleNextQuestion() {
        if (currentIndex + 1 < exercises.length) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
          } else {
            console.log("No more questions.");
          }
        setShowResult(false);
        setSelectedAnswer(null);
    }

    function handleShowResults(){
        setShowResult(true);
        if (data.answerOptions[currentIndex]?.correct) {
            setPoints(points + 1);
        } 
}

      //Callback for each question's option
    function renderOptionsCB(alternatives, index){
        //Handler for when answer is clicked
        function handleAnswerClick() {
            if (!showResult) {
                setSelectedAnswer(index);
            }
        };
  
        let buttonColor = '';
        let borderColor = '';
        let circleColor = '';
        if (selectedAnswer === index) {
            // primary-50: #E2E8F9
            buttonColor = '#E2E8F9';
            circleColor = '#A8B9EE';

            // primary-200: #A8B9EE
            borderColor = '#A8B9EE';
        }
        if (showResult && selectedAnswer === index) {
            //buttonColor = alternatives.correct ? 'green' : 'red';
            circleColor = alternatives.correct ? 'green' : 'red';
        }

        return alternatives ? (
            <li>
                <button className='btn border border-grey-200 mt-4 rounded pl-20 pr-20 w-preset flex flex-row justify-center align-center'
                    key={index}
                    onClick={handleAnswerClick}
                    disabled={showResult}
                    style={{ backgroundColor: buttonColor, borderColor: borderColor}}>
                    <div className='flex flex-row text-left w-48'>
                        <div className='rounded-full w-4 h-4 border border-slate-200 bg-white mr-4 justify-center mt-1' style={{backgroundColor: circleColor}}></div>
                        <Latex>{alternatives.text}</Latex>
                    </div>
                </button>
            </li>
        ) : null;
        };



    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!data) {
        return <svg aria-hidden="true" className="w-48 h-48 m-auto min-h-screen text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>;
    }
    

    return (

        <div className="h-screen w-screen flex flex-col items-center justify-center p-24 bg-[#586FB5]">
            <h1 className="mb-10">Trigonometriska funktioner och identiteter</h1>
            <div className="w-10/12 h-5/6 bg-white flex flex-col items-center justify-center rounded-3xl">
                <div className='w-preset text-pretty'>
                    <Latex>{data.questionText}</Latex>
                </div>
                <ul className='flex flex-col items-center justify-center w-preset'>{data.answerOptions.map(renderOptionsCB)}</ul>
                <button className='btn mt-4 w-preset bg-[#586FB5] text-white' onClick={showResult? handleNextQuestion : handleShowResults}>{showResult? 'Nästa' : 'Check'}</button>
            </div>
        </div>

    );
}
