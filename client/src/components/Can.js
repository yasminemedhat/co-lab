import rules from "../rbac-rules";

const check = (rules, role, action, data) => {
  const permissions = rules[role];
  // role is not present in the rules
  if (!permissions) {
    return false;
  }

  const staticPermissions = permissions.static;
  // static rule not provided for action
  if (staticPermissions && staticPermissions.includes(action)) {
    return true;
  }

  const dynamicPermissions = permissions.dynamic;

  if (dynamicPermissions) {
    const permissionCondition = dynamicPermissions[action];
    // dynamic rule not provided for action
    if (!permissionCondition) {
      return false;
    }

    return permissionCondition(data);
  }
  return false;
};

const Can = props =>
  check(rules, props.role, props.perform, props.data)
    ? props.yes()
    : props.no();

Can.defaultProps = {
  yes: () => null,
  no: () => null
};

export default Can;