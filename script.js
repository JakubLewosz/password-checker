document.addEventListener('DOMContentLoaded', () => {
    // Odniesienia do elementów DOM
    const passwordInput = document.getElementById('password-input');
    const togglePassword = document.getElementById('toggle-password');
    const form = document.getElementById('password-form');
    
    // Odniesienia do paska siły
    const strengthContainer = document.getElementById('strength-container');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');
    
    // Odniesienia do wylistowanych wymagań
    const reqLength = document.getElementById('req-length');
    const reqLower = document.getElementById('req-lower');
    const reqUpper = document.getElementById('req-upper');
    const reqNumber = document.getElementById('req-number');
    const reqSpecial = document.getElementById('req-special');

    // Regexy do sprawdzania poszczególnych reguł
    const hasLower = /[a-z]/;
    const hasUpper = /[A-Z]/;
    const hasNumber = /[0-9]/;
    // Definicja znaku specjalnego: jakikolwiek znak, który nie jest literą ani cyfrą
    const hasSpecial = /[^A-Za-z0-9]/;

    // Obsługa ukrywania/pokazywania hasła z modyfikacją ikony
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Zmiana ikonki Phosphor
        togglePassword.innerHTML = type === 'password' ? 
            '<i class="ph ph-eye"></i>' : 
            '<i class="ph ph-eye-slash"></i>';
    });

    // Validacja dynamiczna (weryfikacja na bieżąco, aby zaznaczać wymagania (x -> checkmark))
    passwordInput.addEventListener('input', () => {
        const val = passwordInput.value;
        
        // Aktualizacja UI na bieżąco dla Checkmarków
        updateReqUI(reqLength, val.length >= 8 && val.length <= 20);
        updateReqUI(reqLower, hasLower.test(val));
        updateReqUI(reqUpper, hasUpper.test(val));
        updateReqUI(reqNumber, hasNumber.test(val));
        updateReqUI(reqSpecial, hasSpecial.test(val));
        
        // Ukrycie paska przy edycji, jeżeli użytkownik znowu zaczął pisać
        strengthContainer.classList.remove('active');
    });

    // Przesłuchujemy formularz na zdarzenie zatwierdzenia / wciśnięcia przycisku
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Zatrzymaj klasyczne wysyłanie formularza i przeładownie strony
        
        const val = passwordInput.value;
        
        // Ponowne sprawdzenie bazowych wymagań
        const meetsLength = val.length >= 8 && val.length <= 20;
        const meetsLower = hasLower.test(val);
        const meetsUpper = hasUpper.test(val);
        const meetsNumber = hasNumber.test(val);
        const meetsSpecial = hasSpecial.test(val);

        // Zapytanie o kompletność przed sprawdzeniem bonusów i wyświtlaniem paska siły
        if (!(meetsLength && meetsLower && meetsUpper && meetsNumber && meetsSpecial)) {
            // Jeżeli brakuje czegoś podstawowego
            strengthContainer.classList.remove('active');
            
            // Wizualne ostrzeżenie potrząśnięcia boxem i dodania czerwonej obwódki na sekundę
            const reqBox = document.querySelector('.requirements-box');
            reqBox.classList.add('shake');
            setTimeout(() => reqBox.classList.remove('shake'), 400); // 400ms na czas trwania animacji z css
            return;
        }

        // --- Hasło wstępnie POPRAWNE (spełnia wymogi). Rozpoczyna się proces ewaluacji i punktacji wg dokumentacji. ---
        let points = 0;
        
        // +1pkt: powyżej 12 znaków (czyli min. 13 znaków)
        if (val.length > 12) {
            points += 1;
        }
        
        // +1pkt: powyżej 2 znaki specjalne (czyli min. 3)
        // Usuwamy wszystko co jest literą lub cyfrą i sprawdzamy długość stringa
        const numSpecials = val.replace(/[A-Za-z0-9]/g, '').length;
        if (numSpecials > 2) {
            points += 1;
        }
        
        // +1pkt: powyżej 2 liczby (czyli min. 3)
        const numDigits = val.replace(/[^0-9]/g, '').length;
        if (numDigits > 2) {
            points += 1;
        }
        
        // Wyświetlenie wyniku na ekranie
        displayFinalStrength(points);
    });

    // Pomocnicza funkcja do aktualizacji UI wymagań z kropkami
    function updateReqUI(el, isValid) {
        const icon = el.querySelector('i');
        if (isValid) {
            el.classList.add('valid');
            icon.className = 'ph-fill ph-check-circle'; // Zaznaczony haczyk
        } else {
            el.classList.remove('valid');
            icon.className = 'ph ph-circle'; // Pusty okrąg
        }
    }

    // Pomocnicza funkcja do rendrowania paska z wynikiem
    function displayFinalStrength(points) {
        // Kontener otrzymuje specjalną klasę, która go ujawni poprzez animację CSS
        strengthContainer.classList.add('active');
        
        let percentage = 0;
        let color = '';
        let text = '';
        let iconMarkup = '';
        
        // Rozdzielenie statusów względem punktów, wedle wytycznych i Twojego doprecyzowania ("bardzo słabe")
        switch (points) {
            case 0:
                percentage = 25;
                color = 'var(--strength-0)'; // Czerwony
                iconMarkup = '<i class="ph-fill ph-warning-circle"></i>';
                text = 'Bardzo słabe';
                break;
            case 1:
                percentage = 50;
                color = 'var(--strength-1)'; // Pomarańczowy
                iconMarkup = '<i class="ph-fill ph-warning"></i>';
                text = 'Słabe';
                break;
            case 2:
                percentage = 75;
                color = 'var(--strength-2)'; // Zielony (bazowy)
                iconMarkup = '<i class="ph-fill ph-check-circle"></i>';
                text = 'Średnie';
                break;
            case 3:
                percentage = 100;
                color = 'var(--strength-3)'; // Jasno zielony (świetny)
                iconMarkup = '<i class="ph-fill ph-shield-check"></i>';
                text = 'Silne';
                break;
        }
        
        // Animowanie i modyfikacja paska przy pomocy zmiennych Inline CSS
        // Zastosowałem setTimeout by najpierw aktywował się slideUpFade,
        // a chwilkę po nim wystartowała fizyczna i atrakcyjna animacja paska
        setTimeout(() => {
            strengthBar.style.width = percentage + '%';
            strengthBar.style.backgroundColor = color;
        }, 50);

        strengthText.innerHTML = `${iconMarkup} Siła hasła: ${text}`;
        strengthText.style.color = color;
    }
});
