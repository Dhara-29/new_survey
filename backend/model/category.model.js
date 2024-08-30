import { DataTypes } from 'sequelize';
import sequelize from '../database/db.connection.js';
import Survey from './survey.model.js';

const Category = sequelize.define('category', {
    categoryid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        foreignKey: true
  },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        field: 'created_at'  // Ensure this matches your database column name if using snake_case
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
        allowNull: false,
        field: 'updated_at'  // Ensure this matches your database column name if using snake_case
    }
});


sequelize.sync()
    .then(() => {
        console.log("Category table created....");
    })
    .catch(err => {
        console.log("Something went wrong...");
        console.log(err);
    });

export default Category;
