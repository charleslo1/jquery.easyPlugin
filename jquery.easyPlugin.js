/* 
 *  jQuery插件注册工具 easyPlugin
 * ----------------------------------
 *  作者：Charles
 *  时间：2014-10-24
 *  准则：jQuery 插件
 *  联系：16295853（qq）
 ************************************************************/

(function ($) {
    //函数的typeof名称
    var FUNCTION_NAME = 'function';

    //注册插件接口
    $.easyPlugin = function (pluginName, pluginBody, isGlobal) {
        //注册插件
        (function ($) {
            if(isGlobal){
                //注册全局插件
                $[pluginName] = pluginBody;
            }else{
                //注册元素插件
                $.fn[pluginName] = function (options) {
                    //获取命令和参数
                    var command = 'init';
                    if(arguments.length > 0){
                        if (typeof arguments[0] == 'string'){
                            command = arguments[0];
                        }
                    }

                    //判断命令
                    switch(command){
                        //对象初始化：$(selector).plugin();
                        case 'init':
                            //循环操作
                            this.each(function (i, item) {
                                var $item = $(item);
                                options = options ? options : {};
                                //实例化pluginBody对象
                                var pluginObj = new pluginBody($item, options);
                                //将当前插件对象保存到data中
                                $item.data(pluginName, pluginObj);
                            });
                            //保持操作链
                            return this;
                        break;
                        //获取当前插件对象：var pluginObj = $(selector).plugin('_');
                        case '_':
                            //返回将当前插件对象
                            return this.data(pluginName);
                        break;
                        //执行插件对象方法或属性：$(selector).plugin('methodName/propertyName', [parameters]);
                        default:
                            var pluginObj = this.data(pluginName);
                            var member = pluginObj[command];
                            if(member){
                                //判断是否为方法
                                if(typeof(member) == FUNCTION_NAME){
                                    var arguments = arguments[1];
                                    if(!arguments || arguments.constructor.name != 'Array'){
                                        arguments = [];
                                    }
                                    //执行方法
                                    var result = member.apply(pluginObj, arguments);
                                    //判断是否有返回结果，有则直接return结果
                                    if(result){
                                        return result;
                                    }
                                }else{
                                    //直接返回属性
                                    return member;
                                }
                            }
                        break;
                    }

                    //保持操作链
                    return this;
                };
            }
        })(jQuery);
    };
})(jQuery);
