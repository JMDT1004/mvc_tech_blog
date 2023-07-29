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

Dashboard.belongsTo(User, {
  foreignKey: 'userId',
});

module.exports = { User, Post, Dashboard };
