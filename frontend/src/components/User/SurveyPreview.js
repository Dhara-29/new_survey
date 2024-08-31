
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Header from './Header';
export default function SurveyPreview() {
    const location = useLocation();
    const survey_id = location.state?.survey_id;
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/question/getQuestionsBySurveyId/${survey_id}`);
                const fetchedQuestions = response.data.map(question => ({
                    ...question,
                    question_Options: Array.isArray(question.question_Options)
                        ? question.question_Options
                        : JSON.parse(question.question_Options || '[]')
                }));

                // Remove duplicate question texts
                const uniqueQuestions = Array.from(new Map(fetchedQuestions.map(q => [q.question_text, q])).values());

                setQuestions(uniqueQuestions);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching questions:', error);
                setLoading(false);
            }
        };

        if (survey_id) {
            fetchQuestions();
        }
    }, [survey_id]);

    if (loading) return <p>Loading...</p>;

    // Inline CSS styles
    const containerStyle = {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        marginTop: '200px'
    };

    const headerStyle = {
        textAlign: 'center',
        marginBottom: '20px'
    };

    const questionItemStyle = {
        marginBottom: '20px'
    };

    const mcqOptionsStyle = {
        marginTop: '10px',
      };
      
      const mcqOptionStyle = {
            marginBottom: '10px',
           
    };

    const ratingStarsStyle = {
        display: 'flex',
        alignItems: 'center'
    };

    const starStyle = {
        fontSize: '24px',
        color: 'black', // Default star color
        transition: 'color 0.2s'
    };

    const starFilledStyle = {
        color: '#ffc800' // Gold for filled stars
    };

    return (
        <>
            <Header />
            <div style={containerStyle}>
                <h1 style={headerStyle}>Survey Preview</h1>
                {questions.length > 0 ? (
                    <div className="survey-preview">
                        {questions.map((question, index) => (
                            <div key={question.question_id} style={questionItemStyle}>
                                <h4>Question {index + 1}: {question.question_text}</h4>

                                {question.question_type === 'MCQ' && (
                                    <div style={mcqOptionsStyle}>
                                        {question.question_Options.length > 0 ? (
                                            <ul>
                                                {question.question_Options.map((option, i) => (
                                                    <li key={i} style={mcqOptionStyle}>
                                                        <input
                                                            type="radio"
                                                            name={`question-${question.question_id}`}
                                                            value={option}
                                                            disabled // Disable to indicate it's a preview
                                                           
                                                        /> &nbsp;
                                                        {option}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No options available.</p>
                                        )}
                                    </div>
                                )}

                                {question.question_type === 'Text' && (
                                    <textarea
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            marginTop: '10px',
                                            backgroundColor:'white'
                                        }}
                                        value="Sample text" // Sample text to display
                                        disabled // Disable to indicate it's a preview
                                    />
                                )}

                                {question.question_type === 'Rating' && (
                                    <div style={ratingStarsStyle}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <span
                                                key={star}
                                                style={{
                                                    ...starStyle,
                                                    ...(star <= question.rating ? starFilledStyle : {})
                                                }}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No questions found.</p>
                )}
            </div>
        </>
    );
}
