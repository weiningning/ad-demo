/*String.prototype*/
~function (pro) {
    //->解析URL中的问号参数值以及HASH值
    function queryURLParameter() {
        var obj = {},
            reg = /([^?=&#]+)=([^?=&#]+)/g;
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        reg = /#([^?=&#]+)/;
        if (reg.test(this)) {
            obj['HASH'] = reg.exec(this)[1];
        }
        return obj;
    }

    //->格式化时间字符串的
    function myFormatTime(template) {
        template = template || '{0}年{1}月{2}日 {3}时{4}分{5}秒';
        var ary = this.match(/\d+/g);
        template = template.replace(/\{(\d)\}/g, function () {
            return ary[arguments[1]] || '00';
        });
        return template;
    }

    pro.queryURLParameter = queryURLParameter;
    pro.myFormatTime = myFormatTime;
}(String.prototype);

/*--LOADING--*/
var loadingRender = (function () {
    var fileAry = ["img/icon.png", "img/zf_concatAddress.png", "img/zf_concatInfo.png", "img/zf_concatPhone.png", "img/zf_course.png", "img/zf_course1.png", "img/zf_course2.png", "img/zf_course3.png", "img/zf_course4.png", "img/zf_course5.png", "img/zf_course6.png", "img/zf_cube1.png", "img/zf_cube2.png", "img/zf_cube3.png", "img/zf_cube4.png", "img/zf_cube5.png", "img/zf_cube6.png", "img/zf_cubeBg.jpg", "img/zf_cubeTip.png", "img/zf_emploment.png", "img/zf_messageArrow1.png", "img/zf_messageArrow2.png", "img/zf_messageChat.png", "img/zf_messageKeyboard.png", "img/zf_messageLogo.png", "img/zf_messageStudent.png", "img/zf_outline.png", "img/zf_phoneBg.jpg", "img/zf_phoneDetail.png", "img/zf_phoneListen.png", "img/zf_phoneLogo.png", "img/zf_return.png", "img/zf_style1.jpg", "img/zf_style2.jpg", "img/zf_style3.jpg", "img/zf_styleTip1.png", "img/zf_styleTip2.png", "img/zf_teacher1.png", "img/zf_teacher2.png", "img/zf_teacher3.jpg", "img/zf_teacher4.png", "img/zf_teacher5.png", "img/zf_teacher6.png", "img/zf_teacherTip.png"];

    var $loading = $('#loading'),
        $progress = $loading.children('.progress'),
        $span = $progress.children('span'),
        isLoad = 0;

    var delayTimer = null,
        delayNum = 0;

    //->加载逻辑处理
    function loadingFn() {
        //->计算SPAN的宽度
        isLoad++;
        $span.css('width', isLoad / fileAry.length * 100 + '%');

        //->已经加载完成,关闭当前LOADING层,展开PHONE层
        if (isLoad === fileAry.length) {
            if (page === 0) return;
            window.setTimeout(function () {
                window.clearInterval(delayTimer);
                $loading.css('display', 'none');
                phoneRender.init();
            }, 2000);
        }
    }

    return {
        init: function () {
            //->加载页面的时候，记录一个定时器，每隔一秒钟监听一次，如果超过10s，资源还没有加载完成，也强制进入后面的程序(主要是音频加载过慢)
            //delayTimer = window.setInterval(function () {
            //    if (delayTimer > 10) {
            //        window.clearInterval(delayTimer);
            //        $span.css('width', '100%');
            //        if (page === 0) return;
            //        $loading.css('display', 'none');
            //        phoneRender.init();
            //        return;
            //    }
            //    delayNum++;
            //}, 1000);

            //->开始预加载资源文件
            $loading.css('display', 'block');
            $.each(fileAry, function (index, item) {
                var reg = /\.([a-zA-Z0-9]+)/i,
                    suffix = reg.exec(item)[1].toUpperCase();
                if (suffix === 'MP3') {
                    var oAudio = new Audio();
                    oAudio.src = item;
                    oAudio.onloadedmetadata = loadingFn;
                } else {
                    var oImg = new Image;
                    oImg.src = item;
                    oImg.onload = loadingFn;
                }
            });
        }
    }
})();

/*--PHONE--*/
var phoneRender = (function () {
    var $phone = $('#phone'),
        $time = $phone.children('.time'),
        $listen = $phone.children('.listen'),
        $listenSpan = $listen.children('span'),
        $detail = $phone.children('.detail'),
        $detailSpan = $detail.children('span');

    var bellAudio = $('#bell')[0],
        sayAudio = $('#say')[0],
        musicTimer = null;

    //->处理音频时间
    function formatTime(time) {
        var second = Math.floor(time),
            minute = Math.floor(time / 60);
        second < 10 ? second = '0' + second : null;
        minute < 10 ? minute = '0' + minute : null;
        return minute + ':' + second;
    }

    //->关闭当前的PHONE页面
    function closePhone() {
        if (page === 1) return;
        $phone.css('transform', 'translateY(' + document.documentElement.clientHeight + 'px)').on('webkitTransitionEnd', function () {
            $phone.css('display', 'none');
            messageRender.init();
        });
    }

    return {
        init: function () {
            $phone.css('display', 'block');
            bellAudio.play();

            //->点击接听按钮
            var listenFn = function () {
                $listen.css('display', 'none');
                $detail.css('transform', 'translateY(0)');

                //->音频和时间的处理
                bellAudio.pause();
                sayAudio.play();
                $time.html('00:00');
                sayAudio.addEventListener('canplay', function () {
                    $time.html(formatTime(sayAudio.currentTime));
                    musicTimer = window.setInterval(function () {
                        $time.html(formatTime(sayAudio.currentTime));
                        if (sayAudio.currentTime === sayAudio.duration) {
                            closePhone();
                            window.clearInterval(musicTimer);
                        }
                    }, 1000);
                });
            };
            lx === 100 ? $listenSpan.click(listenFn) : $listenSpan.singleTap(listenFn);

            //->点击了解详情
            var detailFn = function () {
                window.clearInterval(musicTimer);
                sayAudio.pause();
                closePhone();
            };
            lx === 100 ? $detailSpan.click(detailFn) : $detailSpan.singleTap(detailFn);
        }
    }
})();

/*--MESSAGE--*/
var messageRender = (function () {
    var $message = $('#message'),
        musicAudio = $('#music')[0],
        $messageList = $message.find('li'),
        $keyboard = $message.children('.keyboard'),
        $tip = $keyboard.children('.tip'),
        $submit = $keyboard.children('.submit');

    var step = -1,
        count = $messageList.length,
        autoTimer = null,
        interval = 1500,
        bounceTop = 0,
        textMoveTimer = null;

    //->文字打印机
    function textMove() {
        $keyboard.off('webkitTransitionEnd', textMove);
        var tipText = '都学了啊，可我还是找不到工作!',
            n = -1,
            result = '';
        $tip.css('display', 'block');
        textMoveTimer = window.setInterval(function () {
            n++;
            result += tipText[n];
            $tip.html(result);

            //->结束
            if (n >= tipText.length - 1) {
                window.clearInterval(textMoveTimer);
                //->提交操作
                var submitFn = function () {
                    $tip.html('').parent().css('transform', 'translateY(3.7rem)');
                    autoMove();
                };
                $submit.css('display', 'block');
                lx === 100 ? $submit.click(submitFn) : $submit.singleTap(submitFn);
            }
        }, 100);
    }

    //->会话
    function autoMove() {
        autoTimer = window.setInterval(function () {
            step++;
            var $cur = $messageList.eq(step);
            $cur.css({
                opacity: 1,
                transform: 'translateY(0rem)'
            });

            //->前三个展示完成：开始模拟输入效果
            if (step === 2) {
                window.clearInterval(autoTimer);
                $keyboard.css('transform', 'translateY(0)');
                $keyboard.on('webkitTransitionEnd', textMove);
            }

            //->超过第三个,消息列表向上移动一条消息+10px
            if (step >= 3) {
                bounceTop -= $cur[0].offsetHeight + 10;
                $cur.parent().css({
                    transform: 'translateY(' + bounceTop + 'px)'
                });
            }

            //->最后一个结束:延迟1S进入魔方页面
            if (step >= count - 1) {
                window.clearInterval(autoTimer);
                if (page === 2) return;
                musicAudio.pause();
                window.setTimeout(function () {
                    $message.css('display', 'none');
                    cubeRender.init();
                }, interval);
            }
        }, interval);
    }

    return {
        init: function () {
            $message.css('display', 'block');
            musicAudio.play();

            //->开始会话列表
            autoMove();
        }
    }
})();

/*--CUBE--*/
$(document).on('touchmove', function (ev) {
    ev.preventDefault();
});
var cubeRender = (function () {
    var $cube = $('#cube'),
        $box = $cube.children('.box'),
        $boxList = $box.children('span');

    //->计算是否滑动
    function isSwipe(changeX, changeY) {
        return Math.abs(changeX) > 30 || Math.abs(changeY) > 30;
    }

    //->开始滑动
    function start(ev) {
        var point = ev.touches[0];
        $(this).attr({
            strX: point.clientX,
            strY: point.clientY,
            changeX: 0,
            changeY: 0
        });
    }

    //->滑动中
    function move(ev) {
        var point = ev.touches[0];
        var changeX = point.clientX - $(this).attr('strX'),
            changeY = point.clientY - $(this).attr('strY');
        $(this).attr({
            changeX: changeX,
            changeY: changeY
        });
    }

    //->滑动结束
    function end(ev) {
        var rotateX = parseFloat($(this).attr('rotateX')),
            rotateY = parseFloat($(this).attr('rotateY')),
            changeX = parseFloat($(this).attr('changeX')),
            changeY = parseFloat($(this).attr('changeY'));
        if (!isSwipe(changeX, changeY)) return;
        rotateX = rotateX - changeY / 3;
        rotateY = rotateY + changeX / 3;
        $(this).attr({
            rotateX: rotateX,
            rotateY: rotateY
        }).css({
            transform: 'scale(0.6) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)'
        });
    }

    return {
        init: function () {
            $cube.css('display', 'block');

            //->控制魔方旋转
            if (lx === 100) {
                $box.attr({
                    rotateX: -35,
                    rotateY: 45,
                    changeX: 0,
                    changeY: 0
                });
                var mm = function (ev) {
                    var point = ev;
                    var changeX = point.clientX - $box.attr('strX'),
                        changeY = point.clientY - $box.attr('strY');
                    $box.attr({
                        changeX: changeX,
                        changeY: changeY
                    });
                };
                var up = function () {
                    var rotateX = parseFloat($box.attr('rotateX')),
                        rotateY = parseFloat($box.attr('rotateY')),
                        changeX = parseFloat($box.attr('changeX')),
                        changeY = parseFloat($box.attr('changeY'));
                    if (!isSwipe(changeX, changeY)) return;
                    $boxList.off('click', boxFn);
                    rotateX = rotateX - changeY / 3;
                    rotateY = rotateY + changeX / 3;
                    $box.attr({
                        rotateX: rotateX,
                        rotateY: rotateY
                    }).css({
                        transform: 'scale(0.6) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)'
                    });
                    $(document).off('mousemove', mm);
                    $(document).off('mouseup', up);
                };
                var down = function (ev) {
                    $boxList.on('click', boxFn)
                    $box.attr({
                        strX: ev.clientX,
                        strY: ev.clientY
                    });
                    $(document).on('mousemove', mm);
                    $(document).on('mouseup', up);
                };
                $box.on('mousedown', down);
            } else {
                $box.attr({
                    rotateX: -35,
                    rotateY: 45
                }).on('touchstart', start).on('touchmove', move).on('touchend', end);
            }


            //->每一面点击
            var boxFn = function () {
                var index = $(this).index();
                $cube.css('display', 'none');
                swiperRender.init(index + 1);
            };
            lx === 100 ? $boxList.on('click', boxFn) : $boxList.singleTap(boxFn);
        }
    }
})();

/*--SWIPER--*/
var swiperRender = (function () {
    var $swiper = $('#swiper'),
        $makisu = $swiper.find('.makisu'),
        $return = $swiper.children('.return'),
        $cube = $('#cube');

    return {
        init: function (index) {
            index = index || 1;
            $swiper.css('display', 'block');

            //->返回操作
            var returnFn = function () {
                $swiper.css('display', 'none');
                $cube.css('display', 'block');
            };
            lx === 100 ? $return.click(returnFn) : $return.singleTap(returnFn);

            //->初始化SWIPER
            var mySwiper = new Swiper('.swiper-container', {
                loop: true,
                effect: 'coverflow',
                onTransitionEnd: function (example) {
                    var slideAry = example.slides,
                        curIn = example.activeIndex,
                        total = slideAry.length,
                        targetId = 'page';

                    //->计算PAGE ID
                    switch (curIn) {
                        case 0:
                            targetId += total - 2;
                            break;
                        case (total - 1):
                            targetId += 1;
                            break;
                        default:
                            targetId += curIn;
                    }

                    //->第一页特殊处理
                    if (targetId === 'page1') {
                        //->展开3D折叠
                        $makisu.makisu({
                            selector: 'dd',
                            overlap: 0.6,
                            speed: 0.8
                        });
                        $makisu.makisu('open');
                    } else {
                        //->隐藏3D折叠
                        $makisu.makisu({
                            selector: 'dd',
                            overlap: 0.6,
                            speed: 0
                        });
                        $makisu.makisu('close');
                    }

                    //->设置ID
                    [].forEach.call(slideAry, function (item, index) {
                        if (curIn === index) {
                            if (item.id.indexOf('page') === -1) {
                                item.id = targetId;
                            }
                            return;
                        }
                        item.id = null;
                    });
                }
            });
            mySwiper.slideTo(index, 0);
        }
    }
})();

//->添加定向展示某一页的内容
var obj = window.location.href.queryURLParameter(),
    page = parseInt(obj['page']),
    lx = parseInt(obj['lx']);
page === 0 || isNaN(page) ? loadingRender.init() : null;
page === 1 ? phoneRender.init() : null;
page === 2 ? messageRender.init() : null;
page === 3 ? cubeRender.init() : null;
page === 4 ? swiperRender.init() : null;
if (lx === 100) {
    $('body').css('cursor', 'pointer');
}
