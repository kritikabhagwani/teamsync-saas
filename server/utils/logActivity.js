const Activity = require("../models/Activity");

/**
 * Log an activity
 * @param {Object} data
 * @param {String} data.organization - Organization ID
 * @param {String} data.user - User ID
 * @param {String} data.action - CREATE | UPDATE | DELETE
 * @param {String} data.entityType - Project | Task
 * @param {String} data.entityId - Project/Task ID
 * @param {String} data.description - Activity description
 */

const logActivity = async ({
  organization,
  user,
  action,
  entityType,
  entityId,
  description,
}) => {
  try {
    await Activity.create({
      organization,
      user,
      action,
      entityType,
      entityId,
      description,
    });
  } catch (error) {
    console.error("Activity Log Error:", error.message);
  }
};

module.exports = logActivity;