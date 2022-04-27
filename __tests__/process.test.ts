import {removeOldEntries} from '../src/process'
import {expect, test} from '@jest/globals'

test('current entries should be remained', async () => {
  const feedMap = {
    givenId: {
      id: 'givenId',
      created: new Date().getTime(),
      content_text: 'givenBody',
      url: 'givenUrl',
      title: 'givenTitle'
    }
  }

  expect(removeOldEntries(feedMap, 1)).toEqual(feedMap)
})

test('created older then retention time, should be removed', async () => {
  const DAY_IN_MS = 86400000
  const ThreeDaysInMs = DAY_IN_MS * 3

  const feedMap = {
    givenId: {
      id: 'givenId',
      created: new Date().getTime() - ThreeDaysInMs,
      content_text: 'givenBody',
      url: 'givenUrl',
      title: 'givenTitle'
    }
  }
  expect(removeOldEntries(feedMap, 1)).toEqual({})
})

test('created with invalid date should be removed', async () => {
  const DAY_IN_MS = 86400000
  const ThreeDaysInMs = DAY_IN_MS * 3

  const feedMap = {
    givenId: {
      id: 'givenId',
      created: 0,
      content_text: 'givenBody',
      url: 'givenUrl',
      title: 'givenTitle'
    }
  }
  expect(removeOldEntries(feedMap, 1)).toEqual({})
})
