function isBinary(N) {
    // Check if the number is greater than 1
    if (N <= 1) {
        return false;
    }
    
    // Convert the number to a string to check each digit
    const str = N.toString();
    
    // Check if all characters are '0' or '1'
    for (let i = 0; i < str.length; i++) {
        if (str[i] !== '0' && str[i] !== '1') {
            return false; // If any character is not '0' or '1', it's not a binary number
        }
    }
    
    return true; // All characters are '0' or '1', and the number is greater than 1
}

// Test cases
console.log(isBinary(1010)); // Output: true
console.log(isBinary(1234)); // Output: false
