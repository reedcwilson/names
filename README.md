# names

[![Build Status](https://travis-ci.org/reedcwilson/names.svg?branch=master)](https://travis-ci.org/reedcwilson/names)

A website to find useful information on names based on data from the Social
Security database.

## Setup

Follow the instructions found
[here](https://github.com/reedcwilson/ng-express-seed) to get up and running.

## API

The server in this project acts as a static file server and a REST service. All
API endpoints have the root `/api` path and the remainder of this document will
omit this portion of each endpoint.

### POST popular/

Performs a query for the most popular names. Using the provided parameters it
searches the Social Security Names database for matching names. The results
represent the popularity of the returned names over the entire provided year
range.

#### Resource URI

    http://names.reedcwilson.com/api/popular

| Resource      | Info |
| ------------- | ---- |
| Request Body  | JSON |
| Response Body | JSON |

#### Parameters

| Parameter    | Description |
| ------------ | ----------- |
| range *      | An array of two representing the range of years to search. The bounds of accepted years are: 1880-2014. **Example**: `[1950, 1975]` |
| number *     | The number of names to retrieve. **Example**: `5` |
| gender       | The gender that the names should match. Searches for combined if null. **Values**: `"M"`, `"F"`, `"B"`, `"C"`. "B" stands for both which will return a gender separated list. "C" stands for combined which will simply find the most common name regardless of gender |
| startsWith   | A string that the names should begin with to match. **Example** `re` |

_* required parameter_

#### Example Request

    {
        "range": [1900,2000],
        "number": 3,
        "gender": "F",
        "startsWith": "re"
    }

#### Example Response

    [
      {
        "name": "rebecca",
        "gender": "F",
        "count": 676863
      },
      {
        "name": "renee",
        "gender": "F",
        "count": 174559
      },
      {
        "name": "regina",
        "gender": "F",
        "count": 164418
      }
    ]
