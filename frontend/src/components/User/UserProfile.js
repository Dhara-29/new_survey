import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../User/UserProfile.css';
import Footer from './Footer';
import Header from './Header';

export default function UserProfile() {
    const [categories, setCategories] = useState([]);
    const [surveys, setSurveys] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const user_id = localStorage.getItem("user_id");

    useEffect(() => {
        if (user_id) {
            fetchCategories();
        }
    }, [user_id]);

    const fetchCategories = () => {
        axios.get(`http://localhost:3000/category/getCategoriesByUserId/${user_id}`)
            .then(response => {
                console.log("Categories Response:", response.data);

                if (Array.isArray(response.data.message)) {
                    setCategories(response.data.message);
                    fetchSurveys(response.data.message);
                } else {
                    console.error("Unexpected response structure for categories:", response.data);
                }
            })
            .catch(error => {
                console.error("There was an error fetching the categories!", error);
                setError(error);
                setIsLoading(false);
            });
    };

    const fetchSurveys = (categories) => {
        axios.get(`http://localhost:3000/survey/viewSurveysByUserId/${user_id}`)
            .then(response => {
                console.log("Surveys Response:", response.data);

                if (Array.isArray(response.data)) {
                    // Create category map from categories
                    const categoryMap = categories.reduce((map, category) => {
                        map[category.category_id] = category.category_name;
                        return map;
                    }, {});

                    console.log("Category Map:", categoryMap);

                    // Map surveys to include category names
                    const surveysWithCategoryNames = response.data.map(survey => {
                        const categoryName = categoryMap[survey.categorid] || 'Unknown Category';
                        console.log(`Survey ID: ${survey.survey_id}, Category ID: ${survey.category_id}, Category Name: ${categoryName}`);
                        return {
                            ...survey,
                            category_name: categoryName
                        };
                    });

                    setSurveys(surveysWithCategoryNames);
                } else {
                    console.error("Unexpected response structure for surveys:", response.data);
                }
                setIsLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the surveys!", error);
                setError(error);
                setIsLoading(false);
            });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header />
            <div className='user-dashboard-main'>
                <div className="dashboard-container">
                    <nav className="sidebar">
                        <div className="sidebar-header">
                            <h2>Categories</h2>
                        </div>

                        <ul className="sidebar-menu">
                            {categories.length > 0 ? (
                                categories.map(category => (
                                    <li key={category.category_id}>
                                        <a href="#">{category.category_name}</a>
                                    </li>
                                ))
                            ) : (
                                <li>No categories available.</li>
                            )}
                        </ul>
                    </nav>
                    <div className="main-content-header">
                        <div className="content">
                            <h2>Surveys</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Survey Title</th>
                                        <th>Survey Description</th>
                                        <th>Category</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {surveys.length > 0 ? (
                                        surveys.map(survey => (
                                            <tr key={survey.survey_id}>
                                                <td>{survey.survey_title}</td>
                                                <td>{survey.survey_description}</td>
                                                <td>{survey.category_name}</td>
                                                <td>{survey.status}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4">No surveys available.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
