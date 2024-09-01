import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewAttendedSurvey.css'; // Import the same CSS file for consistent styling
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';

export default function ViewAttendedSurvey() {
    const location = useLocation();
    const survey_id = location.state?.survey_id;
    const user_id = localStorage.getItem("user_id");
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResponses = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/surveyResponse/viewResponse/${survey_id}/${user_id}`);
                setResponses(response.data.responses || []);
            } catch (error) {
                console.error('Error fetching responses:', error);
            } finally {
                setLoading(false);
            }
        };

        if (survey_id && user_id) {
            fetchResponses();
        }
    }, [survey_id, user_id]);

    return (
        <>
            <Header />
            <div className="survey-container">
                <h1>Submitted Survey Responses</h1>
                {loading ? (
                    <p>Loading responses...</p>
                ) : (
                    <div className="responses-list">
                        {responses.length > 0 ? (
                            responses.map((response, index) => (
                                <div key={index} className="question-item">
                                    <h4>Question {index + 1}</h4>
                                    {response.answer_text && <p><strong>Text Answer:</strong> {response.answer_text}</p>}
                                    {response.selected_option && <p><strong>Selected Option:</strong> {response.selected_option}</p>}
                                    {response.answer_numeric !== null && <p><strong>Numeric Rating:</strong> {response.answer_numeric}</p>}
                                </div>
                            ))
                        ) : (
                            <p>No responses found for this survey and user.</p>
                        )}
                        <button className="btn-dark" onClick={() => navigate('/viewSurveys')}>Go back</button>
                    </div>
                )}
            </div>
          
        </>
    );
}
