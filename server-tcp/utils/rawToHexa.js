function rawToHexa(message){
    const bytes = Buffer.from(message, 'utf-8');
    const hexValues = [];
    for (const byte of bytes) {
        hexValues.push(byte.toString(16).padStart(2, '0'));
    }
    return hexValues.join('')
}

module.exports = {
    rawToHexa
}