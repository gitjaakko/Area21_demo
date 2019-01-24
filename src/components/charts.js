import React, { Component } from 'react';
import { VictoryLine, VictoryChart, VictoryTheme, VictoryLegend } from 'victory-native';

class LineChart extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <VictoryChart scale={{x: 'time'}}>
        <VictoryLine {...this.props} x="time" y="value" />
      </VictoryChart>
    );
  }
}

export {
  LineChart
}
