export default function escapeRegexMods(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
