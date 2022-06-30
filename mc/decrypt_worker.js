importScripts("aes2.js");
onmessage = function(e) {
    const { ciphertext, key } = e.data;
    
    const cipher = new AES(key);
    const _iv = Array.from(key.slice(0,16));
    const plaintext = ciphertext.slice(0);

    for(let i = 0; i < ciphertext.length; i += 1) {
        plaintext[i] ^= cipher.encrypt(_iv);
        _iv.shift()
        _iv.push(ciphertext[i]);
    }

    this.postMessage({
        plaintext: plaintext
    });
};