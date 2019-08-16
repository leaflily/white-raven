export default function escapeRegexMods(str) {
    const specialChars = ['+', '*', '?', '{', '}', '$', '(', ')', '[', ']', '^', '.'];
    var output = str;
    for (let char of specialChars) {
        output = output.replace(char, `\\${char}`);
    }
    return output
}
