
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../User/QuestionsPage.css';
import Header from './Header';
import Footer from './Footer';
import { useLocation, useNavigate } from 'react-router-dom';

export default function QuestionsPage() {
    const navigate = useNavigate();
    const user_id = localStorage.getItem("user_id");
    const [questions, setQuestions] = useState([]);
    const [existingQuestions, setExistingQuestions] = useState([]);
    const [selectedExistingQuestions, setSelectedExistingQuestions] = useState([]);
    const [showExistingQuestions, setShowExistingQuestions] = useState(false);
    const [questionType, setQuestionType] = useState('MCQ');
    const [newQuestion, setNewQuestion] = useState('');
    const [options, setOptions] = useState([]);
    const [rating, setRating] = useState(1);
    const [category_id, setCategoryId] = useState(null);
    const [noExistingQuestionsMessage, setNoExistingQuestionsMessage] = useState('');
    const [allQuestions, setAllQuestions] = useState([]);

    const location = useLocation();
    const survey_id = location.state?.survey_id;

    useEffect(() => {
        if (survey_id) {
            fetchSurveyDetails(survey_id);
        }
    }, [survey_id]);

    useEffect(() => {
        if (category_id && showExistingQuestions) {
            fetchQuestionsByCategory(category_id);
        }
    }, [category_id, showExistingQuestions]);

    useEffect(() => {
        updateAllQuestions();
    }, [questions, selectedExistingQuestions]);

    const fetchSurveyDetails = async (survey_id) => {
        try {
            const surveyResponse = await axios.get(`http://localhost:3000/survey/viewSurveysBySurveyId/${survey_id}`);
            const surveyData = surveyResponse.data[0];
            setCategoryId(surveyData.category_id);
        } catch (error) {
            console.error('Error fetching survey details:', error);
        }
    };

    const fetchQuestionsByCategory = async (category_id) => {
        try {
            const questionsResponse = await axios.get(`http://localhost:3000/question/getQuestionsByCategoryId/${category_id}`);
            const uniqueQuestions = filterUniqueQuestions(questionsResponse.data);
            setExistingQuestions(uniqueQuestions);
            setNoExistingQuestionsMessage('');
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setNoExistingQuestionsMessage('There are no existing questions in this category.');
                setExistingQuestions([]);
            } else {
                console.error('Error fetching questions by category:', error);
            }
        }
    };

    const filterUniqueQuestions = (questions) => {
        const uniqueQuestionsMap = new Map();

        questions.forEach((question) => {
            if (!uniqueQuestionsMap.has(question.question_text)) {
                uniqueQuestionsMap.set(question.question_text, question);
            }
        });

        return Array.from(uniqueQuestionsMap.values());
    };

    const updateAllQuestions = () => {
        const combinedQuestions = [
            ...questions,
            ...selectedExistingQuestions
        ];

        const uniqueQuestions = filterUniqueQuestions(combinedQuestions);

        setAllQuestions(uniqueQuestions);
    };

    const handleSelectQuestion = (question) => {
        if (selectedExistingQuestions.includes(question)) {
            setSelectedExistingQuestions(selectedExistingQuestions.filter(q => q !== question));
        } else {
            setSelectedExistingQuestions([...selectedExistingQuestions, question]);
        }
    };

    const handleAddQuestion = async () => {
        if (newQuestion.trim() === '') return;

        const isDuplicate = questions.some(
            q => q.questionData === newQuestion && q.questionType === questionType
        );

        if (isDuplicate) {
            toast.warn("This question is already added.");
            return;
        }

        const question = {
            questionData: newQuestion,
            questionType: questionType,
            options: questionType === 'MCQ' ? options : [],
            rating: questionType === 'Rating' ? rating : null,
            question_answer_text: null
        };

        try {
            const response = await axios.post('http://localhost:3000/question/addQuestion', {
                survey_id: survey_id,
                category_id: category_id,
                user_id: user_id,
                question_type: questionType,
                question_text: newQuestion,
                questionOptions: questionType === 'MCQ' ? options : [],
                question_answer_text: null
            });
            console.log('Question added successfully:', response.data);

            if (!questions.some(q => q.questionData === newQuestion && q.questionType === questionType)) {
                setQuestions(prevQuestions => [...prevQuestions, question]);
            }

            setNewQuestion('');
            setOptions([]);
            setRating(1);
        } catch (err) {
            console.log("Error : ", err);
            console.error("Error adding question:", err);
        }
    };

    const handleAddSelectedQuestions = async () => {
        if (selectedExistingQuestions.length === 0) {
            toast.warn('No questions selected.');
            return;
        }

        const selectedQuestionIds = selectedExistingQuestions.map(q => q.question_id);

        try {
            const response = await axios.post('http://localhost:3000/question/insertRecords', {
                questionIds: selectedQuestionIds,
                survey_id: survey_id
            });

            console.log('Selected questions added successfully:', response.data);
            toast.success('Selected questions added successfully.');

            updateAllQuestions();
            setSelectedExistingQuestions([]);
        } catch (error) {
            console.error('Error adding selected questions:', error);
            toast.error('Error adding selected questions.');
        }
    };

    return (
        <>
            <Header />
            <div className="question_container">
                <h1>Create Your Survey</h1>

                <div className="form-class">
                    <label htmlFor="questionData">Question:</label>
                    <input
                        type="text"
                        id="questionData"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Enter your question"
                    />
                </div>

                <div className="form-class">
                    <label htmlFor="questionType">Question Type:</label>
                    <select
                        id="questionType"
                        value={questionType}
                        onChange={(e) => setQuestionType(e.target.value)}
                    >
                        <option value="MCQ">Multiple Choice</option>
                        <option value="Text">Text</option>
                        <option value="Rating">Rating</option>
                    </select>
                </div>

                {questionType === 'MCQ' && (
                    <div className="form-class">
                        <label htmlFor="options">Options (comma separated):</label>
                        <input
                            type="text"
                            id="options"
                            value={options.join(', ')}
                            onChange={(e) => setOptions(e.target.value.split(',').map(opt => opt.trim()))}
                            placeholder="Enter options"
                        />
                    </div>
                )}

                {questionType === 'Rating' && (
                    <div className="form-class">
                        <label htmlFor="rating">Rating (1-5):</label>
                        <input
                            type="number"
                            id="rating"
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            min="1"
                            max="5"
                        />
                    </div>
                )}

                <button onClick={handleAddQuestion} className="add-button">Add Question</button>

                <div className="form-class mt-4">
                    <label>
                        <input
                            type="checkbox"
                            checked={showExistingQuestions}
                            onChange={(e) => setShowExistingQuestions(e.target.checked)}
                        />
                        Show existing questions for this category
                    </label>
                </div>

                {showExistingQuestions && noExistingQuestionsMessage && (
                    <p>{noExistingQuestionsMessage}</p>
                )}

                {showExistingQuestions && existingQuestions.length > 0 && (
                    <div className="existing-questions">
                        <h2>Existing Questions in this Category</h2>
                        <ul>
                            {existingQuestions.map((q, index) => (
                                <li key={index}>
                                    <input
                                        type="checkbox"
                                        checked={selectedExistingQuestions.includes(q)}
                                        onChange={() => handleSelectQuestion(q)}
                                    />
                                    <strong>Question No.: {index + 1} &nbsp;&nbsp;</strong>
                                    <strong>{q.question_text}</strong>
                                    {q.question_type === 'MCQ' && (
                                        <ul>
                                            {(q.questionOptions || []).map((opt, i) => (
                                                <li key={i}>{opt}</li>
                                            ))}
                                        </ul>
                                    )}
                                    {q.question_type === 'Rating' && (
                                        <p>Rating: {q.rating}</p>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <button onClick={handleAddSelectedQuestions} className="add-button mt-2">
                            Add Selected Questions to Survey
                        </button>
                    </div>
                )}

               <button className='btn btn-dark' onClick={()=>navigate('/surveyPreview',{state:{survey_id:survey_id}})}>Survey Preview</button>
               
            </div>
            <Footer />
        </>
    );
}

