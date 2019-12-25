// rules defined as resourse:action
const rules = {
    visitor: {
      static: ["about:visit", "home:visit"]
    },
    writer: {
      static: [
        "projects:list",
        "projects:create",
        "collaborations:list",
        "collaborations:create",
        "users:getSelf",
        "home:visit",
        "discover:visit"
      ],
      dynamic: {
        "project:edit": ({userId, projectCreatorId}) => {
          if (!userId || !projectCreatorId) return false;
          return userId === projectCreatorId;
        },
        "project:create": ({userId, profileOwnerId}) => {
            if (!userId || !profileOwnerId) return false;
            return userId === profileOwnerId;
        },
        "collaboration:edit": ({userId, collaborationMemebersIds}) => {
            if (!userId || !collaborationMemebersIds) return false;
            // return collaborationMemebersIds.indexOf(userId) > -1;
            return collaborationMemebersIds.includes(userId);
        },
        "collaboration:create": ({userId, profileOwnerId}) => {
            if (!userId || !profileOwnerId) return false;
            return userId === profileOwnerId;
        },
      }
    },
    admin: {
      static: [
        "posts:list",
        "posts:create",
        "posts:edit",
        "posts:delete",
        "users:get",
        "users:getSelf",
        "home-page:visit",
        "dashboard-page:visit"
      ]
    }
  };
  
  export default rules;