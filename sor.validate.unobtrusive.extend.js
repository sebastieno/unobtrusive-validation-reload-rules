// Validate Unobtrusive Reload Rules 1.0.0
// (c) Sébastien Ollivier - http://sebastienollivier.fr/blog/javascript/jquery-validate-unobtrusive-reload-rules/
(function ($) {
    $.validator.unobtrusive.reloadRules = function (selector) {
        var form = $(selector).first().closest("form");
        var unobtrusiveValidation = form.data("unobtrusiveValidation");

        if (unobtrusiveValidation) {
            if ($(selector).is("input, select, textarea")) {
                var componentName = $(selector).attr("name");
                if (componentName != undefined && componentName in unobtrusiveValidation.options.rules) {
                    delete unobtrusiveValidation.options.rules[componentName];
                    delete unobtrusiveValidation.options.messages[componentName];
                }
            } else {
                $(selector).find("input, select, textarea").each(function () {
                    var componentName = this.name;
                    if (componentName != undefined && componentName in unobtrusiveValidation.options.rules) {
                        delete unobtrusiveValidation.options.rules[componentName];
                        delete unobtrusiveValidation.options.messages[componentName];
                    }
                });
            }
        }

        $.validator.unobtrusive.parse(selector);
        unobtrusiveValidation = form.data("unobtrusiveValidation");
        var validator = form.validate();

        $.each(unobtrusiveValidation.options.rules, function (elName, elRules) {
            if (validator.settings.rules[elName] == undefined) {
                var args = {};
                $.extend(args, elRules);
                args.messages = unobtrusiveValidation.options.messages[elName];

                $("[name='" + elName + "']").rules("add", args);
            } else {
                $.each(elRules, function (ruleName, data) {
                    if (validator.settings.rules[elName][ruleName] == undefined) {
                        var args = {};
                        args[ruleName] = data;
                        args.messages = unobtrusiveValidation.options.messages[elName][ruleName];
                        $("[name='" + elName + "']").rules("add", args);
                    }
                });
            }
        });

        var rulesToRemove = [];

        $.each(validator.settings.rules, function (elName, elRules) {
            if (unobtrusiveValidation.options.rules[elName] == undefined) {
                rulesToRemove.push(elName);
            } else {
                var subRulesToRemove = [];

                $.each(elRules, function (ruleName, data) {
                    if (unobtrusiveValidation.options.rules[elName][ruleName] == undefined) {
                        subRulesToRemove.push(ruleName);
                    }
                });

                for (var i = 0; i < subRulesToRemove.length; i++) {
                    delete validator.settings.rules[elName][subRulesToRemove[i]];
                }
            }
        });

        for (var i = 0; i < rulesToRemove.length; i++) {
            delete validator.settings.rules[rulesToRemove[i]];
        }
    };
})(jQuery);