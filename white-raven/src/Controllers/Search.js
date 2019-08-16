import escapeRegexMods from '../utils/escapeRegexMods';

function Search(props) {
    const queries = props.query.split(' ');
    let matches = props.data.map(obj =>
        queries.filter(query => {
            const q = escapeRegexMods(query);
            return Object.values(obj).join(' ').match(new RegExp(q, 'i'));
        }
    ));
    matches = matches.map((m, i) => {
        return {
            index: i,
            score: [0, ...m.filter(w => !props.exclude.includes(w.toLowerCase()))].reduce((t, w) => t + (w.length*(w.length+1)/2))
        }
    }).filter(m => m.score > 0).sort((a, b) => b.score - a.score).map(m => m.index);
    return matches;
}

export default Search;