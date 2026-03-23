import { useFont } from "@shopify/react-native-skia";
import { Bar, CartesianChart } from "victory-native";
const inter = require("../../../roboto.ttf");

export default function BarChart({ rawMonthData }: { rawMonthData: { x: string; y: number }[] }) {
  const font = useFont(inter, 12);
  return (
    <CartesianChart 
        data={rawMonthData} 
        xKey="x" 
        yKeys={["y"]}
        domainPadding={rawMonthData.length < 10
         ? { left: 40, right: 40 }
         : { left: 8, right: 8 }
        }
        domain={{ y: [0] }}
        axisOptions={{
            font,
            tickCount: {
              y: 3,
              x: rawMonthData.length < 10 ? rawMonthData.length : 5,
            },
            formatXLabel: (value) => {
              return value
            },
            lineColor: "#71717a",
            labelColor: "black",
          }}
    >
      {({ points, chartBounds }) => (
        //👇 pass a PointsArray to the Bar component, as well as options.
        <Bar
          points={points.y}
          innerPadding={0.3}
          chartBounds={chartBounds}
          color="rgb(115,141,17)"
          roundedCorners={{ topLeft: 2, topRight: 2 }}
        />
      )}
    </CartesianChart>
  );
}