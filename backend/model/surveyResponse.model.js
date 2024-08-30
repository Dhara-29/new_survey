import { DataTypes } from 'sequelize';
import sequelize from '../database/db.connection.js'; // Adjust the path to your database configuration file
import Survey from './survey.model.js';
import User from './user.model.js';
import Questions from './questions.model.js';
const Response = sequelize.define('Response', {
    answer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    survey_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Survey, // Adjust model name if needed
            key: 'survey_id'
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Nullable to allow anonymous responses
        references: {
            model: User, // Adjust model name if needed
            key: 'user_id'
        }
    },
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model:Questions, // Adjust model name if needed
            key: 'question_id'
        }
    },
    answer_text: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    selected_option: {
        type: DataTypes.STRING,
        allowNull: true
    },
    answer_numeric: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE, // Changed from DataTypes.TIMESTAMP to DataTypes.DATE
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Response',
    timestamps: false ,// Assuming `created_at` is the only timestamp and not using Sequelize's default timestamps
    indexes: [
        {
            unique: true,
            fields: ['survey_id', 'user_id', 'question_id']
        }
    ]
});

sequelize.sync()    
    .then(() => {
        console.log("Response table created....");
    }).catch(err => {
        console.log("Something wrong...");
        console.log(err);
    });


export default Response;
