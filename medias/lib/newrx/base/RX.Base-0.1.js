/*****************************************************************
 * RX.Base-0.1
 * RX基础类-基础结构
 * 最后更新时间：2018-01-24
 * 最后更新人：Zp
 * 更新内容：创建文件
 ******************************************************************/
(function () {
    // 创建一个全局对象, 在浏览器中表示为window对象, 在Node.js中表示global对象
    var root = this;

    //Form构造器
    var Base = RX.Base = function(data){
        // 调用initialize初始化方法
        this.initialize.apply(this, arguments);
    };

    Base.prototype = {
        a: function(){alert("a")}
    }

    // 实现对象继承的函数, 该函数内部使用inherits实现继承, 请参考inherits函数
    Base.extend = function (protoProps, classProps) {
        // child存储已经实现继承自当前类的子类(Function)
        // protoProps设置子类原型链中的属性
        // classProps设置子类的静态属性
        var child = inherits(this, protoProps, classProps);
        // 将extend函数添加到子类, 因此调用子类的extend方法便可实现对子类的继承
        child.extend = this.extend;
        // 返回实现继承的子类
        return child;
    }

    // ctor是一个共享的空函数, 用于在调用inherits方法实现继承时, 承载父类的原型链以便设置到子类原型中
    var ctor = function () {};
    // 实现OOP继承特性
    // @param {Function} parent 被继承的父类Function
    // @param {Object} protoProps 扩展子类原型中的属性(或方法)对象
    // @param {Object} staticProps 扩展子类的静态属性(或方法)对象
    var inherits = function (parent, protoProps, staticProps) {
        var child;

        // 如果在protoProps中指定了"constructor"属性, 则"constructor"属性被作为子类的构造函数
        // 如果没有指定构造子类构造函数, 则默认调用父类的构造函数
        if (protoProps && protoProps.hasOwnProperty('constructor')) {
            // 使用"constructor"属性指定的子类构造函数
            child = protoProps.constructor;
        } else {
            // 使用父类的构造函数
            child = function () {
                parent.apply(this, arguments);
            };
        }

        // 将父类中的静态属性复制为子类静态属性
        $.extend(child, parent);

        // 将父类原型链设置到子类的原型对象中, 子类以此继承父类原型链中的所有属性
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();

        // 将protoProps对象中的属性复制到子类的原型对象, 子类以此拥有protoProps中的属性
        if (protoProps)
            $.extend(child.prototype, protoProps);

        // 将staticProps对象中的属性复制到子类的构造函数本身, 将staticProps中的属性作为子类的静态属性
        if (staticProps)
            $.extend(child, staticProps);

        // 在复制父类原型链到子类原型时, 子类原型链中的构造函数已经被覆盖, 因此此处重新设置子类的构造函数
        child.prototype.constructor = child;

        // 如果子类设置了constructor属性, 则子类构造函数为constructor指定的函数
        // 如果需要在子类构造函数中调用父类构造函数, 则需要在子类构造函数中手动调用父类的构造函数
        // 此处将子类的__super__属性指向父类的构造函数, 方便在子类中调用: 子类.__super__.constructor.call(this);
        child.__super__ = parent.prototype;

        // 返回子类
        return child;
    };

}).call(this);