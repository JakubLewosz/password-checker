# Password Strength Checker

Nowoczesny i responsywny weryfikator siły hasła zbudowany w czystym JavaScript, HTML i CSS (Glassmorphism design).

## Projekt zrealizowany według specyfikacji:

### Podstawowe wymagania (Walidacja):
- Długość: **min. 8 znaków, max. 20 znaków**
- Wymagane znaki: **mała litera, duża litera, liczba, znak specjalny**

### System punktacji siły hasła:
Algorytm przyznaje punkty za dodatkowe atrybuty bezpieczeństwa:
- **1 pkt** - powyżej 12 znaków
- **1 pkt** - powyżej 2 znaki specjalne
- **1 pkt** - powyżej 2 liczby

### Wyświetlanie siły hasła:
Na podstawie zdobytych punktów aplikacja klasyfikuje hasło jako:
- **0 pkt** - bardzo słabe
- **1 pkt** - słabe
- **2 pkt** - średnie
- **3 pkt** - silne

### Interfejs użytkownika (UI):
- Estetyczna strona z polem wpisywania hasła.
- Dynamiczne sprawdzanie wymagań w czasie rzeczywistym.
- Animowany pasek siły hasła wyświetlany po zatwierdzeniu formularza.

## Technologie:
- Pure JavaScript (ES6+)
- Vanilla CSS (Custom properties, modern animations)
- Semantic HTML5
- Phosphor Icons (do ikonek UI)
- Google Fonts (Outfit)

## Uruchomienie lokalne:
Wystarczy otworzyć plik `index.html` w dowolnej nowoczesnej przeglądarce internetowej.
