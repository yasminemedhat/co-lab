// rules defined as resourse:action
const rules = {
    visitor: {
      static: ["about:visit", "home:visit"]
    },
    Colaber: {
      static: [
        "projects:list",
        "collaborations:list",
        "users:getSelf",
        "home:visit",
        "discover:visit"
      ],
      dynamic: {
        "projects:edit": ({userId, projectCreatorId}) => {
          if (!userId || !projectCreatorId) return false;
          return userId === projectCreatorId;
        },
        "projects:create": ({userId, profileOwnerId}) => {
            if (!userId || !profileOwnerId) return false;
            return userId === profileOwnerId;
        },
        "collaborations:edit": ({userId, collaborationMemebersIds}) => {
            if (!userId || !collaborationMemebersIds) return false;
            // return collaborationMemebersIds.indexOf(userId) > -1;
            return collaborationMemebersIds.includes(userId);
        },
        "collaborations:create": ({userId, profileOwnerId}) => {
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