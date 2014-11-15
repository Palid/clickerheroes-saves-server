// ==UserScript==
// @name        Clicker Saves
// @namespace   https://github.com/Palid/clickerheroes-saves-server
// @version     0.4
// @authors     Dariusz 'Palid' Niemczyk
// @description Cloud saves for clickerheroes
// @downloadURL https://clicker-heroes-saves-server.herokuapp.com/userscript/userscript.js
// @updateURL   https://clicker-heroes-saves-server.herokuapp.com/userscript/userscript.meta.js
// @include     http://www.clickerheroes.com/
// @include     https://clicker-heroes-saves-server.herokuapp.com/
// @grant       none
// @require     http://code.jquery.com/jquery-2.1.1.min.js
// @require     http://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// ==/UserScript==

(function(document, window, $) {
  "use strict";

  var JSMod = window.JSMod;

  var SERVER = 'https://clicker-heroes-saves-server.herokuapp.com/';

  var CONTENT = $('#content');
  var ROW = $('<div class="row"></div>');
  var cookies = {
    saveID: $.cookie('saveID'),
    autosave: $.cookie('autosave')
  };

  var forms = {
    choose: $('<div class="btn-group login-buttons" role="group"> <button type="button" class="btn btn-default" id="show-login">Login</button> <button type="button" class="btn btn-default" id="show-register">Register</button></div>'),
    login: $('<form class="form-inline" role="form" style="display:none;"> <div class="form-group group-login"> <div class="input-group"> <label class="sr-only" for="login-input">Login</label> <div class="input-group-addon">(*´・ｖ・)</div><input type="text" class="form-control" id="login-input" placeholder="Login"> </div></div><div class="form-group"> <div class="input-group group-password"> <label class="sr-only" for="password-input">Password</label> <div class="input-group-addon">( ¬‿¬) </div><input type="password" class="form-control" id="password-input" placeholder="Password"> </div></div><div class="checkbox"> <label> <input id="rembember-me" type="checkbox"> Remember me </label> </div><button id="sign-in" class="btn btn-default login">Sign in</button> <h4 style="display:none;" class="failure-header"></h4></form>'),
    afterLogin: $('<form class="form-inline" role="form"> <div class="input-group input-group-lg"> <span class="input-group-addon">⌂</span> <input type="text" class="form-control save-place" disabled="disabled" placeholder="Your save goes here"> </div><button id="from-cloud" class="btn btn-default">Get last save from cloud</button> <button id="to-cloud" class="btn btn-default">Save to cloud</button> <div class="checkbox"> <label> <input class="autosave" type="checkbox"> Autosave every 60seconds </label> </div></form>')
  };

  function updateSave(saveEl){
    return $.ajax(getURL('save')+ '/' + cookies.saveID, {
      data: {
        save: JSMod.getUserData(),
        currentDate: new Date(),
        creationDate: new Date()
      },
      dataType: 'json',
      type: 'PUT'
    })
    .done(function(response){
      if (response.status === "OK") {
        saveEl.val(response.encodedSave);
      }
    });
  }

  function setAutosaveInterval(saveInterval, saveEl) {
    saveInterval = setInterval(function() {
      updateSave(saveEl);
    }, 1000 * 60);
    return saveInterval;
  }

  function afterLogin(el) {
    if (el) {
      $('.login-buttons').hide();
      $('#show-login').off('click.login');
      $('#show-register').off('click.register');
      el.hide();
    }
    ROW.append(forms.afterLogin);

    var saveInterval;
    var saveEl = forms.afterLogin.find('.save-place');
    var autosave = forms.afterLogin.find('.autosave');
    var fromCloud = forms.afterLogin.find('#from-cloud');
    var toCloud = forms.afterLogin.find('#to-cloud');
    autosave.prop('checked', cookies.autosave);

    if (cookies.autosave) {
       saveInterval =  setAutosaveInterval(saveInterval, saveEl);
    }


    autosave.on('change', function() {
      var checked = autosave.prop('checked');
      if (checked && !saveInterval) {
        setAutosaveInterval(saveInterval, saveEl);
      } else {
        clearInterval(saveInterval);
        saveInterval = undefined;
      }
      $.cookie('autosave', checked);
      cookies.autosave = checked;
    });

    fromCloud.on('click', function(e) {
      e.preventDefault();
      autosave.prop('checked', false);
      clearInterval(saveInterval);
      saveInterval = undefined;
      $.ajax(getURL('save')+ '/' + cookies.saveID,{
        dataType: 'json',
        type: 'GET'
      }).done(function(response){
        saveEl.val(response.encrypted.currentSave);
      });
    });

    toCloud.on('click', function(e){
      e.preventDefault();
      updateSave(saveEl);
    });

  }

  function getURL(endpoint) {
    return SERVER + endpoint;
  }

  function showGeneric(color, el, description) {
    return el
      .css({
        color: color
      })
      .html(description)
      .fadeIn();
  }

  function showError(el, description) {
    return showGeneric('#843534', el, description);
  }

  function setupHandler(formType) {
    $('#show-' + formType).on('click.' + formType, function(e) {
      forms.login.show();
      e.preventDefault();
      setupForm(formType);
    });
  }

  function setupForm(formType) {
    // Render
    ROW.append(forms.login);

    var login = forms.login.find('#login-input');
    var password = forms.login.find('#password-input');
    var rememberMe = forms.login.find('#remember-me');
    var autosave = forms.login.find('.autosave');
    var signIn = forms.login.find('#sign-in');

    if (formType === "register") {
      signIn.html('Register');
    } else {
      signIn.html('Sign in');
    }

    signIn.on('click', function bindClickEvents(e) {
      var groupLogin = $('.group-login');
      var failureHeader = $('.failure-header');
      groupLogin.removeClass('has-error');
      failureHeader.fadeOut();

      e.preventDefault();
      $.ajax(getURL(formType), {
        data: {
          login: login.val(),
          password: password.val()
        },
        dataType: 'json',
        type: 'POST'
      }).done(function(response) {
        if (response.status === "OK") {
          cookies.saveID = response.saveID;
          if (rememberMe.prop('checked')) {
            $.cookie('saveID', response.saveID, {
              expires: 365,
              path: '/'
            });
          } else {
            $.cookie('saveID', response.saveID);
          }
          cookies.autosave = autosave.prop('checked');
          $.cookie('autosave', cookies.autosave);
          afterLogin(forms.login);
        } else if (response.status === "ERROR") {
          if (response.code === 8 || response.code === 99 || response.code === 11000 || response.code === "I'm a teapot") {
            groupLogin.addClass('has-error');
            showError(failureHeader, response.description);
          } else if (response.code === 9) {
            $('.group-password').addClass('has-error');
            showError(failureHeader, response.description);
          }
        }
      });
    });
  }

  (function setup() {
    var link = window.document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css';
    document.querySelector('head').appendChild(link);

    // Fix colors on site
    $('body').css({
      backgroundColor: "#222222",
      color: "#AAAAAA"
    });

    //Make #content a container.
    CONTENT.addClass('container').append(ROW);

    // This thing is really annoying...
    $('#legend').hide();

    // Show form
    if (cookies.saveID) {
      afterLogin();
    } else {
      ROW.append(forms.choose)
        .append(forms.login);

      // Setup click handlers
      setupHandler('login');
      setupHandler('register');
    }

  })();

})(document, window, jQuery);
