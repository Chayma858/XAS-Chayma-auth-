function generateSecureAdminPassword(length = 16) {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const allChars = uppercase + lowercase + numbers + special;
    
    // Use crypto for better randomness
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);
    
    let password = '';
    
    // Ensure at least one of each type
    password += uppercase[randomValues[0] % uppercase.length];
    password += lowercase[randomValues[1] % lowercase.length];
    password += numbers[randomValues[2] % numbers.length];
    password += special[randomValues[3] % special.length];
    
    // Fill the rest
    for (let i = 4; i < length; i++) {
        password += allChars[randomValues[i] % allChars.length];
    }
    
    // Shuffle
    password = password.split('').sort(() => {
        const shuffleArray = new Uint32Array(1);
        crypto.getRandomValues(shuffleArray);
        return (shuffleArray[0] % 2) ? 1 : -1;
    }).join('');
    
    return password;
}
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}
