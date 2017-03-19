import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

// worker Saga: will be fired on LAWS_INDEX_FETCH_REQUESTED actions
function* fetchLawsIndex(action) {
  try {
    // const result = yield call(axios.get, 'http://localhost:3000');
    const result = yield call(axios.get, 'http://www.bclaws.ca/civix/content/complete');
    // const result = yield call(axios.get, 'http://localhost:3000/graphiql?query=%7Byears%20%7B%0A%20%20name%2C%0A%20%20value%0A%7D%7D&operationName=null&variables=%7B%0A%20%20%22regionalDistrict%22%3A%20%22CAP%22%2C%0A%20%20%22year%22%3A%202016%0A%7D');
    // debugger
    yield put({type: "LAWS_INDEX_FETCH_SUCCEEDED", data: result.data});
  } catch (error) {
    debugger
    if (error.response) {
      // The request was made, but the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      yield put({type: "LAWS_INDEX_FAILED", response: error.response});
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
      yield put({type: "LAWS_INDEX_FAILED", message: error.message});
    }
  }
}

/*
 Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
 Allows concurrent fetches of user.
 */
function* bcLawsSaga() {
  yield takeEvery("LAWS_INDEX_FETCH_REQUESTED", fetchLawsIndex);
}

export default bcLawsSaga;