'use strict';
var errorCode = function () {
    return {
      OK : 0,
      DB_CONNECTION : 21000,
      DB_QUERY : 22000,
      DB_TRANSACTION : 22100,
      DB_COMMIT : 22200,
      DB_UNKNOWN : 23000,
      AUTHENTICATION_ERROR: 30001,
      ACCESS_DENIED: 30002,
      INVALID_PARAMETER : 30009,
      NOT_SUPPORT_FUNCTION : 30010,
      UNKNOWN_ERROR: 99999,
      NOT_FOUND_RESOURCE : 40000
    };
};

module.exports = errorCode();