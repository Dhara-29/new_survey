import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../User/ViewAttendedSurvey.css';
export default function ViewParticularSurvey() {
    const location = useLocation();
    const [questions, setQuestions] = useState([]);
    const [surveyTitle, setSurveyTitle] = useState('');
    const [error, setError] = useState(null);
    const survey_id = location.state?.survey_id;
 
    useEffect(() => {
        if (survey_id) {
            fetchSurveyDetails(survey_id);
        }
    }, [survey_id]);
    
    const fetchSurveyDetails = async (survey_id) => {
        try {
            // Fetch survey details
            const surveyResponse = await axios.get(`http://localhost:3000/survey/viewSurveysBySurveyId/${survey_id}`);
            
            // Assuming surveyResponse.data is an array and we need the first item
            const surveyData = surveyResponse.data[0];
            setSurveyTitle(surveyData.survey_title);
            console.log(surveyData);

            // Fetch questions for the survey (if needed)
            const questionsResponse = await axios.get(`http://localhost:3000/survey/getQuestionsBySurveyId/${survey_id}`);
            setQuestions(questionsResponse.data);
        } catch (error) {
            console.error('Error fetching survey details or questions:', error);
            setError(error);
        }
    };

    return (
        <div>
            <h1>Survey Details</h1>
            {error && <p className="error-message">Failed to load survey details. Please try again later.</p>}
            <h2>{surveyTitle}</h2>
            {questions.length > 0 ? (
                <div className="questions-list">
                    {questions.map(question => (
                        <div key={question.question_id} className="question-item">
                            <h4>Question: {question.question_text}</h4>
                            {/* Display additional question details if needed */}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No questions available for this survey.</p>
            )}
        </div>
    );
}
