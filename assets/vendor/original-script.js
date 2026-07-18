jQuery(document).ready(function () {

    // file name set from input type file
    let fileblocks = document.querySelectorAll('.file-select');

    fileblocks.forEach(function (fileblock) {
        let label = fileblock.querySelector('.file-label'),
            input = fileblock.querySelector('.file-input'),
            label_txt = label.querySelector('.label-txt'),
            labelVal = label_txt.innerHTML,
            warning = fileblock.querySelector('.invalid-feedback');

        input.addEventListener('change', function (e) {
            let file = this.files[0];
            let allowedExtensions = /(\.png|\.jpg|\.webp|\.pdf)$/i;

            if (file.size > 10485760) {
                warning.classList.add('d-block');
                this.value = "";
                label_txt.innerHTML = labelVal;
            } else if (!allowedExtensions.exec(file.name)) {
                warning.classList.add('d-block');
                this.value = "";
                label_txt.innerHTML = labelVal;
            } else {
                warning.classList.remove('d-block');
                let fileName = '';
                if (this.files && this.files.length > 1)
                    fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
                else
                    fileName = e.target.value.split('\\').pop();

                if (fileName)
                    label_txt.innerHTML = fileName;
                else
                    label_txt.innerHTML = labelVal;
            }
        });
    });

    // Робимо поле обовязковим, при його показі
    $('.foreign-modal .form-check .form-check-input').each(function () {
        let input = $(this);

        input.on('change', function () {

            $('.form-check-input[data-id]').each(function () {

                let inputTrigger = $(this).attr('data-id');

                if ($(this).is(':checked')) {
                    $('#' + inputTrigger).collapse('show');
                    $('#' + inputTrigger).find('.form-control').attr('required', 'required');
                } else {
                    // $('#' + inputTrigger).collapse('hide');
                    $('#' + inputTrigger).find('.form-control').removeAttr('required');
                    $('#' + inputTrigger).find('.form-control').val('');
                }
            });
        });
    });

    function isMobile() {
        return window.innerWidth < 768;
    }

    const blocks = document.querySelectorAll(".mobile-collapse");

    blocks.forEach((block, index) => {
        const targetContent = block.nextElementSibling;

        // Убедимся, что .block-mobile-content действительно следующий
        if (targetContent && targetContent.classList.contains("block-mobile-content")) {
            const collapseId = `collapse-${index}`;
            targetContent.setAttribute("id", collapseId);
            targetContent.classList.add("collapse"); // Bootstrap class

            block.setAttribute("data-bs-toggle", "collapse");
            block.setAttribute("data-bs-target", `#${collapseId}`);
            block.style.cursor = "pointer";

            // Обработка клика только на мобилке
            block.addEventListener("click", function (e) {
                if (isMobile()) {
                    const collapseEl = document.getElementById(collapseId);
                    const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseEl);
                    bsCollapse.toggle();

                    // Закрываем все остальные блоки
                    document.querySelectorAll(".block-mobile-content.collapse.show").forEach((openBlock) => {
                        if (openBlock.id !== collapseId) {
                            bootstrap.Collapse.getOrCreateInstance(openBlock).hide();
                        }
                    });
                }
            });
        }
    });

    $('.blured-txt').click(function () {
        $(this).toggleClass('active');
    });

    if ($('#order-modal').length) {
        const orderModalEl = document.getElementById('order-modal')
        orderModalEl.addEventListener('show.bs.modal', event => {
            let btnEl = $(event.relatedTarget);
            if (btnEl.data('vacancies')) {
                $('#order-modal').find('input[name="vacancy_name"]').val($.trim(btnEl.data('vacancies')));
                $('#order-modal').find('input[name="vacancy_type"]').val($.trim(btnEl.data('vac-type')));
           
            }
        })
    }

    // if ($('.page-template-foreign-en').length || $('.page-template-foreign').length) {
    //     $('.cl-btn').removeAttr('data-bs-toggle data-bs-target').attr('href', 'https://forms.gle/aZhQh7oXBt84Cgm87');
    // }

    if ($('.page-template-foreign-es,.page-template-foreign-en, .page-template-foreign').length) {
        $('.cl-btn').attr('data-bs-target', '#foreign-modal');
    }

    if ($('.page-template-bootcamp-en').length || $('.page-template-bootcamp').length) {
        $('.cl-btn').attr('data-bs-target', '#bootcamp-order');
    }

    if ($('html').attr('lang') === 'en-US' && !$('body').hasClass('page-template-test-week-new-en')) {
        $('.cl-btn').attr('data-bs-target', '#foreign-modal');
    }

    // if (!$.cookie('ab3Cookie')) {
    //     $(".c-cookie").addClass('active');
    // }

    // $('.c-cookie .accept-cookie').click(function (e) {
    //     e.preventDefault();
    //     $(this).parents('.c-cookie').removeClass('active');

    //     $.cookie('ab3Cookie', 1, {
    //         expires: 30,
    //         path: '/'
    //     });
    // });

    $('.send-fr').click(function () {
        let button = $(this);
        button.prop('disabled', true);
        button.addClass('disabled');

        let form = button.closest('form');
        let formFieldsData = new FormData(form[0]);

        let redirect = form.find('input[name="redirect"]').val();
        let thanks = form.find('input[name="thanks_modal"]').val();

        let actUrl = form.attr('action');

        if (form[0].checkValidity()) {
            form.css('opacity', '.3');

            $.ajax({
                url: actUrl,
                type: 'post',
                dataType: 'json',
                data: formFieldsData,
                contentType: false,
                cache: false,
                processData: false,
                success: function (response) {
                    form.css('opacity', '1');
                    form.addClass('was-validated');
                    button.prop('disabled', false);
                    button.removeClass('disabled');

                    if (response.status == 'error') {
                        alert(response.text);
                    } else {
                        if (redirect) {
                            window.location.href = redirect;
                        }

                        if (thanks) {
                            $('.modal').modal('hide');

                            setTimeout(function () {
                                $(thanks).modal('show');

                                setTimeout(function () {
                                    $(thanks).modal('hide');
                                }, 8000);
                            }, 150);
                        }
                    }
                },
                error: function () {}
            });
        } else {
            form.addClass('was-validated');
            button.prop('disabled', false);
            button.removeClass('disabled');
        }
    });

    $('.bootcamp-send-form').click(function (e) {
        e.preventDefault();
        let btn = $(this);
        let actUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScmG7A86vOvP6UJv8gj9l_gJn9R1RDP5Es66Sv3M983TJk2Bg/formResponse'; //берем из ссылки гугл формы
        let form = $(this).parents('form');
        let phone = form.find('input[name=phone]').val().replace(/[^\d+]/g, '');

        let gDataFIelds = {
            'entry.704169695': form.find('input[name=name]').val(),
            'entry.462538583': phone,
            'entry.157772350': form.find('input[name=http_referer]').val(),
        };

        if (form[0].checkValidity()) {
            $.ajax({
                type: "POST",
                url: actUrl,
                dataType: 'xml',
                data: gDataFIelds,
                success: function (data) {

                    it.prop('disabled', false);
                    it.removeClass('disabled');

                },
                error: function (data) {
                    // console.log('error');
                    if (data.status === 0) {
                        $(form)[0].reset();
                        $('.modal').modal('hide');
                        $('.bootcamp-success').modal('show');
                        // FB lead
                        fbq('track', 'SubmitApplication');
                    }
                }
            });

            form.removeClass('was-validated');

        } else {
            form.addClass('was-validated');
            btn.prop('disabled', false);
            btn.removeClass('disabled');
        }

    });

    if (window.innerWidth > 1199) {
        gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

        ScrollTrigger.normalizeScroll(true)

        // // create the scrollSmoother before your scrollTriggers
        const smoother = ScrollSmoother.create({
            content: ".page-content",
            smooth: 1.2, // how long (in seconds) it takes to "catch up" to the native scroll position
            effects: true, // looks for data-speed and data-lag attributes on elements
            smoothTouch: 0.2, // much shorter smoothing time on touch devices (default is NO smoothing on touch devices)
        });

        $('.modal').on('shown.bs.modal', function () {
            smoother.paused(true);
        });
        $('.modal').on('hidden.bs.modal', function () {
            smoother.paused(false);
        });
    }

    // $('.menu-item-has-children > a').click(function (e) {
    //     e.preventDefault();

    //     $(this).parent().find('.sub-menu').slideToggle();
    // });

    const cookieBanner = $('.cookie-banner');

    if (cookieBanner) {

        let toggleButton = cookieBanner.find('.content-toggle'),
            cookieContent = cookieBanner.find('.banner-content'),
            acceptBtn = cookieBanner.find('.accept-btn'),
            partAcceptBtn = cookieBanner.find('.part-accept-btn'),
            denyBtn = cookieBanner.find('.deny-btn'),
            cookieName = 'ab3_v_1';

        const ab3Cookie = $.cookie(cookieName);

        // скрываем баннер при загрузке
        if (ab3Cookie == undefined || ab3Cookie == '' || ab3Cookie == null) {
            cookieBanner.addClass('active');
        }

        toggleButton.click(function (e) {
            e.preventDefault();

            $(this).toggleClass('active');
            cookieContent.slideToggle();
        });

        // полное разрешение
        acceptBtn.click(function (e) {
            e.preventDefault();

            cookieBanner.removeClass('active');

            setConsent({
                necessary: true,
                analytics: true,
                personalization: true,
                marketing: true,
                ad_user_data: true,
                ad_personalization: true
            });

        });

        // частичное разрешение
        partAcceptBtn.click(function (e) {
            e.preventDefault();

            cookieBanner.removeClass('active');

            setConsent({
                necessary: true,
                analytics: false,
                personalization: false,
                marketing: false,
                ad_user_data: false,
                ad_personalization: false
            });

        });

        // запрет
        denyBtn.click(function (e) {
            e.preventDefault();

            cookieBanner.removeClass('active');

            setConsent({
                necessary: true,
                analytics: false,
                personalization: false,
                marketing: false,
                ad_user_data: false,
                ad_personalization: false
            });

        });

        function setConsent(consent) {
            let consentMode = {
                'ad_storage': consent.marketing ? "granted" : "denied",
                'analytics_storage': consent.analytics ? "granted" : "denied",
                'personalization_storage': consent.personalization ? "granted" : "denied",
                'functionality_storage': consent.necessary ? "granted" : "denied",
                'security_storage': consent.necessary ? "granted" : "denied",
                'ad_user_data': consent.ad_user_data ? "granted" : "denied",
                'ad_personalization': consent.ad_personalization ? "granted" : "denied",
            };

            gtag('consent', 'update', consentMode);

            let data = JSON.stringify(consentMode);

            $.cookie(cookieName, data, {
                expires: 30,
                path: '/'
            });

        }
    }

    if ($('.page-template-test-week-new').length || $('.page-template-test-week-new-en').length) {
        $('.header .cl-btn').attr('data-bs-target', '#test-order-modal');
    }

    let marquee = document.querySelectorAll('.marquee-inner');

    if (marquee.length) {
        marquee.forEach(function (el) {
            let innerBlocks = el.innerHTML,
                loopTimes = parseInt(el.dataset.loop),
                loopDefault = loopTimes ? loopTimes : 15;

            for (let i = 0; i < loopDefault; i++) {
                el.innerHTML += innerBlocks;
            }
        });
    }

    // Phone mask
    $('.mask-phone').each(function () {
        $(this).attr('pattern', "[^_]+");
    });
    $('.mask-phone').inputmask("+38 (999) 999 - 99 - 99");

    $('.modal .form-check').each(function (index) {
        let input = $(this).find('input'),
            label = $(this).find('label');

        input.attr('id', 'modal-check-' + index);
        label.attr('for', 'modal-check-' + index);
    });

    // Animations
    if ($('.wow').length) {
        wow = new WOW({
            boxClass: 'wow', // default
            animateClass: 'animated', // default
            offset: 150, // default
            mobile: true, // default
            // live: true // default
        })
        wow.init();
    }

    // включаем анимации после загрузки страницы
    $("body").removeClass("transition-preload-off");

    const swiperFindSlider = document.querySelector('.swiper-find-slider');

    if (swiperFindSlider) {
        const swiperFindSliderInst = new Swiper(swiperFindSlider, {
            slidesPerView: 1,
            spaceBetween: 0,
            autoplay: true,
            loop: true,
            speed: 1500,
            pagination: {
                el: '.find-slider-pagination',
                type: 'bullets',
                clickable: true,
            },
            navigation: {
                nextEl: '.find-slider-next',
                prevEl: '.find-slider-prev',
            },
        });
    }

    // Bootcamp slider
    const swiperBootcampPhotos = document.querySelector('.swiper-bootcamp-photos');

    if (swiperBootcampPhotos) {
        const swiperInfoInst = new Swiper(swiperBootcampPhotos, {
            slidesPerView: 'auto',
            spaceBetween: 20,

            keyboard: {
                enabled: true,
            },

            scrollbar: {
                el: ".bootcamp-photos-scrollbar",
                draggable: true,
                dragSize: 125
            },
        });
    }

    // Info slider
    const swiperInfo = document.querySelector('.swiper-info');

    if (swiperInfo) {
        const swiperInfoInst = new Swiper(swiperInfo, {
            slidesPerView: 'auto',
            spaceBetween: 20,

            keyboard: {
                enabled: true,
            },

            scrollbar: {
                el: ".info-scrollbar",
                draggable: true,
            },
        });
    }

    // Race slider
    const swiperRace = document.querySelector('.swiper-race');

    if (swiperRace) {
        const swiperRaceInst = new Swiper(swiperRace, {
            slidesPerView: 'auto',
            spaceBetween: 20,
            scrollbar: {
                el: ".race-scrollbar",
                draggable: true,
            },
        });
    }

    // Vacancies slider
    const swiperVacancies = document.querySelector('.swiper-vacancies');

    if (swiperVacancies && window.innerWidth > 767) {
        const swiperVacanciesInst = new Swiper(swiperVacancies, {
            slidesPerView: 'auto',
            spaceBetween: 10,
            // direction: 'vertical',
            // autoplay: true,
            // mousewheel: {
            //     releaseOnEdges: false,
            // },
            keyboard: {
                enabled: true,
            },
            // edgeSwipeThreshold: 10000,
            pagination: {
                el: '.vacancies-pagination',
                type: 'bullets',
                clickable: true,
            },
            scrollbar: {
                el: ".vacancies-scrollbar",
                draggable: true,
            },
        });


        // $(".page-template-vacancies").addClass("overflow-hidden");
        // window.scrollTo(0, 0);
        // let scrollOn = 0;

        // window.addEventListener('wheel', function (event) {
        //     if (swiperVacanciesInst.isEnd) {
        //         if (event.deltaY > 0 && $(window).scrollTop() < 1) {
        //             $('.vacancies-main').addClass('active');

        //             if (!scrollOn) {
        //                 scrollOn = 1;
        //                 setTimeout(() => {
        //                     $(".page-template-vacancies").removeClass("overflow-hidden");
        //                     window.scrollTo(0, 60);
        //                 }, 100);
        //             }

        //         } else if ($(window).scrollTop() < 10 && event.deltaY < 0) {
        //             $('.vacancies-main').removeClass('active');
        //         }
        //     }

        //     if ($(window).scrollTop() < 1) {
        //         scrollOn = 0;
        //         $(".page-template-vacancies").addClass("overflow-hidden");
        //     }

        // });


    }


    //моб.меню
    $('.menu-btn').click(function () {
        $('.mobile-menu, .menu-back').toggleClass('active');
    });

    // desktop menu toggle
    $('.desktop-toggle-btn').click(function () {
        $('.desktop-menu').toggleClass('active');
    });

    $(document).on('click', '.menu-back, .race-menu .menu-item a', function (e) {
        e.preventDefault();

        $('.menu-back').removeClass('active')
        $('.mobile-menu').removeClass('active');
    });

    /* Form Button Handlers */
    $('.send-ajax').click(function () {

        var it = $(this);
        var form = $(this).closest('form');
        var redirect = form.find('input[name="redirect"]').val();
        var thanks = form.find('input[name="thanks_modal"]').val();

        it.prop('disabled', true);
        it.addClass('disabled');

        if (form[0].checkValidity()) {
            var actUrl = form.attr('action');

            $.ajax({
                url: actUrl,
                type: 'post',
                dataType: 'html',
                data: form.serialize(),
                success: function (data) {

                    console.log('success');

                    setTimeout(function () {
                        $('.for-success').show(500);
                        setTimeout(function () {
                            $('.for-success').hide(500);
                        }, 3000);
                    });

                    it.prop('disabled', false);
                    it.removeClass('disabled');
                    $(form)[0].reset();
                },
                error: function () {}
            });

            form.removeClass('was-validated');

        } else {
            form.addClass('was-validated');
            it.prop('disabled', false);
            it.removeClass('disabled');
        }
    });

    $('.send').click(function () {
        var it = $(this);

        var form = $(this).closest('form');

        it.prop('disabled', true);
        it.addClass('disabled');

        if (form[0].checkValidity()) {
            console.log('success');

            form.removeClass('was-validated');
            form.submit();
        } else {
            form.addClass('was-validated');

            it.prop('disabled', false);
            it.removeClass('disabled');
        }
    });

    $(".go-to-block").click(function (e) {
        e.preventDefault();
        var target = $(this).data('target');

        $('html, body').animate({
            scrollTop: $(target).offset().top
        }, 400);
    });

});

$(window).on('load resize', function () {
    appendBlocks('.move-main-menu', 0, 1199, '.mobile-menu .for-menu');
    appendBlocks('.move-main-menu', 1199, 0, '.pc-main-menu');


    if ($('.patronage-finance').length) {
        $('.patronage-finance .block').each(function (index) {

            appendBlocks('.patronage-finance-block-' + (index + 1), 0, 767, '.block-mobile-content-' + (index + 1));
            appendBlocks('.patronage-finance-block-' + (index + 1), 767, 0, '.patronage-finance .block-' + (index + 1) + ' .block-content');
        });
    }


    //appendBlocks('.', 0, 0, '.');
});

function appendBlocks(block, windowMin, windowMax, appendTo) {
    var exists = $(appendTo).find(block)

    if (!exists.length) {
        if (windowMax == 0) {
            if ($(window).width() > windowMin) {
                $(block).appendTo($(appendTo));
            }
        } else {
            if ($(window).width() > windowMin && $(window).width() < windowMax) {
                $(block).appendTo($(appendTo));
            }
        }
    }
}

// Hide show menu on scroll
$(window).on('load resize', function () {
    let scrollPos = 0;
    const menu = $(window).width() > 1199 ? '.header' : '.menu-line';

    $(window).scroll(function () {
        let scrollTop = $(window).scrollTop();

        if (scrollTop >= 10) {
            $(menu).addClass('active');

            if (scrollTop < scrollPos) {
                $(menu).removeClass('hide-line');

            } else {
                $(menu).addClass('hide-line');
            }
            scrollPos = scrollTop;
        } else {
            $(menu).removeClass('active');
        }
    });

});

$(window).on('load', function () {
    // фіксуємо слова на першому екрані
    const moveBlock = document.querySelector('.move-block');
    const contentBlock = document.querySelector('.process-info');

    if ($(window).width() > 991 && moveBlock) {
        let moveTop = $(moveBlock).offset().top;
        let contentBlockWidth = $(moveBlock).outerWidth();
        let contentBlockTopOffset = $(moveBlock).attr('data-top') ? $(moveBlock).attr('data-top') : 0;

        $(moveBlock).css({
            maxWidth: contentBlockWidth
        });

        $(window).scroll(function () {
            let moveBlockHeight = $(moveBlock).outerHeight();
            let contentBlockHeight = $(contentBlock).outerHeight();
            let contentLength = contentBlockHeight - moveBlockHeight;
            let offsetNew = $(window).scrollTop() - moveTop;
            if ($(window).scrollTop() >= moveTop && $(window).scrollTop() <= moveTop + contentLength) {
                $(moveBlock).css({
                    top: parseInt(contentBlockTopOffset) + offsetNew + 'px'
                });


            } else {
                if ($(window).scrollTop() < moveTop) {
                    $(moveBlock).css({
                        top: 0,
                        // transition: '0.2s'
                    });
                } else {
                    $(moveBlock).css({
                        top: contentLength + 'px',
                        // transition: '0.2s'
                    });
                }
            }
        })
    }
});

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var players = new Array();

$(document).ready(function () {

    $(document).on('click', '.cl9-toggle-play', function () {
        var playBtn = $(this);
        var plBlock = playBtn.closest('.video-bl');
        var videoBlockId = plBlock.find('.embed-responsive-item').attr('id');

        playBtn.addClass('in-process');

        // Сначала останавливаем все плееры
        $(players).each(function () {
            let state = this.getPlayerState();

            if (state === 1) {
                this.pauseVideo();
            }

            $('#' + this.videoBlockId).closest('.video-bl').find('.cl9-toggle-play').removeClass('c-hide');
        });

        // Если плеер уже инициализирован
        if (plBlock.find('iframe').length) {
            $(players).each(function () {
                if (this.videoBlockId == videoBlockId) {
                    var state = this.getPlayerState();

                    if (state === 1) {
                        this.pauseVideo();
                        playBtn.removeClass('c-hide');
                    } else {
                        playBtn.addClass('c-hide');
                        this.playVideo();
                    }
                }
            });
            playBtn.removeClass('in-process');

            // Иначе инициализируем
        } else {
            $('.video-bl').addClass('pointer');

            var videoID = plBlock.data('video');

            var player = new YT.Player(videoBlockId, {
                playerVars: {
                    'controls': 0,
                    'showinfo': 0,
                    'rel': 0,
                    'autoplay': 0,
                    'playsinline': 1,
                },
                videoId: videoID,
                events: {
                    'onReady': onPlayerReady,
                },

            });

            player.videoBlockId = videoBlockId;

            players.push(player);

            function onPlayerReady() {

                plBlock.removeClass('pointer');
                setTimeout(function () {
                    $('.video-bl').removeClass('pointer');
                }, 1000);

                playBtn.removeClass('in-process');
                var state = player.getPlayerState();
                if (state === 1) {
                    player.pauseVideo();
                } else {
                    player.playVideo();
                    playBtn.addClass('c-hide');
                }
            }
        }
    });
});

function onYouTubeIframeAPIReady() {
    $('.video-bl').each(function (key) {

        let videoID = $(this).data('video');
        let bgImage = $(this).data('bg');
        let videoBlockId = 'player' + key;

        if (!videoID) {
            return false;
        }

        if (bgImage) {
            var bgImageUrl = bgImage;
        } else {
            var bgImageUrl = 'https://img.youtube.com/vi/' + videoID + '/maxresdefault.jpg';
        }

        $(this).html('<div class="ratio ratio-16x9"><div class="embed-responsive-item" id="' + videoBlockId + '"></div><div class="cl9-toggle-play" style="background-image: url(' + bgImageUrl + ')"><div class="play-icn"><svg width="125" height="84" viewBox="0 0 125 84" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="124.914" height="83.1895" rx="15" fill="#E53728"/><path d="M50.6797 61.3694V21.8203L82.8004 40.6532L50.6797 61.3694Z" fill="white"/></svg></div></div></div>');
    });
}