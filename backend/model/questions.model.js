
import { DataTypes } from "sequelize";
import sequelize from "../database/db.connection.js";
import User from "./user.model.js";
import Category from "./category.model.js";
import Survey from "./survey.model.js";

const Questions = sequelize.define("questions_table", {

      question_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
      },

      survey_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true
      },
      category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true
      },
      user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true

      },
      question_type: {
            type: DataTypes.ENUM('MCQ', 'Text', 'Rating'),
            // defaultValue: 'Text',
            allowNull: false
      },
      question_text: {
            type: DataTypes.TEXT,
            allowNull: false
      },
      question_Options: {
            type: DataTypes.JSON,
            allowNull: true
      },
      question_answer_text: {
            type: DataTypes.TEXT,
            allowNull: true
      },
      createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
      },
      updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            onUpdate: DataTypes.NOW,
            allowNull: false,
      }
}, {
      // indexes: [
      //       {
      //             unique: true,
      //             fields: ['survey_id', 'user_id', 'category_id', 'question_type', 'question_text']
      //       }
      // ]
}


);


sequelize.sync()
      .then(() => {
            console.log("Questions table created....");
      }).catch(err => {
            console.log("Something wrong...");
            console.log(err);
      });

export default Questions;