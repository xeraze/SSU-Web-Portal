const WEBHOOK_PROXY_URL = "https://xdevs-application-webhook.xeraze-official.workers.dev";

jQuery(document).ready(function ($) {
    function placeMenu() {
        const $menu = $("#header-main-menu");
        if (!$menu.length) return;
        if (window.innerWidth < 1200) {
            $(".mobile-menu .for-menu").append($menu);
        } else {
            $(".pc-main-menu").append($menu);
            $(".mobile-menu, .menu-back, .desktop-menu").removeClass("active");
        }
    }
    placeMenu();
    $(window).on("resize", placeMenu);

    $(".menu-btn").on("click", function () {
        $(".mobile-menu, .menu-back").toggleClass("active");
        $("body").toggleClass("menu-open");
    });

    $(document).on("click", ".menu-back, .mobile-menu .menu-item a", function () {
        $(".menu-back, .mobile-menu").removeClass("active");
        $("body").removeClass("menu-open");
    });

    $(".desktop-toggle-btn").on("click", function () {
        $(".desktop-menu").toggleClass("active");
    });

    $(document).on("click", ".desktop-menu .menu-item a", function () {
        $(".desktop-menu").removeClass("active");
    });

    let scrollPos = 0;
    $(window).on("scroll", function () {
        const menu = window.innerWidth >= 1200 ? $(".header") : $(".menu-line");
        const scrollTop = $(window).scrollTop();

        if (scrollTop > 10) {
            menu.addClass("active");
            if (scrollTop < scrollPos) {
                menu.removeClass("hide-line");
            } else {
                menu.addClass("hide-line");
            }
            scrollPos = scrollTop;
        } else {
            menu.removeClass("active hide-line");
        }
    });

    if ($.fn.inputmask) {
        $(".mask-phone").inputmask("+38 (999) 999 - 99 - 99");
        $(".mask-phone").attr("pattern", "[^_]+");
    }

    if (typeof WOW !== "undefined") {
        new WOW({
            boxClass: "wow",
            animateClass: "animated",
            offset: 150,
            mobile: true
        }).init();
    }

    const swiperEl = document.querySelector(".swiper-find-slider");
    if (swiperEl && typeof Swiper !== "undefined") {
        new Swiper(swiperEl, {
            slidesPerView: 1,
            spaceBetween: 0,
            autoplay: { delay: 5000, disableOnInteraction: false },
            loop: true,
            speed: 1500,
            pagination: {
                el: ".find-slider-pagination",
                clickable: true
            }
        });
    }

    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined" && typeof ScrollSmoother !== "undefined") {
        if (window.innerWidth > 1199) {
            gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
            try {
                ScrollTrigger.normalizeScroll(true);
                const smoother = ScrollSmoother.create({
                    content: "#smooth-content",
                    wrapper: "#smooth-wrapper",
                    smooth: 1.2,
                    effects: true,
                    smoothTouch: 0.2
                });
                $(".modal").on("shown.bs.modal", function () {
                    smoother.paused(true);
                });
                $(".modal").on("hidden.bs.modal", function () {
                    smoother.paused(false);
                });
            } catch (e) {
                console.warn("ScrollSmoother skipped:", e);
            }
        }
    }

    function digitsPhone(masked) {
        return (masked || "").replace(/\D/g, "");
    }

    function buildPayload(data) {
        return {
            embeds: [{
                title: "Нова заявка на службу в СБУ",
                color: 0xF7931E,
                fields: [
                    { name: "Прізвище", value: data.lastname || "—", inline: true },
                    { name: "Ім'я", value: data.firstname || "—", inline: true },
                    { name: "По батькові", value: data.middlename || "—", inline: true },
                    { name: "Телефон", value: data.phone || "—", inline: true },
                    { name: "Telegram", value: data.telegram || "—", inline: true },
                    { name: "Discord", value: data.discord || "—", inline: true },
                    { name: "Військовослужбовець зараз?", value: data.military || "—", inline: true }
                ],
                footer: { text: "СБУ — Анкета кандидата" },
                timestamp: new Date().toISOString()
            }]
        };
    }

    async function sendApplication(payload, $status, onSuccess) {
        $status.removeClass("error").text("Надсилання...");
        try {
            const res = await fetch(WEBHOOK_PROXY_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                $status.text("");
                onSuccess();
            } else {
                $status.addClass("error").text("Не вдалося надіслати заявку. Спробуйте ще раз.");
            }
        } catch (err) {
            $status.addClass("error").text("Немає з'єднання з сервером. Перевірте інтернет.");
        }
    }

    $("#applicationForm").on("submit", function (e) {
        e.preventDefault();
        const form = this;

        if (!form.checkValidity()) {
            $(form).addClass("was-validated");
            $("#formStatus").addClass("error").text("Заповніть усі обов'язкові поля коректно.");
            return;
        }

        const phoneMasked = $("#f-phone").val();
        const phone = digitsPhone(phoneMasked);
        if (phone.length < 12) {
            $("#formStatus").addClass("error").text("Вкажіть коректний номер телефону.");
            return;
        }

        const $btn = $("#submitBtn");
        $btn.prop("disabled", true);

        const payload = buildPayload({
            lastname: $("#f-lastname").val().trim(),
            firstname: $("#f-firstname").val().trim(),
            middlename: $("#f-middlename").val().trim(),
            phone: phoneMasked,
            telegram: $("#f-telegram").val().trim(),
            discord: $("#f-discord").val().trim(),
            military: $('input[name="military"]:checked').val()
        });

        sendApplication(payload, $("#formStatus"), function () {
            $("#applicationForm").hide();
            $("#formSuccess").addClass("show");
        }).finally(function () {
            $btn.prop("disabled", false);
        });
    });

    $("#modalApplicationForm").on("submit", function (e) {
        e.preventDefault();
        const form = this;
        const $form = $(form);

        if (!form.checkValidity()) {
            $form.addClass("was-validated");
            $("#modalFormStatus").addClass("error").text("Заповніть усі обов'язкові поля коректно.");
            return;
        }

        const phoneMasked = $form.find(".f-phone").val();
        const phone = digitsPhone(phoneMasked);
        if (phone.length < 12) {
            $("#modalFormStatus").addClass("error").text("Вкажіть коректний номер телефону.");
            return;
        }

        const $btn = $form.find('button[type="submit"]');
        $btn.prop("disabled", true);

        const payload = buildPayload({
            lastname: $form.find(".f-lastname").val().trim(),
            firstname: $form.find(".f-firstname").val().trim(),
            middlename: $form.find(".f-middlename").val().trim(),
            phone: phoneMasked,
            telegram: $form.find(".f-telegram").val().trim(),
            discord: $form.find(".f-discord").val().trim(),
            military: $form.find('input[name="military-m"]:checked').val()
        });

        sendApplication(payload, $("#modalFormStatus"), function () {
            const modalEl = document.getElementById("order-modal");
            const successEl = document.getElementById("order-success");
            bootstrap.Modal.getOrCreateInstance(modalEl).hide();
            bootstrap.Modal.getOrCreateInstance(successEl).show();
            form.reset();
            $("#f-agree-m").prop("checked", true);
        }).finally(function () {
            $btn.prop("disabled", false);
        });
    });
});
