define(function() {
  var adminRoles = [
                      'ADMINISTRATOR'
                      ];
  var customerRoles = [
                       'ADMINISTRATOR',
                       'DESIGNER',
                       'MANAGER'
                       ];
  return {
    admin: adminRoles,
    customer: customerRoles
  };
});