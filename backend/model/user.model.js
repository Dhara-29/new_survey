import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../database/db.connection.js";
import bcrypt from "bcryptjs";
import moment from 'moment-timezone';
import Questions from "./questions.model.js";
import Survey from "./survey.model.js";

function convertToIST(utcDate) {
    if (!utcDate) return null;
    return moment(utcDate).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
}

const User = sequelize.define("user", {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email_Address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            let saltKey = bcrypt.genSaltSync(10);
            let encryptedPassword = bcrypt.hashSync(value, saltKey);
            this.setDataValue("password", encryptedPassword);
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        get() {
            const rawValue = this.getDataValue('createdAt');
            return convertToIST(rawValue);  // Convert to IST
        }
    },
    updatedAt: {
        type: DataTypes.DATE,
        get() {
            const rawValue = this.getDataValue('updatedAt');
            return convertToIST(rawValue);  // Convert to IST
        }
    }
});

User.checkPassword = (originalPassword, encryptedPassword) => {
    console.log("checkPassword called...");
    return bcrypt.compareSync(originalPassword, encryptedPassword);
};

// User.hasMany(Survey,{
//     foreignKey:'userId'
// })

sequelize.sync()
    .then(() => {
        console.log("User table created...");
    })
    .catch(err => {
        console.log("Something went wrong...");
        console.log(err);
    });

export default User;
