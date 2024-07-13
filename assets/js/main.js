document.addEventListener('DOMContentLoaded', () => {

    let showModal = () => {};

    // Модальное окно
    (function () {
        const modal = document.querySelector('.rc-modal');
        if (!modal) return;

        const modalBackground = document.querySelector('.rc-modal_background');
        if (!modalBackground) return;
        
        const closeModalBtn = document.querySelector('.rc-modal_close');
        if (!closeModalBtn) return;

        showModal = () => {
            document.body.style.overflow = 'hidden';
            modal.style.display = 'flex';
    
            setTimeout(() => {
                modal.classList.add('rc-modal__shown');
            }, 10);
        }

        modalBackground.onclick = closeModalBtn.onclick = () => {
            modal.classList.remove('rc-modal__shown');
    
            setTimeout(() => {
                modal.style.display = null;
                document.body.style.overflow = null;
            }, 310);
        }
    })();
    

    // Валидация и отправка формы
    (function () {
        const feedbackForm = document.querySelector('#feedbackForm');
        if (!feedbackForm) return;
        
        const submitBtn = feedbackForm.querySelector('button[type="submit"]');
        if (!submitBtn) return;

        const fields = feedbackForm.querySelectorAll('input, textarea');

        // Правила валидации
        const validationRules = {
            name: {
                required: true,
                mask: null
            },
            email: {
                required: true,
                mask: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            },
            message: {
                required: true,
                mask: null
            },
            privacy: {
                required: true,
                mask: null
            }
        }

        // Демонстрация ошибки
        const showError = (field, errorText) => {
            const fieldContainer = field.parentElement;
            if (!fieldContainer) return;

            fieldContainer.classList.add(fieldContainer.dataset.classname + '__error');

            const errorTextElement = fieldContainer.querySelector('.rc-input_errorMessage');
            if (errorTextElement) {
                errorTextElement.textContent = errorText;
                errorTextElement.ariaHidden = false;
            }
        }

        // Если поле менялось, убираем ошибку до валидации
        fields.forEach(field => {
            field.onchange = () => {
                const fieldContainer = field.parentElement;
                if (!fieldContainer) return;

                fieldContainer.classList.remove(fieldContainer.dataset.classname + '__error');

                const errorTextElement = fieldContainer.querySelector('.rc-input_errorMessage');
                if (errorTextElement) errorTextElement.ariaHidden = true;
            }
        });

        // Валидация полей при клике на кнопку
        submitBtn.onclick = async (e) => {
            e.preventDefault();

            let valid = true;
            
            fields.forEach(field => {
                const rules = validationRules[field.name] ? validationRules[field.name] : {
                    required: false,
                    mask: null
                };

                if (rules.required) {
                    if (field.type !== 'checkbox' && field.type !== 'radio') {
                        if (field.value.length === 0) {
                            showError(field, 'Поле должно быть заполнено');
                            valid = false;
                        }
                    }
                    else  if (field.type === 'checkbox') {
                        if (!field.checked) {
                            showError(field, 'Поставьте галочку');
                            valid = false;
                        }
                    }
                    else {
                        if (!field.checked) {
                            showError(field, 'Необходимо сделать выбор');
                            valid = false;
                        }
                    }
                }

                if (rules.mask) {
                    if (!rules.mask.test(field.value)) {
                        showError(field, 'Поле заполнено не корректно');
                        valid = false;
                    }
                }
            });

            // Если всё ок, отправляем форму
            if (valid) {

                // Если бы это был прод
                if (false) {
                    try {
                        const formData = new FormData(feedbackForm);
                        const request = await fetch(feedbackForm.action, {
                            method: feedbackForm.method,
                            body: formData
                        });

                        const response = await request.json();

                        if (response.status === 'success') console.log('Форма отправлена!');
                        else console.log('Произошла ошибка при отправке формы...');
                    }
                    catch (err) {
                        console.log('Произошла ошибка при отправке формы...');
                    }
                }

                showModal();

                fields.forEach(field => {
                    field.value = '';
                    field.checked = false;
                })
            }
        }
    })();
});