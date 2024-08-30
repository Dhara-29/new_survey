import Survey from "../model/survey.model.js";
import User from "../model/user.model.js";
import Category from "../model/category.model.js";

export const createSurvey = async (req, res, next) => {
    try {
        let survey = await Survey.findOne({ where: { userId: req.body.userId, survey_title: req.body.survey_title, survey_description: req.body.survey_description, status: req.body.status } })

        const { userId, survey_title, survey_description, status, category_id } = req.body;

        if (!survey) {
            Survey.create({
                userId,
                survey_title,
                survey_description,
                status,
                category_id,
            }).then((result) => {
                return res.status(200).json({ data: result.dataValues, message: "Survey added Successfully....." })

            }).catch((err) => {
                return res.status(500).json({ err: "Internal Server Error..." })
            })
        } else {
            console.log("Survey already exist.");
            return res.status(400).json("Survey already exist...");
        }
    } catch (error) {
        res.status(500).json({ error: 'Error creating user jdfhj', details: error.message });
    }
}

// Example Express route
export const removeSurvey = async (req, res) => {
    try {
        const { survey_id, user_id } = req.body;

        // Ensure surveyId and user_id are provided
        if (!survey_id || !user_id) {
            return res.status(400).json({ error: 'Missing surveyId or user_id' });
        }

        // Perform the deletion logic
        const result = await Survey.destroy({
            where: {
                survey_id: survey_id,
                userId: user_id
            }
        });

        // Check if any rows were deleted
        if (result === 0) {
            return res.status(404).json({ error: 'Survey not found or not owned by user' });
        }

        // Respond with success
        res.status(200).json({ message: 'Survey deleted successfully' });
    } catch (error) {
        console.error('Error removing survey:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};


export const getAllSurveys = async (req, res, next) => {
    try {
        const surveys = await Survey.findAll({
            include: [{
                model: User, // Including User table to get user details
                attributes: ['user_name'] // Fetching only the user_name
            }]
        });

        res.status(200).json(surveys);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching surveys', details: error.message });
    }
};

export const getSurveysByCategory = async (req, res, next) => {
    try {
        const { category_name } = req.body;

        const surveys = await Survey.findAll({
            include: [{
                model: Category, // Including Category model to filter by category_name
                where: { category_name }, // Filtering based on category_name
                attributes: ['category_name'] // Fetch only category_name
            }]
        });

        if (surveys.length === 0) {
            return res.status(404).json({ error: 'No surveys found for this category' });
        }

        res.status(200).json(surveys);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching surveys by category', details: error.message });
    }
};
export const viewParticularSurveyByTitle = async (req, res, next) => {
    try {
        const { survey_title } = req.body;

        // Validate input
        if (!survey_title) {
            return res.status(400).json({ error: 'Survey Title is required' });
        }
        // Find the survey using the User association
        const survey = await Survey.findOne({
            where: { survey_title },

        });
        if (survey_title != survey) {
            return res.status(404).json({ message: 'No surveys found for this title' });

        }
        // if (survey.length === 0) {
        //     return res.status(404).json({ error: 'No surveys found for this title' });
        // }
        res.status(200).json(survey);


    } catch (error) {
        res.status(500).json({ error: 'Error Searching Survey' });
    }

}

export const viewSurveysByUserId = async (req, res, next) => {
    try {
        const { userId } = req.params; // Get userId from route parameters
        console.log("User id : ", userId);

        // Validate input
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Find the surveys using the User ID
        const surveys = await Survey.findAll({
            where: { userId }
        });

        if (surveys.length === 0) {
            return res.status(404).json({ message: 'No surveys found for this user ID' });
        }

        res.status(200).json(surveys);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error fetching surveys' });
    }
}
export const viewSurveysBySurveyId = async (req, res, next) => {
    try {
        const { survey_id } = req.params;
        console.log("Survey id : ", survey_id);


        if (!survey_id) {
            return res.status(400).json({ error: 'User ID is required' });
        }


        const surveys = await Survey.findAll({
            where: { survey_id }
        });

        if (surveys.length === 0) {
            return res.status(404).json({ message: 'No surveys found for this user ID' });
        }

        res.status(200).json(surveys);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error fetching surveys', error });
    }
}
