import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import byYearHolidays, {
  getHolidaysForYear,
  holidaysURI,
  selectHolidays,
  removeHoursPadding,
} from '..';
import { holidays2017, holidays2018 } from './mock';

// This sets the mock adapter on the default instance
const mock = new MockAdapter(axios);
const apiKey = 'someSuperSecretStuff';
const testYear = '2018';
const anotherTestYear = '2017';

mock.onGet(holidaysURI(apiKey, testYear)).reply(200, {
  ...holidays2018,
});

mock.onGet(holidaysURI(apiKey, anotherTestYear)).reply(200, {
  ...holidays2017,
});

describe('holidaysAPI', () => {
  it('fetches the holidays2018', async () => {
    const results = await getHolidaysForYear(apiKey, testYear);
    expect(results).toEqual(['2018-01-01', '2018-01-06', '2018-01-13']);
  });
});

describe('selectHolidays', () => {
  const response = { data: { ...holidays2018 } };
  it('selects from the API response', () => {
    expect(selectHolidays(response)).toEqual(holidays2018.response.holidays);
  });
});

describe('removePadding', () => {
  const date = '2018-02-02 19:23:01';
  it('removes padding', () => {
    expect(removeHoursPadding({ date })).toEqual('2018-02-02');
  });
});

describe('byYearHolidays', () => {
  const years = ['2017', '2018'];
  it('get all holidays for the given years', async () => {
    const holidays = await byYearHolidays(apiKey, years);
    expect(holidays).toEqual([
      '2017-01-01',
      '2017-01-06',
      '2017-01-13',
      '2018-01-01',
      '2018-01-06',
      '2018-01-13',
    ]);
  });
});