/* =========================================================
 *  jQuery插件注册工具 easyPlugin
 * =========================================================
 *  @Auther：    Charles
 *  @Date：      2014-10-24
 *  @Contact：   16295853（wechat&qq）
 * ========================================================= */

(function ($) {
    //函数的typeof名称
    var FUNCTION_NAME = 'function';

    //注册插件接口
    $.easyPlugin = function (pluginName, pluginBody, isGlobal) {
        //注册插件
        (function ($) {
            //是否注册全局插件
            if(isGlobal){
                //注册全局插件：$.pluginName();
                $[pluginName] = pluginBody;
            }else{
                //注册元素插件：$(selector).pluginName(options:JSON, [isReturnPluginObj:boolean]);
                $.fn[pluginName] = function (options, isReturnPluginObj) {
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

                            //判断是否返回插件对象
                            if(isReturnPluginObj){
                                //返回插件对象
                                return this.data(pluginName);
                            }else{
                                //保持操作链
                                return this;   
                            }
                        break;
                        //获取当前插件对象：var pluginObj = $(selector).plugin('_');
                        case '_':
                            //返回将当前插件对象
                            return this.data(pluginName);
                        break;
                        //执行插件对象方法或属性：$(selector).plugin('methodName/propertyName', [parameters]);
                        default:
                            //获取插件对象
                            var pluginObj = this.data(pluginName);
                            //获取插件对象成员（属性/方法）
                            var member = pluginObj[command];
                            if(member){
                                //判断是否为方法
                                if(typeof(member) == FUNCTION_NAME){
                                    var parameters = arguments[1];
                                    if(!parameters || parameters.constructor.name != 'Array'){
                                        parameters = [];
                                    }
                                    //执行方法
                                    var result = member.apply(pluginObj, parameters);
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