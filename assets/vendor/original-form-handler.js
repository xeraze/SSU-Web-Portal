let themeDir = wpData.theme_directory;

$('.send-form').click(function () {
    // console.log('click');
    let button = $(this);
    button.prop('disabled', true);
    button.addClass('disabled');
    let btnText = button.text();
    let form = button.closest('form');
    let phone = form.find('input[name=phone]');
    let maskPhone = form.find('.mask-phone');
    let maskPhoneVal = maskPhone.val();

    phone.val(maskPhoneVal.replace(/[^\d+]/g, '')); // очищаємо телефон від символів

    let gtm_phone = maskPhoneVal.replace(/[^\d+]/g, '');
    let gtm_phone_b64 = btoa(gtm_phone);

    // Проверяем наличие поля vacancy и vacancy_type
    let vacancyTypeInput = form.find('input[name="vacancy_type"]');
    let vacancyNameInput = form.find('input[name="vacancy_name"]');
    let status_type_input = form.find('input[name="status_type"]');
    let mobile_id_input = form.find('input[name="mobile_id"]');
    let militaryInput = form.find('input[name="military"]');

    let vacancy_type = vacancyTypeInput.length ? vacancyTypeInput.val() : '';
    let vacancy_name = vacancyNameInput.length ? vacancyNameInput.val() : '';
    let status_type = '';

    // Проверка радиобокса: если militaryInput это radio, берем выбранное значение
    let militaryVal = '';
    if (militaryInput.length) {
        // Если это radio-боксы
        if (militaryInput.is(':radio')) {
            militaryVal = form.find('input[name="military"]:checked').val() || '';
        } else {
            // input другого типа
            militaryVal = militaryInput.val();
        }
        if (militaryVal === 'yes') {
            status_type = 'Військовий';
        } else if (militaryVal === 'no') {
            status_type = 'Цивільний';
        }

    }

    let gtmData = {
        event: 'lead_form_success',
        status_type: status_type,
        vacancy_type: vacancy_type,
        vacancy_name: vacancy_name,
        mobile_id: gtm_phone_b64,
        form_location: window.location.href

    };

    status_type_input.val(status_type);
    mobile_id_input.val(gtm_phone_b64);

    console.log(gtmData);
    // window.dataLayer = window.dataLayer || [];
    // window.dataLayer.push(gtmData);

    let redirect = form.find('input[name="redirect_url"]').val();

    if (form[0].checkValidity()) {
        form.css('opacity', '.3');
        // button.text('Відправка');

        // Отправка на локальный обработчик
        $.ajax({
            url: themeDir + '/requests/handler_v2.php',
            type: 'post',
            dataType: 'json',
            data: form.serialize(),
            success: function (response) {
                
                if (response.status == 'error') {
                    alert(response.text);

                    form.css('opacity', '1');
                    form.addClass('was-validated');
                    button.prop('disabled', false);
                    button.removeClass('disabled');
                    // button.text(btnText);
                } else {
                    // Проверка наличия window.dataLayer и gtmData перед пушем


                    // window.dataLayer.push({
                    //     'event': 'formSuccess',
                    //     'formName': 'form',
                    // });

                    // Если все ок, то отправка на внешний обработчик
                    $.ajax({
                        url: 'https://nethunt.com/service/automation/hooks/6665ec5d0d527c0008ae4266',
                        type: 'post',
                        dataType: 'html',
                        data: form.serialize(),
                        success: function (response) {
                            form.css('opacity', '1');
                            form.removeClass('was-validated');
                            button.prop('disabled', false);
                            button.removeClass('disabled');
                            // button.text(btnText);

                            // Редирект на сенк
                            // if (redirect) {
                            //     window.location.href = redirect;
                            // }

                            if (typeof window.dataLayer !== 'undefined' && typeof gtmData !== 'undefined' && gtmData) {
                                window.dataLayer = window.dataLayer || [];
                                window.dataLayer.push(gtmData);

                                console.log(gtmData);
                            }

                            // shows thanks modal
                            $('.modal').modal('hide');
                            $('#order-success').modal('show');

                        },
                        error: function () {}
                    });
                }

                form[0].reset();

            },
            error: function () {}
        });
    } else {
        form.addClass('was-validated');
        button.prop('disabled', false);
        button.removeClass('disabled');
        // button.text(btnText);
    }
});


/*
// Блок приймає рядок, розбиває значення в рядку по знаку = і вертає новий об'єкт "ключ - значення"
const paramToObj = (string) => {
    return string.reduce((accum, item) => {
        item = item.split("=");
        accum[item[0]] = item[1];
        return accum;
    }, {});
};

const utmGetter = () => {
    const utm = {
        utm_source: "джерело кампанії",
        utm_medium: "тип трафіку",
        utm_campaign: "назва кампанії",
        utm_content: "ідентифікатор оголошення",
        utm_term: "ключове слово",
    };

    // Отримуємо значення пошукового рядка. Search - параметри
    const param = window.location.search.substr(1);
    if (param.indexOf("&") !== -1) {
        paramArr = window.location.search.substr(1).slice(0).split("&");
    } else {
        paramArr = window.location.search.substr(1).slice(0).split("&amp;");
    }

    let outFunction = {
        "сторінка": window.location.href,
        "сторінка відправки форми": document.location.href.split('?')[0]
    };
    const paramObj = paramToObj(paramArr);

    if (!paramArr[0]) {
        outFunction["тип трафіку"] = "Organic";
    } else {
        for (let key in paramObj) {
            if (utm[key]) {
                outFunction[utm[key]] = decodeURI(paramObj[key]);
            } else {
                outFunction[key] = decodeURI(paramObj[key]);
            }
        }
    }

    // додоаємо реферальне посилання
    const referFieldName = "Джерело переходу";
    const referLink = document.referrer;

    // Перевірки

    if (!localStorage.utmObj) {
        outFunction[referFieldName] = referLink;
        console.log(referFieldName, referLink);
        const utmObj = JSON.stringify(outFunction);
        localStorage.setItem('utmObj', utmObj);
    } else {
        const localStorageUtmObj = JSON.parse(localStorage.utmObj);
        localStorage.removeItem('utmObj');
        localStorageUtmObj['сторінка відправки форми'] = document.location.href;
        const utmObj = JSON.stringify(localStorageUtmObj);
        localStorage.setItem('utmObj', utmObj);
    }

    return JSON.parse(localStorage.utmObj);
};

// Вставляємо невидимі елементи у форму
const inputInserter = (obj) => {
    const forms = document.forms;
    for (const form of forms) {
        form.addEventListener('submit', () => {
            localStorage.removeItem('utmObj')
        })
        for (const key in obj) {
            const newInput = document.createElement('input');
            newInput.setAttribute('hidden', 'true');
            newInput.setAttribute('type', 'text');
            newInput.setAttribute('name', `${key}`);
            newInput.setAttribute('value', `${obj[key]}`);
            form.prepend(newInput);
        }
    }
}

inputInserter(utmGetter());*/