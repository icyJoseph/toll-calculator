import { localTime } from '../../utils';

/**
 * Given an array of dates, create intervals one a given length.
 * Dates which fall in between the intervals should not span a new interval
 *
 * Assumes that the dates are already sorted!
 *
 * @param dates - the array of dates
 * @param span  - interval span
 * @return Array [{start, end}, ...] - intervals of span length present in dates
 */
export default function intervalMaker(dates, span) {
  return dates.reduce((intervals, curr) => {
    // create the end of probable interval
    const start = localTime(curr);
    const asUnix = start.getTime();
    const afterSpanTime = new Date(asUnix + span);

    // if it is the first interval
    if (!intervals.length) {
      return [{ start, end: afterSpanTime }];
    }

    // otherwise, grab the last interval
    const [{ end }] = intervals.slice(-1);
    // and compare to where we currently are
    const inInterval = start < end; // is this the best comparisson?

    // if we are inside the interval, pass
    if (inInterval) {
      return intervals;
    }

    // otherwise add a new interval
    return intervals.concat([{ start, end: afterSpanTime }]);
  }, []);
}
