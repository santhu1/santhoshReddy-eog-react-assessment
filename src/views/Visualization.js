import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Grid,
} from "@material-ui/core";
import { connect } from "react-redux";
import * as actions from "../store/actions";
import { useEffectOnce } from "react-use";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { LineChart, Line, XAxis, YAxis, Tooltip} from "recharts";
import api from "../store/api/index";
import WEATHER_CONST from "../constants/weather";

const animatedComponents = makeAnimated();

const Visualization = (props) => {
  const { onLoad, metrics, currentValue, subscribeUpdates } = props;
  const [selected, setSelected] = React.useState([]);
  useEffectOnce(() => {
    onLoad();
    subscribeUpdates();
  });
  const options = metrics.map((m) => ({ label: m, value: m }));
  const data = props.graphData;

  return (
      <Card>
        <CardHeader title="Visualization" subheader="Choose from the Input" />
        <CardContent style={{ minHeight: 500 }}>
          <Grid container>
            {selected.map((s, key) => (
              <Grid key={key} item xs={2}>
                <Card>
                  <CardHeader title={s} />
                  <CardContent>
                    <Typography variant="h3">{currentValue[s]}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Select
            options={options}
            components={animatedComponents}
            isMulti
            onChange={(event) => {
              setSelected(event ? event.map((item) => item.value) : []);
            }}
          />
          <LineChart
            width={800}
            height={500}
            data={data}
            margin={{ top: 30, right: 30, bottom: 5, left: 50 }}
          >
            {WEATHER_CONST.map(
              (element) =>
                selected.indexOf(element.dataKey) > -1 && (
                  <Line
                    type={element.type}
                    dot={element.dot}
                    activeDot={element.dot}
                    yAxisId={element.yAxisId}
                    dataKey={element.dataKey}
                    stroke={element.stroke}
                  />
                )
            )}

            {/* <LineChart
                  key={i}
                  style={style}
                  axis={metricSeries.atLast().get("unit")}
                  series={metricSeries}
                  column={["value"]}
                /> */}

            <XAxis dataKey="at" tickSize={10} />
            <YAxis yAxisId={0} unit="%" orientation="left" stroke="#070501" />
            <YAxis yAxisId={1} unit="PSI" orientation="left" stroke="#eab51c" />
            <YAxis yAxisId={2} unit="F" orientation="left" stroke="#FF0000" />

            <Tooltip />
          </LineChart>
        </CardContent>
      </Card>
  );
};

const mapDispatch = (dispatch) => ({
  onLoad: () => {
    dispatch({
      type: actions.FETCH_METRICS,
    });
  },
  subscribeUpdates: () => {
    api.subscribeMetricsData().then((sub) => {
      sub.subscribe(({ data }) => {
        dispatch({
          type: actions.METRICS_DATA_RECEIVED,
          metrics: data.newMeasurement,
        });
      });
    });
  },
  loadPastData: (metricName) => {
    dispatch({
      type: actions.FETCH_PAST_METRICS_DATA,
      metricName,
    });
  },
});

const mapState = (state) => ({
  metrics: state.metrics.metrics,
  graphData: state.metrics.graphData,
  currentValue: state.metrics.currentValue,
});

export default connect(mapState, mapDispatch)(Visualization);
