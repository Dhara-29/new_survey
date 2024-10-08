import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AttendSurvey.css'; // Import your custom CSS
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';

export default function AttendSurvey() {
    const location = useLocation();
    const survey_id = location.state?.survey_id;
    const user_id = location.state?.user_id;
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [responses, setResponses] = useState({}); // To store user responses
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/question/getQuestionsBySurveyId/${survey_id}`);
                const formattedQuestions = response.data.map(question => ({
                    ...question,
                    question_Options: Array.isArray(question.question_Options)
                        ? question.question_Options
                        : JSON.parse(question.question_Options || '[]')
                }));
                setQuestions(formattedQuestions || []);
            } catch (error) {
                console.error('Error fetching questions:', error);
            } finally {
                setLoading(false);
            }
        };

        if (survey_id) {
            fetchQuestions();
        }
    }, [survey_id]);

    const handleInputChange = (questionId, value, type) => {
        setResponses(prevResponses => ({
            ...prevResponses,
            [questionId]: {
                ...prevResponses[questionId],
                [type]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Inside submit ");
            // Prepare the responses object
            const formattedResponses = {};
            questions.forEach(question => {
                const question_id = question.question_id;
                formattedResponses[question_id] = responses[question_id] || {
                    question_id: question_id,
                    answer_text: '',
                    selected_option: '',
                    answer_numeric: null
                };
                console.log("Question id : ", question_id);
            });

            console.log("Formatted Responses:", formattedResponses);

            // Send the response to the backend API
            await axios.post('http://localhost:3000/surveyResponse/addResponse', {
                survey_id,
                user_id,
                responses: formattedResponses,
            });

            alert('Responses submitted successfully!');

        } catch (error) {
            console.log("Error : ", error);
            console.error('Error submitting responses:', error);
        }
    };

    return (
        <>
            <Header />
            <div className="survey-container">
                <h1>Survey</h1>
                {loading ? (
                    <p>Loading questions...</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {Array.isArray(questions) && questions.length > 0 ? (
                            questions.map((question, index) => (
                                <div key={question.question_id} className="question-item">
                                    <h4>Question {index + 1}: {question.question_text}</h4>

                                    {question.question_type === 'MCQ' && (
                                        <div className="mcq-options">
                                            {question.question_Options.length > 0 ? (
                                                question.question_Options.map((option, i) => (
                                                    <div key={i} className="mcq-option">
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                name={`question-${question.question_id}`}
                                                                value={option}
                                                                checked={responses[question.question_id]?.selected_option === option}
                                                                onChange={() => handleInputChange(question.question_id, option, 'selected_option')}
                                                            />
                                                            {option}
                                                        </label>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>No options available.</p>
                                            )}
                                        </div>
                                    )}

                                    {question.question_type === 'Text' && (
                                        <textarea
                                            value={responses[question.question_id]?.answer_text || ''}
                                            onChange={(e) => handleInputChange(question.question_id, e.target.value, 'answer_text')}
                                            placeholder="Your answer"
                                        />
                                    )}

                                    {question.question_type === 'Rating' && (
                                        <div className="rating-stars">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <label key={star} className="star-label">
                                                    <input
                                                        type="radio"
                                                        name={`rating-${question.question_id}`}
                                                        value={star}
                                                        checked={responses[question.question_id]?.answer_numeric === star.toString()}
                                                        onChange={() => handleInputChange(question.question_id, star.toString(), 'answer_numeric')}
                                                    />
                                                    <span className={`star ${star <= (responses[question.question_id]?.answer_numeric || 0) ? 'filled' : ''}`}>★</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No questions available for this survey.</p>
                        )}
                        <button type="submit" className="btn-dark">Submit</button> &nbsp;


                        <button className="btn btn-outline-dark" onClick={() => navigate('/viewSurveys')}>Go back</button>
                    </form>
                )}
            </div>
            <div>
            
            <button className="btn-dark" onClick={() => navigate('/ViewAttendedSurvey',{state:{survey_id}})}>View Result  </button> &nbsp;
            </div>
        </>
    );
}
