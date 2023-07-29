const User = require('./User');
const Post = require('./Post');
const Dashboard = require('./Dashboard');

User.hasMany(Post, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

User.hasOne(Dashboard, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

Post.belongsTo(User, {
  foreignKey: 'userId',
});

Post.belongsTo(Dashboard, {
  foreignKey: 'dashboardId',
});

Dashboard.belongsTo(User, {
  foreignKey: 'userId',
});

Dashboard.hasMany(Post, {
  foreignKey: 'dashboardId',
  onDelete: 'CASCADE',
});

module.exports = { User, Post, Dashboard };