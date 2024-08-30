// Import necessary modules and models
import Questions from "../model/questions.model.js";
export const addQuestion = async (req, res, next) => {
  console.log('Request Body:', req.body); // Logging request body for debugging

  try {
    const { survey_id, user_id, category_id, question_type, question_text, questionOptions, question_answer_text } = req.body;

    // Validate required fields
    if (!survey_id || !user_id || !category_id || !question_type || !question_text) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Convert questionOptions to JSON if question_type is MCQ
    const formattedOptions = question_type === 'MCQ' ? JSON.stringify(questionOptions) : null;
    console.log("Formatted options : ", formattedOptions);

    // Check if the question already exists
    const existingQuestion = await Questions.findOne({
      where: {
        survey_id,
        user_id,
        category_id,
        question_type,
        question_text
      }
    });

    if (existingQuestion) {
      return res.status(400).json({ error: 'This question already exists' });
    }

    // Create the new question if it does not exist
    const newQuestion = await Questions.create({
      survey_id,
      category_id,
      user_id,
      question_type,
      question_text,
      question_Options: formattedOptions, // Store options as JSON string if type is MCQ
      question_answer_text
    });

    res.status(201).json(newQuestion);
    console.log("Question added successfully:", newQuestion);

  } catch (error) {
    console.log('Error details:', error); // Detailed error logging
    res.status(500).json({ error: 'Error creating question', details: error.message });
  }
};


export const insertRecords = async (req, res) => {
  try {
    const { questionIds, survey_id } = req.body;

    // Fetch existing records based on question_ids
    const existingRecords = await Questions.findAll({
      where: {
        question_id: questionIds,
      }
    });

    // Fetch existing questions in the specified survey to avoid duplicates
    const existingSurveyQuestions = await Questions.findAll({
      where: {
        survey_id: survey_id
      }
    });

    // Create a set of existing question texts in the survey for quick lookup
    const existingSurveyQuestionTexts = new Set(existingSurveyQuestions.map(record => record.question_text));

    // Prepare records for insertion, filtering out duplicates
    const recordsToInsert = existingRecords
      .filter(record => !existingSurveyQuestionTexts.has(record.question_text)) // Filter out existing questions
      .map(record => ({
        survey_id: survey_id,
        category_id: record.category_id,
        user_id: record.user_id,
        question_type: record.question_type,
        question_text: record.question_text,
        question_Options: record.question_Options, // Ensure proper field name
        question_answer_text: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

    // Ensure that recordsToInsert is not empty before performing bulkCreate
    if (recordsToInsert.length > 0) {
      await Questions.bulkCreate(recordsToInsert);
      console.log('Records inserted successfully');
    } else {
      console.log('No new records to insert.');
    }
    res.status(200).send({ message: 'Records inserted successfully.' });
  } catch (error) {
    console.error('Error inserting records:', error);
    res.status(500).send({ error: 'Error inserting records.' });
  }
};

export const checkQuestionExists = async (req, res, next) => {
  console.log('Request Body for Existence Check:', req.body); // Logging request body for debugging

  try {
    const { question_text, question_type } = req.body;

    // Validate required fields
    if (!question_text || !question_type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if the question already exists
    const existingQuestion = await Questions.findOne({
      where: {
        question_text,
        question_type
      }
    });

    if (existingQuestion) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }

  } catch (error) {
    console.log('Error details:', error); // Detailed error logging
    res.status(500).json({ error: 'Error checking question existence', details: error.message });
  }
};


//Remove question
export const removeQuestion = async (req, res, next) => {
  try {
    const { user_id, question_id } = req.body; // Get the user_id and question_id from request body

    // Check if the question exists for the given user
    const question = await Questions.findOne({
      where: {
        user_id: user_id,
        question_id: question_id
      }
    });

    // If question not found, return 404
    if (!question) {
      return res.status(404).json({ message: 'Question not found or does not belong to this user' });
    }

    // Remove the question
    await Questions.destroy({
      where: {
        user_id: user_id,
        question_id: question_id
      }
    });

    res.status(200).json({ message: 'Question removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error removing question', details: error.message });
  }
};

//Remove Question using SurveyId

export const removeQuestionBySurveyId = async (req, res, next) => {
  try {
    const { survey_id, question_id } = req.body; // Get the survey_id and question_id from request body

    // Check if the question exists for the given survey
    const question = await Questions.findOne({
      where: {
        survey_id: survey_id,
        question_id: question_id
      }
    });

    // If question not found, return 404
    if (!question) {
      return res.status(404).json({ message: 'Question not found in this survey' });
    }

    // Remove the question
    await Questions.destroy({
      where: {
        survey_id: survey_id,
        question_id: question_id
      }
    });

    res.status(200).json({ message: 'Question removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error removing question', details: error.message });
  }
};



// Update option
export const updatedOption = async (req, res) => {
  try {
    const question_id = req.body.question_id;
    const optionId = req.body.optionId;
    const newOption = req.body.newOption;

    console.log("inside try-----------------------");

    // Fetch the question from the database
    const question = await Questions.findOne({
      where: { question_id: question_id },

    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    let options = question.question_Options;

    // Debug log to check options array
    console.log("Options:", options);
    console.log("Option ID (type):", typeof optionId, optionId);

    // Find the option to update
    let optionToUpdate = options.find(option => option.id == optionId); // Use `==` to allow type coercion
    console.log("Option to update:", optionToUpdate); // Log this for debugging

    if (optionToUpdate) {
      optionToUpdate.option = newOption;
    } else {
      return res.status(404).json({ message: 'Option not found' });
    }
    // Save the updated options back to the database
    question.question_Options = options;
    await Questions.update(
      { question_Options: options },
      { where: { question_id: question_id } }
    );
    res.json({ message: 'Option updated successfully', updatedOptions: question.question_Options });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating the option' });
  }
}

//Remove Option

export const removeOption = async (req, res) => {
  try {
    const question_id = req.body.question_id;
    const optionId = req.body.optionId;

    console.log("Inside remove option-----------------------");

    // Fetch the question from the database
    const question = await Questions.findOne({
      where: { question_id: question_id },
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    let options = question.question_Options;

    console.log("Options before removal:", options);
    console.log("Option ID to remove (type):", typeof optionId, optionId);

    const updatedOptions = options.filter(option => option.id != optionId);

    if (options.length === updatedOptions.length) {
      return res.status(404).json({ message: 'Option not found' });
    }

    question.question_Options = updatedOptions;

    await Questions.update(
      { question_Options: updatedOptions },
      { where: { question_id: question_id } }
    );

    res.json({ message: 'Option removed successfully', updatedOptions: question.question_Options });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while removing the option' });
  }
}

export const getQuestionsBySurveyId = async (req, res, next) => {
  const { survey_id } = req.params; // Extract surveyId from request parameters
  console.log(survey_id);

  try {
    // Fetch questions by survey_id from the database
    const questions = await Questions.findAll({
      where: { survey_id: survey_id },

    });

    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for this survey' });
    }

    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    console.log(error);

    res.status(500).json({ error: 'Error fetching questions', details: error.message });
  }
};
export const getQuestionsByCategoryId = async (req, res, next) => {
  const { categoryId } = req.params; // Extract surveyId from request parameters
  console.log(categoryId);

  try {
    // Fetch questions by survey_id from the database
    const questions = await Questions.findAll({
      where: { category_id: categoryId },

    });

    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for this survey' });
    }

    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    console.log(error);

    res.status(500).json({ error: 'Error fetching questions', details: error.message });
  }
};
