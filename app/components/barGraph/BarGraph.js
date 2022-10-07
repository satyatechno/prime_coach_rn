import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../constants/Colors";
import Svg from "react-native-svg";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
} from "victory-native";
import { DEV_WIDTH } from "../../constants/DeviceDetails";
import { POP_REGULAR } from "../../constants/Fonts";
import { findSize } from "../../utils/helper";
import CustomButton from "../customButton/CustomButton";

const BarGraph = ({ graphData, x, y, angle = 90 }) => {
  // console.log('dataaaaGrafff', props?.graphData);
  let DATA = [...graphData];
  DATA.map((x) => {
    if (x?.name?.length > 10) x.name = x.name.slice(0, 8) + "...";
  });
  const [index, setIndex] = useState(0);
  let GraphData = DATA.slice(index, index + 10);
  const changeData = (type) => {
    if (type === "next") {
      setIndex(index + 10);
    } else {
      setIndex(index - 10);
    }
  };
  const fill = Colors.ORANGE;
  const chartTheme = {
    axis: {
      style: {
        tickLabels: {
          fill: Colors.GRAY,
          padding: 5,
        },
      },
    },
  };

  return (
    <View
      style={
        {
          // marginBottom: DATA?.length > 4 ? 0 : 20,
        }
      }
    >
      <Svg>
        <VictoryChart
          style={{
            parent: {},
          }}
          domainPadding={20}
          width={DEV_WIDTH}
          height={350}
          theme={chartTheme}
        >
          <VictoryAxis
            domain={[0, 30]}
            // label={props.yAxisLabel}
            crossAxis={false}
            tickFormat={(t) => t}
            dependentAxis
            style={{
              axis: { stroke: Colors.BACKGROUND },
              grid: {
                stroke: Colors.BACKGROUND,
              },

              axisLabel: {
                stroke: Colors.GRAY,
                fontSize: 12,
                fontFamily: POP_REGULAR,
              },
              tickLabels: {
                fill: Colors.GRAY,
                padding: 20,
                fontFamily: POP_REGULAR,
                fontSize: findSize(16),
              },
            }}
          />
          <VictoryAxis
            tickFormat={(t) => t}
            style={{
              axis: { stroke: Colors.BACKGROUND },

              grid: {
                stroke: Colors.VALHALLA,
                strokeWidth: 8,
                strokeLinecap: 10,
              },

              tickLabels: { fontSize: findSize(16) },
            }}
            tickLabelComponent={
              <VictoryLabel
                // angle={GraphData.length > 5 ? 45 : 0}
                // textAnchor={GraphData.length > 5 ? "start" : "middle"}
                // verticalAnchor={GraphData.length > 5 ? "middle" : "start"}
                angle={angle}
                textAnchor={angle == 0 ? "middle" : "start"}
                verticalAnchor={"middle"}
                style={{ fontSize: findSize(12), fill: Colors.GRAY }}
                backgroundPadding={{ top: 0 }}
              />
            }
          />
          <VictoryBar
            cornerRadius={{ top: 4, bottom: 4 }}
            style={{
              data: {
                fill: ({ datum }) => Colors.ORANGE,
                // fill: ({ datum }) => datum.color_bg ?? "#D82110",
                fillOpacity: 1,
                strokeWidth: 0,
              },
            }}
            data={GraphData}
            x={x}
            y={y}
            animate={true}
            barWidth={8}
          />
        </VictoryChart>
      </Svg>
    </View>
  );
};

export default BarGraph;

const styles = StyleSheet.create({});
