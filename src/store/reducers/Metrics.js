import * as actions from "../actions";

const initialState = {
  metrics: [],
  metricsData: {},
  graphData: [],
  currentValue: {
    tubingPressure: 0,
    casingPressure: 0,
    oilTemp: 0,
    flareTemp: 0,
    waterTemp: 0,
    injValveOpen: 0
  }
};

const metricsListReceived = (state, action) => {
  const { metrics } = action;
  return {
    ...state,
    metrics
  };
};

const pastThirtyMinitues = timeStamp => {
  let time = new Date(timeStamp);
  return time.getHours() + ":" + time.getMinutes();
};

const metricsDataReceived = (state, action) => {
  const newData = action.metrics;
  const { metric, at, value } = newData;
  const currentValue = { ...state.currentValue, [metric]: value };
  const { metricsData } = state;
  const graphData = Object.keys(metricsData).map(key => metricsData[key]);

  return {
    ...state,
    metricsData: {
      ...metricsData,
      [at]: {
        ...metricsData[at],
        [metric]: value,
        at: `${pastThirtyMinitues(at - 3600)}`
      }
    },
    graphData,
    currentValue
  };
};

const metricsPastDataReceived = (state, action) => {
  const { graphData, metricsData } = action;
  console.log(graphData);
  return {
    ...state,
    metricsData,
    graphData
  };
};

const handlers = {
  [actions.METRICS_RECEIVED]: metricsListReceived,
  [actions.METRICS_DATA_RECEIVED]: metricsDataReceived,
  [actions.PAST_METRICS_DATA_RECEIVED]: metricsPastDataReceived
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  if (typeof handler === "undefined") return state;
  return handler(state, action);
};
