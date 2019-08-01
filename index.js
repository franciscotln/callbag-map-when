import filter from 'callbag-filter';
import map from 'callbag-map';

const mapWhen = (f, m) => source => map(m)(filter(f)(source));

export default mapWhen;
