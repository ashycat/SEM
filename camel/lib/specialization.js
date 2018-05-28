'use strict';
module.exports = function () {
    return function (req, res, next) {
        //Sample of setting context in res.locals
        console.log("\n\nwhen is started this method???\n\n");
        console.log("\n\nreq.session.type : ",req.session.type);
        console.log("\n\nreq.user : ", req.user);
        var userrole;
        //sample of setting context in the model
        
        /*
         * 유저 권한에 따른 sepecialization 을 미들웨어로 구현  
         */
        var role = (req.user && req.user.role) ? req.user.role : '';
        
        switch(role) {
        case 'user':
            userrole = 'user';
            break;

        case 'administrator':
            userrole = 'administrator';
            break;

        case 'designer':
            userrole = 'designer';
            break;
            
        case 'manager':
            userrole = 'manager';
            break;    
        }
        

        res.locals.userrole = {
            is: userrole
        };
        next();
    };
};