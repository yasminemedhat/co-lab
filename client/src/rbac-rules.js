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
        "collaborations:addMember": ({userId, members}) => {
          if (!userId || !members) return false;
          console.log("add member cannn");
          console.log(userId);
          const ids = members.map(member => member._id);
          console.log(ids);
          return ids.includes(userId);
        },
        "users:follow": ({userId, profileOwnerId}) => {
          if (!userId || !profileOwnerId) return false;
          console.log("follow rule: ",userId !== profileOwnerId)
          return userId !== profileOwnerId;
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