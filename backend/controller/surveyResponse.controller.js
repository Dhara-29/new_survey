import Response from "../model/surveyResponse.model.js";

export const addResponse = async (req, res) => {
    const { survey_id, user_id, responses } = req.body;
    console.log("Survey id:", survey_id);
    console.log("User id:", user_id);
    console.log("Responses:", responses);

    try {
        // Check if the user has already submitted a response for the given survey
        const existingResponses = await Response.findOne({
            where: { survey_id, user_id }
        });

        if (existingResponses) {
            return res.status(400).json({ error: 'You have already submitted a response for this survey.' });
        }

        // Handle each response for different questions
        const responseEntries = Object.entries(responses).map(([question_id, answer]) => {
            // Validate the response object
            if (!answer || (!answer.answer_text && !answer.selected_option && !answer.answer_numeric)) {
                return null; // Skip if all fields are empty or invalid
            }
            console.log("Answer:", answer);

            return {
                survey_id,
                user_id,
                question_id,
                answer_text: answer.answer_text || null,
                selected_option: answer.selected_option || null,
                answer_numeric: answer.answer_numeric || null,
                created_at: new Date()
            };
        }).filter(entry => entry !== null); // Remove null entries

        // Bulk create responses in one query
        await Response.bulkCreate(responseEntries);

        res.status(200).json({ message: 'Responses submitted successfully!' });
    } catch (error) {
        console.error('Error submitting responses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const viewResponse = async (req, res) => {
    const { survey_id, user_id } = req.params; // Assuming query params for survey_id and user_id

    console.log("Survey id:--", survey_id);
    console.log("User id:--", user_id);

    try {
        // Fetch the responses for the given survey and user
        const responses = await Response.findAll({
            where: { survey_id, user_id }
        });

        if (!responses.length) {
            return res.status(404).json({ error: 'No responses found for this survey and user.' });
        }

        // Format the responses in a more readable structure
        const formattedResponses = responses.map(response => ({
            question_id: response.question_id,
            answer_text: response.answer_text,
            selected_option: response.selected_option,
            answer_numeric: response.answer_numeric,
            created_at: response.created_at
        }));

        res.status(200).json({ responses: formattedResponses });
    } catch (error) {
        console.error('Error fetching responses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
