import { Pie, PieChart, Sector } from "recharts";

// this code comes from the Recharts library examples for pie charts
const RADIAN = Math.PI / 180;

// color for each pie sector
const COLORS = ["#252422", "#ccc5b9", "#5fa8d3","#adb5bd"];

// makes a label for each pie sector
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }

  // centers the label
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;

  const ncx = Number(cx);
  const ncy = Number(cy);
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  // aligns the label to the pie sector direction
  const angle = midAngle > 90 && midAngle < 270 ? midAngle + 180 : midAngle;

  // helps show label inline when sector is small
  const percentage = ((percent ?? 1) * 100).toFixed(0);
  const isSmallSector = Number(percentage) < 10;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="middle"
      transform={`rotate(${-angle}, ${x}, ${y})`}
      style={{ fontSize: "0.7rem", textShadow:"1px 0px 4px black" }}
    >
      {isSmallSector ? (
        <tspan x={x}>
          {name} {percentage}%
        </tspan>
      ) : (
        <>
          <tspan x={x}>{name}</tspan>
          <tspan x={x} dy="1.2rem">
            {percentage}%
          </tspan>
        </>
      )}
    </text>
  );
};

// creates a pie sector
const MyCustomPie = (props) => {
  return <Sector {...props} fill={COLORS[props.index % COLORS.length]} />;
};

// a chart containing multiple pie sectors
// data is an array of objects, each containing at least a value key (e.g. value: 4)
const LabeledPieChart = ({ data, isAnimationActive = true, className="" }) => {
  return (
    <PieChart
      style={{
        width: "100%",
        maxHeight: "80vh",
        aspectRatio: 1,
      }}
      className={className}
      responsive
    >
      <Pie
        data={data}
        labelLine={false}
        label={renderCustomizedLabel}
        fill="#8884d8"
        dataKey="value"
        isAnimationActive={isAnimationActive}
        shape={MyCustomPie}
      />
    </PieChart>
  );
};

export default LabeledPieChart;
