'use strict';

module.exports = function(router) {
  router.get('/common/register.html', function(req, res) {
    res.render('templates/common/register', {});
  });

  router.get('/common/login.html', function(req, res) {
    res.render('templates/common/login', {});
  });

  router.get('/common/menu.html', function(req, res) {
    res.render('templates/common/menu', {});
  });

  router.get('/common/header.html', function(req, res) {
    res.render('templates/common/header', {});
  });

  router.get('/common/footer.html', function(req, res) {
    res.render('templates/common/footer', {});
  });

  router.get('/common/calendar.html', function(req, res) {
    res.render('templates/common/calendar', {});
  });

  router.get('/common/landing.html', function(req, res) {
    res.render('templates/common/landing', {});
  });

  router.get('/common/calendar/addEvent.html', function(req, res) {
    res.render('templates/common/calendar/addEvent', {});
  });

  router.get('/common/calendar/showEvent.html', function(req, res) {
    res.render('templates/common/calendar/showEvent', {});
  });
  
  /* 메시지 */
  router.get('/common/helpdesk/message.html', function(req, res) {
    res.render('templates/common/helpdesk/message', {});
  });

  router.get('/common/helpdesk/popup/addMessage.html', function(req, res) {
    res.render('templates/common/helpdesk/popup/addMessage', {});
  });
  
  router.get('/common/helpdesk/popup/showMessage.html', function(req, res) {
    res.render('templates/common/helpdesk/popup/showMessage', {});
  });
  
  /* 공지사항 */
  router.get('/common/helpdesk/notice.html', function(req, res) {
    res.render('templates/common/helpdesk/notice', {});
  });

  router.get('/common/helpdesk/popup/addNotice.html', function(req, res) {
    res.render('templates/common/helpdesk/popup/addNotice', {});
  });
  
  router.get('/common/helpdesk/popup/showNotice.html', function(req, res) {
    res.render('templates/common/helpdesk/popup/showNotice', {});
  });

  router.get('/user/statistics.html', function(req, res) {
    res.render('templates/user/statistics', {});
  });

  router.get('/broker/statistics.html', function(req, res) {
    res.render('templates/broker/statistics', {});
  });

  /* 오더 - 주선소 */
  router.get('/broker/popup/addOrder.html', function(req, res) {
    res.render('templates/broker/popup/addOrder', {});
  });
  
  router.get('/broker/popup/updateOrder.html', function(req, res) {
    res.render('templates/broker/popup/updateOrder', {});
  });

  /* 오더 - 차주 */
  router.get('/user/popup/showOrder.html', function(req, res) {
    res.render('templates/user/popup/showOrder', {});
  });

  router.get('/user/popup/allocOrder.html', function(req, res) {
    res.render('templates/user/popup/allocOrder', {});
  });
  
  
  /* 롤 그룹 */
  router.get('/admin/role_group/list.html', function(req, res) {
    res.render('templates/admin/role_group/list', {});
  });
  router.get('/admin/role_group/addRoleGroup.html', function(req, res) {
    res.render('templates/admin/role_group/addRoleGroup', {});
  });
  router.get('/admin/role_group/add_rolegroupmember.html', function(req, res) {
    res.render('templates/admin/role_group/add_rolegroupmember', {});
  });
  router.get('/admin/role_group/grouprole_list.html', function(req, res) {
    res.render('templates/admin/role_group/grouprole_list', {});
  });
  router.get('/admin/role_group/showGroupUserList.html', function(req, res) {
    res.render('templates/admin/role_group/showGroupUserList', {});
  });

};
