
import { DataTypes } from "sequelize";
import sequelize from "../database/db.connection.js";
import User from "./user.model.js";
import Category from "./category.model.js";
import Questions from "./questions.model.js";

const Survey = sequelize.define("survey_table", {

    survey_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type:DataTypes.INTEGER,
        foreignKey: true,
        allowNull:false,
    }
    ,
    survey_title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    survey_description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Draft', 'Published'),
        defaultValue: 'Draft',
        allowNull: false,

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
});

sequelize.sync()    
    .then(() => {
        console.log("Survey table created....");
    }).catch(err => {
        console.log("Something wrong...");
        console.log(err);
    });



export default Survey;
