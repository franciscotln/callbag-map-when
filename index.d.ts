import { Source } from 'callbag';

declare const mapWhen: <I, O>(
  condition: (value: I) => boolean,
  transform: (value: I) => O) => (source: Source<I>
) => Source<O>;

export default mapWhen;
