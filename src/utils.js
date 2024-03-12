const formatPhone = (value) => {
    if (!value) return value;

    let phoneNumber = value.replace(/\D/g, ''); // Убираем все символы, кроме цифр

    if (!phoneNumber.match(/^[7-8]/)) {
        phoneNumber = phoneNumber.replace(/^[0-6]+/, ''); // Если первая цифра не 7 или 8, удаляем все цифры до 7 или 8
    }

    if (phoneNumber.length > 11) {
        phoneNumber = phoneNumber.slice(0, 11); // Ограничиваем количество цифр до 11
    }

    if (phoneNumber.startsWith('8')) {
        phoneNumber = '7' + phoneNumber.slice(1);
    } else if (!phoneNumber.startsWith('7')) {
        phoneNumber = phoneNumber;
    }

    if (phoneNumber.length <= 1) {
        return phoneNumber;
    } else if (phoneNumber.length <= 4) {
        return `+${phoneNumber}`;
    } else if (phoneNumber.length <= 7) {
        return `+${phoneNumber.slice(0, 1)} (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4)}`;
    } else if (phoneNumber.length <= 10) {
        return `+${phoneNumber.slice(0, 1)} (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7)}`;
    } else {
        return `+${phoneNumber.slice(0, 1)} (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7, 9)}-${phoneNumber.slice(9)}`;
    }
};

export {formatPhone}