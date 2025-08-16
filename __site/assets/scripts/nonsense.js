export function generateNonsenseWord(syllables) {
    const consonants = "bcdfghjklmnpqrstvwxyz";
    const vowels = "aeiou";
    const patterns = ["cv", "vc", "cvc", "vvc", "cvv", "v"];
    let word = "";
  
    for (let i = 0; i < syllables; i++) {

        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        for (const char of pattern) {
            if (char === "c") {
                word += consonants[Math.floor(Math.random() * consonants.length)];
            } else if (char === "v") {
                word += vowels[Math.floor(Math.random() * vowels.length)];
            }
        }
    }
    return word;
}

export function generateNonsensePhrase(words) {
    const phrase = [];
    for (let i = 0; i < words; i++) {
        phrase.push(generateNonsenseWord(Math.floor(Math.random() * 6 + 1)));
    }
    return phrase.join(" ");
}

export function generateNonsense() {
    const paragraphs = Math.floor(Math.random() * 5 + 1);
    const paragraph = [];
    for (let i = 0; i < paragraphs; i++) {
        const sentences = [];
        for (let j = 0; j < Math.floor(Math.random() * 10 + 3); j++) {
            sentences.push(generateNonsensePhrase(Math.floor(Math.random() * 20 + 5)));
        }
        paragraph.push(sentences.join(". ") + ".");
    }
    return paragraph.join("\n\n");
}

export function bark(syllables)
{
    const consonants = "rw";
    const vowels = "ao";
    const patterns = ["cvcc", "vcvv", "cvvvv", "cc", "cvvvvccvvvv", "vvcvcv", "cc", "ccccc"];
    let word = "";
  
    for (let i = 0; i < syllables; i++) {

        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        for (const char of pattern) {
            if (char === "c") {
                word += consonants[Math.floor(Math.random() * consonants.length)];
            } else if (char === "v") {
                word += vowels[Math.floor(Math.random() * vowels.length)];
            }
        }
    }
    return word;
}

export function puppygirl(words)
{
    const phrase = [];
    for (let i = 0; i < words; i++) {
        phrase.push(bark(Math.floor(Math.random() * 6 + 1)));
    }
    return phrase.join(" ") + " \n-puppygirl barks";
}