import Category from "./category.model.js";
import Questions from "./questions.model.js";
import Survey from "./survey.model.js";
import User from "./user.model.js";
import Response from "./surveyResponse.model.js";
// Define associations
Survey.belongsTo(User, {
      foreignKey: 'userId'
});
Category.belongsTo(User,{
      foreignKey:'user_id'
})
Category.hasMany(Survey, {
      foreignKey: 'category_id',
});
Survey.belongsTo(Category, {
      foreignKey: 'category_id',
});
User.hasMany(Questions, {
      foreignKey: 'user_id'
})
Survey.hasMany(Questions, {
      foreignKey: 'survey_id'
})
Category.hasMany(Questions,{
      foreignKey:'category_id'
})
// Response.belongsTo(User,{
//       foreignKey:'user_id'
// })
// Response.belongsTo(Survey,{
//       foreignKey:'survey_id'
// })
// Response.hasMany(Questions,{
//       foreignKey:'question_id'
// })
// Export models
export default { Survey, User, Category, Questions };